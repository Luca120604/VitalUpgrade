// VITAL — compatibility shim + demo data loader (extends Storage).
// All new screens use these APIs; keeps legacy API intact.

(function() {
  const S = window.Storage;
  if (!S) return;

  // Existing Storage uses (type, value, meta). New code passes (type, payload object).
  const origAddEntry = S.addEntry;
  S.addEntry = function(type, payload) {
    if (payload && typeof payload === 'object' && 'value' in payload) {
      const { value, ...meta } = payload;
      return origAddEntry(type, value, meta);
    }
    return origAddEntry(type, payload);
  };

  const origAddLab = S.addLab;
  S.addLab = function(key, payload) {
    if (payload && typeof payload === 'object') {
      return origAddLab(key, payload.value, payload.unit, payload.flag || null);
    }
    return origAddLab(key, payload);
  };

  // Generic get/set for misc (quiz, etc)
  S.get = function(subkey) {
    try { return JSON.parse(localStorage.getItem('vital.v2.' + subkey)); } catch { return null; }
  };
  S.set = function(subkey, value) {
    try { localStorage.setItem('vital.v2.' + subkey, JSON.stringify(value)); } catch {}
  };

  S.clearAll = S.resetAll;

  // After any write, broadcast change
  const broadcast = () => window.dispatchEvent(new Event('vital:changed'));
  ['addEntry','addLab','setProfile','saveQuiz','addSymptom','resetAll'].forEach(m => {
    const orig = S[m];
    S[m] = function(...a) { const r = orig.apply(S, a); broadcast(); return r; };
  });

  // Demo data loader — 14 days of plausible entries
  S.loadDemoData = function() {
    const now = Date.now();
    const day = 24*60*60*1000;
    const rnd = (min,max) => min + Math.random()*(max-min);
    const push = (type, value, meta, tsOffset) => {
      const all = JSON.parse(localStorage.getItem('vital.v2.entries') || '[]');
      all.unshift({ id:`${type}-${now-tsOffset}-${Math.random()}`, ts: now - tsOffset, type, value, meta });
      localStorage.setItem('vital.v2.entries', JSON.stringify(all.slice(0, 2000)));
    };
    for (let d=13; d>=0; d--) {
      const o = d*day;
      push('water',     Math.round(rnd(1600, 2800)),       { unit:'ml' }, o);
      push('caffeine',  Math.round(rnd(80, 380)),          { unit:'mg' }, o);
      push('sleep',     +rnd(5.5, 8.2).toFixed(1),         { unit:'h' },  o);
      push('sleepQ',    Math.round(rnd(2, 5)),             { unit:'/5'},  o);
      push('stress',    Math.round(rnd(2, 4)),             { unit:'/5'},  o);
      if (d % 2 === 0) push('sport', Math.round(rnd(25, 75)), { unit:'min' }, o);
      push('sun',       Math.round(rnd(5, 40)),            { unit:'min' }, o);
      if (d === 0 || d === 7) push('weight', +rnd(79, 82).toFixed(1), { unit:'kg' }, o);
      push('pulse',     Math.round(rnd(58, 72)),           { unit:'bpm'}, o);
      if (d % 3 === 0) push('bp', Math.round(rnd(118,132)), { unit:'mmHg', diastolic: Math.round(rnd(72,84)) }, o);
      if (d % 2 === 0) push('creatine', 5,                  { unit:'g' }, o);
    }
    // labs
    const labs = { ferritin:[], vitamin_d:[], testosterone:[], shbg:[], tsh:[] };
    labs.ferritin.push({ value: 148, unit:'µg/l', flag:null, ts: now - 30*day });
    labs.vitamin_d.push({ value: 22, unit:'ng/ml', flag:'low', ts: now - 30*day });
    labs.testosterone.push({ value: 4.2, unit:'ng/ml', flag:null, ts: now - 30*day });
    labs.shbg.push({ value: 32, unit:'nmol/l', flag:null, ts: now - 30*day });
    labs.tsh.push({ value: 1.8, unit:'mU/l', flag:null, ts: now - 30*day });
    localStorage.setItem('vital.v2.labs', JSON.stringify(labs));
    broadcast();
  };
})();
