import React, { useState } from 'react';
import {
  User,
  Moon,
  Dumbbell,
  Brain,
  Bell,
  ShieldCheck,
  Download,
  RotateCcw,
  Sparkles,
  Code2,
  CheckCircle2,
  Trash2,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types';
import { soundManager } from '../services/soundEffects';

interface ProfileViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onResetData: () => void;
  onOpenGoals: () => void;
  onOpenTests: () => void;
  onOpenOnboarding: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  userProfile,
  onUpdateProfile,
  onExportJSON,
  onExportCSV,
  onResetData,
  onOpenGoals,
  onOpenTests,
  onOpenOnboarding,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [bedtime, setBedtime] = useState(userProfile.targets?.targetBedtime || userProfile.targetBedtime || '23:00');
  const [wakeTime, setWakeTime] = useState(userProfile.targets?.targetWakeTime || userProfile.targetWakeTime || '07:00');
  const [sleepHours, setSleepHours] = useState(
    (userProfile.targets?.sleepMinutes || userProfile.targetSleepDurationMinutes || 480) / 60
  );
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(
    userProfile.weeklyWorkoutsTarget || Math.round((userProfile.targets?.exerciseMinutesPerWeek || 180) / 45) || 4
  );
  const [focusHours, setFocusHours] = useState(
    (userProfile.targets?.dailyFocusMinutes || userProfile.dailyStudyTargetMinutes || 180) / 60
  );
  const [hkConnected, setHkConnected] = useState(userProfile.healthKitConnected ?? true);
  const [notifications, setNotifications] = useState(userProfile.notificationsEnabled ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccessChime();

    const updated: UserProfile = {
      ...userProfile,
      name,
      targetBedtime: bedtime,
      targetWakeTime: wakeTime,
      targetSleepDurationMinutes: sleepHours * 60,
      weeklyWorkoutsTarget: weeklyWorkouts,
      dailyStudyTargetMinutes: focusHours * 60,
      targets: {
        sleepMinutes: sleepHours * 60,
        exerciseMinutesPerWeek: weeklyWorkouts * 45,
        dailyFocusMinutes: focusHours * 60,
        targetBedtime: bedtime,
        targetWakeTime: wakeTime,
      },
      healthKitConnected: hkConnected,
      notificationsEnabled: notifications,
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 pb-28 max-w-xl mx-auto px-4 pt-2">
      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 p-5 rounded-[32px] bg-[#121214] border border-white/10 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] flex items-center justify-center text-white text-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.5)] shrink-0">
          {name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white tracking-tight truncate">{name}</h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/30">
              USER
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-1">Durable Local Storage • Ascend Web Edition</p>
        </div>
      </div>

      {/* TARGET PREFERENCES FORM */}
      <form onSubmit={handleSaveSettings} className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest">Pillars & Target Calibration</h3>
          {savedSuccess && (
            <span className="text-xs text-[#22C55E] font-bold flex items-center gap-1.5 bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
              <Check className="w-3.5 h-3.5" /> Saved
            </span>
          )}
        </div>

        {/* User Name */}
        <div>
          <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#3B82F6] shadow-inner"
            required
          />
        </div>

        {/* Sleep Targets */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3.5">
          <span className="text-xs font-bold text-[#8B5CF6] flex items-center gap-2">
            <Moon className="w-4 h-4" /> Sleep Baseline Targets
          </span>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">Target Bedtime</label>
              <input
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">Target Wake Time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-[#A1A1AA] mb-1.5 font-medium">
              <span>Target Duration</span>
              <span className="text-white font-bold font-mono">{sleepHours} hours</span>
            </div>
            <input
              type="range"
              min="6"
              max="10"
              step="0.5"
              value={sleepHours}
              onChange={(e) => setSleepHours(parseFloat(e.target.value))}
              className="w-full accent-[#8B5CF6] h-2 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Exercise & Workouts */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3">
          <span className="text-xs font-bold text-[#22C55E] flex items-center gap-2">
            <Dumbbell className="w-4 h-4" /> Exercise Cadence
          </span>
          <div className="flex justify-between text-[11px] text-[#A1A1AA] font-medium">
            <span>Weekly Workouts Target</span>
            <span className="text-white font-bold font-mono">{weeklyWorkouts} sessions</span>
          </div>
          <input
            type="range"
            min="2"
            max="7"
            value={weeklyWorkouts}
            onChange={(e) => setWeeklyWorkouts(parseInt(e.target.value, 10))}
            className="w-full accent-[#22C55E] h-2 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Study / Work */}
        <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5 space-y-3">
          <span className="text-xs font-bold text-[#60A5FA] flex items-center gap-2">
            <Brain className="w-4 h-4" /> Intellectual Focus
          </span>
          <div className="flex justify-between text-[11px] text-[#A1A1AA] font-medium">
            <span>Daily Focus Target</span>
            <span className="text-white font-bold font-mono">{focusHours} hours / day</span>
          </div>
          <input
            type="range"
            min="1"
            max="8"
            step="0.5"
            value={focusHours}
            onChange={(e) => setFocusHours(parseFloat(e.target.value))}
            className="w-full accent-[#3B82F6] h-2 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        {/* Integrations Toggles */}
        <div className="space-y-2.5 pt-1">
          <div
            onClick={() => setHkConnected(!hkConnected)}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/5 hover:border-white/10 cursor-pointer text-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <div>
                <span className="font-semibold text-white block">Apple HealthKit Integration</span>
                <span className="text-[10px] text-[#A1A1AA]">Syncs sleep stage analysis and active workouts</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${hkConnected ? 'bg-[#3B82F6]' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${hkConnected ? 'translate-x-5' : ''}`} />
            </div>
          </div>

          <div
            onClick={() => setNotifications(!notifications)}
            className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/5 hover:border-white/10 cursor-pointer text-xs transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-semibold text-white block">Push Notifications</span>
                <span className="text-[10px] text-[#A1A1AA]">Bedtime alerts, daily reminder, weekly report</span>
              </div>
            </div>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${notifications ? 'bg-amber-500' : 'bg-white/10'}`}>
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-5' : ''}`} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          id="profile-save-settings-btn"
          className="w-full py-3.5 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-xs shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-98"
        >
          Save Target Preferences
        </button>
      </form>

      {/* DEVELOPER TOOLS & ARCHITECTURE */}
      <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Native Engineering & Tools</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundManager.playHapticTap();
              onOpenSwiftCode();
            }}
            className="p-4 rounded-2xl bg-[#18181B] border border-white/5 hover:border-[#3B82F6]/50 flex flex-col items-start gap-1.5 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
              <Code2 className="w-4 h-4 text-[#60A5FA]" />
            </div>
            <span className="text-xs font-bold text-white mt-1">Swift Architecture</span>
            <span className="text-[10px] text-[#A1A1AA]">View SwiftData models & services</span>
          </button>

          <button
            onClick={() => {
              soundManager.playHapticTap();
              onOpenTests();
            }}
            className="p-4 rounded-2xl bg-[#18181B] border border-white/5 hover:border-[#22C55E]/50 flex flex-col items-start gap-1.5 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <span className="text-xs font-bold text-white mt-1">Algorithm Tests</span>
            <span className="text-[10px] text-[#A1A1AA]">Run scoring & XP test suite</span>
          </button>
        </div>

        <button
          onClick={() => {
            soundManager.playHapticTap();
            onOpenOnboarding();
          }}
          className="w-full py-3 bg-[#18181B] border border-white/5 hover:bg-white/10 rounded-2xl text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#60A5FA]" />
          <span>Replay Onboarding Walkthrough</span>
        </button>
      </div>

      {/* DATA MANAGEMENT & EXPORTS (SECTION 21) */}
      <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Data Management & Privacy</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              soundManager.playHapticTap();
              onExportJSON();
            }}
            className="p-3 rounded-2xl bg-[#18181B] border border-white/5 hover:border-white/20 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#60A5FA]" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={() => {
              soundManager.playHapticTap();
              onExportCSV();
            }}
            className="p-3 rounded-2xl bg-[#18181B] border border-white/5 hover:border-white/20 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Export CSV</span>
          </button>
        </div>

        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() => {
              soundManager.playHapticTap();
              if (window.confirm('Reset all demo data back to clean initial seed?')) {
                onResetData();
              }
            }}
            className="w-full py-3 bg-[#F43F5E]/10 hover:bg-[#F43F5E]/20 border border-[#F43F5E]/30 rounded-2xl text-xs font-semibold text-[#FB7185] flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data to Initial Seed</span>
          </button>
        </div>
      </div>
    </div>
  );
};
