// VITAL — static data + content. Dynamic state lives in Storage.

// Focus topics shown on the Home ring. Order matters.
// 8 segments — more detail than v1. Status + score come dynamically from Rules.
const FOCUS_ORDER = ['energy','sleep','stress','hydration','caffeine','regeneration','iron','vitd'];

const STATUS = {
  ok:    { label: 'Unauffällig',  color: 'var(--accent)', tone: 'oklch(0.78 0.09 190)' },
  warn:  { label: 'Beobachten',   color: 'var(--warn)',   tone: 'oklch(0.82 0.10 75)'  },
  alert: { label: 'Abklären',     color: 'var(--alert)',  tone: 'oklch(0.72 0.11 45)'  },
  none:  { label: 'Keine Daten',  color: 'var(--muted)',  tone: 'oklch(0.50 0.01 240)' },
};

// Quick-entry definitions — used by the "+" action sheet and Home quick tiles.
const QUICK_ENTRIES = [
  { type: 'water',    label: 'Wasser',         unit: 'ml',    icon: 'Drop',    step: 250,  max: 4000,  daily: true,  aggregate: 'sum' },
  { type: 'caffeine', label: 'Koffein',        unit: 'mg',    icon: 'Coffee',  step: 80,   max: 800,   daily: true,  aggregate: 'sum' },
  { type: 'sleep',    label: 'Schlaf',         unit: 'h',     icon: 'Sleep',   step: 0.25, max: 12,    daily: false, aggregate: 'last' },
  { type: 'sleepQ',   label: 'Schlafqualität', unit: '/5',    icon: 'Moon',    step: 1,    max: 5,     daily: false, aggregate: 'last' },
  { type: 'stress',   label: 'Stress',         unit: '/5',    icon: 'Stress',  step: 1,    max: 5,     daily: false, aggregate: 'last' },
  { type: 'sport',    label: 'Sport',          unit: 'min',   icon: 'Activity',step: 10,   max: 240,   daily: true,  aggregate: 'sum' },
  { type: 'sun',      label: 'Sonne',          unit: 'min',   icon: 'Sun',     step: 10,   max: 240,   daily: true,  aggregate: 'sum' },
  { type: 'pulse',    label: 'Puls',           unit: 'bpm',   icon: 'Pulse',   step: 1,    max: 200,   daily: false, aggregate: 'last' },
  { type: 'bp',       label: 'Blutdruck',      unit: 'mmHg',  icon: 'Heart',   step: 1,    max: 250,   daily: false, aggregate: 'last', composite: ['sys','dia'] },
  { type: 'weight',   label: 'Gewicht',        unit: 'kg',    icon: 'Scale',   step: 0.1,  max: 250,   daily: false, aggregate: 'last' },
  { type: 'creatine', label: 'Kreatin',        unit: 'g',     icon: 'Lab',     step: 1,    max: 20,    daily: true,  aggregate: 'sum' },
];

const SYMPTOM_TAGS = [
  'Müdigkeit', 'Konzentration', 'Muskelkrämpfe', 'Schlafprobleme',
  'Innere Unruhe', 'Schwindel', 'Blasse Haut', 'Kribbeln',
  'Häufige Infekte', 'Kopfschmerzen', 'Augenzucken', 'Atemnot',
  'Niedergeschlagenheit', 'Haarausfall', 'Brüchige Nägel',
];

// ---- Onboarding questionnaire ----
const ONBOARDING_STEPS = [
  { id: 'welcome' }, // intro
  { id: 'name', kind: 'text', prompt: 'Wie heißt du?', placeholder: 'Vorname', key: 'name' },
  { id: 'age',  kind: 'number', prompt: 'Wie alt bist du?', unit: 'Jahre', key: 'age', min: 14, max: 100, default: 30 },
  { id: 'sex',  kind: 'choice', prompt: 'Geschlecht', key: 'sex', options: [
    { v: 'w', l: 'Weiblich' }, { v: 'm', l: 'Männlich' }, { v: 'd', l: 'Divers' }, { v: 'na', l: 'Keine Angabe' },
  ]},
  { id: 'height', kind: 'number', prompt: 'Größe', unit: 'cm', key: 'height', min: 130, max: 220, default: 175 },
  { id: 'weight', kind: 'number', prompt: 'Gewicht', unit: 'kg', key: 'weight', min: 35, max: 200, default: 72 },
  { id: 'activity', kind: 'choice', prompt: 'Wie aktiv bist du?', key: 'activity', options: [
    { v: 'sed',     l: 'Sitzend',            s: 'Viel Bürojob, kaum Sport' },
    { v: 'light',   l: 'Leicht aktiv',        s: '1–2× Sport pro Woche' },
    { v: 'mod',     l: 'Moderat aktiv',       s: '3–4× Sport pro Woche' },
    { v: 'high',    l: 'Sehr aktiv',          s: '5+× oder Leistungssport' },
  ]},
  { id: 'sleepGoal', kind: 'choice', prompt: 'Wie schläfst du aktuell?', key: 'sleepGoal', options: [
    { v: 'good', l: 'Gut',      s: 'Meist erholt' },
    { v: 'mid',  l: 'Mittel',   s: 'Mal so, mal so' },
    { v: 'poor', l: 'Schlecht', s: 'Oft unruhig' },
  ]},
  { id: 'diet', kind: 'choice', prompt: 'Wie ernährst du dich?', key: 'diet', options: [
    { v: 'omni',        l: 'Mischkost' },
    { v: 'flexitarian', l: 'Flexitarisch' },
    { v: 'vegetarisch', l: 'Vegetarisch' },
    { v: 'vegan',       l: 'Vegan' },
  ]},
  { id: 'gymGoal', kind: 'choice', prompt: 'Training / Körperziel', key: 'gymGoal', options: [
    { v: 'none',   l: 'Kein Fokus' },
    { v: 'fit',    l: 'Allgemeine Fitness' },
    { v: 'muscle', l: 'Muskelaufbau' },
    { v: 'cut',    l: 'Definition / Abnehmen' },
    { v: 'perf',   l: 'Leistung / Ausdauer' },
  ]},
  { id: 'energy', kind: 'choice', prompt: 'Wie ist dein Energielevel typischerweise?', key: 'energy', options: [
    { v: 'sehr_hoch',    l: 'Sehr hoch' },
    { v: 'hoch',         l: 'Hoch' },
    { v: 'mittel',       l: 'Mittel' },
    { v: 'niedrig',      l: 'Niedrig' },
    { v: 'sehr_niedrig', l: 'Sehr niedrig' },
  ]},
  { id: 'caffeineTime', kind: 'choice', prompt: 'Wann trinkst du Kaffee / Koffein?', key: 'caffeineTime', options: [
    { v: 'keiner',        l: 'Kein Koffein' },
    { v: 'morgens',       l: 'Nur morgens' },
    { v: 'vormittags',    l: 'Morgens + Vormittag' },
    { v: 'nachmittags',   l: 'Auch nachmittags' },
    { v: 'abends',        l: 'Auch abends' },
  ]},
  { id: 'focus', kind: 'multi', prompt: 'Was beschäftigt dich gerade?', subtitle: 'Mehrfachauswahl', key: 'focus', options: [
    { v: 'energie',    l: 'Mehr Energie' },
    { v: 'schlaf',     l: 'Besser schlafen' },
    { v: 'stress',     l: 'Weniger Stress' },
    { v: 'gewicht',    l: 'Gewicht' },
    { v: 'muskel',     l: 'Muskelaufbau' },
    { v: 'immunsystem',l: 'Immunsystem' },
    { v: 'verstehen',  l: 'Blutwerte verstehen' },
  ]},
  { id: 'done' },
];

// Quick screening (the "Einstiegsquiz" at end of onboarding)
const INTRO_QUIZ = [
  { q: 'Wie oft fühlst du dich erschöpft?',   key: 'fatigue', a: ['Nie','Selten','Oft','Täglich'] },
  { q: 'Schlafqualität im Schnitt?',           key: 'sleepQ',  a: ['Sehr gut','Gut','Mittel','Schlecht'] },
  { q: 'Fühlst du dich gestresst?',            key: 'stress',  a: ['Nie','Selten','Oft','Täglich'] },
  { q: 'Wie viel Wasser trinkst du pro Tag?',  key: 'water',   a: ['> 2,5L','1,5–2,5L','1–1,5L','< 1L'] },
  { q: 'Wie viele Stunden schläfst du?',       key: 'sleep',   a: ['> 8h','7–8h','6–7h','< 6h'] },
  { q: 'Sport pro Woche?',                     key: 'sport',   a: ['4+','2–3','1','Nie'] },
  { q: 'Sonnenzeit draußen?',                  key: 'sun',     a: ['> 45 min','15–45 min','< 15 min','Kaum'] },
  { q: 'Verspürst du eine dieser Beschwerden oft?', key: 'sym', a: ['Nein','Müdigkeit','Krämpfe','Kribbeln'], multi: true },
];

// ---- Focus checks (long-form, for the "Schnell-Check" in the app) ----
const QUIZZES = [
  { id: 'sleep',   title: 'Schlaf-Check',     minutes: 2, icon: 'Sleep' },
  { id: 'stress',  title: 'Stress-Check',     minutes: 3, icon: 'Stress' },
  { id: 'iron',    title: 'Eisen-Check',      minutes: 3, icon: 'Iron' },
  { id: 'vitd',    title: 'Vitamin-D-Check',  minutes: 2, icon: 'VitaminD' },
  { id: 'b12',     title: 'B12-Check',        minutes: 3, icon: 'B12' },
  { id: 'mg',      title: 'Magnesium-Check',  minutes: 2, icon: 'Magnesium' },
];

const QUIZ_QUESTIONS = {
  sleep: [
    { q: 'Einschlafzeit?', a: ['< 15 Min','15–30 Min','30–60 Min','> 60 Min'] },
    { q: 'Wachst du nachts häufig auf?', a: ['Nie','Selten','Manchmal','Oft'] },
    { q: 'Wie erholt fühlst du dich morgens?', a: ['Sehr erholt','Erholt','Weniger','Gar nicht'] },
    { q: 'Schlafstunden typisch?', a: ['> 8h','7–8h','6–7h','< 6h'] },
    { q: 'Bildschirme kurz vorm Schlaf?', a: ['Nein','Selten','Manchmal','Täglich'] },
    { q: 'Tagesmüdigkeit?', a: ['Nie','Selten','Oft','Täglich'] },
  ],
  stress: [
    { q: 'Fühlst du dich gehetzt?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Schwierig zu entspannen?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Gedankenkreisen am Abend?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Reizbarkeit?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Körperliche Anspannung?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Pausen im Alltag?', a: ['Regelmäßig','Manchmal','Selten','Nie'] },
    { q: 'Bewegung pro Woche?', a: ['> 3×','2–3×','1×','Nie'] },
  ],
  iron: [
    { q: 'Wie oft erschöpft?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Schnell kurzatmig?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Blasse Haut/Schleimhäute?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Haarausfall zuletzt?', a: ['Nein','Leicht','Merklich','Stark'] },
    { q: 'Brüchige Nägel?', a: ['Nein','Leicht','Merklich','Stark'] },
    { q: 'Rotes Fleisch?', a: ['Täglich','2–3×/Wo','Selten','Nie'] },
    { q: 'Starke Menstruation?', a: ['Nicht zutreffend','Leicht','Merklich','Stark'] },
    { q: 'Kalte Hände/Füße?', a: ['Nie','Selten','Oft','Täglich'] },
  ],
  vitd: [
    { q: 'Zeit draußen pro Tag?', a: ['> 60 Min','30–60 Min','< 30 Min','Kaum'] },
    { q: 'Jahreszeit?', a: ['Sommer','Frühl./Herbst','Winter','Kaum draußen'] },
    { q: 'Erschöpfung ohne Grund?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Niedergeschlagene Stimmung?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Muskelschwäche?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Nimmst du Vitamin D?', a: ['Ja, regelmäßig','Gelegentlich','Nein','Unsicher'] },
  ],
  b12: [
    { q: 'Kribbeln Hände/Füße?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Gedächtnis/Konzentration?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Tierische Produkte?', a: ['Täglich','2–3×/Wo','Selten','Nie (vegan)'] },
    { q: 'Magen-Darm-Probleme?', a: ['Nein','Selten','Oft','Chronisch'] },
    { q: 'Gleichgewicht?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Glatte, rote Zunge?', a: ['Nein','Manchmal','Oft','Immer'] },
    { q: 'Nimmst du B12?', a: ['Ja, regelmäßig','Gelegentlich','Nein','Unsicher'] },
  ],
  mg: [
    { q: 'Muskelkrämpfe (z.B. Wade)?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Augenzucken?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Innere Unruhe?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Kopfschmerzen?', a: ['Nie','Selten','Oft','Täglich'] },
    { q: 'Sportintensität/Woche?', a: ['Gering','Moderat','Hoch','Sehr hoch'] },
    { q: 'Kaffee/Alkohol?', a: ['Gering','Moderat','Hoch','Sehr hoch'] },
  ],
};

const ARTICLES = [
  { id: 'iron',   topic: 'Eisen',        title: 'Eisen verstehen',         read: '6 min', icon: 'Iron',      excerpt: 'Ferritin, Transferrin, Hämoglobin — was bedeuten die Werte wirklich?' },
  { id: 'vitd',   topic: 'Vitamin D',    title: 'Vitamin D im Alltag',     read: '5 min', icon: 'VitaminD',  excerpt: 'Wie Sonne, Ernährung und Jahreszeit zusammenspielen.' },
  { id: 'b12',    topic: 'B12',          title: 'B12 und Ernährung',       read: '7 min', icon: 'B12',       excerpt: 'Besonders relevant bei pflanzlicher Ernährung.' },
  { id: 'mg',     topic: 'Magnesium',    title: 'Magnesium und Stress',    read: '5 min', icon: 'Magnesium', excerpt: 'Der unterschätzte Regenerations-Faktor.' },
  { id: 'sleep',  topic: 'Schlaf',       title: 'Schlafqualität',           read: '8 min', icon: 'Sleep',     excerpt: 'Was wirklich zählt: Dauer, Tiefe, Regelmäßigkeit.' },
  { id: 'stress', topic: 'Stress',       title: 'Stresssignale erkennen',   read: '6 min', icon: 'Stress',    excerpt: 'Körperliche Anker, die du früh bemerken kannst.' },
  { id: 'hydr',   topic: 'Wasser',       title: 'Flüssigkeit & Performance',read: '4 min', icon: 'Drop',      excerpt: 'Warum Wasser oft der einfachste Hebel ist.' },
  { id: 'caff',   topic: 'Koffein',      title: 'Koffein richtig dosieren', read: '5 min', icon: 'Coffee',    excerpt: 'Halbwertszeit, Cut-off und der Schlaf.' },
  { id: 'blood',  topic: 'Grundlagen',   title: 'Blutwerte verstehen',      read: '9 min', icon: 'Lab',       excerpt: 'Die wichtigsten Labor-Basics für Einsteiger.' },
  { id: 'doc',    topic: 'Grundlagen',   title: 'Wann zum Arzt',            read: '4 min', icon: 'Shield',    excerpt: 'Red-Flags, bei denen du nicht zögern solltest.' },
];

const DISCLAIMER = 'VITAL dient der persönlichen Dokumentation und allgemeinen Orientierung. Die Hinweise der App sind keine Diagnose und keine Therapieempfehlung. Bei anhaltenden, unklaren oder belastenden Beschwerden solltest du ärztlichen Rat einholen.';

window.VITAL_DATA = {
  FOCUS_ORDER, STATUS,
  QUICK_ENTRIES, SYMPTOM_TAGS,
  ONBOARDING_STEPS, INTRO_QUIZ,
  QUIZZES, QUIZ_QUESTIONS,
  ARTICLES, DISCLAIMER,
};
