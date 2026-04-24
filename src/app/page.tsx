'use client';

import { motion } from 'motion/react';
import {
  MorphingPopover,
  MorphingPopoverContent,
  MorphingPopoverTrigger,
} from '@/components/ui/morphing-popover';

const popoverVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const PROTOTYPE_HREF = `${BASE_PATH}/prototype/VITAL.html`;

const screens = [
  { id: '01', label: 'Home', desc: 'Score · Fokus · Heute eintragen' },
  { id: '02', label: 'Werte', desc: 'Labor · Körper · Verhalten' },
  { id: '03', label: 'Wissen', desc: 'Regeln · Quellen · Quiz' },
  { id: '04', label: 'Einstellungen', desc: 'Profil · Export · Tweaks' },
];

const quickEntries = [
  { key: 'water', label: 'Wasser', unit: 'L' },
  { key: 'caffeine', label: 'Koffein', unit: 'mg' },
  { key: 'sleep', label: 'Schlaf', unit: 'h' },
  { key: 'sport', label: 'Sport', unit: 'min' },
];

export default function Page() {
  return (
    <main
      className='mx-auto flex min-h-screen w-full max-w-md flex-col gap-7 px-5 pb-28 pt-12'
      style={{ background: 'var(--bg-0)' }}
    >
      <Header />

      <Hero />

      <section>
        <div className='mb-3 flex items-center justify-between'>
          <span className='eyebrow'>Screens im Prototyp</span>
          <a
            href={PROTOTYPE_HREF}
            className='text-xs'
            style={{ color: 'var(--accent)' }}
          >
            Öffnen →
          </a>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          {screens.map((s) => (
            <motion.div
              key={s.id}
              whileTap={{ scale: 0.97 }}
              className='tap rounded-2xl p-4'
              style={{
                background: 'var(--bg-1)',
                border: '0.5px solid var(--line-soft)',
              }}
            >
              <span className='eyebrow num'>{s.id}</span>
              <div className='mt-3 text-[15px] font-medium'>{s.label}</div>
              <div
                className='mt-1 text-[11px]'
                style={{ color: 'var(--text-2)' }}
              >
                {s.desc}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section>
        <div className='mb-3 flex items-center justify-between'>
          <span className='eyebrow'>Heute eintragen</span>
          <QuickAddPopover />
        </div>
        <div
          className='rounded-2xl p-4'
          style={{
            background: 'var(--bg-1)',
            border: '0.5px solid var(--line-soft)',
          }}
        >
          <div className='grid grid-cols-4 gap-2'>
            {quickEntries.map((q) => (
              <div
                key={q.key}
                className='flex flex-col items-center gap-1 rounded-xl py-3'
                style={{ background: 'var(--bg-2)' }}
              >
                <span className='num text-[15px] font-medium'>—</span>
                <span
                  className='text-[10px]'
                  style={{ color: 'var(--text-2)' }}
                >
                  {q.label}
                </span>
              </div>
            ))}
          </div>
          <p
            className='mt-3 text-[11px] leading-relaxed'
            style={{ color: 'var(--text-2)' }}
          >
            Prototyp-Daten werden im Browser (localStorage) gehalten. Im
            Prototyp: Demo-Daten laden unter 04 Einstellungen.
          </p>
        </div>
      </section>

      <section
        className='rounded-2xl p-5'
        style={{
          background: 'var(--bg-1)',
          border: '0.5px solid var(--line-soft)',
        }}
      >
        <span className='eyebrow'>Design-System</span>
        <h3 className='mt-2 text-[17px] font-semibold tracking-tight'>
          Swiss-Grid · dunkel-first · eine warme Akzentfarbe
        </h3>
        <p
          className='mt-2 text-[13px] leading-relaxed'
          style={{ color: 'var(--text-1)' }}
        >
          Zahlen und Typografie tragen die Kommunikation. Kein Glow, kein Neon,
          kein Purple-AI-Look. Grafik unterstützt das Verständnis, nicht die
          Dekoration.
        </p>
        <div className='mt-4 flex gap-2'>
          <Swatch label='bg-0' color='var(--bg-0)' />
          <Swatch label='bg-1' color='var(--bg-1)' />
          <Swatch label='bg-2' color='var(--bg-2)' />
          <Swatch label='accent' color='var(--accent)' />
          <Swatch label='warn' color='var(--warn)' />
          <Swatch label='alert' color='var(--alert)' />
        </div>
      </section>

      <footer
        className='mt-auto pt-6 text-center text-[11px]'
        style={{ color: 'var(--text-3)' }}
      >
        VITAL · Prototyp → Produktion · built with Claude Code
      </footer>
    </main>
  );
}

function Header() {
  return (
    <header className='flex items-center justify-between'>
      <div className='flex items-center gap-3'>
        <VitalLogo />
        <div>
          <p className='eyebrow'>VITAL</p>
          <p className='text-[13px]' style={{ color: 'var(--text-1)' }}>
            Mobile-first Health Companion
          </p>
        </div>
      </div>
      <a
        href={PROTOTYPE_HREF}
        className='tap rounded-full px-3 py-1.5 text-[12px] font-medium'
        style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
      >
        Prototyp öffnen
      </a>
    </header>
  );
}

function VitalLogo() {
  return (
    <svg viewBox='0 0 100 100' width={36} height={36} aria-hidden>
      <rect width='100' height='100' rx='18' fill='var(--bg-1)' />
      <circle
        cx='50'
        cy='50'
        r='26'
        fill='none'
        stroke='var(--accent)'
        strokeWidth='3'
      />
      <circle cx='50' cy='50' r='14' fill='var(--accent-dim)' />
      <path
        d='M24 50h8l4-9 6 18 4-12 4 6h16'
        fill='none'
        stroke='var(--accent)'
        strokeWidth='2.2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function Hero() {
  return (
    <section
      className='relative overflow-hidden rounded-3xl p-6'
      style={{
        background: 'var(--bg-1)',
        border: '0.5px solid var(--line-soft)',
      }}
    >
      <div
        className='absolute left-0 top-0 h-full w-[3px]'
        style={{ background: 'var(--accent)' }}
      />
      <span className='eyebrow'>Im Blick</span>
      <h1
        className='mt-2 text-[28px] font-semibold leading-[1.1] tracking-tight'
        style={{ textWrap: 'balance' as const }}
      >
        Guten Morgen,{' '}
        <span style={{ color: 'var(--accent)' }}>du</span>.
      </h1>
      <p
        className='mt-3 text-[13px] leading-relaxed'
        style={{ color: 'var(--text-1)' }}
      >
        Der VITAL-Prototyp liegt unter{' '}
        <code
          className='mono rounded px-1.5 py-0.5 text-[11px]'
          style={{ background: 'var(--bg-2)', color: 'var(--text-0)' }}
        >
          {PROTOTYPE_HREF}
        </code>
        . Diese Next.js-App ist die Produktions-Hülle — beginnend mit dem
        gemeinsamen Design-System.
      </p>
      <div className='mt-4 flex items-center gap-3'>
        <span className='num text-[40px] font-semibold leading-none tracking-tight'>
          82
        </span>
        <div>
          <div className='eyebrow'>Well.</div>
          <div
            className='text-[11px]'
            style={{ color: 'var(--text-2)' }}
          >
            Demo-Score (Prototyp)
          </div>
        </div>
      </div>
    </section>
  );
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div className='flex flex-1 flex-col items-stretch gap-1'>
      <div
        className='h-10 rounded-lg'
        style={{ background: color, border: '0.5px solid var(--line-soft)' }}
      />
      <span
        className='eyebrow text-[9px]'
        style={{ color: 'var(--text-2)' }}
      >
        {label}
      </span>
    </div>
  );
}

function QuickAddPopover() {
  return (
    <MorphingPopover
      variants={popoverVariants}
      transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
    >
      <MorphingPopoverTrigger
        className='tap rounded-full px-3 py-1.5 text-[12px] font-medium'
        style={{ background: 'var(--accent)', color: 'var(--accent-ink)' }}
      >
        + Eintrag
      </MorphingPopoverTrigger>
      <MorphingPopoverContent
        className='right-0 top-8 w-64 rounded-2xl p-3'
        style={{
          background: 'var(--bg-1)',
          border: '0.5px solid var(--line-soft)',
          color: 'var(--text-0)',
        }}
      >
        <div className='flex items-center justify-between'>
          <p className='eyebrow'>Schnell-Eintrag</p>
          <kbd
            className='mono rounded px-1.5 py-0.5 text-[10px]'
            style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}
          >
            Esc
          </kbd>
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2'>
          {quickEntries.map((q) => (
            <button
              key={q.key}
              className='tap flex flex-col items-start gap-1 rounded-xl p-3 text-left'
              style={{
                background: 'var(--bg-2)',
                color: 'var(--text-0)',
              }}
            >
              <span className='text-[12px] font-medium'>{q.label}</span>
              <span
                className='text-[10px]'
                style={{ color: 'var(--text-2)' }}
              >
                Einheit · {q.unit}
              </span>
            </button>
          ))}
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}
