import { Icon } from '@/components/ui/Icon';
import { techMarquee } from '@/portfolio';

export default function TechMarquee() {
  const items = [...techMarquee, ...techMarquee];

  return (
    <div className="relative border-y border-line bg-fill-1 py-6">
      <p className="container-px mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-faint">
        Tools &amp; technologies I build with
      </p>
      <div className="mask-fade-x overflow-hidden" aria-hidden="true">
        <div className="flex w-max items-center will-change-transform animate-marquee hover:[animation-play-state:paused]">
          {items.map((t, i) => (
            <span
              key={`${t.name}-${i}`}
              className="marquee-item inline-flex select-none items-center whitespace-nowrap text-sm font-medium text-ink-muted"
            >
              <Icon icon={t.icon} className="mr-2 text-lg" aria-hidden />
              {t.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
