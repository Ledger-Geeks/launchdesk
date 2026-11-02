import { Download } from 'lucide-react'

export default function WebsitePanel({ html }: { html: string }) {
  function download() {
    const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'landing-page.html'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url))
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden border-3 border-ink shadow-brutal">
        <div className="flex items-center gap-3 border-b-3 border-ink bg-paper-deep px-4 py-2.5">
          <div className="flex gap-1.5">{[0, 1, 2].map(i => <span key={i} className="h-3 w-3 border-2 border-ink bg-paper-card" />)}</div>
          <span className="flex-1 border-2 border-ink bg-paper-card px-3 py-1 font-mono text-xs text-ink-soft">preview</span>
        </div>
        {/* Empty sandbox: AI-written HTML gets no scripts, no forms, no same-origin access */}
        <iframe srcDoc={html} sandbox="" title="Landing page preview" className="block h-[640px] w-full bg-white" />
      </div>
      <button
        onClick={download}
        className="btn-brutal bg-accent"
      >
        <Download className="h-4 w-4" strokeWidth={2.5} /> Download HTML
      </button>
    </div>
  )
}
