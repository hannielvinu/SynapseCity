import React from 'react';
import { TransitRoute } from '../types';
import { Bus, Cpu, Zap, ShieldCheck, CheckCircle2, TrendingUp, Users } from 'lucide-react';

interface TransitAVViewProps {
  transitRoutes: TransitRoute[];
}

export const TransitAVView: React.FC<TransitAVViewProps> = ({ transitRoutes }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Bus className="w-5 h-5 text-purple-400" />
            <span>Autonomous Fleet & Public Transit Priority Lanes</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time scheduling, dedicated lane access control, and AV platoon platooning optimization</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-xl font-mono">
            AV Platoon Sync: 99.4%
          </span>
        </div>
      </div>

      {/* Transit Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transitRoutes.map((route) => (
          <div key={route.id} className="bg-slate-900/90 rounded-xl border border-slate-800 p-4 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                  {route.code}
                </span>
                <h3 className="font-bold text-slate-100 text-sm mt-1">{route.name}</h3>
              </div>
              <span className="text-emerald-400 text-xs font-mono font-semibold">
                {route.scheduleAdherenceMinutes >= 0 ? `+${route.scheduleAdherenceMinutes}m On-Time` : `${route.scheduleAdherenceMinutes}m Delayed`}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Active AV Fleet Count:</span>
                <span className="font-mono font-bold text-cyan-300">{route.activeVehicles} Units</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Passenger Load Factor:</span>
                <span className="font-mono font-bold text-amber-300">{route.passengerCapacityPercent}%</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Priority Lane Allocation:</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono uppercase text-[10px]">
                  {route.priorityLaneStatus}
                </span>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Estimated Emissions Impact:</span>
              <span className="font-mono font-bold text-emerald-400">Simulated</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
