import React, { useState } from 'react';
import { Sparkles, Moon, Dumbbell, Brain, ShieldCheck, Bell, ChevronRight, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../services/soundEffects';

interface OnboardingModalProps {
  isOpen: boolean;
  userProfile: UserProfile;
  onComplete: (updatedProfile: UserProfile) => void;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  userProfile,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [targetBedtime, setTargetBedtime] = useState(userProfile.targets?.targetBedtime || userProfile.targetBedtime || '23:00');
  const [targetWakeTime, setTargetWakeTime] = useState(userProfile.targets?.targetWakeTime || userProfile.targetWakeTime || '07:00');
  const [targetSleepHours, setTargetSleepHours] = useState(
    Math.round((userProfile.targets?.sleepMinutes || userProfile.targetSleepDurationMinutes || 480) / 60)
  );
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(
    userProfile.weeklyWorkoutsTarget || Math.round((userProfile.targets?.exerciseMinutesPerWeek || 180) / 45) || 4
  );
  const [dailyFocusHours, setDailyFocusHours] = useState(
    Math.round((userProfile.targets?.dailyFocusMinutes || userProfile.dailyStudyTargetMinutes || 180) / 60)
  );
  const [healthKitGranted, setHealthKitGranted] = useState(userProfile.healthKitConnected ?? true);
  const [notificationsGranted, setNotificationsGranted] = useState(userProfile.notificationsEnabled ?? true);

  if (!isOpen) return null;

  const nextStep = () => {
    soundManager.playHapticTap();
    if (step < 7) {
      setStep(step + 1);
    } else {
      soundManager.playLevelUpFanfare();
      const updated: UserProfile = {
        ...userProfile,
        targetBedtime,
        targetWakeTime,
        targetSleepDurationMinutes: targetSleepHours * 60,
        weeklyWorkoutsTarget: weeklyWorkouts,
        dailyStudyTargetMinutes: dailyFocusHours * 60,
        targets: {
          sleepMinutes: targetSleepHours * 60,
          exerciseMinutesPerWeek: weeklyWorkouts * 45,
          dailyFocusMinutes: dailyFocusHours * 60,
          targetBedtime,
          targetWakeTime,
        },
        healthKitConnected: healthKitGranted,
        notificationsEnabled: notificationsGranted,
      };
      onComplete(updated);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        {/* Step Indicator */}
        <div className="flex items-center justify-between text-xs text-[#A1A1AA] font-mono">
          <span className="font-bold tracking-wider">STEP {step} OF 7</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all ${
                  s === step ? 'w-6 bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.5)]' : s < step ? 'w-2 bg-[#3B82F6]/50' : 'w-2 bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        {/* STEP 1: WELCOME & PHILOSOPHY */}
        {step === 1 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center mx-auto text-[#60A5FA] shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight font-sans">
              Welcome to Ascend
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
              A real-life progression system designed to level up your biology, physical strength, and intellectual focus through rigorous compounding consistency.
            </p>
            <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/10 text-xs text-[#93C5FD] font-semibold">
              Track → Analyze → Progress → Build consistency → Level up
            </div>
          </div>
        )}

        {/* STEP 2: THE 3 FUNDAMENTAL PILLARS */}
        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">The Three Foundations</h3>
              <p className="text-xs text-[#A1A1AA] mt-1">Mastering these 3 delivers 90% of personal momentum</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">1. SLEEP & RECOVERY</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Biological circadian rhythm and restorative sleep</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center shrink-0">
                  <Dumbbell className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">2. EXERCISE & VITALITY</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Progressive overload, cardiovascular output, and PRs</p>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
                <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center shrink-0">
                  <Brain className="w-5 h-5 text-[#60A5FA]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">3. STUDY & DEEP WORK</h4>
                  <p className="text-[11px] text-[#A1A1AA]">Undistracted focus blocks, task mastery, and project momentum</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: SLEEP SETUP */}
        {step === 3 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Moon className="w-4 h-4 text-[#8B5CF6]" /> Target Sleep Profile
              </h3>
              <p className="text-xs text-[#A1A1AA]">Establish your baseline circadian window</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">Target Bedtime</label>
                <input
                  type="time"
                  value={targetBedtime}
                  onChange={(e) => setTargetBedtime(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">Target Wake Time</label>
                <input
                  type="time"
                  value={targetWakeTime}
                  onChange={(e) => setTargetWakeTime(e.target.value)}
                  className="w-full bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A1A1AA]">Target Sleep Duration</span>
                <span className="text-[#8B5CF6] font-bold font-mono">{targetSleepHours} hours</span>
              </div>
              <input
                type="range"
                min="6"
                max="10"
                step="0.5"
                value={targetSleepHours}
                onChange={(e) => setTargetSleepHours(parseFloat(e.target.value))}
                className="w-full accent-[#8B5CF6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* STEP 4: EXERCISE SETUP */}
        {step === 4 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#22C55E]" /> Physical Training Goal
              </h3>
              <p className="text-xs text-[#A1A1AA]">How many dedicated training sessions per week?</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A1A1AA]">Weekly Target Workouts</span>
                <span className="text-[#22C55E] font-bold font-mono">{weeklyWorkouts} sessions / week</span>
              </div>
              <input
                type="range"
                min="2"
                max="7"
                step="1"
                value={weeklyWorkouts}
                onChange={(e) => setWeeklyWorkouts(parseInt(e.target.value, 10))}
                className="w-full accent-[#22C55E] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5 text-xs text-[#A1A1AA]">
              💡 Supports 1-2 scheduled rest days per week without penalizing consistency streaks.
            </div>
          </div>
        )}

        {/* STEP 5: STUDY / WORK SETUP */}
        {step === 5 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-[#60A5FA]" /> Daily Deep Focus Goal
              </h3>
              <p className="text-xs text-[#A1A1AA]">Total deep, undistracted work hours per day</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A1A1AA]">Daily Focus Hours</span>
                <span className="text-[#60A5FA] font-bold font-mono">{dailyFocusHours} hours / day</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                step="0.5"
                value={dailyFocusHours}
                onChange={(e) => setDailyFocusHours(parseFloat(e.target.value))}
                className="w-full accent-[#3B82F6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* STEP 6: APPLE HEALTHKIT & NOTIFICATIONS */}
        {step === 6 && (
          <div className="space-y-4 py-2">
            <div>
              <h3 className="text-base font-bold text-white">Integrations & Privacy</h3>
              <p className="text-xs text-[#A1A1AA]">Apple privacy principles: your biometric data stays local</p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => setHealthKitGranted(!healthKitGranted)}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Apple HealthKit Sync</span>
                    <span className="text-[10px] text-[#A1A1AA]">Auto-read sleep staging & workout data</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${healthKitGranted ? 'bg-[#3B82F6] border-[#3B82F6] text-white shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'border-white/20'}`}>
                  {healthKitGranted && <Check className="w-4 h-4" />}
                </div>
              </div>

              <div
                onClick={() => setNotificationsGranted(!notificationsGranted)}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/5 cursor-pointer hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Smart Native Notifications</span>
                    <span className="text-[10px] text-[#A1A1AA]">Bedtime winding reminder & weekly review</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors ${notificationsGranted ? 'bg-amber-500 border-amber-500 text-white shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'border-white/20'}`}>
                  {notificationsGranted && <Check className="w-4 h-4" />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: START JOURNEY & LEVEL 1 UNLOCKED */}
        {step === 7 && (
          <div className="space-y-4 text-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center mx-auto text-[#22C55E] shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white">LEVEL 1 UNLOCKED</h3>
            <p className="text-xs text-zinc-300 max-w-xs mx-auto">
              Your profile is initialized. Welcome, <strong>Beginner</strong>. Consistency is the only lever you control.
            </p>
          </div>
        )}

        {/* NEXT / FINISH BUTTON */}
        <button
          id="onboarding-next-btn"
          onClick={nextStep}
          className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-98"
        >
          <span>{step === 7 ? 'Enter Ascend Platform' : 'Continue'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
