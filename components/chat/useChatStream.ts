import { useCallback, useEffect, useRef, useState } from 'react';
import { decodeEvent, type ChatMeta, type ChatSourceMeta } from '@/lib/ai/contracts';

/**
 * The browser half of the chat protocol.
 *
 * Kept apart from the panel so the rendering stays declarative: the hook owns
 * the request, the SSE framing, the reveal cadence and the abort, and the
 * panel only ever reads messages. `fetch` + a reader is used rather than
 * `EventSource` because the question goes in a POST body, which `EventSource`
 * cannot send.
 *
 * WHY THE REVEAL BUFFER — a provider's SSE frames are not typewriter-sized.
 * Measured against Gemini 3.6 Flash, a whole answer arrives as three chunks
 * inside 46 ms after a ~3.8 s silent thinking phase: paint those directly and
 * the visitor sees a long dead pause and then a wall of text appearing at
 * once, which reads as a broken request rather than a live answer. So tokens
 * land in a buffer and drain at a readable rate. Nothing is fabricated — this
 * only paces text that has already arrived, and the buffer always drains
 * completely before the turn is marked finished.
 */

export type ChatSource = ChatSourceMeta;

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  /** Real per-request telemetry, shown in the "How this works" panel. */
  meta?: ChatMeta;
  /** True from send until the reveal buffer has fully drained. */
  streaming?: boolean;
  /** True while the provider has sent nothing yet — drives the wait state. */
  thinking?: boolean;
  error?: string;
};

/**
 * Transcripts survive a refresh but never outlive the tab.
 *
 * `sessionStorage`, not `localStorage`: a recruiter's questions are their
 * business, and a chat about someone's career should not still be sitting in
 * a shared browser tomorrow. There is no server-side persistence at all —
 * nothing about a conversation ever leaves the visitor's machine except the
 * question itself, which is exactly the property that makes this endpoint
 * safe to run unauthenticated.
 */
const STORAGE_KEY = 'ask-portfolio:transcript';
const MAX_PERSISTED = 40;

function loadTranscript(): ChatMessage[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return (
      parsed
        .filter(
          (m): m is ChatMessage =>
            !!m &&
            typeof m === 'object' &&
            typeof (m as ChatMessage).content === 'string' &&
            ((m as ChatMessage).role === 'user' || (m as ChatMessage).role === 'assistant'),
        )
        // A transcript saved mid-stream must not restore as permanently pending.
        .map((m) => ({ ...m, streaming: false, thinking: false }))
    );
  } catch {
    return [];
  }
}

function saveTranscript(messages: ChatMessage[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_PERSISTED)));
  } catch {
    /* private mode, or quota exhausted — the chat still works without it */
  }
}

const ENDPOINT = '/api/chat';

/** Turns sent back as history. The server clamps this again server-side. */
const HISTORY_TURNS = 4;

/** Roughly one animation frame between reveals. */
const REVEAL_INTERVAL_MS = 16;

/**
 * Characters per tick: proportional to the backlog so a long answer never
 * crawls, clamped so a short one still reads as typing rather than a paste.
 */
const REVEAL_MIN_CHARS = 2;
const REVEAL_MAX_CHARS = 8;
const REVEAL_DIVISOR = 12;

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);

  /** Restored after mount so the server and first client render agree. */
  useEffect(() => {
    const restored = loadTranscript();
    if (restored.length) setMessages(restored);
  }, []);

  useEffect(() => {
    if (messages.length) saveTranscript(messages);
  }, [messages]);

  const abortRef = useRef<AbortController | null>(null);
  /** Text received from the server but not yet revealed. */
  const pendingRef = useRef('');
  /** The server stream has ended; the turn finishes once the buffer empties. */
  const endedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const patchLast = useCallback((patch: (message: ChatMessage) => ChatMessage) => {
    setMessages((current) => {
      if (!current.length) return current;
      const next = [...current];
      next[next.length - 1] = patch(next[next.length - 1]);
      return next;
    });
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  /** Ends the turn, revealing anything still buffered. */
  const finish = useCallback(() => {
    stopTimer();
    const remaining = pendingRef.current;
    pendingRef.current = '';
    patchLast((message) => ({
      ...message,
      content: message.content + remaining,
      streaming: false,
      thinking: false,
    }));
    setBusy(false);
  }, [patchLast, stopTimer]);

  /**
   * Someone who has asked for reduced motion has asked not to be shown
   * animated text either — they get each chunk the moment it lands.
   */
  const prefersInstant = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ensureDraining = useCallback(() => {
    if (timerRef.current) return;

    timerRef.current = setInterval(() => {
      const pending = pendingRef.current;

      if (!pending) {
        if (endedRef.current) finish();
        return;
      }

      const size = Math.min(
        REVEAL_MAX_CHARS,
        Math.max(REVEAL_MIN_CHARS, Math.ceil(pending.length / REVEAL_DIVISOR)),
      );
      pendingRef.current = pending.slice(size);

      patchLast((message) => ({
        ...message,
        content: message.content + pending.slice(0, size),
        thinking: false,
      }));
    }, REVEAL_INTERVAL_MS);
  }, [finish, patchLast]);

  /** Never leave an interval running behind an unmounted panel. */
  useEffect(() => () => stopTimer(), [stopTimer]);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    endedRef.current = true;
    finish();
  }, [finish]);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || busy) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      stopTimer();
      pendingRef.current = '';
      endedRef.current = false;
      setBusy(true);

      const instant = prefersInstant();

      // Snapshot before the optimistic append so history excludes this turn.
      let history: { role: 'user' | 'assistant'; content: string }[] = [];
      setMessages((current) => {
        history = current
          .filter((m) => !m.error)
          .slice(-HISTORY_TURNS)
          .map((m) => ({ role: m.role, content: m.content }));

        return [
          ...current,
          { id: `u-${Date.now()}`, role: 'user', content: trimmed },
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            content: '',
            streaming: true,
            thinking: true,
          },
        ];
      });

      try {
        const response = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ question: trimmed, history }),
          signal: controller.signal,
        });

        if (!response.ok || !response.body) {
          const detail = await response.json().catch(() => null);
          throw new Error(detail?.error ?? 'That question could not be answered right now.');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let event = 'message';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          let newline = buffer.indexOf('\n');
          while (newline !== -1) {
            const line = buffer.slice(0, newline).trimEnd();
            buffer = buffer.slice(newline + 1);

            if (line.startsWith('event:')) {
              event = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              // Validated, not cast: a stream is untrusted input like any
              // other, and a malformed frame decodes to null and is skipped
              // rather than corrupting the transcript.
              const decoded = decodeEvent(event, line.slice(5).trim());
              if (!decoded) {
                newline = buffer.indexOf('\n');
                continue;
              }

              if (decoded.type === 'token') {
                if (instant) {
                  patchLast((message) => ({
                    ...message,
                    content: message.content + decoded.text,
                    thinking: false,
                  }));
                } else {
                  pendingRef.current += decoded.text;
                  ensureDraining();
                }
              } else if (decoded.type === 'sources') {
                patchLast((message) => ({ ...message, sources: decoded.sources }));
              } else if (decoded.type === 'meta') {
                patchLast((message) => ({ ...message, meta: decoded.meta }));
              } else if (decoded.type === 'error') {
                patchLast((message) => ({ ...message, error: decoded.message }));
              }
            }

            newline = buffer.indexOf('\n');
          }
        }

        endedRef.current = true;
        // Let the buffer drain on its own; with nothing pending, finish now.
        if (instant || !pendingRef.current) finish();
        else ensureDraining();
      } catch (error) {
        if (controller.signal.aborted) return;
        endedRef.current = true;
        stopTimer();
        pendingRef.current = '';
        patchLast((message) => ({
          ...message,
          streaming: false,
          thinking: false,
          error: error instanceof Error ? error.message : 'Something went wrong.',
        }));
        setBusy(false);
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
      }
    },
    [busy, ensureDraining, finish, patchLast, stopTimer],
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    stopTimer();
    pendingRef.current = '';
    endedRef.current = false;
    setBusy(false);
    setMessages([]);
    try {
      window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nothing to clean up */
    }
  }, [stopTimer]);

  /**
   * Re-asks the last question, replacing the previous answer in place.
   *
   * Dropping the old pair before re-asking is what keeps regenerate from
   * growing the transcript: a retry that appends would leave the failed
   * attempt in the history, and that history is sent back as context on the
   * next turn — so the model would be told about an answer that was thrown
   * away.
   */
  const regenerate = useCallback(() => {
    if (busy) return;

    setMessages((current) => {
      const lastUser = [...current].reverse().find((m) => m.role === 'user');
      if (!lastUser) return current;

      // Trim back to just before that question, then re-ask it.
      const index = current.lastIndexOf(lastUser);
      queueMicrotask(() => void ask(lastUser.content));
      return current.slice(0, index);
    });
  }, [ask, busy]);

  /** True when there is a question worth re-running. */
  const canRegenerate = !busy && messages.some((m) => m.role === 'user');

  return { messages, busy, ask, stop, clear, regenerate, canRegenerate };
}
