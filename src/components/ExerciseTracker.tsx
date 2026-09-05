import React, { useState } from 'react';
import { Dumbbell, Plus, Trash2, Trophy, Flame, Check, Activity, Heart, ShieldCheck } from 'lucide-react';
import { ExercisePR, ExerciseSession, ExerciseSet, ExerciseType } from '../types';
import { calculateExerciseScore } from '../services/scoringEngine';
import { soundManager } from '../services/soundEffects';

interface ExerciseTrackerProps {
  prs: ExercisePR[];
  healthKitConnected: boolean;
  onSaveSession: (session: ExerciseSession, updatedPRs?: ExercisePR[]) => void;
}

export const ExerciseTracker: React.FC<ExerciseTrackerProps> = ({
  prs,
  healthKitConnected,
  onSaveSession,
}) => {
  const [activityType, setActivityType] = useState<ExerciseType>('strength');
  const [title, setTitle] = useState('Push & Strength Hypertrophy');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [intensity, setIntensity] = useState<'low' | 'moderate' | 'high' | 'peak'>('high');
  const [distanceKm, setDistanceKm] = useState<number>(5.0);
  const [pace, setPace] = useState('4:55');
  const [avgHeartRate, setAvgHeartRate] = useState<number>(148);
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamic strength sets
  const [sets, setSets] = useState<ExerciseSet[]>([
    { id: '1', exerciseName: 'Barbell Bench Press', setNumber: 1, weightKg: 80, reps: 8 },
    { id: '2', exerciseName: 'Barbell Bench Press', setNumber: 2, weightKg: 85, reps: 8 },
    { id: '3', exerciseName: 'Barbell Bench Press', setNumber: 3, weightKg: 90, reps: 6 },
    { id: '4', exerciseName: 'Incline DB Press', setNumber: 1, weightKg: 32, reps: 10 },
  ]);

  const addSet = () => {
    soundManager.playHapticTap();
    const lastSet = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        id: Date.now().toString(),
        exerciseName: lastSet?.exerciseName || 'Exercise',
        setNumber: sets.length + 1,
        weightKg: lastSet?.weightKg || 50,
        reps: lastSet?.reps || 10,
      },
    ]);
  };

  const removeSet = (id: string) => {
    soundManager.playHapticTap();
    setSets(sets.filter((s) => s.id !== id));
  };

  const updateSet = (id: string, field: keyof ExerciseSet, value: any) => {
    setSets(sets.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  // Calculate total volume
  const totalVolumeKg =
    activityType === 'strength'
      ? sets.reduce((sum, s) => sum + s.weightKg * s.reps, 0)
      : undefined;

  // Check if any set sets a new PR
  let hasNewPR = false;
  const newPRsToRecord: ExercisePR[] = [...prs];

  if (activityType === 'strength') {
    sets.forEach((set) => {
      const existing = newPRsToRecord.find((p) => p.exerciseName.toLowerCase() === set.exerciseName.toLowerCase());
      if (!existing || set.weightKg > existing.bestWeightKg) {
        hasNewPR = true;
      }
    });
  }

  const { score, xpEarned } = calculateExerciseScore({
    durationMinutes,
    activityType,
    intensity,
    setsCount: sets.length,
    hasPR: hasNewPR,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccessChime();

    const todayStr = new Date().toISOString().split('T')[0];

    // Check PR update
    const updatedPRs = [...prs];
    if (activityType === 'strength') {
      sets.forEach((set) => {
        const idx = updatedPRs.findIndex((p) => p.exerciseName.toLowerCase() === set.exerciseName.toLowerCase());
        if (idx >= 0) {
          if (set.weightKg > updatedPRs[idx].bestWeightKg) {
            updatedPRs[idx] = {
              ...updatedPRs[idx],
              bestWeightKg: set.weightKg,
              bestReps: set.reps,
              achievedAt: todayStr,
            };
          }
        } else if (set.weightKg > 0) {
          updatedPRs.push({
            exerciseName: set.exerciseName,
            bestWeightKg: set.weightKg,
            bestReps: set.reps,
            bestVolumeKg: totalVolumeKg || 0,
            achievedAt: todayStr,
          });
        }
      });
    }

    const session: ExerciseSession = {
      id: `ex_${Date.now()}`,
      date: todayStr,
      activityType,
      title,
      durationMinutes,
      caloriesBurned: durationMinutes * (intensity === 'high' ? 10 : 8),
      distanceKm: activityType === 'running' || activityType === 'cycling' ? distanceKm : undefined,
      paceMinPerKm: activityType === 'running' ? pace : undefined,
      avgHeartRate,
      sets: activityType === 'strength' ? sets : [],
      totalVolumeKg,
      notes,
      intensity,
      source: healthKitConnected ? 'healthkit' : 'manual',
      score,
      xpEarned,
    };

    onSaveSession(session, updatedPRs);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* PERSONAL RECORDS SHOWCASE */}
      <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">Personal Records (PRs)</h3>
          </div>
          <span className="text-[10px] text-[#A1A1AA] font-mono uppercase tracking-wider">Historical Bests</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {prs.map((pr) => (
            <div key={pr.exerciseName} className="p-3.5 rounded-2xl bg-[#18181B] border border-white/10 text-xs shadow-sm">
              <span className="font-semibold text-zinc-300 block truncate">{pr.exerciseName}</span>
              <div className="text-base font-extrabold text-amber-300 font-mono mt-0.5">
                {pr.bestWeightKg > 0 ? `${pr.bestWeightKg} kg × ${pr.bestReps}` : `${pr.bestDistanceKm} km (${pr.bestPaceMinPerKm})`}
              </div>
              <span className="text-[10px] text-[#A1A1AA] mt-1 block">PR set: {pr.achievedAt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* WORKOUT LOGGING FORM */}
      <form onSubmit={handleSubmit} className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-center text-[#FB7185]">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Log Workout Session</h3>
              <p className="text-[11px] text-[#A1A1AA]">Volume, reps, and cardiovascular performance</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#FB7185] font-mono bg-white/5 px-3 py-1 rounded-xl border border-white/5">
            {totalVolumeKg ? `${totalVolumeKg.toLocaleString()} kg volume` : `${durationMinutes} mins`}
          </span>
        </div>

        {/* ACTIVITY TYPE SELECTOR */}
        <div>
          <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-2">Activity Type</label>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {(['strength', 'running', 'cycling', 'hiit', 'walking', 'swimming', 'mobility'] as ExerciseType[]).map(
              (type) => (
                <button
                  type="button"
                  key={type}
                  onClick={() => {
                    soundManager.playHapticTap();
                    setActivityType(type);
                    if (type === 'strength') setTitle('Strength & Hypertrophy');
                    else if (type === 'running') setTitle('Outdoor Pace Run');
                    else if (type === 'cycling') setTitle('Cycling Workout');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                    activityType === type
                      ? 'bg-[#F43F5E] text-white border-[#F43F5E] shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                      : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
                  }`}
                >
                  {type}
                </button>
              )
            )}
          </div>
        </div>

        {/* TITLE & DURATION */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Workout Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#F43F5E] focus:outline-none shadow-inner"
              required
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Duration (Minutes)</label>
            <input
              type="number"
              min="5"
              max="240"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10) || 0)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#F43F5E] focus:outline-none shadow-inner"
              required
            />
          </div>
        </div>

        {/* INTENSITY & HEART RATE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Session Intensity</label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as any)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#F43F5E] focus:outline-none shadow-inner"
            >
              <option value="low">Low (Recovery / Zone 2)</option>
              <option value="moderate">Moderate (Standard)</option>
              <option value="high">High (Hypertrophy / Hard)</option>
              <option value="peak">Peak (Max Effort / PR attempt)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Avg Heart Rate (BPM)
            </label>
            <input
              type="number"
              min="50"
              max="220"
              value={avgHeartRate}
              onChange={(e) => setAvgHeartRate(parseInt(e.target.value, 10) || 120)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#F43F5E] focus:outline-none shadow-inner"
            />
          </div>
        </div>

        {/* CARDIO SPECIFIC: DISTANCE & PACE */}
        {(activityType === 'running' || activityType === 'cycling') && (
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#18181B] border border-white/10">
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Average Pace (min/km)</label>
              <input
                type="text"
                value={pace}
                onChange={(e) => setPace(e.target.value)}
                placeholder="4:50"
                className="w-full bg-[#121214] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>
        )}

        {/* STRENGTH SPECIFIC: SETS TABLE */}
        {activityType === 'strength' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider">Sets, Weight & Reps</label>
              <button
                type="button"
                onClick={addSet}
                className="flex items-center gap-1.5 text-xs text-[#FB7185] font-bold hover:underline"
              >
                <Plus className="w-4 h-4" /> Add Set
              </button>
            </div>

            <div className="space-y-2">
              {sets.map((s, idx) => (
                <div
                  key={s.id}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#18181B] border border-white/10 text-xs shadow-inner"
                >
                  <span className="font-mono text-[#A1A1AA] w-5 font-bold">{idx + 1}</span>
                  <input
                    type="text"
                    value={s.exerciseName}
                    onChange={(e) => updateSet(s.id, 'exerciseName', e.target.value)}
                    placeholder="Exercise Name"
                    className="flex-1 min-w-0 bg-transparent border-0 text-white text-xs focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      value={s.weightKg}
                      onChange={(e) => updateSet(s.id, 'weightKg', parseFloat(e.target.value) || 0)}
                      className="w-16 bg-[#121214] border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-[#FB7185] font-mono font-bold"
                    />
                    <span className="text-[#A1A1AA] text-[10px]">kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={s.reps}
                      onChange={(e) => updateSet(s.id, 'reps', parseInt(e.target.value, 10) || 0)}
                      className="w-14 bg-[#121214] border border-white/10 rounded-lg px-2 py-1 text-xs text-right text-white font-mono font-bold"
                    />
                    <span className="text-[#A1A1AA] text-[10px]">reps</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSet(s.id)}
                    className="text-zinc-600 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WORKOUT REWARD PREVIEW */}
        <div className="p-4 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 flex items-center justify-between text-xs">
          <div>
            <span className="text-[#FB7185] font-semibold block">Calculated Exercise Score: {score}/100</span>
            <span className="text-[11px] text-[#A1A1AA]">
              {hasNewPR ? '🔥 New PR Bonus (+50 XP)' : 'Standard workout completion'}
            </span>
          </div>
          <span className="font-mono font-bold text-[#FB7185] text-base">+{xpEarned} XP</span>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          id="exercise-tracker-save-btn"
          className="w-full py-3.5 rounded-2xl bg-[#F43F5E] hover:bg-[#E11D48] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all active:scale-98"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Workout Saved & XP Awarded!</span>
            </>
          ) : (
            <>
              <Dumbbell className="w-4 h-4" />
              <span>Save Workout Session</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
