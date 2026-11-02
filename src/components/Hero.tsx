import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { SECTIONS } from '../sections'

import BriefDemo from './BriefDemo'

const EXAMPLES = [
  { label: 'Restaurant inventory', idea: 'Inventory tracking for independent restaurants that flags food waste before it happens' },
  { label: 'Home repair marketplace', idea: 'Marketplace matching homeowners with vetted plumbers and electricians for same-week repairs' },
  { label: 'Workwear resale', idea: 'Resale platform for secondhand workwear, priced by condition photos' },
  { label: 'Student check-ins', idea: 'Study-stress check-ins for university students, routed to campus counsellors' },
]

// Mirrors the server's limits in api/blueprint.ts
const MIN = 10
const MAX = 2000

interface HeroProps {
  onLaunch: (idea: string) => void
  error: string
}

export default function Hero({ onLaunch, error }: HeroProps) {
  const [idea, setIdea] = useState('')
  const ready = idea.trim().length >= MIN

  function submit(e?: FormEvent) {
    e?.preventDefault()
    if (ready) onLaunch(idea.trim())
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit()
  }

  return (
    <section id="start" className="grid min-h-[calc(100dvh-72px)] scroll-mt-4 items-center gap-10 py-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
      <div className="animate-fade-up">
        <h1 className="font-display text-4xl font-black leading-[0.95] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[3.6rem]">
          Pressure-test your <span className="box-decoration-clone bg-accent px-2">startup idea.</span>
        </h1>
        <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
          Describe it in two sentences. Get a pitch, market sizing, roadmap, financials and a landing page draft.
        </p>

        <form onSubmit={submit} className="mt-8 flex max-w-2xl flex-col gap-2">
          <label htmlFor="idea" className="font-display text-sm font-extrabold uppercase tracking-wide text-ink">Your idea</label>
          <div className="border-3 border-ink bg-paper-card shadow-brutal">
            <textarea
              id="idea"
              rows={3}
              value={idea}
              onChange={e => setIdea(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX}
              aria-describedby="idea-help"
              aria-invalid={!!error}
              placeholder="Who is it for, and what problem does it solve?"
              className="block w-full resize-none bg-transparent px-4 pt-4 text-base leading-relaxed text-ink placeholder:text-ink-faint focus:outline-none"
            />
            <div className="flex items-center justify-between gap-4 border-t-3 border-ink px-4 py-3">
              <span className="font-mono text-xs text-ink-faint">{idea.length}/{MAX}</span>
              <button type="submit" disabled={!ready} className="btn-brutal bg-accent">
                Start a brief <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <p id="idea-help" className="text-sm text-ink-faint">At least {MIN} characters. Ctrl + Enter also submits.</p>
          {error && (
            <p role="alert" className="flex items-start gap-2 border-3 border-ink bg-pink px-3 py-2 text-sm font-medium text-ink">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} /> {error}
            </p>
          )}
        </form>

        <div className="mt-6 flex max-w-2xl flex-wrap items-center gap-2">
          <span className="mr-1 text-sm text-ink-faint">Try one:</span>
          {EXAMPLES.map(ex => (
            <button
              key={ex.label}
              onClick={() => setIdea(ex.idea)}
              className="border-2 border-ink bg-paper-card px-3 py-1 text-sm font-medium text-ink transition-colors hover:bg-accent"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>

      <figure className="h-[340px] overflow-hidden border-3 border-ink bg-sky shadow-brutal sm:h-[440px] lg:h-[560px]">
        <BriefDemo />
        <ul className="sr-only">{SECTIONS.map(s => <li key={s.id}>{s.label}: {s.blurb}</li>)}</ul>
      </figure>
    </section>
  )
}
