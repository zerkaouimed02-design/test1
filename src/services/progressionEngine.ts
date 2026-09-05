import { CategoryProgression, CategoryType, LevelLadderItem } from '../types';

export const CATEGORY_TIERS: Record<
  CategoryType,
  { minLevel: number; maxLevel: number; title: string; badge: string }[]
> = {
  sleep: [
    { minLevel: 1, maxLevel: 4, title: 'Beginner', badge: '🌱' },
    { minLevel: 5, maxLevel: 14, title: 'Consistent', badge: '⚡' },
    { minLevel: 15, maxLevel: 29, title: 'Disciplined', badge: '🛡️' },
    { minLevel: 30, maxLevel: 49, title: 'Advanced', badge: '⚔️' },
    { minLevel: 50, maxLevel: 100, title: 'Elite', badge: '💎' },
  ],
  exercise: [
    { minLevel: 1, maxLevel: 4, title: 'Beginner', badge: '🌱' },
    { minLevel: 5, maxLevel: 9, title: 'Active', badge: '🏃' },
    { minLevel: 10, maxLevel: 19, title: 'Consistent', badge: '⚡' },
    { minLevel: 20, maxLevel: 29, title: 'Strong', badge: '🦾' },
    { minLevel: 30, maxLevel: 49, title: 'Advanced', badge: '⚔️' },
    { minLevel: 50, maxLevel: 100, title: 'Elite', badge: '💎' },
  ],
  study: [
    { minLevel: 1, maxLevel: 4, title: 'Beginner', badge: '🌱' },
    { minLevel: 5, maxLevel: 9, title: 'Focused', badge: '🎯' },
    { minLevel: 10, maxLevel: 19, title: 'Consistent', badge: '⚡' },
    { minLevel: 20, maxLevel: 29, title: 'Productive', badge: '🚀' },
    { minLevel: 30, maxLevel: 49, title: 'Advanced', badge: '⚔️' },
    { minLevel: 50, maxLevel: 100, title: 'Elite', badge: '💎' },
  ],
  overall: [
    { minLevel: 1, maxLevel: 4, title: 'Beginner', badge: '🌱' },
    { minLevel: 5, maxLevel: 9, title: 'Consistent', badge: '⚡' },
    { minLevel: 10, maxLevel: 14, title: 'Disciplined', badge: '🛡️' },
    { minLevel: 15, maxLevel: 19, title: 'Dedicated', badge: '🔥' },
    { minLevel: 20, maxLevel: 29, title: 'Advanced', badge: '⚔️' },
    { minLevel: 30, maxLevel: 49, title: 'Elite', badge: '💎' },
    { minLevel: 50, maxLevel: 74, title: 'Master', badge: '👑' },
    { minLevel: 75, maxLevel: 99, title: 'Grandmaster', badge: '🌌' },
    { minLevel: 100, maxLevel: 100, title: 'Ascendant Legend', badge: '⭐' },
  ],
};

export const LEVEL_TITLES = CATEGORY_TIERS.overall;

export function getTitleForLevel(
  level: number,
  category: CategoryType = 'overall'
): { title: string; badge: string } {
  const tiers = CATEGORY_TIERS[category] || CATEGORY_TIERS.overall;
  const match = tiers.find((t) => level >= t.minLevel && level <= t.maxLevel);
  return match ? { title: match.title, badge: match.badge } : { title: 'Practitioner', badge: '✨' };
}

/**
 * Calculates XP required to progress from `level` to `level + 1`.
 * Starts at 100 XP for Level 1 -> 2, progressively increases smoothly.
 */
export function getXPForNextLevel(level: number): number {
  if (level < 1) return 100;
  if (level >= 100) return 999999;
  // Scaled progressive formula: 100, 115, 132, 152...
  if (level <= 20) {
    return Math.round(100 * Math.pow(1.12, level - 1));
  } else if (level <= 50) {
    return Math.round(800 + (level - 20) * 120);
  } else {
    return Math.round(4400 + (level - 50) * 350);
  }
}

// Generate precomputed cumulative XP table for levels 1 to 100
const CUMULATIVE_XP_TABLE: number[] = [0]; // Level 1 starts at 0 cumulative XP
let runningSum = 0;
for (let l = 1; l <= 100; l++) {
  runningSum += getXPForNextLevel(l);
  CUMULATIVE_XP_TABLE.push(runningSum);
}

/**
 * Given a total cumulative XP, determine current level and progress to next level.
 */
export function calculateLevelFromTotalXP(totalXP: number): {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
} {
  const safeTotal = Math.max(0, Math.floor(totalXP));
  let level = 1;

  while (level < 100 && safeTotal >= CUMULATIVE_XP_TABLE[level]) {
    level++;
  }

  const baseXPForCurrentLevel = CUMULATIVE_XP_TABLE[level - 1];
  const requiredXPForNext = getXPForNextLevel(level);
  const currentLevelXP = safeTotal - baseXPForCurrentLevel;
  const progressPercent = Math.min(100, Math.max(0, (currentLevelXP / requiredXPForNext) * 100));

  return {
    level,
    currentLevelXP,
    nextLevelXP: requiredXPForNext,
    progressPercent,
  };
}

/**
 * Returns complete progression ladder items for display in the Progression Ladder UI.
 */
export function generateProgressionLadder(category: CategoryType, currentLevel: number): LevelLadderItem[] {
  const items: LevelLadderItem[] = [];
  for (let l = 1; l <= 100; l++) {
    const { title, badge } = getTitleForLevel(l, category);
    const requiredForThisStep = getXPForNextLevel(l);
    const totalRequired = CUMULATIVE_XP_TABLE[l - 1];
    const isMilestone = l === 5 || l === 10 || l === 20 || l === 30 || l === 50 || l === 75 || l === 100;

    items.push({
      level: l,
      title,
      requiredTotalXP: totalRequired,
      perLevelXP: requiredForThisStep,
      isMilestone,
      badge,
    });
  }
  return items;
}

export function buildCategoryProgression(
  category: CategoryType,
  totalXP: number
): CategoryProgression {
  const { level, currentLevelXP, nextLevelXP } = calculateLevelFromTotalXP(totalXP);
  const { title } = getTitleForLevel(level, category);

  return {
    category,
    level,
    currentLevelXP,
    nextLevelXP,
    totalXP,
    title,
  };
}

export function evaluateLevel(totalXP: number, category: CategoryType = 'overall') {
  const lvl = calculateLevelFromTotalXP(totalXP);
  const titleInfo = getTitleForLevel(lvl.level, category);
  return {
    ...lvl,
    title: titleInfo.title,
    badge: titleInfo.badge,
  };
}

/**
 * Calculates overall day score using weighted composite:
 * 35% Sleep + 35% Exercise + 30% Study/Work
 */
export function calculateOverallScore(sleepScore: number, exerciseScore: number, studyScore: number): number {
  return Math.round(sleepScore * 0.35 + exerciseScore * 0.35 + studyScore * 0.30);
}

/**
 * Daily XP aggregation with consistency streak multipliers:
 * +10% for 3+ days, +15% for 7+ days, +25% for 30+ days
 */
export function calculateDailyXP(sleepXP: number, exerciseXP: number, studyXP: number, streakDays: number) {
  const baseXP = sleepXP + exerciseXP + studyXP;
  let multiplier = 1.0;
  if (streakDays >= 30) {
    multiplier = 1.25;
  } else if (streakDays >= 7) {
    multiplier = 1.15;
  } else if (streakDays >= 3) {
    multiplier = 1.10;
  }

  const totalXP = Math.round(baseXP * multiplier);
  const streakBonusXP = totalXP - baseXP;

  return {
    baseXP,
    streakBonusXP,
    totalXP,
    multiplier,
  };
}

/**
 * Evaluates current consistency streak and best streak from daily records
 */
export function calculateStreak(dailyRecords: { date: string; streakKept?: boolean; overallScore?: number }[]): {
  currentStreak: number;
  bestStreak: number;
} {
  if (!dailyRecords || dailyRecords.length === 0) {
    return { currentStreak: 0, bestStreak: 0 };
  }

  // Sort ascending by date
  const sorted = [...dailyRecords].sort((a, b) => a.date.localeCompare(b.date));

  let current = 0;
  let best = 0;

  for (const rec of sorted) {
    const kept = rec.streakKept ?? ((rec.overallScore ?? 0) >= 60);
    if (kept) {
      current++;
      if (current > best) best = current;
    } else {
      current = 0;
    }
  }

  return { currentStreak: current, bestStreak: best };
}
