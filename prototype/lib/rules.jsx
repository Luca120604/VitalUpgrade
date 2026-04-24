// VITAL — rule engine. Transparent, weighted evidence scores per focus area.
// Never diagnoses. Produces vorsichtige Hinweise.

const S = window.Storage;

// Helpers reading current state
function latestValue(type, fallback = null) {
  const e = S.latestEntry(type);
  return e ? Number(e.value) : fallback;
}
function quizScore(id) {
  const q = S.getQuizzes()[id];
  return q ? q.score : null;
}
function hasSymptom(tag) {
  const recent = S.getSymptoms().filter(s => Date.now() - s.ts < 30 * 24 * 3600 * 1000);
  return recent.some(s => (s.tags || []).includes(tag));
}
function profileField(k, fallback = null) {
  const p = S.getProfile();
  return p ? (p[k] ?? fallback) : fallback;
}
function avgOfSeries(type, days = 7) {
  const s = S.dailySeries(type, days).filter(v => v != null);
  if (!s.length) return null;
  return s.reduce((a, b) => a + b, 0) / s.length;
}

// Each rule: { id, weight, label, test(data) -> bool }.
// `data` is a snapshot built once per evaluation run.
function buildSnapshot() {
  return {
    profile: S.getProfile() || {},
    onboarding: S.getOnboarding().answers || {},
    labs: S.getLabs(),
    quizzes: S.getQuizzes(),
    symptoms: S.getSymptoms(),
    // convenience
    latest: {
      water:   latestValue('water'),
      caffeine:latestValue('caffeine'),
      sleep:   latestValue('sleep'),
      sleepQ:  latestValue('sleepQ'),
      stress:  latestValue('stress'),
      sport:   latestValue('sport'),
      pulse:   latestValue('pulse'),
      weight:  latestValue('weight'),
      sun:     latestValue('sun'),
    },
    avg7: {
      water:   avgOfSeries('water'),
      sleep:   avgOfSeries('sleep'),
      stress:  avgOfSeries('stress'),
      caffeine:avgOfSeries('caffeine'),
      sport:   avgOfSeries('sport'),
      sun:     avgOfSeries('sun'),
    },
  };
}

// ---- Focus rules ----
const FOCUS = {
  energy: {
    label: 'Energie', icon: 'Activity', threshold: 5,
    rules: [
      { id: 'lowSleep',    weight: 3, label: 'Schlaf <7h im Schnitt',        test: d => (d.avg7.sleep ?? 8) < 7 },
      { id: 'highStress',  weight: 2, label: 'Stress hoch',                   test: d => (d.avg7.stress ?? 0) >= 3.5 },
      { id: 'fatigueSym',  weight: 2, label: 'Müdigkeit angegeben',           test: () => hasSymptom('Müdigkeit') },
      { id: 'lowEnergyOn', weight: 2, label: 'Onboarding: wenig Energie',    test: d => ['niedrig','sehr_niedrig'].includes(d.onboarding.energy) },
      { id: 'highCaff',    weight: 1, label: 'Hoher Koffeinkonsum',           test: d => (d.avg7.caffeine ?? 0) >= 300 },
    ],
    message: 'Dein Energielevel scheint aktuell ein möglicher Fokusbereich zu sein. Schlaf und Stress wirken am stärksten — beobachte beides ein paar Tage.',
  },
  sleep: {
    label: 'Schlaf', icon: 'Sleep', threshold: 4,
    rules: [
      { id: 'shortSleep',  weight: 3, label: 'Durchschnitt <6,5h',            test: d => (d.avg7.sleep ?? 8) < 6.5 },
      { id: 'badQual',     weight: 2, label: 'Schlafqualität niedrig',         test: d => (d.latest.sleepQ ?? 5) <= 2 },
      { id: 'sleepSym',    weight: 2, label: 'Schlafprobleme angegeben',       test: () => hasSymptom('Schlafprobleme') },
      { id: 'sleepQuiz',   weight: 2, label: 'Schlaf-Check niedrig',           test: () => (quizScore('sleep') ?? 100) < 55 },
    ],
    message: 'Schlaf ist ein möglicher Fokusbereich. Beobachte Einschlafzeit, Dauer und wie erholt du morgens bist.',
  },
  stress: {
    label: 'Stress', icon: 'Stress', threshold: 4,
    rules: [
      { id: 'stressHi',    weight: 3, label: 'Stress-Mittel hoch',             test: d => (d.avg7.stress ?? 0) >= 4 },
      { id: 'unruhe',      weight: 2, label: 'Innere Unruhe angegeben',        test: () => hasSymptom('Innere Unruhe') },
      { id: 'stressQuiz',  weight: 2, label: 'Stress-Check niedrig',           test: () => (quizScore('stress') ?? 100) < 55 },
      { id: 'noSport',     weight: 1, label: 'Wenig Bewegung',                 test: d => (d.avg7.sport ?? 0) < 15 },
    ],
    message: 'Dein Stresslevel sieht erhöht aus. Kurze Pausen, Bewegung und weniger Koffein helfen oft — beobachte dich eine Woche.',
  },
  hydration: {
    label: 'Flüssigkeit', icon: 'Drop', threshold: 4,
    rules: [
      { id: 'lowWater',    weight: 3, label: 'Wasser <1,5L im Schnitt',        test: d => (d.avg7.water ?? 2) < 1.5 },
      { id: 'sportDay',    weight: 2, label: 'Sport am Tag',                   test: d => (d.latest.sport ?? 0) > 30 },
      { id: 'headache',    weight: 2, label: 'Kopfschmerzen angegeben',        test: () => hasSymptom('Kopfschmerzen') },
      { id: 'fatigue',     weight: 1, label: 'Müdigkeit angegeben',            test: () => hasSymptom('Müdigkeit') },
    ],
    message: 'Die Flüssigkeitsaufnahme könnte höher sein. Ein Glas Wasser zu jeder Mahlzeit ist ein einfacher Anker.',
  },
  caffeine: {
    label: 'Koffein', icon: 'Coffee', threshold: 4,
    rules: [
      { id: 'highCaff',    weight: 3, label: 'Koffein >400mg im Schnitt',      test: d => (d.avg7.caffeine ?? 0) >= 400 },
      { id: 'lateDay',     weight: 1, label: 'Kaffee auch nachmittags',        test: d => (d.onboarding.caffeineTime === 'nachmittags' || d.onboarding.caffeineTime === 'abends') },
      { id: 'badSleep',    weight: 2, label: 'Schlaf beeinträchtigt',           test: d => (d.avg7.sleep ?? 8) < 7 },
      { id: 'unruhe',      weight: 1, label: 'Innere Unruhe',                  test: () => hasSymptom('Innere Unruhe') },
    ],
    message: 'Dein Koffeinkonsum ist hoch. Ein Cut-off um 14 Uhr ist ein häufiger erster Hebel — beobachte wie sich der Schlaf verändert.',
  },
  regeneration: {
    label: 'Regeneration', icon: 'Heart', threshold: 5,
    rules: [
      { id: 'shortSleep',  weight: 2, label: 'Schlaf knapp',                   test: d => (d.avg7.sleep ?? 8) < 7 },
      { id: 'stressHi',    weight: 2, label: 'Stress erhöht',                  test: d => (d.avg7.stress ?? 0) >= 3.5 },
      { id: 'highSport',   weight: 2, label: 'Viel Sport',                     test: d => (d.avg7.sport ?? 0) > 60 },
      { id: 'highCaff',    weight: 1, label: 'Viel Koffein',                   test: d => (d.avg7.caffeine ?? 0) >= 300 },
      { id: 'pulse',       weight: 1, label: 'Ruhepuls erhöht',                test: d => (d.latest.pulse ?? 60) > 75 },
    ],
    message: 'Die Kombination aus Training, Schlaf und Stress deutet auf einen Regenerations-Fokus hin. Plane bewusst Ruhetage.',
  },
  iron: {
    label: 'Eisen', icon: 'Iron', threshold: 6,
    rules: [
      { id: 'ferrLow',     weight: 4, label: 'Ferritin niedrig',               test: d => {
        const f = d.labs.ferritin?.[0];
        return f && (f.flag === 'low' || f.value <= 30);
      }},
      { id: 'fatigue',     weight: 2, label: 'Müdigkeit häufig',               test: () => hasSymptom('Müdigkeit') },
      { id: 'paleSkin',    weight: 2, label: 'Blasse Haut',                    test: () => hasSymptom('Blasse Haut') },
      { id: 'veggie',      weight: 1, label: 'Vegetarisch / vegan',            test: d => ['vegetarisch','vegan'].includes(d.onboarding.diet) },
      { id: 'dyspnea',     weight: 2, label: 'Atemnot bei Belastung',          test: () => hasSymptom('Atemnot') },
      { id: 'ironQuiz',    weight: 1, label: 'Eisen-Check niedrig',            test: () => (quizScore('iron') ?? 100) < 55 },
    ],
    message: 'Deine Angaben sprechen dafür, das Thema Eisen ärztlich abklären zu lassen. Sinnvolle Laborparameter sind Ferritin, Hämoglobin und Transferrinsättigung.',
    critical: true,
  },
  vitd: {
    label: 'Vitamin D', icon: 'VitaminD', threshold: 4,
    rules: [
      { id: 'vitdLow',     weight: 3, label: 'Vitamin D niedrig',               test: d => {
        const v = d.labs.vitaminD?.[0];
        return v && (v.flag === 'low' || v.value < 30);
      }},
      { id: 'lowSun',      weight: 2, label: 'Wenig Sonnenzeit',                test: d => (d.avg7.sun ?? 60) < 20 },
      { id: 'winter',      weight: 1, label: 'Winter-Monate',                   test: () => { const m = new Date().getMonth(); return m <= 2 || m >= 10; } },
      { id: 'fatigue',     weight: 1, label: 'Müdigkeit',                      test: () => hasSymptom('Müdigkeit') },
      { id: 'mood',        weight: 1, label: 'Niedergeschlagenheit',           test: () => hasSymptom('Niedergeschlagenheit') },
    ],
    message: 'Vitamin D im Blick behalten. Im Winter und bei wenig Sonnenzeit lohnt sich oft eine ärztliche Messung.',
  },
  b12: {
    label: 'Vitamin B12', icon: 'B12', threshold: 5,
    rules: [
      { id: 'b12Low',      weight: 4, label: 'B12 niedrig',                     test: d => {
        const v = d.labs.b12?.[0];
        return v && (v.flag === 'low' || v.value < 300);
      }},
      { id: 'vegan',       weight: 2, label: 'Vegan / vegetarisch',             test: d => ['vegetarisch','vegan'].includes(d.onboarding.diet) },
      { id: 'tingle',      weight: 2, label: 'Kribbeln angegeben',              test: () => hasSymptom('Kribbeln') },
      { id: 'concent',     weight: 2, label: 'Konzentration schlecht',           test: () => hasSymptom('Konzentration') },
    ],
    message: 'B12 sollte ärztlich abgeklärt werden. Bei vegetarischer oder veganer Ernährung ist regelmäßige Kontrolle sinnvoll.',
    critical: true,
  },
  magnesium: {
    label: 'Magnesium', icon: 'Magnesium', threshold: 4,
    rules: [
      { id: 'cramps',      weight: 3, label: 'Muskelkrämpfe',                  test: () => hasSymptom('Muskelkrämpfe') },
      { id: 'lidTwitch',   weight: 2, label: 'Augenzucken',                    test: () => hasSymptom('Augenzucken') },
      { id: 'highSport',   weight: 1, label: 'Viel Sport',                     test: d => (d.avg7.sport ?? 0) > 45 },
      { id: 'highCaff',    weight: 1, label: 'Viel Kaffee',                    test: d => (d.avg7.caffeine ?? 0) >= 300 },
      { id: 'stressHi',    weight: 1, label: 'Stress erhöht',                   test: d => (d.avg7.stress ?? 0) >= 3.5 },
      { id: 'mgLow',       weight: 3, label: 'Magnesium (Vollblut) niedrig',    test: d => {
        const v = d.labs.magnesium?.[0];
        return v && (v.flag === 'low' || v.value < 1.4);
      }},
    ],
    message: 'Magnesium im Blick behalten. Bei Krämpfen oder hoher körperlicher Belastung lohnt die ärztliche Abklärung.',
  },
};

function evaluate(snapshot = null) {
  const d = snapshot || buildSnapshot();
  const results = [];
  for (const [id, def] of Object.entries(FOCUS)) {
    const matched = def.rules.filter(r => { try { return r.test(d); } catch { return false; } });
    const score = matched.reduce((s, r) => s + r.weight, 0);
    const maxScore = def.rules.reduce((s, r) => s + r.weight, 0);
    const active = score >= def.threshold;
    let level = 'ok';
    if (active && def.critical) level = 'alert';
    else if (active) level = 'warn';
    results.push({
      id, label: def.label, icon: def.icon,
      score, maxScore, threshold: def.threshold,
      active, level,
      reasons: matched.map(r => r.label),
      message: active ? def.message : null,
      // normalized: how much headroom until threshold — higher = healthier
      healthScore: Math.max(0, Math.min(100, Math.round((1 - score / Math.max(def.threshold * 1.6, 1)) * 100))),
    });
  }
  // sort: active criticals first, then active warn, then ok
  results.sort((a, b) => {
    const w = x => x.level === 'alert' ? 0 : x.level === 'warn' ? 1 : 2;
    return w(a) - w(b) || b.score - a.score;
  });
  return results;
}

// Overall wellness score: avg of all focus headroom scores
function overallScore() {
  const r = evaluate();
  return Math.round(r.reduce((s, x) => s + x.healthScore, 0) / r.length);
}

// Regenerate + persist insights
function refresh() {
  const r = evaluate();
  S.setInsights(r.map(x => ({
    id: x.id, focus: x.label, level: x.level, reasons: x.reasons, message: x.message, ts: Date.now(),
    score: x.healthScore, evidenceScore: x.score, threshold: x.threshold,
  })));
  return r;
}

window.Rules = { FOCUS, evaluate, overallScore, refresh, buildSnapshot };
