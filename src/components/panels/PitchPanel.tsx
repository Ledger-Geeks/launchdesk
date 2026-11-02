import { Scale, Gem, ShieldAlert } from 'lucide-react'
import type { Pitch } from '../../types'
import { Section, Chips, ProgressRow, BodyText, BodyList, SubHead } from '../ui'

export default function PitchPanel({ data }: { data: Pitch }) {
  const score = Math.min(100, Math.max(0, Number(data.viabilityScore) || 0))
  return (
    <>
      <div className="grid gap-10 pb-10 md:grid-cols-[1.4fr_1fr]">
        <blockquote className="font-display text-2xl font-extrabold leading-tight text-ink md:text-3xl">{data.oneLiner}</blockquote>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="border-3 border-ink bg-accent px-3 font-display text-6xl font-black leading-tight">{score}</span>
            <span className="text-sm text-ink-soft">/ 100 viability</span>
          </div>
          <div className="mt-6 space-y-4">
            {(data.scoreBreakdown || []).map((s, i) => (
              <ProgressRow key={s.label} label={s.label} value={String(s.value)} pct={s.value} delay={i * 80} />
            ))}
          </div>
        </div>
      </div>
      <Section icon={Scale} title="Problem and solution">
        <SubHead>Problem</SubHead><BodyText>{data.problem}</BodyText>
        <SubHead>Solution</SubHead><BodyText>{data.solution}</BodyText>
      </Section>
      <Section icon={Gem} title="Value proposition">
        <BodyText>{data.uvp}</BodyText>
        <div className="mt-5"><Chips items={data.differentiators || []} /></div>
      </Section>
      <Section icon={ShieldAlert} title="Key risks"><BodyList items={data.risks || []} /></Section>
    </>
  )
}
