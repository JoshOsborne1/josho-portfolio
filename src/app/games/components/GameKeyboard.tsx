'use client';

import React from 'react';

type LetterState = 'correct' | 'present' | 'absent' | 'unused';

interface GameKeyboardProps {
  onKey: (key: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  letterStates?: Record<string, LetterState>;
}

const ROWS = [
  ['Q','W','E','R','T','Y','U','I','O','P'],
  ['A','S','D','F','G','H','J','K','L'],
  ['Z','X','C','V','B','N','M'],
];

function stateColor(state?: LetterState): string {
  switch (state) {
    case 'correct': return 'bg-green-600 text-white border-green-500';
    case 'present': return 'bg-amber-500 text-white border-amber-400';
    case 'absent': return 'bg-zinc-700 text-zinc-400 border-zinc-600';
    default: return 'bg-zinc-800 text-white border-zinc-600 hover:bg-zinc-700';
  }
}

export function GameKeyboard({ onKey, onDelete, onEnter, letterStates = {} }: GameKeyboardProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-full select-none px-1 pb-2">
      {ROWS.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center">
          {ri === 2 && (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onEnter(); }}
              className="px-2 py-3 rounded text-xs font-bold bg-zinc-700 text-white border border-zinc-600 hover:bg-zinc-600 min-w-[44px]"
            >
              ENTER
            </button>
          )}
          {row.map((letter) => (
            <button
              key={letter}
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onKey(letter); }}
              className={`w-8 py-3 rounded text-sm font-bold border transition-colors ${stateColor(letterStates[letter])}`}
            >
              {letter}
            </button>
          ))}
          {ri === 2 && (
            <button
              type="button"
              onPointerDown={(e) => { e.preventDefault(); onDelete(); }}
              className="px-2 py-3 rounded text-xs font-bold bg-zinc-700 text-white border border-zinc-600 hover:bg-zinc-600 min-w-[44px]"
            >
              DEL
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
