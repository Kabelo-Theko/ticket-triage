# Accessibility sheet — Triage Desk "Dispatch"

Target: WCAG 2.2 AA. Everything below is implemented in `docs/index.html`.

## Measured contrast (WCAG 2.x ratios)

### Night Ops theme

| Pair | Ratio | Verdict |
|---|---|---|
| `--text-max` #F0F3FA on `--canvas-base` #0C0F19 | 15.9:1 | AAA |
| `--text-primary` #D5DAE6 on `--canvas-base` | 12.6:1 | AAA |
| `--text-primary` on `--canvas-card` #1B1F2A | 10.6:1 | AAA |
| `--text-secondary` #9BA1B0 on `--canvas-card` | 6.36:1 | AA+ |
| `--text-tertiary` #868B9C on `--canvas-base` | 5.4:1 | AA (captions on canvas only — never on cards) |
| `--on-accent` #1D0D07 on `--accent` #FF6B1A | 6.62:1 | AA+ (primary buttons) |
| `--accent-text` #FF8A47 on `--canvas-base` / card | 8.18 / 7.04:1 | AAA |
| HIGH holder: #2A0B08 on #FB8276 | 7.44:1 | AAA |
| MED holder: #241A02 on #F0BB3B | 9.71:1 | AAA |
| LOW holder: #06230F on #54C57A | 7.68:1 | AAA |
| `--danger-text` #FF9C92 on card | 8.17:1 | AAA |
| `--warning-text` #F0BB3B on card | 9.31:1 | AAA |
| `--success-text` #7BD49A on card | 9.19:1 | AAA |

### Daylight Ops theme

| Pair | Ratio | Verdict |
|---|---|---|
| `--text-max` #101320 on `--canvas-base` #F2F3F7 | 16.9:1 | AAA |
| `--text-primary` #23273A on card #FFFFFF | 13.4:1 | AAA |
| `--text-secondary` #545A70 on card | 6.83:1 | AA+ |
| `--on-accent` #FFFFFF on `--accent` #BC4A00 | 5.1:1 | AA |
| `--accent-text` #A84200 on canvas | 5.5:1 | AA |
| HIGH holder: #FFF5F4 on #B3382E | 5.57:1 | AA |
| MED holder: #FFFAEE on #8A6100 | 5.32:1 | AA |
| LOW holder: #F2FBF5 on #24784A | 5.15:1 | AA |
| danger/warning/success `-text` on white | 6.66 / 6.65 / 6.23:1 | AA+ |

Rules encoded in the token comments:
- `--text-tertiary` may appear on `--canvas-base` only, never on cards.
- `--text-disabled` is decorative/disabled only — never carries information.

## Focus indicators

- Every interactive element uses `:focus-visible` with a two-layer ring:
  `0 0 0 2px canvas, 0 0 0 4px accent` — 2px visible thickness, ≥ 3:1 against
  both canvas and control, never obscured by the sticky command bar
  (`scroll-margin` via sticky offset).
- Focus is never removed, only styled. No `outline: none` without replacement.

## Keyboard navigation order

1. Skip link ("Skip to board") → `#main`
2. Brand (home) → view tabs (Triage / Export / Reference) → theme toggle
3. Console: messages textarea → triage time → AI model → Sequence queue → Load sample → Clear
4. Queue: AI queue brief → Export → then each strip in queue order:
   First response → (Re-check with AI) → Run diagnostics → (Dispatch WhatsApp)
5. Footer links

Extras:
- **Ctrl/Cmd + Enter** inside the textarea runs the sequence (documented in UI copy).
- View switches move focus to the new view's `<h2 data-viewtitle>` so screen-reader
  and keyboard users land at the top of the new context.
- The first-response `<dialog>` uses the native focus trap; **Escape** closes;
  backdrop click closes; focus returns to the invoking button.

## ARIA strategy

| Surface | Treatment |
|---|---|
| Views | Tab buttons carry `aria-current="page"`; views are full region swaps, announced via focus move + live region |
| Dynamic results | Visually-hidden `role="status" aria-live="polite"` region announces outcomes ("10 tickets sequenced. 3 high, 4 medium, 3 low."), instead of making the whole results region live (prevents over-announcement on re-render) |
| Site-wide P1 banner | `role="alert"` — it is the one genuinely interrupting message |
| Strips | `<article aria-label="Ticket TKT-0001, priority High">`; holder blocks are `aria-hidden` (decorative duplicates) with an `sr-only` "Priority High." inside the meta row |
| Icons | All decorative: `aria-hidden="true"` on every `<svg>`; buttons carry text labels or `aria-label` (icon-only buttons: theme toggle, dialog close) |
| Busy states | Buttons set `aria-busy="true"` while fetching; label text changes ("Briefing…", "Asking AI…") |
| Theme toggle | `aria-pressed` + dynamic `aria-label` ("Switch to daylight theme") |
| Radar | Single `role="img"` with a full `aria-label`; internal parts hidden |
| Clock | `aria-hidden` — ambient, duplicated nowhere critical |

## Screen-reader-only content plan

- `.sr-only` utility for: priority announcement inside strips, live status region,
  skip-link target context.
- SLA countdowns update silently (no live region) — they are glanceable state, and
  announcing a countdown every 30s would be hostile. The breach *text* is in the
  accessible name of each strip's dataline.

## Color independence

Priority is triple-encoded: holder color + holder text (HIGH/MED/LOW) + bay
position. Banners pair color with an alert icon and bold lead-in words.
Countdown urgency pairs color with text ("BREACHED 12m ago").

## Motion

- Global `prefers-reduced-motion: reduce` collapse (animations + transitions to 0.01ms,
  iteration count 1).
- The 6 infinite loops are all **ambient status** (radar sweep ×2, radar blips,
  button spinner, skeleton shimmer) — none carries unique information; all stop
  under reduced motion. Alert pulses (beacon ping) run exactly 2 iterations, then hold.

## Targets & zoom

- All interactive targets ≥ 36×36px (icon buttons) or ≥ 40px tall (buttons/inputs).
- No `user-scalable=no`; layout is fluid to 360px wide.
