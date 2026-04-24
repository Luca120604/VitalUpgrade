# VitalUpgrade

Mobile-first Health Companion PWA — Next.js 15 + Tailwind + Motion.

## Dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## What's in here

- `public/prototype/` — the full VITAL design handoff (HTML + inline Babel
  JSX + CSS). Open at `/prototype/VITAL.html` in the dev server for the
  iPhone-framed prototype (Home, Werte, Wissen, Einstellungen, action sheets,
  quiz, FAB coach, tweaks panel). Source: `VitalKollege-handoff.zip` on the
  `Luca120604-patch-1` branch.
- `src/app/page.tsx` — production shell landing page that reuses the prototype's
  design system (OKLCH palette, Geist typography, dark bg-0, muted teal
  accent). Links into `/prototype/VITAL.html`.
- `src/app/globals.css` — VITAL design tokens imported as CSS variables
  (`--bg-0/1/2/3`, `--text-0..3`, `--accent`, `--warn`, `--alert`) plus the
  `eyebrow`, `num`, `tap` utility classes from the prototype's `styles.css`.
- `tailwind.config.ts` — exposes the VITAL tokens under
  `bg-{0..3}`, `ink-{0..3}`, `accent`, `warn`, `alert`, plus Geist fonts.
- `src/components/ui/morphing-popover.tsx` — animated popover from the
  component brief, composable primitives with shared `layoutId` morph:
  `MorphingPopover`, `MorphingPopoverTrigger`, `MorphingPopoverContent`.
- `src/hooks/use-click-outside.ts` / `src/lib/utils.ts` — helpers.
- `agents/` — shell scripts that provision the Managed Agents ("Data analyst"
  + Amplitude MCP, "API Designer"). See `agents/README.md`.

## Design source

The original `api.anthropic.com/v1/design/h/...` URL returned 404 when fetched
directly. The design was instead delivered as the `VitalKollege-handoff.zip`
on branch `Luca120604-patch-1` — a Claude Design export. Its runtime prototype
(HTML + Babel-in-browser JSX) is served verbatim under `/prototype/` so the
visuals stay pixel-accurate while the production shell ports the design system.
