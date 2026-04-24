// VITAL — Quiz / Screening flow (standalone modal).

const { useState: useStateQ, useMemo: useMemoQ } = React;

const QUIZ_QUESTIONS = [
  { id: 'mood',        label: 'Wie ist deine Stimmung/Motivation in den letzten Wochen?', good: 'stabil', bad: 'oft niedergedrückt' },
  { id: 'libido',      label: 'Wie ist dein sexuelles Interesse im Vergleich zu früher?', good: 'unverändert', bad: 'deutlich weniger' },
  { id: 'morningWood', label: 'Morgen-Erektionen — wie häufig?', good: 'mehrmals/Woche', bad: 'selten bis nie' },
  { id: 'energy',      label: 'Dein Energielevel am Tag?', good: 'durchgehend stabil', bad: 'oft erschöpft' },
  { id: 'recovery',    label: 'Erholung nach Sport/Anstrengung?', good: 'gut', bad: 'dauert lange' },
  { id: 'sleep',       label: 'Schlaf — durchschnittliche Qualität?', good: 'erholsam', bad: 'oft unruhig' },
  { id: 'strength',    label: 'Kraft/Muskelmasse in den letzten 12 Monaten?', good: 'aufgebaut/gehalten', bad: 'abgebaut' },
  { id: 'bellyFat',    label: 'Bauchfett/Gewicht?', good: 'unverändert oder weniger', bad: 'deutlich mehr' },
  { id: 'concentration', label: 'Konzentration & geistige Klarheit?', good: 'scharf', bad: 'oft nebelig' },
  { id: 'irritability', label: 'Reizbarkeit/emotionale Stabilität?', good: 'ausgeglichen', bad: 'oft gereizt' },
];

function Quiz({ onClose, onComplete }) {
  const Icon = window.Icon;
  const S = window.Storage;
  const [idx, setIdx] = useStateQ(0);
  const [answers, setAnswers] = useStateQ({});
  const [done, setDone] = useStateQ(false);

  const q = QUIZ_QUESTIONS[idx];
  const total = QUIZ_QUESTIONS.length;
  const progress = (idx / total) * 100;

  const answer = (score) => {
    const next = { ...answers, [q.id]: score };
    setAnswers(next);
    if (idx + 1 >= total) {
      // finished
      S.set('quiz', { answers: next, ts: Date.now() });
      setDone(true);
    } else {
      setIdx(idx + 1);
    }
  };

  const result = useMemoQ(() => {
    if (!done) return null;
    const values = Object.values(answers);
    const avg = values.reduce((a,b)=>a+b,0) / values.length;
    const lowCount = values.filter(v => v <= 2).length;
    let band, label, tone;
    if (avg >= 4 && lowCount === 0) { band='strong'; label='Stabiles Bild'; tone='var(--ok)'; }
    else if (avg >= 3)              { band='watch';  label='Beobachtungs­würdig'; tone='var(--warn)'; }
    else                            { band='flag';   label='Ärztlich abklären'; tone='var(--alert)'; }
    const topConcerns = QUIZ_QUESTIONS
      .filter(q => (answers[q.id] || 5) <= 2)
      .slice(0, 3)
      .map(q => q.label.replace(/\?$/, '').replace(/ — .*/, ''));
    return { band, label, tone, avg, topConcerns };
  }, [done, answers]);

  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'var(--bg-0)', zIndex: 100,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ padding: '46px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <button onClick={onClose} className="tap" style={{
            background: 'var(--bg-1)', border: 0, width: 32, height: 32, borderRadius: 16,
            display: 'grid', placeItems: 'center', color: 'var(--text-1)',
          }}><Icon.Close size={14} /></button>
          <div style={{ fontSize: 12, color: 'var(--text-2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {done ? 'Auswertung' : `Screening · ${idx + 1}/${total}`}
          </div>
          <div style={{ width: 32 }} />
        </div>
        {!done && (
          <div style={{ height: 2, background: 'var(--bg-2)', borderRadius: 1, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'var(--accent)',
              transition: 'width 320ms cubic-bezier(0.32, 0.72, 0, 1)',
            }} />
          </div>
        )}
      </div>

      {/* Body */}
      {!done ? (
        <div style={{ flex: 1, overflow: 'auto', padding: '40px 24px 20px' }}>
          <div className="eyebrow" style={{ marginBottom: 20, color: 'var(--accent)' }}>
            Frage {idx + 1}
          </div>
          <div style={{
            fontSize: 22, lineHeight: 1.3, letterSpacing: '-0.01em', fontWeight: 500,
            marginBottom: 40, textWrap: 'pretty',
          }}>
            {q.label}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { score: 5, label: q.good },
              { score: 4, label: 'eher gut' },
              { score: 3, label: 'neutral' },
              { score: 2, label: 'eher schlecht' },
              { score: 1, label: q.bad },
            ].map(opt => (
              <button key={opt.score} onClick={() => answer(opt.score)} className="tap" style={{
                padding: '14px 18px', background: 'var(--bg-1)',
                border: '0.5px solid var(--line)', borderRadius: 12,
                color: 'var(--text-0)', fontSize: 14, textAlign: 'left',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span>{opt.label}</span>
                <span className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{opt.score}</span>
              </button>
            ))}
          </div>
          {idx > 0 && (
            <button onClick={() => setIdx(i => Math.max(0, i - 1))} className="tap" style={{
              marginTop: 28, background: 'transparent', border: 0, color: 'var(--text-2)',
              fontSize: 12, padding: 8,
            }}>← Zurück</button>
          )}
        </div>
      ) : (
        <div style={{ flex: 1, overflow: 'auto', padding: '40px 24px 28px' }}>
          <div className="eyebrow" style={{ marginBottom: 16, color: result.tone }}>
            Ergebnis
          </div>
          <div style={{
            fontSize: 28, lineHeight: 1.15, letterSpacing: '-0.02em', fontWeight: 600,
            marginBottom: 8,
          }}>{result.label}</div>
          <div style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.55, textWrap: 'pretty', marginBottom: 24 }}>
            {result.band === 'strong' && 'Dein subjektives Bild wirkt stabil. Das ersetzt keine Labormessung, ist aber ein guter Anker. Für objektive Klarheit empfehlen wir Testosteron, SHBG und Vitamin\u00a0D mindestens einmal jährlich.'}
            {result.band === 'watch'  && 'Einige Antworten deuten auf Themen hin, die sich lohnen zu beobachten. Trage in den nächsten 14 Tagen Schlaf, Stress und Sport ein. Wenn Symptome bleiben, ist ein Laborcheck sinnvoll.'}
            {result.band === 'flag'   && 'Mehrere Antworten deuten auf reduziertes Wohlbefinden. Das kann viele Ursachen haben — von Schlaf bis Schilddrüse. Ein Termin beim Hausarzt mit Laborcheck (Testosteron morgens nüchtern, SHBG, TSH, Ferritin, Vitamin\u00a0D) wird empfohlen.'}
          </div>

          {result.topConcerns.length > 0 && (
            <div style={{
              padding: 16, background: 'var(--bg-1)', borderRadius: 14,
              border: '0.5px solid var(--line-soft)', marginBottom: 20,
            }}>
              <div className="eyebrow" style={{ marginBottom: 10 }}>Auffällig</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.topConcerns.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13 }}>
                    <span style={{ width: 4, height: 4, borderRadius: 2, background: result.tone }} />
                    <span style={{ color: 'var(--text-1)' }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{
            padding: 14, background: 'var(--bg-1)', borderRadius: 12,
            border: '0.5px solid var(--line-soft)', fontSize: 11,
            color: 'var(--text-3)', lineHeight: 1.55, marginBottom: 24,
          }}>
            Dieses Screening ersetzt keine medizinische Diagnose. Es dient zur Selbstbeobachtung und als Gesprächsanstoß für deinen Arztbesuch.
          </div>

          <button onClick={onComplete || onClose} className="tap" style={{
            width: '100%', padding: 14, background: 'var(--accent)', color: '#000',
            border: 0, borderRadius: 12, fontSize: 15, fontWeight: 600,
          }}>Fertig</button>
        </div>
      )}
    </div>
  );
}

window.Quiz = Quiz;
window.QUIZ_QUESTIONS = QUIZ_QUESTIONS;
