import React, { useState } from 'react';
import { Moon, Dumbbell, Brain, Play } from 'lucide-react';
import { ExercisePR, ExerciseSession, Project, SleepRecord, StudySession } from '../types';
import { SleepTracker } from './SleepTracker';
import { ExerciseTracker } from './ExerciseTracker';
import { StudyTracker } from './StudyTracker';
import { FocusTimer } from './FocusTimer';
import { soundManager } from '../services/soundEffects';

interface TrackingViewProps {
  initialSubTab?: 'sleep' | 'exercise' | 'study' | 'focus';
  latestSleep?: SleepRecord;
  exercisePRs: ExercisePR[];
  projects: Project[];
  healthKitConnected: boolean;
  targetBedtime: string;
  targetWakeTime: string;
  targetDurationMinutes: number;
  onSaveSleep: (record: SleepRecord) => void;
  onSaveExercise: (session: ExerciseSession, updatedPRs?: ExercisePR[]) => void;
  onSaveStudySession: (session: StudySession) => void;
  onUpdateProjects: (projects: Project[]) => void;
}

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialSubTab = 'sleep',
  latestSleep,
  exercisePRs,
  projects,
  healthKitConnected,
  targetBedtime,
  targetWakeTime,
  targetDurationMinutes,
  onSaveSleep,
  onSaveExercise,
  onSaveStudySession,
  onUpdateProjects,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'sleep' | 'exercise' | 'study' | 'focus'>(initialSubTab);
  const [focusProject, setFocusProject] = useState<Project | undefined>(undefined);

  const handleLaunchProjectFocus = (project: Project) => {
    setFocusProject(project);
    setActiveSubTab('focus');
  };

  return (
    <div className="space-y-6 pb-28 max-w-2xl mx-auto px-4 pt-3">
      {/* HEADER */}
      <div>
        <span className="text-xs font-semibold text-[#3B82F6] uppercase tracking-widest block mb-1">
          Activity & Logging
        </span>
        <h2 className="text-3xl font-bold text-white tracking-tight">Session Tracking</h2>
        <p className="text-sm text-[#A1A1AA] mt-1">Log measurable real-life behavior to earn XP and level up</p>
      </div>

      {/* 4 SUB-TABS */}
      <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#18181B] border border-white/10 shadow-xl">
        <button
          id="track-tab-sleep"
          onClick={() => {
            soundManager.playHapticTap();
            setActiveSubTab('sleep');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'sleep'
              ? 'bg-[#0EA5E9] text-white shadow-[0_0_15px_rgba(14,165,233,0.4)]'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Sleep</span>
        </button>

        <button
          id="track-tab-exercise"
          onClick={() => {
            soundManager.playHapticTap();
            setActiveSubTab('exercise');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'exercise'
              ? 'bg-[#F43F5E] text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Exercise</span>
        </button>

        <button
          id="track-tab-study"
          onClick={() => {
            soundManager.playHapticTap();
            setActiveSubTab('study');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'study'
              ? 'bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Projects</span>
        </button>

        <button
          id="track-tab-focus"
          onClick={() => {
            soundManager.playHapticTap();
            setActiveSubTab('focus');
          }}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'focus'
              ? 'bg-[#3B82F6] text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white hover:bg-white/5'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Focus</span>
        </button>
      </div>

      {/* ACTIVE SUB-TAB CONTENT */}
      {activeSubTab === 'sleep' && (
        <SleepTracker
          latestRecord={latestSleep}
          targetBedtime={targetBedtime}
          targetWakeTime={targetWakeTime}
          targetDurationMinutes={targetDurationMinutes}
          healthKitConnected={healthKitConnected}
          onSaveRecord={onSaveSleep}
        />
      )}

      {activeSubTab === 'exercise' && (
        <ExerciseTracker
          prs={exercisePRs}
          healthKitConnected={healthKitConnected}
          onSaveSession={onSaveExercise}
        />
      )}

      {activeSubTab === 'study' && (
        <StudyTracker
          projects={projects}
          onUpdateProjects={onUpdateProjects}
          onLaunchFocusTimer={handleLaunchProjectFocus}
        />
      )}

      {activeSubTab === 'focus' && (
        <FocusTimer
          projects={projects}
          activeProject={focusProject}
          onSaveSession={onSaveStudySession}
        />
      )}
    </div>
  );
};
