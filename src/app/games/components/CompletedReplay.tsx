'use client';

import Link from 'next/link';
import { type DailyEntry } from './useDaily';

interface CompletedReplayProps {
  gameTitle: string;
  gameSlug: string;
  completionEntry: DailyEntry;
  hoursUntilReset: number;
  children?: React.ReactNode; // optional custom replay content
}

export function CompletedReplay({ gameTitle, gameSlug, completionEntry, hoursUntilReset, children }: CompletedReplayProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const snap = completionEntry.snapshot as any;
  const completedAt = completionEntry.completedAt
    ? new Date(completionEntry.completedAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(135deg,#F0EBFF,#E8F4FF,#F0FFF8)", fontFamily: '-apple-system,sans-serif' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <Link href="/games" className="no-underline flex items-center gap-2">
          <div style={{ width:32,height:32,background:"linear-gradient(135deg,#C4B5FD,#A78BFA)",borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:900,fontSize:14 }}>P</div>
          <span className="font-black text-xs" style={{ color:"#A78BFA" }}>PLAY</span>
        </Link>
        <span className="font-black text-base" style={{ color:"#1e1b4b" }}>{gameTitle}</span>
        <div />
      </div>

      {/* Completion card */}
      <div className="flex flex-col items-center gap-5 pt-8 px-6 max-w-sm mx-auto w-full">
        <div className="w-full rounded-[28px] p-6 flex flex-col items-center gap-4"
          style={{ background:"rgba(255,255,255,0.75)", backdropFilter:"blur(24px)", border:"1px solid rgba(255,255,255,0.9)", boxShadow:"0 16px 48px rgba(167,139,250,0.12)" }}>
          <div className="rounded-full flex items-center justify-center font-black text-2xl"
            style={{ width:64,height:64,background:"linear-gradient(135deg,#86EFAC,#4ADE80)",boxShadow:"0 8px 20px rgba(74,222,128,0.3)",color:"#166534" }}>
            ✓
          </div>
          <div className="font-black text-xl" style={{ color:"#1e1b4b" }}>Already played today</div>
          {completedAt && (
            <div className="font-bold text-sm" style={{ color:"#94a3b8" }}>Completed at {completedAt}</div>
          )}

          {/* Game-specific result summary */}
          {snap?.score !== undefined && (
            <div className="flex gap-4">
              <div className="text-center px-4 py-3 rounded-2xl" style={{ background:"rgba(167,139,250,0.08)" }}>
                <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>{snap.score}</div>
                <div className="font-bold text-[10px] uppercase tracking-widest" style={{ color:"#94a3b8" }}>Score</div>
              </div>
              {snap?.time !== undefined && (
                <div className="text-center px-4 py-3 rounded-2xl" style={{ background:"rgba(167,139,250,0.08)" }}>
                  <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>{snap.time}</div>
                  <div className="font-bold text-[10px] uppercase tracking-widest" style={{ color:"#94a3b8" }}>Time</div>
                </div>
              )}
              {snap?.streak !== undefined && snap.streak > 0 && (
                <div className="text-center px-4 py-3 rounded-2xl" style={{ background:"rgba(167,139,250,0.08)" }}>
                  <div className="font-black text-3xl" style={{ color:"#A78BFA" }}>{snap.streak}</div>
                  <div className="font-bold text-[10px] uppercase tracking-widest" style={{ color:"#94a3b8" }}>Streak</div>
                </div>
              )}
            </div>
          )}

          {/* Custom replay content slot */}
          {children}

          <div className="font-bold text-xs" style={{ color:"#94a3b8" }}>Next reset in {hoursUntilReset}h</div>
        </div>

        <Link href="/games" className="px-6 py-3 rounded-2xl font-black text-white no-underline w-full text-center"
          style={{ background:"linear-gradient(180deg,#C4B5FD,#A78BFA)",boxShadow:"0 8px 20px rgba(167,139,250,0.3)" }}>
          Back to games
        </Link>
      </div>
    </div>
  );
}
