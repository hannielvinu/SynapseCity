import React, { useState } from 'react';
import { ComputerVisionView } from '../components/ComputerVisionView';
import { PageHeader } from '../components/layout/PageHeader';
import { CameraFeed } from '../types';
import { Car, Compass } from 'lucide-react';

interface LiveTrafficPageProps {
  cameraFeeds: CameraFeed[];
  vehicles: any[];
}

export const LiveTrafficPage: React.FC<LiveTrafficPageProps> = ({ cameraFeeds, vehicles }) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredVehicles = vehicles.filter(v => {
    if (filterType === 'all') return true;
    return v.type === filterType;
  });

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Live Traffic & Computer Vision Feeds"
        subtitle="Prototype perception pipeline performing multi-class vehicle detection, velocity radar scanning, and license plate optical character recognition."
        badgeText="PROTOTYPE VISION"
        badgeType="cyan"
      />

      <ComputerVisionView cameraFeeds={cameraFeeds} />

      {/* Real-time Vehicle Tracker Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-600" />
              <span>Active Vehicle Telemetry Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">Authoritative simulated GPS tracking updates from the neural mesh network</p>
          </div>

          {/* Filter Toggles */}
          <div className="flex flex-wrap items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            {['all', 'car', 'truck', 'bus', 'motorcycle', 'scooter', 'auto_rickshaw'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase text-[10px] transition-all cursor-pointer ${
                  filterType === type 
                    ? 'bg-white text-cyan-800 border border-slate-200 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type.replace('_', ' ')}s
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Vehicle ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Active Route</th>
                <th className="py-3 px-4">Route Progress</th>
                <th className="py-3 px-4">Current Speed</th>
                <th className="py-3 px-4">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filteredVehicles.slice(0, 15).map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{vehicle.id}</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      vehicle.type === 'truck' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      vehicle.type === 'bus' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      'bg-cyan-50 text-cyan-800 border border-cyan-200'
                    }`}>
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 flex items-center gap-1.5 font-sans">
                    <Compass className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vehicle.currentRoad}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                        <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${vehicle.progress}%` }}></div>
                      </div>
                      <span className="text-slate-900 font-semibold">{Math.floor(vehicle.progress)}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{Math.floor(vehicle.speedKmh)} km/h</td>
                  <td className="py-3.5 px-4 font-sans">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      vehicle.status === 'queued' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 font-sans italic">
                    No active vehicles tracked matching selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
