import type { Blueprint } from '../types'

export async function generateBlueprint(idea: string): Promise<Blueprint> {
  const res = await fetch('/api/blueprint', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea }),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok || !data) throw new Error(data?.error || `Request failed (${res.status})`)
  return data as Blueprint
}
