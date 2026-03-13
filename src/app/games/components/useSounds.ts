'use client';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration / 1000);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration / 1000);
  } catch {
    // Audio unavailable
  }
}

export function useSounds() {
  const playTap = () => playTone(440, 50, 'sine', 0.15);

  const playSuccess = () => {
    playTone(523, 120, 'sine', 0.25);
    setTimeout(() => playTone(659, 120, 'sine', 0.25), 130);
  };

  const playError = () => {
    playTone(300, 100, 'square', 0.2);
    setTimeout(() => playTone(200, 150, 'square', 0.2), 110);
  };

  const playWin = () => {
    playTone(523, 100, 'sine', 0.3);
    setTimeout(() => playTone(659, 100, 'sine', 0.3), 110);
    setTimeout(() => playTone(784, 100, 'sine', 0.3), 220);
    setTimeout(() => playTone(1047, 250, 'sine', 0.3), 330);
  };

  const playFlip = () => playTone(350, 80, 'triangle', 0.2);

  const vibrate = (pattern: number[]) => {
    try {
      navigator.vibrate?.(pattern);
    } catch {
      // vibrate unavailable
    }
  };

  return { playTap, playSuccess, playError, playWin, playFlip, vibrate };
}
