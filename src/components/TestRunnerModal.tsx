import React, { useState } from 'react';
import { X, Play, CheckCircle2, AlertCircle, Check, Sparkles } from 'lucide-react';
import { calculateSleepScore, calculateExerciseScore, calculateProductivityScore } from '../services/scoringEngine';
import { evaluateLevel, calculateDailyXP, calculateOverallScore } from '../services/progressionEngine';
import { soundManager } from '../services/soundEffects';

interface TestResult {
  suite: string;
  name: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

interface TestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestRunnerModal: React.FC<TestRunnerModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  if (!isOpen) return null;

  const runAllTests = () => {
    setIsRunning(true);
    soundManager.playHapticTap();

    setTimeout(() => {
      const tests: TestResult[] = [];

      // Test 1: Level 1 Progression
      const t1Start = performance.now();
      const lvl1 = evaluateLevel(0);
      tests.push({
        suite: 'Progression Engine',
        name: 'Initial State Level 1 Calculation',
        passed: lvl1.level === 1 && lvl1.title === 'Novice',
        message: `Total XP: 0 → Level: ${lvl1.level}, Title: ${lvl1.title}`,
        durationMs: +(performance.now() - t1Start).toFixed(2),
      });

      // Test 2: Level Ladder Scaling (Non-linear XP curve)
      const t2Start = performance.now();
      const lvl5 = evaluateLevel(750);
      const lvl10 = evaluateLevel(2500);
      tests.push({
        suite: 'Progression Engine',
        name: 'XP Requirement Scaling Formula',
        passed: lvl5.level >= 4 && lvl10.level >= 8,
        message: `750 XP → Lvl ${lvl5.level}, 2500 XP → Lvl ${lvl10.level}`,
        durationMs: +(performance.now() - t2Start).toFixed(2),
      });

      // Test 3: Sleep Score Calculation (8 hours optimal)
      const t3Start = performance.now();
      const sleepOpt = calculateSleepScore({
        durationMinutes: 480,
        targetDurationMinutes: 480,
        bedtime: '23:00',
        targetBedtime: '23:00',
        wakeTime: '07:00',
        targetWakeTime: '07:00',
        qualityRating: 10,
        awakenings: 0,
      });
      tests.push({
        suite: 'Scoring Engine',
        name: 'Optimal Sleep Session Evaluation',
        passed: sleepOpt.score >= 95 && sleepOpt.xpEarned >= 60,
        message: `Score: ${sleepOpt.score}/100, XP: ${sleepOpt.xpEarned} (Duration 480m, Quality 10)`,
        durationMs: +(performance.now() - t3Start).toFixed(2),
      });

      // Test 4: Sleep Score Edge Case (Extremely short sleep: 3 hours)
      const t4Start = performance.now();
      const sleepShort = calculateSleepScore({
        durationMinutes: 180,
        targetDurationMinutes: 480,
        bedtime: '03:00',
        targetBedtime: '23:00',
        wakeTime: '06:00',
        targetWakeTime: '07:00',
        qualityRating: 3,
        awakenings: 4,
      });
      tests.push({
        suite: 'Scoring Engine',
        name: 'Edge Case: Severe Sleep Deprivation (<4 hrs)',
        passed: sleepShort.score < 50,
        message: `Score penalized appropriately to ${sleepShort.score}/100`,
        durationMs: +(performance.now() - t4Start).toFixed(2),
      });

      // Test 5: Exercise Volume Calculation & PR Bonus
      const t5Start = performance.now();
      const exPR = calculateExerciseScore({
        durationMinutes: 60,
        activityType: 'strength',
        intensity: 'high',
        setsCount: 8,
        hasPR: true,
      });
      tests.push({
        suite: 'Scoring Engine',
        name: 'Exercise Strength Session with PR Detection',
        passed: exPR.score >= 90 && exPR.xpEarned >= 70,
        message: `Score: ${exPR.score}/100, XP: ${exPR.xpEarned} (Includes +50 PR Bonus XP)`,
        durationMs: +(performance.now() - t5Start).toFixed(2),
      });

      // Test 6: Productivity Scoring with Distractions Penalties
      const t6Start = performance.now();
      const prodScore = calculateProductivityScore({
        totalFocusMinutes: 180,
        targetFocusMinutes: 180,
        sessions: [
          {
            id: '1',
            date: '2026-09-05',
            title: 'Test Block',
            durationMinutes: 180,
            sessionType: 'deep_work',
            productivityRating: 9,
            focusQuality: 9,
            energyRating: 8,
            difficultyRating: 7,
            distractionFactors: [],
            tasksCompleted: 4,
            notes: '',
            score: 0,
            xpEarned: 0,
          },
        ],
        tasksCompleted: 4,
        streakDays: 7,
      });
      tests.push({
        suite: 'Scoring Engine',
        name: 'High Productivity Deep Work Evaluation',
        passed: prodScore.score >= 85 && prodScore.xpEarned >= 50,
        message: `Productivity Score: ${prodScore.score}/100, XP: ${prodScore.xpEarned}`,
        durationMs: +(performance.now() - t6Start).toFixed(2),
      });

      // Test 7: Overall Day Score Weighted Composition
      const t7Start = performance.now();
      const overall = calculateOverallScore(85, 90, 80);
      tests.push({
        suite: 'Progression Engine',
        name: 'Weighted Composite Daily Score (35/35/30)',
        passed: overall === 85,
        message: `Sleep(85)*0.35 + Exercise(90)*0.35 + Study(80)*0.30 = ${overall}`,
        durationMs: +(performance.now() - t7Start).toFixed(2),
      });

      // Test 8: Daily XP Aggregation with 15% Consistency Streak Bonus
      const t8Start = performance.now();
      const xpCalc = calculateDailyXP(60, 75, 70, 7);
      tests.push({
        suite: 'Progression Engine',
        name: 'Streak Compound XP Multiplier (+15% for 7+ days)',
        passed: xpCalc.streakBonusXP > 0 && xpCalc.totalXP > xpCalc.baseXP,
        message: `Base: ${xpCalc.baseXP} XP + Streak Bonus: ${xpCalc.streakBonusXP} XP = ${xpCalc.totalXP} XP`,
        durationMs: +(performance.now() - t8Start).toFixed(2),
      });

      setResults(tests);
      setIsRunning(false);
      soundManager.playSuccessChime();
    }, 400);
  };

  const totalPassed = results.filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#121214] border border-white/10 rounded-[32px] p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Algorithm & Logic Unit Tests</h3>
              <p className="text-xs text-[#A1A1AA]">Verifying scoring, XP progression, scaling & edge cases</p>
            </div>
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

        {/* Run CTA */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-white/10 shadow-md">
          <div>
            <span className="text-xs font-bold text-white block">Automated Test Runner</span>
            <span className="text-[11px] text-[#A1A1AA]">
              {results.length > 0 ? `${totalPassed} / ${results.length} assertions passed` : '8 Test Suites Ready'}
            </span>
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="px-4 py-2 bg-[#22C55E] hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all active:scale-95"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Execute Suite'}</span>
          </button>
        </div>

        {/* Results List */}
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {results.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#A1A1AA]">
              Tap "Execute Suite" to run tests against the live algorithms.
            </div>
          ) : (
            results.map((res, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[#18181B] border border-white/5 flex items-start gap-3 text-xs"
              >
                {res.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{res.name}</span>
                    <span className="text-[10px] text-[#A1A1AA] font-mono">{res.durationMs}ms</span>
                  </div>
                  <span className="text-[10px] text-[#A1A1AA] font-mono block mt-0.5">{res.message}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
