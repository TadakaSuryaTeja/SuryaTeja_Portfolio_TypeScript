import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';
import type {
  ArchitectureCategory,
  ArchitectureSpec,
  ArchitectureNode,
} from '@/types/systems';

/**
 * ArchitectureVisualizer — a reusable, data-driven system diagram.
 *
 * Takes an `ArchitectureSpec` (nodes + edges) and lays it out in rows, drawing
 * real connections between real DOM elements rather than hard-coding any one
 * system's shape. Selecting a node highlights its immediate connections and
 * explains why the component exists.
 *
 * Accessibility: every node is a real <button> in a roving-tabindex list, so
 * the whole diagram is keyboard-navigable with arrow keys, and the same
 * explanations appear as text. The SVG layer is decorative and hidden from
 * assistive technology; a plain-text description of every connection is
 * provided for screen readers.
 */

const CATEGORY: Record<
  ArchitectureCategory,
  { label: string; text: string; border: string; bg: string; stroke: string; dot: string }
> = {
  user: {
    label: 'User',
    text: 'text-ink',
    border: 'border-line',
    bg: 'bg-fill-2',
    stroke: 'stroke-ink-faint',
    dot: 'bg-ink-faint',
  },
  ai: {
    label: 'AI',
    text: 'text-violet',
    border: 'border-violet/35',
    bg: 'bg-violet/10',
    stroke: 'stroke-violet',
    dot: 'bg-violet',
  },
  backend: {
    label: 'Backend',
    text: 'text-success',
    border: 'border-success/35',
    bg: 'bg-success/10',
    stroke: 'stroke-success',
    dot: 'bg-success',
  },
  data: {
    label: 'Data',
    text: 'text-accent',
    border: 'border-accent/35',
    bg: 'bg-accent/10',
    stroke: 'stroke-accent',
    dot: 'bg-accent',
  },
  cloud: {
    label: 'Cloud',
    text: 'text-accent',
    border: 'border-accent/35',
    bg: 'bg-accent/10',
    stroke: 'stroke-accent',
    dot: 'bg-accent',
  },
  infra: {
    label: 'Infra',
    text: 'text-ink-muted',
    border: 'border-hair-strong',
    bg: 'bg-fill-3',
    stroke: 'stroke-ink-faint',
    dot: 'bg-ink-faint',
  },
};

type Line = { id: string; x1: number; y1: number; x2: number; y2: number; source: string; target: string; label?: string };

export default function ArchitectureVisualizer({
  spec,
  className = '',
}: {
  spec: ArchitectureSpec;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLButtonElement>());
  const [lines, setLines] = useState<Line[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const rows = useMemo(() => {
    const byRow = new Map<number, ArchitectureNode[]>();
    for (const node of spec.nodes) {
      const list = byRow.get(node.row) ?? [];
      list.push(node);
      byRow.set(node.row, list);
    }
    return [...byRow.entries()].sort((a, b) => a[0] - b[0]).map(([, nodes]) => nodes);
  }, [spec.nodes]);

  /** Measure real element centres so connections survive any reflow. */
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const base = wrap.getBoundingClientRect();
    const next: Line[] = [];

    for (const edge of spec.edges) {
      const a = nodeRefs.current.get(edge.source);
      const b = nodeRefs.current.get(edge.target);
      if (!a || !b) continue;
      const ra = a.getBoundingClientRect();
      const rb = b.getBoundingClientRect();
      next.push({
        id: `${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        label: edge.label,
        x1: ra.left - base.left + ra.width / 2,
        y1: ra.top - base.top + ra.height / 2,
        x2: rb.left - base.left + rb.width / 2,
        y2: rb.top - base.top + rb.height / 2,
      });
    }
    setLines(next);
  }, [spec.edges]);

  useEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    window.addEventListener('resize', measure);
    // Fonts landing late shifts node widths; re-measure once they do.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  const connected = useMemo(() => {
    if (!active) return null;
    const set = new Set<string>([active]);
    for (const edge of spec.edges) {
      if (edge.source === active) set.add(edge.target);
      if (edge.target === active) set.add(edge.source);
    }
    return set;
  }, [active, spec.edges]);

  const flatNodes = useMemo(() => rows.flat(), [rows]);
  const activeNode = active ? spec.nodes.find((n) => n.id === active) : null;

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const keys = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'];
      if (!keys.includes(e.key)) return;
      e.preventDefault();
      let next = focusIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (focusIndex + 1) % flatNodes.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (focusIndex - 1 + flatNodes.length) % flatNodes.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = flatNodes.length - 1;
      setFocusIndex(next);
      const node = flatNodes[next];
      setActive(node.id);
      nodeRefs.current.get(node.id)?.focus();
    },
    [flatNodes, focusIndex]
  );

  return (
    <div className={className}>
      <div
        ref={wrapRef}
        className="relative rounded-3xl border border-line bg-fill-1 p-5 sm:p-7"
        onPointerLeave={() => setActive(null)}
      >
        {/* Connection layer — decorative; the text equivalent is below. */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          {lines.map((line) => {
            const node = spec.nodes.find((n) => n.id === line.source);
            const cat = CATEGORY[node?.category ?? 'infra'];
            const isLive = connected ? line.source === active || line.target === active : false;
            const dimmed = Boolean(connected) && !isLive;
            const midX = (line.x1 + line.x2) / 2;
            const midY = (line.y1 + line.y2) / 2;
            return (
              <g key={line.id}>
                <path
                  d={`M ${line.x1} ${line.y1} C ${line.x1} ${midY}, ${line.x2} ${midY}, ${line.x2} ${line.y2}`}
                  fill="none"
                  strokeWidth={isLive ? 2.25 : 1.5}
                  strokeDasharray="4 4"
                  className={`${cat.stroke} arch-flow transition-opacity duration-300 ${
                    dimmed ? 'opacity-10' : isLive ? 'opacity-100' : 'opacity-50'
                  }`}
                />
                {line.label && isLive && (
                  <text
                    x={midX}
                    y={midY - 4}
                    textAnchor="middle"
                    className="fill-ink-muted text-[10px] font-medium"
                  >
                    {line.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Node layer */}
        <div
          className="relative flex flex-col gap-6 sm:gap-8"
          role="group"
          aria-label={`System architecture: ${spec.caption}`}
          onKeyDown={onKeyDown}
        >
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-4">
              {row.map((node) => {
                const cat = CATEGORY[node.category];
                const isActive = active === node.id;
                const dimmed = Boolean(connected) && !connected!.has(node.id);
                const index = flatNodes.findIndex((n) => n.id === node.id);
                return (
                  <button
                    key={node.id}
                    type="button"
                    ref={(el) => {
                      if (el) nodeRefs.current.set(node.id, el);
                      else nodeRefs.current.delete(node.id);
                    }}
                    tabIndex={index === focusIndex ? 0 : -1}
                    aria-pressed={isActive}
                    aria-describedby={node.description ? `arch-desc-${node.id}` : undefined}
                    onPointerEnter={() => setActive(node.id)}
                    onFocus={() => {
                      setActive(node.id);
                      setFocusIndex(index);
                    }}
                    onClick={() => setActive(isActive ? null : node.id)}
                    className={`relative z-10 inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-300 ${cat.border} ${cat.bg} ${cat.text} ${
                      dimmed ? 'opacity-30' : 'opacity-100'
                    } ${isActive ? 'scale-105 shadow-glass' : 'hover:-translate-y-0.5'}`}
                  >
                    {node.icon && <Icon icon={node.icon} className="text-sm" aria-hidden />}
                    {node.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Explanation panel — the point of the interaction. */}
      <div className="mt-3 min-h-[4.5rem] rounded-2xl border border-line bg-fill-2 p-4">
        {activeNode ? (
          <div>
            <div className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${CATEGORY[activeNode.category].dot}`} />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {CATEGORY[activeNode.category].label}
              </span>
              <span className="text-sm font-semibold text-ink">{activeNode.label}</span>
            </div>
            <p
              id={`arch-desc-${activeNode.id}`}
              className="mt-2 text-sm leading-relaxed text-ink-muted"
            >
              {activeNode.description}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-ink-muted">
            {spec.caption}{' '}
            <span className="text-ink-faint">
              Select a component — or use arrow keys — to see what it does and why it&rsquo;s there.
            </span>
          </p>
        )}
      </div>

      {/* Text equivalent of the connection graph, for assistive technology. */}
      <ul className="sr-only">
        {spec.edges.map((e) => {
          const s = spec.nodes.find((n) => n.id === e.source)?.label ?? e.source;
          const t = spec.nodes.find((n) => n.id === e.target)?.label ?? e.target;
          return (
            <li key={`${e.source}-${e.target}`}>
              {s} connects to {t}
              {e.label ? ` (${e.label})` : ''}.
            </li>
          );
        })}
      </ul>
    </div>
  );
}
