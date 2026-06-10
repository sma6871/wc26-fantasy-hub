// Headless render-smoke for the compiled index.html.
// Mounts the built app in jsdom (React injected as globals, fetch/localStorage stubbed
// so the embedded snapshot path runs) and asserts the key screens and flows render.
// Run after ./build.sh:  cd scripts/verify && npm install && npm run verify
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";
import React from "react";
import * as ReactDOMClient from "react-dom/client";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Pull the inline IIFE bundle out of the built artifact.
const html = fs.readFileSync(path.join(REPO, "index.html"), "utf8");
const bundle = html.match(/<script>\n([\s\S]*?)<\/script>/)[1];

// Seed a cheap 15-man squad (so the pitch renders real tokens) by reading SNAP from source.
const src = fs.readFileSync(path.join(REPO, "src/app.jsx"), "utf8");
const snapLine = src.split("\n").find(l => l.startsWith("const SNAP ="));
const SNAP = JSON.parse(snapLine.replace(/^const SNAP =\s*/, "").replace(/;\s*$/, ""));
const cheapest = [...SNAP.p].sort((a, b) => a[4] - b[4]).slice(0, 15).map(a => a[0]);
const seed = JSON.stringify({ ids: cheapest, cap: cheapest[0], vc: cheapest[1] });

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="root"></div></body></html>`,
  { url: "http://localhost", pretendToBeVisual: true });
const { window } = dom;
window.localStorage.setItem("wc26-team", seed);

global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.HTMLElement = window.HTMLElement;
global.requestAnimationFrame = cb => setTimeout(cb, 0);
global.cancelAnimationFrame = id => clearTimeout(id);
global.fetch = () => Promise.reject(new Error("offline-test")); // force the embedded snapshot path
global.React = React;
global.ReactDOM = ReactDOMClient;                                // bundle only needs createRoot

const wait = ms => new Promise(r => setTimeout(r, ms));
const root = document.getElementById("root");
const results = [];
const check = (name, cond, extra = "") => results.push({ name, ok: !!cond, extra });

// Mount the app.
new Function(bundle)();
await wait(150);

// Headline requirement: all 48 team cards render.
const teamCards = root.querySelectorAll(".tcard").length;
check("Teams tab renders 48 team cards", teamCards === 48, `(got ${teamCards})`);

const tabs = () => root.querySelectorAll("nav.tabs .tab");
async function openTab(i) { tabs()[i].click(); await wait(80); }

// Players tab: rows + fixture chips + confidence labels.
await openTab(1);
check("Players tab renders player rows", root.querySelectorAll(".prow").length > 50,
  `(${root.querySelectorAll(".prow").length} rows)`);
check("Fixture-difficulty chips present", root.querySelectorAll(".fixchip").length > 0,
  `(${root.querySelectorAll(".fixchip").length} chips)`);
check("Confidence labels present", /expert-backed|model estimate/.test(root.textContent));

// My Team: pitch, tokens, badges, fixture chips, next-game date.
await openTab(2);
check("My Team shows pitch + view toggle",
  root.querySelector(".pitch") && root.querySelector(".viewtog"));
check("Pitch renders player tokens", root.querySelectorAll(".ptok").length >= 15,
  `(${root.querySelectorAll(".ptok").length} tokens incl. empties)`);
check("Captain/Vice badges on pitch", root.querySelectorAll(".ptok-cv").length >= 2,
  `(${root.querySelectorAll(".ptok-cv").length} badges)`);
check("Pitch tokens carry fixture chips", root.querySelectorAll(".ptok .fixchip").length > 0);
check("Pitch tokens show next-game date",
  root.querySelectorAll(".ptok .png").length > 0 && /[A-Z][a-z]{2}\s\d/.test(root.querySelector(".ptok .png")?.textContent || ""));

// Selection sheet — replace mode (tap a filled token).
const firstToken = root.querySelector(".ptok:not(.empty)");
if (firstToken) { firstToken.click(); await wait(80); }
check("Filled token opens REPLACE sheet", /REPLACE /.test(root.textContent));
check("Sheet has sort/filter controls (search + chips)",
  !!root.querySelector(".searchbar input") && root.querySelectorAll(".pillrow .chip").length >= 3);
check("Sheet lists candidate rows", root.querySelectorAll(".prow").length > 0);
check("Replace mode offers Remove", /Remove/.test(root.textContent));
const xBtn = [...root.querySelectorAll("button")].find(b => b.textContent.trim() === "✕");
if (xBtn) { xBtn.click(); await wait(60); }
check("Sheet closes on close", !/REPLACE |ADD /.test(root.textContent));

// Selection sheet — add mode (tap an empty slot), stays on the pitch.
const emptySlot = root.querySelector(".ptok.empty");
if (emptySlot) { emptySlot.click(); await wait(80); }
check("Empty slot opens ADD sheet, stays on pitch (no Players-tab jump)",
  /ADD /.test(root.textContent) && !!root.querySelector(".pitch"));

// Rules tab: recalibration note.
await openTab(4);
check("Rules tab has the recalibration note",
  /ABOUT THE PROJECTIONS/.test(root.textContent) && /recalibrate after Matchday 1/.test(root.textContent));

let pass = 0;
for (const r of results) {
  console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name} ${r.extra}`);
  if (r.ok) pass++;
}
console.log(`\n${pass}/${results.length} checks passed`);
process.exit(pass === results.length ? 0 : 1);
