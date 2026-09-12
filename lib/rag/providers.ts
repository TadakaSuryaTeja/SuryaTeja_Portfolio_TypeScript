/**
 * The generation provider chain: Groq → Gemini → static message.
 *
 * Both providers have a free tier generous enough for portfolio traffic and
 * neither is load-bearing: the *answer* is already in the retrieved sources by
 * the time a provider is called, so a provider outage costs the visitor a
 * fluent summary, not the information. That is why the last link in the chain
 * is a fixed message plus the sources, and not an error.
 *
 * A missing key is not a failure mode to handle at request time — it is a
 * provider that simply is not in the chain, so the site builds and runs with
 * neither key set.
 */
import { RetryableError, isRetryableStatus, withRetry } from '@/lib/ai/retry';
import type { PromptMessages } from './prompt';

export type ProviderName = 'groq' | 'gemini';

/** Side-channel for facts the caller needs but the token stream cannot carry. */
export type ProviderHooks = {
  /** Called once per retried attempt, so telemetry can count them. */
  onRetry?: (attempt: number) => void;
};

export type Provider = {
  name: ProviderName;
  /** The concrete model id, recorded in telemetry so logs are diagnosable. */
  model: string;
  /** Yields answer text as it arrives. Throws to hand over to the next link. */
  stream(
    prompt: PromptMessages,
    signal: AbortSignal,
    hooks?: ProviderHooks,
  ): AsyncGenerator<string>;
};

/**
 * Model ids, overridable without a code change.
 *
 * Providers retire hosted models on their own schedule and a retired id fails
 * as a 404 at request time, not at build time — `gemini-2.0-flash` was already
 * gone when this was wired up. An env override means a retirement is a
 * dashboard edit and a redeploy rather than a patch release.
 */
const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash';

/** Bounded so a hung provider cannot hold an invocation open indefinitely. */
const PROVIDER_TIMEOUT_MS = 20_000;

/** Attempts per provider before falling over to the next one. */
const PROVIDER_ATTEMPTS = 3;

const GENERATION = {
  temperature: 0.2,
  /**
   * Sized for a reasoning model, not for the answer.
   *
   * Gemini 3.x Flash thinks before it answers and those thought tokens are
   * billed against this same cap — measured at 200-360 for questions this
   * size, and the budget cannot be set to zero. At 600 the thinking ate most
   * of the allowance and answers truncated mid-sentence. Answer *length* is
   * controlled by the system card ("two to five sentences"), so a high cap
   * costs nothing on either provider and simply stops clipping the reply.
   */
  maxTokens: 2048,
} as const;

/* ------------------------------ SSE line parsing -------------------------- */

/**
 * Both providers speak SSE but frame it differently, so the byte-level reading
 * is shared and only the per-event decoding differs.
 */
async function* sseEvents(response: Response, signal: AbortSignal): AsyncGenerator<string> {
  const body = response.body;
  if (!body) throw new Error('Provider returned no body.');

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (!signal.aborted) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // Events are newline-delimited; the tail may be a partial line.
      let newline = buffer.indexOf('\n');
      while (newline !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (line.startsWith('data:')) yield line.slice(5).trim();
        newline = buffer.indexOf('\n');
      }
    }
  } finally {
    reader.cancel().catch(() => {});
  }
}

/**
 * Issues the request with retries. Only the request is retried, never a
 * stream that has already begun: re-running a partially consumed stream would
 * duplicate text the visitor has already read.
 */
async function postJSONWithRetry(
  url: string,
  init: { headers: Record<string, string>; body: unknown },
  signal: AbortSignal,
  onRetry?: (attempt: number) => void,
): Promise<Response> {
  return withRetry(() => postJSON(url, init, signal), {
    attempts: PROVIDER_ATTEMPTS,
    signal,
    onRetry: ({ attempt }) => onRetry?.(attempt),
  });
}

async function postJSON(
  url: string,
  init: { headers: Record<string, string>; body: unknown },
  signal: AbortSignal,
): Promise<Response> {
  const timeout = new AbortController();
  const timer = setTimeout(() => timeout.abort(), PROVIDER_TIMEOUT_MS);
  const onAbort = () => timeout.abort();
  signal.addEventListener('abort', onAbort);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...init.headers },
      body: JSON.stringify(init.body),
      signal: timeout.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const message = `${response.status} ${response.statusText} ${detail.slice(0, 200)}`;

      // A transient status is worth waiting out on this provider; a 4xx that
      // is not 429 is a bug or a bad key and will fail identically forever.
      if (isRetryableStatus(response.status)) {
        const advised = Number(response.headers.get('retry-after'));
        throw new RetryableError(
          message,
          response.status,
          Number.isFinite(advised) && advised > 0 ? advised : undefined,
        );
      }

      throw new Error(message);
    }

    return response;
  } finally {
    clearTimeout(timer);
    signal.removeEventListener('abort', onAbort);
  }
}

/* --------------------------------- providers ------------------------------ */

function groqProvider(apiKey: string): Provider {
  return {
    name: 'groq',
    model: GROQ_MODEL,
    async *stream(prompt, signal, hooks) {
      const response = await postJSONWithRetry(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          headers: { authorization: `Bearer ${apiKey}` },
          body: {
            model: GROQ_MODEL,
            stream: true,
            temperature: GENERATION.temperature,
            max_tokens: GENERATION.maxTokens,
            messages: [
              { role: 'system', content: prompt.system },
              { role: 'user', content: prompt.user },
            ],
          },
        },
        signal,
        hooks?.onRetry,
      );

      for await (const data of sseEvents(response, signal)) {
        if (data === '[DONE]') return;
        try {
          const token = JSON.parse(data)?.choices?.[0]?.delta?.content;
          if (typeof token === 'string' && token) yield token;
        } catch {
          // A malformed frame mid-stream is not worth losing the answer over.
        }
      }
    },
  };
}

function geminiProvider(apiKey: string): Provider {
  return {
    name: 'gemini',
    model: GEMINI_MODEL,
    async *stream(prompt, signal, hooks) {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent` +
        `?alt=sse&key=${encodeURIComponent(apiKey)}`;

      const response = await postJSONWithRetry(
        url,
        {
          headers: {},
          body: {
            systemInstruction: { parts: [{ text: prompt.system }] },
            contents: [{ role: 'user', parts: [{ text: prompt.user }] }],
            generationConfig: {
              temperature: GENERATION.temperature,
              maxOutputTokens: GENERATION.maxTokens,
            },
          },
        },
        signal,
        hooks?.onRetry,
      );

      for await (const data of sseEvents(response, signal)) {
        try {
          const parts = JSON.parse(data)?.candidates?.[0]?.content?.parts ?? [];
          for (const part of parts) {
            if (typeof part?.text === 'string' && part.text) yield part.text;
          }
        } catch {
          // Same as above: skip the frame, keep the stream.
        }
      }
    },
  };
}

/**
 * The chain, in preference order, skipping providers with no key configured.
 * Groq leads on latency; Gemini is the failover because its free tier has an
 * independent quota, so exhausting one does not exhaust the other.
 */
export function providerChain(env: Record<string, string | undefined>): Provider[] {
  const chain: Provider[] = [];
  if (env.GROQ_API_KEY) chain.push(groqProvider(env.GROQ_API_KEY));
  if (env.GEMINI_API_KEY) chain.push(geminiProvider(env.GEMINI_API_KEY));
  return chain;
}

export type GenerationOutcome = {
  /** The provider that produced tokens, or null if the chain was exhausted. */
  provider: ProviderName | null;
  model: string | null;
  /** True when the answer came from anything other than the first provider. */
  fallbackUsed: boolean;
  retriesUsed: number;
};

/**
 * Runs the chain, yielding tokens from the first provider that produces any.
 *
 * Failover only applies *before* the first token: once text has reached the
 * visitor, restarting on another provider would splice two different answers
 * together mid-sentence, which is worse than a truncated one.
 */
export async function* generate(
  chain: Provider[],
  prompt: PromptMessages,
  signal: AbortSignal,
  onOutcome?: (outcome: GenerationOutcome) => void,
): AsyncGenerator<string> {
  let retriesUsed = 0;
  const hooks = {
    onRetry: (attempt: number) => {
      retriesUsed = Math.max(retriesUsed, attempt);
    },
  };

  for (const [position, provider] of chain.entries()) {
    let started = false;

    try {
      for await (const token of provider.stream(prompt, signal, hooks)) {
        if (!started) {
          started = true;
          onOutcome?.({
            provider: provider.name,
            model: provider.model,
            fallbackUsed: position > 0,
            retriesUsed,
          });
        }
        yield token;
      }
      if (started) return;
    } catch (error) {
      // Once text has reached the visitor there is no going back: restarting
      // on another provider would splice two different answers together.
      if (started) return;
      console.warn(`[chat] provider "${provider.name}" exhausted, trying next:`, error);
    }
  }

  onOutcome?.({ provider: null, model: null, fallbackUsed: chain.length > 0, retriesUsed });
}
