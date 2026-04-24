// VITAL — Einstellungen (settings) + Export.

const { useState: useStateE } = React;

function Einstellungen({ onRestart, onOpenQuiz }) {
  const Icon = window.Icon;
  const S = window.Storage;
  const profile = S.getProfile() || {};
  const [name, setName] = useStateE(profile.name || '');
  const [yob, setYob] = useStateE(profile.yob || '');
  const [height, setHeight] = useStateE(profile.height || '');
  const [confirmReset, setConfirmReset] = useStateE(false);

  const save = () => {
    S.setProfile({ ...profile, name, yob: parseInt(yob)||undefined, height: parseInt(height)||undefined });
  };

  const exportData = () => {
    const dump = {
      profile: S.getProfile(),
      entries: S.getEntries(),
      labs: S.getLabs(),
      quiz: S.get('quiz'),
      exported: new Date().toISOString(),
    };
    const text = JSON.stringify(dump, null, 2);
    // For a real file download, we use a Blob URL — works inside the iframe
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `vital-export-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 200);
  };

  const Row = ({ icon, title, sub, onClick, right, danger }) => {
    const IconEl = Icon[icon];
    return (
      <button onClick={onClick} className="tap" style={{
        width: '100%', padding: '14px 16px', background: 'transparent', border: 0,
        display: 'flex', alignItems: 'center', gap: 12, color: danger ? 'var(--alert)' : 'var(--text-0)',
        textAlign: 'left', borderBottom: '0.5px solid var(--line-soft)',
      }}>
        <IconEl size={18} color={danger ? 'var(--alert)' : 'var(--text-1)'} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{title}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>{sub}</div>}
        </div>
        {right}
      </button>
    );
  };

  const Input = ({ label, value, setValue, placeholder, type }) => (
    <div style={{ padding: '14px 16px', borderBottom: '0.5px solid var(--line-soft)' }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <input value={value} onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        inputMode={type === 'num' ? 'numeric' : 'text'}
        onBlur={save}
        style={{
          width: '100%', background: 'transparent', border: 0, padding: 0,
          color: 'var(--text-0)', fontSize: 15, outline: 'none',
        }}
      />
    </div>
  );

  return (
    <div style={{ padding: '46px 0 0' }}>
      <div style={{ padding: '12px 20px 20px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Einstellungen</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Konto & Daten</div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div className="eyebrow" style={{ padding: '0 4px 8px' }}>Profil</div>
        <div style={{ background: 'var(--bg-1)', borderRadius: 14, overflow: 'hidden', border: '0.5px solid var(--line-soft)' }}>
          <Input label="Name" value={name} setValue={setName} placeholder="Max" />
          <Input label="Geburtsjahr" value={yob} setValue={setYob} placeholder="1990" type="num" />
          <div style={{ padding: '14px 16px' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>Größe (cm)</div>
            <input value={height} onChange={e => setHeight(e.target.value)} onBlur={save}
              placeholder="180" inputMode="numeric"
              style={{
                width: '100%', background: 'transparent', border: 0, padding: 0,
                color: 'var(--text-0)', fontSize: 15, outline: 'none',
              }}
            />
          </div>
        </div>

        <div className="eyebrow" style={{ padding: '22px 4px 8px' }}>Screening</div>
        <div style={{ background: 'var(--bg-1)', borderRadius: 14, overflow: 'hidden', border: '0.5px solid var(--line-soft)' }}>
          <Row icon="Clipboard" title="Screening wiederholen"
            sub={S.get('quiz') ? `Zuletzt ${new Date(S.get('quiz').ts).toLocaleDateString('de-DE')}` : 'Noch nicht durchgeführt'}
            onClick={onOpenQuiz}
            right={<Icon.Chevron size={14} color="var(--text-3)" />}
          />
        </div>

        <div className="eyebrow" style={{ padding: '22px 4px 8px' }}>Daten</div>
        <div style={{ background: 'var(--bg-1)', borderRadius: 14, overflow: 'hidden', border: '0.5px solid var(--line-soft)' }}>
          <Row icon="Download" title="Daten exportieren" sub="JSON — für dein Archiv oder den Arztbesuch"
            onClick={exportData}
            right={<Icon.Chevron size={14} color="var(--text-3)" />}
          />
          <Row icon="Trash" title={confirmReset ? 'Wirklich? — Tippe nochmal' : 'Alle Daten löschen'}
            sub={confirmReset ? 'Unwiderruflich' : 'Profil, Einträge, Labore — alles'}
            danger
            onClick={() => {
              if (confirmReset) {
                S.clearAll();
                onRestart();
              } else {
                setConfirmReset(true);
                setTimeout(() => setConfirmReset(false), 4000);
              }
            }}
          />
        </div>

        <div style={{
          margin: '24px 4px 20px',
          padding: 14, background: 'var(--bg-1)', borderRadius: 12,
          border: '0.5px solid var(--line-soft)', fontSize: 11,
          color: 'var(--text-3)', lineHeight: 1.6,
        }}>
          <strong style={{ color: 'var(--text-1)', fontWeight: 500 }}>Hinweis.</strong>&nbsp;
          VITAL ist ein Werkzeug zur Selbstbeobachtung und ersetzt keine ärztliche Beratung. Alle Daten bleiben lokal auf diesem Gerät. Bei anhaltenden Symptomen wende dich an Hausarzt, Urologe oder Endokrinologe.
        </div>
        <div style={{ textAlign: 'center', padding: '0 0 28px', fontSize: 10, color: 'var(--text-3)', letterSpacing: '0.1em' }}>
          VITAL · v0.1 · Prototype
        </div>
      </div>
    </div>
  );
}

window.Einstellungen = Einstellungen;
