# Triage Desk — "Dispatch" design system

**Project:** [ticket-triage](https://github.com/Kabelo-Theko/ticket-triage) · **Redesign:** complete UI/UX overhaul, July 2026

---

## The concept

A first-line support inbox at 08:00 is air traffic: ten things approaching at once,
one of them genuinely can't wait, and the cost of picking wrong is a till offline
while a queue grows. Air-traffic controllers solved this problem decades ago with
**flight progress strips** — physical paper strips, one per aircraft, slotted into
colored holders and racked in bays by urgency. The controller never re-reads the
radio log; the rack *is* the state of the sky.

Triage Desk borrows that machinery literally:

- **Every ticket is a flight strip** — punched rail, colored holder block
  (HIGH / MED / LOW), mono flight data (route, SLA, countdown).
- **The queue is a strip bay** — `BAY 01 · HANDLE FIRST` holds exactly one strip;
  `BAY 02 · THEN, IN SEQUENCE` holds the rest, already ordered.
- **The room is dark** — control rooms run dim so the signal carries. The default
  *Night Ops* theme is an indigo-charcoal canvas where the single signal-orange
  beacon (the handle-first strip) is the brightest thing on screen. *Daylight Ops*
  is the same signage language on paper-white strips.

### Design DNA

| | |
|---|---|
| **Essence** | A dispatch board that converts inbox noise into a landing sequence. Calm authority under pressure. |
| **One-liner** | "An air-traffic control tower hired to land a retail support inbox." |
| **Archetype** | Ruler 70 (procedure, order) / Hero 30 (the urgent save) |
| **Canvas** | Dark chosen deliberately — 24/7 ops-room persona, not a premium default. Indigo-charcoal `#0C0F19` (OKLCH hue 272), never pure black. Daylight theme included. |
| **Accent** | Signal orange `#FF6B1A` (night) / burnt orange `#BC4A00` (day). Budget: the handle-first beacon, the primary action, the active tab. Nothing else. |
| **Type cast** | Barlow Condensed 600/700 (signage display) · Public Sans (body) · JetBrains Mono (all data: IDs, SLAs, countdowns, tabular-nums) |
| **Shape** | 2–4px radius. Strips are hard-edged institutional objects, not friendly cards. |
| **Motion** | Damped-precise. Strips *deal* into the rack (240ms, 40ms stagger). Beacon pings twice, then holds. |
| **Signature** | The strip anatomy: punched perforation rail + vertical colored holder block + mono dataline. No other project in this portfolio may use it. |
| **Rejection list** | No gradients-as-decoration, no glassmorphism, no colored left-border on every card, no Inter, no emoji icons, no centered pill-badge hero, no infinite alert pulses. |

### Why this fits these users

The user is a technician mid-shift, not a dashboard tourist. The design optimizes
for the three questions they ask in the first five seconds — *how bad is it,
which one first, where does the rest go* — answered by the tally LEDs, the beacon
strip, and the route column respectively. Priority is encoded three ways
(holder color, holder text, position) so no meaning rides on color alone.

### How it differs from the sibling projects

This is the only project in the portfolio suite on a dark indigo canvas, the only
one using condensed signage type, the only one with signal orange, and the only
one whose core object is a strip-in-a-bay. (onboard-kit: warm marigold welcome kit
· slo-watch: salmon broadsheet · net-doctor: phosphor oscilloscope ·
requirements-forge: cyanotype blueprint · incident-retro: archival dossier ·
resolve-notes: risograph zine · portfolio: kinetic editorial.)

---

## What's in this folder

| File | Contents |
|---|---|
| `tokens.css` | Full token system, both themes, W3C DTCG tiering — drop into any build |
| `tailwind.config.js` | The same tokens mapped for Tailwind consumers |
| `components.md` | Component library spec: anatomy, all interactive states, responsive variants |
| `accessibility.md` | Measured contrast table, focus, keyboard order, ARIA strategy, SR-only plan |
| `motion.md` | Every animation: trigger, duration, easing, reduced-motion behavior |
| `grid.md` | Breakpoints, column structure, reflow rules |
| `icons/dispatch-icons.svg` | Custom icon set: 24px grid, 1.75 stroke, squared terminals |

## The screens and every state

All states are reachable in the live app (`docs/index.html`):

| State | How to see it |
|---|---|
| Triage · empty (radar) | Load the app — the radar sweeps until traffic arrives |
| Triage · sequencing (loading) | Click **Sequence queue** — skeleton strips mirror the real layout for ~360ms |
| Triage · populated | **Load sample** — 10 real-shaped messages, incl. beacon + both incident banners |
| Site-wide P1 banner | Sample contains 2 Point-of-Sale tickets; add a store name to two messages of one category |
| AI brief · loading / error | Click **AI queue brief** without the backend — designed failure notice |
| AI re-check receipt | A "General" ticket shows **Re-check with AI**; on success the strip carries a reasoning receipt |
| SLA countdown states | `T−3h 40m` (neutral) → `T−45m` (amber, < 1h) → `BREACHED 12m ago` (red) — set the triage time input backwards to see them |
| First-response modal | **First response** on any strip — `<dialog>` with copyable reply |
| Export · empty / populated | Export tab before / after sequencing |
| Reference | Reference tab — the full rulebook as signage tables |
| Dark / light | Toggle in the command bar; persists in localStorage |
| Mobile | ≤ 1000px stacks console over queue; ≤ 560px compresses strip anatomy |
