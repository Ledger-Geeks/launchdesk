// Security-path check for api/blueprint.ts. Run: npm run check:api (Node 22.18+ / 24, no deps)
// Kept outside api/ because Vercel deploys every file in api/ as a public function.
import assert from 'node:assert/strict'

const valid = { pitch: {}, market: {}, product: {}, roadmap: {}, tech: {}, finance: {}, gtm: {}, website: '<p>hi</p>' }
let modelContent = JSON.stringify(valid)
globalThis.fetch = (async () => Response.json({ choices: [{ message: { content: modelContent } }] })) as typeof fetch
process.env.OPENROUTER_API_KEY = 'test-key'

const { POST } = await import('../api/blueprint.ts')

const call = (body: unknown, { ip = crypto.randomUUID(), origin = 'http://app.test' } = {}) =>
  POST(new Request('http://app.test/api/blueprint', {
    method: 'POST',
    headers: { host: 'app.test', origin, 'x-real-ip': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  }))

const idea = { idea: 'Inventory tracking for independent restaurants' }

assert.equal((await call(idea, { origin: 'https://evil.example' })).status, 403, 'cross-site origin blocked')
assert.equal((await call(idea, { origin: 'null' })).status, 403, 'sandboxed origin blocked')
assert.equal((await call('{not json')).status, 400, 'bad JSON rejected')
assert.equal((await call({ idea: 'short' })).status, 400, 'too-short idea rejected')
assert.equal((await call({ idea: 'x'.repeat(2001) })).status, 400, 'too-long idea rejected')
assert.equal((await call('x'.repeat(10_001))).status, 413, 'oversized body rejected')

const ok = await call(idea)
assert.equal(ok.status, 200)
assert.equal((await ok.json()).website, '<p>hi</p>', 'valid blueprint passed through')

modelContent = '{"pitch":{}}'
assert.equal((await call(idea)).status, 502, 'incomplete model output rejected')
modelContent = JSON.stringify(valid)

// Daily quota: 5 per IP per UTC day (AI_DAILY_LIMIT unset). Clock pinned to 20:00 UTC.
const realNow = Date.now
let now = Date.UTC(2026, 0, 1, 20)
Date.now = () => now
for (let i = 0; i < 5; i++) assert.equal((await call(idea, { ip: '1.2.3.4' })).status, 200)
const over = await call(idea, { ip: '1.2.3.4' })
assert.equal(over.status, 429, '6th request in a day refused')
assert.equal(over.headers.get('retry-after'), String(4 * 3600))
assert.deepEqual(await over.json(), { error: 'Daily AI limit reached (5 per day). Try again in 4h.', remaining: 0, resetInSec: 4 * 3600 })
assert.equal((await call(idea, { ip: '5.6.7.8' })).status, 200, 'other IPs keep their own quota')
now += 4 * 3600_000
assert.equal((await call(idea, { ip: '1.2.3.4' })).status, 200, 'quota resets at UTC midnight')
Date.now = realNow

delete process.env.OPENROUTER_API_KEY
assert.equal((await call(idea)).status, 500, 'missing key fails closed')

console.log('api/blueprint.ts: all checks passed')
