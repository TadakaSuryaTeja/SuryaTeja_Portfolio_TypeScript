import { useCallback, useEffect, useRef, useState } from 'react';

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

export type ChatSource = {
  id: string;
  title: string;
  url: string;
  section: string;
  dateRange?: string;
  score: number;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  /** True from send until the reveal buffer has fully drained. */
  streaming?: boolean;
  /** True while the provider has sent nothing yet — drives the wait state. */
  thinking?: boolean;
  error?: string;
};

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
              const payload = JSON.parse(line.slice(5).trim());

              if (event === 'token') {
                if (instant) {
                  patchLast((message) => ({
                    ...message,
                    content: message.content + payload.text,
                    thinking: false,
                  }));
                } else {
                  pendingRef.current += payload.text;
                  ensureDraining();
                }
              } else if (event === 'sources') {
                patchLast((message) => ({ ...message, sources: payload.sources }));
              } else if (event === 'error') {
                patchLast((message) => ({ ...message, error: payload.message }));
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
  }, [stopTimer]);

  return { messages, busy, ask, stop, clear };
}
