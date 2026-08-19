import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CityMetrics } from '../types';
import { BarChart3, Clock, ShieldCheck, History } from 'lucide-react';

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
    : 0;
  const avgBaseDelay = baselineRuns.length > 0
    ? baselineRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / baselineRuns.length
    : 0;

  const delaySavings = (avgBaseDelay > 0 && avgAiDelay > 0) ? ((avgBaseDelay - avgAiDelay) / 60) : 0;
  const uniqueDates = Array.from(new Set(history.map(r => r.timestamp.split(' ')[0]))).slice(0, 7).reverse();

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Mobility Analytics Portal"
        subtitle="Historical travel time savings and signal optimization benchmarks across municipal districts."
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Avg Delay Savings</span>
            <Clock className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-700">
            {delaySavings !== 0 ? `${delaySavings > 0 ? '-' : '+'}${Math.abs(delaySavings).toFixed(1)} min` : 'N/A'}
          </div>
          <div className="text-[11px] text-cyan-800 font-semibold">
            {delaySavings !== 0 ? 'Per commute route leg' : 'No completed history'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Signal Optimization Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-700">{metrics.signalOptimizationEfficiency}%</div>
          <div className="text-[11px] text-blue-800 font-semibold">Edge nodes synchronized</div>
        </div>
      </div>

      {/* Strategy Comparisons Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-600" /> Historic Simulation Delay Comparisons
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">Aggregate comparison of baseline delay vs heuristic optimization runs</p>
          </div>

          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['daily', 'weekly', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setFilterRange(range as any)}
                className={`px-3 py-1 rounded-lg font-bold uppercase text-[10px] transition-all cursor-pointer ${
                  filterRange === range 
                    ? 'bg-white text-cyan-900 border border-slate-200 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Visual chart */}
        {history.length > 0 ? (
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-3 px-4 bg-slate-50 rounded-xl border border-slate-200">
            {uniqueDates.map((dateString) => {
              const dateAiRuns = history.filter(r => r.strategy === 'ai' && r.timestamp.startsWith(dateString));
              const dateBaseRuns = history.filter(r => r.strategy === 'baseline' && r.timestamp.startsWith(dateString));

              const aiVal = dateAiRuns.length > 0 
                ? dateAiRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / dateAiRuns.length
                : 0;
              const baseVal = dateBaseRuns.length > 0
                ? dateBaseRuns.reduce((acc, r) => acc + r.results.avgDelaySeconds, 0) / dateBaseRuns.length
                : 0;

              const maxVal = Math.max(aiVal, baseVal, 100);
              const aiHeight = `${(aiVal / maxVal) * 100}%`;
              const baseHeight = `${(baseVal / maxVal) * 100}%`;

              return (
                <div key={dateString} className="flex flex-col items-center gap-2 flex-1 group">
                  <div className="flex items-end gap-1.5 w-full h-full relative">
                    {/* Baseline Bar */}
                    <div className="flex-1 bg-slate-300 rounded-t-sm relative transition-all group-hover:bg-slate-400" style={{ height: baseHeight }}>
                      {baseVal > 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{Math.round(baseVal)}s</div>}
                    </div>
                    {/* AI Bar */}
                    <div className="flex-1 bg-cyan-600 rounded-t-sm relative transition-all group-hover:bg-cyan-500" style={{ height: aiHeight }}>
                      {aiVal > 0 && <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-cyan-800 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{Math.round(aiVal)}s</div>}
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                    {dateString}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-xl border border-slate-200">
            <History className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-bold text-slate-800 tracking-wider">NO COMPLETED SIMULATION RUNS</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">Run a Digital Twin experiment to generate measured comparison results.</p>
          </div>
        )}
      </div>

      {/* History Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" /> Recent Benchmark Ledger
        </h3>

        {history.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.slice(0, 4).map((run, idx) => (
            <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div>
                <span className="font-bold text-slate-900 text-xs">Run: {run.id.split('-')[1] || run.id}</span>
                <span className="text-slate-500 text-[11px] block font-sans">Weather: {run.config.weather} | Surge: +{run.config.trafficSurge}%</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-rose-700">Delay: {run.results.avgDelaySeconds.toFixed(1)}s</span>
                <span className="text-emerald-700">+{run.results.throughput} veh/h</span>
                <span className="px-2 py-0.5 bg-cyan-50 text-cyan-800 rounded border border-cyan-200 text-[10px] uppercase font-sans">
                  {run.strategy}
                </span>
              </div>
            </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-xs text-slate-400 font-medium">No recent benchmarks recorded.</p>
          </div>
        )}
      </div>
    </div>
  );
};
