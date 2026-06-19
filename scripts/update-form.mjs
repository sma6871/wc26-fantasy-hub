#!/usr/bin/env node
// Updates curated start probabilities (INTEL[id].st) in src/app.jsx from actual match results.
// Run this after each matchday, then ./build.sh — the only required manual step to keep start
// tiers in sync with who is actually playing.
//
// Usage: node scripts/update-form.mjs
//
// How start tiers are inferred:
//   The feed reports each player's lineup status directly via matchStatus, so when it carries a
//   real value we trust it:
//     matchStatus "start"  -> st 0.93
//     matchStatus "sub"    -> st 0.55
//     matchStatus null     -> SKIP (leave the curated tier untouched)
//   matchStatus resets to null between rounds, before the next XI is published. A null is NOT a
//   benching, so we must not write 0.35 for it: doing that once a team has played MD1 but not MD2
//   would wipe the hand-curated tier of every nailed starter. Players whose team has not played at
//   all are also left untouched. This mirrors the override in buildModel exactly.
//   New players with a real lineup status but no existing INTEL entry are appended.
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://play.fifa.com/json/fantasy";
const j = async (f) => (await fetch(`${BASE}/${f}.json`)).json();

const [players, , rounds] = await Promise.all([j("players"), j("squads"), j("rounds")]);

// squads that have completed at least one match (group stage)
const playedTeams = new Set();
for (const r of rounds) {
  for (const t of r.tournaments || []) {
    if (t.status === "complete" && t.homeScore != null && t.awayScore != null) {
      playedTeams.add(t.homeSquadId);
      playedTeams.add(t.awaySquadId);
    }
  }
}

const startProbFromMatchStatus = (ms) => (ms === "start" ? 0.93 : 0.55); // only called for start/sub

const updates = new Map(); // id -> st
for (const p of players) {
  if (p.status !== "playing") continue;
  if (!playedTeams.has(p.squadId)) continue; // don't touch teams that haven't played yet
  const ms = p.matchStatus || null;
  if (ms !== "start" && ms !== "sub") continue; // null between rounds is not a benching - skip it
  updates.set(p.id, startProbFromMatchStatus(ms));
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
console.log(`update-form: ${updated} start tiers updated, ${toAppend.length} added (from ${updates.size} players with a published start/sub lineup status).`);
console.log("Now run ./build.sh to regenerate index.html.");
