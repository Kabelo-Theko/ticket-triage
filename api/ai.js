// ticket-triage — AI fallback classifier (Vercel serverless function).
//
// The rule-based engine runs first in the browser. Only when it lands a message
// in "General" (no keyword matched) does the UI optionally call this to get a
// best-effort category/priority/first step. Same output shape as the rules.
// Key lives ONLY in NVIDIA_API_KEY (Vercel env); never in repo or client.

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-v4-flash";

const SYSTEM = `You are an IT support triage assistant. Given ONE raw support message, respond ONLY with compact JSON:
{"category":"<one of: Security, Account & Access, Point of Sale, Printer, Email, Network, Software, Hardware, General>","priority":"<High|Medium|Low>","first_step":"<one concrete first action a technician should take>"}
High = trade blocked or many people affected; Medium = recurring or single-person nuisance; Low = otherwise. No markdown, no extra text.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const key = process.env.NVIDIA_API_KEY;
  if (!key) { res.status(503).json({ error: "AI backend not configured" }); return; }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  if (!body) {
    body = await new Promise((resolve) => { let raw = ""; req.on("data", c => raw += c); req.on("end", () => { try { resolve(JSON.parse(raw || "{}")); } catch { resolve({}); } }); });
  }
  const input = (body.input || "").toString().slice(0, 500).trim();
  if (!input) { res.status(400).json({ error: "no input" }); return; }

  const payload = {
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM }, { role: "user", content: input }],
    max_tokens: 300, temperature: 0.2, top_p: 0.95, stream: false,
    chat_template_kwargs: { thinking: false },
  };
  try {
    const r = await fetch(ENDPOINT, { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (!r.ok) { res.status(502).json({ error: "upstream " + r.status }); return; }
    const data = await r.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";
    let out = { category: "General", priority: "Low", first_step: "" };
    const m = text.match(/\{[\s\S]*\}/);
    if (m) { try { const j = JSON.parse(m[0]); out = { category: j.category || "General", priority: j.priority || "Low", first_step: j.first_step || "" }; } catch {} }
    res.status(200).json(out);
  } catch (e) { res.status(502).json({ error: "request failed" }); }
};
