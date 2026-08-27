# Audora — a memory layer for creative work

> **Walrus Memory Prompt Jam.** Audora is a full working app (React UI + Express
> API) *and* the build prompt below — paste it into any coding agent and get the
> whole thing back. It stores the **context** around creative work to Walrus
> Memory the moment it happens, and recalls it later by meaning. No database, no
> vector store — `@mysten-incubation/memwal` does the embedding, encryption,
> storage and semantic search.

## For judges — 60-second verify

| | |
|---|---|
| 📄 Build prompt | [`prompts/audora.md`](prompts/audora.md) — this file. Copy-paste, fill the `.env` block, rebuild the whole app. |
| ▶️ Run it | `cp .env.example .env` → `npm install` → `npm run dev` → **http://localhost:5173** (landing at `/`, Studio at `/studio`) |
| 🩺 Connection test | `npm run step0` — health → `remember()` → `recall()` against the live relayer, prints **PASS** |
| ⛓️ On-chain account | [`MemWalAccount` on Suiscan](https://suiscan.xyz/mainnet/object/0x392e1063bb45715908cfa751c82e232269fcaa5029eabaadd4d30c239687f6be) — the shared object holding the memories (mainnet) |
| 🧠 Blobs | Every capture is a SEAL-encrypted Walrus blob registered to that account; the UI surfaces the `job_id` on write and the `blob_id` once finalized, per memory. |
| 🛠️ Tool surface | `health` · `remember` · `getRememberStatus` · `recall` — each wired to a real UI action (health strip, Capture panel, status poll, Recall panel), not decoration. |
| 🎬 Demo | _add link_ — or click **Run 2-min demo** in the Studio: it seeds four real memories and recalls one cold. |

---

## Problem

**Who:** producers, songwriters and beatmakers — but also writers, screenwriters,
designers, filmmakers, photographers and game devs. Anyone who generates more raw
ideas than they can finish and works with (or wants to work with) an AI assistant
on top of them. Not just music.

**Pain:** a creative forgets an idea because there's no consistent way to catch
it. One goes in a voice memo, the next in a Notion page, the next on a napkin,
the next as `idea_final_v3.als` — a different place and a different shape every
time, so there's nothing to search. You make a beat (or draft a verse, or sketch
a shot list) at 2 a.m., save the file, and move on. Six months later there are
400 fragments across five apps and no memory of which one had the part you loved,
what it still needed, who you made it with, or where it lives. The **context**
around each idea — the mood, the collaborator, the missing piece, the session it
came from — is the highest-value part of the work, and it evaporates the moment
you close the session. Folders and filenames don't hold it. You can't grep a
feeling. Every time you sit back down you start from zero.

**Solution:** Audora gives every idea **one consistent shape and one place**. It
saves the context as a single structured sentence to Walrus Memory the instant
you capture it, and lets you recall it later in plain language — *"the moody
thing with the vocal chop from that late session"*, *"the story idea about the
lighthouse keeper"* — ranked by semantic distance. No tags to maintain, no
naming discipline, no database to run. The vault is an on-chain account of
encrypted blobs, so it's portable and provable, not locked in a notes app.

**Why one sentence:** every memory is written in the same shape —

```
{Type} — "{title}". Captured on {date}. Stage: {status}. Tags: {tags}.
Tempo: {bpm} BPM. Key: {key}. Where it lives: {location}. Context: {notes}.
```

Consistency is what keeps recall sharp and lets the app re-parse each hit back
into structured fields for the card view.

---

## Build this from scratch

Everything below is the prompt. Paste it into a fresh coding-agent session.

````
Build a web app called **Audora** — "a memory layer for creative work". Musicians,
producers and writers generate a flood of ideas (beats, lyrics, voice notes,
concepts) and lose the *context* around them. Audora lets a user capture that
context in plain language and recall it later by meaning. There is NO database or
vector store — semantic memory is entirely delegated to **Walrus Memory**
(`@mysten-incubation/memwal`), a hosted relayer that embeds, encrypts, stores on
Walrus, and does semantic search.

## Stack & structure

Single codebase, one `package.json`, one `node_modules`, `"type": "module"`,
`engines.node` = `"20.x"`:

```
index.html             Vite UI entry (repo root)
vite.config.js          Vite + React plugin; dev proxy /api -> http://localhost:3001
src/                    React 18 app
  main.jsx              ReactDOM root; MUI ThemeProvider + CssBaseline +
                        <MotionConfig reducedMotion="user">
  App.jsx               route switch (see router below)
  theme.js              MUI light theme (form controls only)
  index.css             design tokens + a few utility classes
  api.js                fetch wrapper around /api
  lib/router.jsx        ~40-line history-API router (NO react-router)
  lib/format.js         WORK_TYPES, STAGES, STAGE_HUE, TYPE_GLYPH, relativeDate, splitTags
  pages/Landing.jsx     marketing page  ( / )
  pages/Studio.jsx      the tool        ( /studio )
  components/           AudoraLogo, TopBar, Backdrop, AccountStrip, HealthPill,
                        CapturePanel, RecallPanel, MemoryCard, RelevanceRing,
                        SessionList, ProofsPanel, StoredReceipt, Icon
server/                 Express API — the ONLY place the delegate key is read
  app.js               createApp({ serveStatic }) -> Express app (factory)
  index.js             standalone runner: dotenv, listen($PORT||3001), serve
                       dist/ when built (skipped if process.env.AUDORA_DEV==="1")
  dev.js               sets AUDORA_DEV=1 then imports ./index.js
  lib/memwal.js        single MemWal client + retry helpers + formatMemory
  routes/memories.js   capture / status / search + parseMemory
api/[...path].js        Vercel serverless entry: createApp({ serveStatic:false })
scripts/step0-connection-test.js   standalone end-to-end MemWal check
```

Dependencies: `express`, `cors`, `dotenv`, `@mysten-incubation/memwal@^0.1.5`,
`@mysten/seal@^1.1.3`, `@mysten/sui@^2.16.2`, `@mysten/walrus@^1.1.7` (the last
three are MemWal peer deps needed for relayer-mode SEAL sessions), `react`,
`react-dom`, `@mui/material@^6`, `@emotion/react`, `@emotion/styled`,
`framer-motion`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`.
Dev deps: `vite@^6`, `@vitejs/plugin-react`, `concurrently`.

Scripts:
- `dev`  -> `concurrently -k -n api,web "npm:dev:api" "npm:dev:web"`
- `dev:api` -> `node --watch server/dev.js`
- `dev:web` -> `vite`
- `build` -> `vite build` (outputs `dist/`)
- `start` -> `node server/index.js`
- `step0` -> `node scripts/step0-connection-test.js`

`.gitignore`: `.env`, `*.env` (but keep `.env.example`), `node_modules/`,
`dist/`, `.vercel/`.

## Environment (.env, gitignored; .env.example with placeholders)

```
MEMWAL_ACCOUNT_ID=0x...            # Sui object id of the Walrus Memory account
MEMWAL_KEY=suiprivkey1...          # Ed25519 delegate key (hex or bech32)
MEMWAL_SERVER_URL=https://relayer.memory.walrus.xyz
MEMWAL_NAMESPACE=audora-demo
PORT=3001
```

## Walrus Memory integration — server/lib/memwal.js

```js
import { MemWal } from "@mysten-incubation/memwal";
```

- `getMemWal()` — lazily create & cache one client from
  `MemWal.create({ key: MEMWAL_KEY, accountId: MEMWAL_ACCOUNT_ID,
  serverUrl: MEMWAL_SERVER_URL ?? "https://relayer.memory.walrus.xyz",
  namespace: MEMWAL_NAMESPACE })`. Throw a clear error if account id / key missing.
- `WORK_TYPES = ["beat","song","lyrics","voice note","concept","sample","other"]`
- `STAGES = ["idea","rough","refining","done"]`
- `formatMemory({title,type,date,tags,status,bpm,key,location,notes})` returns ONE
  canonical sentence (missing fields become `—`; keeping the shape stable is what
  makes recall reliable):
  ```
  {Cap(type)} — "{title}". Captured on {date}. Stage: {status}. Tags: {tags}. Tempo: {bpm} BPM. Key: {key}. Where it lives: {location}. Context: {notes}.
  ```
  (When bpm is empty, `Tempo: —.`)
- The relayer is flaky. `withRetry(fn, { tries:6, baseMs:1500, label })` retries on
  transient errors — HTTP 401/429/502/503/504, `serverCode === "AUTH_REJECTED"`,
  or `err.name === "TypeError"` (fetch blip) — with linear backoff `baseMs*attempt`.
- `pollRememberJob(jobId, { timeoutMs, intervalMs })` — poll
  `memwal.getRememberStatus(jobId)` to a terminal state (`done`|`failed`),
  swallowing transient errors, returning the last status (with `timedOut:true`) if
  the budget runs out.

MemWal methods used: `memwal.health()` -> `{ status, write_ready, version|relayerVersion }`;
`memwal.remember(text)` -> `{ job_id, status }`; `memwal.getRememberStatus(job_id)`
-> `{ job_id, status, blob_id }`; `memwal.recall({ query, limit })` ->
`{ results: [{ text, distance, blob_id }], total }`.

## API — server/app.js `createApp({ serveStatic = false })`

Express app: `cors()`, `express.json()`, a request logger for `/api*`.

- `GET /api` — `{ service, namespace, ok:true, endpoints:[...] }`
- `GET /api/health` — call `withRetry(() => memwal.health(), { tries:3 })`; return
  `{ ok: health.status==="ok", namespace, relayer, account, accountMasked
  ("0x392e10…f6be"), writeReady, relayerVersion, workTypes, stages }`; 502 on error.
- `POST /api/memories` — body `{title,type,date(def today),tags,status(def "idea"),
  bpm,key,location,notes}`. Validate `title` required, `type`/`status` against the
  lists. Build `memoryText = formatMemory(fields)`. `withRetry(() =>
  memwal.remember(memoryText))`, then `pollRememberJob(job_id,{ timeoutMs:25000,
  intervalMs:2500 })`. Return 201 `{ job_id, status, blob_id|null, finalized
  (status==="done"), namespace, fields, memoryText }`; 502 on error.
- `GET /api/memories/status/:jobId` — `withRetry(getRememberStatus, { tries:3 })`,
  return `{ job_id, status, blob_id|null, finalized, error|null }`.
- `GET /api/memories/search?q=` — require `q`. Up to 3 attempts of
  `withRetry(() => memwal.recall({ query, limit:12 }))`, retrying (1.2s gap) while
  `results.length === 0`. Return `{ query, total, results: results.map(r => ({
  text: r.text, distance: r.distance, relevance: clamp01(1 - r.distance),
  blob_id: r.blob_id, fields: parseMemory(r.text) })) }`; 502 on error.
- `app.use("/api", 404 json)`.
- If `serveStatic` and `dist/index.html` exists: `express.static(dist)` + SPA
  fallback `app.get(/^(?!\/api).*/, sendFile(dist/index.html))`.

`parseMemory(text)` in routes/memories.js — regex the canonical sentence back into
`{ type, title, date, status, tags, bpm, key, location, notes }` (parse the
`{Type} — "{title}".` head, then segment on the labels).

`server/index.js`: `import "dotenv/config"`, compute
`hasBuiltUI = process.env.AUDORA_DEV !== "1" && exists(dist/index.html)`,
`createApp({ serveStatic: hasBuiltUI })`, add a plain-text `/` when no UI,
`app.listen(process.env.PORT || 3001, log banner)`.

`api/[...path].js`: `import "dotenv/config"; export default createApp({
serveStatic:false }); export const config = { maxDuration: 60 };`

`scripts/step0-connection-test.js`: import from `../server/lib/memwal.js`; run
health -> remember a fixed test sentence (with an idempotencyKey) -> pollRememberJob
-> recall a natural-language query -> print PASS if the marker text comes back.

## Frontend

**Router (src/lib/router.jsx)** — `RouterProvider` (holds `path` from
`location.pathname`, listens to `popstate`), `useRoute()` -> `{ path, navigate }`
(`navigate` uses `history.pushState` + scrolls to top), and a `<Link to>` that
intercepts plain left-clicks. `App.jsx`: `path.startsWith("/studio")` -> `<Studio/>`
else `<Landing/>`.

**Design tokens (src/index.css `:root`)** — light editorial, blue accent:
```
--bg:#fbfbfd  --surface:#fff  --surface-2:#f6f7f9  --surface-3:#eef0f4
--line:#e7e8ee  --line-strong:#d7d9e2
--text:#0d0e12  --text-2:#545a68  --text-3:#8a909e
--accent:#2f6fed  --accent-strong:#1f57c9  --accent-dim:rgba(47,111,237,.09)
--accent-tint:rgba(47,111,237,.14)  --accent-ring:rgba(47,111,237,.18)  --accent-ink:#fff
--green:#16a34a  --green-dim:rgba(22,163,74,.12)
--red:#e5484d  --red-dim:rgba(229,72,77,.09)  --red-border:rgba(229,72,77,.28)
--radius:14px  --radius-sm:10px  --radius-lg:20px  --pill:999px  --maxw:1140px
--font-ui:"Inter Variable",system-ui,sans-serif  --font-mono:"JetBrains Mono",ui-monospace,monospace
```
Also define shadow tokens (`--shadow-sm/md/lg`), a `.panel` class (white, 1px line,
radius, subtle shadow), a `.kicker` class (11px, 650, uppercase, .13em tracking,
accent color), and `.btn` / `.btn-primary` (accent fill, white text, pill) /
`.btn-ghost` (white, border) pill-button classes. `body` background `--bg`,
14px Inter. Headings tight tracking (`-0.021em`), `overflow-wrap:break-word`.
`html,body,#root { overflow-x: clip }`. Respect `prefers-reduced-motion`.
`theme.js`: MUI light theme, primary `#2f6fed`, paper `#fff`, outlined inputs on
white with accent focus ring — used only for the form controls in CapturePanel.

**Logo (src/components/AudoraLogo.jsx)** — `<AudoraMark size>` = a rounded-square
(`rx≈9/32`) tile filled `--text` (near-black), containing a white glyph: two short
rising bars plus a taller "peak" bar whose top curves back on itself into an arc
(capture → recall). `<AudoraLogo size wordmark>` = mark + "Audora" wordmark
(700, `-0.02em`). Monochrome so it works anywhere.

**Landing (src/pages/Landing.jsx)** — light marketing page:
- sticky header: logo (Link to `/`), nav anchors (How it works / Features / The
  stack, hidden < 640px), right-aligned `Launch Studio` pill (Link to `/studio`).
- hero: soft radial blue gradient wash; kicker "Semantic memory for creative work";
  H1 "A memory layer for creative work" (`clamp(2rem,7vw,3.8rem)`, 750,
  `text-wrap:balance`); one-paragraph subcopy; `Launch Studio` + `How it works`
  pills; then a white card holding a dark `<pre>` showing an example canonical
  sentence. Entry animations transform-only (`initial={{y}}` — never hide content
  behind `opacity:0`).
- "How it works": 3 numbered cards — Capture / Store / Recall.
- "Features": 6 bordered cards, each a small blue icon tile + title + body
  (capture context not the file; recall by meaning; one structured memory per
  idea; proof of every write; key stays server-side; no database to run).
- "The stack": a panel — "No custom database. Walrus Memory does the hard part." +
  4 chips (React+Vite / Express / MemWal relayer / Walrus).
- CTA band (blue-tinted) + footer (logo, "semantic memory by Walrus Memory ·
  @mysten-incubation/memwal"). Honest copy only — no fake logos or testimonials.

**Studio (src/pages/Studio.jsx)** — the tool, on `--bg` with a faint `Backdrop`
(top blue wash + hairline grid, masked):
- `TopBar`: logo, live `HealthPill` (polls `/api/health` every 15s; colored dot
  green=write-ready / amber=read-only / red=offline; shows relayer host), and a
  `Run 2-min demo` ghost button.
- `AccountStrip`: registered account (copyable), namespace, "delegate key:
  relayer-managed (x-seal-session)", relayer version.
- H1 "Studio" + one-line explainer, then pill tabs: **Studio** and **On-Chain
  Proofs** (badge = # captures this session).
- Studio tab, 2-col grid (`minmax(340px,400px) 1fr` ≥ 900px):
  - left: `CapturePanel` (MUI TextFields: working title, Type + Stage selects,
    Date, BPM/Key shown only for beat/song/sample, Tags/mood, Where it lives,
    Context multiline; `Store memory` primary pill; posts to `/api/memories`,
    then polls `/api/memories/status/:jobId` every 4s until finalized; on success
    shows `StoredReceipt` — job_id/blob_id/status/namespace + the exact stored
    sentence — and a "Capture another" button). Below it, `SessionList`: compact
    list of this session's captures with blob/job id and a per-row "recall" button.
  - right: `RecallPanel` — a search field (accent focus ring), example-query
    buttons, loading skeletons, then results. Empty state = a memory glyph +
    "Ready to recall". Each hit -> `MemoryCard`: type label (+ "best match" on
    rank 0, accent-tinted card), title, `RelevanceRing` (SVG ring that animates
    to `Math.round(relevance*100)`, green ≥55 / accent ≥35 / grey), metadata
    chips (stage colored via STAGE_HUE, relative date, BPM, key), tags, notes,
    "lives in", and a mono footer: `distance 0.xxx` · copy `blob …` · toggle
    `raw memory`.
- Proofs tab: `ProofsPanel` table of every write this session (glyph, title·type,
  job_id, blob_id, status badge done/pending).
- `Run 2-min demo`: sequentially `POST /api/memories` for 4 seed ideas
  (an amapiano beat "Third Mainland at 2AM", a "leaving lagos" lyric scratch, a
  "dark piano trap sketch", a "car hum — chorus melody" voice note), poll each to
  finalized, then push the query "the melody I hummed in the car on the drive
  home" into RecallPanel.

`src/api.js`: `health()`, `capture(fields)`, `jobStatus(jobId)`,
`recall(q)` — all hitting `/api/...`, throwing `body.detail || body.error` on
non-ok.

`Icon.jsx`: tiny inline-SVG stroke-icon set (search, plus, check, arrowRight,
wave, memory, shield, play, layers, sparkle, link, lock, target, …) — keeps it off
a stock icon font.

Everything responsive down to 390px with no horizontal scroll; wide content
(tables, code) scrolls inside its own container.

## Deploy

**vercel.json**:
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [{ "source": "/((?!api/).*)", "destination": "/index.html" }],
  "functions": { "api/[...path].js": { "maxDuration": 60 } }
}
```
Static `dist/` + one serverless function for all `/api/*` (`api/[...path].js`
running `createApp({ serveStatic:false })`). Env vars set in the Vercel project.

**render.yaml** (Blueprint): one free `web` service, `runtime: node`,
`buildCommand: npm install && npm run build`, `startCommand: npm start`,
`healthCheckPath: /api/health`, env vars — `MEMWAL_ACCOUNT_ID` / `MEMWAL_KEY` as
`sync: false` secrets, `MEMWAL_SERVER_URL` and `MEMWAL_NAMESPACE` inline,
`NODE_VERSION: "20"`.

## README

Cover: what Audora is; the canonical-sentence idea; `cp .env.example .env` ->
`npm install` -> `npm run step0` -> `npm run dev` (Vite :5173 + Express :3001,
proxied); the layout tree; the API table; `type`/`status` enums; production
(`npm run build` + `npm start`); and both deploy paths.

## Acceptance

- `npm run step0` prints PASS against a real relayer + credentials.
- `npm run dev`: landing at `/`, Studio at `/studio` (deep-link works),
  `/api/health` returns `ok:true`, capture writes and returns a `job_id` then a
  `blob_id`, recall returns ranked cards, the 2-min demo seeds 4 and auto-recalls.
- `npm run build && npm start`: Express serves the built UI + API on one port.
- Delegate key is read only in `server/lib/memwal.js` from env — never bundled or
  sent to the browser.
````
