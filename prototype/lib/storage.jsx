// VITAL — localStorage-first data layer
// Single source of truth for profile, daily entries, labs, symptoms, quiz results, insights.
// All keys namespaced under `vital.v2.*` so v1 data is untouched.

const KEY = {
  profile:    'vital.v2.profile',
  onboarding: 'vital.v2.onboarding',
  entries:    'vital.v2.entries',     // array of { id, ts, type, value, meta }
  labs:       'vital.v2.labs',         // { ferritin: [{value,unit,ts,flag}], ... }
  symptoms:   'vital.v2.symptoms',     // array of { id, ts, tags:[], note }
  quizzes:    'vital.v2.quizzes',      // { sleep: { ts, answers:[...], score }, ... }
  insights:   'vital.v2.insights',     // array of { id, focus, level, reasons, message, ts }
  settings:   'vital.v2.settings',
  _schema:    'vital.v2.schema',
};

const SCHEMA_VERSION = 2;

function read(k, fallback) {
  try {
    const raw = localStorage.getItem(k);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('[vital.storage] read failed', k, e);
    return fallback;
  }
}

function write(k, v) {
  try {
    localStorage.setItem(k, JSON.stringify(v));
    return true;
  } catch (e) {
    console.warn('[vital.storage] write failed', k, e);
    return false;
  }
}

function remove(k) { try { localStorage.removeItem(k); } catch {} }

// -- Profile --
function getProfile() {
  return read(KEY.profile, null);
}
function setProfile(p) {
  const merged = { ...(getProfile() || {}), ...p, updatedAt: Date.now() };
  write(KEY.profile, merged);
  return merged;
}

// -- Onboarding --
function getOnboarding() {
  return read(KEY.onboarding, { complete: false, step: 0, answers: {} });
}
function setOnboarding(o) {
  const merged = { ...getOnboarding(), ...o };
  write(KEY.onboarding, merged);
  return merged;
}
function completeOnboarding(answers) {
  write(KEY.onboarding, { complete: true, step: 99, answers, completedAt: Date.now() });
}

// -- Entries (daily tracked values: water, caffeine, sleep, pulse, bp, weight, sport…) --
function getEntries(filter) {
  const all = read(KEY.entries, []);
  if (!filter) return all;
  return all.filter(e =>
    (!filter.type || e.type === filter.type) &&
    (!filter.since || e.ts >= filter.since)
  );
}
function addEntry(type, value, meta = {}) {
  const all = read(KEY.entries, []);
  const entry = { id: `${type}-${Date.now()}`, ts: Date.now(), type, value, meta };
  all.unshift(entry);
  write(KEY.entries, all.slice(0, 2000)); // keep last 2000 events
  return entry;
}
function latestEntry(type) {
  const all = read(KEY.entries, []);
  return all.find(e => e.type === type) || null;
}

// For a given type, return an array of daily aggregates over last N days (most recent last).
// aggregator: (valuesOfDay) => numberOrNull
function dailySeries(type, days = 7, aggregator = 'last') {
  const now = new Date();
  now.setHours(23,59,59,999);
  const out = [];
  const entries = getEntries({ type });

  for (let i = days - 1; i >= 0; i--) {
    const dayEnd = new Date(now); dayEnd.setDate(now.getDate() - i);
    const dayStart = new Date(dayEnd); dayStart.setHours(0,0,0,0);
    const inDay = entries.filter(e => e.ts >= dayStart.getTime() && e.ts <= dayEnd.getTime());
    let v = null;
    if (inDay.length) {
      if (aggregator === 'sum') v = inDay.reduce((s, e) => s + (Number(e.value) || 0), 0);
      else if (aggregator === 'avg') v = inDay.reduce((s, e) => s + (Number(e.value) || 0), 0) / inDay.length;
      else v = Number(inDay[0].value); // 'last' — latest within day
    }
    out.push(v);
  }
  return out;
}

// -- Labs --
function getLabs() {
  return read(KEY.labs, {});
}
function addLab(key, value, unit, flag = null) {
  const all = getLabs();
  const arr = all[key] || [];
  arr.unshift({ value: Number(value), unit, flag, ts: Date.now() });
  all[key] = arr.slice(0, 200);
  write(KEY.labs, all);
  return arr[0];
}
function latestLab(key) {
  const arr = getLabs()[key] || [];
  return arr[0] || null;
}

// -- Symptoms --
function getSymptoms() { return read(KEY.symptoms, []); }
function addSymptom(tags, note) {
  const all = getSymptoms();
  const s = { id: `sym-${Date.now()}`, ts: Date.now(), tags, note };
  all.unshift(s);
  write(KEY.symptoms, all.slice(0, 500));
  return s;
}

// -- Quizzes --
function getQuizzes() { return read(KEY.quizzes, {}); }
function saveQuiz(id, answers, score) {
  const all = getQuizzes();
  all[id] = { ts: Date.now(), answers, score };
  write(KEY.quizzes, all);
}

// -- Insights --
function getInsights() { return read(KEY.insights, []); }
function setInsights(arr) { write(KEY.insights, arr); }

// -- Settings --
function getSettings() {
  return read(KEY.settings, {
    accentHue: 190,
    darkMode: true,
    reducedMotion: false,
    reminders: false,
  });
}
function setSettings(patch) {
  const merged = { ...getSettings(), ...patch };
  write(KEY.settings, merged);
  return merged;
}

// -- Export / Reset --
function exportAll() {
  return {
    schema: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    profile: getProfile(),
    onboarding: getOnboarding(),
    entries: getEntries(),
    labs: getLabs(),
    symptoms: getSymptoms(),
    quizzes: getQuizzes(),
    insights: getInsights(),
    settings: getSettings(),
  };
}

function resetAll() {
  Object.values(KEY).forEach(remove);
}

// -- Schema bootstrap --
function bootstrap() {
  const schema = read(KEY._schema, null);
  if (!schema) {
    write(KEY._schema, { version: SCHEMA_VERSION, createdAt: Date.now() });
  }
}

window.Storage = {
  KEY, bootstrap,
  getProfile, setProfile,
  getOnboarding, setOnboarding, completeOnboarding,
  getEntries, addEntry, latestEntry, dailySeries,
  getLabs, addLab, latestLab,
  getSymptoms, addSymptom,
  getQuizzes, saveQuiz,
  getInsights, setInsights,
  getSettings, setSettings,
  exportAll, resetAll,
};

// Auto-bootstrap
bootstrap();
