<div align="center">

# LaunchDesk

### Turn your idea into a complete startup blueprint — instantly.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-6366F1?style=for-the-badge)](https://adithya17-star.github.io/startup-copilot/)
[![Built With](https://img.shields.io/badge/Built%20With-React%20%2B%20TypeScript-14B8A6?style=for-the-badge)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)](LICENSE)

</div>

---

## 🧠 What is LaunchDesk?

**LaunchDesk** is an AI-powered platform that transforms any startup idea into a complete, actionable business blueprint in seconds. No consultants, no expensive tools, no fluff — just instant, structured insights to help entrepreneurs move fast.

> Type your idea. Get a full business plan, market analysis, tech stack, roadmap, financial model, and a ready-to-deploy landing page.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 🎯 **Pitch Analysis** | Viability score, one-liner pitch, problem/solution, UVP, and key risks |
| 📊 **Market Research** | TAM/SAM sizing, target segments, competitor landscape, and market trends |
| 🛠️ **Product Planning** | MVP feature prioritization, revenue streams, pricing strategy, and KPIs |
| 🗺️ **Execution Roadmap** | 4-phase plan with milestones, team requirements, and funding strategy |
| 💻 **Tech Stack** | Recommended technologies, architecture overview, and third-party services |
| 💰 **Financial Model** | 3-year revenue projections, cost structure, and investor pitch points |
| 🚀 **Go-to-Market** | Launch strategy, acquisition channels, and 90-day action plan |
| 🌐 **Landing Page** | Auto-generated, downloadable HTML landing page for your startup |

---

## 🖥️ Tech Stack

- **Frontend** — React 18 + TypeScript
- **Build Tool** — Vite 6
- **Styling** — Tailwind CSS 3, neo-brutalist (Archivo + Geist), lucide-react icons
- **Animation** — anime.js storyboard (`BriefDemo.tsx`): idea typed, scanned, returned as a fanned brief
- **AI** — OpenAI Chat Completions (model set by `OPENAI_MODEL`)
- **Deployment** — Vercel (static frontend + one serverless function)
- **Architecture** — React SPA; `api/blueprint.ts` holds the API key and prompt server-side. The results view is lazy-loaded.

### Security model

- The OpenAI key lives only in the server environment (`OPENAI_API_KEY`, no `VITE_` prefix), so it is never in the browser bundle.
- The API accepts only `{ idea }`. The model, prompt and token limit are fixed on the server, so the endpoint cannot be used as a general-purpose LLM proxy.
- Requests are checked for same origin, body size and idea length (10-2000 chars), and rate-limited per IP.
- Provider errors are logged on the server only. The client gets a generic message.
- The AI-generated landing page renders in an `<iframe sandbox="">`, so its scripts, forms and same-origin access are all blocked.
- `vercel.json` sets CSP, HSTS, `nosniff`, Referrer-Policy and Permissions-Policy headers.
- **Also do this:** set a monthly budget limit on your OpenAI project. It is the only hard cap on spend.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Run Locally

```bash
git clone https://github.com/Adithya17-star/startup-copilot.git
cd startup-copilot
npm install
cp .env.example .env.local   # then add your OPENAI_API_KEY
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/). `npm run dev` also serves `/api/blueprint`, so you don't need the Vercel CLI.

### Check the API's security paths

```bash
npm run check:api
```

### Deploy

Import the repo in Vercel, then set `OPENAI_API_KEY` (and optionally `OPENAI_MODEL`) under Project → Settings → Environment Variables.

---

## 📁 Project Structure

```text
startup-copilot/
├── api/
│   └── blueprint.ts        # server: key, prompt, validation, rate limit
├── scripts/
│   └── check-api.ts        # runnable security checks for the API
├── src/
│   ├── components/
│   │   ├── Hero.tsx
│   │   ├── Loading.tsx
│   │   ├── Output.tsx
│   │   ├── ui.tsx
│   │   └── panels/
│   │       ├── PitchPanel.tsx
│   │       ├── MarketPanel.tsx
│   │       ├── ProductPanel.tsx
│   │       ├── RoadmapPanel.tsx
│   │       ├── TechPanel.tsx
│   │       ├── FinancePanel.tsx
│   │       ├── GTMPanel.tsx
│   │       └── WebsitePanel.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── index.ts
│   ├── sections.ts          # tab list shared by hero and results
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── vercel.json              # security headers
├── vite.config.ts
└── tailwind.config.js
```

---

## 🌐 Live Demo

**[https://adithya17-star.github.io/startup-copilot/](https://adithya17-star.github.io/startup-copilot/)**

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin main`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Made with ❤️ by [Adithya17-star](https://github.com/Adithya17-star)

</div>