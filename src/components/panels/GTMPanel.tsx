import { Rocket, Megaphone, Handshake, CalendarDays } from 'lucide-react'
import type { GTM } from '../../types'
import { Section, Tag, Entry, BodyList, BodyText } from '../ui'

export default function GTMPanel({ data }: { data: GTM }) {
  return (
    <>
      <Section icon={Rocket} title="Launch strategy"><BodyText>{data.launchStrategy}</BodyText></Section>
      <Section icon={Megaphone} title="Acquisition channels">
        {(data.channels || []).map(ch => (
          <Entry key={ch.name} title={ch.name} tag={<Tag tone={ch.priority === 'Primary' ? 'good' : 'neutral'}>{ch.priority}</Tag>}>{ch.description}</Entry>
        ))}
      </Section>
      <Section icon={Handshake} title="Partnerships"><BodyList items={data.partnerships || []} /></Section>
      <Section icon={CalendarDays} title="First 90 days"><BodyList items={data.actionPlan || []} /></Section>
    </>
  )
}
