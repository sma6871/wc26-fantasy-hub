#!/usr/bin/env node
// Updates curated start probabilities (INTEL[id].st) in src/app.jsx from actual match results.
// Run this after each matchday, then ./build.sh — the only required manual step to keep start
// tiers in sync with who is actually playing.
//
// Usage: node scripts/update-form.mjs
//
// How start tiers are inferred:
//   The public FIFA feed exposes per-player POINTS but not per-player MINUTES. Points map back
//   to a minutes band via the official scoring rules: a 60+ min appearance is worth >=2 appearance
//   points, a sub-60 cameo exactly 1, and any goal/assist confirms a start. So:
//     scored or assisted        -> 90 min equivalent -> st 0.93
//     >=2 points in the feed     -> 60+ min            -> st 0.93
//     exactly 1 point            -> sub-60 cameo       -> st 0.55
//     0 / negative points        -> ambiguous (benched, or played and netted out) -> no change
//   If the feed ever exposes real minutes (stats.minutesPlayed), those are used directly instead.
//
// Only EVIDENCE-POSITIVE updates are applied: a curated start tier is never lowered just because a
// player has no data yet, so the hand-curated edge is preserved. New players with evidence but no
// existing INTEL entry are appended.
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://play.fifa.com/json/fantasy";
const j = async (f) => (await fetch(`${BASE}/${f}.json`)).json();

const [players, , rounds] = await Promise.all([j("players"), j("squads"), j("rounds")]);

// goals/assists confirm a start
const scoredOrAssisted = new Set();
for (const r of rounds) {
  for (const t of r.tournaments || []) {
    for (const arr of [t.homeGoalScorersAssists, t.awayGoalScorersAssists]) {
      for (const g of arr || []) {
        if (g.playerId != null) scoredOrAssisted.add(g.playerId);
        if (g.assistId != null) scoredOrAssisted.add(g.assistId);
      }
    }
  }
}

const startProbFromMinutes = (min) =>
  min == null ? null : min >= 90 ? 0.93 : min >= 45 ? 0.78 : min >= 1 ? 0.55 : 0.35;
const minutesFromPoints = (pts, sa) =>
  sa ? 90 : pts == null ? null : pts >= 2 ? 90 : pts >= 1 ? 30 : null;

const updates = new Map(); // id -> st
for (const p of players) {
  if (p.status !== "playing") continue;
  const pts = p.stats && typeof p.stats.totalPoints === "number" ? p.stats.totalPoints : null;
  const realMin = p.stats && typeof p.stats.minutesPlayed === "number" ? p.stats.minutesPlayed : null;
  const min = realMin != null ? realMin : minutesFromPoints(pts, scoredOrAssisted.has(p.id));
  const st = startProbFromMinutes(min);
  if (st != null) updates.set(p.id, st); // evidence-positive only
}

const path = new URL("../src/app.jsx", import.meta.url);
let src = readFileSync(path, "utf8");

let updated = 0;
const toAppend = [];
for (const [id, st] of updates) {
  const re = new RegExp(`("${id}":\\{)([^}]*)(\\})`);
  const m = src.match(re);
  if (m) {
    let body = m[2];
    body = /"st":[\d.]+/.test(body)
      ? body.replace(/"st":[\d.]+/, `"st":${st}`)
      : `"st":${st}` + (body ? "," + body : "");
    src = src.replace(re, `$1${body}$3`);
    updated++;
  } else {
    toAppend.push(`"${id}":{"st":${st}}`);
  }
}
if (toAppend.length) {
  src = src.replace(/(const INTEL = \{[\s\S]*?)(\};)/, (_all, a, b) => `${a},${toAppend.join(",")}${b}`);
}

writeFileSync(path, src);
console.log(`update-form: ${updated} start tiers updated, ${toAppend.length} added (from ${updates.size} players with match evidence).`);
console.log("Now run ./build.sh to regenerate index.html.");
