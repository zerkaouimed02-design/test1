import React, { useState } from 'react';
import { X, Target, Moon, Dumbbell, Brain, Zap, Check, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../services/soundEffects';

interface GoalsModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onSaveTargets: (updatedTargets: UserProfile['targets']) => void;
  onClose: () => void;
}

export const GoalsModal: React.FC<GoalsModalProps> = ({
  isOpen,
  userProfile,
  onSaveTargets,
  onClose,
}) => {
  if (!isOpen) return null;

  const current = userProfile.targets || {
    sleepMinutes: 450,
    exerciseMinutesPerWeek: 180,
    dailyFocusMinutes: 180,
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
    weeklyWorkouts: 4,
    weeklyStudyHours: 15,
    targetDailyProductivityScore: 80,
  };

  const [sleepHours, setSleepHours] = useState(Math.floor((current.sleepMinutes || 450) / 60));
  const [sleepMinsRemainder, setSleepMinsRemainder] = useState((current.sleepMinutes || 450) % 60);
  const [targetBedtime, setTargetBedtime] = useState(current.targetBedtime || '23:00');
  const [targetWakeTime, setTargetWakeTime] = useState(current.targetWakeTime || '07:00');

  const [weeklyWorkouts, setWeeklyWorkouts] = useState(current.weeklyWorkouts || 4);
  const [exerciseMinutesPerWeek, setExerciseMinutesPerWeek] = useState(current.exerciseMinutesPerWeek || 180);

  const [dailyFocusMinutes, setDailyFocusMinutes] = useState(current.dailyFocusMinutes || 180);
  const [weeklyStudyHours, setWeeklyStudyHours] = useState(current.weeklyStudyHours || 15);

  const [targetDailyProductivityScore, setTargetDailyProductivityScore] = useState(
    current.targetDailyProductivityScore || 80
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccessChime();

    const totalSleepMins = sleepHours * 60 + sleepMinsRemainder;
    const updated: UserProfile['targets'] = {
      sleepMinutes: Math.max(240, totalSleepMins),
      exerciseMinutesPerWeek: Math.max(30, exerciseMinutesPerWeek),
      dailyFocusMinutes: Math.max(30, dailyFocusMinutes),
      targetBedtime,
      targetWakeTime,
      weeklyWorkouts,
      weeklyStudyHours,
      targetDailyProductivityScore,
    };

    onSaveTargets(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center text-[#60A5FA]">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Performance Targets & Goals</h3>
              <p className="text-[11px] text-[#A1A1AA]">Define measurable benchmarks across your 3 pillars</p>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. SLEEP TARGETS */}
          <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 uppercase tracking-wider">
                <Moon className="w-4 h-4 text-[#38BDF8]" /> Pillar 1: Sleep Targets
              </span>
              <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                {sleepHours}h {sleepMinsRemainder}m / night
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Target Sleep Duration
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="flex-1 bg-[#121214] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    {[6, 7, 8, 9, 10].map((h) => (
                      <option key={h} value={h}>
                        {h} hours
                      </option>
                    ))}
                  </select>
                  <select
                    value={sleepMinsRemainder}
                    onChange={(e) => setSleepMinsRemainder(Number(e.target.value))}
                    className="w-20 bg-[#121214] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>
                        {m} min
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Schedule (Bed / Wake)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    value={targetBedtime}
                    onChange={(e) => setTargetBedtime(e.target.value)}
                    className="w-1/2 bg-[#121214] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                  <span className="text-[#A1A1AA] text-xs">to</span>
                  <input
                    type="time"
                    value={targetWakeTime}
                    onChange={(e) => setTargetWakeTime(e.target.value)}
                    className="w-1/2 bg-[#121214] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. EXERCISE TARGETS */}
          <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#FB7185] flex items-center gap-1.5 uppercase tracking-wider">
                <Dumbbell className="w-4 h-4 text-[#FB7185]" /> Pillar 2: Exercise Targets
              </span>
              <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                {weeklyWorkouts} sessions / {exerciseMinutesPerWeek} min
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Weekly Workout Sessions
                </label>
                <div className="flex items-center gap-1">
                  {[2, 3, 4, 5, 6].map((count) => (
                    <button
                      type="button"
                      key={count}
                      onClick={() => {
                        soundManager.playHapticTap();
                        setWeeklyWorkouts(count);
                      }}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        weeklyWorkouts === count
                          ? 'bg-[#F43F5E] text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                          : 'bg-[#121214] text-[#A1A1AA] border border-white/5 hover:border-white/20'
                      }`}
                    >
                      {count}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Weekly Training Minutes
                </label>
                <input
                  type="number"
                  min="60"
                  max="600"
                  step="15"
                  value={exerciseMinutesPerWeek}
                  onChange={(e) => setExerciseMinutesPerWeek(Number(e.target.value))}
                  className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#FB7185]"
                />
              </div>
            </div>
          </div>

          {/* 3. STUDY & WORK TARGETS */}
          <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#A78BFA] flex items-center gap-1.5 uppercase tracking-wider">
                <Brain className="w-4 h-4 text-[#A78BFA]" /> Pillar 3: Study & Deep Work
              </span>
              <span className="text-[11px] font-mono text-zinc-400 font-semibold">
                {Math.floor(dailyFocusMinutes / 60)}h {dailyFocusMinutes % 60}m / day
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Daily Focus Target
                </label>
                <select
                  value={dailyFocusMinutes}
                  onChange={(e) => setDailyFocusMinutes(Number(e.target.value))}
                  className="w-full bg-[#121214] border border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#A78BFA]"
                >
                  <option value={60}>1 hour (60 min)</option>
                  <option value={90}>1.5 hours (90 min)</option>
                  <option value={120}>2 hours (120 min)</option>
                  <option value={150}>2.5 hours (150 min)</option>
                  <option value={180}>3 hours (180 min)</option>
                  <option value={240}>4 hours (240 min)</option>
                  <option value={300}>5 hours (300 min)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider block mb-1">
                  Weekly Study Hours Target
                </label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={weeklyStudyHours}
                  onChange={(e) => setWeeklyStudyHours(Number(e.target.value))}
                  className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#A78BFA]"
                />
              </div>
            </div>
          </div>

          {/* 4. PRODUCTIVITY TARGET */}
          <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#22C55E] flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-4 h-4 text-[#22C55E]" /> Productivity Score Goal
              </span>
              <span className="text-sm font-bold font-mono text-[#22C55E]">
                {targetDailyProductivityScore} / 100
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA]">
              Composite target combining consistent sleep schedule, workouts, and deep focus time.
            </p>
            <input
              type="range"
              min="65"
              max="95"
              step="1"
              value={targetDailyProductivityScore}
              onChange={(e) => setTargetDailyProductivityScore(Number(e.target.value))}
              className="w-full accent-[#22C55E]"
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Targets Calibrated!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Save Performance Targets</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
