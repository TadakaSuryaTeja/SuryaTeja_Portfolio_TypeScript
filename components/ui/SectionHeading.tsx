import Reveal from './Reveal';

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
};

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: SectionHeadingProps) {
  const isCenter = align === 'center';
  return (
    <Reveal
      className={
        isCenter ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl text-left'
      }
    >
      <span className="eyebrow">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </span>
      <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tightest text-ink sm:text-[2.6rem] sm:leading-[1.1]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}
