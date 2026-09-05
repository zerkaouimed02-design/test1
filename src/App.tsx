import React, { useState, useEffect } from 'react';
import { NavbarHeader } from './components/NavbarHeader';
import { TabBar, TabKey } from './components/TabBar';
import { HomeDashboard } from './components/HomeDashboard';
import { ProgressionLadderView } from './components/ProgressionLadderView';
import { TrackingView } from './components/TrackingView';
import { InsightsView } from './components/InsightsView';
import { ProfileView } from './components/ProfileView';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { OnboardingModal } from './components/OnboardingModal';
import { TestRunnerModal } from './components/TestRunnerModal';
import { SwiftCodeInspectorModal } from './components/SwiftCodeInspectorModal';
import { CalendarModal } from './components/CalendarModal';
import { LevelUpCelebrationModal } from './components/LevelUpCelebrationModal';
import { storageService } from './services/storageService';
import { evaluateLevel, calculateOverallScore, calculateStreak } from './services/progressionEngine';
import { generateCorrelationInsights, generateWeeklyReview, generateMonthlyReview } from './services/analyticsEngine';
import { soundManager } from './services/soundEffects';
import {
  DailyRecord,
  ExercisePR,
  ExerciseSession,
  Project,
  SleepRecord,
  StudySession,
  UserProfile,
  XPTransaction,
} from './types';

export default function App() {
  const [appState, setAppState] = useState(() => storageService.loadState());
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [trackingSubTab, setTrackingSubTab] = useState<'sleep' | 'exercise' | 'study' | 'focus'>('sleep');

  // Modals state
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showSwiftCodeModal, setShowSwiftCodeModal] = useState(false);
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<DailyRecord | null>(null);
  const [levelUpData, setLevelUpData] = useState<{
    newLevel: number;
    newTitle: string;
    category: string;
    badge: string;
  } | null>(null);

  // Sync state to local persistence whenever modified
  useEffect(() => {
    storageService.saveState(appState);
  }, [appState]);

  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Latest records
  const latestSleep = appState.sleepRecords[appState.sleepRecords.length - 1];
  const todayExercise = appState.exerciseSessions.find((s) => s.date === todayStr);
  const todayStudySessions = appState.studySessions.filter((s) => s.date === todayStr);
  const todayRecord = appState.dailyRecords[appState.dailyRecords.length - 1] || {
    id: 'rec_today',
    date: todayStr,
    overallScore: 84,
    sleepScore: 84,
    exerciseScore: 85,
    studyScore: 87,
    sleepDurationMinutes: 445,
    exerciseDurationMinutes: 52,
    studyFocusMinutes: 195,
    totalXpEarned: 240,
    streakKept: true,
  };

  // Streak calculations
  const { currentStreak, bestStreak } = calculateStreak(appState.dailyRecords);

  // Weekly & Monthly analytics
  const weeklyAvgScore = Math.round(
    appState.dailyRecords.slice(-7).reduce((acc, r) => acc + r.overallScore, 0) /
      Math.max(1, Math.min(7, appState.dailyRecords.length))
  );

  const correlationInsights = generateCorrelationInsights(
    appState.dailyRecords,
    appState.sleepRecords,
    appState.exerciseSessions,
    appState.studySessions
  );

  const weeklyReview = generateWeeklyReview(appState.dailyRecords);
  const monthlyReview = generateMonthlyReview(appState.dailyRecords);

  // Navigation helper
  const handleNavigateTab = (tab: TabKey, subTab?: string) => {
    setActiveTab(tab);
    if (subTab && (subTab === 'sleep' || subTab === 'exercise' || subTab === 'study' || subTab === 'focus')) {
      setTrackingSubTab(subTab as any);
    }
  };

  // Check for Level Up
  const checkLevelUp = (oldXP: number, newXP: number, category: string) => {
    const oldEval = evaluateLevel(oldXP);
    const newEval = evaluateLevel(newXP);
    if (newEval.level > oldEval.level) {
      setLevelUpData({
        newLevel: newEval.level,
        newTitle: newEval.title,
        category,
        badge: newEval.badge,
      });
    }
  };

  // Handle Save Sleep
  const handleSaveSleep = (record: SleepRecord) => {
    const oldSleepXP = appState.sleepProgression.totalXP;
    const newSleepXP = oldSleepXP + record.xpEarned;
    checkLevelUp(oldSleepXP, newSleepXP, 'Sleep');

    const newSleepProg = evaluateLevel(newSleepXP);

    const oldOverallXP = appState.overallProgression.totalXP;
    const newOverallXP = oldOverallXP + record.xpEarned;
    checkLevelUp(oldOverallXP, newOverallXP, 'Overall');
    const newOverallProg = evaluateLevel(newOverallXP);

    const tx: XPTransaction = {
      id: `tx_${Date.now()}`,
      category: 'sleep',
      amount: record.xpEarned,
      reason: `Sleep logged: ${record.score}/100 score`,
      timestamp: new Date().toISOString(),
    };

    // Update today daily record
    const updatedDailyRecords = [...appState.dailyRecords];
    const todayIndex = updatedDailyRecords.findIndex((d) => d.date === record.date);
    const prevOverall = todayIndex >= 0 ? updatedDailyRecords[todayIndex] : todayRecord;

    const newOverallScore = calculateOverallScore(
      record.score,
      prevOverall.exerciseScore || 80,
      prevOverall.studyScore || 85
    );

    const newDailyRecord: DailyRecord = {
      ...prevOverall,
      date: record.date,
      sleepScore: record.score,
      sleepDurationMinutes: record.durationMinutes,
      overallScore: newOverallScore,
      totalXpEarned: (prevOverall.totalXpEarned || 0) + record.xpEarned,
      streakKept: true,
    };

    if (todayIndex >= 0) {
      updatedDailyRecords[todayIndex] = newDailyRecord;
    } else {
      updatedDailyRecords.push(newDailyRecord);
    }

    setAppState({
      ...appState,
      sleepRecords: [...appState.sleepRecords.filter((r) => r.date !== record.date), record],
      dailyRecords: updatedDailyRecords,
      sleepProgression: {
        category: 'sleep',
        level: newSleepProg.level,
        totalXP: newSleepXP,
        currentLevelXP: newSleepProg.currentLevelXP,
        nextLevelXP: newSleepProg.nextLevelXP,
        title: newSleepProg.title,
        badge: newSleepProg.badge,
      },
      overallProgression: {
        category: 'overall',
        level: newOverallProg.level,
        totalXP: newOverallXP,
        currentLevelXP: newOverallProg.currentLevelXP,
        nextLevelXP: newOverallProg.nextLevelXP,
        title: newOverallProg.title,
        badge: newOverallProg.badge,
      },
      xpTransactions: [...appState.xpTransactions, tx],
    });
  };

  // Handle Save Exercise Session
  const handleSaveExercise = (session: ExerciseSession, updatedPRs?: ExercisePR[]) => {
    const oldExXP = appState.exerciseProgression.totalXP;
    const newExXP = oldExXP + session.xpEarned;
    checkLevelUp(oldExXP, newExXP, 'Exercise');
    const newExProg = evaluateLevel(newExXP);

    const oldOverallXP = appState.overallProgression.totalXP;
    const newOverallXP = oldOverallXP + session.xpEarned;
    checkLevelUp(oldOverallXP, newOverallXP, 'Overall');
    const newOverallProg = evaluateLevel(newOverallXP);

    const tx: XPTransaction = {
      id: `tx_${Date.now()}`,
      category: 'exercise',
      amount: session.xpEarned,
      reason: `Workout completed: ${session.title}`,
      timestamp: new Date().toISOString(),
    };

    const updatedDailyRecords = [...appState.dailyRecords];
    const todayIndex = updatedDailyRecords.findIndex((d) => d.date === session.date);
    const prevOverall = todayIndex >= 0 ? updatedDailyRecords[todayIndex] : todayRecord;

    const newOverallScore = calculateOverallScore(
      prevOverall.sleepScore,
      session.score,
      prevOverall.studyScore || 85
    );

    const newDailyRecord: DailyRecord = {
      ...prevOverall,
      date: session.date,
      exerciseScore: session.score,
      exerciseDurationMinutes: (prevOverall.exerciseDurationMinutes || 0) + session.durationMinutes,
      overallScore: newOverallScore,
      totalXpEarned: (prevOverall.totalXpEarned || 0) + session.xpEarned,
      streakKept: true,
    };

    if (todayIndex >= 0) {
      updatedDailyRecords[todayIndex] = newDailyRecord;
    } else {
      updatedDailyRecords.push(newDailyRecord);
    }

    setAppState({
      ...appState,
      exerciseSessions: [...appState.exerciseSessions, session],
      exercisePRs: updatedPRs || appState.exercisePRs,
      dailyRecords: updatedDailyRecords,
      exerciseProgression: {
        category: 'exercise',
        level: newExProg.level,
        totalXP: newExXP,
        currentLevelXP: newExProg.currentLevelXP,
        nextLevelXP: newExProg.nextLevelXP,
        title: newExProg.title,
        badge: newExProg.badge,
      },
      overallProgression: {
        category: 'overall',
        level: newOverallProg.level,
        totalXP: newOverallXP,
        currentLevelXP: newOverallProg.currentLevelXP,
        nextLevelXP: newOverallProg.nextLevelXP,
        title: newOverallProg.title,
        badge: newOverallProg.badge,
      },
      xpTransactions: [...appState.xpTransactions, tx],
    });
  };

  // Handle Save Study Session
  const handleSaveStudySession = (session: StudySession) => {
    const oldStudyXP = appState.studyProgression.totalXP;
    const newStudyXP = oldStudyXP + session.xpEarned;
    checkLevelUp(oldStudyXP, newStudyXP, 'Study');
    const newStudyProg = evaluateLevel(newStudyXP);

    const oldOverallXP = appState.overallProgression.totalXP;
    const newOverallXP = oldOverallXP + session.xpEarned;
    checkLevelUp(oldOverallXP, newOverallXP, 'Overall');
    const newOverallProg = evaluateLevel(newOverallXP);

    const tx: XPTransaction = {
      id: `tx_${Date.now()}`,
      category: 'study',
      amount: session.xpEarned,
      reason: `Focus session: ${session.title}`,
      timestamp: new Date().toISOString(),
    };

    // Update project completed hours
    const updatedProjects = appState.projects.map((p) => {
      if (p.id === session.projectId) {
        return {
          ...p,
          completedHours: +(p.completedHours + session.durationMinutes / 60).toFixed(1),
        };
      }
      return p;
    });

    const updatedDailyRecords = [...appState.dailyRecords];
    const todayIndex = updatedDailyRecords.findIndex((d) => d.date === session.date);
    const prevOverall = todayIndex >= 0 ? updatedDailyRecords[todayIndex] : todayRecord;

    const newOverallScore = calculateOverallScore(
      prevOverall.sleepScore,
      prevOverall.exerciseScore || 80,
      session.score
    );

    const newDailyRecord: DailyRecord = {
      ...prevOverall,
      date: session.date,
      studyScore: session.score,
      studyFocusMinutes: (prevOverall.studyFocusMinutes || 0) + session.durationMinutes,
      overallScore: newOverallScore,
      totalXpEarned: (prevOverall.totalXpEarned || 0) + session.xpEarned,
      streakKept: true,
    };

    if (todayIndex >= 0) {
      updatedDailyRecords[todayIndex] = newDailyRecord;
    } else {
      updatedDailyRecords.push(newDailyRecord);
    }

    setAppState({
      ...appState,
      studySessions: [...appState.studySessions, session],
      projects: updatedProjects,
      dailyRecords: updatedDailyRecords,
      studyProgression: {
        category: 'study',
        level: newStudyProg.level,
        totalXP: newStudyXP,
        currentLevelXP: newStudyProg.currentLevelXP,
        nextLevelXP: newStudyProg.nextLevelXP,
        title: newStudyProg.title,
        badge: newStudyProg.badge,
      },
      overallProgression: {
        category: 'overall',
        level: newOverallProg.level,
        totalXP: newOverallXP,
        currentLevelXP: newOverallProg.currentLevelXP,
        nextLevelXP: newOverallProg.nextLevelXP,
        title: newOverallProg.title,
        badge: newOverallProg.badge,
      },
      xpTransactions: [...appState.xpTransactions, tx],
    });
  };

  // Export handlers
  const handleExportJSON = () => {
    soundManager.playHapticTap();
    const jsonStr = storageService.exportToJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascend-backup-${todayStr}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    soundManager.playHapticTap();
    const csvStr = storageService.exportToCSV();
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascend-daily-records-${todayStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    storageService.resetToSeed();
    setAppState(storageService.loadState());
    soundManager.playSuccessChime();
  };

  return (
    <div className="min-h-screen bg-[#050507] text-white font-sans select-none antialiased">
      {/* iOS HEADER */}
      <NavbarHeader
        onOpenCheckIn={() => setShowCheckInModal(true)}
        onOpenTests={() => setShowTestsModal(true)}
        onOpenSwiftCode={() => setShowSwiftCodeModal(true)}
        overallLevel={appState.overallProgression.level}
        streak={currentStreak}
      />

      {/* MAIN VIEWPORT BODY */}
      <main className="pt-2">
        {activeTab === 'home' && (
          <HomeDashboard
            overallProgression={appState.overallProgression}
            sleepProgression={appState.sleepProgression}
            exerciseProgression={appState.exerciseProgression}
            studyProgression={appState.studyProgression}
            todayRecord={todayRecord}
            latestSleep={latestSleep}
            todayExercise={todayExercise}
            todayStudySessions={todayStudySessions}
            currentStreak={currentStreak}
            bestStreak={bestStreak}
            weeklyAvgScore={weeklyAvgScore}
            monthlyProgressPercent={78}
            onNavigateTab={handleNavigateTab}
            onOpenCheckIn={() => setShowCheckInModal(true)}
            onStartFocus={() => handleNavigateTab('track', 'focus')}
            recentDailyRecords={appState.dailyRecords}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressionLadderView
            overallProgression={appState.overallProgression}
            sleepProgression={appState.sleepProgression}
            exerciseProgression={appState.exerciseProgression}
            studyProgression={appState.studyProgression}
            achievements={appState.achievements}
            xpTransactions={appState.xpTransactions}
          />
        )}

        {activeTab === 'track' && (
          <TrackingView
            initialSubTab={trackingSubTab}
            latestSleep={latestSleep}
            exercisePRs={appState.exercisePRs}
            projects={appState.projects}
            healthKitConnected={appState.userProfile.healthKitConnected}
            targetBedtime={appState.userProfile.targets?.targetBedtime || appState.userProfile.targetBedtime || '23:00'}
            targetWakeTime={appState.userProfile.targets?.targetWakeTime || appState.userProfile.targetWakeTime || '07:00'}
            targetDurationMinutes={appState.userProfile.targets?.sleepMinutes || appState.userProfile.targetSleepDurationMinutes || 450}
            onSaveSleep={handleSaveSleep}
            onSaveExercise={handleSaveExercise}
            onSaveStudySession={handleSaveStudySession}
            onUpdateProjects={(projects) => setAppState({ ...appState, projects })}
          />
        )}

        {activeTab === 'insights' && (
          <InsightsView
            dailyRecords={appState.dailyRecords}
            correlations={correlationInsights}
            weeklyReview={weeklyReview}
            monthlyReview={monthlyReview}
            onSelectDay={(rec) => setSelectedCalendarDay(rec)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            userProfile={appState.userProfile}
            onUpdateProfile={(profile) => setAppState({ ...appState, userProfile: profile })}
            onExportJSON={handleExportJSON}
            onExportCSV={handleExportCSV}
            onResetData={handleResetData}
            onOpenSwiftCode={() => setShowSwiftCodeModal(true)}
            onOpenTests={() => setShowTestsModal(true)}
            onOpenOnboarding={() => setShowOnboardingModal(true)}
          />
        )}
      </main>

      {/* 5-TAB NATIVE BAR */}
      <TabBar activeTab={activeTab} onSelectTab={(t) => setActiveTab(t)} />

      {/* MODALS */}
      <DailyCheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onCompleteCheckIn={(plan) => {
          // Award 15 XP for morning check-in
          const oldOverallXP = appState.overallProgression.totalXP;
          const newOverallXP = oldOverallXP + 15;
          checkLevelUp(oldOverallXP, newOverallXP, 'Overall');
          const newEval = evaluateLevel(newOverallXP);

          const tx: XPTransaction = {
            id: `tx_${Date.now()}`,
            category: 'overall',
            amount: 15,
            reason: 'Morning Check-In Calibrated',
            timestamp: new Date().toISOString(),
          };

          setAppState({
            ...appState,
            overallProgression: {
              ...appState.overallProgression,
              level: newEval.level,
              totalXP: newOverallXP,
              currentLevelXP: newEval.currentLevelXP,
              nextLevelXP: newEval.nextLevelXP,
              title: newEval.title,
            },
            xpTransactions: [...appState.xpTransactions, tx],
          });
        }}
      />

      <OnboardingModal
        isOpen={showOnboardingModal}
        userProfile={appState.userProfile}
        onComplete={(profile) => setAppState({ ...appState, userProfile: profile })}
        onClose={() => setShowOnboardingModal(false)}
      />

      <TestRunnerModal isOpen={showTestsModal} onClose={() => setShowTestsModal(false)} />

      <SwiftCodeInspectorModal isOpen={showSwiftCodeModal} onClose={() => setShowSwiftCodeModal(false)} />

      <CalendarModal record={selectedCalendarDay} onClose={() => setSelectedCalendarDay(null)} />

      {levelUpData && (
        <LevelUpCelebrationModal
          newLevel={levelUpData.newLevel}
          newTitle={levelUpData.newTitle}
          category={levelUpData.category}
          badge={levelUpData.badge}
          onClose={() => setLevelUpData(null)}
        />
      )}
    </div>
  );
}
