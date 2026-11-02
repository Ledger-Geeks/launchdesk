import { lazy, Suspense, useState } from 'react'
import Landing from './components/Landing'
import Loading from './components/Loading'
import { generateBlueprint } from './lib/api'
import type { Blueprint } from './types'

// Output and its 8 panels are only needed after a result exists, so they ship as a separate chunk.
// The download starts on submit and finishes while the AI is still working.
const loadOutput = () => import('./components/Output')
const Output = lazy(loadOutput)

type AppState = 'hero' | 'loading' | 'output'

export default function App() {
  const [state, setState] = useState<AppState>('hero')
  const [idea, setIdea] = useState('')
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null)
  const [error, setError] = useState('')

  async function handleLaunch(userIdea: string) {
    setIdea(userIdea)
    setError('')
    setState('loading')
    window.scrollTo({ top: 0 })
    loadOutput()

    try {
      const data = await generateBlueprint(userIdea)
      setBlueprint(data)
      setState('output')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error'
      setError(msg)
      setState('hero')
    }
  }

  function handleReset() {
    setState('hero')
    setBlueprint(null)
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {state === 'hero' && <Landing onLaunch={handleLaunch} error={error} />}
      {state === 'loading' && <Loading />}
      {state === 'output' && blueprint && (
        <Suspense fallback={<Loading />}>
          <Output blueprint={blueprint} idea={idea} onReset={handleReset} />
        </Suspense>
      )}
    </>
  )
}
