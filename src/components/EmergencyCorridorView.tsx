import React, { useState } from 'react';
import { EmergencyUnit, IntersectionNode } from '../types';
import { Siren, CheckCircle2, Plus, Zap } from 'lucide-react';

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
    
    let destName = 'Hospital';
    if (destId === (nodes[1]?.id || 'node-2')) destName = 'PSG Hospitals';
    else if (destId === (nodes[2]?.id || 'node-3')) destName = 'KMCH';
    else if (destId === (nodes[3]?.id || 'node-4')) destName = 'Ganga Hospital';
    else if (destId === (nodes[4]?.id || 'node-5')) destName = 'Coimbatore Medical College Hospital';

    onDispatchEmergency({
      callsign,
      type,
      origin: originNode ? originNode.name : 'Sector 1',
      destination: destName,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-rose-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Siren className="w-5 h-5 text-rose-600 animate-bounce" />
            <span>Emergency Green Wave Preemption</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">Automated signal preempting and corridor synchronization for priority response units</p>
        </div>

        <button
          onClick={() => setShowDispatchForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-sm shadow-rose-500/20 border border-rose-500/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch Priority Corridor</span>
        </button>
      </div>

      {/* Dispatch Modal / Drawer */}
      {showDispatchForm && (
        <div className="bg-white p-6 rounded-2xl border border-rose-300 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Siren className="w-4 h-4 text-rose-600" /> Priority Corridor Dispatch Configuration
            </h3>
            <button onClick={() => setShowDispatchForm(false)} className="text-slate-400 hover:text-slate-700 font-bold p-1 cursor-pointer">✕</button>
          </div>

          <form onSubmit={handleDispatch} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-700 mb-1 font-bold">Vehicle Callsign</label>
              <input
                type="text"
                value={callsign}
                onChange={(e) => setCallsign(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:border-rose-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Vehicle Type</label>
              <select
                value={type}
                onChange={(e: any) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:border-rose-500 outline-none"
              >
                <option value="ambulance">Ambulance (Medical Priority)</option>
                <option value="fire_engine">Fire Engine (Rescue Priority)</option>
                <option value="police_interceptor">Police Interceptor</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Origin Node</label>
              <select
                value={originId}
                onChange={(e) => setOriginId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:border-rose-500 outline-none"
              >
                {nodes.map((n) => (
                  <option key={`orig-${n.id}`} value={n.id}>{n.name} ({n.district})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 mb-1 font-bold">Destination Facility</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:border-rose-500 outline-none"
              >
                <option value={nodes[1]?.id || 'node-2'}>PSG Hospitals</option>
                <option value={nodes[2]?.id || 'node-3'}>KMCH</option>
                <option value={nodes[3]?.id || 'node-4'}>Ganga Hospital</option>
                <option value={nodes[4]?.id || 'node-5'}>Coimbatore Medical College Hospital</option>
              </select>
            </div>

            <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowDispatchForm(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-xs shadow-sm shadow-rose-500/20 cursor-pointer"
              >
                Engage Signal Preemption & Dispatch
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Corridors List */}
      <div className="space-y-4">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Active Responder Units & Green Waves</h3>

        {emergencyUnits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {emergencyUnits.map((unit) => (
              <div key={unit.id} className="bg-white rounded-2xl border border-rose-300 p-5 space-y-4 shadow-sm ring-1 ring-rose-200">
                <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                    <h4 className="font-extrabold text-slate-900 text-sm">{unit.callsign}</h4>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 text-[10px] font-mono font-bold border border-rose-200 uppercase tracking-wider">
                    GREEN WAVE ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">Origin</span>
                    <span className="font-bold text-slate-900">{unit.origin}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[10px] font-semibold">Destination</span>
                    <span className="font-bold text-slate-900">{unit.destination}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-600 font-mono font-medium">
                    <span>Corridor Progress</span>
                    <span className="text-cyan-800 font-bold">{unit.currentProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div className="bg-gradient-to-r from-rose-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${unit.currentProgress}%` }}></div>
                  </div>
                </div>

                {/* Time Saved & ETA */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-emerald-700 font-bold font-mono flex items-center gap-1 text-[11px]">
                    <Zap className="w-3.5 h-3.5" /> SIMULATION RESULT: {unit.timeSavedSeconds}s Saved
                  </span>

                  <button
                    onClick={() => onClearEmergency(unit.id)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition-all cursor-pointer"
                  >
                    Clear Lock
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2 shadow-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-slate-900">All Corridors Clear</p>
            <p className="text-xs text-slate-500 font-medium">No active sirens detected. Traffic signals operating under multi-agent autonomous AI control.</p>
          </div>
        )}
      </div>
    </div>
  );
};
