// VITAL — Werte screen. Labor / Körper / Verhalten.

const { useState: useStateW, useMemo: useMemoW } = React;

function Werte({ onOpenQuickEntry, onOpenLab }) {
  const Icon = window.Icon;
  const { SegmentedControl, Sparkline } = window.UI;
  const { QUICK_ENTRIES } = window.VITAL_DATA;
  const { LAB_PATTERNS, REF } = window.Parsing;
  const S = window.Storage;
  const [tab, setTab] = useStateW('body');

  const bodyKeys = ['weight','pulse','bp'];
  const behKeys  = ['water','caffeine','sleep','sleepQ','stress','sport','sun','creatine'];

  const renderEntryRow = (type) => {
    const def = QUICK_ENTRIES.find(q => q.type === type);
    if (!def) return null;
    const IconEl = Icon[def.icon];
    const series = S.dailySeries(type, 14, def.aggregate);
    const haveData = series.some(v => v != null);
    const last = series.filter(v => v != null).pop();
    const display = series.map(v => v ?? 0);
    return (
      <button key={type} onClick={() => onOpenQuickEntry(type)} className="tap" style={{
        width: '100%', textAlign: 'left',
        padding: '14px 16px', background: 'transparent', border: 0,
        display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 12,
        color: 'var(--text-0)',
        borderBottom: '0.5px solid var(--line-soft)',
      }}>
        <IconEl size={20} color="var(--text-1)" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{def.label}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {haveData ? (
              <>letzter Wert · <span className="num">{type === 'water' ? (last/1000).toFixed(1) : last}{' '}{def.unit.startsWith('/') ? def.unit : def.unit}</span></>
            ) : 'noch keine Einträge'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {haveData && <Sparkline data={display} width={70} height={22} color="var(--accent)" />}
          <Icon.Chevron size={14} color="var(--text-3)" />
        </div>
      </button>
    );
  };

  const renderLabRow = (key) => {
    const def = LAB_PATTERNS.find(p => p.key === key);
    const arr = S.getLabs()[key] || [];
    const last = arr[0];
    const col = last?.flag === 'low' || last?.flag === 'high' ? 'var(--warn)' : 'var(--accent)';
    return (
      <button key={key} onClick={() => onOpenLab(key)} className="tap" style={{
        width: '100%', textAlign: 'left',
        padding: '14px 16px', background: 'transparent', border: 0,
        display: 'grid', gridTemplateColumns: '32px 1fr auto', alignItems: 'center', gap: 12,
        color: 'var(--text-0)',
        borderBottom: '0.5px solid var(--line-soft)',
      }}>
        <Icon.Lab size={20} color="var(--text-1)" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{def?.label || key}</div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {last ? (
              <>letzter · <span className="num" style={{ color: col }}>{last.value} {last.unit}</span></>
            ) : 'noch nicht eingetragen'}
          </div>
        </div>
        <Icon.Chevron size={14} color="var(--text-3)" />
      </button>
    );
  };

  return (
    <div style={{ padding: '46px 0 0' }}>
      <div style={{ padding: '12px 20px 16px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Werte</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Alle Messwerte</div>
      </div>
      <div style={{ padding: '0 20px 16px' }}>
        <SegmentedControl
          options={[
            { value: 'body', label: 'Körper' },
            { value: 'lab',  label: 'Labor' },
            { value: 'beh',  label: 'Verhalten' },
          ]}
          value={tab} onChange={setTab}
        />
      </div>
      <div style={{ padding: '0 16px' }}>
        <div style={{ background: 'var(--bg-1)', borderRadius: 18, overflow: 'hidden', border: '0.5px solid var(--line-soft)' }}>
          {tab === 'body' && bodyKeys.map(renderEntryRow)}
          {tab === 'beh'  && behKeys.map(renderEntryRow)}
          {tab === 'lab'  && LAB_PATTERNS.slice(0, 8).map(p => renderLabRow(p.key))}
        </div>

        {tab === 'lab' && (
          <button onClick={() => onOpenLab('__parse')} className="tap" style={{
            width: '100%', marginTop: 14, padding: '14px 16px',
            background: 'var(--bg-1)', border: '1px dashed var(--line)',
            borderRadius: 14, color: 'var(--text-0)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <Icon.Note size={18} color="var(--accent)" />
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Befundnotiz einfügen</div>
              <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Text aus PDF kopieren — wir erkennen Werte automatisch</div>
            </div>
            <Icon.Chevron size={14} color="var(--text-3)" />
          </button>
        )}
      </div>
    </div>
  );
}

window.Werte = Werte;
