import { LineChart, Receipt, Banknote } from 'lucide-react'
import type { Finance } from '../../types'
import { Section, MetricGrid, ProgressRow, BodyList, BodyText, SubHead } from '../ui'

export default function FinancePanel({ data }: { data: Finance }) {
  return (
    <>
      <MetricGrid items={data.metrics || []} />
      <Section icon={LineChart} title="3-year revenue">
        <div className="max-w-xl space-y-5">
          {(data.projections || []).map((p, i) => <ProgressRow key={p.year} label={p.year} value={p.revenue} pct={p.pct} delay={i * 80} />)}
        </div>
      </Section>
      <Section icon={Receipt} title="Cost structure"><BodyList items={data.costs || []} /></Section>
      <Section icon={Banknote} title="Funding strategy">
        <BodyText>{data.fundingStrategy}</BodyText>
        <SubHead>Investor pitch points</SubHead><BodyList items={data.pitchPoints || []} />
      </Section>
    </>
  )
}
