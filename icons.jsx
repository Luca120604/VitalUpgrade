// VITAL — Icon system (Phosphor-style, stroke 1.5, 24px grid)
// All icons: (props) => <svg/>, consistent geometry.

const baseProps = (size = 22, color = 'currentColor', sw = 1.5) => ({
  width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
  stroke: color, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round',
});

const Icon = {
  Home: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>
    </svg>
  ),
  Chart: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 4v16h16"/>
      <path d="M7 14l3-3 3 3 5-6"/>
    </svg>
  ),
  Book: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 4h10a4 4 0 0 1 4 4v12H8a4 4 0 0 0-4 4z"/>
      <path d="M4 4v16"/>
    </svg>
  ),
  Gear: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>
    </svg>
  ),
  Plus: (p = {}) => (
    <svg {...baseProps(p.size, p.color, p.sw || 2)}>
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Close: (p = {}) => (
    <svg {...baseProps(p.size, p.color, p.sw || 2)}>
      <path d="M6 6l12 12M6 18L18 6"/>
    </svg>
  ),
  Check: (p = {}) => (
    <svg {...baseProps(p.size, p.color, p.sw || 2)}>
      <path d="M5 12l5 5 9-11"/>
    </svg>
  ),
  Chevron: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M9 6l6 6-6 6"/>
    </svg>
  ),
  ArrowUp: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M7 14l5-5 5 5"/>
    </svg>
  ),
  ArrowDown: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M7 10l5 5 5-5"/>
    </svg>
  ),
  ArrowRight: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M5 12h14M13 6l6 6-6 6"/>
    </svg>
  ),
  Minus: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M5 12h14"/>
    </svg>
  ),
  // Topic icons — abstract, not literal
  Iron: (p = {}) => ( // droplet
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 3s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12z"/>
    </svg>
  ),
  VitaminD: (p = {}) => ( // sun
    <svg {...baseProps(p.size, p.color)}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
    </svg>
  ),
  B12: (p = {}) => ( // leaf
    <svg {...baseProps(p.size, p.color)}>
      <path d="M20 4s-2 14-10 16c-5 1-7-3-7-6 2-8 13-10 17-10z"/>
      <path d="M4 20c4-8 10-12 16-16"/>
    </svg>
  ),
  Magnesium: (p = {}) => ( // hex/crystal
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/>
      <path d="M12 3v18M4 7.5l16 9M20 7.5l-16 9"/>
    </svg>
  ),
  Sleep: (p = {}) => ( // moon
    <svg {...baseProps(p.size, p.color)}>
      <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>
    </svg>
  ),
  Stress: (p = {}) => ( // waves
    <svg {...baseProps(p.size, p.color)}>
      <path d="M3 8c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/>
      <path d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/>
      <path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2"/>
    </svg>
  ),
  // Values icons
  Heart: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 21s-8-5-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 6-8 11-8 11z"/>
    </svg>
  ),
  Pulse: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M3 12h4l2-6 3 12 3-8 2 2h4"/>
    </svg>
  ),
  Scale: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <rect x="3" y="5" width="18" height="15" rx="2"/>
      <path d="M8 12h8"/>
    </svg>
  ),
  Thermo: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M10 14V5a2 2 0 1 1 4 0v9a4 4 0 1 1-4 0z"/>
    </svg>
  ),
  Lab: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M9 3h6v5l5 10a2 2 0 0 1-2 3H6a2 2 0 0 1-2-3l5-10z"/>
      <path d="M8 14h8"/>
    </svg>
  ),
  Activity: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 12h3l3-7 4 14 3-7h3"/>
    </svg>
  ),
  Drop: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z"/>
    </svg>
  ),
  Coffee: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 8h13v6a5 5 0 0 1-10 0V8z"/>
      <path d="M17 10h2a3 3 0 0 1 0 6h-2"/>
      <path d="M7 2v3M11 2v3"/>
    </svg>
  ),
  Note: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M6 3h9l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <path d="M14 3v6h6M8 13h8M8 17h5"/>
    </svg>
  ),
  Quiz: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M9 10a3 3 0 1 1 4 2.8c-.6.3-1 .7-1 1.2v.5M12 17.5v0.01"/>
    </svg>
  ),
  Bell: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 7H4c0-1 2-2 2-7z"/>
      <path d="M10 20a2 2 0 0 0 4 0"/>
    </svg>
  ),
  Lock: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <rect x="4" y="10" width="16" height="11" rx="2"/>
      <path d="M8 10V7a4 4 0 1 1 8 0v3"/>
    </svg>
  ),
  Download: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 4v11M7 10l5 5 5-5M4 20h16"/>
    </svg>
  ),
  Trash: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13"/>
    </svg>
  ),
  Moon: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>
    </svg>
  ),
  Reset: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M4 12a8 8 0 1 0 2.5-5.8M4 4v4h4"/>
    </svg>
  ),
  Info: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 11v5M12 8v.01"/>
    </svg>
  ),
  Shield: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z"/>
    </svg>
  ),
  Sun: (p = {}) => (
    <svg {...baseProps(p.size, p.color)}>
      <circle cx="12" cy="12" r="4"/>
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>
    </svg>
  ),
  // VITAL core logo — abstract pulse-ring
  Core: (p = {}) => {
    const s = p.size || 28;
    const col = p.color || 'currentColor';
    return (
      <svg width={s} height={s} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="10" stroke={col} strokeWidth="1.5" opacity="0.35"/>
        <circle cx="14" cy="14" r="5.5" stroke={col} strokeWidth="1.5"/>
        <path d="M3 14h4l2-3 2 6 2-4 2 2h8" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  },
};

window.Icon = Icon;
