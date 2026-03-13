'use client';

import { useState, useEffect, useCallback } from 'react';

export const ALL_GAME_SLUGS = [
  'word','sudoku','2048','trivia','memory','wordchain','math','crossword','wordscramble','wave',
  'flagle','worldle','globle','travle'
];

export const GAME_LABELS: Record<string, string> = {
  word: 'Word Guess',
  sudoku: 'Sudoku',
  '2048': '2048',
  trivia: 'Trivia',
  memory: 'Memory',
  wordchain: 'Word Chain',
  math: 'Math',
  crossword: 'Crossword',
  wordscramble: 'Scramble',
  wave: 'Wave',
  flagle: 'Flagle',
  worldle: 'Worldle',
  globle: 'Globle',
  travle: 'Travle',
};

export type DailyEntry = {
  date: string;           // YYYY-MM-DD UTC
  completedAt: number;    // epoch ms
  snapshot?: unknown;     // game-specific completion data
};

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

export function msUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1
  ));
  return Math.max(0, midnight.getTime() - now.getTime());
}

export function hoursUntilMidnightUTC(): number {
  return Math.ceil(msUntilMidnightUTC() / 3600000);
}

function entryKey(gameId: string) { return `daily-game-${gameId}`; }

function readEntry(gameId: string): DailyEntry | null {
  try {
    const raw = localStorage.getItem(entryKey(gameId));
    if (!raw) return null;
    // Legacy: plain date string
    if (!raw.startsWith('{')) {
      return raw === todayUTC() ? { date: raw, completedAt: 0 } : null;
    }
    const entry: DailyEntry = JSON.parse(raw);
    return entry.date === todayUTC() ? entry : null;
  } catch { return null; }
}

export function useDaily(gameId: string) {
  const [entry, setEntry] = useState<DailyEntry | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setEntry(readEntry(gameId));
    setReady(true);
  }, [gameId]);

  const markPlayed = useCallback((snapshot?: unknown) => {
    try {
      const e: DailyEntry = { date: todayUTC(), completedAt: Date.now(), snapshot };
      localStorage.setItem(entryKey(gameId), JSON.stringify(e));
      setEntry(e);
    } catch { /* localStorage unavailable */ }
  }, [gameId]);

  const canPlay = ready ? entry === null : true;
  const completionEntry = entry;

  return {
    canPlay,
    markPlayed,
    hoursUntilReset: hoursUntilMidnightUTC(),
    completionEntry,
    ready,
  };
}

/** Read all daily statuses for the hub without a gameId dependency */
export function useAllDailyStatus() {
  const [statuses, setStatuses] = useState<Record<string, DailyEntry | null>>({});
  const [msLeft, setMsLeft] = useState(0);

  useEffect(() => {
    const load = () => {
      const s: Record<string, DailyEntry | null> = {};
      for (const slug of ALL_GAME_SLUGS) s[slug] = readEntry(slug);
      setStatuses(s);
      setMsLeft(msUntilMidnightUTC());
    };
    load();
    const interval = setInterval(load, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Live countdown - ticks every second
  useEffect(() => {
    const tick = setInterval(() => setMsLeft(msUntilMidnightUTC()), 1000);
    return () => clearInterval(tick);
  }, []);

  const completedCount = Object.values(statuses).filter(Boolean).length;
  const totalCount = ALL_GAME_SLUGS.length;

  return { statuses, msLeft, completedCount, totalCount };
}
