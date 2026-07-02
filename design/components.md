# Component library — Triage Desk "Dispatch"

Every component references **semantic tokens only** (`tokens.css`). States listed
are all implemented in `docs/index.html`. Type roles: display = Barlow Condensed,
text = Public Sans, data = JetBrains Mono (`tabular-nums` on all numerals).

---

## Navigation

### Command bar (`.cmdbar`)
Sticky, blurred `canvas-elevated` at 88% + 1px bottom hairline. Contains brand,
view tabs, live clock (mono, `aria-hidden`), theme toggle.
- **Responsive:** ≤ 560px hides clock and wordmark subtitle; tabs scroll horizontally (scrollbar hidden).

### View tabs (`.tab`)
Condensed-caps buttons with a 2px bottom indicator.
| State | Treatment |
|---|---|
| default | `text-secondary`, transparent indicator |
| hover | `text-primary` |
| active (`aria-current="page"`) | `accent-text` + accent indicator |
| focus-visible | two-layer focus ring, radius 2px |

### Theme toggle / icon buttons (`.iconbtn`)
36×36px, 1px border. States: default / hover (border-strong + text-primary) /
focus-visible (ring) / pressed (`aria-pressed` swaps sun↔moon icon + label).

---

## Buttons (`.btn`)

Condensed-caps labels, 4px radius, optional leading icon (18px, stroke 1.75).

| Variant | Use |
|---|---|
| `.btn-primary` | one per view — the screen's primary action (accent bg, `on-accent` ink) |
| `.btn-ghost` | secondary actions (transparent, hairline border) |
| `.btn-sm` | strip-level actions (13px label, 8×12px padding) |

Six states, all designed:
| State | Primary | Ghost |
|---|---|---|
| default | `--accent` bg | transparent + `border-default` |
| hover | `--accent-hover` | `border-strong`, `text-primary` |
| focus-visible | focus ring (2px canvas + 2px accent) | same |
| active | `--accent-pressed` + translateY(1px) | translateY(1px) |
| disabled | opacity .55, `cursor: not-allowed` | same |
| loading | `aria-busy="true"` + inline 14px spinner + label swap ("Briefing…") | same |

---

## Inputs

### Textarea (raw traffic wire)
Mono 13px on `canvas-sunken`, 1px border. States: default / hover (border-strong)
/ focus-visible (ring, border transparent) / placeholder (`text-disabled`).
Live message counter (`.wirecount`) updates on input. Ctrl/Cmd+Enter submits.

### Time input & select (AI model)
Same field treatment; select has a custom CSS caret (no native arrow), 36px
right padding. Labels are mono caps `.fld` — every field labelled, no
placeholder-as-label.

---

## The flight strip (`.strip`) — signature component

3-column grid `[rail | holder | body]`.

- **Rail** — punched perforation (radial-gradient dots on 14×12 grid) + dashed divider. Decorative, `aria-hidden`.
- **Holder block** — vertical condensed 700 caps: `HIGH` (danger bg/ink), `MED` (warning), `LOW` (success). Duplicated for SR as `sr-only` text.
- **Body** — meta row (beacon label · category chip · store chip · mono ticket ID · AI chip) → summary → optional reasoning receipt → dataline (`ROUTE · SLA · COUNTDOWN`, mono) → first step (dashed rule above) → action row.

| State | Treatment |
|---|---|
| default | `canvas-card`, hairline border, `shadow-1` + inner edge |
| hover | `canvas-card-hover`, `border-strong` |
| **lead (beacon)** | THE one accent element: `accent-border`, `shadow-2` + `accent-glow`, condensed 26px summary, beacon label with 2-ping ring |
| AI-assisted | accent-outline chip + mono reasoning receipt line |
| countdown states | neutral `T−3h 40m` → `breach-soon` (warning text, < 1h) → `breach-late` (`BREACHED 12m ago`, danger 700) |
| entering | `.deal` — 240ms rise, 40ms stagger by index |

### Skeleton strip (`.skel`)
Loading mirror of the real anatomy: rail + holder block + 3 shimmer lines
(60/85/40%). Shown during sequencing with the mono note "SEQUENCING TRAFFIC…".

---

## Cards & surfaces

### Tally board (`.tally`)
Departure-board group: LED square (2px radius, semantic color) + condensed label +
mono 20px zero-padded count (`03`). Actions right-aligned; full-width ≤ 560px.

### Bay label (`.bay`)
`BAY 01` mono micro + condensed name + 1px rule filling the row. The first bay's
name is accent and its rule fades from accent — part of the accent budget.

### Banners
| Variant | Role | Treatment |
|---|---|---|
| `.banner.site` | `role="alert"` — site-wide P1 risk (≥2 same category + store) | danger-subtle bg, danger border, alert icon |
| `.banner.cat` | possible major incident (≥3 same category) | warning-subtle equivalents |

### AI brief card (`.aibrief`)
Accent-bordered card: AI chip → brief prose → reasoning receipt → copy action.
Failure variant `.notice`: plain card explaining the missing backend — the queue
still works; the tool never blocks on AI.

### Empty state (radar)
Grid: 150px radar SVG + teaching copy (what appears, why it matters, exact CTA
"Load a sample inbox"). Ambient sweep + blips; static under reduced motion.

---

## Overlays

### First-response dialog (`<dialog class="replydlg">`)
Native `showModal()` (free focus trap + Escape). Head (title + close icon) /
body (mono `pre.block` reply) / foot (Close ghost + Copy primary). Backdrop:
scrim + 2px blur; click-outside closes. Entrance 300ms rise+scale.

### Toasts (`.toaster` / `.toast`)
Fixed bottom-right stack. Check icon + mono message, accent left rule (the one
permitted accent rule — it's a receipt, not a card pattern). Auto-dismiss 2.4s;
also announced via the SR live region.

---

## Data tables (`.ref`)
Signage tables: condensed-caps header row on `canvas-elevated`, hairline row
rules, first column `text-primary`, mono for durations. Horizontal scroll inside
panel on overflow. Used in Reference (rulebook) and Export (CSV preview as
mono `pre.block`).

---

## Iconography
Custom set (`design/icons/dispatch-icons.svg`): 24px grid, 1.75px stroke,
**squared terminals** (`stroke-linecap: square`) to match the signage voice.
16 symbols: tower, strip, radar, clock, route, export, book, copy, radio, spark,
alert, pin, sun, moon, check, x, wire. Always `currentColor`; always
`aria-hidden` (adjacent text or `aria-label` carries meaning).
