// VITAL — FAB coach-mark: a one-shot onboarding hint pointing at the
// central "add entry" button. Fades in on first main-app visit, dims the
// rest of the phone surface, spotlights the FAB, and shows a short
// explanation. Tap anywhere to dismiss.

const { useEffect: useEffectFC, useState: useStateFC } = React;

function FabCoach({ onDismiss }) {
  const [pos, setPos] = useStateFC(null); // {cx, cy, r} in device-frame coords

  useEffectFC(() => {
    // Find the FAB (tagged with data-coach="fab") and its centre relative
    // to the nearest positioned ancestor — which in our shell is .device.
    const measure = () => {
      const fab = document.querySelector('[data-coach="fab"]');
      if (!fab) return;
      const device = fab.closest('.device') || fab.offsetParent;
      if (!device) return;
      const fr = fab.getBoundingClientRect();
      const dr = device.getBoundingClientRect();
      setPos({
        cx: fr.left - dr.left + fr.width / 2,
        cy: fr.top  - dr.top  + fr.height / 2,
        r:  Math.max(fr.width, fr.height) / 2 + 10,
      });
    };
    measure();
    // re-measure next frame in case fonts/layout are still settling
    const raf = requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure); };
  }, []);

  if (!pos) return null;

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'absolute', inset: 0, zIndex: 90,
        animation: 'coachIn 260ms ease-out both',
      }}
      aria-label="Hinweis schließen"
    >
      {/* Dimmer with a circular cutout around the FAB.
          Uses a radial-gradient mask so the FAB shows through clearly. */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(circle at ${pos.cx}px ${pos.cy}px,
          rgba(0,0,0,0) ${pos.r - 2}px,
          rgba(0,0,0,0.25) ${pos.r}px,
          rgba(0,0,0,0.68) ${pos.r + 30}px)`,
        backdropFilter: 'blur(1px)',
      }} />

      {/* Pulsing spotlight ring around the FAB */}
      <div style={{
        position: 'absolute',
        left: pos.cx - pos.r - 8, top: pos.cy - pos.r - 8,
        width: (pos.r + 8) * 2, height: (pos.r + 8) * 2,
        borderRadius: '50%',
        border: '1.5px solid oklch(0.92 0.02 240 / 0.85)',
        boxShadow: '0 0 0 2px rgba(0,0,0,0.25) inset',
        animation: 'coachPulse 1600ms ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Tooltip — sits above the FAB with a little downward-pointing arm */}
      <div style={{
        position: 'absolute',
        left: 20, right: 20,
        bottom: (260 /* device height sanity */, 0) + (/* place above FAB */ 0),
        top: pos.cy - 170,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          background: 'var(--bg-1)', color: 'var(--text-0)',
          border: '0.5px solid var(--line)', borderRadius: 18,
          padding: '14px 16px', width: '100%',
          boxShadow: '0 18px 40px rgba(0,0,0,0.45)',
          pointerEvents: 'auto',
        }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 6 }}>
            Eintrag hinzufügen
          </div>
          <div style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.35, marginBottom: 6 }}>
            Hier loggst du schnell alles rund um deinen Tag.
          </div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.45 }}>
            Laborwerte, Symptome, Schlaf, Wasser, Koffein, Sport und mehr — alles an einer Stelle.
          </div>
          <div style={{
            marginTop: 12, display: 'flex', justifyContent: 'flex-end',
          }}>
            <button
              onClick={(e) => { e.stopPropagation(); onDismiss(); }}
              style={{
                background: 'var(--accent)', color: 'var(--accent-ink)',
                border: 0, borderRadius: 999, padding: '7px 14px',
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Verstanden
            </button>
          </div>
        </div>
        {/* connector line from tooltip to FAB */}
        <svg width="24" height={Math.max(20, pos.cy - (pos.cy - 170) - 110)}
             style={{ marginTop: -2, opacity: 0.7 }}>
          <line x1="12" y1="0" x2="12" y2="100%"
                stroke="oklch(0.80 0.02 240 / 0.6)" strokeWidth="1" strokeDasharray="3 4" />
        </svg>
      </div>

      <style>{`
        @keyframes coachIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes coachPulse {
          0%, 100% { transform: scale(1);    opacity: 0.9; }
          50%      { transform: scale(1.08); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

window.FabCoach = FabCoach;
