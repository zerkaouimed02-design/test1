import React from 'react';
import {
  Moon,
  Dumbbell,
  Brain,
  Flame,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  CheckCircle,
  Plus,
  Play,
  TrendingUp,
} from 'lucide-react';
import { CategoryProgression, DailyRecord, ExerciseSession, SleepRecord, StudySession } from '../types';
import { TabKey } from './TabBar';
import { soundManager } from '../services/soundEffects';

interface HomeDashboardProps {
  overallProgression: CategoryProgression;
  sleepProgression: CategoryProgression;
  exerciseProgression: CategoryProgression;
  studyProgression: CategoryProgression;
  todayRecord: DailyRecord;
  latestSleep?: SleepRecord;
  todayExercise?: ExerciseSession;
  todayStudySessions: StudySession[];
  currentStreak: number;
  bestStreak: number;
  weeklyAvgScore: number;
  monthlyProgressPercent: number;
  onNavigateTab: (tab: TabKey, subTab?: string) => void;
  onOpenCheckIn: () => void;
  onStartFocus: () => void;
  recentDailyRecords: DailyRecord[];
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  overallProgression,
  sleepProgression,
  exerciseProgression,
  studyProgression,
  todayRecord,
  latestSleep,
  todayExercise,
  todayStudySessions,
  currentStreak,
  bestStreak,
  weeklyAvgScore,
  monthlyProgressPercent,
  onNavigateTab,
  onOpenCheckIn,
  onStartFocus,
  recentDailyRecords,
}) => {
  // Sparkline generator
  const renderSparkline = (values: number[], strokeColor: string) => {
    if (values.length < 2) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const width = 64;
    const height = 24;
    const points = values
      .map((val, idx) => {
        const x = (idx / (values.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
      </svg>
    );
  };

  const sleepTrend = recentDailyRecords.slice(-7).map((d) => d.sleepScore || 70);
  const exerciseTrend = recentDailyRecords.slice(-7).map((d) => d.exerciseScore || 60);
  const studyTrend = recentDailyRecords.slice(-7).map((d) => d.studyScore || 75);

  const totalStudyMinutesToday = todayStudySessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  // Date and greeting
  const todayDate = new Date();
  const dateStrFormatted = todayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const currentHour = todayDate.getHours();
  const greeting = currentHour < 12 ? 'Morning' : currentHour < 17 ? 'Afternoon' : 'Evening';

  // Day of week streak representation
  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const currentDayIndex = (todayDate.getDay() + 6) % 7; // 0 for Mon, 6 for Sun

  return (
    <div className="space-y-6 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* IMMERSIVE TOP GREETING HEADER */}
      <div className="flex justify-between items-end px-1">
        <div>
          <h2 className="text-[#A1A1AA] text-xs font-semibold tracking-widest uppercase mb-1">
            {dateStrFormatted}
          </h2>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            {greeting}, User
          </h1>
        </div>
        <div className="flex items-center space-x-4 sm:space-x-6">
          <div className="text-right">
            <div className="text-[#A1A1AA] text-[10px] uppercase tracking-tighter">Overall Rating</div>
            <div className="text-2xl font-mono font-bold text-[#22C55E]">
              {todayRecord.overallScore}/100
            </div>
          </div>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] border-2 border-white/10 flex items-center justify-center text-white text-base font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            A
          </div>
        </div>
      </div>

      {/* OVERALL LEVEL PROGRESS CARD (IMMERSIVE BANNER WITH AMBIENT GLOW) */}
      <div
        id="home-overall-level-card"
        onClick={() => {
          soundManager.playHapticTap();
          onNavigateTab('progress');
        }}
        className="bg-[#18181B]/50 border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-2xl hover:border-white/10 cursor-pointer group transition-all"
      >
        <div className="flex justify-between items-end mb-4 relative z-10">
          <div>
            <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-widest block mb-0.5">
              Level {overallProgression.level}
            </span>
            <h3 className="text-2xl font-bold text-white tracking-tight">{overallProgression.title}</h3>
          </div>
          <div className="text-sm text-[#A1A1AA] font-mono">
            {overallProgression.currentLevelXP.toLocaleString()} / {overallProgression.nextLevelXP.toLocaleString()} XP
          </div>
        </div>

        {/* Glowing Progress Bar */}
        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden relative z-10">
          <div
            className="h-full bg-gradient-to-r from-[#3B82F6] via-[#8B5CF6] to-[#EC4899] shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all duration-700 ease-out"
            style={{
              width: `${Math.min(
                100,
                Math.max(5, (overallProgression.currentLevelXP / overallProgression.nextLevelXP) * 100)
              )}%`,
            }}
          />
        </div>

        {/* Ambient Glow Orb */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#3B82F6]/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Micro Stats Row */}
        <div className="grid grid-cols-4 gap-2 pt-4 mt-4 border-t border-white/5 text-center relative z-10">
          <div>
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">Streak</div>
            <div className="text-sm font-bold text-white flex items-center justify-center gap-0.5 mt-0.5">
              <span>{currentStreak}d</span>
              <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
            </div>
          </div>
          <div>
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">Best</div>
            <div className="text-sm font-bold text-zinc-200 mt-0.5">{bestStreak}d</div>
          </div>
          <div>
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">7d Avg</div>
            <div className="text-sm font-bold text-[#38BDF8] mt-0.5">{weeklyAvgScore}</div>
          </div>
          <div>
            <div className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">Month</div>
            <div className="text-sm font-bold text-[#22C55E] mt-0.5">{monthlyProgressPercent}%</div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          id="home-quick-checkin-btn"
          onClick={() => {
            soundManager.playHapticTap();
            onOpenCheckIn();
          }}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white text-xs font-semibold shadow-lg active:scale-98 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span>Daily Check-In</span>
        </button>

        <button
          id="home-quick-focus-btn"
          onClick={() => {
            soundManager.playHapticTap();
            onStartFocus();
          }}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white text-xs font-semibold shadow-lg active:scale-98 transition-all"
        >
          <Play className="w-3.5 h-3.5 text-[#8B5CF6] fill-[#8B5CF6]" />
          <span>Start Focus</span>
        </button>

        <button
          id="home-quick-log-btn"
          onClick={() => {
            soundManager.playHapticTap();
            onNavigateTab('track');
          }}
          className="flex-1 min-w-[120px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#18181B] hover:bg-[#27272A] border border-white/10 text-white text-xs font-semibold shadow-lg active:scale-98 transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-[#22C55E]" />
          <span>Log Activity</span>
        </button>
      </div>

      {/* 3 FUNDAMENTAL PILLARS (IMMERSIVE CARDS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            Core Pillars Progression
          </h3>
          <span className="text-[10px] text-[#52525B] font-semibold uppercase tracking-wider">
            Tap to track
          </span>
        </div>

        {/* GRID OF 3 PILLAR CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. SLEEP CARD */}
          <div
            id="home-card-sleep"
            onClick={() => {
              soundManager.playHapticTap();
              onNavigateTab('track', 'sleep');
            }}
            className="bg-[#121214] border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-2xl hover:border-[#0EA5E9]/40 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-[#0EA5E9]/10 rounded-2xl flex items-center justify-center border border-[#0EA5E9]/20 text-[#38BDF8]">
                  <Moon className="w-6 h-6 stroke-[#38BDF8]" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">
                    Level {sleepProgression.level}
                  </span>
                  <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0EA5E9]"
                      style={{
                        width: `${Math.min(
                          100,
                          (sleepProgression.currentLevelXP / sleepProgression.nextLevelXP) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold mb-0.5 text-white">Sleep</h4>
              <p className="text-[#A1A1AA] text-sm">Deep Recovery</p>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-mono font-bold mb-1 text-white">
                {latestSleep
                  ? `${Math.floor(latestSleep.durationMinutes / 60)}h ${latestSleep.durationMinutes % 60}m`
                  : '7h 45m'}
              </div>
              <div className="flex items-center text-xs text-[#22C55E] space-x-1 font-medium mb-3">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>12% consistency</span>
              </div>

              {/* Vertical mini bars reflecting trend */}
              <div className="h-12 w-full flex items-end space-x-1.5 pt-2">
                <div className="w-full h-[40%] bg-[#0EA5E9]/20 rounded-sm" />
                <div className="w-full h-[55%] bg-[#0EA5E9]/20 rounded-sm" />
                <div className="w-full h-[75%] bg-[#0EA5E9]/20 rounded-sm" />
                <div className="w-full h-[30%] bg-[#0EA5E9]/20 rounded-sm" />
                <div className="w-full h-[85%] bg-[#0EA5E9] rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.5)]" />
              </div>
            </div>
          </div>

          {/* 2. EXERCISE CARD */}
          <div
            id="home-card-exercise"
            onClick={() => {
              soundManager.playHapticTap();
              onNavigateTab('track', 'exercise');
            }}
            className="bg-[#121214] border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-2xl hover:border-[#F43F5E]/40 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-[#F43F5E]/10 rounded-2xl flex items-center justify-center border border-[#F43F5E]/20 text-[#FB7185]">
                  <Dumbbell className="w-6 h-6 stroke-[#FB7185]" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">
                    Level {exerciseProgression.level}
                  </span>
                  <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#F43F5E]"
                      style={{
                        width: `${Math.min(
                          100,
                          (exerciseProgression.currentLevelXP / exerciseProgression.nextLevelXP) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold mb-0.5 text-white">Exercise</h4>
              <p className="text-[#A1A1AA] text-sm">Peak Performance</p>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-mono font-bold mb-1 text-white">
                {todayExercise ? `${todayExercise.durationMinutes} min` : '520'} <span className="text-sm text-[#A1A1AA] font-normal">{todayExercise ? '' : 'kcal'}</span>
              </div>
              <div className="flex items-center text-xs text-[#22C55E] space-x-1 font-medium mb-3">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>New record (Volume)</span>
              </div>

              {/* Vertical mini bars reflecting trend */}
              <div className="h-12 w-full flex items-end space-x-1.5 pt-2">
                <div className="w-full h-[30%] bg-[#F43F5E]/20 rounded-sm" />
                <div className="w-full h-[45%] bg-[#F43F5E]/20 rounded-sm" />
                <div className="w-full h-[60%] bg-[#F43F5E]/20 rounded-sm" />
                <div className="w-full h-[90%] bg-[#F43F5E] rounded-sm shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <div className="w-full h-[40%] bg-[#F43F5E]/20 rounded-sm" />
              </div>
            </div>
          </div>

          {/* 3. STUDY / DEEP WORK CARD */}
          <div
            id="home-card-study"
            onClick={() => {
              soundManager.playHapticTap();
              onNavigateTab('track', 'study');
            }}
            className="bg-[#121214] border border-white/10 rounded-[32px] p-6 flex flex-col justify-between shadow-2xl hover:border-[#8B5CF6]/40 transition-all cursor-pointer group"
          >
            <div>
              <div className="flex justify-between items-start mb-5">
                <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center border border-[#8B5CF6]/20 text-[#A78BFA]">
                  <Brain className="w-6 h-6 stroke-[#A78BFA]" />
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-[#A1A1AA] uppercase tracking-wider mb-1">
                    Level {studyProgression.level}
                  </span>
                  <div className="h-1 w-16 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#8B5CF6]"
                      style={{
                        width: `${Math.min(
                          100,
                          (studyProgression.currentLevelXP / studyProgression.nextLevelXP) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold mb-0.5 text-white">Study</h4>
              <p className="text-[#A1A1AA] text-sm">Deep Focus</p>
            </div>

            <div className="mt-6">
              <div className="text-3xl font-mono font-bold mb-1 text-white">
                {totalStudyMinutesToday > 0
                  ? `${Math.floor(totalStudyMinutesToday / 60)}h ${totalStudyMinutesToday % 60}m`
                  : '3h 12m'}
              </div>
              <div className="flex items-center text-xs text-[#22C55E] space-x-1 font-medium mb-3">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>+18% focus ratio</span>
              </div>

              {/* Vertical mini bars reflecting trend */}
              <div className="h-12 w-full flex items-end space-x-1.5 pt-2">
                <div className="w-full h-[90%] bg-[#8B5CF6]/20 rounded-sm" />
                <div className="w-full h-[85%] bg-[#8B5CF6]/20 rounded-sm" />
                <div className="w-full h-[65%] bg-[#8B5CF6]/20 rounded-sm" />
                <div className="w-full h-[40%] bg-[#8B5CF6] rounded-sm shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                <div className="w-full h-[20%] bg-[#8B5CF6]/20 rounded-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WEEKLY STREAK CARD (FROM DESIGN HTML) */}
      <div className="bg-[#18181B] border border-white/10 rounded-3xl p-6 flex items-center justify-between shadow-2xl">
        <div>
          <h5 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-[0.2em] mb-4">
            Weekly Streak
          </h5>
          <div className="flex space-x-2 sm:space-x-3">
            {daysOfWeek.map((day, idx) => {
              const isPast = idx < currentDayIndex;
              const isToday = idx === currentDayIndex;
              const isFuture = idx > currentDayIndex;

              if (isPast) {
                return (
                  <div key={day} className="flex flex-col items-center space-y-1.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/50 flex items-center justify-center text-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.3)]">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] text-[#A1A1AA] font-bold">{day}</span>
                  </div>
                );
              }

              if (isToday) {
                return (
                  <div key={day} className="flex flex-col items-center space-y-1.5">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 border border-white/30 flex items-center justify-center text-white shadow-md">
                      <span className="text-xs font-bold font-mono">{currentStreak}</span>
                    </div>
                    <span className="text-[10px] text-white font-bold underline">{day}</span>
                  </div>
                );
              }

              return (
                <div key={day} className="flex flex-col items-center space-y-1.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-30" />
                  <span className="text-[10px] text-[#52525B] font-bold">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-right pl-3">
          <div className="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-widest mb-1">
            Current Streak
          </div>
          <div className="text-3xl sm:text-4xl font-black italic tracking-tighter text-white">
            {currentStreak}{' '}
            <span className="text-sm uppercase not-italic font-bold tracking-normal ml-1 text-[#A1A1AA]">
              Days
            </span>
          </div>
        </div>
      </div>

      {/* TODAY'S TARGET GOALS SECTION */}
      <div className="bg-[#121214] border border-white/10 rounded-[32px] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">
            Daily Targets
          </h3>
          <span className="text-[11px] font-mono font-semibold text-[#22C55E]">
            2 of 3 Met
          </span>
        </div>

        {/* Sleep Goal Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-[#38BDF8]" /> Sleep Target
            </span>
            <span className="text-[#A1A1AA] font-mono">7h 25m / 7h 30m</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0EA5E9] h-full rounded-full shadow-[0_0_8px_rgba(14,165,233,0.5)]"
              style={{ width: '98%' }}
            />
          </div>
        </div>

        {/* Exercise Goal Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-[#FB7185]" /> Exercise Target
            </span>
            <span className="text-[#FB7185] font-mono font-semibold">52 / 45 min (115%)</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#F43F5E] h-full rounded-full shadow-[0_0_8px_rgba(244,63,94,0.5)]"
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Study Goal Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-zinc-300 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#A78BFA]" /> Deep Focus Target
            </span>
            <span className="text-[#A78BFA] font-mono font-semibold">3h 15m / 3h 00m</span>
          </div>
          <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#8B5CF6] h-full rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]"
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
