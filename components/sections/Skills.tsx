import Section from '@/components/ui/Section';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import CapabilityGraph from '@/components/knowledge/CapabilityGraph';
import { skillCategories } from '@/portfolio';

/**
 * Skills.
 *
 * The capability map is the primary view — it claims capability by pointing at
 * the systems that prove it. The full inventory below it is deliberately plain
 * text: it exists for completeness and keyword coverage, not as a second
 * icon-heavy grid saying the same thing twice.
 */
export default function Skills() {
  return (
    <Section id="skills" essential>
      <SectionHeading
        eyebrow="Capabilities"
        title="From model to metal"
        subtitle="No progress bars. Every capability below links to the systems and roles where it was actually used."
      />

      <Reveal className="mt-14">
        <CapabilityGraph />
      </Reveal>

      <Reveal className="mt-6">
        <details className="group rounded-3xl border border-line bg-fill-1 p-5 sm:p-6">
          <summary className="cursor-pointer list-none text-sm font-semibold text-ink marker:hidden">
            <span className="flex items-center justify-between gap-3">
              Full technology inventory
              <span className="text-xs font-medium text-ink-muted transition-transform group-open:rotate-180">
                ▾
              </span>
            </span>
          </summary>

          <dl className="mt-5 space-y-3">
            {skillCategories.map((cat) => (
              <div key={cat.title} className="text-sm leading-relaxed">
                <dt className="inline font-semibold text-ink">{cat.title}: </dt>
                <dd className="inline text-ink-muted">
                  {cat.skills.map((s) => s.name).join(', ')}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      </Reveal>
    </Section>
  );
}
