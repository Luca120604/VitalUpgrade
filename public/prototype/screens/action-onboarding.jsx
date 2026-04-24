// VITAL — Action Sheet (+ button) and Onboarding.

const { useState: useStateA, useEffect: useEffectA } = React;

function ActionSheet({ open, onClose, onPick }) {
  const Icon = window.Icon;
  const { QUICK_ENTRIES } = window.VITAL_DATA;

  const groups = [
    {
      title: 'Körper',
      items: [
        { type: 'weight', icon: 'Scale', label: 'Gewicht' },
        { type: 'pulse',  icon: 'Heart', label: 'Ruhepuls' },
        { type: 'bp',     icon: 'Gauge', label: 'Blutdruck' },
      ],
    },
    {
      title: 'Verhalten',
      items: [
        { type: 'water',    icon: 'Droplet', label: 'Wasser' },
        { type: 'caffeine', icon: 'Coffee',  label: 'Koffein' },
        { type: 'sleep',    icon: 'Moon',    label: 'Schlaf' },
        { type: 'sleepQ',   icon: 'MoonStar', label: 'Schlafqualität' },
        { type: 'stress',   icon: 'Brain',   label: 'Stress' },
        { type: 'sport',    icon: 'Dumbbell', label: 'Sport' },
        { type: 'sun',      icon: 'Sun',     label: 'Sonne' },
        { type: 'creatine', icon: 'Pill',    label: 'Kreatin' },
      ],
    },
    {
      title: 'Weiteres',
      items: [
        { type: '__symptom', icon: 'Note',   label: 'Symptom / Notiz' },
        { type: '__parse',   icon: 'Lab',    label: 'Befundnotiz' },
      ],
    },
  ];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 40,
      pointerEvents: open ? 'auto' : 'none',
    }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)',
        opacity: open ? 1 : 0, transition: 'opacity 200ms ease',
        backdropFilter: open ? 'blur(6px)' : 'none',
      }} />
      <div style={{
        position: 'absolute', left: 12, right: 12, bottom: 86,
        background: 'var(--bg-0)',
        borderRadius: 22,
        border: '0.5px solid var(--line)',
        padding: 18,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.96)',
        opacity: open ? 1 : 0,
        transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1), opacity 180ms ease',
        transformOrigin: '50% 100%',
      }}>
        <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 10, textAlign: 'center' }}>Eintrag hinzufügen</div>
        {groups.map(g => (
          <div key={g.title} style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8, padding: '0 4px' }}>
              {g.title}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {g.items.map(item => {
                const IconEl = Icon[item.icon];
                return (
                  <button key={item.type} onClick={() => onPick(item.type)} className="tap" style={{
                    padding: '12px 4px', background: 'var(--bg-1)',
                    border: '0.5px solid var(--line-soft)', borderRadius: 12,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    color: 'var(--text-0)',
                  }}>
                    <IconEl size={18} color="var(--accent)" />
                    <span style={{ fontSize: 10, color: 'var(--text-1)', lineHeight: 1.2, textAlign: 'center' }}>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Onboarding
function Onboarding({ onDone }) {
  const Icon = window.Icon;
  const S = window.Storage;
  const [step, setStep] = useStateA(0);
  const [name, setName] = useStateA('');
  const [yob, setYob] = useStateA('');
  const [height, setHeight] = useStateA('');
  const [weight, setWeight] = useStateA('');

  const finish = () => {
    S.setProfile({
      name: name.trim(),
      yob: parseInt(yob) || undefined,
      height: parseInt(height) || undefined,
      createdAt: Date.now(),
    });
    if (weight) S.addEntry('weight', { value: parseFloat(weight), unit: 'kg' });
    onDone();
  };

  const steps = [
    // 0: Welcome
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 28px 36px' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em',
            lineHeight: 0.95, color: 'var(--accent)', marginBottom: 24,
            fontFeatureSettings: '"ss01"',
          }}>
            VITAL
          </div>
          <div style={{
            fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em',
            lineHeight: 1.15, color: 'var(--text-0)', marginBottom: 16,
            textWrap: 'balance',
          }}>
            Was dein Körper sagt, bevor die Zahlen es tun.
          </div>
          <div style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.55, textWrap: 'pretty' }}>
            Ein nüchterner Selbstcheck für deine Testosteron- und Vitalparameter. Keine Panik, kein Hype. Nur das, was sich messen und beobachten lässt.
          </div>
        </div>
        <button onClick={() => setStep(1)} className="tap" style={{
          padding: 15, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Beginnen</button>
        <div style={{ fontSize: 10, color: 'var(--text-3)', textAlign: 'center', marginTop: 12, lineHeight: 1.5 }}>
          Kein Konto, keine Cloud — alle Daten bleiben auf diesem Gerät.
        </div>
      </div>
    ),
    // 1: Name
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 28px 36px' }}>
        <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--accent)' }}>Schritt 1 / 3</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 12, textWrap: 'balance' }}>
          Wie dürfen wir dich nennen?
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>
          Bleibt auf deinem Gerät. Für die Begrüßung reicht dein Vorname.
        </div>
        <input autoFocus value={name} onChange={e => setName(e.target.value)}
          placeholder="Vorname"
          style={{
            width: '100%', padding: '14px 16px', background: 'var(--bg-1)',
            border: '0.5px solid var(--line)', borderRadius: 10,
            color: 'var(--text-0)', fontSize: 18, outline: 'none',
            fontFamily: 'inherit', letterSpacing: '-0.01em',
          }}
        />
        <div style={{ flex: 1 }} />
        <button onClick={() => setStep(2)} disabled={!name.trim()} className="tap" style={{
          padding: 15, background: name.trim() ? 'var(--accent)' : 'var(--bg-2)',
          color: name.trim() ? '#000' : 'var(--text-3)',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Weiter</button>
      </div>
    ),
    // 2: basics
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 28px 36px' }}>
        <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--accent)' }}>Schritt 2 / 3</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 12, textWrap: 'balance' }}>
          Ein paar Eckdaten.
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 28 }}>
          Für BMI, Referenzbereiche und Altersnormen. Du kannst Felder leer lassen.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Geburtsjahr', val: yob, set: setYob, ph: '1990' },
            { label: 'Größe (cm)',  val: height, set: setHeight, ph: '180' },
            { label: 'Gewicht (kg)', val: weight, set: setWeight, ph: '82' },
          ].map(f => (
            <div key={f.label} style={{
              padding: '12px 16px', background: 'var(--bg-1)',
              border: '0.5px solid var(--line)', borderRadius: 10,
            }}>
              <div className="eyebrow" style={{ marginBottom: 4 }}>{f.label}</div>
              <input value={f.val} onChange={e => f.set(e.target.value)} inputMode="numeric"
                placeholder={f.ph}
                style={{
                  width: '100%', background: 'transparent', border: 0, padding: 0,
                  color: 'var(--text-0)', fontSize: 17, outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={() => setStep(3)} className="tap" style={{
          padding: 15, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Weiter</button>
        <button onClick={() => setStep(3)} className="tap" style={{
          marginTop: 10, padding: 8, background: 'transparent', border: 0,
          color: 'var(--text-2)', fontSize: 12,
        }}>Überspringen</button>
      </div>
    ),
    // 3: Privacy / commitment
    () => (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '64px 28px 36px' }}>
        <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--accent)' }}>Schritt 3 / 3</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20, textWrap: 'balance' }}>
          Drei Dinge, bevor wir starten.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 24 }}>
          {[
            { t: 'Keine Diagnose', p: 'VITAL erkennt Muster, ersetzt aber keine ärztliche Untersuchung. Bei Symptomen bleibt dein Arzt der richtige Ansprechpartner.' },
            { t: 'Nur auf diesem Gerät', p: 'Deine Einträge werden lokal im Browser gespeichert. Keine Cloud, kein Konto, keine Dritten.' },
            { t: 'Regelmäßigkeit zählt', p: '5 Sekunden täglich schlagen 30 Minuten einmalig. Je mehr du einträgst, desto klarer wird das Bild.' },
          ].map((x, i) => (
            <div key={i} style={{ display: 'flex', gap: 14 }}>
              <div className="num" style={{
                width: 22, height: 22, borderRadius: 11, border: '1px solid var(--accent)',
                color: 'var(--accent)', fontSize: 11, display: 'grid', placeItems: 'center',
                fontWeight: 500, flexShrink: 0,
              }}>{i+1}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{x.t}</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{x.p}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <button onClick={finish} className="tap" style={{
          padding: 15, background: 'var(--accent)', color: '#000',
          border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
        }}>Verstanden — zur App</button>
      </div>
    ),
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {steps[step]()}
    </div>
  );
}

window.ActionSheet = ActionSheet;
window.Onboarding = Onboarding;
