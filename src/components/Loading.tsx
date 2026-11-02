import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { Wordmark } from './ui'
import BriefDemo from './BriefDemo'

// Same order as SECTIONS: stage i is drawn as page i being written in BriefDemo
const STAGES = [
  'Writing the pitch',
  'Sizing the market',
  'Scoping the product',
  'Planning the roadmap',
  'Choosing the tech stack',
  'Modelling financials',
  'Planning the launch',
  'Drafting the landing page',
]

// ponytail: cosmetic ticker, not real progress; the API returns everything in one response.
const STAGE_MS = 6000

export default function Loading() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setCurrent(c => Math.min(c + 1, STAGES.length - 1)), STAGE_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-8">
      <header className="flex h-[72px] items-center border-b-3 border-ink"><Wordmark /></header>

      <main className="grid min-h-[calc(100dvh-72px)] items-center gap-10 py-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <h1 className="font-display text-4xl font-black leading-[0.95] text-ink md:text-5xl">Drafting your brief</h1>
          <p className="mt-2 text-sm text-ink-faint">This can take a minute or two.</p>
          <ol className="mt-8 space-y-3" aria-live="polite">
            {STAGES.map((stage, i) => (
              <li key={stage} className={`flex items-center gap-3 text-sm transition-colors ${i < current ? 'text-ink-faint' : i === current ? 'text-ink' : 'text-ink/25'}`}>
                {i < current
                  ? <Check className="h-4 w-4 border-2 border-ink bg-accent" strokeWidth={2.5} />
                  : <span className={`h-4 w-4 border-2 border-ink ${i === current ? 'animate-pulse bg-accent' : 'bg-paper-card'}`} />}
                {stage}
              </li>
            ))}
          </ol>
        </div>

        <div className="h-[340px] overflow-hidden border-3 border-ink bg-sky shadow-brutal sm:h-[440px] lg:h-[560px]">
          <BriefDemo mode="scan" step={current} />
        </div>
      </main>
    </div>
  )
}
