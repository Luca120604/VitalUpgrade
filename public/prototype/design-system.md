# VITAL — Design System

## Concept
Swiss-grid discipline, dark-first, mobile-first health companion. One warm accent. No glow, no neon, no purple AI vibes. Numbers and typography do the talking. Grafik supports comprehension, not decoration.

## Palette (OKLCH)
- `--bg-0`: oklch(0.16 0.004 240)  — page canvas (deep charcoal, never pure black)
- `--bg-1`: oklch(0.20 0.006 240)  — elevated surface
- `--bg-2`: oklch(0.235 0.006 240) — nested card
- `--bg-3`: oklch(0.28 0.006 240)  — input field / pressed
- `--line`: oklch(0.32 0.006 240)  — hairline divider
- `--text-0`: oklch(0.98 0.003 240) — primary text
- `--text-1`: oklch(0.75 0.006 240) — secondary
- `--text-2`: oklch(0.55 0.006 240) — tertiary/captions
- `--text-3`: oklch(0.42 0.006 240) — disabled

### Accent & status (all share chroma ~0.10, lightness ~0.78)
- `--accent`: oklch(0.78 0.09 190)   — muted teal (primary action + ok)
- `--warn`:   oklch(0.80 0.10 75)    — soft amber (beobachten)
- `--alert`:  oklch(0.72 0.11 45)    — clay (abklären, never red)
- `--muted`:  oklch(0.55 0.01 240)   — grey (no data)

## Typography
- Display / UI: **Geist** (fallback: -apple-system)
- Mono / Numerals: **Geist Mono**
- Scale: 11 / 13 / 15 / 17 / 22 / 28 / 40
- Weights: 400, 500, 600
- Tracking: -0.01em on headings, 0.08em uppercase on eyebrows, tabular-nums on all numbers.

## Grid
- 4px base. Gutters 16px. Card radius 20px. Input radius 14px. Pill radius 999.
- Screen edge padding 20px. Safe-area bottom 34px.

## Components
- Cards: `--bg-1`, no border. Hairline `--line` only between rows.
- Tab bar: floating, 72px tall, glass (backdrop-blur + `--bg-1`/0.85).
- Central action button: 62px circle, `--accent`, above tab bar with shadow.
- Segmented control: track `--bg-2`, thumb `--bg-3` with inset highlight.
- Health Ring: 6 segments, 4px gap, stroke 8px on a 200px circle.

## Iconography
- Phosphor-style vector glyphs, stroke 1.5, 24px grid. Drawn inline (simple geometry only). Consistent stroke across the app.

## Motion
- Easing: cubic-bezier(0.22, 1, 0.36, 1) (out-expo feel)
- Durations: 200ms (tap), 320ms (sheet), 500ms (ring build)
- Only transform + opacity. Respect `prefers-reduced-motion`.
