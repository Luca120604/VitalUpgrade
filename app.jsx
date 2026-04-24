// VITAL — App shell (final). Wires onboarding + main app + all sheets/modals.

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const Icon = window.Icon;
  const { TabBar } = window.UI;
  const S = window.Storage;

  const defaults = /*EDITMODE-BEGIN*/{
    "accentHue": 190,
    "density": "comfortable"
  }/*EDITMODE-END*/;

  const [tweaks, setTweaks] = window.useTweaks ? window.useTweaks(defaults) : [defaults, () => {}];

  // determine if onboarded
  const [booted, setBooted] = useStateApp(false);
  const [onboarded, setOnboarded] = useStateApp(false);

  useEffectApp(() => {
    const p = S.getProfile();
    setOnboarded(!!(p && p.name));
    setBooted(true);
  }, []);

  const [tab, setTab] = useStateApp('home');
  const [actionOpen, setActionOpen] = useStateApp(false);
  const [quickType, setQuickType] = useStateApp(null);   // e.g. 'water'
  const [symptomOpen, setSymptomOpen] = useStateApp(false);
  const [labKey, setLabKey] = useStateApp(null);         // labKey or '__parse'
  const [quizOpen, setQuizOpen] = useStateApp(false);
  const [coachOpen, setCoachOpen] = useStateApp(false);

  // Show the FAB coach-mark once per user, the first time they reach the
  // main app after onboarding. A localStorage flag suppresses subsequent shows.
  useEffectApp(() => {
    if (!onboarded || !booted) return;
    const seen = localStorage.getItem('vital.coach.fab.seen');
    if (seen) return;
    const t = setTimeout(() => setCoachOpen(true), 650);
    return () => clearTimeout(t);
  }, [onboarded, booted]);

  const dismissCoach = () => {
    localStorage.setItem('vital.coach.fab.seen', '1');
    setCoachOpen(false);
  };

  // accent hue
  useEffectApp(() => {
    const h = tweaks.accentHue;
    document.documentElement.style.setProperty('--accent', `oklch(0.78 0.09 ${h})`);
    document.documentElement.style.setProperty('--accent-ink', `oklch(0.22 0.04 ${h})`);
    document.documentElement.style.setProperty('--accent-dim', `oklch(0.35 0.06 ${h} / 0.22)`);
  }, [tweaks.accentHue]);

  const openQuick = (type) => {
    setActionOpen(false);
    if (type === '__symptom') setTimeout(() => setSymptomOpen(true), 220);
    else if (type === '__parse') setTimeout(() => setLabKey('__parse'), 220);
    else setTimeout(() => setQuickType(type), 220);
  };

  if (!booted) return null;

  if (!onboarded) {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', background: 'var(--bg-0)' }}>
        <window.Onboarding onDone={() => setOnboarded(true)} />
      </div>
    );
  }

  const screens = {
    home: <window.Home
      onOpenCore={() => setActionOpen(true)}
      onOpenQuickEntry={openQuick}
      onOpenSymptom={() => setSymptomOpen(true)}
      goTab={setTab}
    />,
    werte: <window.Werte
      onOpenQuickEntry={openQuick}
      onOpenLab={(k) => setLabKey(k)}
    />,
    wissen: <window.Wissen />,
    set: <window.Einstellungen
      onRestart={() => setOnboarded(false)}
      onOpenQuiz={() => setQuizOpen(true)}
    />,
  };

  const tabLabel = { home:'01 Home', werte:'02 Werte', wissen:'03 Wissen', set:'04 Einstellungen' };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: 'var(--bg-0)' }}>
      <div key={tab} className="screen" data-screen-label={tabLabel[tab]}
        style={{ height: '100%', overflowY: 'auto', paddingBottom: 100 }}
      >
        {screens[tab]}
      </div>

      <TabBar active={tab} onTab={setTab} onCore={() => { dismissCoach(); setActionOpen(true); }} />

      {coachOpen && <window.FabCoach onDismiss={dismissCoach} />}

      <window.ActionSheet open={actionOpen} onClose={() => setActionOpen(false)} onPick={openQuick} />

      <window.QuickEntrySheet open={!!quickType} type={quickType} onClose={() => setQuickType(null)} />
      <window.SymptomSheet    open={symptomOpen}                onClose={() => setSymptomOpen(false)} />
      <window.LabSheet        open={!!labKey} labKey={labKey}    onClose={() => setLabKey(null)} />

      {quizOpen && (
        <window.Quiz onClose={() => setQuizOpen(false)} onComplete={() => setQuizOpen(false)} />
      )}

      {window.TweaksPanel && (
        <window.TweaksPanel>
          <window.TweakSection title="Akzentfarbe">
            <window.TweakSlider label="Farbton" value={tweaks.accentHue}
              min={0} max={360} step={1}
              onChange={(v) => setTweaks({ accentHue: v })} />
            <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
              {[
                { label: 'Teal', hue: 190 },
                { label: 'Sage', hue: 155 },
                { label: 'Sand', hue: 80 },
                { label: 'Clay', hue: 40 },
                { label: 'Blau', hue: 230 },
              ].map(p => (
                <button key={p.label} onClick={() => setTweaks({ accentHue: p.hue })} style={{
                  flex: 1, padding: '10px 6px', borderRadius: 10,
                  background: `oklch(0.78 0.09 ${p.hue})`,
                  color: `oklch(0.22 0.04 ${p.hue})`, border: 0,
                  fontSize: 11, fontWeight: 600, cursor: 'pointer',
                }}>{p.label}</button>
              ))}
            </div>
          </window.TweakSection>
          <window.TweakSection title="Prototyp">
            <window.TweakButton label="Onboarding erneut zeigen" onClick={() => {
              S.setProfile({});
              setOnboarded(false);
            }} />
            <window.TweakButton label="Demo-Daten laden" onClick={() => {
              S.loadDemoData();
              window.dispatchEvent(new Event('vital:changed'));
            }} />
            <window.TweakButton label="Alle Daten löschen" onClick={() => {
              S.clearAll();
              setOnboarded(false);
            }} />
          </window.TweakSection>
        </window.TweaksPanel>
      )}
    </div>
  );
}

window.App = App;
