// Vercel serverless function: proxies the AI coach to Google Gemini 2.5 Flash.
// The API key lives only here (process.env.GEMINI_API_KEY), never in client code.
// Client calls POST /api/coach with { system: "...", messages: [{role, content}, ...] }.

const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
const ALLOWED_ORIGIN = "https://fantasy26.help";

export default async function handler(req, res) {
  // CORS (production is same-origin, but allow the canonical domain explicitly).
  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Coach is not configured yet." });
    return;
  }

  try {
    // Vercel parses JSON bodies, but be defensive if a raw string arrives.
    let payload = req.body;
    if (typeof payload === "string") {
      try { payload = JSON.parse(payload); } catch (e) { payload = {}; }
    }
    const { messages = [], system = "" } = payload || {};

    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const body = { contents };
    if (system) body.system_instruction = { parts: [{ text: system }] };

    const upstream = await fetch(`${GEMINI_URL}?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await upstream.json();

    if (!upstream.ok) {
      const msg = data && data.error && data.error.message
        ? data.error.message
        : "Coach upstream error.";
      res.status(upstream.status).json({ error: msg });
      return;
    }

    const parts =
      (data.candidates && data.candidates[0] &&
        data.candidates[0].content && data.candidates[0].content.parts) || [];
    const text = parts.map((p) => p.text).filter(Boolean).join("\n").trim();

    if (!text) {
      res.status(502).json({ error: "Empty reply from coach." });
      return;
    }

    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: "Coach request failed." });
  }
}
