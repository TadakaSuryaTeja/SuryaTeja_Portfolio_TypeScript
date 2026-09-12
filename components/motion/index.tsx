/**
 * ANIMATION DESIGN SYSTEM
 *
 * Every motion in the site composes from these primitives, so timing and
 * easing stay consistent and animation code does not get re-invented inside
 * feature components.
 *
 * Two rules hold throughout:
 *  1. `prefers-reduced-motion` is honoured by every primitive — motion
 *     degrades to an instant, fully legible state, never to hidden content.
 *  2. Nothing here animates a property that triggers layout. Transform and
 *     opacity only, so scroll stays smooth on mid-range hardware.
 */
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionProps,
  type Variants,
} from 'framer-motion';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

/**
 * True only after hydration. Used to keep server-rendered content plain and
 * visible, so a heading is never blank while JS loads — or if it never does.
 */
function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/** Shared easing — a soft, slightly overshooting curve used site-wide. */
export const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export const DURATION = { fast: 0.24, base: 0.42, slow: 0.7 } as const;

type BaseProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Animate once when scrolled into view (default) or on mount. */
  onMount?: boolean;
};

const viewport = { once: true, margin: '0px 0px -80px 0px' } as const;

/* ---------------------------------- FadeIn -------------------------------- */
export function FadeIn({ children, className, delay = 0, onMount = false }: BaseProps) {
  const reduce = useReducedMotion();
  const anim: MotionProps = reduce
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 14 },
        ...(onMount
          ? { animate: { opacity: 1, y: 0 } }
          : { whileInView: { opacity: 1, y: 0 }, viewport }),
        transition: { duration: DURATION.base, ease: EASE, delay },
      };

  return (
    <motion.div className={className} {...anim}>
      {children}
    </motion.div>
  );
}

/* -------------------------------- SlideReveal ----------------------------- */
/** Content wipes in behind a moving mask — used for section-level reveals. */
export function SlideReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
}: BaseProps & { direction?: 'up' | 'left' }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  const offset = direction === 'up' ? { y: 28 } : { x: 28 };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewport}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* --------------------------------- Stagger -------------------------------- */
const staggerParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE } },
};

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={staggerParent}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={staggerChild}>
      {children}
    </motion.div>
  );
}

/* -------------------------------- TextReveal ------------------------------ */
/**
 * Reveals a headline word by word.
 *
 * Renders as plain text on the server and until hydration, so the heading is
 * legible with JavaScript disabled or still loading, and an animating headline
 * can never gate LCP on a blank box. The full string also stays in the
 * accessibility tree as one node — screen readers get the sentence, not 12
 * fragments.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  as: Tag = 'span',
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}) {
  const reduce = useReducedMotion();
  const mounted = useMounted();
  const words = text.split(' ');

  if (reduce || !mounted) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        variants={{ show: { transition: { staggerChildren: 0.035, delayChildren: delay } } }}
      >
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: '110%' },
                show: { y: 0, transition: { duration: 0.55, ease: EASE } },
              }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}

/* ------------------------------ MagneticButton ---------------------------- */
/**
 * Pulls gently toward the pointer. Desktop-only by construction: the effect is
 * driven by mouse position, and coarse pointers never produce one.
 *
 * Transform is written straight to the node and rAF-throttled — keeping
 * pointer position in React state would re-render on every mousemove, which is
 * exactly the kind of work that shows up as input delay.
 */
export function MagneticButton({
  children,
  className,
  href,
  onClick,
  strength = 0.28,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  strength?: number;
  download?: boolean;
  target?: string;
  rel?: string;
}) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const frame = useRef(0);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el || frame.current) return;
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const rect = el.getBoundingClientRect();
        const x = (clientX - (rect.left + rect.width / 2)) * strength;
        const y = (clientY - (rect.top + rect.height / 2)) * strength;
        el.style.transition = 'none';
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    },
    [reduce, strength]
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    el.style.transition = 'transform 0.4s cubic-bezier(0.21,0.47,0.32,0.98)';
    el.style.transform = '';
  }, []);

  const props = {
    ref,
    className,
    onPointerMove: onMove,
    onPointerLeave: reset,
    onBlur: reset,
    ...rest,
  };

  return href ? (
    <a href={href} {...props}>
      {children}
    </a>
  ) : (
    <button type="button" onClick={onClick} {...props}>
      {children}
    </button>
  );
}

/* --------------------------------- TiltCard ------------------------------- */
/**
 * Subtle pointer-follow depth, capped at a few degrees — depth, not a toy.
 * Same direct-DOM approach as MagneticButton: a grid of these must not
 * schedule a React render per pointer move.
 */
export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const frame = useRef(0);

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduce || e.pointerType !== 'mouse') return;
      const el = ref.current;
      if (!el || frame.current) return;
      const { clientX, clientY } = e;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        el.style.transition = 'transform 0.08s linear';
        el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
      });
    },
    [max, reduce]
  );

  const reset = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    if (frame.current) {
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    }
    el.style.transition = 'transform 0.5s cubic-bezier(0.21,0.47,0.32,0.98)';
    el.style.transform = '';
  }, []);

  return (
    <div ref={ref} className={className} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </div>
  );
}

/* ------------------------------ ScrollProgress ---------------------------- */
/** Hairline reading-progress bar pinned under the navbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-accent to-violet"
    />
  );
}

/* ------------------------------- NodePulse -------------------------------- */
/** A soft breathing ring, used to mark the active node in a diagram. */
export function NodePulse({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ring-2 ${className}`}
      initial={{ opacity: 0.7, scale: 1 }}
      animate={{ opacity: 0, scale: 1.35 }}
      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
    />
  );
}
