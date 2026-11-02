import { useEffect, useRef } from 'react'
import { animate, createTimeline, stagger, utils, type FunctionValue } from 'animejs'
import { SECTIONS } from '../sections'

// mode="demo" (hero): the product in one loop. An idea is typed, submitted, scanned, and comes back
// as a fanned brief.
// mode="scan" (Loading): driven by `step`. Stage i writes page i: finished pages settle into the fan,
// the current page lifts on top under the scanner, pending pages wait stacked beneath it.

const PAGE_BG = ['bg-paper-card', 'bg-accent', 'bg-pink', 'bg-sky']
const IDEAS = [
  'Inventory app for restaurants',
  'Same-week plumber marketplace',
  'Resale for secondhand workwear',
  'Check-ins for stressed students',
]
const N = SECTIONS.length
const LINES = 9
const WRITE_MS = 3500 // how long one page takes to "write" in scan mode; Loading advances every 6s

// Fan slot for page i, and a slightly messy angle for the closed stack
const slot = (i: number) => (i - (N - 1) / 2) * 6.5
const fanAngle: FunctionValue<number> = (_, i = 0) => slot(i)
const stackAngle: FunctionValue<number> = (_, i = 0) => ((i * 37) % 5 - 2) * 0.8

function Page({ i, beam, children }: { i: number; beam?: boolean; children?: React.ReactNode }) {
  const chart = i % 2 === 1
  return (
    <div data-page className={`absolute inset-0 origin-[50%_175%] border-3 border-ink p-[7%] shadow-brutal-sm ${PAGE_BG[i % PAGE_BG.length]}`}>
      <span className="bg-ink px-1 font-display text-[10px] font-black text-paper-card">{String(i + 1).padStart(2, '0')}</span>
      <p className="mt-1 truncate font-display text-[11px] font-black uppercase leading-none">{SECTIONS[i].id}</p>
      <div className="mt-1.5 h-[3px] bg-ink" />
      <div className="mt-2 space-y-[7%]">
        {Array.from({ length: chart ? 4 : LINES }, (_, k) => (
          <div key={k} data-line className="h-[4px] origin-left bg-ink" style={{ width: (k + i) % 5 === 4 ? '55%' : '100%' }} />
        ))}
      </div>
      {chart && (
        <div className="mt-[10%] flex h-[22%] items-end gap-[6%] px-[4%]">
          {[55, 80, 40, 70, 30, 90].map((h, b) => (
            <div key={b} data-bar className={`flex-1 origin-bottom border-2 border-ink ${b === 4 ? 'bg-paper-card' : 'bg-ink'}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      )}
      {beam && (
        <div data-page-beam className="pointer-events-none absolute -inset-x-[10%] top-0 h-full opacity-0">
          <div className="h-6 bg-gradient-to-b from-transparent to-accent/60" />
          <div className="h-2 border-y-2 border-ink bg-accent" />
        </div>
      )}
      {children}
    </div>
  )
}

const linesOf = (page: HTMLElement) => Array.from(page.querySelectorAll<HTMLElement>('[data-line], [data-bar]'))
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function BriefDemo({ mode = 'demo', step = 0 }: { mode?: 'demo' | 'scan'; step?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const demo = mode === 'demo'

  useEffect(() => {
    const el = root.current!
    const $ = (sel: string) => Array.from(el.querySelectorAll<HTMLElement>(sel))
    const pages = $('[data-page]')
    const lines = $('[data-line], [data-bar]')
    const beam = $('[data-beam]')
    const typed = el.querySelector<HTMLElement>('[data-typed]')
    const status = el.querySelector<HTMLElement>('[data-status]')
    const say = (text: string) => () => { if (status) status.textContent = text }

    // Text lines grow rightward, chart bars grow upward
    const blank = () => {
      utils.set($('[data-line]'), { scaleX: 0 })
      utils.set($('[data-bar]'), { scaleY: 0 })
    }

    if (!demo) {
      // Page positions follow `step` (next effect); this effect only owns the looping scanner
      blank()
      if (reducedMotion()) return
      const sweep = animate($('[data-page-beam]'), { y: ['-10%', '100%'], duration: 1100, ease: 'inOutSine', loop: true, alternate: true })
      const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? sweep.resume() : sweep.pause()))
      seen.observe(el)
      return () => {
        seen.disconnect()
        sweep.revert()
        utils.remove([...pages, ...lines])
      }
    }

    if (reducedMotion()) {
      // Static end state: the finished brief, no movement
      utils.set(pages, { rotate: fanAngle })
      utils.set(beam, { opacity: 0 })
      if (typed) typed.textContent = IDEAS[0]
      say('Brief ready')()
      return
    }

    utils.set(pages, { rotate: stackAngle })
    blank()
    utils.set(beam, { opacity: 0 })
    utils.set($('[data-stamp], [data-status]'), { opacity: 0 })

    let n = 0
    let idea = IDEAS[0]
    const typer = { p: 0 }
    const tl = createTimeline({ loop: true })
      // 1. Type the idea
      .call(() => { idea = IDEAS[n++ % IDEAS.length] }, 0)
      .add(typer, { p: [0, 1], duration: 1500, ease: 'linear', onUpdate: () => { if (typed) typed.textContent = idea.slice(0, Math.round(typer.p * idea.length)) } }, 0)
      // 2. Press GO
      .add($('[data-go]'), { x: 3, y: 3, duration: 90, ease: 'outQuad' }, 1650)
      .add($('[data-go]'), { x: 0, y: 0, duration: 160, ease: 'outBack' }, 1740)
      // 3. Scan: the beam sweeps while every page's lines get written
      .call(say('Reading the idea'), 1900)
      .add($('[data-status]'), { opacity: 1, y: [8, 0], duration: 300, ease: 'outExpo' }, 1900)
      .add(beam, { opacity: 1, duration: 200 }, 2000)
      .add(beam, { y: '100%', duration: 1000, ease: 'inOutSine' }, 2000)
      .add(beam, { y: '-12%', duration: 900, ease: 'inOutSine' }, 3000)
      .add(beam, { y: '100%', duration: 900, ease: 'inOutSine' }, 3900)
      .add(lines, { scaleX: 1, scaleY: 1, duration: 450, delay: stagger(16, { from: 'last' }), ease: 'outExpo' }, 2100)
      .call(say('Sizing the market'), 2700)
      .call(say('Planning the roadmap'), 3400)
      .call(say('Modelling financials'), 4100)
      .add(beam, { opacity: 0, duration: 200 }, 4800)
      // 4. Result: pages fan out, the score is stamped on the top page
      .add(pages, { rotate: fanAngle, duration: 900, delay: stagger(50), ease: 'outBack(1.4)' }, 4900)
      .call(say('Brief ready'), 5600)
      .add($('[data-stamp]'), { opacity: [0, 1], scale: [2.4, 1], rotate: [-35, -12], duration: 420, ease: 'outBack(2)' }, 5800)
      // 5. Hold, then fold back up for the next idea
      .add($('[data-stamp], [data-status]'), { opacity: 0, duration: 250 }, 8200)
      .add(pages, { rotate: stackAngle, duration: 600, delay: stagger(40, { from: 'last' }), ease: 'inOutQuad' }, 8200)
      .add(lines, { scaleX: 0, scaleY: 0, duration: 300, ease: 'inQuad' }, 8700)

    // Don't burn frames while the panel is scrolled out of view
    const seen = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.resume() : tl.pause()))
    seen.observe(el)
    return () => {
      seen.disconnect()
      tl.revert()
    }
  }, [demo])

  useEffect(() => {
    if (demo) return
    const pages = Array.from(root.current!.querySelectorAll<HTMLElement>('[data-page]'))
    const s = Math.min(Math.max(step, 0), N - 1)
    const d = reducedMotion() ? 0 : 1

    pages.forEach((p, i) => { p.style.zIndex = String(i === s ? N : i) })
    animate(pages, {
      rotate: (_: unknown, i = 0) => slot(Math.min(i, s)),
      y: (_: unknown, i?: number) => (i === s ? -14 : 0),
      scale: (_: unknown, i?: number) => (i === s ? 1.06 : 1),
      duration: 700 * d,
      ease: 'outBack(1.3)',
    })

    // Only the current page carries the scanner
    pages.forEach((p, i) => utils.set(p.querySelectorAll('[data-page-beam]'), { opacity: i === s && d ? 1 : 0 }))

    // Finished pages are fully written; the current one writes line by line over the stage
    if (s > 0) utils.set(pages.slice(0, s).flatMap(linesOf), { scaleX: 1, scaleY: 1 })
    const writing = linesOf(pages[s])
    animate(writing, { scaleX: 1, scaleY: 1, duration: 500 * d, delay: stagger((WRITE_MS * d) / writing.length), ease: 'outExpo' })
  }, [demo, step])

  return (
    <div ref={root} aria-hidden className="relative h-full w-full select-none">
      {demo && (
        <>
          <div className="absolute inset-x-0 top-[6%] flex justify-center px-4">
            <div className="flex w-full max-w-[340px] items-center gap-2 border-3 border-ink bg-paper-card py-2 pl-3 pr-2 shadow-brutal-sm">
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                <span data-typed />
                <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-[3px] animate-pulse bg-ink" />
              </span>
              <span data-go className="border-2 border-ink bg-accent px-2 py-0.5 font-display text-xs font-black">GO</span>
            </div>
          </div>
          <div className="absolute inset-x-0 top-[calc(6%+52px)] flex justify-center">
            <span data-status className="border-2 border-ink bg-ink px-2 py-0.5 font-mono text-[11px] uppercase text-accent" />
          </div>
        </>
      )}

      <div className={`absolute inset-0 flex justify-center [perspective:1100px] ${demo ? 'items-end pb-[19%]' : 'items-center'}`}>
        <div className="relative aspect-[3/4] w-[30%] [transform:rotateX(14deg)_rotateY(-12deg)]">
          {SECTIONS.map((s, i) => (
            <Page key={s.id} i={i} beam={!demo}>
              {i === N - 1 && demo && (
                <span data-stamp className="absolute bottom-[14%] right-[6%] whitespace-nowrap border-3 border-ink bg-pink px-2 py-1 font-display text-[11px] font-black uppercase leading-none shadow-brutal-sm sm:text-sm">
                  Score 71
                </span>
              )}
            </Page>
          ))}
          {demo && (
            <div data-beam className="pointer-events-none absolute -inset-x-[12%] top-0 h-full">
              <div className="h-8 bg-gradient-to-b from-transparent to-accent/50" />
              <div className="h-2.5 border-y-2 border-ink bg-accent" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
