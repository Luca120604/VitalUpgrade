// VITAL — shared primitives: HealthRing, Sparkline, SegmentedControl, StatusDot, TopicCard
// No framer-motion — pure CSS transitions.

// 6-segment ring (SVG). Each segment animates from 0 → its score.
function HealthRing({ topics, size = 220, stroke = 10, gap = 0.055, anim = true }) {
  const r = (size - stroke) / 2 - 4;
  const cx = size / 2,cy = size / 2;
  const circ = 2 * Math.PI * r;
  const n = topics.length;
  const seg = circ / n;
  const gapLen = circ * gap;
  const usable = seg - gapLen;

  const color = (s) => {
    if (s === 'ok') return 'oklch(0.78 0.09 190)';
    if (s === 'warn') return 'oklch(0.82 0.10 75)';
    if (s === 'alert') return 'oklch(0.72 0.11 45)';
    return 'oklch(0.45 0.01 240)';
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      {topics.map((t, i) => {
        const offset = -i * seg;
        return (
          <circle key={`bg-${t.id}`} cx={cx} cy={cy} r={r}
          stroke="oklch(0.26 0.006 240)" strokeWidth={stroke} fill="none"
          strokeDasharray={`${usable} ${circ - usable}`}
          strokeDashoffset={offset}
          strokeLinecap="butt" />);


      })}
      {topics.map((t, i) => {
        const filled = usable * (t.score / 100);
        const offset = -i * seg;
        const delay = 0.1 + i * 0.08;
        return (
          <circle key={`fg-${t.id}`} cx={cx} cy={cy} r={r}
          stroke={color(t.status)} strokeWidth={stroke} fill="none"
          strokeLinecap="butt"
          strokeDasharray={`${filled} ${circ - filled}`}
          style={{
            strokeDashoffset: offset,
            animation: anim ? `ringDraw 900ms cubic-bezier(0.22,1,0.36,1) ${delay}s both` : 'none'
          }} />);


      })}
    </svg>);

}

function Sparkline({ data, width = 68, height = 22, color = 'var(--text-1)', sw = 1.4 }) {
  if (!data || !data.length) return null;
  const min = Math.min(...data),max = Math.max(...data);
  const pad = 2;
  const w = width - pad * 2,h = height - pad * 2;
  const pts = data.map((v, i) => {
    const x = pad + i / (data.length - 1) * w;
    const y = pad + h - (v - min) / (max - min || 1) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={sw}
      strokeLinecap="round" strokeLinejoin="round" />
      {/* last-point dot */}
      {(() => {
        const last = pts.split(' ').pop().split(',');
        return <circle cx={last[0]} cy={last[1]} r="1.8" fill={color} />;
      })()}
    </svg>);

}

// segmented bar (0..100) composed of 12 bars colored by status thresholds
function SegmentedBar({ value = 50, status = 'ok' }) {
  const n = 12;
  const filled = Math.round(value / 100 * n);
  const col = status === 'ok' ? 'var(--accent)' : status === 'warn' ? 'var(--warn)' : status === 'alert' ? 'var(--alert)' : 'var(--muted)';
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: n }).map((_, i) =>
      <div key={i} style={{
        flex: 1, height: 6, borderRadius: 2,
        background: i < filled ? col : 'var(--bg-3)',
        opacity: i < filled ? 1 : 0.8
      }} />
      )}
    </div>);

}

function StatusDot({ status, size = 8 }) {
  const col = status === 'ok' ? 'var(--accent)' : status === 'warn' ? 'var(--warn)' : status === 'alert' ? 'var(--alert)' : 'var(--muted)';
  return <span style={{
    display: 'inline-block', width: size, height: size, borderRadius: 999,
    background: col, boxShadow: `0 0 0 3px ${col.replace(')', ' / 0.18)')}`
  }} />;
}

function SegmentedControl({ options, value, onChange }) {
  const idx = options.findIndex((o) => o.value === value);
  return (
    <div style={{
      position: 'relative',
      display: 'grid', gridTemplateColumns: `repeat(${options.length}, 1fr)`,
      background: 'var(--bg-2)', padding: 3, borderRadius: 12,
      height: 36
    }}>
      <div
        style={{
          position: 'absolute', top: 3, bottom: 3, left: 3,
          width: `calc((100% - 6px) / ${options.length})`,
          background: 'var(--bg-3)', borderRadius: 9,
          boxShadow: 'inset 0 0.5px 0 oklch(0.42 0.006 240), 0 1px 2px rgba(0,0,0,0.25)',
          transform: `translateX(${idx * 100}%)`,
          transition: 'transform 260ms cubic-bezier(0.32, 0.72, 0, 1)'
        }} />
      
      {options.map((o) =>
      <button key={o.value} onClick={() => onChange(o.value)}
      style={{
        position: 'relative', zIndex: 1,
        background: 'transparent', border: 0, height: '100%',
        color: o.value === value ? 'var(--text-0)' : 'var(--text-2)',
        fontSize: 13, fontWeight: 500, letterSpacing: '-0.01em',
        transition: 'color 160ms'
      }}>
          {o.label}
        </button>
      )}
    </div>);

}

// Tab bar — 5 items with central floating action
function TabBar({ active, onTab, onCore }) {
  const tabs = [
  { id: 'home', label: 'Home', icon: 'Home' },
  { id: 'werte', label: 'Werte', icon: 'Chart' },
  { id: 'core', label: '', icon: 'Core', central: true },
  { id: 'wissen', label: 'Wissen', icon: 'Book' },
  { id: 'set', label: 'Ein.', icon: 'Gear' }];

  return (
    <div style={{
      position: 'absolute', bottom: 18, left: 12, right: 12, zIndex: 40,
      height: 64, borderRadius: 22,
      background: 'oklch(0.19 0.006 240 / 0.78)',
      backdropFilter: 'blur(24px) saturate(180%)',
      WebkitBackdropFilter: 'blur(24px) saturate(180%)',
      border: '0.5px solid var(--line)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.35), 0 0 0 0.5px rgba(255,255,255,0.02)',
      display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
      alignItems: 'center'
    }}>
      {tabs.map((t) => {
        const IconEl = window.Icon[t.icon];
        if (t.central) {
          // Pharmacy-cross shaped FAB — central "+" in a plus/cross silhouette.
          // Kept in the existing dark tonal range (--bg-2/3), not the accent color.
          return (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
              <button onClick={onCore} aria-label="Eintrag hinzufügen" className="tap" data-coach="fab" style={{
                position: 'absolute', top: -30,
                width: 64, height: 64, padding: 0, border: 0, background: 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.5))',
                cursor: 'pointer'
              }}>
                <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                  {/* "stack of cards + plus" — signals a quick-add menu that gathers
                      multiple entry types (labs, symptoms, water, caffeine, …).
                      Soft rounded squircles mirror the rest of the app's radii. */}
                  <rect x="14" y="10" width="36" height="36" rx="10"
                        fill="oklch(0.82 0.003 240)" opacity="0.45" />
                  <rect x="10" y="14" width="36" height="36" rx="10"
                        fill="oklch(0.88 0.003 240)" opacity="0.75" />
                  <rect x="14" y="18" width="36" height="36" rx="11"
                        fill="var(--text-0)" />
                  {/* the + on the topmost card, cut in the dark frame tone */}
                  <rect x="29.5" y="27" width="5" height="18" rx="1.4" fill="var(--bg-0)" />
                  <rect x="23" y="33.5" width="18" height="5" rx="1.4" fill="var(--bg-0)" />
                </svg>
              </button>
            </div>);

        }
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onTab(t.id)} className="tap" style={{
            background: 'transparent', border: 0, height: '100%',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 3,
            color: on ? 'var(--text-0)' : 'var(--text-2)'
          }}>
            <IconEl size={22} color={on ? 'var(--text-0)' : 'var(--text-2)'} />
            <span style={{ fontSize: 10, letterSpacing: '0.02em', fontWeight: 500 }}>{t.label}</span>
          </button>);

      })}
    </div>);

}

// Bottom sheet (unused — screens now use their own Sheet component)
function Sheet({ open, onClose, children, title }) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, pointerEvents: open ? 'auto' : 'none' }}>
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
        opacity: open ? 1 : 0, transition: 'opacity 200ms'
      }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--bg-1)', borderRadius: '28px 28px 0 0',
        padding: '10px 0 34px', maxHeight: '86%', overflowY: 'auto',
        transform: open ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)'
      }}>
        <div style={{ width: 36, height: 4, borderRadius: 4, background: 'var(--bg-3)', margin: '4px auto 12px' }} />
        {title && <div style={{ padding: '0 22px 10px', fontSize: 17, fontWeight: 600 }}>{title}</div>}
        {children}
      </div>
    </div>);

}

function TopicChip({ topic }) {
  const IconEl = window.Icon[topic.icon];
  const col = topic.status === 'ok' ? 'var(--accent)' : topic.status === 'warn' ? 'var(--warn)' : topic.status === 'alert' ? 'var(--alert)' : 'var(--muted)';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '10px 14px', background: 'var(--bg-2)',
      borderRadius: 999, fontSize: 13, color: 'var(--text-1)'
    }}>
      <IconEl size={16} color={col} />
      <span>{topic.label}</span>
      <span className="num" style={{ color: 'var(--text-2)' }}>{topic.score}</span>
    </div>);

}

// HP-style wellness ring: single continuous arc that fills 0→score/100
// with a gradient shifting red → orange → yellow → green → teal as the score rises.
function HPRing({ score = 0, size = 180, stroke = 10, anim = true }) {
  const r = (size - stroke) / 2 - 4;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score)) / 100;
  const filled = circ * pct;

  // Gradient stops tied to the score — colors shift as the bar fills so
  // the ring "feels" like a hit-points bar (low = red, high = teal/green).
  const gradStops = (() => {
    if (score < 40) return [
      { o: '0%',   c: 'oklch(0.70 0.16 28)' },   // deep red
      { o: '100%', c: 'oklch(0.76 0.15 45)' }    // red-orange
    ];
    if (score < 60) return [
      { o: '0%',   c: 'oklch(0.76 0.15 45)' },   // orange
      { o: '100%', c: 'oklch(0.82 0.13 75)' }    // amber
    ];
    if (score < 75) return [
      { o: '0%',   c: 'oklch(0.82 0.13 75)' },   // amber
      { o: '100%', c: 'oklch(0.83 0.16 115)' }   // yellow-green
    ];
    if (score < 90) return [
      { o: '0%',   c: 'oklch(0.83 0.16 115)' },  // yellow-green
      { o: '100%', c: 'oklch(0.78 0.14 155)' }   // green
    ];
    return [
      { o: '0%',   c: 'oklch(0.78 0.14 155)' },  // green
      { o: '100%', c: 'oklch(0.80 0.11 190)' }   // teal
    ];
  })();

  const gradId = `hp-grad-${Math.round(score)}`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          {gradStops.map((s, i) => <stop key={i} offset={s.o} stopColor={s.c} />)}
        </linearGradient>
      </defs>
      {/* track */}
      <circle cx={cx} cy={cy} r={r}
              stroke="oklch(0.24 0.006 240)" strokeWidth={stroke} fill="none" />
      {/* fill */}
      <circle cx={cx} cy={cy} r={r}
              stroke={`url(#${gradId})`} strokeWidth={stroke} fill="none"
              strokeLinecap="round"
              strokeDasharray={`${filled} ${circ - filled}`}
              style={{
                transition: anim ? 'stroke-dasharray 900ms cubic-bezier(0.22,1,0.36,1)' : 'none',
                filter: 'drop-shadow(0 0 6px oklch(0.80 0.10 150 / 0.25))',
              }} />
    </svg>
  );
}

// Faceted mannequin avatar — anatomical proportions, matte white, many short
// polygon edges. A horizontal scan-band in the current HP color travels top→
// bottom on a loop, brushing each face it crosses with that hue.
function BlockyAvatar({ size = 138, scanColor = 'oklch(0.80 0.12 150)' }) {
  const canvasRef = React.useRef(null);
  const rafRef = React.useRef(0);

  // Build a faceted humanoid as a triangle mesh. Parts are tapered
  // "capsule-ish" tubes (head = sphere) approximated with a low-ish number
  // of radial segments + rings so edges land roughly every 5–20% of body
  // height — matches the "many short edges" look the user asked for.
  const mesh = React.useMemo(() => {
    const tris = []; // { a:{x,y,z}, b, c, n }
    const tri = (a, b, c) => {
      // face normal
      const ux = b.x - a.x, uy = b.y - a.y, uz = b.z - a.z;
      const vx = c.x - a.x, vy = c.y - a.y, vz = c.z - a.z;
      let nx = uy * vz - uz * vy;
      let ny = uz * vx - ux * vz;
      let nz = ux * vy - uy * vx;
      const l = Math.hypot(nx, ny, nz) || 1;
      nx /= l; ny /= l; nz /= l;
      tris.push({ a, b, c, n: { x: nx, y: ny, z: nz } });
    };
    // tapered tube between two centres with per-end radii
    const tube = (p0, r0, p1, r1, seg, rings, rzScale = 1) => {
      const ringPts = [];
      for (let i = 0; i <= rings; i++) {
        const t = i / rings;
        const cx = p0[0] + (p1[0] - p0[0]) * t;
        const cy = p0[1] + (p1[1] - p0[1]) * t;
        const cz = p0[2] + (p1[2] - p0[2]) * t;
        const r = r0 + (r1 - r0) * t;
        const row = [];
        for (let j = 0; j < seg; j++) {
          const a = (j / seg) * Math.PI * 2;
          row.push({ x: cx + Math.cos(a) * r, y: cy, z: cz + Math.sin(a) * r * rzScale });
        }
        ringPts.push(row);
      }
      for (let i = 0; i < rings; i++) {
        for (let j = 0; j < seg; j++) {
          const j2 = (j + 1) % seg;
          const a = ringPts[i][j], b = ringPts[i][j2];
          const c = ringPts[i + 1][j2], d = ringPts[i + 1][j];
          tri(a, b, c); tri(a, c, d);
        }
      }
    };
    // UV sphere for head
    const sphere = (cx, cy, cz, r, seg, rings) => {
      const rows = [];
      for (let i = 0; i <= rings; i++) {
        const phi = (i / rings) * Math.PI;
        const y = cy + Math.cos(phi) * r * -1; // y up in world? our y is down, so negate
        const rr = Math.sin(phi) * r;
        const row = [];
        for (let j = 0; j < seg; j++) {
          const th = (j / seg) * Math.PI * 2;
          row.push({ x: cx + Math.cos(th) * rr, y, z: cz + Math.sin(th) * rr });
        }
        rows.push(row);
      }
      for (let i = 0; i < rings; i++) {
        for (let j = 0; j < seg; j++) {
          const j2 = (j + 1) % seg;
          const a = rows[i][j], b = rows[i][j2];
          const c = rows[i + 1][j2], d = rows[i + 1][j];
          tri(a, b, c); tri(a, c, d);
        }
      }
    };

    // Head
    sphere(0, -0.78, 0, 0.20, 10, 8);
    // Neck
    tube([0, -0.60, 0], 0.08, [0, -0.50, 0], 0.10, 8, 2);
    // Torso — shoulders wider, narrows at waist
    tube([0, -0.48, 0], 0.26, [0, -0.10, 0], 0.22, 10, 5, 0.75);
    tube([0, -0.10, 0], 0.22, [0,  0.20, 0], 0.24, 10, 3, 0.75);
    // Arms
    tube([-0.28, -0.44, 0], 0.10, [-0.32,  0.10, 0], 0.075, 8, 5);
    tube([ 0.28, -0.44, 0], 0.10, [ 0.32,  0.10, 0], 0.075, 8, 5);
    // Hips → legs
    tube([-0.12, 0.22, 0], 0.13, [-0.14, 0.95, 0], 0.09, 8, 6, 0.9);
    tube([ 0.12, 0.22, 0], 0.13, [ 0.14, 0.95, 0], 0.09, 8, 6, 0.9);
    return tris;
  }, []);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const loop = (now) => {
      const angle = (now / 9000) * Math.PI * 2; // calm rotation
      const sin = Math.sin(angle), cos = Math.cos(angle);
      const bob = Math.sin(now / 2600) * 0.008;

      // Scan band: linear y position from -1.0 → +1.0 over ~3.2s, loop
      const scanPeriod = 3200;
      const scanT = ((now % scanPeriod) / scanPeriod); // 0..1
      const scanY = -1.0 + scanT * 2.1;                 // world y
      const bandHalf = 0.08;                             // band thickness

      ctx.clearRect(0, 0, size, size);
      const cxp = size / 2, cyp = size / 2;
      const scl = size * 0.45;

      // Project + prepare each triangle
      const projected = [];
      for (const t of mesh) {
        const pa = rotY(t.a, sin, cos, bob);
        const pb = rotY(t.b, sin, cos, bob);
        const pc = rotY(t.c, sin, cos, bob);
        // rotate normal
        const nn = { x: t.n.x * cos + t.n.z * sin, y: t.n.y, z: -t.n.x * sin + t.n.z * cos };
        if (nn.z < -0.02) continue; // back-face cull
        const avgZ = (pa.z + pb.z + pc.z) / 3;
        const avgY = (pa.y + pb.y + pc.y) / 3;
        projected.push({ pa, pb, pc, n: nn, avgZ, avgY });
      }
      projected.sort((a, b) => a.avgZ - b.avgZ);

      const toScreen = (p) => {
        const persp = 1 / (1.7 - p.z * 0.38);
        return { x: cxp + p.x * scl * persp, y: cyp + p.y * scl * persp };
      };

      // Draw
      for (const q of projected) {
        const sa = toScreen(q.pa), sb = toScreen(q.pb), sc = toScreen(q.pc);
        // matte white shading
        const lx = 0.35, ly = -0.55, lz = -0.75;
        const dot = q.n.x * lx + q.n.y * ly + q.n.z * lz;
        const shade = Math.max(0, Math.min(1, 0.62 + dot * 0.38));
        const baseR = 240, baseG = 241, baseB = 244;
        const rr = Math.round(baseR * shade + 18);
        const gg = Math.round(baseG * shade + 18);
        const bb = Math.round(baseB * shade + 18);

        // scan influence: how close is this tri's y to the scan y?
        const dy = Math.abs(q.avgY - scanY);
        const scanInfl = Math.max(0, 1 - dy / bandHalf);

        ctx.beginPath();
        ctx.moveTo(sa.x, sa.y);
        ctx.lineTo(sb.x, sb.y);
        ctx.lineTo(sc.x, sc.y);
        ctx.closePath();
        ctx.fillStyle = `rgb(${rr},${gg},${bb})`;
        ctx.fill();
        if (scanInfl > 0.01) {
          ctx.fillStyle = scanColor;
          ctx.globalAlpha = scanInfl * 0.75;
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = 'rgba(30,32,40,0.45)';
        ctx.stroke();
      }

      // horizontal scan line — subtle glowing rule across the canvas,
      // clipped roughly to the avatar's horizontal extent
      const lineYworld = scanY;
      const fakeP = { x: 0, y: lineYworld, z: 0 };
      const lineS = toScreen(fakeP);
      const grd = ctx.createLinearGradient(0, lineS.y - 1, 0, lineS.y + 1);
      grd.addColorStop(0, 'rgba(255,255,255,0)');
      grd.addColorStop(0.5, scanColor);
      grd.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grd;
      ctx.fillRect(cxp - scl * 0.55, lineS.y - 1, scl * 1.1, 2);

      rafRef.current = requestAnimationFrame(loop);
    };
    function rotY(p, sin, cos, bob) {
      return { x: p.x * cos + p.z * sin, y: p.y + bob, z: -p.x * sin + p.z * cos };
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [mesh, size, scanColor]);

  return (
    <canvas ref={canvasRef}
            width={size} height={size}
            style={{ width: size, height: size, display: 'block' }} />
  );
}

// Legacy alias for any callers still using the old name.
const PointCloudAvatar = BlockyAvatar;

window.UI = { HealthRing, HPRing, BlockyAvatar, PointCloudAvatar, Sparkline, SegmentedBar, StatusDot, SegmentedControl, TabBar, Sheet, TopicChip };
