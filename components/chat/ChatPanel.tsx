import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { profile } from '@/portfolio';
import { trackEvent } from '@/lib/analytics';
import { useChatStream, type ChatMessage } from './useChatStream';

/**
 * The chat surface. Loaded only once the visitor opens it, so none of this —
 * or the streaming client behind it — is on the initial hydration path.
 *
 * Everything a recruiter can be told here comes from the retrieval index, and
 * every answer carries the chips that link back to where on the site the claim
 * lives. The chips are not decoration: they are how a claim gets checked.
 */

/** Openers that demonstrate the corpus rather than testing its edges. */
const STARTERS = [
  "What's his experience with agentic systems?",
  'Has he shipped RAG in production?',
  'Walk me through his AWS work.',
];

type ChatPanelProps = {
  onClose: () => void;
  /** The element focus returns to when the panel closes. */
  returnFocusTo?: HTMLElement | null;
};

export default function ChatPanel({ onClose, returnFocusTo }: ChatPanelProps) {
  const { messages, busy, ask, stop, clear } = useChatStream();
  const [draft, setDraft] = useState('');

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  /* --------------------------- focus management --------------------------- */

  useEffect(() => {
    inputRef.current?.focus();
    return () => returnFocusTo?.focus();
  }, [returnFocusTo]);

  /**
   * Esc closes; Tab cycles within the panel. A dialog that leaks focus to the
   * page behind it strands keyboard and screen-reader users in content they
   * cannot see, so the trap is not optional polish.
   */
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  /* ------------------------------- autoscroll ------------------------------ */

  useEffect(() => {
    const log = logRef.current;
    if (!log) return;

    // `prefers-reduced-motion` covers involuntary movement too, not just
    // decorative animation — so the transcript jumps rather than glides.
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    log.scrollTo({
      top: log.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, [messages]);

  /* -------------------------------- sending -------------------------------- */

  const submit = (question: string) => {
    if (!question.trim() || busy) return;
    trackEvent('ask_portfolio_question');
    void ask(question);
    setDraft('');
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit(draft);
    }
  };

  const empty = messages.length === 0;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={onKeyDown}
      className="glass fixed inset-0 z-[90] flex flex-col overflow-hidden rounded-none border-line bg-surface sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[min(38rem,calc(100vh-8rem))] sm:w-[26rem] sm:rounded-3xl"
    >
      {/* ------------------------------- header ------------------------------ */}
      <header className="flex items-start gap-3 border-b border-line px-4 py-3.5">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet/10 text-violet">
          <Icon icon="ph:sparkle-bold" className="text-base" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={titleId} className="truncate text-sm font-semibold text-ink">
            Ask about {profile.name.split(' ')[0]}
          </h2>
          <p className="truncate text-xs text-ink-faint">
            Answers come only from this site, with sources
          </p>
        </div>
        {!empty && (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-fill-2 hover:text-ink"
            title="Clear conversation"
          >
            <Icon icon="ph:arrow-counter-clockwise-bold" className="text-sm" />
            <span className="sr-only">Clear conversation</span>
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg p-2 text-ink-faint transition-colors hover:bg-fill-2 hover:text-ink"
        >
          <Icon icon="ph:x-bold" className="text-sm" />
          <span className="sr-only">Close</span>
        </button>
      </header>

      {/* ----------------------------- transcript ---------------------------- */}
      <div ref={logRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {empty ? (
          <div className="pt-2">
            <p className="text-sm leading-relaxed text-ink-muted">
              I can answer from {profile.name}&rsquo;s roles and dates, the systems he&rsquo;s
              built, the technologies behind them, his certifications and his writing. If it
              isn&rsquo;t on this site, I&rsquo;ll say so rather than guess.
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-ink-faint">
              Try asking
            </p>
            <ul className="mt-3 space-y-2" role="list">
              {STARTERS.map((starter) => (
                <li key={starter}>
                  <button
                    type="button"
                    onClick={() => submit(starter)}
                    className="w-full rounded-xl border border-line bg-fill-2 px-3.5 py-2.5 text-left text-sm text-ink-muted transition-colors hover:border-hair-strong hover:bg-fill-3 hover:text-ink"
                  >
                    {starter}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          messages.map((message) => <Turn key={message.id} message={message} />)
        )}

        {/*
          Streamed text is announced politely: `assertive` would interrupt the
          visitor on every token, which is worse than announcing nothing.
        */}
        <div aria-live="polite" aria-atomic="false" className="sr-only">
          {messages[messages.length - 1]?.role === 'assistant' && !busy
            ? messages[messages.length - 1].content
            : ''}
        </div>
      </div>

      {/* ------------------------------ composer ----------------------------- */}
      <form
        className="border-t border-line px-3 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit(draft);
        }}
      >
        <div className="flex items-end gap-2 rounded-2xl border border-line bg-fill-2 px-3 py-2 focus-within:border-accent/50">
          <label htmlFor="ask-portfolio-input" className="sr-only">
            Ask a question about {profile.name}
          </label>
          <textarea
            id="ask-portfolio-input"
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={500}
            placeholder="Ask about his work…"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={onInputKeyDown}
            className="max-h-28 flex-1 resize-none bg-transparent py-1 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <button
            type={busy ? 'button' : 'submit'}
            onClick={busy ? stop : undefined}
            disabled={!busy && !draft.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-strong text-white transition-opacity disabled:opacity-40"
          >
            <Icon icon={busy ? 'ph:stop-bold' : 'ph:arrow-up-bold'} className="text-sm" />
            <span className="sr-only">{busy ? 'Stop generating' : 'Send question'}</span>
          </button>
        </div>
        <p className="mt-2 px-1 text-[11px] leading-relaxed text-ink-faint">
          Generated from this site&rsquo;s content. For anything it can&rsquo;t answer,{' '}
          <Link href="/#contact" onClick={onClose} className="underline hover:text-ink-muted">
            contact him directly
          </Link>
          .
        </p>
      </form>
    </div>
  );
}

/* ---------------------------------- a turn --------------------------------- */

function Turn({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] rounded-2xl rounded-br-md bg-accent-strong px-3.5 py-2 text-sm text-white">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {/*
        The provider can think for seconds before emitting a token. A bare
        caret on an empty line reads as a hung request, so the wait gets its
        own visible state.
      */}
      {message.thinking ? (
        <p className="flex items-center gap-2 text-sm text-ink-faint">
          <span className="flex gap-1" aria-hidden>
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-ink-faint motion-safe:animate-pulse"
                style={{ animationDelay: `${i * 160}ms` }}
              />
            ))}
          </span>
          Reading the sources…
        </p>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-muted">
          {message.content}
          {message.streaming && (
            <span
              className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent motion-safe:animate-pulse"
              aria-hidden
            />
          )}
        </p>
      )}

      {message.error && (
        <p className="rounded-xl border border-line bg-fill-2 px-3 py-2 text-xs text-ink-faint">
          {message.error}
        </p>
      )}

      {!!message.sources?.length && (
        <ul className="flex flex-wrap gap-1.5" role="list">
          {message.sources.map((source, index) => (
            <li key={source.id}>
              <Link
                href={source.url}
                className="chip max-w-full gap-1 transition-colors hover:border-hair-strong hover:text-ink"
                title={`${source.title}${source.dateRange ? ` · ${source.dateRange}` : ''}`}
              >
                <span className="font-semibold text-accent">[{index + 1}]</span>
                <span className="truncate">{source.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
