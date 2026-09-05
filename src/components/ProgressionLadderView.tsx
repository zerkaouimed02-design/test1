import React, { useState } from 'react';
import { Award, Lock, CheckCircle2, Flame, Star, Trophy, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Achievement, CategoryProgression, CategoryType, XPTransaction } from '../types';
import { generateProgressionLadder, getTitleForLevel } from '../services/progressionEngine';
import { soundManager } from '../services/soundEffects';

interface ProgressionLadderViewProps {
  overallProgression: CategoryProgression;
  sleepProgression: CategoryProgression;
  exerciseProgression: CategoryProgression;
  studyProgression: CategoryProgression;
  achievements: Achievement[];
  xpTransactions: XPTransaction[];
}

export const ProgressionLadderView: React.FC<ProgressionLadderViewProps> = ({
  overallProgression,
  sleepProgression,
  exerciseProgression,
  studyProgression,
  achievements,
  xpTransactions,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('overall');
  const [viewMode, setViewMode] = useState<'ladder' | 'achievements' | 'ledger'>('ladder');

  const activeProgression =
    selectedCategory === 'overall'
      ? overallProgression
      : selectedCategory === 'sleep'
      ? sleepProgression
      : selectedCategory === 'exercise'
      ? exerciseProgression
      : studyProgression;

  const ladderItems = generateProgressionLadder(selectedCategory, activeProgression.level);

  // Show a relevant window around the current level (e.g. from max(1, current - 4) to current + 12)
  const currentLvl = activeProgression.level;
  const visibleLadder = ladderItems.slice(Math.max(0, currentLvl - 4), Math.min(100, currentLvl + 12));

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* HEADER TITLE */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Progression System</h2>
          <p className="text-xs text-[#A1A1AA]">Level 1 → Level 100 Real-Life RPG Ladder</p>
        </div>
        <div className="flex items-center gap-1 bg-[#121214] p-1.5 rounded-2xl border border-white/10 shadow-lg">
          <button
            onClick={() => {
              soundManager.playHapticTap();
              setViewMode('ladder');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'ladder'
                ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Ladder
          </button>
          <button
            onClick={() => {
              soundManager.playHapticTap();
              setViewMode('achievements');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'achievements'
                ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => {
              soundManager.playHapticTap();
              setViewMode('ledger');
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              viewMode === 'ledger'
                ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'text-[#A1A1AA] hover:text-white'
            }`}
          >
            XP Log
          </button>
        </div>
      </div>

      {/* CATEGORY SELECTOR PILLS */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {(['overall', 'sleep', 'exercise', 'study'] as CategoryType[]).map((cat) => {
          const isSel = selectedCategory === cat;
          const label =
            cat === 'overall' ? '🌟 Overall' : cat === 'sleep' ? '🌙 Sleep' : cat === 'exercise' ? '⚡ Exercise' : '🧠 Study/Work';
          return (
            <button
              key={cat}
              id={`progress-cat-pill-${cat}`}
              onClick={() => {
                soundManager.playHapticTap();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                isSel
                  ? 'bg-white text-black border-white shadow-md'
                  : 'bg-[#121214] text-[#A1A1AA] border-white/10 hover:border-white/20'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* HERO LEVEL SUMMARY CARD */}
      <div className="rounded-[32px] bg-gradient-to-br from-[#18181B] via-[#121214] to-[#1e1b4b]/40 border border-white/10 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex justify-between items-start mb-4 relative z-10">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#60A5FA]">
              {selectedCategory.toUpperCase()} PROGRESSION
            </span>
            <div className="flex items-baseline gap-2.5 mt-1">
              <h3 className="text-3xl font-black text-white tracking-tight">LEVEL {activeProgression.level}</h3>
              <span className="text-base font-bold text-[#93C5FD]">{activeProgression.title}</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#A1A1AA] block uppercase font-bold tracking-wider">Cumulative XP</span>
            <span className="text-lg font-extrabold text-white font-mono">
              {activeProgression.totalXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Intra Level Progress */}
        <div className="space-y-2 relative z-10 bg-[#050507]/40 p-4 rounded-2xl border border-white/5">
          <div className="flex justify-between text-xs font-medium text-zinc-300">
            <span>
              Current Level XP: <strong className="text-white font-mono">{activeProgression.currentLevelXP.toLocaleString()}</strong>
            </span>
            <span>
              Next Level: <strong className="text-[#60A5FA] font-mono">{activeProgression.nextLevelXP.toLocaleString()} XP</strong>
            </span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 p-0.5 overflow-hidden border border-white/5">
            <div
              className="bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#22C55E] h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(4, (activeProgression.currentLevelXP / activeProgression.nextLevelXP) * 100)
                )}%`,
              }}
            />
          </div>
          <div className="text-[11px] text-[#A1A1AA] text-right font-mono">
            {activeProgression.nextLevelXP - activeProgression.currentLevelXP} XP needed to reach Level {activeProgression.level + 1}
          </div>
        </div>
      </div>

      {/* VIEW: VERTICAL PROGRESSION LADDER */}
      {viewMode === 'ladder' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Progression Ladder</h3>
            <span className="text-[11px] text-[#A1A1AA] font-mono">Tier Scaling: +12% per level</span>
          </div>

          <div className="space-y-2 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {visibleLadder.map((item) => {
              const isPast = item.level < activeProgression.level;
              const isCurrent = item.level === activeProgression.level;
              const isFuture = item.level > activeProgression.level;

              return (
                <div
                  key={item.level}
                  className={`relative flex items-center gap-3.5 p-4 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-[#3B82F6]/10 border-[#3B82F6]/60 shadow-[0_0_20px_rgba(59,130,246,0.25)] ring-1 ring-[#3B82F6]/40'
                      : isPast
                      ? 'bg-[#121214] border-white/10'
                      : 'bg-[#0B0B0E] border-white/5 opacity-60'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      isCurrent
                        ? 'bg-[#3B82F6] text-white ring-4 ring-[#3B82F6]/30 shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                        : isPast
                        ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30'
                        : 'bg-white/5 text-[#A1A1AA] border border-white/10'
                    }`}
                  >
                    {isPast ? <CheckCircle2 className="w-4 h-4" /> : isCurrent ? item.level : <Lock className="w-3.5 h-3.5" />}
                  </div>

                  {/* Level Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-extrabold font-mono ${
                          isCurrent ? 'text-white' : isPast ? 'text-zinc-300' : 'text-zinc-500'
                        }`}
                      >
                        LEVEL {item.level}
                      </span>
                      <span className="text-xs">{item.badge}</span>
                      <span
                        className={`text-xs font-semibold truncate ${
                          isCurrent ? 'text-[#93C5FD]' : isPast ? 'text-[#A1A1AA]' : 'text-zinc-600'
                        }`}
                      >
                        {item.title}
                      </span>
                    </div>

                    {isCurrent && (
                      <div className="text-[11px] text-[#60A5FA] font-medium mt-0.5 font-mono">
                        CURRENT LEVEL • {activeProgression.currentLevelXP} / {activeProgression.nextLevelXP} XP
                      </div>
                    )}
                    {isFuture && (
                      <div className="text-[11px] text-zinc-600 mt-0.5 font-mono">
                        Requires {item.perLevelXP.toLocaleString()} XP
                      </div>
                    )}
                    {isPast && (
                      <div className="text-[11px] text-[#22C55E] font-medium mt-0.5">
                        ✓ Completed
                      </div>
                    )}
                  </div>

                  {item.isMilestone && (
                    <div className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>Milestone</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW: ACHIEVEMENTS / BADGES */}
      {viewMode === 'achievements' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Milestones & Achievements</h3>
            <span className="text-[11px] font-bold text-[#60A5FA]">
              {achievements.filter((a) => a.unlocked).length} of {achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-[28px] border transition-all ${
                  ach.unlocked
                    ? 'bg-[#121214] border-white/10 shadow-lg'
                    : 'bg-[#0B0B0E] border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                      ach.unlocked
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                        : 'bg-white/5 border border-white/10 text-zinc-600'
                    }`}
                  >
                    {ach.unlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white truncate">{ach.title}</h4>
                      <span className="text-[10px] font-bold text-amber-400 font-mono">+{ach.xpReward} XP</span>
                    </div>
                    <p className="text-[11px] text-[#A1A1AA] line-clamp-2 mt-0.5">{ach.description}</p>
                    {ach.unlocked ? (
                      <span className="text-[10px] font-medium text-[#22C55E] mt-1.5 inline-block">
                        ✓ Unlocked {ach.unlockedAt}
                      </span>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-[10px] text-[#A1A1AA]">
                          <span>Progress</span>
                          <span>{ach.progress} / {ach.maxProgress}</span>
                        </div>
                        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#3B82F6] h-full rounded-full"
                            style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: XP LEDGER */}
      {viewMode === 'ledger' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">XP Transaction History</h3>
            <span className="text-[11px] text-[#A1A1AA] font-mono">Immutable Log</span>
          </div>

          <div className="space-y-2">
            {xpTransactions.slice(-10).reverse().map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-2xl bg-[#121214] border border-white/10 text-xs shadow-md"
              >
                <div>
                  <div className="font-semibold text-white">{tx.reason}</div>
                  <div className="text-[10px] text-[#A1A1AA] mt-0.5">
                    {new Date(tx.timestamp).toLocaleDateString()} • {tx.category.toUpperCase()}
                  </div>
                </div>
                <span className="font-bold text-[#22C55E] font-mono text-sm">+{tx.amount} XP</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
