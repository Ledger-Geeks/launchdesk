import { Layers, Coins, KeyRound } from 'lucide-react'
import type { Product } from '../../types'
import { Section, Tag, Entry, Chips, BodyList, BodyText, SubHead } from '../ui'

export default function ProductPanel({ data }: { data: Product }) {
  return (
    <>
      <Section icon={Layers} title="Core features">
        {(data.features || []).map(f => (
          <Entry key={f.name} title={f.name} tag={<Tag tone={f.priority === 'MVP' ? 'good' : 'neutral'}>{f.priority}</Tag>}>{f.description}</Entry>
        ))}
      </Section>
      <Section icon={Coins} title="Business model">
        <SubHead>Revenue streams</SubHead><BodyList items={data.revenueStreams || []} />
        <SubHead>Pricing</SubHead><BodyText>{data.pricing}</BodyText>
      </Section>
      <Section icon={KeyRound} title="Metrics to track"><Chips items={data.kpis || []} /></Section>
    </>
  )
}
