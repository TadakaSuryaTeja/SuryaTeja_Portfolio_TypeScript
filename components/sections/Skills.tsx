import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import CapabilityGraph from '@/components/sections/CapabilityGraph';
import { skillCategories } from '@/portfolio';

export default function Skills() {
  return (
    <Section id="skills" essential>
      <SectionHeading
        eyebrow="Skills"
        title="From model to metal"
        subtitle="The technologies I reach for across AI, backend, data, cloud and infrastructure — grouped by architectural capability, not by keyword count."
      />

      <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {skillCategories.map((cat, i) => {
          const accent = accentMap[cat.accent];
          return (
            <Reveal key={cat.title} delay={i * 0.06}>
              <div className="glass glass-hover h-full rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bgSoft} ${accent.text}`}
                  >
                    <Icon icon={cat.icon} className="text-xl" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-ink">
                      {cat.title}
                    </h3>
                  </div>
                </div>
                <p className="mt-3 text-sm text-ink-muted">{cat.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-fill-2 px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-all hover:-translate-y-0.5 hover:border-hair-strong hover:text-ink"
                    >
                      <Icon icon={s.icon} className="text-base" aria-hidden />
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-10">
        <CapabilityGraph />
      </Reveal>

    </Section>
  );
}
