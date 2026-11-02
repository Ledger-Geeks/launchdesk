import { Milestone, Users, Banknote } from 'lucide-react'
import type { Roadmap } from '../../types'
import { Section, Chips, BodyList, BodyText } from '../ui'

export default function RoadmapPanel({ data }: { data: Roadmap }) {
  return (
    <>
      <Section icon={Milestone} title="Execution roadmap">
        <ol className="relative border-l-3 border-ink">
          {(data.phases || []).map((ph, i) => (
            <li key={i} className="relative pb-8 pl-7 last:pb-0">
              <span className="absolute -left-[9px] top-1 h-4 w-4 border-3 border-ink bg-accent" />
              <p className="font-mono text-xs font-medium uppercase tracking-wide text-ink-faint">{ph.phase} / {ph.timeline}</p>
              <p className="mb-1.5 mt-1 font-medium text-ink">{ph.title}</p>
              <BodyText>{ph.description}</BodyText>
              <div className="mt-3"><Chips items={ph.milestones || []} /></div>
            </li>
          ))}
        </ol>
      </Section>
      <Section icon={Users} title="Team to build"><BodyList items={data.team || []} /></Section>
      <Section icon={Banknote} title="Funding"><BodyText>{data.funding}</BodyText></Section>
    </>
  )
}
