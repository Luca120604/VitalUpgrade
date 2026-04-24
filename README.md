# VitalUpgrade

Mobile-first Health Companion PWA — Next.js 15 + Tailwind + Motion.

## Dev

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## What's in here

- `src/app/page.tsx` — mobile-first landing screen inspired by `VITAL.html`
  (vitality score hero, today's vitals grid, next check-in card).
- `src/components/ui/morphing-popover.tsx` — animated popover that morphs from
  its trigger using shared `layoutId`s (Motion). Composable primitives:
  `MorphingPopover`, `MorphingPopoverTrigger`, `MorphingPopoverContent`.
- `src/hooks/use-click-outside.ts` / `src/lib/utils.ts` — supporting helpers
  (`cn` via `clsx` + `tailwind-merge`).
- `agents/` — shell scripts that provision the Managed Agents ("Data analyst"
  with the Amplitude MCP, and "API Designer"). See `agents/README.md`.

## Note on the design source

The source design URL (`api.anthropic.com/v1/design/h/...`) returned 404 when
fetched, so the landing page here implements the VITAL theme from the component
brief you supplied (a health-tracking morphing popover over a mobile dashboard)
rather than pixel-reproducing a file we couldn't read.
