import { motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import { skillCategories, skillBars } from '@/portfolio';

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading
        eyebrow="Skills"
        title="A full-stack, cloud-to-model toolkit"
        subtitle="The technologies I reach for across cloud, backend, AI/ML, and infrastructure."
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

      {/* Proficiency bars */}
      <Reveal className="mt-10">
        <div className="glass rounded-4xl p-6 sm:p-8">
          <h3 className="text-base font-semibold text-ink">Proficiency</h3>
          <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {skillBars.map((bar) => (
              <div key={bar.stack}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{bar.stack}</span>
                  <span className="text-ink-muted">{bar.level}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-fill-3">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${bar.level}%` }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
