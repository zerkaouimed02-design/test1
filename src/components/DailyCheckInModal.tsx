import React, { useState } from 'react';
import { X, Sparkles, Check, Flame, Moon, Dumbbell, Brain } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface DailyCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteCheckIn: (plan: {
    readiness: number;
    recommendedExercise: string;
    recommendedFocusMinutes: number;
    tip: string;
  }) => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  isOpen,
  onClose,
  onCompleteCheckIn,
}) => {
  const [wakeFeeling, setWakeFeeling] = useState<number>(4);
  const [exerciseIntent, setExerciseIntent] = useState<'yes' | 'rest' | 'light'>('yes');
  const [targetFocusHours, setTargetFocusHours] = useState<number>(3);
  const [readinessScore, setReadinessScore] = useState<number>(4);
  const [isGenerated, setIsGenerated] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{
    readiness: number;
    recommendedExercise: string;
    recommendedFocusMinutes: number;
    tip: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = () => {
    soundManager.playSuccessChime();

    let exerciseTip = '45 min Hypertrophy or Zone 2 Cardio';
    if (exerciseIntent === 'rest') {
      exerciseTip = 'Active Recovery (20 min Walk + Mobility)';
    } else if (exerciseIntent === 'light') {
      exerciseTip = '30 min Zone 2 Jog or Core & Stretching';
    }

    const calculatedFocus = readinessScore >= 4 ? targetFocusHours * 60 : Math.max(90, (targetFocusHours - 0.5) * 60);

    const tip =
      readinessScore >= 4
        ? 'High physical and neural readiness detected. Schedule your most demanding deep work block before 1:00 PM.'
        : 'Moderate readiness. Break study sessions into 25-minute Pomodoro sprints and prioritize an early walk outside.';

    const plan = {
      readiness: readinessScore,
      recommendedExercise: exerciseTip,
      recommendedFocusMinutes: calculatedFocus,
      tip,
    };

    setGeneratedPlan(plan);
    setIsGenerated(true);
  };

  const handleAcceptPlan = () => {
    if (generatedPlan) {
      onCompleteCheckIn(generatedPlan);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">30-Second Morning Check-In</h3>
              <p className="text-[11px] text-[#A1A1AA]">Calibrate readiness & generate your optimal day</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playHapticTap();
              onClose();
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-[#A1A1AA] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isGenerated ? (
          <div className="space-y-4">
            {/* 1. WAKE FEELING */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">How refreshed do you feel waking up?</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { rating: 1, label: 'Exhausted', emoji: '😴' },
                  { rating: 2, label: 'Groggy', emoji: '🥱' },
                  { rating: 3, label: 'Neutral', emoji: '😐' },
                  { rating: 4, label: 'Energized', emoji: '⚡' },
                  { rating: 5, label: 'Peak Flow', emoji: '🔥' },
                ].map((item) => (
                  <button
                    key={item.rating}
                    type="button"
                    onClick={() => {
                      soundManager.playHapticTap();
                      setWakeFeeling(item.rating);
                    }}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center gap-1.5 transition-all ${
                      wakeFeeling === item.rating
                        ? 'bg-[#3B82F6]/20 border-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                        : 'bg-[#18181B] border-white/5 text-[#A1A1AA] hover:border-white/10'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-[9px] font-bold leading-none">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. EXERCISE INTENT */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">Exercise plan today?</label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { key: 'yes', label: 'Workout Planned', icon: Dumbbell },
                  { key: 'light', label: 'Light / Mobility', icon: Flame },
                  { key: 'rest', label: 'Scheduled Rest', icon: Moon },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSel = exerciseIntent === item.key;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        soundManager.playHapticTap();
                        setExerciseIntent(item.key as any);
                      }}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                        isSel
                          ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E] shadow-[0_0_12px_rgba(34,197,94,0.3)]'
                          : 'bg-[#18181B] border-white/5 text-[#A1A1AA] hover:border-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. TARGET FOCUS TIME */}
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300 font-bold">Target Deep Work / Study</span>
                <span className="text-[#60A5FA] font-bold font-mono">{targetFocusHours} hours</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={targetFocusHours}
                onChange={(e) => setTargetFocusHours(parseFloat(e.target.value))}
                className="w-full accent-[#3B82F6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* 4. OVERALL READINESS SCORE */}
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-zinc-300 font-bold">Self-Assessed Readiness</span>
                <span className="text-[#8B5CF6] font-bold font-mono">{readinessScore} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={readinessScore}
                onChange={(e) => setReadinessScore(parseInt(e.target.value, 10))}
                className="w-full accent-[#8B5CF6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            <button
              type="button"
              id="daily-checkin-generate-btn"
              onClick={handleGenerate}
              className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Today's Action Plan</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-5 rounded-[28px] bg-[#18181B] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#60A5FA]" /> Readiness Calibrated
                </span>
                <span className="px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs font-bold font-mono">
                  {generatedPlan?.readiness}/5 High
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 text-zinc-300">
                  <div className="w-7 h-7 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center shrink-0">
                    <Dumbbell className="w-4 h-4 text-[#22C55E]" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Exercise Strategy</span>
                    <span className="text-[#A1A1AA]">{generatedPlan?.recommendedExercise}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-300">
                  <div className="w-7 h-7 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Recommended Deep Focus</span>
                    <span className="text-[#A1A1AA]">
                      {Math.floor((generatedPlan?.recommendedFocusMinutes || 180) / 60)}h{' '}
                      {(generatedPlan?.recommendedFocusMinutes || 180) % 60}m across structured blocks
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121214] border border-white/10 text-[11px] text-zinc-300">
                <span className="font-bold text-amber-400 block mb-1">Tactical Advice</span>
                <p className="leading-relaxed">{generatedPlan?.tip}</p>
              </div>
            </div>

            <button
              type="button"
              id="daily-checkin-accept-btn"
              onClick={handleAcceptPlan}
              className="w-full py-3.5 rounded-2xl bg-[#22C55E] hover:bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.5)] transition-all active:scale-98"
            >
              <Check className="w-4 h-4" />
              <span>Accept Plan & Start Day (+15 XP)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
