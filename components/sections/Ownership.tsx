import { Icon } from '@/components/ui/Icon';
import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import { accentMap } from '@/lib/accent';
import TechChips from '@/components/knowledge/TechChips';
import { ownershipLayers } from '@/portfolio';

/**
 * "What I can own" — the vertical slice of an AI system this background covers,
 * from the assistant a user talks to down to the Terraform that provisions it.
 */
export default function Ownership() {
  return (
    <Section id="ownership">
      <SectionHeading
        eyebrow="Scope"
        title="I build across the stack AI actually depends on"
        subtitle="Most AI work fails between the layers. Here is the slice I can own end-to-end — and have. Select any capability to see the systems behind it."
      />

      <div className="mt-14 space-y-3">
        {ownershipLayers.map((layer, i) => {
          const accent = accentMap[layer.accent];
          const isLast = i === ownershipLayers.length - 1;
          return (
            <Reveal key={layer.layer} delay={i * 0.07}>
              <div className="relative">
                <div className="glass glass-hover rounded-3xl p-5 sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-center gap-3.5">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accent.bgSoft} ${accent.text}`}
                      >
                        <Icon icon={layer.icon} className="text-xl" aria-hidden />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-ink sm:text-base">
                          {layer.layer}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                          {layer.summary}
                        </p>
                      </div>
                    </div>

                    {/* Chips resolve into the knowledge graph where a
                        taxonomy entry exists, so a visitor can jump from a
                        layer straight to the systems that prove it. */}
                    <TechChips tech={layer.items} className="sm:max-w-[52%]" />
                  </div>
                </div>

                {!isLast && (
                  <span
                    className="pointer-events-none flex justify-center py-1 text-ink-faint"
                    aria-hidden
                  >
                    <Icon icon="ph:arrow-down-bold" className="text-sm" />
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
