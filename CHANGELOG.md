# Changelog

Versioning so changes are trackable. The current version shows in the app header and footer
(`APP_VERSION` / `APP_UPDATED` in `src/app.jsx`). Bump both on every change.

## 1.4.0 - 2026-06-19

Fix the false "BENCH" badges at MD2 and make projections respond to actual results.

- Lineup badge fix: `matchStatus` from the feed resets to null between rounds (before the next XI
  is published). The app was reading that null as a benching, so from Matchday 2 every nailed
  starter whose next game had not kicked off showed a red BENCH badge and had their start
  probability forced to 0.35. Null is now treated as "lineup not out yet": keep the curated tier,
  show no badge. Only a real "start"/"sub" status badges or overrides the tier. The red BENCH
  state is gone.
- Same fix in `scripts/update-form.mjs`, which previously would have baked 0.35 into the curated
  INTEL tiers for every starter between rounds. It now skips null and only writes start/sub.
- Projections are now form-blended once a team has played. The pre-tournament per-game value acts
  as a prior (worth ~1.5 games) and is shrunk toward the observed per-game rate as matches
  accumulate, so a cold start drags a projection down and a hot start lifts it. `Proj (grp)` and
  `Tournament` are now banked points plus the blended rate over the remaining games. Example:
  a player on 3 points from 2 games no longer shows a 36-point group projection.
- Tamed the model's biggest source of inflation: set-piece multipliers were stacking (a
  pen+corner+FK taker got x1.67), and a single player could absorb an unrealistic share of a weak
  team's attacking output. Multipliers reduced (x1.28 pens, x1.10 corners/FKs) and any one player
  is now capped at 42% of team attacking output.
- Clearer numbers in the player sheet: the projection tiles carry tooltips, a line shows the
  current per-game rate, and the "Tournament so far" comparison cell is relabelled "Exp. by now"
  (the frozen pre-tournament expectation) so it no longer reads as a second, conflicting projection.

## 1.3.0 - 2026-06-18

AI coach live in production via a serverless proxy.

- New Vercel function `api/coach.js` proxies the coach to Google Gemini 2.5 Flash, holding the
  `GEMINI_API_KEY` server-side so no key ever ships in the browser. `vercel.json` sets its
  `maxDuration` to 30s.
- `COACH_MODE` now switches between "off" (waitlist), "gemini" (production, calls `/api/coach`)
  and "claude" (direct Anthropic call, personal artifact build only). Public default is "gemini".
- Client-side daily rate limit: 5 coach questions per visitor per day, tracked in `localStorage`
  (`wc26-coach-usage`) and reset when the date changes. The coach shows "X/5 questions left
  today" and a friendly message once the limit is reached.

## 1.2.0 - 2026-06-16

Match-by-match points breakdown in the player detail sheet.

- Opening a player's detail sheet now lazy-loads that player's per-round stats from the public
  FIFA per-player feed (player_stats), showing a small spinner while it loads. Results are cached
  per session, so re-opening the same player costs no extra request.
- Each matchday renders a Statistics / Value / Pts table: minutes played, goals, assists, clean
  sheet, shots on target, tackles, chances created, saves (GK), cards and scouting bonus, with the
  points each line scored and a yellow round total. Only lines that actually moved the score show.
- Stats are fetched only when a detail sheet opens, never in bulk or on list render. The
  STARTED / SUB / BENCH matchday badges on player rows are unchanged.

## 1.1.2 - 2026-06-12

Matchday lineup status from the feed's matchStatus field.

- Each player now carries a matchday badge derived from matchStatus: STARTED (green),
  SUB (amber), or BENCH (red, for a squad player left out once their team has played).
  Shown on player rows and in the detail sheet.
- A subtle "played" label (Started / Sub / DNP) on player rows, plus a "Played" stat in
  the detail sheet alongside goals and assists.
- Start probability now auto-updates from matchStatus once a team has played: start -> 0.93,
  sub -> 0.55, otherwise 0.35. Teams that have not played yet keep their curated tier.
- update-form.mjs uses the same matchStatus logic so the matchday script stays in sync.

Note: the feed marks every non-starting squad member as "sub" (named substitute), so the
red BENCH state (matchStatus null on a team that has played) does not occur in practice.

## 1.1.1 - 2026-06-12

UX refinements from preview feedback.

- Players tab now defaults to the "Actual pts" sort, moved to the first chip.
- Renamed the "Deep-run pts" sort to "Tournament pts" and added a tooltip to every sort chip
  explaining what it ranks.
- Added a Confidence filter (All / Expert / Model) to the Players filter bar.
- Slimmed down the Teams page: denser standings tables (scoped so the Rules table is untouched),
  more compact team cards with short progression codes, tighter grid, and standings rows are now
  clickable to open a team.

## 1.1.0 - 2026-06-12

Live results and actual-performance tracking, all surfaced in the existing tabs (no new tabs).

- Player rows: inline "X pts" actual tournament points badge with a green up / red down arrow
  for over/underperforming versus the pre-tournament projection. New "Actual pts" sort option in
  the Players tab (and on team pages).
- Player detail sheet: a "Tournament so far" section with actual points, goals, assists, minutes,
  clean sheets, and a projection-vs-actual comparison.
- Start probability now auto-updates from results: a player's minutes band (derived from points,
  since the public feed has points but not per-player minutes) overrides the curated start tier
  once there is evidence they featured.
- Teams page: group standings table (P, W, D, L, GF, GA, GD, Pts) computed from fixture results,
  top 2 highlighted, shown above the grid for every group and on each team page.
- Fixture strips and the detail sheet show final scores and a W/D/L badge for completed matches.
- `scripts/update-form.mjs`: fetches the FIFA feed and bakes results-based start tiers into the
  `INTEL` block. Run it plus `./build.sh` after each matchday.
- App version surfaced in the header and footer.

## 1.0.0

Initial public release: 48 teams, projected points, starting-XI probabilities, set-piece takers,
squad builder with the official rules.
