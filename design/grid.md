# Responsive grid & layout rules — Triage Desk "Dispatch"

## Breakpoints

| Token | Width | What changes |
|---|---|---|
| `--bp-strip` | ≤ 560px | Strip anatomy compresses: rail 14→10px, holder 52→44px; dataline gap tightens; clock and wordmark subtitle hide; tally actions go full-width |
| `--bp-board` | ≤ 1000px | The board collapses from two columns to one; console loses `position: sticky` and stacks above the queue |
| max | 1180px | `--board-max` — the board never stretches wider; margins grow |

Design-checked at 360 / 768 / 1280 / 1536 px.

## Column structure

**Desktop (> 1000px)** — the board:

```
┌─ command bar (sticky) ──────────────────────────────────┐
│ brand · tabs ──────────────────── clock · theme ────────│
├─────────────────────────────────────────────────────────┤
│ masthead (eyebrow / display H1 / lede)                   │
│ ┌ console 372px (sticky top:74px) ┬ queue 1fr ─────────┐ │
│ │ raw traffic textarea            │ tally board        │ │
│ │ triage time · AI model          │ banners            │ │
│ │ actions · legend                │ BAY 01 · beacon    │ │
│ │                                 │ BAY 02 · strips…   │ │
│ └─────────────────────────────────┴────────────────────┘ │
│ footer                                                    │
└──────────────────────────────────────────────────────────┘
```

Grid: `grid-template-columns: minmax(0, 372px) minmax(0, 1fr); gap: 24px`.
The console is sticky so the input stays reachable while scanning a long queue.

**Tablet / mobile (≤ 1000px)**: single column, console first (input is the entry
task), queue below. Console un-sticks to avoid trapping the viewport.

## Strip reflow

The strip is a 3-column grid `[rail | holder | body]`:

- ≥ 560px: `14px | 52px | 1fr` (lead: `14px | 60px | 1fr`)
- < 560px: `10px | 44px | 1fr` (lead: `10px | 48px | 1fr`)
- The dataline (`route / SLA / countdown`) is flex-wrap; on narrow screens items
  wrap to their own lines in source order — route first, countdown last.
- Action rows wrap; WhatsApp dispatch (High only) drops to a second line before
  anything truncates.

## Type fluidity

- Masthead: `clamp(2.6rem, 1.7rem + 4.2vw, 4.5rem)` (Barlow Condensed 700).
- View titles: `clamp(1.9rem, 1.4rem + 2vw, 2.6rem)`.
- Body and data sizes are fixed (15px / 13px) — operational text should not scale
  with viewport, only reflow.
- Measures: lede capped at 62ch; empty-state copy at 54ch.

## Spacing rhythm

4px base grid. Component interiors use `--space-3/4` (12/16px); board gaps
`--space-6` (24px); section rhythm `--space-8..16` (32–64px). The audit script
reports 91% on-grid (remaining: optical 2px compensations inside condensed-type
holder blocks).

## Container behavior

Tables (`Reference`, CSV preview) scroll horizontally inside their panel on
overflow rather than breaking the page grid. The toaster is viewport-fixed
bottom-right and stacks upward.
