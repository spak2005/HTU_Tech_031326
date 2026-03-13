# ArcanAI — AI Optimization Platform

## What this application does

**ArcanAI** is an **AI Optimization Platform** that helps brands understand and improve how they appear in major AI assistants (ChatGPT, Perplexity, Gemini, Claude, Copilot). It provides:

- **Track** — Monitor brand visibility with a real-time **AIO Score** (visibility, accuracy, sentiment, coverage). View an analysis dashboard with trends, diagnostics, and platform breakdowns.
- **Improve** — Get actionable recommendations when gaps or inaccuracies are detected: DIY steps, AI-generated fixes, and optional GitHub/Slack/Teams integrations.
- **Launch** — Run AI readiness scans for new products, generate optimized content, and see results flow into the Track loop.

The app includes a **landing page**, **signup/onboarding** (company name, website URL), **analysis dashboard** (AIO score and metrics), **improve** (health metrics, recommendations, agent-assisted fixes), and **launch** (product scans, code generation, PR workflow).

---

## Tech stack / frameworks

- **Frontend:** React 19, React Router 7, Vite 6, TypeScript
- **Styling:** Tailwind CSS 4, Motion (animations), Lucide React (icons)
- **Charts / data viz:** Recharts
- **AI:** Google Gemini API (`@google/genai`)
- **Tooling:** Node.js, npm, TSX, Nodemon (dev)

---

## How to navigate / interpret the application (for judges)

1. **Start at the landing page** (`/`) — Overview of Track, Improve, and Launch; use “Get started” or nav to go further.
2. **Signup** (`/signup`) — Enter company name and website (e.g. “Dell”, “dell.com”). This drives the demo data shown later.
3. **Onboarding** (`/onboarding`) — Simulated agent run (Scout, Secret Shopper, Verifier, etc.) that “analyzes” the site and sets context for the dashboard.
4. **Analysis** (`/analysis`) — Main **Track** experience: AIO Score hero, core health bars, trend chart, diagnostics, platform breakdown. Interpret this as “how the brand is doing across AI models.”
5. **Improve** (`/improve`) — **Improve** experience: visibility, accuracy, sentiment, coverage metrics with issues and recommendations; DIY steps and optional AI/agent fixes; connection status for GitHub/Slack/Teams.
6. **Launch** (`/launch`) — **Launch** experience: product scan flow, AI-generated content/code, PR states, and how results tie back into tracking.

**Suggested path for judges:** Landing → Signup (quick form) → Onboarding (watch agent feed) → Analysis (review AIO dashboard) → Improve (review recommendations and fixes) → Launch (see product scan and PR flow).

---

## How to run the application

**Prerequisites:** Node.js (v18+ recommended).

1. **Clone and enter the repo**
```bash
git clone <repo-url-here>
cd arcanAI
```

2. **Install dependencies**
   ```bash
   npm install
   ```

4. **Start the dev server**
   ```bash
   npm run dev
   ```

5. **Open in browser**  
   Visit **http://localhost:3000** (or the URL printed in the terminal; Vite uses port 3000 by default with `--port=3000`).


---

## How to tell if the app started successfully

- **In the browser:** Open **http://localhost:3000**. You should see the **ArcanAI landing page** (hero, “Take control of your brand in AI”, Track / Improve / Launch sections). If that loads, the app has started successfully.

- **Quick sanity check:** Click “Get started” or go to **http://localhost:3000/signup** — the signup page should load. Then go to **/onboarding** → **/analysis** → **/improve** → **/launch** to confirm the full flow.

---


## Summary for judges

| Item | Detail |
|------|--------|
| **What it does** | AI Optimization Platform: Track (AIO Score + dashboard), Improve (recommendations + fixes), Launch (product scans + content/PR flow). |
| **Tech** | React 19, Vite 6, TypeScript, Tailwind 4, Motion, Recharts, Gemini API. |
| **Navigate** | Landing → Signup → Onboarding → Analysis (Track) → Improve → Launch. |
| **Success** | Terminal shows Vite “Local: http://localhost:3000”; browser shows landing at that URL. |
