export type CategoryType = 'sleep' | 'exercise' | 'study' | 'overall';

export interface UserProfile {
  id: string;
  name: string;
  title: string;
  avatarSeed: string;
  priorities: ('sleep' | 'exercise' | 'study')[];
  targets: {
    sleepMinutes: number; // e.g. 450 (7h 30m)
    exerciseMinutesPerWeek: number; // e.g. 180
    dailyFocusMinutes: number; // e.g. 180 (3 hours)
    targetBedtime: string; // "23:00"
    targetWakeTime: string; // "07:00"
    weeklyWorkouts?: number; // e.g. 4
    weeklyStudyHours?: number; // e.g. 15
    targetDailyProductivityScore?: number; // e.g. 80
  };
  targetBedtime?: string;
  targetWakeTime?: string;
  targetSleepDurationMinutes?: number;
  weeklyWorkoutsTarget?: number;
  dailyStudyTargetMinutes?: number;
  notificationsEnabled?: boolean;
  hasCompletedOnboarding: boolean;
  healthKitConnected: boolean;
  createdAt: string;
}

export interface ScoreBreakdown {
  duration: { earned: number; max: number };
  consistency: { earned: number; max: number };
  schedule: { earned: number; max: number };
  quality: { earned: number; max: number };
  total: number;
}

export interface SleepRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bedtime: string; // "23:15"
  sleepTime: string; // "23:30"
  wakeTime: string; // "07:10"
  timeInBedMinutes: number;
  durationMinutes: number;
  sleepQuality: number; // 1-10
  awakenings: number;
  notes: string;
  source: 'manual' | 'healthkit';
  score: number;
  scoreBreakdown: ScoreBreakdown;
  xpEarned: number;
}

export type ExerciseType =
  | 'strength'
  | 'running'
  | 'walking'
  | 'cycling'
  | 'swimming'
  | 'sports'
  | 'hiit'
  | 'mobility'
  | 'other';

export interface ExerciseSet {
  id: string;
  exerciseName: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  isPR?: boolean;
}

export interface ExerciseSession {
  id: string;
  date: string; // YYYY-MM-DD
  activityType: ExerciseType;
  title: string;
  durationMinutes: number;
  caloriesBurned?: number;
  distanceKm?: number;
  paceMinPerKm?: string;
  avgHeartRate?: number;
  sets: ExerciseSet[];
  notes: string;
  source: 'manual' | 'healthkit';
  intensity: 'low' | 'moderate' | 'high' | 'peak';
  totalVolumeKg?: number;
  xpEarned: number;
  score: number;
}

export interface ExercisePR {
  exerciseName: string;
  bestWeightKg: number;
  bestReps: number;
  bestVolumeKg: number;
  bestDistanceKm?: number;
  bestPaceMinPerKm?: string;
  achievedAt: string;
}

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  category: 'university' | 'work' | 'personal' | 'creative';
  goal: string;
  deadline?: string;
  targetHours: number;
  completedHours: number;
  tasks: TaskItem[];
  priority: 'low' | 'medium' | 'high';
  color: string;
}

export type FocusSessionType = 'pomodoro' | 'deep_work' | 'custom' | 'review';

export interface StudySession {
  id: string;
  date: string; // YYYY-MM-DD
  projectId?: string;
  projectName?: string;
  title: string;
  durationMinutes: number;
  sessionType: FocusSessionType;
  productivityRating: number; // 1-10
  focusQuality: number; // 1-10
  energyRating: number; // 1-10
  difficultyRating: number; // 1-10
  distractionFactors: string[];
  tasksCompleted: number;
  notes: string;
  score: number;
  xpEarned: number;
}

export interface ProductivityScoreBreakdown {
  focusTimeScore: number; // max 35
  sessionQualityScore: number; // max 25
  goalCompletionScore: number; // max 20
  consistencyScore: number; // max 20
  total: number; // 0-100
}

export interface DailyRecord {
  id?: string;
  date: string; // YYYY-MM-DD
  sleepScore: number;
  exerciseScore: number;
  studyScore: number;
  overallScore: number;
  totalXp?: number;
  totalXpEarned?: number;
  sleepMinutes?: number;
  sleepDurationMinutes?: number;
  exerciseMinutes?: number;
  exerciseDurationMinutes?: number;
  studyMinutes?: number;
  studyFocusMinutes?: number;
  streakKept?: boolean;
  notes?: string;
  status?: 'excellent' | 'good' | 'average' | 'poor' | 'rest' | 'no_data';
}

export interface CategoryProgression {
  category: CategoryType;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  totalXP: number;
  title: string;
}

export interface LevelLadderItem {
  level: number;
  title: string;
  requiredTotalXP: number;
  perLevelXP: number;
  isMilestone: boolean;
  badge?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
  xpReward: number;
}

export interface XPTransaction {
  id: string;
  timestamp: string;
  category: CategoryType;
  amount: number;
  reason: string;
}

export interface StreakInfo {
  category: CategoryType;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  restDaysUsedThisWeek: number;
  maxRestDaysPerWeek: number;
}

export interface DailyCheckIn {
  id: string;
  date: string; // YYYY-MM-DD
  sleepRating: 'poor' | 'okay' | 'good' | 'excellent';
  exerciseGoal: 'workout' | 'walk' | 'recovery' | 'rest';
  focusGoalMinutes: number;
  energyRating: number; // 1-5
  generatedPlan: string;
  timestamp: string;
}

export interface WeeklyReview {
  weekId: string; // e.g. "2026-W36"
  startDate: string;
  endDate: string;
  overallScore: number;
  sleepScore: number;
  sleepDeltaPercent: number;
  exerciseScore: number;
  exerciseDeltaPercent: number;
  studyScore: number;
  studyDeltaPercent: number;
  totalXpEarned: number;
  bestCategory: CategoryType;
  biggestImprovement: string;
  weakestArea: string;
  recommendations: string[];
}

export interface MonthlyReview {
  monthId: string; // "2026-09"
  monthName: string;
  overallScore: number;
  xpEarned: number;
  levelsGained: number;
  bestStreak: number;
  prsCount: number;
  productivityTrendPercent: number;
  sleepTrendPercent: number;
  exerciseTrendPercent: number;
  studyTrendPercent: number;
  keyHighlights: string[];
}

export interface NotificationPreference {
  bedtimeReminderEnabled: boolean;
  bedtimeReminderMinutesBefore: number;
  exerciseReminderEnabled: boolean;
  exerciseReminderTime: string;
  focusReminderEnabled: boolean;
  eveningCheckInEnabled: boolean;
  eveningCheckInTime: string;
  weeklySummaryEnabled: boolean;
}

export interface CorrelationInsight {
  id: string;
  claim: string;
  category: CategoryType;
  confidence: 'high' | 'moderate';
  sampleSizeDays: number;
  recommendation: string;
}
