import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export const BRAND = 'LaunchDesk'

// Yellow desk tile with an upward launch arrow and a hard offset shadow.
// The arrow lifts on hover; the tile and shadow stay put.
export function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} aria-hidden>
      <rect x="6" y="6" width="28" height="28" fill="#121212" />
      <rect x="2" y="2" width="28" height="28" fill="#FFD60A" stroke="#121212" strokeWidth="3" />
      <path
        d="M16 7 L24 15.5 H19.5 V25 H12.5 V15.5 H8 Z"
        fill="#121212"
        className="transition-transform duration-300 group-hover:-translate-y-[3px]"
      />
    </svg>
  )
}

export function Wordmark() {
  return (
    <span className="group flex items-center gap-2.5 whitespace-nowrap font-display text-lg font-black uppercase tracking-tight text-ink sm:text-xl">
      <Logo />
      {BRAND}
    </span>
  )
}

export function Section({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 border-t-3 border-ink py-9 md:grid-cols-[220px_1fr] md:gap-10">
      <h3 className="flex items-center gap-3 self-start font-display text-sm font-extrabold uppercase tracking-wide text-ink">
        <span className="grid h-8 w-8 shrink-0 place-items-center border-3 border-ink bg-accent">
          <Icon className="h-4 w-4" strokeWidth={2.5} />
        </span>
        {title}
      </h3>
      <div className="min-w-0">{children}</div>
    </section>
  )
}

// Fills, not text colours: every tone keeps ink text for contrast
const TONES = {
  neutral: 'bg-paper-card',
  good:    'bg-[#B8F2C9]',
  warn:    'bg-accent',
  bad:     'bg-pink',
}
export type Tone = keyof typeof TONES

export function Tag({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex items-center border-2 border-ink px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink ${TONES[tone]}`}>
      {children}
    </span>
  )
}

export function Chips({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <span key={item} className="border-2 border-ink bg-paper-card px-3 py-1 text-[13px] font-medium text-ink shadow-brutal-sm">{item}</span>
      ))}
    </div>
  )
}

export function MetricGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {items.map(m => (
        <div key={m.label} className="border-3 border-ink bg-paper-card p-5 shadow-brutal-sm">
          <dt className="font-mono text-xs uppercase text-ink-faint">{m.label}</dt>
          <dd className="mt-2 font-display text-3xl font-black leading-none text-ink">{m.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export function ProgressRow({ label, value, pct, delay = 0 }: { label: string; value: string; pct: number; delay?: number }) {
  // Model output is untrusted: clamp so a bad number can't break the layout
  const width = Math.min(100, Math.max(0, Number(pct) || 0))
  return (
    <div>
      <div className="mb-1.5 flex justify-between gap-4 text-sm font-medium">
        <span className="text-ink-soft">{label}</span>
        <span className="font-mono text-ink">{value}</span>
      </div>
      <div className="h-4 border-2 border-ink bg-paper-card">
        <div className="h-full origin-left animate-grow border-r-2 border-ink bg-accent" style={{ width: `${width}%`, animationDelay: `${delay}ms` }} />
      </div>
    </div>
  )
}

export function Entry({ title, tag, children }: { title: string; tag?: ReactNode; children: ReactNode }) {
  return (
    <div className="border-b-2 border-ink/15 py-4 first:pt-0 last:border-0 last:pb-0">
      <div className="mb-1.5 flex flex-wrap items-center gap-2.5">
        <span className="font-bold text-ink">{title}</span>
        {tag}
      </div>
      <BodyText>{children}</BodyText>
    </div>
  )
}

export function SubHead({ children }: { children: ReactNode }) {
  return <h4 className="mb-2 mt-6 font-display text-sm font-extrabold uppercase text-ink first:mt-0">{children}</h4>
}

export function BodyText({ children }: { children: ReactNode }) {
  return <p className="max-w-[65ch] text-[15px] leading-relaxed text-ink-soft">{children}</p>
}

export function BodyList({ items }: { items: string[] }) {
  return (
    <ol className="max-w-[65ch] space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
          <span className="mt-[3px] font-mono text-xs font-medium text-ink">{String(i + 1).padStart(2, '0')}</span>
          {item}
        </li>
      ))}
    </ol>
  )
}
