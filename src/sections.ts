import { Target, BarChart3, Wrench, Map as MapIcon, Code2, Wallet, Rocket, Globe } from 'lucide-react'

// Single source for the hero's "what you get" list and the output tabs.
export const SECTIONS = [
  { id: 'pitch',   label: 'Pitch',        icon: Target,    blurb: 'One-liner, viability score, key risks' },
  { id: 'market',  label: 'Market',       icon: BarChart3, blurb: 'Market size, segments, competitors' },
  { id: 'product', label: 'Product',      icon: Wrench,    blurb: 'MVP scope, pricing, KPIs' },
  { id: 'roadmap', label: 'Roadmap',      icon: MapIcon,   blurb: 'Four phases with milestones and hires' },
  { id: 'tech',    label: 'Tech stack',   icon: Code2,     blurb: 'Stack choices and why each fits' },
  { id: 'finance', label: 'Financials',   icon: Wallet,    blurb: 'Raise, breakeven, CAC and LTV' },
  { id: 'gtm',     label: 'Go-to-market', icon: Rocket,    blurb: 'Channels and a 90-day plan' },
  { id: 'website', label: 'Landing page', icon: Globe,     blurb: 'A draft page you can download' },
] as const

export type SectionId = typeof SECTIONS[number]['id']
