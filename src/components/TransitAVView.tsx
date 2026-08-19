import React from 'react';
import { TransitRoute } from '../types';
import { Bus } from 'lucide-react';

interface TransitAVViewProps {
  transitRoutes: TransitRoute[];
}

export const TransitAVView: React.FC<TransitAVViewProps> = ({ transitRoutes }) => {
  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Bus className="w-5 h-5 text-purple-600" />
            <span>Autonomous Fleet & Public Transit Priority Lanes</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time scheduling, dedicated lane access control, and transit prioritization</p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl font-mono font-bold">
            Transit Fleet Sync: Active
          </span>
        </div>
      </div>

      {/* Transit Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {transitRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-mono font-bold">
                  {route.code}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm mt-1">{route.name}</h3>
              </div>
              <span className="text-emerald-700 text-xs font-mono font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {route.scheduleAdherenceMinutes >= 0 ? `+${route.scheduleAdherenceMinutes}m On-Time` : `${route.scheduleAdherenceMinutes}m Delayed`}
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-medium">
              <div className="flex justify-between text-slate-600">
                <span>Active Fleet:</span>
                <span className="font-mono font-bold text-slate-900">{route.activeVehicles} Units</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Load Factor:</span>
                <span className="font-mono font-bold text-amber-700">{route.passengerCapacityPercent}%</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Priority Lane:</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono uppercase text-[10px] font-bold">
                  {route.priorityLaneStatus}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
