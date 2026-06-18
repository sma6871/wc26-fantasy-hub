# WC26 Fantasy Hub

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-support-FFDD00?logo=buymeacoffee&logoColor=black)](https://buymeacoffee.com/sma6871)

Live at **[fantasy26.help](https://fantasy26.help)**.

An unofficial World Cup 2026 fantasy planner: all 48 teams, projected points, starting-XI
probabilities, set-piece takers, and a squad builder that enforces the official rules
(15 players, $100m budget, 2/5/5/3 quota, max 3 per nation, captain/vice).

Live player prices, ownership and fixtures are fetched from public feeds at runtime;
projections combine expert group-stage models, World Football Elo ratings and curated
lineup/fitness research.

Once the tournament is underway it also tracks actual performance: live points scored
(with an over/under arrow versus projection), goals and assists, group standings tables,
match results with W/D/L badges, and matchday lineup status (started / sub) per player.
Start probabilities auto-update from the official lineups.

## Features
- All 48 teams with Elo strength, projected goals and clean-sheet odds.
- Player browser with search, filters (position, group, price, projection confidence) and
  sorting by actual or projected points, value, start likelihood, price, ownership and team metrics.
- Group standings (P, W, D, L, GF, GA, GD, Pts) computed from fixture results.
- Squad builder enforcing the official rules, with captain/vice and budget validation.
- Player detail sheet with projection basis, live tournament stats, and a match-by-match points
  breakdown (loaded on demand when the sheet opens).

## Run / deploy
It's a single self-contained `index.html` (React via CDN, no build step).
- Open locally: just open the file in a browser.
- Deploy: drop the repo into Vercel (or any static host). No configuration needed.
- Production: served at [https://fantasy26.help](https://fantasy26.help).

## AI Coach
A chat coach that reads every team's projections, starting-XI odds and set-piece takers, and
can draft a full squad you approve. In production it runs through a Vercel serverless function
(`api/coach.js`) backed by Google Gemini Flash, so no API key ever ships in the browser, with a
free daily limit of 5 questions per visitor. Set `COACH_MODE` to `"off"` near the top of the
script to fall back to the waitlist (`WAITLIST_URL`).

## Changelog
Versioned in [CHANGELOG.md](CHANGELOG.md); the current version shows in the app header and footer.

## Disclaimer
Not affiliated with, endorsed by, or connected to FIFA or the FIFA World Cup Fantasy game.
Team and player data belong to their respective owners. This is a free, fan-made tool.

## License
MIT (code). Curated projections/intel are provided as-is for personal use.
