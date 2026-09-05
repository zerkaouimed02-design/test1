import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  LineChart as ChartIcon,
  Sparkles,
  TrendingUp,
  Calendar as CalendarIcon,
  Brain,
  Moon,
  Dumbbell,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { CorrelationInsight, DailyRecord, MonthlyReview, WeeklyReview } from '../types';
import { soundManager } from '../services/soundEffects';

interface InsightsViewProps {
  dailyRecords: DailyRecord[];
  correlations: CorrelationInsight[];
  weeklyReview: WeeklyReview;
  monthlyReview: MonthlyReview;
  onSelectDay: (record: DailyRecord) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  dailyRecords,
  correlations,
  weeklyReview,
  monthlyReview,
  onSelectDay,
}) => {
  const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [activeMetric, setActiveMetric] = useState<'scores' | 'hours' | 'xp'>('scores');
  const [reportTab, setReportTab] = useState<'correlations' | 'weekly' | 'monthly' | 'calendar'>('correlations');

  // Filter records based on timeframe
  const sliceCount = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : dailyRecords.length;
  const filteredRecords = dailyRecords.slice(-sliceCount);

  // Format chart data
  const chartData = filteredRecords.map((r) => {
    const dateObj = new Date(r.date);
    const dayLabel = dateObj.toLocaleDateString(undefined, { weekday: 'narrow', month: 'numeric', day: 'numeric' });
    return {
      date: dayLabel,
      fullDate: r.date,
      overall: r.overallScore,
      sleep: r.sleepScore,
      exercise: r.exerciseScore || 0,
      study: r.studyScore || 0,
      sleepHours: +(r.sleepDurationMinutes / 60).toFixed(1),
      exerciseMins: r.exerciseDurationMinutes,
      studyHours: +(r.studyFocusMinutes / 60).toFixed(1),
      xp: r.totalXpEarned,
      record: r,
    };
  });

  const getDayStatusColor = (score: number) => {
    if (score >= 85) return 'bg-[#22C55E]';
    if (score >= 70) return 'bg-[#3B82F6]';
    if (score >= 50) return 'bg-amber-500';
    if (score > 0) return 'bg-[#F43F5E]';
    return 'bg-white/10';
  };

  return (
    <div className="space-y-6 pb-24 max-w-xl mx-auto px-4 pt-2">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Analytics & Intelligence</h2>
          <p className="text-xs text-[#A1A1AA]">Discover correlations, trends, and weekly reviews</p>
        </div>
        {/* TIMEFRAME SELECTOR */}
        <div className="flex bg-[#121214] p-1.5 rounded-2xl border border-white/10 text-xs font-bold shadow-md">
          {(['7d', '30d', '90d', 'all'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => {
                soundManager.playHapticTap();
                setTimeframe(tf);
              }}
              className={`px-3 py-1 rounded-xl uppercase transition-all ${
                timeframe === tf
                  ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* METRICS CHARTS CARD */}
      <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl">
        {/* Chart Header Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMetric('scores')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeMetric === 'scores'
                  ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Scores (0-100)
            </button>
            <button
              onClick={() => setActiveMetric('hours')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeMetric === 'hours'
                  ? 'bg-[#3B82F6]/20 text-[#60A5FA] border border-[#3B82F6]/40 shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              Duration / Hours
            </button>
            <button
              onClick={() => setActiveMetric('xp')}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${
                activeMetric === 'xp'
                  ? 'bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 shadow-[0_0_10px_rgba(34,197,94,0.2)]'
                  : 'text-[#A1A1AA] hover:text-white'
              }`}
            >
              XP Velocity
            </button>
          </div>
        </div>

        {/* RECHARTS VISUALIZATION */}
        <div className="h-60 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {activeMetric === 'scores' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={10} domain={[40, 100]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121214',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Line type="monotone" dataKey="overall" name="Overall" stroke="#3B82F6" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="sleep" name="Sleep" stroke="#8B5CF6" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="exercise" name="Exercise" stroke="#22C55E" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="study" name="Study" stroke="#0EA5E9" strokeWidth={1.5} dot={false} />
              </LineChart>
            ) : activeMetric === 'hours' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121214',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Bar dataKey="sleepHours" name="Sleep (hrs)" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="studyHours" name="Focus (hrs)" fill="#3B82F6" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717A" fontSize={10} tickLine={false} />
                <YAxis stroke="#71717A" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121214',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '11px',
                    color: '#FFFFFF',
                  }}
                />
                <Area type="monotone" dataKey="xp" name="XP Gained" stroke="#22C55E" fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* SUB-SECTIONS TABS */}
      <div className="flex gap-1.5 p-1.5 rounded-2xl bg-[#121214] border border-white/10 text-xs font-bold shadow-md">
        <button
          onClick={() => {
            soundManager.playHapticTap();
            setReportTab('correlations');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            reportTab === 'correlations'
              ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          Correlations
        </button>
        <button
          onClick={() => {
            soundManager.playHapticTap();
            setReportTab('weekly');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            reportTab === 'weekly'
              ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          Weekly Review
        </button>
        <button
          onClick={() => {
            soundManager.playHapticTap();
            setReportTab('monthly');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            reportTab === 'monthly'
              ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          Monthly Report
        </button>
        <button
          onClick={() => {
            soundManager.playHapticTap();
            setReportTab('calendar');
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            reportTab === 'calendar'
              ? 'bg-[#3B82F6] text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
              : 'text-[#A1A1AA] hover:text-white'
          }`}
        >
          Calendar
        </button>
      </div>

      {/* TAB: CORRELATIONS & CAUSALITY (SECTION 15) */}
      {reportTab === 'correlations' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#A1A1AA]">Inter-Pillar Discoveries</h3>
            <span className="text-[11px] text-[#A1A1AA] font-medium">Algorithmic causality engine</span>
          </div>

          <div className="space-y-3">
            {correlations.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-[28px] bg-[#121214] border border-white/10 space-y-3 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="text-xs font-bold text-white tracking-tight">{c.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 font-mono">
                    +{c.correlationPercentage}% Impact
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">{c.description}</p>

                <div className="pt-2.5 border-t border-white/10 flex items-start gap-2 text-[11px] text-[#93C5FD] font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#60A5FA] shrink-0 mt-0.5" />
                  <span>Recommendation: {c.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: WEEKLY REVIEW (SECTION 16) */}
      {reportTab === 'weekly' && (
        <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-5 shadow-2xl">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#60A5FA] tracking-widest">Automated Intelligence</span>
              <h3 className="text-base font-bold text-white mt-0.5">Weekly Review: {weeklyReview.weekRange}</h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider">Consistency</span>
              <div className="text-lg font-extrabold text-[#22C55E] font-mono">{weeklyReview.overallConsistencyScore}%</div>
            </div>
          </div>

          {/* Quick Pillars Comparison */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Sleep Score</span>
              <span className="text-sm font-bold text-[#8B5CF6] font-mono mt-0.5 block">{weeklyReview.sleepAvgScore}</span>
              <span className="text-[9px] text-[#22C55E] block font-semibold mt-0.5 font-mono">
                +{weeklyReview.sleepChangePct}% vs prev
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Workouts</span>
              <span className="text-sm font-bold text-[#22C55E] font-mono mt-0.5 block">
                {weeklyReview.exerciseSessionsCount} / {weeklyReview.exercisePlannedCount}
              </span>
              <span className="text-[9px] text-[#22C55E] block font-semibold mt-0.5">Goal Achieved</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Focus Time</span>
              <span className="text-sm font-bold text-[#60A5FA] font-mono mt-0.5 block">
                {weeklyReview.studyHoursCompleted}h / {weeklyReview.studyHoursTarget}h
              </span>
              <span className="text-[9px] text-amber-400 block font-semibold mt-0.5 font-mono">91% of target</span>
            </div>
          </div>

          {/* Highs & Lows */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E]">
              <span className="font-semibold">🌟 Strongest Category</span>
              <span className="font-bold uppercase tracking-wider">{weeklyReview.strongestCategory}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F43F5E]/10 border border-[#F43F5E]/20 text-[#FB7185]">
              <span className="font-semibold">⚠️ Area for Improvement</span>
              <span className="font-bold uppercase tracking-wider">{weeklyReview.weakestCategory}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/10 text-zinc-300">
              <span className="text-[10px] uppercase font-bold text-[#A1A1AA] tracking-wider block mb-1.5">Coach Recommendation</span>
              <p className="leading-relaxed">{weeklyReview.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MONTHLY REPORT (SECTION 17) */}
      {reportTab === 'monthly' && (
        <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-5 shadow-2xl">
          <div className="flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#60A5FA] tracking-widest">Macro Progression</span>
              <h3 className="text-base font-bold text-white mt-0.5">Monthly Strategic Audit: {monthlyReview.month}</h3>
            </div>
            <span className="text-xs font-mono font-bold text-[#22C55E] bg-white/5 px-2.5 py-1 rounded-lg">
              +{monthlyReview.totalXpEarned} XP
            </span>
          </div>

          {/* Aggregated Totals */}
          <div className="grid grid-cols-3 gap-3 text-center text-xs">
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Total Slept</span>
              <span className="text-base font-extrabold text-[#8B5CF6] font-mono mt-1 block">
                {monthlyReview.totalHoursSlept}h
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Total Trained</span>
              <span className="text-base font-extrabold text-[#22C55E] font-mono mt-1 block">
                {monthlyReview.totalHoursTrained}h
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#18181B] border border-white/5">
              <span className="text-[10px] text-[#A1A1AA] uppercase font-bold tracking-wider block">Total Focused</span>
              <span className="text-base font-extrabold text-[#60A5FA] font-mono mt-1 block">
                {monthlyReview.totalHoursStudied}h
              </span>
            </div>
          </div>

          {/* Strategic Narrative */}
          <div className="p-4 rounded-2xl bg-[#18181B] border border-white/10 space-y-2 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#22C55E]" /> Strategic Summary & Habit Stability
            </h4>
            <p className="text-zinc-300 leading-relaxed">{monthlyReview.strategicSummary}</p>
          </div>
        </div>
      )}

      {/* TAB: CALENDAR HEATMAP (SECTION 18) */}
      {reportTab === 'calendar' && (
        <div className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#60A5FA]" /> Consistency Calendar
              </h3>
              <p className="text-[11px] text-[#A1A1AA]">Tap any day to inspect full log and breakdowns</p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-[10px] text-[#A1A1AA] pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" /> 85+ Peak
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" /> 70-84 Good
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 50-69 Fair
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F43F5E]" /> &lt;50 Low
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 pt-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <div key={i} className="text-center text-[10px] font-bold text-zinc-500 py-1">
                {day}
              </div>
            ))}

            {dailyRecords.slice(-28).map((record) => {
              const dateNum = new Date(record.date).getDate();
              const score = record.overallScore;
              return (
                <button
                  key={record.id}
                  onClick={() => {
                    soundManager.playHapticTap();
                    onSelectDay(record);
                  }}
                  className="aspect-square rounded-2xl p-1.5 bg-[#18181B] border border-white/5 hover:border-[#3B82F6] transition-all flex flex-col items-center justify-between group active:scale-95 shadow-sm"
                  title={`${record.date}: Score ${score}/100`}
                >
                  <span className="text-[10px] text-[#A1A1AA] font-mono">{dateNum}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${getDayStatusColor(score)} shadow-sm`} />
                  <span className="text-[9px] font-bold text-zinc-300 font-mono">{score}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
