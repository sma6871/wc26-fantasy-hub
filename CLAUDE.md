# WC26 Fantasy Hub — project context

Unofficial World Cup 2026 fantasy planner. All 48 teams, projected points, starting-XI
probabilities, set-piece takers, and a squad builder that enforces the official FIFA World
Cup Fantasy rules. Mobile-first single-page React app, deployed as a static site on Vercel
and served in production at https://fantasy26.help.

This file is the working context for Claude Code. Read it before making changes.

## Git identity (important)

This repo belongs to the **sma6871** GitHub account, NOT the default/global git user.
Set the identity at the repo level so commits are attributed correctly:

```bash
git config user.name "sma6871"
git config user.email "masouda65@gmail.com"
```

Verify before the first commit with `git config user.email` (should print masouda65@gmail.com).
If pushing over SSH with a multi-account setup, make sure the remote uses the host alias tied
to the sma6871 key, for example:

```bash
git remote set-url origin git@github.com-sma6871:sma6871/wc26-fantasy-hub.git
```

Adjust the alias to whatever is configured in `~/.ssh/config` for this account. Never commit
with the global identity.

## Repo layout

```
.
├── index.html              # DEPLOYED artifact: compiled, self-contained, served by Vercel
├── src/app.jsx             # EDITABLE source. Edit here, then run ./build.sh
├── build.sh                # Compiles src/app.jsx -> index.html (esbuild + HTML template)
├── scripts/refresh-data.mjs# Refreshes the embedded player snapshot from FIFA feeds
├── README.md
├── LICENSE                 # MIT (code)
└── CLAUDE.md               # this file
```

`index.html` is a build output but is committed because Vercel serves it directly with zero
build config. The source of truth is `src/app.jsx`. After editing the source, always run
`./build.sh` and commit both files.

## Build and deploy

```bash
./build.sh        # regenerates index.html from src/app.jsx (needs Node for npx esbuild)
```

Deployment is automatic: push to the default branch and Vercel redeploys the static
`index.html`, served in production at https://fantasy26.help (custom domain on Vercel).
There is no server, no bundler step on Vercel, no environment variables.

To preview locally, open `index.html` in a browser, or serve the folder
(`npx serve .`). The app fetches live data from FIFA, so it needs network access.

To smoke-test a build without a browser (mounts the compiled `index.html` in jsdom and
checks 48 teams render plus the My Team pitch, selection sheet, and fixture flows):

```bash
cd scripts/verify && npm install && npm run verify
```

This harness lives in its own folder with its own `package.json` so the repo root stays
config-free and Vercel keeps serving `index.html` statically.

## Architecture

Single React tree, no router, no state library. React and ReactDOM load from a CDN as
globals; `src/app.jsx` opens with `const { useState, useEffect, useMemo, useRef } = React;`.
esbuild compiles the JSX and inlines it into `index.html`.

Data flow on load (in `App`):
1. Instantly renders from an embedded snapshot (the `SNAP` constant near the top of the file)
   so the app works offline and never blocks on the network.
2. Then tries a live refresh from the official public feeds and, if it succeeds, swaps in the
   live data and flips the header label from "snapshot" to "live".

Feeds (CORS-open, no key needed):
- `https://play.fifa.com/json/fantasy/players.json`
- `https://play.fifa.com/json/fantasy/squads.json`
- `https://play.fifa.com/json/fantasy/rounds.json`

Key components and helpers in `src/app.jsx`:
- `App` — data load, persistence, tab routing, squad toggle with rule validation.
- `TeamsGrid` / `TeamPage` / `FixtureStrip` — group grid, team squad pages, fixture difficulty.
- `PlayersView` — search, filters (position/group/price), sorting, pagination.
- `Detail` — player bottom sheet.
- `MyTeam` — 15-slot builder, budget bar, captain/vice, validation.
- `Coach` / `CoachMsg` / `MdText` / `mdInline` / `DraftCard` — AI coach UI and markdown.
- `CoachWaitlist` — shown instead of the coach when `COACH_MODE === "off"`.
- `Rules` — scoring table and rules text.
- `buildModel` — computes projections, deep-run value, start probability, value-per-million.
- `buildContext` — assembles the system prompt for the coach from the full dataset.
- Constants: `SNAP` (embedded data), `FLAGS`, `QUOTA`, `PROG_MULT`, `SCORING`, `RULES_TEXT`,
  `COACH_MODE`, `WAITLIST_URL`.

Persistence uses a small `store` shim over `localStorage` with an async-shaped API.
Keys: `wc26-team` (squad: `{ids, cap, vc}`) and `wc26-chat` (last 40 coach messages).

## The projection model (buildModel)

Per team, an Elo-based win/CS estimate feeds per-player projected points. A player's
attacking share scales with price, position, start probability and set-piece duties, then is
blended with expert group-stage values where available. Knockout "deep-run" value uses
`PROG_MULT` (how far the team is expected to advance). The official scouting bonus is priced
into sub-5%-owned players. Start probabilities come from curated tiers; set pieces are flagged
P (penalties), C (corners), F (free kicks).

The curated intel (start tiers, set-piece flags, fitness notes) is the main source of edge and
the thing most worth correcting. It currently lives inline in the model. When confirmed
lineups land (about an hour before kickoff), updating start probabilities and set-piece takers
is the highest-value change.

## Refreshing data

```bash
node scripts/refresh-data.mjs   # rewrites the SNAP constant from the live feeds
./build.sh                      # rebuild index.html
```

Prices are fixed for the whole tournament; ownership %, squad lists and fixtures can move.

## Official rules reference (keep accurate)

Squad: 15 players, 2 GK / 5 DEF / 5 MID / 3 FWD. Budget $100m (rises to $105m at Round of 32).
Max 3 players per nation in groups and R32, loosening in later rounds. Captain scores double;
vice takes over only if the captain does not play. Prices are fixed all tournament.

Scoring (GK / DEF / MID / FWD):
- Played up to 60 min: 1 / 1 / 1 / 1; played 60+ min: 2 / 2 / 2 / 2
- Goal: 9 / 7 / 6 / 5; direct free-kick goal: +1 on top
- Assist: 3; winning a penalty: +2
- Clean sheet (60+ min): 5 / 5 / 1 / none
- GK: 1 per 3 saves; penalty save (not shootout): +3
- First goal conceded is free; each additional conceded: -1 (GK/DEF)
- MID: 1 per 3 tackles, 1 per 2 chances created; FWD: 1 per 2 shots on target
- Conceding a penalty: -1; yellow: -1; red: -2; own goal: -2

Two bonus rules that affect value:
- Direct free-kick goal bonus: +1 (so free-kick takers carry hidden upside)
- Scouting bonus: +2 when a player owned by under 5% of teams scores more than 4 points in a
  match (differentials literally pay extra; the model includes this for sub-5% players)

There is no Player-of-the-Match bonus in this game.

## AI coach

The public build ships with `COACH_MODE = "off"`, which renders `CoachWaitlist` (a link to
`WAITLIST_URL`). Set `WAITLIST_URL` to a real form link (Tally or Google Forms).

The coach code (`Coach`) is fully implemented. It builds a system prompt from the whole
dataset via `buildContext`, sends chat history, parses replies, and renders any ```draft
fenced JSON block as a `DraftCard` the user can review and apply (the app never auto-saves a
squad; the user always confirms). The draft JSON shape is `{"ids":[...15...],"cap":id,"vc":id}`.

To enable the coach publicly, do NOT call a model API directly from the browser with a key in
client code. Add a serverless function (Vercel function) that holds the key and proxies the
request, with per-visitor rate limiting. A free option is Google Gemini Flash; swap the fetch
in `Coach` to call your own function endpoint instead of the model API. Keep `COACH_MODE` as
the switch: "off" (waitlist), or a new "proxy" mode that calls the function.

Note: there is a separate personal build kept in the owner's Claude account (an artifact) that
uses Claude directly for the coach. That version is for personal use only and is not part of
this repo or the public deployment.

## Constraints and conventions

- Not affiliated with FIFA. Keep the disclaimer in README and avoid "FIFA" in the product
  name. The tool stays free; do not add paid features (commercial use of the data and the
  official game is the line that invites trouble).
- Never put API keys or secrets in client code or in the repo.
- Browser storage is `localStorage` only via the `store` shim. Do not assume a backend.
- Mobile-first. Test changes at a narrow viewport.
- Writing style for docs and commit messages: concise and direct, no em dashes.
- After any source change: `./build.sh`, sanity-check `index.html` opens, then commit both.

## Possible next steps

- Wire the coach behind a Vercel function (Gemini Flash free tier) with rate limiting.
- Optional accounts so saved squads follow a user across devices (Supabase: Postgres + auth).
- Hourly cached fetch of the FIFA feed via a Vercel cron function to control CORS and load.
- Lineup-driven start-probability updates during the group stage.
