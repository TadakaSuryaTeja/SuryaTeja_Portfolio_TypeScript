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
import type { PromptMessages } from './prompt';

export type ProviderName = 'groq' | 'gemini';

export type Provider = {
  name: ProviderName;
  /** Yields answer text as it arrives. Throws to hand over to the next link. */
  stream(prompt: PromptMessages, signal: AbortSignal): AsyncGenerator<string>;
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
      throw new Error(`${response.status} ${response.statusText} ${detail.slice(0, 200)}`);
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
    async *stream(prompt, signal) {
      const response = await postJSON(
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
    async *stream(prompt, signal) {
      const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent` +
        `?alt=sse&key=${encodeURIComponent(apiKey)}`;

      const response = await postJSON(
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

export type GenerationResult = {
  /** The provider that produced tokens, or null if the chain was exhausted. */
  provider: ProviderName | null;
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
  onProvider?: (provider: ProviderName | null) => void,
): AsyncGenerator<string> {
  for (const provider of chain) {
    let started = false;

    try {
      for await (const token of provider.stream(prompt, signal)) {
        if (!started) {
          started = true;
          onProvider?.(provider.name);
        }
        yield token;
      }
      if (started) return;
    } catch (error) {
      if (started) return;
      console.warn(`[chat] provider "${provider.name}" failed, trying next:`, error);
    }
  }

  onProvider?.(null);
}
