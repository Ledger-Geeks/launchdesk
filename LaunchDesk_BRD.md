# LaunchDesk: Business Requirements Document

| | |
|---|---|
| **Product** | LaunchDesk |
| **Category** | AI: startup blueprint and business plan generator |
| **Version** | 1.0 |
| **Owner** | LedgerGeeks |
| **Date** | 2 November 2026 |
| **Status** | Built and running locally |

---

## 1. Product overview

LaunchDesk is a web app that turns a short description of a startup idea into a complete startup brief. The founder types one or two sentences. LaunchDesk returns eight sections: pitch, market, product, roadmap, tech stack, financials, go-to-market, and a draft landing page that can be downloaded as an HTML file. Everything comes back in one request, usually within one to two minutes.

---

## 2. Problem statement

Early-stage founders often have an idea but no structured way to test it. Turning an idea into a pitch, a market estimate, a roadmap and a financial outline takes days of research, or money spent on consultants and templates. Most first-time founders skip this step and start building before they know who the customer is, what to charge, or what to build first.

The people with this problem:

- First-time founders and solo builders deciding whether an idea is worth pursuing
- Students and hackathon teams who need a credible plan in hours, not weeks
- Product and innovation teams inside companies screening many ideas quickly

---

## 3. Target users

| Persona | Role | Goal | Pain point |
|---|---|---|---|
| **Sara, first-time founder** | Former operations manager with a side-project idea | Decide in one evening whether the idea deserves a weekend of work | Doesn't know how to size a market or structure a pitch, and can't afford a consultant |
| **Ali, hackathon team lead** | University student leading a team of four | Produce a pitch, roadmap and landing page before demo day | Has 24 to 48 hours and needs to split time between building and presenting |
| **Hina, innovation analyst** | Works in a corporate innovation team | Screen 10 to 20 internal ideas a month with a consistent first-pass format | Every idea arrives in a different format, so comparing them is slow |

---

## 4. Value proposition

- **One input, eight outputs.** A single idea produces a full brief, not just a chat reply that has to be prompted section by section.
- **A consistent structure every time.** Every brief has the same eight sections and the same fields, so ideas can be compared side by side.
- **Something to ship, not just read.** The landing page draft downloads as a self-contained HTML file that can be put online straight away.
- **No sign-up, no data kept.** The idea is sent to the AI to generate the brief and is not stored by LaunchDesk.
- **Safe by design.** The AI key stays on the server, the endpoint can't be reused as a general AI proxy, and the generated landing page runs in a locked-down preview.

Compared with alternatives: general AI chat tools need many prompts and give a different structure every time. Business plan templates need hours of manual work. Consultants are slow and expensive.

---

## 5. Goals and success metrics

These are product targets for this version. They are not yet measured in production.

| Goal | Metric | Target |
|---|---|---|
| Fast first result | Time from submit to finished brief | Under 120 seconds for 95% of requests (the server times out at 120 seconds) |
| Reliable output | Requests that return a complete brief with all 8 sections | 95% or more |
| Clear failures | Failed requests that show a readable error and return the user to the form | 100% |
| Fast landing page | Main page JavaScript (gzipped) | Under 100 KB. The current build is 72 KB. |
| Controlled cost | Briefs per visitor IP per 10 minutes | At most 5 |
| Useful output | Users who download the landing page or open 3 or more tabs | 40% or more of completed briefs |

---

## 6. Scope

### In scope (v1.0)

- Landing page with idea input, example ideas, product explanation, sample output and FAQ
- Idea input with live character count and length limits (10 to 2,000 characters)
- Loading screen with an animated preview while the brief is generated
- Results view with eight tabs: Pitch, Market, Product, Roadmap, Tech stack, Financials, Go-to-market, Landing page
- Landing page preview in a sandboxed frame, plus HTML download
- Server-side AI endpoint with input validation, same-origin check and per-IP rate limiting
- Security headers for the deployed site
- Runs locally with a single command, and deploys to Vercel

### Out of scope (v1.0)

- User accounts, login, or saved history of briefs
- Editing a brief or regenerating a single section
- Export of the full brief to PDF, Word or slides
- Payments or usage plans
- Local AI models through Ollama (see section 14)
- Multiple languages
- Verified market data from external research sources

---

## 7. Functional requirements

| ID | Requirement |
|---|---|
| FR-1 | The system shall show a landing page with an idea input box, a submit button, example ideas, a "how it works" section, a list of the eight output sections, a sample output and an FAQ. |
| FR-2 | The system shall let the user fill the input box by clicking one of four example ideas. |
| FR-3 | The system shall show a live character count and stop input at 2,000 characters. |
| FR-4 | The system shall keep the submit button disabled until the idea has at least 10 characters (ignoring leading and trailing spaces). |
| FR-5 | The system shall submit the idea when the user clicks the button or presses Ctrl+Enter (Cmd+Enter on Mac). |
| FR-6 | The system shall show a loading screen with eight named stages and an animated preview while the brief is generated. |
| FR-7 | The server shall reject requests from another website's origin with a "Forbidden" error (HTTP 403). |
| FR-8 | The server shall reject a request body larger than 10,000 characters (HTTP 413), invalid JSON (HTTP 400), and ideas shorter than 10 or longer than 2,000 characters (HTTP 400). |
| FR-9 | The server shall allow at most 5 requests per IP address in any 10-minute window and reject further requests with HTTP 429. |
| FR-10 | The server shall send the idea to the AI model with a fixed prompt and ask for a JSON response that follows a fixed schema. |
| FR-11 | The server shall check that the AI response contains all eight sections and that the landing page is text. If not, it shall return a readable error (HTTP 502). |
| FR-12 | The server shall return a generic error to the user and log the detailed provider error only on the server. |
| FR-13 | The server shall fail safely with "Server is not configured" (HTTP 500) when no AI key is set. |
| FR-14 | When generation fails, the system shall return the user to the landing page and show the error message below the input. |
| FR-15 | When generation succeeds, the system shall show the results view with the idea as the heading and eight tabs. |
| FR-16 | The Pitch tab shall show the one-line pitch, a viability score out of 100 with a four-part breakdown, the problem, the solution, the unique value, three differentiators and three key risks. |
| FR-17 | The Market tab shall show four market metrics, target segments with size, competitors with threat level and weakness, a competitive summary and market trends. |
| FR-18 | The Product tab shall show features labeled MVP, V2 or Future, revenue streams, pricing and KPIs. |
| FR-19 | The Roadmap tab shall show four phases with timeline, title, description and milestones, plus the team needed and the funding approach. |
| FR-20 | The Tech stack tab shall show the recommended technology per role with the reason, the architecture, the MVP timeline, technical challenges and third-party services. |
| FR-21 | The Financials tab shall show seed raise, breakeven, CAC and LTV, a three-year revenue projection with progress bars, costs, funding strategy and investor pitch points. |
| FR-22 | The Go-to-market tab shall show the launch strategy, primary and secondary channels, partnerships and an action plan. |
| FR-23 | The Landing page tab shall show the AI-written page in a fully sandboxed preview where scripts, forms and same-origin access are blocked. |
| FR-24 | The Landing page tab shall let the user download the page as `landing-page.html`. |
| FR-25 | The system shall return the user to an empty landing page when they click "New idea". |
| FR-26 | The system shall show the results view correctly even if the AI leaves out a list in any section (the list is shown as empty instead of crashing). |

---

## 8. User stories and flows

### User stories

1. As a **first-time founder**, I want to describe my idea in a sentence or two so that I get a structured plan without writing prompts.
2. As a **founder**, I want a viability score with a breakdown so that I know which part of the idea is weakest.
3. As a **founder**, I want market size, segments and competitors so that I know who I'm selling to and who I'm up against.
4. As a **hackathon team lead**, I want a four-phase roadmap and a tech stack so that my team can split the work quickly.
5. As a **hackathon team lead**, I want a downloadable landing page so that I can show a live page at demo day.
6. As an **innovation analyst**, I want every brief in the same format so that I can compare ideas side by side.
7. As a **user with an unclear idea**, I want example ideas I can click so that I understand what a good input looks like.
8. As a **user**, I want a clear error message when something fails so that I know to try again.

### Main flow: generate a brief

1. The user opens LaunchDesk and sees the landing page.
2. The user types an idea, or clicks an example idea to fill the box.
3. The submit button becomes active once the idea has 10 or more characters.
4. The user clicks the button or presses Ctrl+Enter.
5. LaunchDesk shows the loading screen and starts loading the results view in the background.
6. The server validates the request and sends the idea to the AI model.
7. The AI returns the brief as JSON. The server checks that all eight sections are present.
8. LaunchDesk shows the results view, opened on the Pitch tab.
9. The user moves between the eight tabs.

### Flow: download the landing page

1. From the results view, the user opens the Landing page tab.
2. The user checks the page in the preview frame.
3. The user clicks "Download HTML" and gets `landing-page.html`.
4. The user can open the file in a browser or upload it to any static host.

### Flow: error and retry

1. The user submits an idea.
2. The server rejects it (rate limit, invalid input) or the AI fails (timeout, error, incomplete response).
3. LaunchDesk returns to the landing page with the error message shown below the input.
4. The user fixes the input or waits, then submits again.

### Flow: start over

1. From the results view, the user clicks "New idea".
2. LaunchDesk clears the brief and shows the landing page.

---

## 9. Non-functional requirements

### Security

- The AI key is stored only in the server environment (`OPENAI_API_KEY`, no `VITE_` prefix). It is never included in the browser bundle.
- The endpoint accepts only `{ idea }`. The model, prompt and token limit are fixed on the server, so the endpoint can't be used as a general AI proxy.
- Same-origin check blocks other websites from using the endpoint.
- Body size, JSON format and idea length are validated before any AI call.
- Per-IP rate limit of 5 requests per 10 minutes.
- Provider error details are logged only on the server.
- The AI-written landing page runs in `<iframe sandbox="">`: no scripts, no forms, no same-origin access.
- The prompt tells the model to treat the idea as a description only, never as instructions (prompt-injection guard).
- Security headers: Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy and Permissions-Policy.
- `.env.local` holds local secrets and is ignored by git. `.env.example` has placeholders only.

### Performance

- The results view is a separate code chunk, downloaded while the AI is working, so the first page stays small (72 KB gzipped JavaScript).
- One AI request per brief. There is no streaming or multi-step chain.
- The server stops waiting for the AI after 120 seconds.

### Reliability

- The AI is asked for a JSON-only response, and the server checks the response shape before returning it.
- The interface handles missing lists in any section without crashing.
- Every failure path returns a readable message, and the user can retry right away.

### Usability and accessibility

- Works on mobile and desktop.
- Animations are turned off for users who set "reduce motion" in their system settings.
- Results use proper tab roles (`tablist`, `tab`, `tabpanel`) with the selected state marked.
- Plain-language FAQ explains data handling and how reliable the numbers are.

### Maintainability

- TypeScript strict mode. Build, type check and lint all pass with zero errors.
- `npm run check:api` runs automated checks for every security path of the API.

---

## 10. System architecture

```text
┌──────────────────────────────┐
│ Browser (React single page)  │
│                              │
│  Landing ─► Loading ─► Results (8 tabs)
│                     │        │
│                     │        └─ Landing page preview
│                     │           (iframe sandbox="")
└─────────────────────┼────────┘
                      │ POST /api/blueprint  { idea }
                      ▼
┌──────────────────────────────┐
│ Server function               │
│ api/blueprint.ts              │
│                               │
│ 1. Same-origin check          │
│ 2. Rate limit (per IP)        │
│ 3. Size, JSON, length checks  │
│ 4. Fixed prompt + model       │
│ 5. Response shape check       │
└──────────────┬───────────────┘
               │ HTTPS, server-held key
               ▼
┌──────────────────────────────┐
│ OpenAI Chat Completions API   │
│ (JSON response mode)          │
└──────────────────────────────┘
```

**How the parts connect.** The browser app is a static React build. When the user submits an idea, the app sends only the idea text to `/api/blueprint`. The server function runs every check, then calls OpenAI with the API key that only the server knows. OpenAI returns the brief as JSON. The server confirms it has all eight sections and sends it back to the browser, which shows it in tabs. No database is involved, and nothing is stored.

**Local and deployed setups.** Locally, `npm run dev` runs the same server function inside the Vite dev server, so no extra tools are needed. On Vercel, the `dist` folder is served as static files and `api/blueprint.ts` runs as a serverless function. `vercel.json` adds the security headers.

---

## 11. Tech stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React, React DOM | 18.3.1 |
| Language | TypeScript (strict mode) | 5.6.3 |
| Build tool and dev server | Vite | 6.3.5 |
| React plugin for Vite | @vitejs/plugin-react | 4.4.1 |
| Styling | Tailwind CSS | 3.4.17 |
| CSS processing | PostCSS, Autoprefixer | 8.5.3, 10.4.21 |
| Icons | lucide-react | 0.344.0 |
| Animation | anime.js | 4.5.0 |
| Fonts | Archivo, Geist, Geist Mono (Google Fonts) | n/a |
| Backend | Vercel serverless function (Web `Request`/`Response` API) | Node.js 18+ |
| AI | OpenAI Chat Completions API, JSON response mode | Model set by `OPENAI_MODEL`, default `gpt-5.5` |
| Linting | ESLint, typescript-eslint, react-hooks and react-refresh plugins | 9.12.0, 8.8.1 |
| Hosting | Vercel | n/a |
| Database | None | n/a |
| Blockchain | None | n/a |

---

## 12. Integrations

| Service | Used for | Notes |
|---|---|---|
| **OpenAI API** (`api.openai.com/v1/chat/completions`) | Generating the full brief from the idea | Called only from the server. Key set in `OPENAI_API_KEY`, model in `OPENAI_MODEL`. JSON response mode, 16,000-token output limit, 120-second timeout. |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | Loading the Archivo, Geist and Geist Mono fonts | The only external sources allowed by the Content-Security-Policy. |
| **Vercel** | Hosting the static site and the serverless function, and applying security headers | Environment variables are set in the Vercel project settings. |

---

## 13. Data model

LaunchDesk has no database. Data exists only in the request, the response and the browser's memory, and is gone when the page closes.

### Request

| Field | Type | Rules |
|---|---|---|
| `idea` | string | 10 to 2,000 characters after trimming. Body at most 10,000 characters. |

### Blueprint (response)

| Entity | Fields |
|---|---|
| **Blueprint** | `pitch`, `market`, `product`, `roadmap`, `tech`, `finance`, `gtm` (objects), `website` (HTML string) |
| **Pitch** | `oneLiner`, `problem`, `solution`, `uvp`, `differentiators[]`, `risks[]`, `viabilityScore` (0 to 100), `scoreBreakdown[]` of ScoreItem |
| **Market** | `metrics[]` of Metric, `segments[]` of Segment, `competitors[]` of Competitor, `competitiveSummary`, `trends[]` |
| **Product** | `features[]` of Feature, `revenueStreams[]`, `pricing`, `kpis[]` |
| **Roadmap** | `phases[]` of Phase, `team[]`, `funding` |
| **Tech** | `stack[]` of StackItem, `architecture`, `mvpTimeline`, `challenges[]`, `services[]` |
| **Finance** | `metrics[]` of Metric, `projections[]` of Projection, `costs[]`, `fundingStrategy`, `pitchPoints[]` |
| **GTM** | `launchStrategy`, `channels[]` of Channel, `partnerships[]`, `actionPlan[]` |

### Shared types

| Type | Fields |
|---|---|
| ScoreItem | `label`, `value` (number 0 to 100) |
| Metric | `label`, `value` (text, for example "$4.2B") |
| Segment | `name`, `size`, `description` |
| Competitor | `name`, `threat` (High, Medium or Low), `weakness` |
| Feature | `name`, `priority` (MVP, V2 or Future), `description` |
| Phase | `phase`, `timeline`, `title`, `description`, `milestones[]` |
| StackItem | `role`, `tech`, `reason` |
| Projection | `year`, `revenue`, `pct` (number used for the bar width) |
| Channel | `name`, `priority` (Primary or Secondary), `description` |

### Relationships

One request produces one Blueprint. A Blueprint contains exactly one of each of the seven section objects plus one website string. Each section owns its lists of the shared types. Nothing is linked across requests.

### Server-side state

| Item | Type | Lifetime |
|---|---|---|
| Rate-limit log | Map of IP address to request timestamps | In memory, per server instance. Resets when the instance restarts. |

---

## 14. Assumptions and constraints

### Assumptions

- Users have an internet connection and a modern browser (Chrome, Edge, Firefox or Safari, current versions).
- The operator has an OpenAI API key with access to the configured model, and has set a monthly spending limit on the OpenAI project.
- The brief is a starting point for decisions, not verified research. Market sizes and financial figures are AI estimates, and the FAQ tells users this.
- Users don't put confidential information in the idea, because it is sent to OpenAI.

### Constraints

- **Cloud AI only.** This version calls the OpenAI API. It does not run on a local Ollama model, because the API address is fixed to OpenAI. Supporting Ollama would need a configurable base URL, and a local model would have to reliably return the full JSON schema.
- **Rate limit is per server instance.** On Vercel, separate instances keep separate counts, and counts reset on cold start. This is accepted for v1.0. A shared store such as Vercel Firewall rules or Redis is the upgrade path.
- **Generation time** depends on the AI model and its current load. It can approach the 120-second timeout for long briefs.
- **Hosting must run server functions.** Static-only hosts such as GitHub Pages can't run `/api/blueprint`.
- **Node.js 22.18 or later** is needed to run `npm run check:api`, because it runs a TypeScript file directly. Node.js 18 or later is enough to run and build the app.

### Fixes made to the original project

| # | Problem in the original | Fix |
|---|---|---|
| 1 | The AI key was a `VITE_` variable, so it was built into the public JavaScript bundle and visible to anyone using the deployed site. The browser called the AI provider directly. | Moved the AI call to a server function (`api/blueprint.ts`). The key now lives only on the server. |
| 2 | The browser sent the full prompt, model and token limit, so anyone could reuse the key as a free AI proxy. | The server accepts only `{ idea }`. The model, prompt and limits are fixed on the server. |
| 3 | No input limits, origin check or rate limit. | Added same-origin check, body size limit, idea length limit (10 to 2,000) and a per-IP rate limit. |
| 4 | Provider error messages were shown directly to users. | Errors are logged on the server, and users get a generic message. |
| 5 | The AI response was cleaned up by stripping code fences and searching for braces, which broke easily. | Uses the provider's JSON response mode and checks that all eight sections are present. |
| 6 | The generated landing page preview allowed scripts (`sandbox="allow-scripts"`). | Preview now uses `sandbox=""`, which blocks scripts, forms and same-origin access. In testing, a script the AI added to a generated page was blocked. |
| 7 | Deployed to GitHub Pages, which can't run a server, so the secure setup was impossible there. | Moved deployment to Vercel (static site plus serverless function) and added `vercel.json` with security headers. |
| 8 | The root TypeScript config was misnamed `tsconfig..json`, so editors and `tsc -b` couldn't find it. | Renamed to `tsconfig.json`. |
| 9 | `npm run lint` failed because there was no ESLint config. | Added `eslint.config.js`. Lint now passes with zero problems. |
| 10 | `package.json` had a stray `"main": "eslint.config.js"` field and an ISC license that conflicted with the MIT license file. | Removed the stray field and set the license to MIT. |
| 11 | Running locally required the hosted setup. | `npm run dev` now also serves `/api/blueprint`, so no extra CLI is needed. |
| 12 | No automated checks. | Added `npm run check:api`, which tests every security path of the API. |

---

## 15. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| API key is leaked | Someone else's usage is billed to us | Key is server-only and never in the bundle. `.env.local` is ignored by git. Monthly spending limit is set on the OpenAI project. |
| Endpoint is abused for free AI access | High AI costs | Endpoint accepts only an idea with a fixed prompt, has a same-origin check and per-IP rate limit, and a spending cap is set at the provider. |
| Rate limit is bypassed across server instances | More requests get through than intended | Accepted for v1.0, with the spending cap as a backstop. Upgrade path: Vercel Firewall rule or Redis-based limit. |
| AI returns broken or incomplete JSON | User sees nothing useful | JSON response mode, server shape check, readable error, and instant retry. The interface tolerates missing lists. |
| AI-generated page contains harmful script or form | Script runs inside our site | Fully sandboxed preview (`sandbox=""`) and a Content-Security-Policy. The prompt also forbids scripts and external resources. |
| Prompt injection inside the idea text | Model ignores the schema or produces unwanted output | Idea is wrapped as quoted data, and the prompt tells the model never to follow instructions in it. Server checks the output shape. |
| Users treat AI estimates as facts | Bad business decisions | FAQ states the numbers are estimates and should be verified with real sources. |
| AI provider is slow or unavailable | Long waits or failures | 120-second timeout, generic error message, and the user can retry. Model can be changed through `OPENAI_MODEL` without code changes. |
| Model is deprecated or renamed | All requests fail | Model is set by environment variable, so it can be switched without a release. |

---

## 16. Future roadmap

1. **Export the full brief** to PDF and Markdown, so the whole plan can be shared and not just the landing page.
2. **Local AI with Ollama**, using a configurable AI base URL for private, offline or zero-cost use.
3. **Regenerate one section** without regenerating the whole brief.
4. **Edit a brief** directly in the results view before exporting.
5. **Accounts and saved briefs**, so users can return to past ideas and compare them.
6. **Side-by-side comparison** of two or more ideas, using the shared structure.
7. **Streaming results**, so tabs fill in as each section is ready instead of after one long wait.
8. **Shared rate limiting** across server instances (Vercel Firewall or Redis).
9. **Real market data** from external sources to support the AI's market sizes.
10. **Multiple languages** for both input and output.

---

## 17. Glossary

| Term | Meaning |
|---|---|
| **Brief / Blueprint** | The full result LaunchDesk produces for one idea: eight sections covering pitch to landing page. |
| **Viability score** | A 0 to 100 score from the AI estimating how promising the idea is, split into market size, team feasibility, innovation and revenue potential. |
| **TAM / SAM** | Total Addressable Market (everyone who could ever buy) and Serviceable Addressable Market (the part you can realistically reach). |
| **CAGR** | Compound Annual Growth Rate: the average yearly growth rate of a market. |
| **CAC** | Customer Acquisition Cost: what it costs to win one paying customer. |
| **LTV** | Lifetime Value: the total revenue expected from one customer over time. |
| **Breakeven** | The point where revenue covers costs. |
| **MVP** | Minimum Viable Product: the smallest version that can be launched and tested with real users. |
| **UVP** | Unique Value Proposition: the main reason a customer would choose this product. |
| **KPI** | Key Performance Indicator: a number used to track whether the business is on course. |
| **Go-to-market (GTM)** | The plan for launching a product and reaching its first customers. |
| **API** | Application Programming Interface: a way for one program to request work from another. |
| **API key** | A secret password-like code that lets our server use a paid AI service. |
| **Serverless function** | A piece of server code the host runs on demand, without us managing a server. |
| **Rate limiting** | Capping how many requests one visitor can make in a set time, to prevent abuse. |
| **Same-origin check** | Making sure a request comes from our own website and not another site. |
| **Sandboxed iframe** | A locked-down box inside the page that shows content but blocks its scripts and forms. |
| **CSP (Content-Security-Policy)** | A browser rule listing which sources a page is allowed to load code, styles and fonts from. |
| **Prompt injection** | Text that tries to trick an AI into ignoring its instructions. |
| **JSON** | A standard text format for structured data that programs can read reliably. |
| **Bundle** | The JavaScript files a browser downloads to run the app. Anything in it is public. |
| **Environment variable** | A setting stored outside the code, such as a secret key, so it isn't committed to the repository. |
| **Ollama** | A tool for running AI models locally on your own computer. |
