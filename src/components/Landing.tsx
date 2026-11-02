import { useEffect, type MouseEvent } from 'react'
import { ArrowRight, PenLine, ScanSearch, FileText, Plus } from 'lucide-react'
import { SECTIONS } from '../sections'
import Hero from './Hero'
import { Wordmark, MetricGrid } from './ui'

const FACTS = [
  { value: '8', label: 'sections in every brief' },
  { value: '0', label: 'accounts or sign-ups' },
  { value: '1', label: 'landing page draft to download' },
]

// Staircase: each step sits one notch lower and further right than the last
const STEPS = [
  { icon: PenLine, title: 'Describe it', body: 'Two or three sentences: who it is for and what problem it solves. No deck, no sign-up.', cls: 'bg-paper-card md:col-span-6' },
  { icon: ScanSearch, title: 'We analyse it', body: 'Market, product, roadmap, stack, money and launch, worked out in one pass so every part describes the same business.', cls: 'bg-pink md:col-span-6 md:col-start-4' },
  { icon: FileText, title: 'Read the brief', body: 'Eight sections you can scan in ten minutes, plus a landing page draft to download as HTML.', cls: 'bg-accent md:col-span-6 md:col-start-7' },
]

// One class per SECTIONS entry, same order: 8 items, 8 cells, rows of 2+1+1 / 1+1+2 / 2+2 on desktop
const BENTO = [
  'bg-accent lg:col-span-2',
  'bg-paper-card',
  'bg-pink',
  'bg-paper-card',
  'bg-ink text-paper',
  'bg-sky lg:col-span-2',
  'bg-paper-card lg:col-span-2',
  'bg-accent lg:col-span-2',
]

// Illustrative only; labelled "Sample output" on the page
const SAMPLE = {
  oneLiner: "Kitchen inventory that tells independent restaurants what will spoil before Friday's order goes out.",
  score: 71,
  breakdown: [{ label: 'Market size', value: 68 }, { label: 'Feasibility', value: 77 }, { label: 'Revenue', value: 74 }],
  metrics: [{ label: 'Addressable market', value: '$4.1B' }, { label: 'Serviceable', value: '$612M' }, { label: 'Year 1 target', value: '$1.8M' }, { label: 'Market CAGR', value: '11.3%' }],
}

const FAQ = [
  { q: 'Do you store my idea?', a: 'No. It is sent to OpenAI to generate the brief and is not saved by this app. Treat it like any message you send to an AI service.' },
  { q: 'How reliable are the numbers?', a: 'They are informed estimates, not research. Use them to decide what to check first, then verify market size and pricing with real sources.' },
  { q: 'How long does it take?', a: 'Usually a minute or two, depending on how busy the model is.' },
  { q: 'What can I take away?', a: 'The landing page draft downloads as one HTML file. The rest of the brief stays on screen, so copy what you need.' },
]

const NAV = [
  { href: '#how', label: 'How it works' },
  { href: '#inside', label: "What's inside" },
  { href: '#faq', label: 'FAQ' },
]

interface LandingProps {
  onLaunch: (idea: string) => void
  error: string
}

// ponytail: /start is a real path (vercel.json rewrites it to index.html), not a router.
// Add a router if a second page appears.
const scrollToStart = () => document.getElementById('start')?.scrollIntoView()

function goToStart(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault()
  if (location.pathname !== '/start') history.pushState(null, '', '/start')
  scrollToStart()
}

export default function Landing({ onLaunch, error }: LandingProps) {
  useEffect(() => {
    if (location.pathname === '/start') scrollToStart()
  }, [])

  return (
    <>
      <header className="border-b-3 border-ink bg-paper-card">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-8">
          <Wordmark />
          <nav className="flex items-center gap-7 text-sm font-medium">
            {NAV.map(n => <a key={n.href} href={n.href} className="hidden text-ink underline-offset-4 hover:underline md:block">{n.label}</a>)}
            <a href="/start" onClick={goToStart} className="btn-brutal bg-accent px-4 py-2 text-xs shadow-brutal-sm">Start a brief</a>
          </nav>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <Hero onLaunch={onLaunch} error={error} />
        </div>

        <section aria-label="At a glance" className="border-y-3 border-ink bg-ink text-paper">
          <dl className="mx-auto grid max-w-7xl divide-y-3 divide-paper/20 px-4 md:grid-cols-3 md:divide-x-3 md:divide-y-0 md:px-8">
            {FACTS.map(f => (
              <div key={f.label} className="flex items-baseline gap-4 py-7 md:px-8 md:first:pl-0">
                <dt className="order-2 font-medium text-paper/80">{f.label}</dt>
                <dd className="font-display text-6xl font-black leading-none text-accent">{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="how" className="mx-auto max-w-7xl scroll-mt-4 px-4 py-24 md:px-8">
          <h2 className="max-w-[16ch] font-display text-4xl font-black leading-[0.95] md:text-6xl">Two sentences in. A full brief out.</h2>
          <ol className="mt-14 grid gap-6 md:grid-cols-12">
            {STEPS.map(({ icon: Icon, title, body, cls }) => (
              <li key={title} className={`border-3 border-ink p-6 shadow-brutal md:p-8 ${cls}`}>
                <span className="grid h-11 w-11 place-items-center border-3 border-ink bg-paper-card">
                  <Icon className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <h3 className="mt-5 font-display text-2xl font-black uppercase">{title}</h3>
                <p className="mt-2 max-w-[48ch] leading-relaxed text-ink-soft">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="inside" className="scroll-mt-4 border-y-3 border-ink bg-paper-deep">
          <div className="mx-auto max-w-7xl px-4 py-24 md:px-8">
            <h2 className="font-display text-4xl font-black leading-[0.95] md:text-6xl">Eight sections. One plan.</h2>
            <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
              Generated together, so the roadmap, stack and financials all describe the same product.
            </p>
            <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {SECTIONS.map(({ id, label, icon: Icon, blurb }, i) => (
                <li
                  key={id}
                  className={`group flex min-h-[200px] flex-col justify-between border-3 border-ink p-6 shadow-brutal transition-transform hover:-translate-y-1 ${BENTO[i]}`}
                >
                  <span className="grid h-11 w-11 place-items-center border-3 border-ink bg-paper-card text-ink transition-transform group-hover:-rotate-6">
                    <Icon className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-black uppercase">{label}</h3>
                    <p className={`mt-1 ${BENTO[i].includes('bg-ink') ? 'text-paper/80' : 'text-ink-soft'}`}>{blurb}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-24 md:px-8">
          <h2 className="font-display text-4xl font-black leading-[0.95] md:text-6xl">What you get back.</h2>
          <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink-soft">
            A viability score you can argue with, market sizing in plain numbers, and the reasoning behind both.
          </p>
          <div className="relative mt-14 border-3 border-ink bg-paper-card p-6 shadow-brutal-lg md:p-10 [&_dl]:mb-0">
            <span className="absolute -top-5 left-6 -rotate-2 border-3 border-ink bg-pink px-3 py-1 font-display text-sm font-black uppercase">Sample output</span>
            <div className="grid gap-8 pb-8 md:grid-cols-[1.4fr_1fr] md:items-start">
              <p className="font-display text-2xl font-extrabold leading-tight md:text-3xl">{SAMPLE.oneLiner}</p>
              <div>
                <div className="flex items-end gap-3">
                  <span className="border-3 border-ink bg-accent px-3 font-display text-6xl font-black leading-tight">{SAMPLE.score}</span>
                  <span className="pb-2 font-medium text-ink-soft">/ 100 viability</span>
                </div>
                <dl className="mt-5 grid grid-cols-3 gap-3">
                  {SAMPLE.breakdown.map(s => (
                    <div key={s.label} className="border-2 border-ink p-3">
                      <dt className="font-mono text-[11px] uppercase text-ink-faint">{s.label}</dt>
                      <dd className="mt-1 font-display text-2xl font-black">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            <MetricGrid items={SAMPLE.metrics} />
          </div>
        </section>

        <section id="faq" className="mx-auto max-w-7xl scroll-mt-4 px-4 pb-24 md:px-8">
          <h2 className="font-display text-4xl font-black leading-[0.95] md:text-6xl">Questions, answered plainly.</h2>
          <div className="mt-12 grid items-start gap-5 md:grid-cols-2">
            {FAQ.map(f => (
              <details key={f.q} className="group border-3 border-ink bg-paper-card shadow-brutal-sm open:bg-accent">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-5 font-display font-extrabold uppercase [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="grid h-7 w-7 shrink-0 place-items-center border-2 border-ink bg-paper-card transition-transform group-open:rotate-45"><Plus className="h-4 w-4" strokeWidth={2.5} /></span>
                </summary>
                <p className="border-t-3 border-ink px-5 py-4 leading-relaxed text-ink">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
          <div className="grid gap-8 border-3 border-ink bg-accent px-6 py-14 shadow-brutal-lg md:grid-cols-[1.6fr_1fr] md:items-end md:px-12 md:py-16">
            <h2 className="max-w-[18ch] font-display text-4xl font-black leading-[0.95] md:text-6xl">Got an idea? Test it before you build it.</h2>
            <a href="/start" onClick={goToStart} className="btn-brutal justify-self-start bg-paper-card md:justify-self-end">
              Start a brief <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t-3 border-ink bg-paper-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-8">
          <Wordmark />
          <p className="text-ink-soft">Briefs are AI-generated estimates. Verify before you act.</p>
          <p className="text-ink-soft">&copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </>
  )
}
