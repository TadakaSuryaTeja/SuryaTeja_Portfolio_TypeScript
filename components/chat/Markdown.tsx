import { Fragment, type ReactNode } from 'react';

/**
 * A small, safe Markdown renderer for streamed answers.
 *
 * Two properties matter more than completeness here.
 *
 * SAFETY: this builds React elements and never touches
 * `dangerouslySetInnerHTML`. Model output is untrusted by construction — it is
 * generated from retrieved text that anyone could in principle influence — so
 * the renderer is structurally incapable of injecting markup. Link hrefs are
 * additionally allow-listed to http(s) and site-relative paths, which is what
 * stops a `javascript:` URL from ever reaching the DOM.
 *
 * SIZE: a full CommonMark pipeline is 40-100 KB, which would dwarf the entire
 * chat panel, to render answers that only ever use emphasis, inline code,
 * short lists and the occasional fenced block. This covers exactly that, and
 * degrades to plain text for anything it does not know.
 *
 * Incomplete syntax is expected, not exceptional: mid-stream, a `**bold` has
 * no closing marker yet. Every rule requires a closing delimiter, so partial
 * markup renders as literal text and resolves itself as the rest arrives.
 */

type MarkdownProps = {
  content: string;
  /** Renders `[1]` as a chip that scrolls to the matching source. */
  onCitationClick?: (index: number) => void;
};

const SAFE_HREF = /^(https?:\/\/|\/|mailto:|#)/i;

/* ------------------------------ inline parsing ---------------------------- */

/**
 * Ordered by precedence. Code comes first so `**` inside backticks stays
 * literal, which is the behaviour every Markdown implementation agrees on.
 */
const INLINE_RULES: {
  pattern: RegExp;
  render: (match: RegExpExecArray, key: string, props: MarkdownProps) => ReactNode;
}[] = [
  {
    pattern: /`([^`\n]+)`/,
    render: (match, key) => (
      <code key={key} className="rounded bg-fill-3 px-1 py-0.5 font-mono text-[0.85em] text-ink">
        {match[1]}
      </code>
    ),
  },
  {
    pattern: /\[(\d{1,2})\]/,
    render: (match, key, props) => {
      const index = Number(match[1]);
      return (
        <button
          key={key}
          type="button"
          onClick={() => props.onCitationClick?.(index)}
          className="mx-0.5 rounded bg-accent/15 px-1 align-baseline text-[0.75em] font-semibold text-accent transition-colors hover:bg-accent/25"
          aria-label={`Jump to source ${index}`}
        >
          {index}
        </button>
      );
    },
  },
  {
    pattern: /\*\*([^*\n]+)\*\*/,
    render: (match, key) => (
      <strong key={key} className="font-semibold text-ink">
        {match[1]}
      </strong>
    ),
  },
  {
    pattern: /(?<![*\w])\*([^*\n]+)\*(?!\w)/,
    render: (match, key) => <em key={key}>{match[1]}</em>,
  },
  {
    pattern: /\[([^\]\n]+)\]\(([^)\s]+)\)/,
    render: (match, key) => {
      const [, label, href] = match;
      // An unrecognised scheme renders as text — never as a live link.
      if (!SAFE_HREF.test(href)) return <Fragment key={key}>{match[0]}</Fragment>;
      const external = /^https?:/i.test(href);
      return (
        <a
          key={key}
          href={href}
          className="underline decoration-accent/40 underline-offset-2 hover:text-ink"
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      );
    },
  },
];

function renderInline(text: string, keyPrefix: string, props: MarkdownProps): ReactNode[] {
  const nodes: ReactNode[] = [];
  let rest = text;
  let cursor = 0;

  while (rest) {
    let earliest: {
      index: number;
      match: RegExpExecArray;
      rule: (typeof INLINE_RULES)[number];
    } | null = null;

    for (const rule of INLINE_RULES) {
      const match = rule.pattern.exec(rest);
      if (match && (earliest === null || match.index < earliest.index)) {
        earliest = { index: match.index, match, rule };
      }
    }

    if (!earliest) {
      nodes.push(rest);
      break;
    }

    if (earliest.index > 0) nodes.push(rest.slice(0, earliest.index));
    nodes.push(earliest.rule.render(earliest.match, `${keyPrefix}-${cursor}`, props));
    rest = rest.slice(earliest.index + earliest.match[0].length);
    cursor += 1;
  }

  return nodes;
}

/* ------------------------------ block parsing ----------------------------- */

export default function Markdown({ content, onCitationClick }: MarkdownProps) {
  const props = { content, onCitationClick };
  const blocks: ReactNode[] = [];
  const lines = content.split('\n');

  let index = 0;
  let key = 0;

  while (index < lines.length) {
    const line = lines[index];

    // Fenced code. An unterminated fence mid-stream still renders as a block,
    // which is better than showing the raw ``` while tokens arrive.
    if (line.trimStart().startsWith('```')) {
      const body: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trimStart().startsWith('```')) {
        body.push(lines[index]);
        index += 1;
      }
      index += 1;

      blocks.push(
        <pre
          key={`c${key++}`}
          className="overflow-x-auto rounded-xl border border-line bg-fill-1 p-3 text-xs leading-relaxed"
        >
          <code className="font-mono text-ink-muted">{body.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Bulleted and numbered lists.
    const bullet = /^\s*[-*]\s+(.*)$/.exec(line);
    const numbered = /^\s*\d+\.\s+(.*)$/.exec(line);

    if (bullet || numbered) {
      const ordered = Boolean(numbered);
      const items: string[] = [];

      while (index < lines.length) {
        const current = lines[index];
        const match = ordered
          ? /^\s*\d+\.\s+(.*)$/.exec(current)
          : /^\s*[-*]\s+(.*)$/.exec(current);
        if (!match) break;
        items.push(match[1]);
        index += 1;
      }

      const ListTag = ordered ? 'ol' : 'ul';
      blocks.push(
        <ListTag
          key={`l${key++}`}
          className={`ml-4 space-y-1 ${ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {items.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInline(item, `l${key}-${i}`, props)}
            </li>
          ))}
        </ListTag>,
      );
      continue;
    }

    if (!line.trim()) {
      index += 1;
      continue;
    }

    // Paragraph: consume until a blank line or the start of another block.
    const paragraph: string[] = [];
    while (index < lines.length) {
      const current = lines[index];
      if (
        !current.trim() ||
        current.trimStart().startsWith('```') ||
        /^\s*[-*]\s+/.test(current) ||
        /^\s*\d+\.\s+/.test(current)
      ) {
        break;
      }
      paragraph.push(current);
      index += 1;
    }

    blocks.push(
      <p key={`p${key++}`} className="leading-relaxed">
        {renderInline(paragraph.join(' '), `p${key}`, props)}
      </p>,
    );
  }

  return <div className="space-y-2.5 text-sm text-ink-muted">{blocks}</div>;
}
