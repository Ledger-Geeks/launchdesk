import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

// ponytail: runs api/blueprint.ts inside `npm run dev` so local work needs no Vercel CLI.
// Single route on purpose; add a router when a second /api file appears.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''))
      server.middlewares.use('/api/blueprint', async (req, res) => {
        let body = ''
        for await (const chunk of req) body += chunk
        const { POST } = await server.ssrLoadModule('/api/blueprint.ts')
        const response: Response = await POST(new Request(`http://${req.headers.host}/api/blueprint`, {
          method: 'POST',
          headers: { host: req.headers.host ?? '', origin: req.headers.origin ?? '' },
          body,
        }))
        res.statusCode = response.status
        res.setHeader('Content-Type', 'application/json')
        res.end(await response.text())
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), devApi()],
})
