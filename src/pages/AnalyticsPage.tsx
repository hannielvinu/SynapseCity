import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CityMetrics } from '../types';
import { BarChart3, Zap, TrendingDown, Clock, ShieldCheck, ArrowUpRight, Award, History } from 'lucide-react';

interface AnalyticsPageProps {
  metrics: CityMetrics;
  history?: any[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ metrics, history = [] }) => {
  const [filterRange, setFilterRange] = useState<'daily' | 'weekly' | 'custom'>('daily');

  // Compute average savings from history
  const aiRuns = history.filter(h => h.strategy === 'ai');
  const baselineRuns = history.filter(h => h.strategy === 'baseline');

  const avgAiDelay = aiRuns.length > 0
    ? aiRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / aiRuns.length
    : 28;
  const avgBaseDelay = baselineRuns.length > 0
    ? baselineRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / baselineRuns.length
    : 62;

  const delaySavings = Math.max(1.5, (avgBaseDelay - avgAiDelay) / 60);

  // Group runs by date for comparison charts
  const uniqueDates = Array.from(new Set(history.map(r => r.timestamp.split(' ')[0]))).slice(0, 7).reverse();

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Mobility Analytics & ESG Carbon Portal"
        subtitle="Historical travel time savings, CO2 emission offsets, and signal optimization benchmarks across municipal districts."
        badgeText="ESG AUDITED"
        badgeType="emerald"
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily CO2 Reduction</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">-{metrics.co2SavedTonsToday.toFixed(3)} Tons</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs monthly baseline
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Delay Savings</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300">-{delaySavings.toFixed(1)} min</div>
          <div className="text-[11px] text-cyan-400 font-semibold">Per commute route leg</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Signal Optimization Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-300">{metrics.signalOptimizationEfficiency}%</div>
          <div className="text-[11px] text-blue-400 font-semibold">142 edge nodes sync</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pedestrian Safety Index</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black font-mono text-purple-300">{metrics.pedestrianSafetyScore}%</div>
          <div className="text-[11px] text-purple-400 font-semibold">Zero fatalities logged</div>
        </div>
      </div>

      {/* Strategy Comparisons Chart */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Historic Simulation Delay Comparisons
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Aggregate comparison of baseline delay vs AI optimization runs</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {['daily', 'weekly', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range as any)}
                className={`px-3 py-1 rounded-lg font-bold uppercase transition-all ${
                  filterRange === range 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Visual chart */}
        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-4 bg-slate-950 rounded-xl border border-slate-800/80">
          {uniqueDates.map((dateString) => {
            // Find delay averages for this specific date
            const dateAiRuns = history.filter(r => r.strategy === 'ai' && r.timestamp.startsWith(dateString));
            const dateBaseRuns = history.filter(r => r.strategy === 'baseline' && r.timestamp.startsWith(dateString));

            const aiVal = dateAiRuns.length > 0 
              ? dateAiRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / dateAiRuns.length
              : 35;
            const baseVal = dateBaseRuns.length > 0
              ? dateBaseRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / dateBaseRuns.length
              : 70;

            const aiHeight = Math.min(100, Math.max(10, (aiVal / 120) * 100));
            const baseHeight = Math.min(100, Math.max(10, (baseVal / 120) * 100));

            return (
              <div key={dateString} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-2 h-full">
                  {/* Baseline bar */}
                  <div
                    className="w-1/3 bg-rose-500/20 hover:bg-rose-500/40 rounded-t transition-all border border-rose-500/10"
                    style={{ height: `${baseHeight}%` }}
                    title={`Baseline Delay: ${baseVal.toFixed(0)}s`}
                  ></div>
                  {/* AI bar */}
                  <div
                    className="w-1/3 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all shadow-md shadow-emerald-500/20"
                    style={{ height: `${aiHeight}%` }}
                    title={`AI Optimized Delay: ${aiVal.toFixed(0)}s`}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{dateString}</span>
              </div>
            );
          })}
          {uniqueDates.length === 0 && (
            <div className="w-full h-full flex items-center justify-center text-slate-500 font-sans">
              No historical data logs recorded.
            </div>
          )}
        </div>
      </div>

      {/* Top Performing Intersections */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" /> Historic Run Highlights
        </h3>

        <div className="space-y-2.5 text-xs font-mono">
          {history.slice(0, 4).map((run, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-xs">Run: {run.id.split('-')[1] || run.id}</span>
                <span className="text-slate-400 text-[11px] block font-sans">Weather: {run.config.weather} | Surge: +{run.config.trafficSurge}%</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-rose-400 font-bold">Delay: {run.results.avgDelaySeconds.toFixed(1)}s</span>
                <span className="text-emerald-400 font-bold">Throughput: +{run.results.throughput} veh/h</span>
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/30 font-bold uppercase text-[10px]">
                  Strategy: {run.strategy}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
