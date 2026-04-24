// Extra icons used by new screens
(function() {
  const Icon = window.Icon;
  const base = (size=22, color='currentColor', sw=1.5) => ({
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
    stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
  });

  Icon.Droplet = Icon.Drop;
  Icon.Dumbbell = (p={}) => (
    <svg {...base(p.size, p.color)}>
      <path d="M3 9v6M6 6v12M18 6v12M21 9v6M6 12h12"/>
    </svg>
  );
  Icon.Brain = Icon.Stress;
  Icon.MoonStar = Icon.Moon;
  Icon.Pill = (p={}) => (
    <svg {...base(p.size, p.color)}>
      <path d="M8 4h8a4 4 0 0 1 0 8l-8 8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"/>
      <path d="M8 4l8 8"/>
    </svg>
  );
  Icon.Gauge = (p={}) => (
    <svg {...base(p.size, p.color)}>
      <path d="M3 12a9 9 0 1 1 18 0"/>
      <path d="M12 12l5-3"/>
    </svg>
  );
  Icon.Clipboard = (p={}) => (
    <svg {...base(p.size, p.color)}>
      <rect x="5" y="4" width="14" height="17" rx="2"/>
      <path d="M9 4h6v3H9z"/>
      <path d="M9 12h6M9 16h4"/>
    </svg>
  );
})();
