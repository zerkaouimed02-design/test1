import React, { useState } from 'react';
import { Moon, Sparkles, Clock, Check, Info, ShieldCheck } from 'lucide-react';
import { SleepRecord } from '../types';
import { calculateSleepScore } from '../services/scoringEngine';
import { soundManager } from '../services/soundEffects';

interface SleepTrackerProps {
  latestRecord?: SleepRecord;
  targetBedtime: string;
  targetWakeTime: string;
  targetDurationMinutes: number;
  healthKitConnected: boolean;
  onSaveRecord: (record: SleepRecord) => void;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({
  latestRecord,
  targetBedtime,
  targetWakeTime,
  targetDurationMinutes,
  healthKitConnected,
  onSaveRecord,
}) => {
  const [bedtime, setBedtime] = useState(latestRecord?.bedtime || '23:15');
  const [wakeTime, setWakeTime] = useState(latestRecord?.wakeTime || '07:15');
  const [quality, setQuality] = useState<number>(latestRecord?.sleepQuality || 8);
  const [awakenings, setAwakenings] = useState<number>(latestRecord?.awakenings || 1);
  const [notes, setNotes] = useState(latestRecord?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Compute duration in minutes based on bedtime and wake time
  const calcDurationMinutes = (): number => {
    const [bH, bM] = bedtime.split(':').map(Number);
    const [wH, wM] = wakeTime.split(':').map(Number);
    let diff = (wH * 60 + wM) - (bH * 60 + bM);
    if (diff <= 0) diff += 1440; // overnight crossing midnight
    return Math.max(0, diff - 15); // minus 15 min estimated sleep onset latency
  };

  const currentDuration = calcDurationMinutes();

  // Real-time live score calculation
  const liveScore = calculateSleepScore({
    durationMinutes: currentDuration,
    targetDurationMinutes,
    bedtime,
    targetBedtime,
    wakeTime,
    targetWakeTime,
    qualityRating: quality,
    awakenings,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playSuccessChime();

    const todayStr = new Date().toISOString().split('T')[0];
    const newRecord: SleepRecord = {
      id: `sleep_${Date.now()}`,
      date: todayStr,
      bedtime,
      sleepTime: bedtime,
      wakeTime,
      timeInBedMinutes: currentDuration + 20,
      durationMinutes: currentDuration,
      sleepQuality: quality,
      awakenings,
      notes,
      source: healthKitConnected ? 'healthkit' : 'manual',
      score: liveScore.score,
      scoreBreakdown: liveScore.breakdown,
      xpEarned: liveScore.xpEarned,
    };

    onSaveRecord(newRecord);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-5">
      {/* HEALTHKIT STATUS BADGE */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 text-xs shadow-lg">
        <div className="flex items-center gap-2 text-[#38BDF8]">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          <span>
            {healthKitConnected
              ? 'Apple HealthKit connected: Automatic sleep stage sync active'
              : 'Manual input mode active (HealthKit optional)'}
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-[#0EA5E9]/20 text-[#38BDF8] font-bold">
          {healthKitConnected ? 'HK_ACTIVE' : 'MANUAL'}
        </span>
      </div>

      {/* FORM LOGGING SHEET */}
      <form onSubmit={handleSave} className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 flex items-center justify-center text-[#38BDF8]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Log Sleep Session</h3>
              <p className="text-[11px] text-[#A1A1AA]">Bedtime and morning recovery calculation</p>
            </div>
          </div>
          <span className="text-xs text-[#A1A1AA] font-mono bg-white/5 px-3 py-1 rounded-xl border border-white/5">
            Duration: {Math.floor(currentDuration / 60)}h {currentDuration % 60}m
          </span>
        </div>

        {/* TIME INPUTS: BEDTIME & WAKE TIME */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Bedtime (Lights Off)
            </label>
            <input
              type="time"
              value={bedtime}
              onChange={(e) => setBedtime(e.target.value)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:border-[#0EA5E9] focus:outline-none shadow-inner"
              required
            />
            <span className="text-[10px] text-[#A1A1AA] mt-1 block">Target: {targetBedtime}</span>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
              Wake Time
            </label>
            <input
              type="time"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white font-mono focus:border-[#0EA5E9] focus:outline-none shadow-inner"
              required
            />
            <span className="text-[10px] text-[#A1A1AA] mt-1 block">Target: {targetWakeTime}</span>
          </div>
        </div>

        {/* SLEEP QUALITY SLIDER */}
        <div className="space-y-2 bg-[#18181B] p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between text-xs">
            <span className="text-[#A1A1AA] font-semibold">Subjective Sleep Quality</span>
            <span className="text-[#38BDF8] font-bold font-mono">{quality} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value, 10))}
            className="w-full accent-[#0EA5E9] h-2 bg-white/10 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#A1A1AA]">
            <span>1 - Exhausted</span>
            <span>5 - Average</span>
            <span>10 - Peak Rest</span>
          </div>
        </div>

        {/* AWAKENINGS */}
        <div className="flex items-center justify-between bg-[#18181B] p-4 rounded-2xl border border-white/5">
          <div>
            <span className="text-xs font-semibold text-white block">Night Awakenings</span>
            <span className="text-[10px] text-[#A1A1AA]">Times disturbed during the night</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setAwakenings(Math.max(0, awakenings - 1))}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              -
            </button>
            <span className="font-mono text-sm font-bold text-white w-5 text-center">{awakenings}</span>
            <button
              type="button"
              onClick={() => setAwakenings(awakenings + 1)}
              className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-colors"
            >
              +
            </button>
          </div>
        </div>

        {/* SLEEP NOTES */}
        <div>
          <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
            Sleep Notes (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Cool bedroom, read fiction 20m before sleep..."
            className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-[#0EA5E9] focus:outline-none shadow-inner"
          />
        </div>

        {/* TRANSPARENT SLEEP SCORE BREAKDOWN */}
        <div className="p-4 rounded-2xl bg-[#0EA5E9]/10 border border-[#0EA5E9]/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              Calculated Sleep Score:
            </span>
            <span className="text-lg font-mono font-bold text-[#38BDF8]">{liveScore.score} / 100</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#0EA5E9]/20">
            <div className="text-white/80">
              +{liveScore.breakdown.duration.earned}/{liveScore.breakdown.duration.max} duration
            </div>
            <div className="text-white/80">
              +{liveScore.breakdown.consistency.earned}/{liveScore.breakdown.consistency.max} consistency
            </div>
            <div className="text-white/80">
              +{liveScore.breakdown.schedule.earned}/{liveScore.breakdown.schedule.max} schedule
            </div>
            <div className="text-white/80">
              +{liveScore.breakdown.quality.earned}/{liveScore.breakdown.quality.max} quality
            </div>
          </div>

          <div className="text-[11px] text-[#22C55E] font-semibold pt-1">
            + {liveScore.xpEarned} XP will be credited to Sleep Level
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          id="sleep-tracker-save-btn"
          className="w-full py-3.5 rounded-2xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.4)] transition-all active:scale-98"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Sleep Session Saved & XP Awarded!</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4" />
              <span>Save & Calculate Progression</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
