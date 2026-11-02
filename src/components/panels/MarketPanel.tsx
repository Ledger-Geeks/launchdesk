import { Users, Swords, TrendingUp } from 'lucide-react'
import type { Market } from '../../types'
import { Section, Tag, Entry, MetricGrid, BodyList, BodyText, type Tone } from '../ui'

const THREAT: Record<string, Tone> = { High: 'bad', Medium: 'warn', Low: 'good' }

export default function MarketPanel({ data }: { data: Market }) {
  return (
    <>
      <MetricGrid items={data.metrics || []} />
      <Section icon={Users} title="Target segments">
        {(data.segments || []).map(s => <Entry key={s.name} title={s.name} tag={<Tag>{s.size}</Tag>}>{s.description}</Entry>)}
      </Section>
      <Section icon={Swords} title="Competitive landscape">
        <BodyText>{data.competitiveSummary}</BodyText>
        <div className="mt-6">
          {(data.competitors || []).map(c => (
            <Entry key={c.name} title={c.name} tag={<Tag tone={THREAT[c.threat]}>{c.threat} threat</Tag>}>{c.weakness}</Entry>
          ))}
        </div>
      </Section>
      <Section icon={TrendingUp} title="Market trends"><BodyList items={data.trends || []} /></Section>
    </>
  )
}
