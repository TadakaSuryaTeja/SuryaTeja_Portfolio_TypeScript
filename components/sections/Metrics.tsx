import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import { metrics } from '@/portfolio';

function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const initial = match ? `${match[1]}0${match[3]}` : value;
  const [display, setDisplay] = useState(reduce ? value : initial);

  useEffect(() => {
    if (!inView || !match || reduce) return;
    const prefix = match[1];
    const target = parseInt(match[2], 10);
    const suffix = match[3];
    const duration = 1200;
    let start: number | undefined;
    let raf = 0;
    const tick = (t: number) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${prefix}${Math.round(eased * target)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref}>{display}</span>;
}

export default function Metrics() {
  return (
    <div className="container-px -mt-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m, i) => {
          const accent = accentMap[m.accent ?? 'accent'];
          return (
            <Reveal key={m.label} delay={i * 0.08}>
              <div className="glass glass-hover group h-full rounded-3xl p-6">
                <p
                  className={`text-4xl font-semibold tracking-tightest sm:text-5xl ${accent.text}`}
                >
                  <CountUp value={m.value} />
                </p>
                <p className="mt-3 text-sm font-semibold text-ink">{m.label}</p>
                {m.sublabel && (
                  <p className="mt-1 text-xs text-ink-muted">{m.sublabel}</p>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
