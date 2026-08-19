import React from 'react';
import { CityMetrics } from '../types';
import { TrendingUp, IndianRupee, BarChart3, ShieldCheck } from 'lucide-react';

interface PredictiveAnalyticsViewProps {
  metrics: CityMetrics;
  predictions?: any[];
}

export const PredictiveAnalyticsView: React.FC<PredictiveAnalyticsViewProps> = ({ predictions = [] }) => {
  const latestPredictions = predictions.slice(-6);
  const hasPredictions = latestPredictions.length > 0;

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Predictive Congestion Forecasting & Heuristics</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">Statistical heuristic models projecting queue buildups 15 to 60 minutes in advance</p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mono font-bold">
          Model: Heuristic Forecast Engine
        </span>
      </div>

      {/* Main Predictive Chart Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-600" />
            <span>Congestion Horizon Comparison (Unmanaged vs Adaptive Signals)</span>
          </h3>

          <div className="flex items-center space-x-4 text-xs font-semibold">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-rose-200 border border-rose-400 rounded"></span>
              <span className="text-slate-600">Unmanaged Grid</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-500 rounded"></span>
              <span className="text-slate-900 font-bold">Heuristic Adaptive Wave</span>
            </div>
          </div>
        </div>

        {/* Visual Bar Chart Comparison */}
        <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-3 px-4 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          {!hasPredictions ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="text-sm font-bold text-slate-800 tracking-wider">NO ACTIVE FORECAST WINDOW</div>
              <div className="flex gap-6 text-slate-500 font-mono text-xs font-bold">
                <span>15 MIN —</span>
                <span>30 MIN —</span>
                <span>60 MIN —</span>
              </div>
              <div className="text-[10px] text-cyan-800 font-bold bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200 uppercase tracking-wider mt-1">
                HEURISTIC / PROTOTYPE
              </div>
            </div>
          ) : (
            latestPredictions.map((pred, idx) => {
              const baseVal = pred.currentState?.density || 0;
              const aiVal = pred.predictedState?.density || 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-2 h-full">
                    <div
                      className="w-3/8 bg-rose-200 hover:bg-rose-300 border border-rose-300 rounded-t transition-all"
                      style={{ height: `${Math.max(10, baseVal)}%` }}
                      title={`Current Density: ${baseVal}%`}
                    ></div>
                    <div
                      className="w-3/8 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all shadow-sm"
                      style={{ height: `${Math.max(10, aiVal)}%` }}
                      title={`Predicted Density (${pred.horizonMinutes}m): ${aiVal}%`}
                    ></div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-600">+{pred.horizonMinutes}m</span>
                </div>
              );
            })
          )}
        </div>

        <p className="text-xs text-slate-500 text-center font-medium">
          * Statistical forecast data updated synchronously with city coordinator cycle.
        </p>
      </div>

      {/* Dynamic Toll & Congestion Pricing Simulator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-amber-600" />
            <span>Dynamic Congestion Toll Metering</span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Simulates dynamic toll pricing adjustments across arterial gateways to flatten peak vehicle demand.
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Airport Gateway Corridor:</span>
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">₹150.00 (Standard)</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Gandhipuram Commercial Sector:</span>
              <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">₹0.00 (Free Flow)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>Environmental Impact Offset (Simulated)</span>
          </h3>

          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            Measures estimated idling reduction and particulate offset achieved via synchronized corridor green waves.
          </p>

          <div className="space-y-2 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Idling Fuel Saved:</span>
              <span className="font-mono font-bold text-slate-700">Measured in Digital Twin</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <span className="text-slate-700 font-semibold">Emissions Reduction:</span>
              <span className="font-mono font-bold text-slate-700">Measured in Digital Twin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
