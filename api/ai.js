// ticket-triage — AI serverless harness (Vercel function).
// Two tasks:
//   - "classify" (default): best-effort category/priority/first_step for ONE
//     ambiguous message the rules could not place.
//   - "brief": a shift-handover brief over the WHOLE triaged queue (state of the
//     queue, what to handle first and why, possible major incidents, what to watch).
// Model toggle: "flash" (default), "pro", "minimax". One NVIDIA_API_KEY powers
// all three (optional per-model overrides). Key stays server-side only.

const ENDPOINT = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODELS = {
  flash:   { id: "deepseek-ai/deepseek-v4-flash", keys: ["NVIDIA_API_KEY_FLASH", "NVIDIA_API_KEY"], extra: { chat_template_kwargs: { thinking: false } } },
  pro:     { id: "deepseek-ai/deepseek-v4-pro",   keys: ["NVIDIA_API_KEY_PRO", "NVIDIA_API_KEY"],   extra: { chat_template_kwargs: { thinking: false } } },
  minimax: { id: "minimaxai/minimax-m3",          keys: ["NVIDIA_API_KEY_MINIMAX", "NVIDIA_API_KEY"], extra: {} },
};
const cfgFor = (m) => MODELS[m] || MODELS.flash;
const keyFor = (c) => { for (const e of c.keys) { if (process.env[e]) return process.env[e]; } return null; };
async function readBody(req) {
  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch { b = {}; } }
  if (!b) { b = await new Promise((res) => { let raw = ""; req.on("data", c => raw += c); req.on("end", () => { try { res(JSON.parse(raw || "{}")); } catch { res({}); } }); }); }
  return b || {};
}
const jsonFrom = (t) => { const m = t.match(/\{[\s\S]*\}/); if (!m) return null; try { return JSON.parse(m[0]); } catch { return null; } };

const SYS_CLASSIFY = `You are an IT support triage assistant. Given ONE raw support message, respond ONLY with compact JSON:
{"category":"<one of: Security, Account & Access, Point of Sale, Printer, Email, Network, Software, Hardware, General>","priority":"<High|Medium|Low>","first_step":"<one concrete first action a technician should take>"}
High = trade blocked or many people affected; Medium = recurring or single-person nuisance; Low = otherwise. No markdown, no extra text.`;

const SYS_BRIEF = `You are a shift lead writing a concise handover brief for a first-line IT support queue. You are given a list of already-triaged tickets (priority, category, one-line summary). Respond ONLY with compact JSON:
{"brief":"<plain-text brief, 90-150 words, using short labelled lines: 'Queue:' one line on overall state; 'Handle first:' the 2-3 most urgent and why; 'Watch:' any category cluster that looks like a possible site-wide or major incident; 'Notes:' anything else a colleague taking over should know>"}
Be factual and specific to the tickets given. No markdown symbols, no em dashes, no fluff.`;

async function callModel(cfg, key, messages, max_tokens, temperature) {
  const payload = { model: cfg.id, messages, max_tokens, temperature, top_p: 0.95, stream: false, ...cfg.extra };
  const ctrl = new AbortController(); const to = setTimeout(() => ctrl.abort(), 55000);
  try {
    const r = await fetch(ENDPOINT, { method: "POST", headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctrl.signal });
    clearTimeout(to);
    if (!r.ok) return { error: "upstream " + r.status };
    const d = await r.json();
    return { text: (d.choices?.[0]?.message?.content || "").trim() };
  } catch (e) { clearTimeout(to); return { error: "request failed" }; }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") { res.status(405).json({ error: "POST only" }); return; }
  const body = await readBody(req);
  const cfg = cfgFor(body.model);
  const key = keyFor(cfg);
  if (!key) { res.status(503).json({ error: "AI backend not configured" }); return; }

  if (body.task === "brief") {
    const tickets = Array.isArray(body.tickets) ? body.tickets.slice(0, 40) : [];
    if (!tickets.length) { res.status(400).json({ error: "no tickets" }); return; }
    const lines = tickets.map(t => `- [${t.priority}] ${t.category}: ${t.summary}`).join("\n");
    const out = await callModel(cfg, key, [{ role: "system", content: SYS_BRIEF }, { role: "user", content: "Tickets:\n" + lines }], 500, 0.4);
    if (out.error) { res.status(502).json({ error: out.error }); return; }
    const j = jsonFrom(out.text) || { brief: out.text };
    res.status(200).json({ brief: j.brief || out.text, model: cfg.id });
    return;
  }

  const input = (body.input || "").toString().slice(0, 500).trim();
  if (!input) { res.status(400).json({ error: "no input" }); return; }
  const out = await callModel(cfg, key, [{ role: "system", content: SYS_CLASSIFY }, { role: "user", content: input }], 300, 0.2);
  if (out.error) { res.status(502).json({ error: out.error }); return; }
  const j = jsonFrom(out.text) || {};
  res.status(200).json({ category: j.category || "General", priority: j.priority || "Low", first_step: j.first_step || "", model: cfg.id });
};
