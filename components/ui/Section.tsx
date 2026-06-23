import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  children: ReactNode;
  className?: string;
};

export default function Section({ id, children, className = '' }: SectionProps) {
  return (
    <section
      id={id}
      className={`scroll-mt-24 py-20 [content-visibility:auto] [contain-intrinsic-size:auto_800px] sm:py-28 ${className}`}
    >
      <div className="container-px">{children}</div>
    </section>
  );
}
