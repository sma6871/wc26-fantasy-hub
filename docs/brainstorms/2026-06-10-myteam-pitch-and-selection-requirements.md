---
date: 2026-06-10
topic: myteam-pitch-and-selection
title: My Team pitch redesign, in-place team selection, and next-game dates
---

# My Team pitch redesign, in-place team selection, and next-game dates

## Summary

Redesign the My Team pitch to feel like the official fantasy app — generic jersey tokens with flag badges on a green perspective field — and make squad-building barrier-free: tapping any spot opens a position-scoped selection sheet with full sort/filter on the same page (never a jump to the Players tab). Each player also shows their next-game date so matchday timing is visible at a glance.

## Problem Frame

The current My Team pitch is a flat set of cards and two interactions break flow. Tapping an empty slot navigates away to the Players tab, losing the pitch context and forcing the user to mentally map an unfiltered list back to the slot they were filling. Filled tokens open a transfer sheet, but the experience isn't a smooth "browse and choose" — it's a trimmed list. And nothing on the pitch shows when each player next plays, which matters in World Cup fantasy: a manager may start a player who kicks off on the 11th and, after that player blanks, swap in a benched player who plays on the 12th. Today that timing has to be looked up elsewhere.

## Key Decisions

- **Generic jersey token + flag badge, not licensed kits.** The official site uses national-team kit renders. We have no kit assets and `CLAUDE.md` flags FIFA/IP sensitivity, so we recreate the *feel* with one neutral jersey silhouette reused for all players and the flag as the identifying badge. Avoids licensed art and per-team color work.
- **In-place selection replaces tab navigation; one shared sheet for add and replace.** Tapping a slot opens a selection sheet on the same page. Empty slots stop opening the Players tab; filled tokens continue to support swap/remove. The Players tab remains for general browsing.
- **The selection sheet is a real browser, not a trimmed list.** It carries sort and filter controls (mirroring the Players browser, scoped to the slot's position) so choosing a player is smooth and barrier-free. The full position list is shown with each candidate's legality (budget, nation cap, quota) visible, rather than silently pre-trimming to only-eligible players.
- **Next-game shows date only.** Date such as "Jun 12", no kickoff time or opponent on the chip, and no automated bench-timing assist. The manager executes the matchday-timing tactic by eye. Data already carries kickoff datetimes, so time/opponent can be added later without rework.
- **Keep the green identity and mobile-first layout.** Perspective/depth is achieved with CSS, not a 3D/WebGL engine, and must read well at narrow widths.

## Requirements

**Pitch visual**

- R1. The My Team pitch renders on a green perspective field that preserves the current green identity and remains legible and usable at mobile width.
- R2. Each selected player renders as a jersey token: a single neutral jersey silhouette reused across all players, the player's national flag as an identifying badge, the player name and price in an official-style card below, and a transfer affordance plus captain/vice (C/V) badges positioned on the token.
- R3. Empty squad slots render as jersey-style placeholders within the correct position rows (goalkeeper at the back, then defenders, midfielders, forwards), visually distinct from filled tokens.

**In-place team selection**

- R4. Tapping any pitch spot — empty or filled — opens a selection sheet on the same page and never navigates to the Players tab.
- R5. The sheet is pre-filtered to the tapped slot's position (tapping a midfield spot shows midfielders).
- R6. The sheet provides sort and filter controls within it (at minimum: sort by projected points, value, price, ownership, and start probability; filter by price/budget and a text search), scoped to the position.
- R7. Each candidate's legality is visible in the sheet — affordability within remaining budget, the 3-per-nation cap, and the position quota — so the manager can see what is selectable before choosing.
- R8. Selecting a candidate adds the player to an empty slot or swaps it for the player in a filled slot, then re-runs squad validation; captaincy/vice clears if the outgoing player held it.
- R9. A filled slot also supports removing the player (clearing the slot) from the same sheet.
- R10. The Players tab continues to function as the general player browser, unchanged in purpose.

**Next-game date**

- R11. Each player shows the date of their team's next scheduled game (e.g., "Jun 12"), derived from the earliest upcoming fixture, displayed on the pitch tokens, the player rows, and the player detail sheet.

## Key Flows

- F1. Replace a player from the pitch
  - **Trigger:** Manager taps a filled token (e.g., a forward).
  - **Steps:** Position-scoped sheet opens with the current player indicated; manager sorts/filters; manager picks an eligible candidate; swap is applied and validation re-runs; sheet closes and the pitch updates in place.
  - **Covers:** R4, R5, R6, R7, R8, R9
- F2. Fill an empty slot from the pitch
  - **Trigger:** Manager taps an empty slot.
  - **Steps:** Position-scoped sheet opens in add mode; manager sorts/filters and picks a legal candidate; player is added and validation re-runs; pitch updates in place.
  - **Covers:** R4, R5, R6, R7, R8

## Acceptance Examples

- AE1. **When** the manager taps an empty midfield slot, **then** a sheet opens listing midfielders with sort/filter, and the Players tab is not opened. **Covers R4, R5.**
- AE2. **When** the manager taps a filled forward token, **then** the sheet opens scoped to forwards with the current player marked and replace/remove available. **Covers R5, R8, R9.**
- AE3. **When** the manager changes the sort to Value inside the open sheet, **then** the list reorders within the sheet without leaving the pitch. **Covers R6.**
- AE4. **When** a candidate would exceed the budget or the 3-per-nation cap, **then** the sheet shows that it is not selectable (with the reason) and applying it is prevented. **Covers R7, R8.**
- AE5. **When** a player's team next plays on June 12, **then** "Jun 12" appears on their pitch token, player row, and detail sheet. **Covers R11.**

## Scope Boundaries

- Real or licensed national-team kit images — excluded (IP sensitivity, no assets).
- Per-team jersey color tinting — excluded for now (generic jersey chosen).
- Heavy 3D / WebGL / animated pitch — out of scope; CSS perspective only.
- Kickoff time and opponent on the next-game chip, and any automated bench-timing assist (auto sort or flag bench players by kickoff) — deferred; date-only for now.
- A formal starting-XI vs bench / formation system — out of scope. The app currently treats the 15 as one squad with no XI/bench split; the next-game date supports the manual timing tactic without building formation management.

## Sources / Research

All in `src/app.jsx` unless noted:

- `MyTeam`, `Pitch`, `PitchToken` — current pitch rendering and the Pitch/List toggle to build R1–R3 on.
- `TransferSheet` — existing position-filtered swap sheet; the basis to extend into the unified add/replace selection sheet (R4–R9).
- `PlayersView` — existing sort/filter/search logic to reuse, scoped to position, for R6.
- `buildModel` — produces `fixtures[squadId]` with per-fixture `date` (group games), the source for the next-game date (R11); also `f.diff` for fixture difficulty already used elsewhere.
- `App` (`toggle`, `swap`, `persist`, validation in `toggle`) — squad mutation and the budget/quota/nation rules the selection sheet must respect (R7, R8).
- `CLAUDE.md` — constraints: not affiliated with FIFA, avoid licensed assets; mobile-first; keep the light design language.
