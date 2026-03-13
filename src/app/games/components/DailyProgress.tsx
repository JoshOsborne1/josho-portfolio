'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ALL_GAME_SLUGS, GAME_LABELS, useAllDailyStatus, type DailyEntry } from './useDaily';

function pad(n: number) { return String(n).padStart(2, '0'); }

function formatCountdown(ms: number) {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { h, m, s, display: `${pad(h)}:${pad(m)}:${pad(s)}` };
}

export function CountdownTimer({ msLeft, className = '', style }: { msLeft: number; className?: string; style?: React.CSSProperties }) {
  const { display } = formatCountdown(msLeft);
  return (
    <span className={`font-mono font-black tabular-nums ${className}`} style={style}>
      {display}
    </span>
  );
}

function GameStatusDot({ slug, entry }: { slug: string; entry: DailyEntry | null }) {
  const done = entry !== null;
  return (
    <Link href={`/games/${slug}`} className="no-underline group">
      <motion.div
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.96 }}
        className="flex flex-col items-center gap-1"
      >
        <div
          className="rounded-xl flex items-center justify-center font-black text-xs transition-all"
          style={{
            width: 40, height: 40,
            background: done
              ? 'linear-gradient(135deg,#86EFAC,#4ADE80)'
              : 'rgba(255,255,255,0.5)',
            border: done
              ? '1.5px solid rgba(74,222,128,0.4)'
              : '1.5px solid rgba(167,139,250,0.2)',
            color: done ? '#166534' : '#94a3b8',
            boxShadow: done
              ? '0 4px 12px rgba(74,222,128,0.25)'
              : '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          {done ? '✓' : GAME_LABELS[slug]?.slice(0, 2) ?? slug.slice(0, 2).toUpperCase()}
        </div>
        <span className="font-bold text-[9px] uppercase tracking-wider text-center leading-tight"
          style={{ color: done ? '#4ADE80' : '#94a3b8', maxWidth: 44 }}>
          {GAME_LABELS[slug]}
        </span>
      </motion.div>
    </Link>
  );
}

/** Compact strip for mobile - shows ring + count + timer */
export function DailyProgressStrip() {
  const { statuses, msLeft, completedCount, totalCount } = useAllDailyStatus();
  const pct = (completedCount / totalCount) * 100;

  return (
    <div className="w-full px-4 py-3" style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(167,139,250,0.12)' }}>
      {/* Progress bar + timer row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-xs" style={{ color: '#A78BFA' }}>
            {completedCount}/{totalCount} today
          </span>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ width: 80, background: 'rgba(167,139,250,0.15)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#C4B5FD,#4ADE80)', width: `${pct}%` }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-bold text-[10px]" style={{ color: '#94a3b8' }}>resets</span>
          <CountdownTimer msLeft={msLeft} className="text-xs" style={{ color: '#A78BFA' } as React.CSSProperties} />
        </div>
      </div>
      {/* Dots row */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {ALL_GAME_SLUGS.map(slug => (
          <GameStatusDot key={slug} slug={slug} entry={statuses[slug] ?? null} />
        ))}
      </div>
    </div>
  );
}

/** Desktop sidebar panel */
export function DailyProgressSidebar() {
  const { statuses, msLeft, completedCount, totalCount } = useAllDailyStatus();
  const pct = (completedCount / totalCount) * 100;

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-2xl sticky top-6"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(167,139,250,0.15)',
        boxShadow: '0 8px 32px rgba(167,139,250,0.08)',
        minWidth: 220,
      }}
    >
      {/* Header */}
      <div>
        <div className="font-black text-sm mb-0.5" style={{ color: '#1e1b4b' }}>Daily Games</div>
        <div className="font-bold text-xs" style={{ color: '#94a3b8' }}>{completedCount} of {totalCount} completed</div>
      </div>

      {/* Countdown */}
      <div
        className="rounded-xl p-3 flex flex-col gap-1"
        style={{ background: 'linear-gradient(135deg,rgba(196,181,253,0.15),rgba(167,139,250,0.1))', border: '1px solid rgba(167,139,250,0.15)' }}
      >
        <div className="font-bold text-[10px] uppercase tracking-widest" style={{ color: '#94a3b8' }}>Resets in</div>
        <CountdownTimer msLeft={msLeft} className="text-2xl" style={{ color: '#A78BFA' } as React.CSSProperties} />
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-[10px] uppercase tracking-widest" style={{ color: '#94a3b8' }}>Progress</span>
          <span className="font-black text-xs" style={{ color: '#A78BFA' }}>{Math.round(pct)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(167,139,250,0.12)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg,#C4B5FD,#4ADE80)' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>

      {/* Game list */}
      <div className="flex flex-col gap-1.5">
        {ALL_GAME_SLUGS.map(slug => {
          const done = statuses[slug] != null;
          return (
            <Link key={slug} href={`/games/${slug}`} className="no-underline">
              <motion.div
                whileHover={{ x: 2 }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl transition-all"
                style={{
                  background: done ? 'rgba(74,222,128,0.08)' : 'rgba(255,255,255,0.5)',
                  border: done ? '1px solid rgba(74,222,128,0.2)' : '1px solid transparent',
                }}
              >
                <div
                  className="flex items-center justify-center rounded-lg font-black text-[10px]"
                  style={{
                    width: 28, height: 28,
                    background: done ? 'linear-gradient(135deg,#86EFAC,#4ADE80)' : 'rgba(167,139,250,0.12)',
                    color: done ? '#166534' : '#94a3b8',
                    flexShrink: 0,
                  }}
                >
                  {done ? '✓' : '→'}
                </div>
                <span className="font-bold text-xs" style={{ color: done ? '#166534' : '#475569' }}>
                  {GAME_LABELS[slug]}
                </span>
                {done && (
                  <span className="ml-auto font-bold text-[10px]" style={{ color: '#86EFAC' }}>done</span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
