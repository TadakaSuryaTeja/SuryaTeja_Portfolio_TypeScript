import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/Icon';
import { profile } from '@/portfolio';
import { trackEvent } from '@/lib/analytics';
import Markdown from './Markdown';
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

/** Distance from the bottom within which the view still counts as "following". */
const FOLLOW_THRESHOLD_PX = 80;

type ChatPanelProps = {
  onClose: () => void;
  /** The element focus returns to when the panel closes. */
  returnFocusTo?: HTMLElement | null;
};

export default function ChatPanel({ onClose, returnFocusTo }: ChatPanelProps) {
  const { messages, busy, ask, stop, clear, regenerate, canRegenerate } = useChatStream();
  const [draft, setDraft] = useState('');
  const [following, setFollowing] = useState(true);

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
        'a[href], button:not([disabled]), textarea, input, summary, [tabindex]:not([tabindex="-1"])'
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
    [onClose]
  );

  /* ------------------------------- autoscroll ------------------------------ */

  /**
   * Follow the stream only while the visitor is already at the bottom.
   * Yanking the view back down while someone is reading an earlier answer is
   * the single most irritating thing a chat UI can do.
   */
  const onScroll = useCallback(() => {
    const log = logRef.current;
    if (!log) return;
    const distance = log.scrollHeight - log.scrollTop - log.clientHeight;
    setFollowing(distance < FOLLOW_THRESHOLD_PX);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const log = logRef.current;
    if (!log) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    log.scrollTo({ top: log.scrollHeight, behavior: smooth && !reduced ? 'smooth' : 'auto' });
    setFollowing(true);
  }, []);

  useEffect(() => {
    if (following) scrollToBottom(false);
  }, [messages, following, scrollToBottom]);

  /* -------------------------------- sending -------------------------------- */

  const submit = (question: string) => {
    // Guarding on `busy` here is what makes a double-click or a fast double
    // Enter a no-op rather than two in-flight requests against one rate limit.
    if (!question.trim() || busy) return;
    trackEvent('ask_portfolio_question');
    void ask(question);
    setDraft('');
    setFollowing(true);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit(draft);
    }
  };

  /** Scrolls the matching source chip into view when a citation is clicked. */
  const focusCitation = useCallback((index: number) => {
    const chip = logRef.current?.querySelector<HTMLElement>(`[data-citation="${index}"]`);
    chip?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    chip?.focus();
  }, []);

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
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={logRef}
          onScroll={onScroll}
          className="h-full space-y-5 overflow-y-auto px-4 py-4"
        >
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
            messages.map((message, index) => (
              <Turn
                key={message.id}
                message={message}
                onCitationClick={focusCitation}
                onRetry={index === messages.length - 1 ? regenerate : undefined}
                canRetry={canRegenerate}
              />
            ))
          )}

          {/*
            Streamed text is announced politely and only once complete:
            `assertive`, or announcing every token, would interrupt a screen
            reader continuously for the length of the answer.
          */}
          <div aria-live="polite" aria-atomic="true" className="sr-only">
            {!busy && messages[messages.length - 1]?.role === 'assistant'
              ? messages[messages.length - 1].content
              : ''}
          </div>
        </div>

        {!following && !empty && (
          <button
            type="button"
            onClick={() => scrollToBottom()}
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1.5 text-xs font-medium text-ink-muted shadow-glass transition-colors hover:text-ink"
          >
            <Icon icon="ph:arrow-down-bold" className="text-xs" />
            Latest
          </button>
        )}
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
          Grounded in this site&rsquo;s content. For anything it can&rsquo;t answer,{' '}
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

type TurnProps = {
  message: ChatMessage;
  onCitationClick: (index: number) => void;
  onRetry?: () => void;
  canRetry: boolean;
};

function Turn({ message, onCitationClick, onRetry, canRetry }: TurnProps) {
  const [copied, setCopied] = useState(false);

  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-accent-strong px-3.5 py-2 text-sm text-white">
          {message.content}
        </p>
      </div>
    );
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the text is selectable either way */
    }
  };

  const settled = !message.streaming && !message.thinking;

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
        <div className="text-sm">
          <Markdown content={message.content} onCitationClick={onCitationClick} />
          {message.streaming && (
            <span
              className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-accent motion-safe:animate-pulse"
              aria-hidden
            />
          )}
        </div>
      )}

      {message.error && (
        <div className="rounded-xl border border-line bg-fill-2 px-3 py-2">
          <p className="text-xs text-ink-faint">{message.error}</p>
          {onRetry && canRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1.5 text-xs font-medium text-accent hover:underline"
            >
              Try again
            </button>
          )}
        </div>
      )}

      {!!message.sources?.length && (
        <ul className="flex flex-wrap gap-1.5" role="list">
          {message.sources.map((source, index) => (
            <li key={source.id}>
              <Link
                href={source.url}
                data-citation={index + 1}
                className="chip max-w-full gap-1 transition-colors hover:border-hair-strong hover:text-ink"
                title={`${source.title}${source.dateRange ? ` · ${source.dateRange}` : ''} — relevance ${source.score}`}
              >
                <span className="font-semibold text-accent">{index + 1}</span>
                <span className="truncate">{source.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {settled && message.content && (
        <div className="flex items-center gap-3 pt-0.5">
          <button
            type="button"
            onClick={copy}
            className="text-[11px] font-medium text-ink-faint transition-colors hover:text-ink-muted"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
          {onRetry && canRetry && !message.error && (
            <button
              type="button"
              onClick={onRetry}
              className="text-[11px] font-medium text-ink-faint transition-colors hover:text-ink-muted"
            >
              Regenerate
            </button>
          )}
          {message.meta && <EngineeringDetails meta={message.meta} />}
        </div>
      )}
    </div>
  );
}

/* --------------------------- technical transparency ------------------------ */

/**
 * Real per-request telemetry, opt-in behind a disclosure.
 *
 * Every number here is measured on the request that produced this answer —
 * none of it is illustrative. It exists because the interesting thing about
 * this feature is the pipeline behind it, and a recruiter who wants to see
 * that should not have to read the repository to find it.
 *
 * Deliberately excluded: the prompt, the system card, the model's reasoning,
 * and anything about the environment. Architectural transparency is the goal;
 * disclosing internals is not.
 */
function EngineeringDetails({ meta }: { meta: NonNullable<ChatMessage['meta']> }) {
  const rows: [string, string][] = [
    ['Request', meta.requestId],
    ['Retrieval', `${meta.retrievedCount} chunks in ${meta.retrievalMs} ms`],
    ...(meta.topScore !== null ? ([['Top score', `${meta.topScore} cosine`]] as [string, string][]) : []),
    ['Model', meta.cached ? 'cached — no model called' : (meta.model ?? 'none — sources only')],
    ...(meta.ttftMs !== null
      ? ([['Time to first token', `${meta.ttftMs} ms`]] as [string, string][])
      : []),
    ['Total', `${meta.totalMs} ms`],
    ['Tokens', `${meta.promptTokens} in · ${meta.completionTokens} out`],
    ...(meta.droppedSources || meta.droppedTurns
      ? ([
          ['Budget trim', `${meta.droppedSources} sources · ${meta.droppedTurns} turns`],
        ] as [string, string][])
      : []),
    ...(meta.indexVersion ? ([['Index', meta.indexVersion]] as [string, string][]) : []),
  ];

  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-[11px] font-medium text-ink-faint transition-colors hover:text-ink-muted">
        How this answer was built
      </summary>
      <dl className="mt-2 space-y-1 rounded-xl border border-line bg-fill-1 p-2.5 text-[11px]">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="shrink-0 text-ink-faint">{label}</dt>
            <dd className="truncate text-right font-mono text-ink-muted">{value}</dd>
          </div>
        ))}
      </dl>
    </details>
  );
}
