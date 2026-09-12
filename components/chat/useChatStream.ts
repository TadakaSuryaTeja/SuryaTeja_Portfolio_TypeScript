import { useCallback, useRef, useState } from 'react';

/**
 * The browser half of the chat protocol.
 *
 * Kept apart from the panel so the rendering stays declarative: the hook owns
 * the request, the SSE framing and the abort, and the panel only ever reads
 * messages. `fetch` + a reader is used rather than `EventSource` because the
 * question goes in a POST body, which `EventSource` cannot send.
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
  /** True while tokens are still arriving, so the panel can show a caret. */
  streaming?: boolean;
  error?: string;
};

const ENDPOINT = '/api/chat';

/** Turns sent back as history. The server clamps this again server-side. */
const HISTORY_TURNS = 4;

export function useChatStream() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const patchLast = useCallback((patch: (message: ChatMessage) => ChatMessage) => {
    setMessages((current) => {
      if (!current.length) return current;
      const next = [...current];
      next[next.length - 1] = patch(next[next.length - 1]);
      return next;
    });
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    patchLast((message) => ({ ...message, streaming: false }));
  }, [patchLast]);

  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || busy) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setBusy(true);

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
                patchLast((message) => ({
                  ...message,
                  content: message.content + payload.text,
                }));
              } else if (event === 'sources') {
                patchLast((message) => ({
                  ...message,
                  sources: payload.sources,
                }));
              } else if (event === 'error') {
                patchLast((message) => ({
                  ...message,
                  error: payload.message,
                }));
              }
            }

            newline = buffer.indexOf('\n');
          }
        }

        patchLast((message) => ({ ...message, streaming: false }));
      } catch (error) {
        if (controller.signal.aborted) return;
        patchLast((message) => ({
          ...message,
          streaming: false,
          error: error instanceof Error ? error.message : 'Something went wrong.',
        }));
      } finally {
        if (abortRef.current === controller) abortRef.current = null;
        setBusy(false);
      }
    },
    [busy, patchLast],
  );

  const clear = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setBusy(false);
    setMessages([]);
  }, []);

  return { messages, busy, ask, stop, clear };
}
