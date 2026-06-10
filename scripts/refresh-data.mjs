#!/usr/bin/env node
// Refreshes the embedded SNAP dataset in src/app.jsx from the official public feeds.
// Player PRICES are fixed for the whole tournament, but ownership %, squad lists and
// fixtures can change, so re-run this when you want fresh numbers, then ./build.sh.
//
// Usage: node scripts/refresh-data.mjs
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://play.fifa.com/json/fantasy";
const POS = { GK: 0, DEF: 1, MID: 2, FWD: 3 };

const j = async (f) => (await fetch(`${BASE}/${f}.json`)).json();

const [players, squads, rounds] = await Promise.all([
  j("players"), j("squads"), j("rounds"),
]);

const p = players
  .filter((x) => x.status === "playing")
  .map((x) => [
    x.id,
    x.knownName || `${x.firstName || ""} ${x.lastName || ""}`.trim(),
    x.squadId,
    POS[x.position],
    x.price,
    x.percentSelected,
  ]);

const s = squads.map((x) => [x.id, x.name, x.group, x.abbr]);

const f = [];
for (const r of rounds) {
  for (const t of r.tournaments || []) {
    f.push([r.id, (t.date || "").slice(0, 16), t.venueCity || "", t.homeSquadId, t.awaySquadId]);
  }
}

const snap = JSON.stringify({ p, s, f });

const path = new URL("../src/app.jsx", import.meta.url);
let src = readFileSync(path, "utf8");
src = src.replace(/const SNAP = \{[\s\S]*?\};/, `const SNAP = ${snap};`);
writeFileSync(path, src);

console.log(`Updated SNAP: ${p.length} players, ${s.length} squads, ${f.length} fixtures.`);
console.log("Now run ./build.sh to regenerate index.html.");
