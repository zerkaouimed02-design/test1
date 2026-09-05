import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Target, CheckCircle2, Flame } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface NavbarHeaderProps {
  onOpenCheckIn: () => void;
  onOpenTests: () => void;
  onOpenGoals: () => void;
  overallLevel: number;
  streak: number;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  onOpenCheckIn,
  onOpenTests,
  onOpenGoals,
  overallLevel,
  streak,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    soundManager.setMuted(!isMuted);
    setIsMuted(!isMuted);
    if (isMuted) {
      soundManager.playHapticTap();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#050507]/90 backdrop-blur-xl border-b border-white/5 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Brand & Level */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] border-2 border-white/10 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white font-sans">Ascend</h1>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#3B82F6]/15 text-[#38BDF8] border border-[#3B82F6]/30">
                LVL {overallLevel}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                Web Edition
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
              <span>{streak}-Day Consistency</span>
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400 inline" />
            </p>
          </div>
        </div>

        {/* Quick Tools & Toggles */}
        <div className="flex items-center gap-2">
          {/* Targets & Goals */}
          <button
            id="header-goals-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenGoals();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            title="Configure Targets & Goals"
          >
            <Target className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden md:inline">Goals</span>
          </button>

          {/* Daily Check In Pill */}
          <button
            id="header-daily-checkin-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenCheckIn();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all active:scale-95"
            title="Rapid 30-Second Morning Check-In"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Check-In</span>
          </button>

          {/* System Integrity / Test Suite */}
          <button
            id="header-test-suite-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenTests();
            }}
            className="p-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title="Run System Integrity Diagnostics"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </button>

          {/* Sound Toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={toggleMute}
            className="p-2 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title={isMuted ? 'Unmute Audio Feedback' : 'Mute Audio Feedback'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-zinc-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
