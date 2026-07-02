# Motion spec — Triage Desk "Dispatch"

Temperament: **damped-precise**. Motion communicates sequencing, state change and
confirmation — never decoration. All UI motion ≤ 300ms; transform/opacity only.

## Tokens

```css
--motion-micro: 120ms;   /* hover, press, toggle          */
--motion-small: 200ms;   /* tabs, chips, tooltips         */
--motion-large: 300ms;   /* dialogs, toasts, view chrome  */
--motion-deal: 240ms;    /* strip deal-in                 */
--motion-page: 420ms;    /* the single page-load reveal   */
--stagger-strip: 40ms;   /* per-strip delay               */
--ease-standard:  cubic-bezier(0.2, 0, 0, 1);    /* micro state    */
--ease-out-soft:  cubic-bezier(0.32, 0.72, 0, 1); /* strips, panels */
--ease-emphasized: cubic-bezier(0.05, 0.7, 0.1, 1); /* reveals, dialogs */
```

Never `ease-in`. Never default `ease`. No springs — this is a control room, not a toy.

## Choreography table

| Interaction | Trigger | Animation | Duration / easing | Why it exists |
|---|---|---|---|---|
| Page-load reveal | view render | `.reveal` — fade + 8px rise | 420ms `--ease-emphasized` | one load animation per page; directs the eye to the board |
| Strip deal-in | after sequencing | `.deal` — fade + 10px rise, staggered `calc(var(--i) * 40ms)` | 240ms `--ease-out-soft` | narrates the *sort*: strips land in priority order, top first |
| Sequencing skeleton | Sequence queue click | 3 skeleton strips, shimmer sweep | 1.15s linear loop, ~360ms window | loading state mirrors the real strip anatomy — no spinner-only |
| Beacon ping | handle-first strip lands | ring scales 0.4→1.25, fades | 1.1s `--ease-emphasized` × **2 iterations, then holds static** | attention: exactly one urgent element; no infinite alarm |
| Radar sweep + blips | empty state (ambient) | 360° rotation; blips fade in/out | 7s linear loop | ambient "listening" status; stops under reduced motion |
| Tab change | click/Enter | underline color + border swap; focus moves to view title | 200ms `--ease-standard` | wayfinding |
| Button hover/press | pointer | bg shift; press = translateY(1px) | 120ms `--ease-standard` | tactile confirmation |
| Busy buttons | AI fetch | inline spinner (rot 0.7s) + label swap + `aria-busy` | until resolve | honest progress on network work |
| SLA countdown tick | 30s interval | text swap only — no animation | — | data updates should not dance |
| Toast in/out | copy/download success | slide-in from right 14px / fade-down out | 300ms in, 200ms out | confirmation with receipt; auto-dismiss 2.4s |
| Dialog open | First response | fade + 12px rise + 0.985 scale | 300ms `--ease-emphasized` | spatial origin from the strip |
| Banner entrance | incident detected | shares the deal stagger (index 1–2) | 240ms | banners arrive *before* strips — severity first |

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

No information is conveyed by motion alone: the beacon strip is also first-in-bay
with an orange border; sequencing is also announced via the live region; toasts
are also announced via `role="status"`.
