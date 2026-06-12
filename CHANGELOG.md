# Changelog

Versioning so changes are trackable. The current version shows in the app header and footer
(`APP_VERSION` / `APP_UPDATED` in `src/app.jsx`). Bump both on every change.

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
