// VITAL — Sheets (Quick entry, Symptom/Notiz, Befund-Parser).

const { useState: useStateS, useEffect: useEffectS, useRef: useRefS, useMemo: useMemoS } = React;

// ============ Sheet shell ============
function Sheet({ open, onClose, title, children, footer }) {
  const Icon = window.Icon;
  useEffectS(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 50,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
        opacity: open ? 1 : 0, transition: 'opacity 220ms ease',
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--bg-0)',
        borderTopLeftRadius: 22, borderTopRightRadius: 22,
        borderTop: '0.5px solid var(--line)',
        maxHeight: '85%', display: 'flex', flexDirection: 'column',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--line)' }} />
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px 10px',
        }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em' }}>{title}</div>
          <button onClick={onClose} className="tap" style={{
            background: 'var(--bg-2)', border: 0, width: 28, height: 28, borderRadius: 14,
            display: 'grid', placeItems: 'center', color: 'var(--text-1)',
          }}><Icon.Close size={14} /></button>
        </div>
        <div style={{ flex: 1, overflow: 'auto', padding: '0 20px 20px' }}>
          {children}
        </div>
        {footer && <div style={{ padding: '12px 20px 24px', borderTop: '0.5px solid var(--line-soft)' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ============ QuickEntry ============
function QuickEntrySheet({ open, type, onClose }) {
  const { QUICK_ENTRIES } = window.VITAL_DATA;
  const S = window.Storage;
  const Icon = window.Icon;
  const def = useMemoS(() => QUICK_ENTRIES.find(q => q.type === type), [type]);
  const [value, setValue] = useStateS('');
  const [value2, setValue2] = useStateS(''); // for BP diastolic
  const [note, setNote] = useStateS('');

  useEffectS(() => {
    if (open && def) {
      setValue(String(def.default ?? ''));
      setValue2(def.default2 != null ? String(def.default2) : '');
      setNote('');
    }
  }, [open, type]);

  if (!def) return null;

  const quickSteps = def.quickSteps || [];
  const bumpBy = (n) => {
    const v = parseFloat(value) || 0;
    setValue(String(Math.max(def.min ?? 0, v + n)));
  };

  const save = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    const payload = { value: v, unit: def.unit, note: note || undefined };
    if (type === 'bp') {
      const v2 = parseFloat(value2);
      if (isNaN(v2)) return;
      payload.diastolic = v2;
    }
    S.addEntry(type, payload);
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose}
      title={`${def.label} eintragen`}
      footer={
        <button onClick={save} className="tap" style={{
          width: '100%', padding: 14, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Speichern</button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 6 }}>
        {/* Big input */}
        <div style={{ textAlign: 'center', padding: '20px 0 12px' }}>
          {type === 'bp' ? (
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8 }}>
              <input value={value} onChange={e => setValue(e.target.value)} inputMode="numeric"
                className="num"
                style={{
                  width: 100, background: 'transparent', border: 0, textAlign: 'center',
                  fontSize: 56, fontWeight: 300, color: 'var(--text-0)', letterSpacing: '-0.03em',
                  outline: 'none',
                }}
              />
              <span style={{ fontSize: 40, color: 'var(--text-3)' }}>/</span>
              <input value={value2} onChange={e => setValue2(e.target.value)} inputMode="numeric"
                className="num"
                style={{
                  width: 100, background: 'transparent', border: 0, textAlign: 'center',
                  fontSize: 56, fontWeight: 300, color: 'var(--text-0)', letterSpacing: '-0.03em',
                  outline: 'none',
                }}
              />
            </div>
          ) : (
            <input value={value} onChange={e => setValue(e.target.value)} inputMode="decimal"
              className="num"
              style={{
                width: '100%', background: 'transparent', border: 0, textAlign: 'center',
                fontSize: 72, fontWeight: 300, color: 'var(--text-0)', letterSpacing: '-0.03em',
                outline: 'none',
              }}
            />
          )}
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {def.unit}
          </div>
        </div>

        {/* Quick bumps */}
        {quickSteps.length > 0 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {quickSteps.map(step => (
              <button key={step} onClick={() => bumpBy(step)} className="tap" style={{
                padding: '10px 18px', background: 'var(--bg-1)',
                border: '0.5px solid var(--line)', borderRadius: 999,
                fontSize: 13, color: 'var(--text-0)', fontWeight: 500,
              }}>+{step}{def.unit.replace('/d','').replace('/Tag','')}</button>
            ))}
          </div>
        )}

        {/* Presets */}
        {def.presets && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {def.presets.map(p => (
              <button key={p.value} onClick={() => setValue(String(p.value))} className="tap" style={{
                padding: '8px 14px', background: 'var(--bg-1)',
                border: '0.5px solid var(--line-soft)', borderRadius: 999,
                fontSize: 12, color: 'var(--text-1)',
              }}>{p.label}</button>
            ))}
          </div>
        )}

        {/* Note */}
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Notiz (optional)</div>
          <input value={note} onChange={e => setNote(e.target.value)}
            placeholder="z.B. nach Training, früh"
            style={{
              width: '100%', padding: '12px 14px', background: 'var(--bg-1)',
              border: '0.5px solid var(--line)', borderRadius: 10,
              color: 'var(--text-0)', fontSize: 14, outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>
    </Sheet>
  );
}

// ============ Symptom / Freie Notiz ============
function SymptomSheet({ open, onClose }) {
  const S = window.Storage;
  const [text, setText] = useStateS('');
  const [severity, setSeverity] = useStateS(2);

  useEffectS(() => { if (open) { setText(''); setSeverity(2); } }, [open]);

  const tags = ['Kopfschmerz','Erschöpfung','Schlafstörung','Stimmung','Verdauung','Libido','Haare','Gelenke'];
  const [selected, setSelected] = useStateS([]);

  const toggle = (t) => setSelected(s => s.includes(t) ? s.filter(x => x !== t) : [...s, t]);

  const save = () => {
    if (!text && selected.length === 0) return;
    S.addEntry('symptom', { text, tags: selected, severity });
    onClose();
  };

  return (
    <Sheet open={open} onClose={onClose} title="Symptom / Notiz"
      footer={
        <button onClick={save} className="tap" style={{
          width: '100%', padding: 14, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Eintrag speichern</button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 10 }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Wie ausgeprägt?</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setSeverity(n)} className="tap" style={{
                flex: 1, padding: '12px 0',
                background: severity === n ? 'var(--accent)' : 'var(--bg-1)',
                color: severity === n ? '#000' : 'var(--text-1)',
                border: '0.5px solid ' + (severity === n ? 'var(--accent)' : 'var(--line)'),
                borderRadius: 10, fontSize: 14, fontWeight: 500,
              }}>{n}</button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--text-3)' }}>
            <span>leicht</span><span>stark</span>
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Betroffene Bereiche</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(t => (
              <button key={t} onClick={() => toggle(t)} className="tap" style={{
                padding: '8px 14px',
                background: selected.includes(t) ? 'var(--accent-dim)' : 'var(--bg-1)',
                color: selected.includes(t) ? 'var(--accent)' : 'var(--text-1)',
                border: '0.5px solid ' + (selected.includes(t) ? 'var(--accent)' : 'var(--line-soft)'),
                borderRadius: 999, fontSize: 12,
              }}>{t}</button>
            ))}
          </div>
        </div>

        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>Freitext</div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5}
            placeholder="Beschreibe, was du wahrnimmst. Zeitpunkt, Auslöser, Dauer …"
            style={{
              width: '100%', padding: 14, background: 'var(--bg-1)',
              border: '0.5px solid var(--line)', borderRadius: 10,
              color: 'var(--text-0)', fontSize: 14, outline: 'none',
              fontFamily: 'inherit', resize: 'none', lineHeight: 1.5,
            }}
          />
        </div>
      </div>
    </Sheet>
  );
}

// ============ Lab parser / detail ============
function LabSheet({ open, labKey, onClose }) {
  const Icon = window.Icon;
  const S = window.Storage;
  const { LAB_PATTERNS, parseBefund } = window.Parsing;
  const [mode, setMode] = useStateS('entry'); // 'entry' | 'parse'
  const [raw, setRaw] = useStateS('');
  const [parsed, setParsed] = useStateS([]);
  const [value, setValue] = useStateS('');
  const def = useMemoS(() => LAB_PATTERNS.find(p => p.key === labKey), [labKey]);

  useEffectS(() => {
    if (!open) return;
    if (labKey === '__parse') {
      setMode('parse'); setRaw(''); setParsed([]);
    } else {
      setMode('entry'); setValue('');
    }
  }, [open, labKey]);

  const runParse = () => {
    const results = parseBefund(raw);
    setParsed(results);
  };

  const saveParsed = () => {
    parsed.forEach(r => {
      if (r.included !== false) {
        S.addLab(r.key, { value: r.value, unit: r.unit, flag: r.flag });
      }
    });
    onClose();
  };

  const saveOne = () => {
    const v = parseFloat(value);
    if (isNaN(v)) return;
    S.addLab(labKey, { value: v, unit: def.unit });
    onClose();
  };

  if (!open) return <Sheet open={false} onClose={onClose} title="" />;

  if (mode === 'parse') {
    return (
      <Sheet open={open} onClose={onClose} title="Befundnotiz"
        footer={
          parsed.length > 0 ? (
            <button onClick={saveParsed} className="tap" style={{
              width: '100%', padding: 14, background: 'var(--accent)', color: '#000',
              border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
            }}>{parsed.filter(r => r.included !== false).length} Werte übernehmen</button>
          ) : (
            <button onClick={runParse} disabled={!raw.trim()} className="tap" style={{
              width: '100%', padding: 14,
              background: raw.trim() ? 'var(--accent)' : 'var(--bg-2)',
              color: raw.trim() ? '#000' : 'var(--text-3)',
              border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
            }}>Werte erkennen</button>
          )
        }
      >
        <div style={{ paddingTop: 10 }}>
          {parsed.length === 0 ? (
            <>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5, marginBottom: 12 }}>
                Kopiere Text aus deinem Laborbefund-PDF oder tippe die Werte ab. Wir erkennen Testosteron, SHBG, TSH, Ferritin, Vitamin&nbsp;D und weitere automatisch.
              </div>
              <textarea value={raw} onChange={e => setRaw(e.target.value)} rows={10}
                placeholder={"z.B.\nTestosteron gesamt    3.8 ng/ml    (2.5 - 9.0)\nSHBG                  28  nmol/l\nFerritin              145 µg/l\nVitamin D             22  ng/ml"}
                style={{
                  width: '100%', padding: 14, background: 'var(--bg-1)',
                  border: '0.5px solid var(--line)', borderRadius: 10,
                  color: 'var(--text-0)', fontSize: 13, outline: 'none',
                  fontFamily: 'ui-monospace, monospace', resize: 'none', lineHeight: 1.5,
                }}
              />
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>
                {parsed.length} Werte erkannt
              </div>
              {parsed.map((r, i) => {
                const isOk = !r.flag;
                const col = r.flag === 'high' ? 'var(--warn)' : r.flag === 'low' ? 'var(--warn)' : 'var(--ok)';
                return (
                  <div key={i} style={{
                    padding: '12px 14px', background: 'var(--bg-1)',
                    border: '0.5px solid var(--line-soft)', borderRadius: 10,
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}>
                    <button onClick={() => setParsed(p => p.map((x, j) => j === i ? { ...x, included: x.included === false ? true : false } : x))}
                      className="tap"
                      style={{
                        width: 22, height: 22, borderRadius: 6,
                        background: r.included === false ? 'transparent' : 'var(--accent)',
                        border: '1px solid ' + (r.included === false ? 'var(--line)' : 'var(--accent)'),
                        color: '#000', display: 'grid', placeItems: 'center',
                      }}>
                      {r.included !== false && <Icon.Check size={12} color="#000" />}
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                        <span className="num" style={{ color: col, fontSize: 14, fontWeight: 500 }}>
                          {r.value} {r.unit}
                        </span>
                        {r.flag && <span style={{ marginLeft: 6, color: col, textTransform: 'uppercase' }}>
                          {r.flag === 'low' ? 'niedrig' : 'hoch'}
                        </span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <button onClick={() => { setParsed([]); setRaw(''); }} className="tap" style={{
                marginTop: 6, padding: 10, background: 'transparent',
                border: '0.5px solid var(--line)', borderRadius: 10,
                color: 'var(--text-1)', fontSize: 12,
              }}>Neu starten</button>
            </div>
          )}
        </div>
      </Sheet>
    );
  }

  // Single entry mode
  const history = S.getLabs()[labKey] || [];
  const ref = window.Parsing.REF[labKey];

  return (
    <Sheet open={open} onClose={onClose} title={def?.label || labKey}
      footer={
        <button onClick={saveOne} className="tap" style={{
          width: '100%', padding: 14, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Wert speichern</button>
      }
    >
      <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <input value={value} onChange={e => setValue(e.target.value)} inputMode="decimal"
            placeholder="0"
            className="num"
            style={{
              width: '100%', background: 'transparent', border: 0, textAlign: 'center',
              fontSize: 64, fontWeight: 300, color: 'var(--text-0)', letterSpacing: '-0.03em',
              outline: 'none',
            }}
          />
          <div style={{ fontSize: 12, color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {def?.unit}
          </div>
          {ref && (
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>
              Referenz: {ref.low} – {ref.high} {ref.unit || def?.unit}
            </div>
          )}
        </div>
        {history.length > 0 && (
          <div>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Verlauf</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {history.slice(0, 6).map(h => {
                const col = h.flag === 'low' || h.flag === 'high' ? 'var(--warn)' : 'var(--text-0)';
                const d = new Date(h.ts).toLocaleDateString('de-DE', { day:'2-digit', month:'short', year:'2-digit' });
                return (
                  <div key={h.ts} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '10px 12px', background: 'var(--bg-1)', borderRadius: 8,
                    fontSize: 13,
                  }}>
                    <span style={{ color: 'var(--text-2)' }}>{d}</span>
                    <span className="num" style={{ color: col, fontWeight: 500 }}>{h.value} {h.unit}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  );
}

window.Sheet = Sheet;
window.QuickEntrySheet = QuickEntrySheet;
window.SymptomSheet = SymptomSheet;
window.LabSheet = LabSheet;
