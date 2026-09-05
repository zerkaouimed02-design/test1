import React from 'react';
import { X, Moon, Dumbbell, Brain, Sparkles, Flame, Check } from 'lucide-react';
import { DailyRecord } from '../types';
import { soundManager } from '../services/soundEffects';

interface CalendarModalProps {
  record: DailyRecord | null;
  onClose: () => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const totalXp = record.totalXpEarned ?? record.totalXp ?? 0;
  const sleepMinutes = record.sleepDurationMinutes ?? record.sleepMinutes ?? 0;
  const exerciseMinutes = record.exerciseDurationMinutes ?? record.exerciseMinutes ?? 0;
  const studyMinutes = record.studyFocusMinutes ?? record.studyMinutes ?? 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-widest">Daily Audit</span>
            <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
              {new Date(record.date).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </h3>
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

        {/* Overall Score Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/10 shadow-md">
          <div>
            <span className="text-xs text-[#60A5FA] font-bold block">Overall Day Score</span>
            <span className="text-2xl font-black text-white font-mono">{record.overallScore} / 100</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#22C55E] font-bold block font-mono">+{totalXp} XP</span>
            <span className="text-[10px] text-[#A1A1AA]">Streak Status: {record.streakKept ?? true ? 'Preserved 🔥' : 'Rest Day'}</span>
          </div>
        </div>

        {/* 3 Pillars Breakdown */}
        <div className="space-y-2.5 text-xs">
          {/* Sleep */}
          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center">
                <Moon className="w-4 h-4 text-[#8B5CF6]" />
              </div>
              <div>
                <span className="font-bold text-white block">Sleep</span>
                <span className="text-[#A1A1AA] text-[11px] font-mono">
                  {Math.floor(sleepMinutes / 60)}h {sleepMinutes % 60}m
                </span>
              </div>
            </div>
            <span className="font-bold text-[#8B5CF6] text-sm font-mono">{record.sleepScore} / 100</span>
          </div>

          {/* Exercise */}
          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div>
                <span className="font-bold text-white block">Exercise</span>
                <span className="text-[#A1A1AA] text-[11px] font-mono">{exerciseMinutes} minutes</span>
              </div>
            </div>
            <span className="font-bold text-[#22C55E] text-sm font-mono">{record.exerciseScore || 0} / 100</span>
          </div>

          {/* Study */}
          <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-[#60A5FA]" />
              </div>
              <div>
                <span className="font-bold text-white block">Deep Work & Study</span>
                <span className="text-[#A1A1AA] text-[11px] font-mono">
                  {Math.floor(studyMinutes / 60)}h {studyMinutes % 60}m focused
                </span>
              </div>
            </div>
            <span className="font-bold text-[#60A5FA] text-sm font-mono">{record.studyScore || 0} / 100</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playHapticTap();
            onClose();
          }}
          className="w-full py-3 bg-[#18181B] hover:bg-white/10 border border-white/10 text-white rounded-2xl text-xs font-bold transition-colors"
        >
          Close Inspection
        </button>
      </div>
    </div>
  );
};
