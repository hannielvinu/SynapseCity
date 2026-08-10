import React, { useState } from 'react';
import { ComputerVisionView } from '../components/ComputerVisionView';
import { PageHeader } from '../components/layout/PageHeader';
import { CameraFeed } from '../types';
import { Car, Compass, Navigation } from 'lucide-react';

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
    <div className="space-y-6">
      <PageHeader
        title="Live Traffic & Computer Vision Feeds"
        subtitle="4K edge AI perception pipeline performing multi-class vehicle detection, velocity radar scanning, and license plate optical character recognition."
        badgeText="4K VISION (60 FPS)"
        badgeType="cyan"
      />

      <ComputerVisionView cameraFeeds={cameraFeeds} />

      {/* Real-time Vehicle Tracker Panel */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 font-sans">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Active Vehicle Telemetry Ledger</span>
            </h3>
            <p className="text-xs text-slate-400">Authoritative simulated GPS tracking updates from the neural mesh network</p>
          </div>

          {/* Filter Toggles */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px]">
            {['all', 'car', 'truck', 'bus'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase transition-all ${
                  filterType === type 
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type}s
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Vehicle ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Active Route</th>
                <th className="py-3 px-4">Coordinates progress</th>
                <th className="py-3 px-4">Current Speed</th>
                <th className="py-3 px-4">State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300 font-mono">
              {filteredVehicles.slice(0, 15).map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-800/20 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-200">{vehicle.id}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      vehicle.type === 'truck' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      vehicle.type === 'bus' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                      'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}>
                      {vehicle.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-slate-500" />
                    <span>{vehicle.currentRoad}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                        <div className="bg-cyan-400 h-full" style={{ width: `${vehicle.progress}%` }}></div>
                      </div>
                      <span>{Math.floor(vehicle.progress)}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-100">{Math.floor(vehicle.speedMph)} mph</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      vehicle.status === 'queued' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredVehicles.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500 font-sans">
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

