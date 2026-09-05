import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Code2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface NavbarHeaderProps {
  onOpenCheckIn: () => void;
  onOpenTests: () => void;
  onOpenSwiftCode: () => void;
  overallLevel: number;
  streak: number;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  onOpenCheckIn,
  onOpenTests,
  onOpenSwiftCode,
  overallLevel,
  streak,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const toggleMute = () => {
    soundManager.setMuted(!isMuted);
    setIsMuted(!isMuted);
    if (isMuted) {
      soundManager.playHapticTap();
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#050507]/90 backdrop-blur-xl border-b border-white/5 px-4 pt-2 pb-3">
      {/* iOS Status Bar */}
      <div className="flex items-center justify-between text-xs text-[#A1A1AA] font-medium px-1 mb-2 select-none">
        <span className="font-semibold text-white tracking-tight text-[13px]">{currentTime}</span>
        <div className="flex items-center gap-1.5 text-[#A1A1AA]">
          <span className="text-[10px] font-mono tracking-wider font-semibold bg-[#18181B] text-[#38BDF8] px-1.5 py-0.5 rounded-md border border-white/10">
            NATIVE iOS 18
          </span>
          <div className="w-5 h-2.5 rounded-sm border border-[#A1A1AA]/60 p-0.5 flex items-center">
            <div className="h-full w-4/5 bg-white rounded-2xs" />
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] border-2 border-white/10 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.35)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold tracking-tight text-white font-sans">Ascend</h1>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#3B82F6]/15 text-[#38BDF8] border border-[#3B82F6]/30">
                LVL {overallLevel}
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
              <span>{streak}-Day Consistency</span>
              <span className="text-orange-400">🔥</span>
            </p>
          </div>
        </div>

        {/* Quick Tools & Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Daily Check In Pill */}
          <button
            id="header-daily-checkin-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenCheckIn();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-semibold shadow-[0_0_12px_rgba(59,130,246,0.4)] transition-all active:scale-95"
            title="Rapid 30-Second Morning Check-In"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Check-In</span>
          </button>

          {/* Swift Code Inspector */}
          <button
            id="header-swift-inspector-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenSwiftCode();
            }}
            className="p-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title="Inspect Native Swift & SwiftData Source Code"
          >
            <Code2 className="w-4 h-4 text-[#38BDF8]" />
          </button>

          {/* Automated Tests Runner */}
          <button
            id="header-test-suite-btn"
            onClick={() => {
              soundManager.playHapticTap();
              onOpenTests();
            }}
            className="p-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title="Run Unit Tests Suite"
          >
            <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
          </button>

          {/* Sound Toggle */}
          <button
            id="header-sound-toggle-btn"
            onClick={toggleMute}
            className="p-1.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
            title={isMuted ? 'Unmute iOS Haptics & Audio' : 'Mute iOS Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
