'use client';

import { useState, useEffect } from 'react';

function todayUTC(): string {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD UTC
}

function hoursUntilMidnightUTC(): number {
  const now = new Date();
  const midnight = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
  return Math.ceil((midnight.getTime() - now.getTime()) / 3600000);
}

export function useDaily(gameId: string) {
  const key = `daily-game-${gameId}`;
  const [canPlay, setCanPlay] = useState(true);
  const [hoursUntilReset, setHoursUntilReset] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      const today = todayUTC();
      if (stored === today) {
        setCanPlay(false);
        setHoursUntilReset(hoursUntilMidnightUTC());
      } else {
        setCanPlay(true);
      }
    } catch {
      setCanPlay(true);
    }
  }, [key]);

  const markPlayed = () => {
    try {
      localStorage.setItem(key, todayUTC());
      setCanPlay(false);
      setHoursUntilReset(hoursUntilMidnightUTC());
    } catch {
      // localStorage unavailable - allow play
    }
  };

  return { canPlay, markPlayed, hoursUntilReset };
}
