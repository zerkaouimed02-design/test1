import {
  Achievement,
  CategoryType,
  DailyCheckIn,
  DailyRecord,
  ExercisePR,
  ExerciseSession,
  NotificationPreference,
  Project,
  SleepRecord,
  StudySession,
  UserProfile,
  XPTransaction,
} from '../types';
import { buildCategoryProgression } from './progressionEngine';

const STORAGE_KEYS = {
  USER_PROFILE: 'ascend_user_profile',
  SLEEP_RECORDS: 'ascend_sleep_records',
  EXERCISE_SESSIONS: 'ascend_exercise_sessions',
  EXERCISE_PRS: 'ascend_exercise_prs',
  STUDY_SESSIONS: 'ascend_study_sessions',
  PROJECTS: 'ascend_projects',
  DAILY_RECORDS: 'ascend_daily_records',
  ACHIEVEMENTS: 'ascend_achievements',
  XP_TRANSACTIONS: 'ascend_xp_transactions',
  CHECK_INS: 'ascend_check_ins',
  NOTIFICATIONS: 'ascend_notifications',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Log your first activity in any pillar.',
    category: 'overall',
    iconName: 'Footprints',
    unlocked: true,
    unlockedAt: '2026-08-20',
    progress: 1,
    maxProgress: 1,
    xpReward: 100,
  },
  {
    id: '7-day-streak',
    title: '7-Day Streak',
    description: 'Maintain your consistency routine for 7 consecutive days.',
    category: 'overall',
    iconName: 'Flame',
    unlocked: true,
    unlockedAt: '2026-08-27',
    progress: 7,
    maxProgress: 7,
    xpReward: 250,
  },
  {
    id: 'early-riser',
    title: 'Early Riser',
    description: 'Maintain a consistent wake time within 20 mins for 14 days.',
    category: 'sleep',
    iconName: 'Sun',
    unlocked: false,
    progress: 10,
    maxProgress: 14,
    xpReward: 300,
  },
  {
    id: 'iron-consistency',
    title: 'Iron Consistency',
    description: 'Complete 20 logged training sessions.',
    category: 'exercise',
    iconName: 'Dumbbell',
    unlocked: true,
    unlockedAt: '2026-09-02',
    progress: 20,
    maxProgress: 20,
    xpReward: 400,
  },
  {
    id: 'deep-worker',
    title: 'Deep Worker',
    description: 'Accumulate 50 hours of focused work or study.',
    category: 'study',
    iconName: 'Brain',
    unlocked: false,
    progress: 38,
    maxProgress: 50,
    xpReward: 450,
  },
  {
    id: 'level-10',
    title: 'Level 10',
    description: 'Reach Level 10 in any single category.',
    category: 'overall',
    iconName: 'Award',
    unlocked: true,
    unlockedAt: '2026-08-30',
    progress: 10,
    maxProgress: 10,
    xpReward: 350,
  },
  {
    id: 'triple-threat',
    title: 'Triple Threat',
    description: 'Reach Level 10 across all three fundamental pillars.',
    category: 'overall',
    iconName: 'Trophy',
    unlocked: false,
    progress: 2,
    maxProgress: 3,
    xpReward: 600,
  },
  {
    id: 'century-focus',
    title: 'Century',
    description: 'Accumulate 100 hours of focused work.',
    category: 'study',
    iconName: 'Zap',
    unlocked: false,
    progress: 38,
    maxProgress: 100,
    xpReward: 800,
  },
  {
    id: 'personal-best',
    title: 'Personal Best',
    description: 'Establish a new personal record in any exercise.',
    category: 'exercise',
    iconName: 'Target',
    unlocked: true,
    unlockedAt: '2026-09-01',
    progress: 1,
    maxProgress: 1,
    xpReward: 200,
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr_default',
  name: 'Alex Rivera',
  title: 'Dedicated Ascendant',
  avatarSeed: 'alex',
  priorities: ['sleep', 'exercise', 'study'],
  targets: {
    sleepMinutes: 450, // 7h 30m
    exerciseMinutesPerWeek: 180,
    dailyFocusMinutes: 180, // 3h
    targetBedtime: '23:00',
    targetWakeTime: '07:00',
  },
  hasCompletedOnboarding: true,
  healthKitConnected: true,
  createdAt: '2026-08-15T08:00:00.000Z',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    name: 'Computer Systems & Algorithms',
    category: 'university',
    goal: 'Master Distributed Consensus & Data Structures',
    deadline: '2026-10-15',
    targetHours: 60,
    completedHours: 32.5,
    priority: 'high',
    color: '#6366f1',
    tasks: [
      { id: 't1', projectId: 'proj-1', title: 'Implement Raft state machine', completed: true },
      { id: 't2', projectId: 'proj-1', title: 'Analyze B-Tree cache misses', completed: true },
      { id: 't3', projectId: 'proj-1', title: 'Prepare Chapter 6 problem set', completed: false },
    ],
  },
  {
    id: 'proj-2',
    name: 'Mobile Core Platform',
    category: 'work',
    goal: 'Deliver clean SwiftData persistence layer & offline sync',
    deadline: '2026-09-30',
    targetHours: 40,
    completedHours: 24,
    priority: 'high',
    color: '#0ea5e9',
    tasks: [
      { id: 't4', projectId: 'proj-2', title: 'Audit memory graph leaks', completed: true },
      { id: 't5', projectId: 'proj-2', title: 'Implement background sync task', completed: false },
    ],
  },
  {
    id: 'proj-3',
    name: 'French Language Fluency',
    category: 'personal',
    goal: 'Pass B2 conversational benchmark',
    targetHours: 30,
    completedHours: 11,
    priority: 'medium',
    color: '#10b981',
    tasks: [
      { id: 't6', projectId: 'proj-3', title: '30-minute daily vocabulary review', completed: true },
      { id: 't7', projectId: 'proj-3', title: 'Listen to Radio France podcast', completed: false },
    ],
  },
];

export const INITIAL_PRS: ExercisePR[] = [
  {
    exerciseName: 'Barbell Bench Press',
    bestWeightKg: 92.5,
    bestReps: 5,
    bestVolumeKg: 2450,
    achievedAt: '2026-09-01',
  },
  {
    exerciseName: 'Barbell Back Squat',
    bestWeightKg: 125,
    bestReps: 6,
    bestVolumeKg: 3800,
    achievedAt: '2026-08-28',
  },
  {
    exerciseName: '5K Outdoor Run',
    bestWeightKg: 0,
    bestReps: 0,
    bestVolumeKg: 0,
    bestDistanceKm: 5.0,
    bestPaceMinPerKm: '4:48',
    achievedAt: '2026-08-25',
  },
];

// Helper to seed 14 days of realistic history leading up to today
export function generateSeedData(): {
  dailyRecords: DailyRecord[];
  sleepRecords: SleepRecord[];
  exerciseSessions: ExerciseSession[];
  studySessions: StudySession[];
  xpTransactions: XPTransaction[];
} {
  const dailyRecords: DailyRecord[] = [];
  const sleepRecords: SleepRecord[] = [];
  const exerciseSessions: ExerciseSession[] = [];
  const studySessions: StudySession[] = [];
  const xpTransactions: XPTransaction[] = [];

  const now = new Date();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];

    // Sleep record
    const sleepDur = 420 + Math.floor(Math.sin(i * 1.5) * 35) + (i % 3 === 0 ? 30 : 0);
    const sleepQual = Math.min(10, Math.max(7, Math.floor(7 + Math.cos(i) * 2.5)));
    const sleepScore = Math.min(96, Math.max(74, 82 + (sleepDur > 440 ? 6 : -4) + Math.floor(Math.random() * 5)));
    const sleepXP = 75 + Math.floor(Math.random() * 20);

    sleepRecords.push({
      id: `sleep_${dateStr}`,
      date: dateStr,
      bedtime: '23:10',
      sleepTime: '23:25',
      wakeTime: '07:05',
      timeInBedMinutes: sleepDur + 20,
      durationMinutes: sleepDur,
      sleepQuality: sleepQual,
      awakenings: i % 4 === 0 ? 2 : 1,
      notes: i === 0 ? "Woke up feeling deeply rested and energized." : 'Solid recovery night.',
      source: 'healthkit',
      score: sleepScore,
      scoreBreakdown: {
        duration: { earned: 28, max: 30 },
        consistency: { earned: 23, max: 25 },
        schedule: { earned: 18, max: 20 },
        quality: { earned: sleepQual * 2, max: 25 },
        total: sleepScore,
      },
      xpEarned: sleepXP,
    });

    // Exercise record (5 days a week)
    let exMinutes = 0;
    let exScore = 0;
    let exXP = 0;
    const isRest = i % 4 === 2;

    if (!isRest) {
      exMinutes = 40 + (i % 3) * 15;
      exScore = 80 + Math.floor(Math.random() * 18);
      exXP = 65 + Math.floor(Math.random() * 30);
      const isStrength = i % 2 === 0;

      exerciseSessions.push({
        id: `ex_${dateStr}`,
        date: dateStr,
        activityType: isStrength ? 'strength' : 'running',
        title: isStrength ? 'Push & Core Hypertrophy' : 'Tempo Aerobic Run',
        durationMinutes: exMinutes,
        caloriesBurned: exMinutes * 8,
        distanceKm: isStrength ? undefined : 6.2,
        paceMinPerKm: isStrength ? undefined : '5:02',
        intensity: exMinutes > 50 ? 'high' : 'moderate',
        sets: isStrength
          ? [
              { id: 's1', exerciseName: 'Barbell Bench Press', setNumber: 1, weightKg: 80, reps: 8 },
              { id: 's2', exerciseName: 'Barbell Bench Press', setNumber: 2, weightKg: 85, reps: 8 },
              { id: 's3', exerciseName: 'Barbell Bench Press', setNumber: 3, weightKg: 90, reps: 6, isPR: i === 4 },
              { id: 's4', exerciseName: 'Incline DB Press', setNumber: 1, weightKg: 32, reps: 10 },
              { id: 's5', exerciseName: 'Cable Lateral Raise', setNumber: 1, weightKg: 12, reps: 15 },
            ]
          : [],
        totalVolumeKg: isStrength ? 2840 : undefined,
        notes: isStrength ? 'Solid chest pump and shoulder stability.' : 'Felt fluid, heart rate under control.',
        source: 'manual',
        score: exScore,
        xpEarned: exXP,
      });
    }

    // Study session
    const studyMinutes = 150 + (i % 3) * 30;
    const studyScore = 82 + Math.floor(Math.random() * 14);
    const studyXP = 110 + Math.floor(Math.random() * 40);

    studySessions.push({
      id: `study_${dateStr}`,
      date: dateStr,
      projectId: i % 2 === 0 ? 'proj-1' : 'proj-2',
      projectName: i % 2 === 0 ? 'Computer Systems & Algorithms' : 'Mobile Core Platform',
      title: i % 2 === 0 ? 'Consensus Protocol Implementation' : 'Persistence Layer Refactoring',
      durationMinutes: studyMinutes,
      sessionType: 'deep_work',
      productivityRating: 8 + (i % 2),
      focusQuality: 9,
      energyRating: 8,
      difficultyRating: 7,
      distractionFactors: i % 5 === 0 ? ['Phone notifications'] : [],
      tasksCompleted: 2,
      notes: 'High flow state during 50-minute deep blocks.',
      score: studyScore,
      xpEarned: studyXP,
    });

    const dayTotalXP = sleepXP + exXP + studyXP;
    const overallScore = isRest
      ? Math.round(sleepScore * 0.5 + studyScore * 0.5)
      : Math.round(sleepScore * 0.34 + exScore * 0.33 + studyScore * 0.33);

    dailyRecords.push({
      date: dateStr,
      sleepScore,
      exerciseScore: isRest ? 0 : exScore,
      studyScore,
      overallScore,
      totalXp: dayTotalXP,
      sleepMinutes: sleepDur,
      exerciseMinutes: exMinutes,
      studyMinutes,
      notes: isRest ? 'Scheduled physical recovery day.' : 'Disciplined progress across all 3 pillars.',
      status: overallScore >= 85 ? 'excellent' : overallScore >= 75 ? 'good' : 'average',
    });

    xpTransactions.push({
      id: `xp_day_${dateStr}`,
      timestamp: `${dateStr}T21:00:00.000Z`,
      category: 'overall',
      amount: dayTotalXP,
      reason: `Daily completion score ${overallScore}/100`,
    });
  }

  return { dailyRecords, sleepRecords, exerciseSessions, studySessions, xpTransactions };
}

export class StorageService {
  public static getUser(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...INITIAL_USER,
          ...parsed,
          targets: {
            ...INITIAL_USER.targets,
            ...(parsed.targets || {}),
          },
        };
      }
    } catch {}
    this.saveUser(INITIAL_USER);
    return INITIAL_USER;
  }

  public static saveUser(user: UserProfile) {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(user));
  }

  public static getSleepRecords(): SleepRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SLEEP_RECORDS);
      if (data) return JSON.parse(data);
    } catch {}
    const { sleepRecords } = generateSeedData();
    this.saveSleepRecords(sleepRecords);
    return sleepRecords;
  }

  public static saveSleepRecords(records: SleepRecord[]) {
    localStorage.setItem(STORAGE_KEYS.SLEEP_RECORDS, JSON.stringify(records));
  }

  public static getExerciseSessions(): ExerciseSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_SESSIONS);
      if (data) return JSON.parse(data);
    } catch {}
    const { exerciseSessions } = generateSeedData();
    this.saveExerciseSessions(exerciseSessions);
    return exerciseSessions;
  }

  public static saveExerciseSessions(sessions: ExerciseSession[]) {
    localStorage.setItem(STORAGE_KEYS.EXERCISE_SESSIONS, JSON.stringify(sessions));
  }

  public static getExercisePRs(): ExercisePR[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXERCISE_PRS);
      if (data) return JSON.parse(data);
    } catch {}
    this.saveExercisePRs(INITIAL_PRS);
    return INITIAL_PRS;
  }

  public static saveExercisePRs(prs: ExercisePR[]) {
    localStorage.setItem(STORAGE_KEYS.EXERCISE_PRS, JSON.stringify(prs));
  }

  public static getStudySessions(): StudySession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
      if (data) return JSON.parse(data);
    } catch {}
    const { studySessions } = generateSeedData();
    this.saveStudySessions(studySessions);
    return studySessions;
  }

  public static saveStudySessions(sessions: StudySession[]) {
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(sessions));
  }

  public static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (data) return JSON.parse(data);
    } catch {}
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  public static saveProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  }

  public static getDailyRecords(): DailyRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.DAILY_RECORDS);
      if (data) return JSON.parse(data);
    } catch {}
    const { dailyRecords } = generateSeedData();
    this.saveDailyRecords(dailyRecords);
    return dailyRecords;
  }

  public static saveDailyRecords(records: DailyRecord[]) {
    localStorage.setItem(STORAGE_KEYS.DAILY_RECORDS, JSON.stringify(records));
  }

  public static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (data) return JSON.parse(data);
    } catch {}
    this.saveAchievements(INITIAL_ACHIEVEMENTS);
    return INITIAL_ACHIEVEMENTS;
  }

  public static saveAchievements(achievements: Achievement[]) {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }

  public static getXPTransactions(): XPTransaction[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.XP_TRANSACTIONS);
      if (data) return JSON.parse(data);
    } catch {}
    const { xpTransactions } = generateSeedData();
    this.saveXPTransactions(xpTransactions);
    return xpTransactions;
  }

  public static saveXPTransactions(txs: XPTransaction[]) {
    localStorage.setItem(STORAGE_KEYS.XP_TRANSACTIONS, JSON.stringify(txs));
  }

  public static getCheckIns(): DailyCheckIn[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHECK_INS);
      if (data) return JSON.parse(data);
    } catch {}
    return [];
  }

  public static saveCheckIns(checkIns: DailyCheckIn[]) {
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns));
  }

  public static getNotificationPrefs(): NotificationPreference {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (data) return JSON.parse(data);
    } catch {}
    const defaultPrefs: NotificationPreference = {
      bedtimeReminderEnabled: true,
      bedtimeReminderMinutesBefore: 30,
      exerciseReminderEnabled: true,
      exerciseReminderTime: '17:30',
      focusReminderEnabled: true,
      eveningCheckInEnabled: true,
      eveningCheckInTime: '21:30',
      weeklySummaryEnabled: true,
    };
    return defaultPrefs;
  }

  public static saveNotificationPrefs(prefs: NotificationPreference) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(prefs));
  }

  public static exportAllAsJSON(): string {
    const fullDump = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      user: this.getUser(),
      sleepRecords: this.getSleepRecords(),
      exerciseSessions: this.getExerciseSessions(),
      exercisePRs: this.getExercisePRs(),
      studySessions: this.getStudySessions(),
      projects: this.getProjects(),
      dailyRecords: this.getDailyRecords(),
      achievements: this.getAchievements(),
      xpTransactions: this.getXPTransactions(),
      checkIns: this.getCheckIns(),
      notificationPrefs: this.getNotificationPrefs(),
    };
    return JSON.stringify(fullDump, null, 2);
  }

  public static exportDailyRecordsAsCSV(): string {
    const records = this.getDailyRecords();
    const headers = [
      'Date',
      'OverallScore',
      'SleepScore',
      'ExerciseScore',
      'StudyScore',
      'SleepMinutes',
      'ExerciseMinutes',
      'StudyMinutes',
      'TotalXP',
      'Status',
    ];
    const rows = records.map((r) =>
      [
        r.date,
        r.overallScore,
        r.sleepScore,
        r.exerciseScore,
        r.studyScore,
        r.sleepMinutes,
        r.exerciseMinutes,
        r.studyMinutes,
        r.totalXp,
        r.status,
      ].join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  }

  public static clearAllData() {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  }

  public static resetToSeed() {
    this.clearAllData();
    this.saveUser(INITIAL_USER);
    this.saveAchievements(INITIAL_ACHIEVEMENTS);
    this.saveProjects(INITIAL_PROJECTS);
    this.saveExercisePRs(INITIAL_PRS);
    const seed = generateSeedData();
    this.saveDailyRecords(seed.dailyRecords);
    this.saveSleepRecords(seed.sleepRecords);
    this.saveExerciseSessions(seed.exerciseSessions);
    this.saveStudySessions(seed.studySessions);
    this.saveXPTransactions(seed.xpTransactions);
  }
}

export const storageService = {
  loadState: () => {
    const userProfile = StorageService.getUser();
    const sleepRecords = StorageService.getSleepRecords();
    const exerciseSessions = StorageService.getExerciseSessions();
    const exercisePRs = StorageService.getExercisePRs();
    const studySessions = StorageService.getStudySessions();
    const projects = StorageService.getProjects();
    const dailyRecords = StorageService.getDailyRecords();
    const achievements = StorageService.getAchievements();
    const xpTransactions = StorageService.getXPTransactions();

    const sleepXP = sleepRecords.reduce((acc, r) => acc + (r.xpEarned || 0), 0);
    const exerciseXP = exerciseSessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);
    const studyXP = studySessions.reduce((acc, s) => acc + (s.xpEarned || 0), 0);
    const overallXP = xpTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    return {
      userProfile,
      sleepRecords,
      exerciseSessions,
      exercisePRs,
      studySessions,
      projects,
      dailyRecords,
      achievements,
      xpTransactions,
      sleepProgression: buildCategoryProgression('sleep', sleepXP),
      exerciseProgression: buildCategoryProgression('exercise', exerciseXP),
      studyProgression: buildCategoryProgression('study', studyXP),
      overallProgression: buildCategoryProgression('overall', overallXP),
    };
  },
  saveState: (state: any) => {
    if (state.userProfile) StorageService.saveUser(state.userProfile);
    if (state.sleepRecords) StorageService.saveSleepRecords(state.sleepRecords);
    if (state.exerciseSessions) StorageService.saveExerciseSessions(state.exerciseSessions);
    if (state.exercisePRs) StorageService.saveExercisePRs(state.exercisePRs);
    if (state.studySessions) StorageService.saveStudySessions(state.studySessions);
    if (state.projects) StorageService.saveProjects(state.projects);
    if (state.dailyRecords) StorageService.saveDailyRecords(state.dailyRecords);
    if (state.achievements) StorageService.saveAchievements(state.achievements);
    if (state.xpTransactions) StorageService.saveXPTransactions(state.xpTransactions);
  },
  exportToJSON: () => StorageService.exportAllAsJSON(),
  exportToCSV: () => StorageService.exportDailyRecordsAsCSV(),
  resetToSeed: () => StorageService.resetToSeed(),
};
