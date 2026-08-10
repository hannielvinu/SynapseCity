import React, { useState } from 'react';
import { EmergencyUnit, IntersectionNode } from '../types';
import { Siren, ShieldAlert, CheckCircle2, Clock, Plus, Zap, AlertTriangle, Navigation } from 'lucide-react';

interface EmergencyCorridorViewProps {
  emergencyUnits: EmergencyUnit[];
  nodes: IntersectionNode[];
  onDispatchEmergency: (newUnit: Omit<EmergencyUnit, 'id'>) => void;
  onClearEmergency: (unitId: string) => void;
}

export const EmergencyCorridorView: React.FC<EmergencyCorridorViewProps> = ({
  emergencyUnits,
  nodes,
  onDispatchEmergency,
  onClearEmergency
}) => {
  const [showDispatchForm, setShowDispatchForm] = useState(false);
  const [callsign, setCallsign] = useState('Ambulance Siren-9');
  const [type, setType] = useState<'ambulance' | 'fire_engine' | 'police_interceptor'>('ambulance');
  const [originId, setOriginId] = useState(nodes[1]?.id || nodes[0]?.id || '');
  const [destId, setDestId] = useState(nodes[4]?.id || nodes[0]?.id || '');

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    const originNode = nodes.find(n => n.id === originId);
    const destNode = nodes.find(n => n.id === destId);

    onDispatchEmergency({
      callsign,
      type,
      origin: originNode ? originNode.name : 'Sector 1',
      destination: destNode ? destNode.name : 'St. Jude Hospital',
      currentProgress: 10,
      pathNodeIds: [originId, destId],
      status: 'en_route',
      etaSeconds: 120,
      timeSavedSeconds: 210,
      greenWaveActive: true
    });

    setShowDispatchForm(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-rose-500/30">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Siren className="w-5 h-5 text-rose-400 animate-bounce" />
            <span>Smart Emergency Corridor Dispatch System</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Automated signal preempting and green-wave synchronization for priority responder vehicles</p>
        </div>

        <button
          onClick={() => setShowDispatchForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-950/40 border border-rose-400/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Priority Corridor</span>
        </button>
      </div>

      {/* Dispatch Modal / Drawer */}
      {showDispatchForm && (
        <div className="bg-slate-900/95 p-6 rounded-2xl border border-rose-500/50 space-y-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-rose-300 flex items-center gap-2">
              <Siren className="w-4 h-4" /> Priority Corridor Dispatch Configuration
            </h3>
            <button onClick={() => setShowDispatchForm(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
          </div>

          <form onSubmit={handleDispatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Vehicle Callsign</label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-medium focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Vehicle Type</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-medium focus:border-rose-500 outline-none"
              >
                <option value="ambulance">Ambulance (Medical Priority)</option>
                <option value="fire_engine">Fire Engine (Rescue Priority)</option>
                <option value="police_interceptor">Police Interceptor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Origin Node</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-medium focus:border-rose-500 outline-none"
              >
                {nodes.map((n) => (
                  <option key={`orig-${n.id}`} value={n.id}>{n.name} ({n.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Destination Node</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white font-medium focus:border-rose-500 outline-none"
              >
                {nodes.map((n) => (
                  <option key={`dest-${n.id}`} value={n.id}>{n.name} ({n.district})</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDispatchForm(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-rose-950/40"
              >
                Engage Signal Preemption & Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Corridors List */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">Active Responder Units & Green Waves</h3>

        {emergencyUnits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyUnits.map((unit) => (
              <div key={unit.id} className="bg-slate-900/90 rounded-2xl border border-rose-500/40 p-5 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <h4 className="font-extrabold text-white text-sm">{unit.callsign}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-bold border border-rose-500/30 uppercase tracking-wider">
                    GREEN WAVE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-medium">Route Origin</span>
                    <span className="font-bold text-slate-200">{unit.origin}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] font-medium">Destination</span>
                    <span className="font-bold text-slate-200">{unit.destination}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono font-medium">
                    <span>Corridor Progress</span>
                    <span className="text-cyan-400 font-bold">{unit.currentProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500" style={{ width: `${unit.currentProgress}%` }}></div>
                  </div>
                </div>

                {/* Time Saved & ETA */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-400 font-bold font-mono flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> -{unit.timeSavedSeconds}s Delay Prevented
                  </span>

                  <button
                    onClick={() => onClearEmergency(unit.id)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700 transition-all"
                  >
                    Clear Corridor Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-sm font-bold text-white">All Corridors Clear</p>
            <p className="text-xs text-slate-400">No active sirens detected. Traffic signals operating under multi-agent autonomous AI control.</p>
          </div>
        )}
      </div>
    </div>
  );
};
