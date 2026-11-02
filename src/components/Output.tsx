import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Blueprint } from '../types'
import { SECTIONS, type SectionId } from '../sections'
import { Wordmark } from './ui'
import PitchPanel from './panels/PitchPanel'
import MarketPanel from './panels/MarketPanel'
import ProductPanel from './panels/ProductPanel'
import RoadmapPanel from './panels/RoadmapPanel'
import TechPanel from './panels/TechPanel'
import FinancePanel from './panels/FinancePanel'
import GTMPanel from './panels/GTMPanel'
import WebsitePanel from './panels/WebsitePanel'

interface OutputProps {
  blueprint: Blueprint
  idea: string
  onReset: () => void
}

export default function Output({ blueprint, idea, onReset }: OutputProps) {
  const [activeTab, setActiveTab] = useState<SectionId>('pitch')

  function renderPanel() {
    switch (activeTab) {
      case 'pitch':   return <PitchPanel data={blueprint.pitch} />
      case 'market':  return <MarketPanel data={blueprint.market} />
      case 'product': return <ProductPanel data={blueprint.product} />
      case 'roadmap': return <RoadmapPanel data={blueprint.roadmap} />
      case 'tech':    return <TechPanel data={blueprint.tech} />
      case 'finance': return <FinancePanel data={blueprint.finance} />
      case 'gtm':     return <GTMPanel data={blueprint.gtm} />
      case 'website': return <WebsitePanel html={blueprint.website} />
    }
  }

  return (
    <div className="pb-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <header className="flex h-[72px] items-center justify-between border-b-3 border-ink">
          <Wordmark />
          <button
            onClick={onReset}
            className="btn-brutal bg-paper-card px-4 py-2 text-xs shadow-brutal-sm"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} /> New idea
          </button>
        </header>

        <div className="max-w-3xl animate-fade-up pb-10 pt-12">
          <p className="inline-block -rotate-1 border-3 border-ink bg-pink px-3 py-1 font-display text-sm font-black uppercase">Brief prepared for</p>
          <h1 className="mt-5 line-clamp-3 font-display text-3xl font-black leading-[1.02] text-ink md:text-5xl">{idea}</h1>
        </div>
      </div>

      <nav className="sticky top-0 z-40 border-y-3 border-ink bg-paper-card">
        <div role="tablist" className="mx-auto flex max-w-7xl overflow-x-auto px-4 [scrollbar-width:none] md:px-8">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              aria-selected={activeTab === id}
              onClick={() => setActiveTab(id)}
              className={`-mb-px flex shrink-0 items-center gap-2 border-b-2 px-4 py-3.5 text-sm transition-colors ${
                activeTab === id ? 'border-ink bg-accent font-bold text-ink' : 'border-transparent text-ink-soft hover:bg-paper-deep hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2.5} /> {label}
            </button>
          ))}
        </div>
      </nav>

      <div role="tabpanel" key={activeTab} className="mx-auto max-w-7xl animate-fade-up px-4 pt-10 md:px-8">
        {renderPanel()}
      </div>
    </div>
  )
}
