import { useEffect, useRef, useState } from 'react';
import { Icon } from '@/components/ui/Icon';

type Node = {
  id: string;
  label: string;
  icon: string;
  /** Position in percent of the container box. */
  x: number;
  y: number;
  accent: 'accent' | 'violet' | 'success';
};

/**
 * The layers a production AI system is actually made of, arranged around the
 * orchestration core they all connect through.
 */
const NODES: Node[] = [
  { id: 'llm', label: 'LLMs', icon: 'ph:brain-bold', x: 50, y: 8, accent: 'violet' },
  { id: 'agents', label: 'Agents', icon: 'ph:circles-three-bold', x: 85, y: 24, accent: 'violet' },
  { id: 'mcp', label: 'MCP', icon: 'ph:plugs-connected-bold', x: 92, y: 58, accent: 'accent' },
  { id: 'rag', label: 'RAG', icon: 'ph:magnifying-glass-bold', x: 74, y: 88, accent: 'success' },
  { id: 'data', label: 'Data', icon: 'ph:database-bold', x: 32, y: 92, accent: 'accent' },
  { id: 'apis', label: 'APIs', icon: 'ph:stack-bold', x: 8, y: 64, accent: 'success' },
  { id: 'aws', label: 'AWS', icon: 'ph:cloud-bold', x: 12, y: 28, accent: 'accent' },
  { id: 'infra', label: 'Infra', icon: 'ph:gear-six-bold', x: 28, y: 12, accent: 'violet' },
];

const ACCENT_TEXT = {
  accent: 'text-accent',
  violet: 'text-violet',
  success: 'text-success',
} as const;

const ACCENT_STROKE = {
  accent: 'stroke-accent',
  violet: 'stroke-violet',
  success: 'stroke-success',
} as const;

const CENTER = { x: 50, y: 50 };

/**
 * Interactive system diagram for the hero: a central orchestration core wired
 * to the layers around it. The whole group drifts very slightly toward the
 * pointer — enough to feel alive, not enough to distract from the copy.
 *
 * Pointer tracking is disabled entirely under `prefers-reduced-motion` and on
 * coarse pointers, where the diagram renders as a static, fully legible SVG.
 */
export default function SystemNetwork() {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (reduced || coarse) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
        const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
        // Clamped to a few percent — a drift, not a swing.
        setTilt({ x: Math.max(-1, Math.min(1, dx)) * 2.5, y: Math.max(-1, Math.min(1, dy)) * 2.5 });
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-square w-full"
      role="img"
      aria-label="Diagram of a production AI system: an orchestration core connected to LLMs, agents, MCP tool servers, RAG retrieval, data, APIs, AWS and infrastructure."
    >
      <div className="grid-bg absolute inset-0 rounded-[1.5rem] opacity-40" aria-hidden />

      <div
        className="absolute inset-0 transition-transform duration-500 ease-out motion-reduce:!transform-none"
        style={{ transform: `translate3d(${tilt.x}%, ${tilt.y}%, 0)` }}
      >
        {/* Connections */}
        <svg
          className="absolute inset-0 h-full w-full overflow-visible"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          {NODES.map((n) => {
            const dim = hovered !== null && hovered !== n.id;
            return (
              <line
                key={n.id}
                x1={CENTER.x}
                y1={CENTER.y}
                x2={n.x}
                y2={n.y}
                vectorEffect="non-scaling-stroke"
                strokeWidth={hovered === n.id ? 1.6 : 1}
                strokeDasharray="3 3"
                className={`${ACCENT_STROKE[n.accent]} net-link transition-all duration-300 ${
                  dim ? 'opacity-15' : hovered === n.id ? 'opacity-90' : 'opacity-40'
                }`}
              />
            );
          })}
        </svg>

        {/* Orchestration core */}
        <div
          className="absolute left-1/2 top-1/2 flex h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-gradient-to-br from-accent to-violet text-white shadow-glow"
          aria-hidden
        >
          <Icon icon="ph:sparkle-bold" className="text-2xl" />
          <span className="mt-0.5 text-[0.58rem] font-semibold uppercase tracking-wide">
            Core
          </span>
        </div>

        {/* Layer nodes */}
        {NODES.map((n) => (
          <div
            key={n.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
            onPointerEnter={() => setHovered(n.id)}
            onPointerLeave={() => setHovered(null)}
          >
            <span
              className={`glass flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[0.68rem] font-semibold text-ink transition-transform duration-300 ${
                hovered === n.id ? 'scale-110' : ''
              }`}
            >
              <Icon
                icon={n.icon}
                className={`text-sm ${ACCENT_TEXT[n.accent]}`}
                aria-hidden
              />
              {n.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
