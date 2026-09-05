import {
  ProductivityScoreBreakdown,
  ScoreBreakdown,
  SleepRecord,
  StudySession,
} from '../types';

export function timeStringToMinutes(timeStr: string): number {
  if (!timeStr || !timeStr.includes(':')) return 0;
  const [h, m] = timeStr.split(':').map((v) => parseInt(v, 10) || 0);
  return h * 60 + m;
}

/**
 * Calculates a transparent Sleep Score (0 - 100) with detailed component breakdown.
 */
export function calculateSleepScore(params: {
  durationMinutes: number;
  targetDurationMinutes: number;
  bedtime: string;
  targetBedtime: string;
  wakeTime: string;
  targetWakeTime: string;
  qualityRating: number; // 1-10
  awakenings: number;
}): { score: number; breakdown: ScoreBreakdown; xpEarned: number } {
  const {
    durationMinutes,
    targetDurationMinutes,
    bedtime,
    targetBedtime,
    wakeTime,
    targetWakeTime,
    qualityRating,
    awakenings,
  } = params;

  // 1. Duration Score (Max 30)
  const durationDiff = Math.abs(durationMinutes - targetDurationMinutes);
  let durationEarned = 30;
  if (durationDiff > 30) {
    // Lose 2 points per 15 mins off
    const penalty = Math.min(26, Math.floor((durationDiff - 30) / 15) * 2);
    durationEarned = Math.max(4, 30 - penalty);
  }

  // 2. Schedule Alignment (Max 20)
  const actualBedMinutes = timeStringToMinutes(bedtime);
  const targetBedMinutes = timeStringToMinutes(targetBedtime);
  const bedDiff = Math.min(
    Math.abs(actualBedMinutes - targetBedMinutes),
    Math.abs(actualBedMinutes - (targetBedMinutes + 1440)),
    Math.abs(actualBedMinutes + 1440 - targetBedMinutes)
  );

  const actualWakeMinutes = timeStringToMinutes(wakeTime);
  const targetWakeMinutes = timeStringToMinutes(targetWakeTime);
  const wakeDiff = Math.abs(actualWakeMinutes - targetWakeMinutes);

  let scheduleEarned = 20;
  if (bedDiff > 20) {
    scheduleEarned -= Math.min(6, Math.floor((bedDiff - 20) / 15) * 1.5);
  }
  if (wakeDiff > 20) {
    scheduleEarned -= Math.min(6, Math.floor((wakeDiff - 20) / 15) * 1.5);
  }
  scheduleEarned = Math.max(4, Math.round(scheduleEarned));

  // 3. Consistency (Max 25)
  // Higher if bedtime and wake time are regular and within acceptable margins
  let consistencyEarned = 25;
  const variance = bedDiff + wakeDiff;
  if (variance > 40) {
    consistencyEarned = Math.max(8, Math.round(25 - (variance - 40) * 0.15));
  }

  // 4. Quality & Awakenings (Max 25)
  const normalizedQuality = Math.min(10, Math.max(1, qualityRating));
  let qualityEarned = Math.round((normalizedQuality / 10) * 25);
  // Deduct 2 pts per awakening over 1
  if (awakenings > 1) {
    qualityEarned = Math.max(4, qualityEarned - (awakenings - 1) * 2);
  }

  const total = Math.min(100, Math.max(0, durationEarned + scheduleEarned + consistencyEarned + qualityEarned));

  const breakdown: ScoreBreakdown = {
    duration: { earned: Math.round(durationEarned), max: 30 },
    consistency: { earned: Math.round(consistencyEarned), max: 25 },
    schedule: { earned: Math.round(scheduleEarned), max: 20 },
    quality: { earned: Math.round(qualityEarned), max: 25 },
    total,
  };

  // Calculate XP reward
  let xp = 30; // base logging XP
  if (durationEarned >= 26) xp += 35; // met duration
  if (scheduleEarned >= 16) xp += 25; // met schedule
  if (qualityEarned >= 20) xp += 25; // high quality
  if (total >= 85) xp += 30; // excellence bonus

  return { score: total, breakdown, xpEarned: xp };
}

/**
 * Calculates Exercise Session Score (0 - 100) and XP
 */
export function calculateExerciseScore(params: {
  durationMinutes: number;
  activityType: string;
  intensity: 'low' | 'moderate' | 'high' | 'peak';
  setsCount: number;
  hasPR: boolean;
}): { score: number; xpEarned: number } {
  const { durationMinutes, intensity, setsCount, hasPR } = params;

  let baseScore = 40; // baseline completion
  // Duration factor (target ~45 min)
  const durationScore = Math.min(30, (durationMinutes / 45) * 30);

  // Intensity factor
  const intensityBonus =
    intensity === 'peak' ? 20 : intensity === 'high' ? 16 : intensity === 'moderate' ? 10 : 5;

  // Strength sets or endurance factor
  const setsBonus = Math.min(10, setsCount * 1.5);

  const rawScore = baseScore + durationScore + intensityBonus + setsBonus;
  const score = Math.min(100, Math.round(rawScore));

  // XP calculation
  let xp = 35; // Base XP for completing workout
  xp += Math.min(60, Math.round(durationMinutes * 1.0)); // 1 XP per minute up to 60
  if (intensity === 'high' || intensity === 'peak') xp += 20;
  if (hasPR) xp += 50; // PR Achievement bonus
  if (setsCount > 5) xp += 15;

  return { score, xpEarned: xp };
}

/**
 * Calculates Productivity Score (0 - 100) with detailed transparent factors
 */
export function calculateProductivityScore(params: {
  totalFocusMinutes: number;
  targetFocusMinutes: number;
  sessions: StudySession[];
  tasksCompleted: number;
  streakDays: number;
}): { score: number; breakdown: ProductivityScoreBreakdown; xpEarned: number } {
  const { totalFocusMinutes, targetFocusMinutes, sessions, tasksCompleted, streakDays } = params;

  // 1. Focus Time Score (Max 35)
  const focusRatio = targetFocusMinutes > 0 ? Math.min(1.2, totalFocusMinutes / targetFocusMinutes) : 0;
  const focusTimeScore = Math.round(Math.min(35, focusRatio * 35));

  // 2. Session Quality Score (Max 25)
  let sessionQualityScore = 15;
  if (sessions.length > 0) {
    const avgQuality = sessions.reduce((sum, s) => sum + s.focusQuality, 0) / sessions.length;
    const avgProd = sessions.reduce((sum, s) => sum + s.productivityRating, 0) / sessions.length;
    const combinedAvg = (avgQuality + avgProd) / 2; // out of 10
    sessionQualityScore = Math.round((combinedAvg / 10) * 25);
  }

  // 3. Goal & Task Completion Score (Max 20)
  const taskFactor = Math.min(10, tasksCompleted * 3);
  const sessionCountFactor = Math.min(10, sessions.length * 4);
  const goalCompletionScore = Math.min(20, taskFactor + sessionCountFactor);

  // 4. Consistency Score (Max 20)
  const distractionCount = sessions.reduce((sum, s) => sum + (s.distractionFactors?.length || 0), 0);
  let consistencyScore = 15 + Math.min(5, streakDays);
  if (distractionCount > 2) {
    consistencyScore = Math.max(5, consistencyScore - distractionCount * 2);
  }
  consistencyScore = Math.min(20, Math.round(consistencyScore));

  const total = Math.min(100, focusTimeScore + sessionQualityScore + goalCompletionScore + consistencyScore);

  const breakdown: ProductivityScoreBreakdown = {
    focusTimeScore,
    sessionQualityScore,
    goalCompletionScore,
    consistencyScore,
    total,
  };

  // XP calculation
  let xp = 20; // Base logging
  xp += Math.round(totalFocusMinutes * 1.2); // 1.2 XP per focus minute
  if (sessions.some((s) => s.sessionType === 'deep_work')) xp += 25;
  if (tasksCompleted > 0) xp += tasksCompleted * 15;
  if (total >= 85) xp += 35; // Excellence bonus

  return { score: total, breakdown, xpEarned: xp };
}

/**
 * Calculates Combined Overall Daily Score (0 - 100)
 */
export function calculateOverallDailyScore(
  sleepScore: number,
  exerciseScore: number,
  studyScore: number,
  isRestDay: boolean = false
): number {
  if (isRestDay) {
    // If rest day, redistribute exercise weight evenly to sleep & study
    return Math.round(sleepScore * 0.5 + studyScore * 0.5);
  }
  return Math.round(sleepScore * 0.34 + exerciseScore * 0.33 + studyScore * 0.33);
}
