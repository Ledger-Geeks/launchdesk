import { Cpu, Network, AlertTriangle, Plug } from 'lucide-react'
import type { Tech } from '../../types'
import { Section, Chips, BodyList, BodyText, SubHead } from '../ui'

export default function TechPanel({ data }: { data: Tech }) {
  return (
    <>
      <Section icon={Cpu} title="Recommended stack">
        <div className="grid gap-4 sm:grid-cols-2">
          {(data.stack || []).map(s => (
            <div key={s.role} className="border-3 border-ink bg-paper-card p-5 shadow-brutal-sm">
              <p className="inline-block border-2 border-ink bg-accent px-1.5 font-mono text-[11px] font-medium uppercase tracking-wide">{s.role}</p>
              <p className="mt-1.5 font-medium text-ink">{s.tech}</p>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.reason}</p>
            </div>
          ))}
        </div>
      </Section>
      <Section icon={Network} title="Architecture">
        <BodyText>{data.architecture}</BodyText>
        <SubHead>MVP timeline</SubHead><BodyText>{data.mvpTimeline}</BodyText>
      </Section>
      <Section icon={AlertTriangle} title="Technical challenges"><BodyList items={data.challenges || []} /></Section>
      <Section icon={Plug} title="Third-party services"><Chips items={data.services || []} /></Section>
    </>
  )
}
