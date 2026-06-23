import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { experience } from '@/portfolio';
import type { ExperienceType } from '@/types/sections';

function ExperienceCard({
  item,
  index,
  defaultOpen,
}: {
  item: ExperienceType;
  index: number;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Reveal delay={index * 0.05} className="relative pl-10 sm:pl-16">
      {/* timeline node */}
      <span className="absolute left-0 top-6 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-accent/20 sm:left-6 sm:block" />
      <span className="absolute left-[5px] top-6 h-3 w-3 rounded-full bg-accent ring-4 ring-accent/20 sm:hidden" />

      <div className="glass glass-hover rounded-3xl p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {item.companyLogo && (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-fill-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.companyLogo}
                  alt={item.company}
                  loading="lazy"
                  decoding="async"
                  className="h-9 w-9 object-contain"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-ink">{item.role}</h3>
              <p className="text-sm font-medium text-accent">{item.company}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="chip">{item.date}</p>
            {item.location && (
              <p className="mt-1.5 flex items-center justify-end gap-1 text-xs text-ink-faint">
                <Icon icon="ph:map-pin-bold" aria-hidden /> {item.location}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-ink-muted">
          {item.summary}
        </p>

        {item.metrics && item.metrics.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {item.metrics.map((m) => (
              <span
                key={m.label}
                className="inline-flex items-baseline gap-1.5 rounded-xl border border-line bg-fill-2 px-3 py-1.5"
              >
                <span className="text-sm font-bold text-success">{m.value}</span>
                <span className="text-xs text-ink-muted">{m.label}</span>
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink-muted transition-colors hover:text-ink"
          aria-expanded={open}
        >
          {open ? 'Hide details' : 'View responsibilities'}
          <Icon
            icon="ph:caret-down-bold"
            className={`transition-transform duration-300 ${
              open ? 'rotate-180' : ''
            }`}
            aria-hidden
          />
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <ul className="mt-4 space-y-2.5">
                {item.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm text-ink-muted">
                    <Icon
                      icon="ph:check-circle-fill"
                      className="mt-0.5 shrink-0 text-accent"
                      aria-hidden
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-line pt-5">
          {item.tech.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function Experience() {
  return (
    <Section id="experience">
      <SectionHeading
        eyebrow="Experience"
        title="Where I've made an impact"
        subtitle="Seven years embedded with enterprise customers, shipping cloud-native systems end-to-end — with the numbers to back it."
      />
      <div className="relative mt-14">
        <span className="absolute bottom-6 left-[5px] top-6 w-px bg-gradient-to-b from-accent/40 via-line to-transparent sm:left-6" />
        <div className="space-y-6">
          {experience.map((item, i) => (
            <ExperienceCard
              key={item.company}
              item={item}
              index={i}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
