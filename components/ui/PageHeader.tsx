import { FadeIn, TextReveal } from '@/components/motion';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="container-px pt-28 sm:pt-36">
      <div className="mx-auto max-w-3xl text-center">
        <span className="eyebrow">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </span>
        <TextReveal
          as="h1"
          text={title}
          className="mt-5 block text-balance text-3xl font-semibold leading-[1.1] tracking-tightest text-ink sm:text-5xl"
        />
        <FadeIn delay={0.12} onMount>
          <p className="mt-5 text-base leading-relaxed text-ink-muted sm:text-lg">{subtitle}</p>
        </FadeIn>
      </div>
    </header>
  );
}
