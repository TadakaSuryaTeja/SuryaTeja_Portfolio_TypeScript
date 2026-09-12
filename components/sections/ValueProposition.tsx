import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import { TextReveal } from '@/components/motion';

const LAYERS = [
  { label: 'Models', icon: 'ph:brain-bold', note: 'Bedrock · Claude · Llama · Titan', accent: 'text-violet' },
  { label: 'Agents', icon: 'ph:circles-three-bold', note: 'Orchestration · planning · guardrails', accent: 'text-violet' },
  { label: 'APIs', icon: 'ph:stack-bold', note: 'Python · FastAPI · MCP tool servers', accent: 'text-success' },
  { label: 'Data', icon: 'ph:database-bold', note: 'Kafka · Glue · Redshift · vector search', accent: 'text-accent' },
  { label: 'Cloud', icon: 'ph:cloud-bold', note: 'Lambda · ECS · Step Functions · IAM', accent: 'text-accent' },
  { label: 'Infrastructure', icon: 'ph:gear-six-bold', note: 'Terraform · Kubernetes · CI/CD · observability', accent: 'text-ink-muted' },
];

/**
 * The differentiation argument, told through scroll.
 *
 * Most people claiming AI experience own one layer. This section reveals the
 * six layers a production AI system actually needs, one at a time, and lands
 * on the claim that matters: prototype to production.
 *
 * Under reduced motion the whole stack renders at rest — the argument is in
 * the content, and the animation is only pacing.
 */
export default function ValueProposition() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'end 0.4'],
  });

  const lineScale = useTransform(scrollYProgress, [0, 0.85], [0, 1]);

  return (
    <section
      id="stack"
      className="scroll-mt-24 py-20 [content-visibility:auto] [contain-intrinsic-size:auto_900px] sm:py-28"
    >
      <div className="container-px">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Why this background
          </span>
          <TextReveal
            as="h2"
            text="I build across the stack AI actually depends on."
            className="mt-5 block text-balance text-3xl font-semibold tracking-tightest text-ink sm:text-[2.6rem] sm:leading-[1.1]"
          />
          <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
            A model call is the easy part. Everything below it is where AI projects
            actually stall — and it is where seven years of backend, data and cloud
            engineering stops being a detour and starts being the point.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto mt-16 max-w-2xl">
          {/* Progress spine */}
          <div
            className="absolute left-[1.35rem] top-2 bottom-16 w-px bg-line sm:left-1/2"
            aria-hidden
          >
            <motion.div
              className="h-full w-full origin-top bg-gradient-to-b from-violet via-accent to-success"
              style={reduce ? { scaleY: 1 } : { scaleY: lineScale }}
            />
          </div>

          <ol className="relative space-y-3" role="list">
            {LAYERS.map((layer, i) => (
              <motion.li
                key={layer.label}
                initial={reduce ? false : { opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -120px 0px' }}
                transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98], delay: i * 0.04 }}
                className="relative flex items-center gap-4 sm:justify-center"
              >
                <span
                  className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-elevated sm:absolute sm:left-1/2 sm:-translate-x-1/2"
                  aria-hidden
                >
                  <Icon icon={layer.icon} className={`text-lg ${layer.accent}`} />
                </span>

                <div className="glass flex-1 rounded-2xl px-4 py-3 sm:ml-auto sm:w-[calc(50%-2.5rem)] sm:flex-none">
                  <p className="text-sm font-semibold text-ink">{layer.label}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{layer.note}</p>
                </div>
              </motion.li>
            ))}
          </ol>

          {/* Landing statement */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -80px 0px' }}
            transition={{ duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="relative mt-10 text-center"
          >
            <p className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-line bg-fill-2 px-5 py-3 text-base font-semibold text-ink sm:text-lg">
              <span className="text-ink-muted">From prototype</span>
              <Icon icon="ph:arrow-right-bold" className="text-sm text-accent" aria-hidden />
              <span className="gradient-text">to production.</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
