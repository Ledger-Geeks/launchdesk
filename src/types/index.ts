export interface ScoreItem    { label: string; value: number }
export interface Metric        { label: string; value: string }
export interface Segment       { name: string; size: string; description: string }
export interface Competitor    { name: string; threat: 'High'|'Medium'|'Low'; weakness: string }
export interface Feature       { name: string; priority: 'MVP'|'V2'|'Future'; description: string }
export interface Phase         { phase: string; timeline: string; title: string; description: string; milestones: string[] }
export interface StackItem     { role: string; tech: string; reason: string }
export interface Projection    { year: string; revenue: string; pct: number }
export interface Channel       { name: string; priority: 'Primary'|'Secondary'; description: string }

export interface Pitch {
  oneLiner: string
  problem: string
  solution: string
  uvp: string
  differentiators: string[]
  risks: string[]
  viabilityScore: number
  scoreBreakdown: ScoreItem[]
}

export interface Market {
  metrics: Metric[]
  segments: Segment[]
  competitors: Competitor[]
  competitiveSummary: string
  trends: string[]
}

export interface Product {
  features: Feature[]
  revenueStreams: string[]
  pricing: string
  kpis: string[]
}

export interface Roadmap {
  phases: Phase[]
  team: string[]
  funding: string
}

export interface Tech {
  stack: StackItem[]
  architecture: string
  mvpTimeline: string
  challenges: string[]
  services: string[]
}

export interface Finance {
  metrics: Metric[]
  projections: Projection[]
  costs: string[]
  fundingStrategy: string
  pitchPoints: string[]
}

export interface GTM {
  launchStrategy: string
  channels: Channel[]
  partnerships: string[]
  actionPlan: string[]
}

export interface Blueprint {
  pitch:   Pitch
  market:  Market
  product: Product
  roadmap: Roadmap
  tech:    Tech
  finance: Finance
  gtm:     GTM
  website: string
}