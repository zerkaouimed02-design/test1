import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sparkles, CheckCircle2, AlertCircle, Brain, Target, Coffee } from 'lucide-react';
import { FocusSessionType, Project, StudySession } from '../types';
import { calculateProductivityScore } from '../services/scoringEngine';
import { soundManager } from '../services/soundEffects';

interface FocusTimerProps {
  projects: Project[];
  activeProject?: Project;
  onSaveSession: (session: StudySession) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  projects,
  activeProject,
  onSaveSession,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(activeProject?.id || projects[0]?.id || '');
  const [sessionTitle, setSessionTitle] = useState('Deep Work Block');
  const [sessionType, setSessionType] = useState<FocusSessionType>('deep_work');
  const [targetDurationMinutes, setTargetDurationMinutes] = useState(50);

  // Timer State
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Rating Modal State after session completes
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [productivityRating, setProductivityRating] = useState(8);
  const [focusQuality, setFocusQuality] = useState(9);
  const [energyRating, setEnergyRating] = useState(8);
  const [difficultyRating, setDifficultyRating] = useState(7);
  const [distractionFactors, setDistractionFactors] = useState<string[]>([]);
  const [tasksCompleted, setTasksCompleted] = useState(1);
  const [sessionNotes, setSessionNotes] = useState('');

  const totalSeconds = targetDurationMinutes * 60;
  const progressRatio = (totalSeconds - secondsRemaining) / totalSeconds;

  const DISTRACTION_OPTIONS = [
    'Phone notifications',
    'Social media',
    'Noise / environment',
    'Mental fatigue',
    'Hunger / physical',
    'Multitasking',
  ];

  // Set preset modes
  const handlePresetSelect = (type: FocusSessionType, minutes: number, defaultTitle: string) => {
    soundManager.playHapticTap();
    setIsActive(false);
    setSessionType(type);
    setTargetDurationMinutes(minutes);
    setSecondsRemaining(minutes * 60);
    setSessionTitle(defaultTitle);
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: any = null;
    if (isActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      setIsActive(false);
      setIsCompleted(true);
      soundManager.playTimerBell();
      setShowRatingModal(true);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const toggleTimer = () => {
    soundManager.playHapticTap();
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    soundManager.playHapticTap();
    setIsActive(false);
    setSecondsRemaining(targetDurationMinutes * 60);
  };

  const finishSessionEarly = () => {
    soundManager.playHapticTap();
    setIsActive(false);
    setShowRatingModal(true);
  };

  const toggleDistraction = (tag: string) => {
    soundManager.playHapticTap();
    if (distractionFactors.includes(tag)) {
      setDistractionFactors(distractionFactors.filter((t) => t !== tag));
    } else {
      setDistractionFactors([...distractionFactors, tag]);
    }
  };

  const handleSaveRatedSession = () => {
    soundManager.playSuccessChime();
    const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60));
    const proj = projects.find((p) => p.id === selectedProjectId);

    const todayStr = new Date().toISOString().split('T')[0];

    // Calculate score & XP
    const { score, xpEarned } = calculateProductivityScore({
      totalFocusMinutes: elapsedMinutes,
      targetFocusMinutes: targetDurationMinutes,
      sessions: [
        {
          id: 'temp',
          date: todayStr,
          title: sessionTitle,
          durationMinutes: elapsedMinutes,
          sessionType,
          productivityRating,
          focusQuality,
          energyRating,
          difficultyRating,
          distractionFactors,
          tasksCompleted,
          notes: sessionNotes,
          score: 0,
          xpEarned: 0,
        },
      ],
      tasksCompleted,
      streakDays: 5,
    });

    const session: StudySession = {
      id: `study_${Date.now()}`,
      date: todayStr,
      projectId: proj?.id,
      projectName: proj?.name || 'General Focus',
      title: sessionTitle,
      durationMinutes: elapsedMinutes,
      sessionType,
      productivityRating,
      focusQuality,
      energyRating,
      difficultyRating,
      distractionFactors,
      tasksCompleted,
      notes: sessionNotes,
      score,
      xpEarned,
    };

    onSaveSession(session);
    setShowRatingModal(false);
    resetTimer();
  };

  const minutesDisplay = Math.floor(secondsRemaining / 60).toString().padStart(2, '0');
  const secondsDisplay = (secondsRemaining % 60).toString().padStart(2, '0');

  // SVG Circular progress math
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* PRESET SESSION TYPE PICKER */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={() => handlePresetSelect('deep_work', 50, 'Deep Work Focus')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            targetDurationMinutes === 50 && sessionType === 'deep_work'
              ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
          }`}
        >
          Deep Work (50m)
        </button>

        <button
          onClick={() => handlePresetSelect('pomodoro', 25, 'Pomodoro Sprint')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            targetDurationMinutes === 25 && sessionType === 'pomodoro'
              ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
          }`}
        >
          Pomodoro (25m)
        </button>

        <button
          onClick={() => handlePresetSelect('custom', 15, 'Short Review')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            targetDurationMinutes === 15
              ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
          }`}
        >
          Short (15m)
        </button>

        <button
          onClick={() => handlePresetSelect('custom', 5, 'Quick Reset')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
            targetDurationMinutes === 5
              ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
          }`}
        >
          Break (5m)
        </button>
      </div>

      {/* PROJECT & SESSION TITLE PICKER */}
      <div className="rounded-[32px] bg-[#121214] border border-white/10 p-5 space-y-3.5 text-xs shadow-2xl">
        <div>
          <label className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block mb-1.5">Target Project</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.completedHours}h / {p.targetHours}h)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block mb-1.5">Session Subject / Focus Target</label>
          <input
            type="text"
            value={sessionTitle}
            onChange={(e) => setSessionTitle(e.target.value)}
            placeholder="e.g. Chapter 4 Problem Set"
            className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
          />
        </div>
      </div>

      {/* CIRCULAR TIMER DISPLAY */}
      <div className="relative flex flex-col items-center justify-center py-4">
        <svg className="w-68 h-68 -rotate-90 transform">
          {/* Background circle */}
          <circle
            cx="136"
            cy="136"
            r={radius}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx="136"
            cy="136"
            r={radius}
            stroke="#3B82F6"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-linear drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]"
          />
        </svg>

        {/* Center Countdown Display */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-black text-white font-mono tracking-tight">
            {minutesDisplay}:{secondsDisplay}
          </span>
          <span className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest mt-1.5">
            {isActive ? 'IN FLOW' : secondsRemaining === 0 ? 'COMPLETED' : 'READY'}
          </span>
          <span className="text-[11px] text-[#A1A1AA] mt-1 truncate max-w-[180px]">
            {sessionTitle}
          </span>
        </div>
      </div>

      {/* TIMER CONTROLS */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={resetTimer}
          className="p-4 rounded-2xl bg-[#18181B] border border-white/10 text-[#A1A1AA] hover:text-white hover:bg-white/10 transition-all active:scale-95 shadow-sm"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          id="focus-timer-toggle-btn"
          onClick={toggleTimer}
          className="px-8 py-4 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white font-black text-base flex items-center gap-2.5 shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all active:scale-95"
        >
          {isActive ? (
            <>
              <Pause className="w-5 h-5 fill-white" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>{secondsRemaining < totalSeconds ? 'Resume' : 'Start Focus'}</span>
            </>
          )}
        </button>

        {secondsRemaining < totalSeconds && (
          <button
            onClick={finishSessionEarly}
            className="p-4 rounded-2xl bg-[#18181B] border border-white/10 text-[#22C55E] hover:bg-white/10 transition-all active:scale-95 shadow-sm"
            title="Log elapsed time now"
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* POST-SESSION RATING MODAL (SECTIONS 12 & 13) */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#60A5FA]" /> Focus Session Completed
                </h3>
                <p className="text-xs text-[#A1A1AA]">Rate your session to calculate productivity score</p>
              </div>
              <span className="text-xs font-bold text-[#22C55E] font-mono bg-white/5 px-2.5 py-1 rounded-lg">
                {Math.max(1, Math.round((totalSeconds - secondsRemaining) / 60))} mins logged
              </span>
            </div>

            {/* PRODUCTIVITY RATING (1-10) */}
            <div className="space-y-1.5 bg-[#18181B] p-3.5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Productivity Rating</span>
                <span className="text-[#60A5FA] font-bold font-mono">{productivityRating} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={productivityRating}
                onChange={(e) => setProductivityRating(parseInt(e.target.value, 10))}
                className="w-full accent-[#3B82F6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* FOCUS QUALITY (1-10) */}
            <div className="space-y-1.5 bg-[#18181B] p-3.5 rounded-2xl border border-white/5">
              <div className="flex justify-between text-xs">
                <span className="text-white font-semibold">Focus Quality / Depth</span>
                <span className="text-[#60A5FA] font-bold font-mono">{focusQuality} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={focusQuality}
                onChange={(e) => setFocusQuality(parseInt(e.target.value, 10))}
                className="w-full accent-[#3B82F6] h-2 bg-white/10 rounded-lg cursor-pointer"
              />
            </div>

            {/* ENERGY & DIFFICULTY */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#18181B] p-3 rounded-2xl border border-white/5">
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Energy: <span className="text-white font-mono">{energyRating}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyRating}
                  onChange={(e) => setEnergyRating(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 h-2 bg-white/10 rounded-lg"
                />
              </div>

              <div className="bg-[#18181B] p-3 rounded-2xl border border-white/5">
                <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Difficulty: <span className="text-white font-mono">{difficultyRating}/10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={difficultyRating}
                  onChange={(e) => setDifficultyRating(parseInt(e.target.value, 10))}
                  className="w-full accent-[#8B5CF6] h-2 bg-white/10 rounded-lg"
                />
              </div>
            </div>

            {/* WHAT AFFECTED PRODUCTIVITY? (DISTRACTIONS) */}
            <div>
              <label className="text-[10px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-2">
                What affected your focus? (Optional)
              </label>
              <div className="flex flex-wrap gap-2">
                {DISTRACTION_OPTIONS.map((opt) => {
                  const isSel = distractionFactors.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleDistraction(opt)}
                      className={`text-[11px] px-3 py-1.5 rounded-xl border transition-all ${
                        isSel
                          ? 'bg-[#F43F5E]/20 text-[#FB7185] border-[#F43F5E]/40 shadow-sm'
                          : 'bg-[#18181B] text-[#A1A1AA] border-white/10 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TASKS COMPLETED */}
            <div className="flex items-center justify-between bg-[#18181B] p-3 rounded-2xl border border-white/10">
              <span className="text-xs font-semibold text-white">Tasks Completed in Block</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTasksCompleted(Math.max(0, tasksCompleted - 1))}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20"
                >
                  -
                </button>
                <span className="font-mono text-xs font-bold text-white w-5 text-center">{tasksCompleted}</span>
                <button
                  type="button"
                  onClick={() => setTasksCompleted(tasksCompleted + 1)}
                  className="w-7 h-7 rounded-lg bg-white/10 text-white font-bold text-xs hover:bg-white/20"
                >
                  +
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRatingModal(false)}
                className="flex-1 py-3 rounded-2xl bg-[#18181B] hover:bg-white/10 border border-white/10 text-[#A1A1AA] hover:text-white text-xs font-semibold transition-colors"
              >
                Discard
              </button>
              <button
                type="button"
                id="focus-modal-award-xp-btn"
                onClick={handleSaveRatedSession}
                className="flex-2 py-3 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calculate Score & Award XP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
