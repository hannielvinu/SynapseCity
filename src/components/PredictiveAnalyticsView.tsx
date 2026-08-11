import React from 'react';
import { CityMetrics } from '../types';
import { TrendingUp, Zap, CloudRain, Sun, DollarSign, Activity, BarChart3, ShieldCheck } from 'lucide-react';

interface PredictiveAnalyticsViewProps {
  metrics: CityMetrics;
}

export const PredictiveAnalyticsView: React.FC<PredictiveAnalyticsViewProps> = ({ metrics }) => {
  // Calculate optimized curves dynamically based on live congestion index
  const hours = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  const baseCong = metrics.congestionIndex;
  const aiOptimizedCongestion = [
    Math.max(8, Math.floor(baseCong * 0.7)),
    Math.max(10, Math.floor(baseCong * 1.4)),
    Math.max(10, Math.floor(baseCong * 1.1)),
    Math.max(8, Math.floor(baseCong * 0.9)),
    Math.max(10, Math.floor(baseCong * 1.0)),
    Math.max(10, Math.floor(baseCong * 1.5)),
    Math.max(10, Math.floor(baseCong * 1.3)),
    Math.max(8, Math.floor(baseCong * 0.8)),
    Math.max(6, Math.floor(baseCong * 0.5)),
  ];
  const baselineCongestion = aiOptimizedCongestion.map(v => Math.min(99, Math.floor(v * 1.6)));

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <span>Predictive Congestion Forecasting & Environmental Impact</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Prototype trend predictions and simulated carbon emission reduction models</p>
        </div>

        <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-mono font-bold">
          Net CO2 Saved: -{metrics.co2SavedTonsToday} Tons
        </span>
      </div>

      {/* Main Predictive Chart Container */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>24-Hour Peak Congestion Comparison (Baseline vs SynapseCity AI)</span>
          </h3>

          <div className="flex items-center space-x-4 text-xs font-medium">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-rose-500/40 border border-rose-500 rounded"></span>
              <span className="text-slate-400">Unmanaged Grid</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded"></span>
              <span className="text-white font-bold">Simulated Heuristic Control</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart Comparison */}
        <div className="h-64 flex items-end justify-between gap-2 pt-8 pb-2 px-4 bg-slate-950 rounded-xl border border-slate-800/80">
          {hours.map((hour, idx) => {
            const baseVal = baselineCongestion[idx];
            const aiVal = aiOptimizedCongestion[idx];
            return (
              <div key={hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="w-full flex items-end justify-center gap-1.5 h-full">
                  {/* Baseline bar */}
                  <div
                    className="w-3/8 bg-rose-500/30 hover:bg-rose-500/50 rounded-t transition-all"
                    style={{ height: `${baseVal}%` }}
                    title={`Unmanaged: ${baseVal}%`}
                  ></div>
                  {/* Simulated bar */}
                  <div
                    className="w-3/8 bg-emerald-500 hover:bg-emerald-400 rounded-t transition-all shadow-md shadow-emerald-500/30"
                    style={{ height: `${aiVal}%` }}
                    title={`Heuristic Controlled: ${aiVal}%`}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{hour}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 text-center italic">
          * Simulated heuristic optimization reduces peak rush hour congestion index by up to <strong className="text-emerald-400 font-mono">45.4%</strong>.
        </p>
      </div>

      {/* Dynamic Toll & Congestion Pricing Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Dynamic Congestion Toll Metering</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Automatically adjusts bridge and downtown perimeter toll rates based on real-time vehicle density to flatten peak traffic demand.
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-medium">River Bridge Gateway Toll:</span>
              <span className="font-mono font-bold text-amber-300">$2.50 (Standard)</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-medium">Financial Hub Perimeter:</span>
              <span className="font-mono font-bold text-emerald-400">$0.00 (Zero Rate / Clear)</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Environmental Impact Summary</span>
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Measures city-wide fuel savings, tailpipe idling prevention, and greenhouse gas offset metrics achieved via adaptive signals.
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-medium">Idling Fuel Saved Today:</span>
              <span className="font-mono font-bold text-emerald-300">7,420 Gallons</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
              <span className="text-slate-300 font-medium">NOx & Particulate Reduction:</span>
              <span className="font-mono font-bold text-cyan-300">-22.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
