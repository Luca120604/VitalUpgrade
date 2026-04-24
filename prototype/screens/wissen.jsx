// VITAL — Wissen (knowledge) screen. Evidence-calm, no hype.

const KNOWLEDGE_ARTICLES = [
  {
    id: 'testo-basics',
    tag: 'Labor',
    title: 'Testosteron verstehen — was die Zahl wirklich sagt',
    readTime: '4 min',
    summary: 'Gesamt-Testosteron, freies Testosteron und SHBG hängen zusammen. Einen einzelnen Wert isoliert zu lesen, führt regelmäßig zu Fehlschlüssen.',
    body: [
      { h: 'Warum morgens nüchtern', p: 'Testosteron folgt einem Tagesrhythmus und liegt zwischen 7 und 10 Uhr typischerweise 20–30 % höher als abends. Einmalige Messungen nachmittags sind methodisch ungenau. Eine belastbare Einschätzung braucht zwei Messungen zu unterschiedlichen Tagen.' },
      { h: 'Gesamt vs. frei', p: 'Nur etwa 1–3 % des Testosterons zirkulieren frei und damit bioverfügbar. SHBG (Sexualhormon-bindendes Globulin) bindet den Rest. Ein grenzwertiger Gesamt-Wert bei niedrigem SHBG kann biologisch völlig ausreichend sein — und umgekehrt.' },
      { h: 'Die ehrliche Referenz', p: 'Leitlinien empfehlen eine Abklärung typischerweise ab Werten unter 8 nmol/l oder 2,3 ng/ml, kombiniert mit Symptomen. Zahlen ohne Symptome sind kein Behandlungsgrund.' },
    ],
  },
  {
    id: 'shbg',
    tag: 'Labor',
    title: 'SHBG — der unterschätzte Kontext-Wert',
    readTime: '3 min',
    summary: 'SHBG verändert, wie viel Testosteron tatsächlich wirkt. Insulin, Schilddrüse, Gewicht und Alter beeinflussen es deutlich.',
    body: [
      { h: 'Was SHBG anzeigt', p: 'Niedriges SHBG geht oft mit Insulinresistenz, Übergewicht und Leberverfettung einher. Hohes SHBG kann auf Schilddrüsenüberfunktion, Medikamente oder reine genetische Varianten hinweisen.' },
      { h: 'Freier Androgen-Index', p: 'Der FAI (Testosteron / SHBG × 100) approximiert das freie Testosteron grob. Für präzise Einordnung bleibt die direkte Messung des freien Testosterons sinnvoll.' },
    ],
  },
  {
    id: 'vit-d',
    tag: 'Nährstoffe',
    title: 'Vitamin D — mehr als ein Knochenthema',
    readTime: '3 min',
    summary: 'Ein ausreichender 25-OH-Vitamin-D-Spiegel ist mit stabileren Testosteron-Werten assoziiert. In Mitteleuropa ist Unterversorgung häufig.',
    body: [
      { h: 'Zielbereich', p: 'Die meisten Endokrinologen halten 30–50 ng/ml (75–125 nmol/l) für einen sinnvollen Bereich. Unter 20 ng/ml gilt als Mangel — in Deutschland betrifft das je nach Saison 40–60 % der Männer.' },
      { h: 'Sonne vs. Supplement', p: 'Zwischen November und März reicht die UV-B-Strahlung in Breiten >45° nicht aus, um Vitamin D selbst zu bilden. 1.000–2.000 IU/Tag sind ein breit verträglicher Startpunkt; höhere Dosen nur laborgeführt.' },
    ],
  },
  {
    id: 'schlaf',
    tag: 'Verhalten',
    title: 'Schlaf — der größte Hebel, den niemand ernst nimmt',
    readTime: '4 min',
    summary: 'Eine Woche mit 5 Stunden Schlaf reduziert Testosteron messbar um 10–15 %. Schlaf ist kein Lifestyle-Faktor, sondern endokrine Grundlage.',
    body: [
      { h: 'Was im Tiefschlaf passiert', p: 'Die größte LH-Ausschüttung (und damit Testosteron-Produktion) erfolgt in der ersten Nachthälfte im Tiefschlaf. Wer nach 2 Uhr ins Bett geht, überspringt einen Teil dieser Phase systematisch.' },
      { h: 'Konkret', p: '7–8 Stunden im Bett, stabile Zeiten, kühles Schlafzimmer (16–18 °C), kein Alkohol in den 3 Stunden davor. Das ist keine Wellness-Empfehlung — es ist die Basis jeder hormonellen Diskussion.' },
    ],
  },
  {
    id: 'kreatin',
    tag: 'Supplemente',
    title: 'Kreatin — gut belegt, breit missverstanden',
    readTime: '3 min',
    summary: 'Kreatin-Monohydrat ist eines der am besten untersuchten Supplemente überhaupt. Die Evidenz für Kraft, Muskelmasse und Kognition ist robust.',
    body: [
      { h: 'Dosis', p: '3–5 g pro Tag, dauerhaft. Eine Ladephase ist nicht nötig. Die Form ist fast irrelevant — Kreatin-Monohydrat ist das preiswerteste und am besten untersuchte.' },
      { h: 'Nebenwirkungen', p: 'Eine leichte Wasserretention in der Muskulatur ist normal und gewünscht. Nierenprobleme sind bei gesunden Männern in hunderten Studien nicht belegt. Bei bestehender Nierenerkrankung: Rücksprache mit Arzt.' },
    ],
  },
  {
    id: 'stress',
    tag: 'Verhalten',
    title: 'Chronischer Stress und die Cortisol-Testosteron-Achse',
    readTime: '4 min',
    summary: 'Cortisol und Testosteron sind antagonistisch. Dauerhaft erhöhter Stress verschiebt das Gleichgewicht spürbar.',
    body: [
      { h: 'Mechanismus', p: 'Chronisch erhöhtes Cortisol unterdrückt die Freisetzung von GnRH im Hypothalamus und damit die gesamte Hoden-Achse. Messbar wird das nach 3–6 Wochen anhaltender Belastung.' },
      { h: 'Was hilft', p: 'Ausdauer-Training (nicht zu viel), soziale Regulation, Schlaf, Atemübungen. Keine Abkürzung über Supplemente. Ashwagandha zeigt in Studien kleine, aber reale Effekte auf Cortisol — keine Wunder.' },
    ],
  },
  {
    id: 'disclaimer',
    tag: 'Transparenz',
    title: 'Was diese App kann — und was nicht',
    readTime: '2 min',
    summary: 'VITAL ist ein Selbstbeobachtungs-Werkzeug. Es erkennt Muster, misst aber selbst nichts und ersetzt keine Diagnose.',
    body: [
      { h: 'Keine Diagnose', p: 'Die Hinweise basieren auf Richtwerten aus Leitlinien. Sie sind kein Ersatz für ärztliche Untersuchung, Anamnese oder Laborinterpretation im Kontext.' },
      { h: 'Deine Daten', p: 'Alle Einträge werden lokal im Browser gespeichert. Keine Cloud, keine Konten, keine Auswertung durch Dritte. Wenn du das Gerät wechselst, sind die Daten nicht automatisch dort.' },
      { h: 'Wann zum Arzt', p: 'Anhaltende Symptome über mehr als 4–6 Wochen, auffällige Laborwerte, akute Veränderungen (Libido, Erektion, Stimmung). Der richtige Ansprechpartner ist Hausarzt, Urologe oder Endokrinologe.' },
    ],
  },
];

const { useState: useStateK } = React;

function Wissen() {
  const Icon = window.Icon;
  const [openId, setOpenId] = useStateK(null);
  const article = KNOWLEDGE_ARTICLES.find(a => a.id === openId);

  const tags = ['Alle', ...Array.from(new Set(KNOWLEDGE_ARTICLES.map(a => a.tag)))];
  const [tag, setTag] = useStateK('Alle');
  const list = tag === 'Alle' ? KNOWLEDGE_ARTICLES : KNOWLEDGE_ARTICLES.filter(a => a.tag === tag);

  if (article) {
    return (
      <div style={{ padding: '46px 0 0' }}>
        <div style={{ padding: '8px 20px 0' }}>
          <button onClick={() => setOpenId(null)} className="tap" style={{
            background: 'transparent', border: 0, color: 'var(--text-1)',
            fontSize: 13, padding: '8px 0', display: 'flex', alignItems: 'center', gap: 4,
          }}>← Wissen</button>
        </div>
        <div style={{ padding: '12px 24px 4px' }}>
          <div className="eyebrow" style={{ color: 'var(--accent)', marginBottom: 8 }}>{article.tag} · {article.readTime}</div>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15, textWrap: 'balance' }}>
            {article.title}
          </div>
          <div style={{ marginTop: 14, fontSize: 15, color: 'var(--text-1)', lineHeight: 1.55, textWrap: 'pretty' }}>
            {article.summary}
          </div>
        </div>
        <div style={{ padding: '20px 24px 30px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {article.body.map((sec, i) => (
            <div key={i}>
              <div style={{
                fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: 8, fontWeight: 500,
              }}>{sec.h}</div>
              <div style={{ fontSize: 14, color: 'var(--text-0)', lineHeight: 1.6, textWrap: 'pretty' }}>
                {sec.p}
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 16, padding: 14, background: 'var(--bg-1)', borderRadius: 12,
            border: '0.5px solid var(--line-soft)', fontSize: 11,
            color: 'var(--text-3)', lineHeight: 1.5,
          }}>
            Quellen: Endocrine Society Clinical Practice Guidelines · European Association of Urology · DGE. Zusammengefasst und auf Verständlichkeit destilliert.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '46px 0 0' }}>
      <div style={{ padding: '12px 20px 16px' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Wissen</div>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>Verständlich, nicht verkürzt</div>
      </div>
      <div style={{ padding: '0 20px 12px', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
        {tags.map(t => (
          <button key={t} onClick={() => setTag(t)} className="tap" style={{
            padding: '6px 12px',
            background: tag === t ? 'var(--accent-dim)' : 'var(--bg-1)',
            color: tag === t ? 'var(--accent)' : 'var(--text-1)',
            border: '0.5px solid ' + (tag === t ? 'var(--accent)' : 'var(--line-soft)'),
            borderRadius: 999, fontSize: 11, whiteSpace: 'nowrap',
            letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 500,
          }}>{t}</button>
        ))}
      </div>
      <div style={{ padding: '6px 20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map(a => (
          <button key={a.id} onClick={() => setOpenId(a.id)} className="tap" style={{
            padding: 18, background: 'var(--bg-1)',
            border: '0.5px solid var(--line-soft)', borderRadius: 16,
            textAlign: 'left', color: 'var(--text-0)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="eyebrow" style={{ color: 'var(--accent)' }}>{a.tag}</span>
              <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{a.readTime}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 8, textWrap: 'balance' }}>
              {a.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5, textWrap: 'pretty' }}>
              {a.summary}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

window.Wissen = Wissen;
