'use client';

import { motion } from 'motion/react';
import { ArrowRight, Heart, Activity, Droplets, Moon, Plus } from 'lucide-react';
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

const vitals = [
  {
    label: 'Resting HR',
    value: '62',
    unit: 'bpm',
    icon: Heart,
    trend: '-3 vs 7d',
  },
  {
    label: 'Steps',
    value: '8,412',
    unit: 'today',
    icon: Activity,
    trend: '+12%',
  },
  {
    label: 'Hydration',
    value: '1.9',
    unit: 'L',
    icon: Droplets,
    trend: 'on track',
  },
  {
    label: 'Sleep',
    value: '7h 24m',
    unit: 'last night',
    icon: Moon,
    trend: '+28m',
  },
];

export default function Page() {
  return (
    <main className='mx-auto flex min-h-screen max-w-md flex-col gap-8 px-5 pb-24 pt-10'>
      <header className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <div className='flex h-9 w-9 items-center justify-center rounded-xl bg-vital-600 text-white'>
            <Heart className='h-5 w-5' fill='currentColor' />
          </div>
          <div>
            <p className='text-xs uppercase tracking-widest text-zinc-500'>
              VitalUpgrade
            </p>
            <p className='text-sm font-semibold'>Good morning, Luca</p>
          </div>
        </div>
        <QuickAddPopover />
      </header>

      <section className='rounded-3xl bg-gradient-to-br from-vital-600 to-emerald-700 p-6 text-white shadow-lg'>
        <p className='text-sm/6 opacity-90'>Vitality score</p>
        <div className='mt-1 flex items-end gap-2'>
          <span className='text-5xl font-semibold tracking-tight'>82</span>
          <span className='pb-2 text-sm opacity-80'>/ 100</span>
        </div>
        <p className='mt-3 text-sm/6 opacity-90'>
          Better than 74% of your last 30 days. Nudge: a 10-minute walk now
          keeps your streak alive.
        </p>
        <button className='mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-medium backdrop-blur transition hover:bg-white/25'>
          See breakdown <ArrowRight className='h-4 w-4' />
        </button>
      </section>

      <section>
        <h2 className='mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500'>
          Today
        </h2>
        <div className='grid grid-cols-2 gap-3'>
          {vitals.map((v) => (
            <motion.div
              key={v.label}
              whileTap={{ scale: 0.97 }}
              className='rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900'
            >
              <div className='flex items-center justify-between'>
                <v.icon className='h-4 w-4 text-vital-600' />
                <span className='text-[10px] font-medium uppercase tracking-wider text-zinc-500'>
                  {v.trend}
                </span>
              </div>
              <p className='mt-3 text-2xl font-semibold tabular-nums'>
                {v.value}
              </p>
              <p className='text-xs text-zinc-500'>
                {v.unit} · {v.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className='rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900'>
        <h2 className='text-sm font-semibold'>Next check-in</h2>
        <p className='mt-1 text-sm text-zinc-500'>
          Log your hydration at 15:00 to close today&apos;s loop.
        </p>
        <div className='mt-4 flex items-center justify-between'>
          <span className='text-xs text-zinc-500'>in 2h 14m</span>
          <button className='rounded-full bg-zinc-950 px-3 py-1.5 text-xs font-medium text-white dark:bg-white dark:text-zinc-950'>
            Remind me
          </button>
        </div>
      </section>

      <footer className='mt-auto text-center text-xs text-zinc-400'>
        v0.1 · built with Claude Code
      </footer>
    </main>
  );
}

function QuickAddPopover() {
  return (
    <MorphingPopover
      variants={popoverVariants}
      transition={{ type: 'spring', bounce: 0.15, duration: 0.45 }}
    >
      <MorphingPopoverTrigger className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-950 text-white shadow-md dark:bg-white dark:text-zinc-950'>
        <motion.span layout className='flex items-center justify-center'>
          <Plus className='h-5 w-5' />
        </motion.span>
      </MorphingPopoverTrigger>
      <MorphingPopoverContent className='right-0 top-0 w-64 rounded-2xl bg-white p-4 dark:bg-zinc-900'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-semibold'>Log a vital</p>
          <kbd className='rounded bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500 dark:bg-zinc-800'>
            Esc
          </kbd>
        </div>
        <div className='mt-3 grid grid-cols-2 gap-2'>
          <QuickAction icon={Heart} label='Heart rate' />
          <QuickAction icon={Droplets} label='Water' />
          <QuickAction icon={Activity} label='Workout' />
          <QuickAction icon={Moon} label='Sleep' />
        </div>
      </MorphingPopoverContent>
    </MorphingPopover>
  );
}

function QuickAction({
  icon: Icon,
  label,
}: {
  icon: typeof Heart;
  label: string;
}) {
  return (
    <button className='flex flex-col items-start gap-2 rounded-xl border border-zinc-200 p-3 text-left text-sm transition hover:border-vital-500 hover:bg-vital-50 dark:border-zinc-800 dark:hover:border-vital-500 dark:hover:bg-vital-600/10'>
      <Icon className='h-4 w-4 text-vital-600' />
      <span className='text-xs font-medium'>{label}</span>
    </button>
  );
}
