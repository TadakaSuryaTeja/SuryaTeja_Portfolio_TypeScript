import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
  /**
   * Kept visible in Recruiter Mode. Everything else is hidden (never removed —
   * the full portfolio is one toggle away).
   */
  essential?: boolean;
};

export default function Section({
  id,
  children,
  className = '',
  essential = false,
}: SectionProps) {
  return (
    <section
      id={id}
      data-essential={essential ? 'true' : undefined}
      className={`scroll-mt-24 py-20 [content-visibility:auto] [contain-intrinsic-size:auto_800px] sm:py-28 ${className}`}
    >
      <div className="container-px">{children}</div>
    </section>
  );
}
