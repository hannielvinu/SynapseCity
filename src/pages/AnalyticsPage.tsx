import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CityMetrics } from '../types';
import { BarChart3, Zap, TrendingDown, Clock, ShieldCheck, ArrowUpRight, Award } from 'lucide-react';

interface AnalyticsPageProps {
  metrics: CityMetrics;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ metrics }) => {
  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Mobility Analytics & ESG Carbon Portal"
        subtitle="Historical travel time savings, CO2 emission offsets, and signal optimization benchmarks across municipal districts."
        badgeText="ESG VERIFIED"
        badgeType="emerald"
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Daily CO2 Reduction</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-400">-{metrics.co2SavedTonsToday} Tons</div>
          <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.4% vs monthly baseline
          </div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Delay Reduction</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black font-mono text-cyan-300">-6.8 min</div>
          <div className="text-[11px] text-cyan-400 font-semibold">Per commute leg</div>
        </div>

        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Signal Optimization Rate</span>
            <ShieldCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black font-mono text-blue-300">{metrics.signalOptimizationEfficiency}%</div>
          <div className="text-[11px] text-blue-400 font-semibold">142 nodes synchronized</div>
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

      {/* Top Performing Intersections */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-cyan-400" /> Top Performing Intersections
        </h3>

        <div className="space-y-2.5 text-xs">
          {[
            { name: 'Bayfront Pkwy & Harbor Dr', district: 'Bayfront Sector', throughput: '+42%', delay: '-8.2 min', score: 99.1 },
            { name: '5th Ave & Grand Blvd', district: 'Financial Core', throughput: '+38%', delay: '-6.4 min', score: 98.4 },
            { name: 'St. Jude Hospital Arterial & 12th', district: 'Medical Zone', throughput: '+54%', delay: '-11.0 min', score: 99.9 }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="font-bold text-white text-xs">{item.name}</span>
                <span className="text-slate-400 text-[11px] block">{item.district}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-emerald-400 font-bold">{item.throughput} Throughput</span>
                <span className="text-cyan-400">{item.delay} Delay</span>
                <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/30 font-bold">
                  Score: {item.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
