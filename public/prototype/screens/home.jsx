// VITAL — Home screen. Dynamic from Storage + Rules.

const { useState: useStateH, useEffect: useEffectH, useMemo: useMemoH } = React;

function Home({ onOpenCore, onOpenQuickEntry, onOpenSymptom, goTab }) {
  const Icon = window.Icon;
  const { HealthRing, HPRing, BlockyAvatar, Sparkline, SegmentedBar, StatusDot } = window.UI;
  const { FOCUS_ORDER, QUICK_ENTRIES } = window.VITAL_DATA;
  const Rules = window.Rules;
  const S = window.Storage;

  const [, setTick] = useStateH(0);
  const bump = () => setTick(x => x + 1);
  useEffectH(() => {
    const onFocus = () => bump();
    window.addEventListener('vital:changed', onFocus);
    return () => window.removeEventListener('vital:changed', onFocus);
  }, []);

  const insights = useMemoH(() => Rules.evaluate(), []);
  const score = useMemoH(() => Rules.overallScore(), [insights]);
  const profile = S.getProfile() || {};
  const firstName = profile.name || 'du';
  const hour = new Date().getHours();
  const greet = hour < 11 ? 'Guten Morgen' : hour < 18 ? 'Hallo' : 'Guten Abend';

  // 6 topics for the ring (use first 6 FOCUS_ORDER mapped to insights)
  const ringTopics = FOCUS_ORDER.slice(0, 6).map(id => {
    const ins = insights.find(x => x.id === id);
    return {
      id, label: ins?.label || id, icon: ins?.icon || 'Info',
      score: ins?.healthScore ?? 0,
      status: ins?.level === 'ok' ? 'ok' : ins?.level === 'warn' ? 'warn' : 'alert',
    };
  });

  const today = new Date().toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long' });

  const activeInsights = insights.filter(x => x.level !== 'ok').slice(0, 2);

  return (
    <div style={{ padding: '46px 0 0' }}>
      {/* Header */}
      <div style={{ padding: '12px 20px 12px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>{today}</div>
        <div style={{
          fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1,
          textWrap: 'balance',
        }}>
          {greet}, <span style={{ color: 'var(--accent)' }}>{firstName}</span>.
        </div>
      </div>

      {/* Ring + Score */}
      <div style={{ padding: '8px 20px 4px', display: 'flex', alignItems: 'center', gap: 22 }}>
        <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
          <HPRing score={score} size={180} stroke={11} />
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <BlockyAvatar size={138} scanColor={
              score < 40 ? 'oklch(0.70 0.16 28)'  :
              score < 60 ? 'oklch(0.78 0.15 55)'  :
              score < 75 ? 'oklch(0.83 0.15 95)'  :
              score < 90 ? 'oklch(0.80 0.15 140)' :
                           'oklch(0.80 0.11 190)'
            } />
          </div>
          {/* Score badge, tucked into the ring corner */}
          <div style={{
            position: 'absolute', top: 6, right: -6,
            background: 'var(--bg-1)', border: '0.5px solid var(--line)',
            borderRadius: 999, padding: '4px 9px',
            display: 'flex', alignItems: 'baseline', gap: 4,
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          }}>
            <span className="num" style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>{score}</span>
            <span className="eyebrow" style={{ fontSize: 8 }}>Well.</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Fokus heute</div>
          {activeInsights.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-1)', lineHeight: 1.5 }}>
              Alles im grünen Bereich. Log Einträge, um den Score zu schärfen.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {activeInsights.map(x => {
                const IconEl = Icon[x.icon] || Icon.Info;
                const col = x.level === 'alert' ? 'var(--alert)' : 'var(--warn)';
                return (
                  <div key={x.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <IconEl size={18} color={col} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{x.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-2)' }}>
                        {x.level === 'alert' ? 'ärztlich abklären' : 'im Blick behalten'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Insight card */}
      {activeInsights[0] && (
        <div style={{ padding: '18px 20px 4px' }}>
          <div style={{
            padding: 18, background: 'var(--bg-1)', borderRadius: 18,
            border: '0.5px solid var(--line-soft)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 3, height: '100%',
              background: activeInsights[0].level === 'alert' ? 'var(--alert)' : 'var(--warn)',
            }} />
            <div className="eyebrow" style={{ marginBottom: 8, color: activeInsights[0].level === 'alert' ? 'var(--alert)' : 'var(--warn)' }}>
              Im Blick · {activeInsights[0].label}
            </div>
            <div style={{ fontSize: 15, color: 'var(--text-0)', lineHeight: 1.45, textWrap: 'pretty' }}>
              {activeInsights[0].message}
            </div>
            {activeInsights[0].reasons.length > 0 && (
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeInsights[0].reasons.slice(0, 4).map((r, i) => (
                  <span key={i} style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 999,
                    background: 'var(--bg-2)', color: 'var(--text-2)',
                  }}>{r}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick entries grid */}
      <div style={{ padding: '22px 20px 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="eyebrow">Heute eintragen</span>
          <button onClick={onOpenCore} className="tap" style={{
            fontSize: 12, color: 'var(--accent)', background: 'transparent', border: 0, padding: 0,
          }}>Alle</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {['water','caffeine','sleep','sport'].map(type => {
            const def = QUICK_ENTRIES.find(q => q.type === type);
            if (!def) return null;
            const IconEl = Icon[def.icon];
            const today = S.dailySeries(type, 1, def.aggregate)[0];
            return (
              <button key={type} onClick={() => onOpenQuickEntry(type)} className="tap" style={{
                padding: '14px 8px 12px', background: 'var(--bg-1)', border: '0.5px solid var(--line-soft)',
                borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                color: 'var(--text-0)',
              }}>
                <IconEl size={20} color="var(--accent)" />
                <span className="num" style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.1 }}>
                  {today != null ? (def.type === 'water' ? (today / 1000).toFixed(1) : today) : '—'}
                </span>
                <span style={{ fontSize: 10, color: 'var(--text-2)' }}>{def.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly trend strip */}
      <div style={{ padding: '22px 20px 4px' }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>Verlauf · 7 Tage</div>
        <div style={{ background: 'var(--bg-1)', borderRadius: 16, padding: 14, border: '0.5px solid var(--line-soft)' }}>
          {['sleep','water','stress','sport'].map((type, i, arr) => {
            const def = QUICK_ENTRIES.find(q => q.type === type);
            const IconEl = Icon[def.icon];
            const series = S.dailySeries(type, 7, def.aggregate);
            const haveData = series.some(v => v != null);
            const display = series.map(v => v ?? 0);
            const last = series.filter(v => v != null).pop();
            return (
              <div key={type} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < arr.length - 1 ? '0.5px solid var(--line-soft)' : 'none',
              }}>
                <IconEl size={16} color="var(--text-2)" />
                <span style={{ fontSize: 13, color: 'var(--text-1)', width: 88 }}>{def.label}</span>
                <div style={{ flex: 1 }}>
                  {haveData ? (
                    <Sparkline data={display} width={140} height={24} color="var(--accent)" />
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--text-3)' }}>keine Daten</span>
                  )}
                </div>
                <span className="num" style={{ fontSize: 13, color: 'var(--text-0)', minWidth: 46, textAlign: 'right' }}>
                  {last != null ? (type === 'water' ? (last/1000).toFixed(1) + 'L' : last + (def.unit.startsWith('/') ? '' : def.unit)) : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Jump-to tiles */}
      <div style={{ padding: '22px 20px 4px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <button onClick={() => goTab('werte')} className="tap" style={{
          padding: 16, background: 'var(--bg-1)', border: '0.5px solid var(--line-soft)',
          borderRadius: 16, textAlign: 'left', color: 'var(--text-0)',
        }}>
          <Icon.Chart size={22} color="var(--accent)" />
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 10 }}>Alle Werte</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Labor · Körper · Verhalten</div>
        </button>
        <button onClick={onOpenSymptom} className="tap" style={{
          padding: 16, background: 'var(--bg-1)', border: '0.5px solid var(--line-soft)',
          borderRadius: 16, textAlign: 'left', color: 'var(--text-0)',
        }}>
          <Icon.Note size={22} color="var(--accent)" />
          <div style={{ fontSize: 14, fontWeight: 500, marginTop: 10 }}>Symptom / Notiz</div>
          <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Freitext + Befundnotiz</div>
        </button>
      </div>
    </div>
  );
}

window.Home = Home;
