/**
 * josho.pro — Daily Streak System
 * Shared across all 9 games.
 * Storage key: josho_streak → {lastPlayed: "YYYY-MM-DD", count: number}
 * 
 * Usage: call streakSystem.onGameComplete() after any game completion event.
 *        Badge auto-mounts to document.body on DOMContentLoaded.
 */

(function () {
  'use strict';

  const STREAK_KEY = 'josho_streak';

  function getTodayStr() {
    return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

  function getStreak() {
    try {
      return JSON.parse(localStorage.getItem(STREAK_KEY)) || { lastPlayed: null, count: 0 };
    } catch { return { lastPlayed: null, count: 0 }; }
  }

  function saveStreak(data) {
    try { localStorage.setItem(STREAK_KEY, JSON.stringify(data)); } catch {}
  }

  function computeUpdatedStreak() {
    const today = getTodayStr();
    const streak = getStreak();

    if (!streak.lastPlayed) {
      return { lastPlayed: today, count: 1 };
    }

    const last = new Date(streak.lastPlayed);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / 86400000);

    if (diffDays === 0) {
      // Already played today — no increment
      return streak;
    } else if (diffDays === 1) {
      // Consecutive day — increment
      return { lastPlayed: today, count: streak.count + 1 };
    } else {
      // Streak broken — reset
      return { lastPlayed: today, count: 1 };
    }
  }

  function onGameComplete() {
    const updated = computeUpdatedStreak();
    saveStreak(updated);
    updateBadge(updated.count);
    return updated;
  }

  function createBadge() {
    const badge = document.createElement('div');
    badge.id = 'josho-streak-badge';
    badge.setAttribute('aria-label', 'Daily streak');
    badge.style.cssText = [
      'position: fixed',
      'bottom: 16px',
      'right: 16px',
      'background: rgba(12,12,12,0.92)',
      'backdrop-filter: blur(8px)',
      '-webkit-backdrop-filter: blur(8px)',
      'border: 1px solid rgba(255,255,255,0.1)',
      'border-radius: 20px',
      'padding: 6px 12px',
      'font-family: -apple-system, BlinkMacSystemFont, Inter, sans-serif',
      'font-size: 13px',
      'font-weight: 600',
      'color: #e8e8e8',
      'display: flex',
      'align-items: center',
      'gap: 5px',
      'z-index: 9999',
      'pointer-events: none',
      'opacity: 0',
      'transition: opacity 0.3s ease',
      'will-change: opacity',
    ].join(';');
    return badge;
  }

  function updateBadge(count) {
    let badge = document.getElementById('josho-streak-badge');
    if (!badge) {
      badge = createBadge();
      document.body.appendChild(badge);
    }

    if (count <= 0) {
      badge.style.opacity = '0';
      return;
    }

    // Colour scale: 1-2 white, 3-6 amber, 7-13 orange, 14+ red flame
    let flame = '🔥';
    let color = '#e8e8e8';
    if (count >= 14) { color = '#ff6b35'; }
    else if (count >= 7) { color = '#ff9500'; }
    else if (count >= 3) { color = '#ffcc00'; }

    badge.style.color = color;
    badge.innerHTML = `${flame} <span>${count} day streak</span>`;
    badge.style.opacity = '1';

    // Auto-hide after 4 seconds
    clearTimeout(badge._hideTimer);
    badge._hideTimer = setTimeout(() => { badge.style.opacity = '0'; }, 4000);
  }

  function init() {
    // Show current streak on load (if active today)
    const streak = getStreak();
    const today = getTodayStr();
    if (streak.lastPlayed === today && streak.count > 0) {
      updateBadge(streak.count);
    }
  }

  window.streakSystem = { onGameComplete, getStreak, updateBadge };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
