import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, ArrowUpRight, Check } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface LevelUpCelebrationModalProps {
  newLevel: number;
  newTitle: string;
  category: string;
  badge: string;
  onClose: () => void;
}

export const LevelUpCelebrationModal: React.FC<LevelUpCelebrationModalProps> = ({
  newLevel,
  newTitle,
  category,
  badge,
  onClose,
}) => {
  useEffect(() => {
    soundManager.playLevelUpFanfare();
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#121214] via-[#121214] to-[#18181B] border border-[#3B82F6]/50 rounded-[32px] p-6 text-center space-y-4 shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#8B5CF6] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(59,130,246,0.5)] text-3xl">
          {badge}
        </div>

        <div>
          <span className="text-xs uppercase font-bold text-[#60A5FA] tracking-widest">
            {category.toUpperCase()} PROGRESSION
          </span>
          <h2 className="text-2xl font-black text-white tracking-tight mt-1">
            LEVEL {newLevel} UNLOCKED!
          </h2>
          <p className="text-sm font-bold text-white mt-1">Title: {newTitle}</p>
        </div>

        <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
          Your compound consistency has leveled up your real-life attribute. The progression ladder advances.
        </p>

        <button
          onClick={() => {
            soundManager.playHapticTap();
            onClose();
          }}
          className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim XP & Continue Ascent</span>
        </button>
      </div>
    </div>
  );
};
