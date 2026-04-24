// Extend VITAL_DATA with fields needed by new screens.
(function() {
  const D = window.VITAL_DATA;
  if (!D) return;

  // Enrich QUICK_ENTRIES with default/presets/quickSteps used by new sheets
  const enrich = {
    water:    { default: 250,  quickSteps: [100,250,500] },
    caffeine: { default: 80,   quickSteps: [40,80,120], presets: [
      { label: 'Espresso 40mg', value: 40 }, { label: 'Kaffee 80mg', value: 80 },
      { label: 'Tee 30mg', value: 30 }, { label: 'Energy 160mg', value: 160 }] },
    sleep:    { default: 7.5,  quickSteps: [0.5], min: 0, presets: [
      { label: '6h', value: 6 }, { label: '7h', value: 7 }, { label: '8h', value: 8 }, { label: '9h', value: 9 }] },
    sleepQ:   { default: 3 },
    stress:   { default: 2 },
    sport:    { default: 30,   quickSteps: [15,30,45], presets: [
      { label: 'Walk 20', value: 20 }, { label: 'Gym 60', value: 60 }, { label: 'Lauf 45', value: 45 }] },
    sun:      { default: 15,   quickSteps: [5,15,30] },
    pulse:    { default: 62 },
    bp:       { default: 120, default2: 80 },
    weight:   { default: 80 },
    creatine: { default: 5,    quickSteps: [3,5] },
  };
  D.QUICK_ENTRIES = D.QUICK_ENTRIES.map(e => ({ ...e, ...enrich[e.type] }));

  // Change some icon names to match the new ActionSheet mapping
  D.QUICK_ENTRIES = D.QUICK_ENTRIES.map(e => {
    const override = {
      water:'Droplet', sleep:'Moon', sleepQ:'MoonStar', stress:'Brain',
      sport:'Dumbbell', pulse:'Heart', bp:'Gauge', weight:'Scale',
      creatine:'Pill', caffeine:'Coffee', sun:'Sun',
    };
    return { ...e, icon: override[e.type] || e.icon };
  });
})();
