import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import type { TerminalLineType } from '@/types/sections';

export default function Terminal({ lines }: { lines: TerminalLineType[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const [r, setR] = useState({ line: 0, char: 0, out: false });

  const done = r.line >= lines.length;
  const full = reduce || done;

  useEffect(() => {
    if (!inView || reduce) return;
    let line = 0;
    let char = 0;
    let out = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const cur = lines[line];
      if (!cur) {
        setR({ line: lines.length, char: 0, out: false });
        return;
      }
      if (!out) {
        if (char < cur.cmd.length) {
          char += 1;
          setR({ line, char, out: false });
          timer = setTimeout(tick, 36);
        } else {
          out = true;
          setR({ line, char, out: true });
          timer = setTimeout(tick, 320);
        }
      } else {
        line += 1;
        char = 0;
        out = false;
        setR({ line, char: 0, out: false });
        timer = setTimeout(tick, 180);
      }
    };

    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [inView, reduce, lines]);

  const visibleCount = full ? lines.length : r.line + 1;

  return (
    <div ref={ref} className="glass overflow-hidden rounded-2xl">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 font-mono text-xs text-ink-faint">
          surya@portfolio — zsh
        </span>
      </div>

      <div
        className="space-y-2.5 p-5 font-mono text-[13px] leading-relaxed sm:text-sm"
        aria-hidden="true"
      >
        {lines.slice(0, visibleCount).map((ln, i) => {
          const isCurrent = !full && i === r.line;
          const cmdText = isCurrent ? ln.cmd.slice(0, r.char) : ln.cmd;
          const showOut = full || !isCurrent || r.out;
          return (
            <div key={i}>
              <div className="flex flex-wrap items-center gap-x-2 text-ink">
                <span className="text-success">➜</span>
                <span className="text-accent">~</span>
                <span>{cmdText}</span>
                {isCurrent && !r.out && (
                  <span className="inline-block h-4 w-[7px] animate-pulse bg-ink align-middle" />
                )}
              </div>
              {showOut && (
                <div className="pl-5 text-ink-muted">{ln.out}</div>
              )}
            </div>
          );
        })}
      </div>

      <p className="sr-only">
        {lines.map((l) => `${l.cmd}: ${l.out}`).join('. ')}
      </p>
    </div>
  );
}
