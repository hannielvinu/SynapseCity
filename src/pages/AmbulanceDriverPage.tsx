import React, { useState, useEffect } from 'react';
import { CoimbatoreOpenMap } from '../components/CoimbatoreOpenMap';
import { COIMBATORE_HOSPITALS, COIMBATORE_JUNCTIONS } from '../data/coimbatoreData';
import { IntersectionNode, EmergencyUnit, IncidentItem } from '../types';
import { 
  Siren, 
  Navigation, 
  Hospital, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  ChevronRight, 
  RotateCcw,
  CheckCircle2,
  Volume2,
  ArrowUpRight
} from 'lucide-react';

interface AmbulanceDriverPageProps {
  nodes?: IntersectionNode[];
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  vehicles?: any[];
  onDispatchEmergency?: (unit: any) => void;
  onClearEmergency?: (unitId: string) => void;
}

export const AmbulanceDriverPage: React.FC<AmbulanceDriverPageProps> = ({
  nodes = [],
  emergencyUnits = [],
  incidents = [],
  vehicles = [],
  onDispatchEmergency,
  onClearEmergency
}) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>('hosp-psg');
  const [currentProgress, setCurrentProgress] = useState<number>(35);
  const [sirenAudible, setSirenAudible] = useState<boolean>(true);
  const [arrived, setArrived] = useState<boolean>(false);

  const selectedHospital = COIMBATORE_HOSPITALS.find(h => h.id === selectedHospitalId) || COIMBATORE_HOSPITALS[0];

  // Derive active emergency unit or create active ambulance driver context
  const activeUnit = emergencyUnits.find(u => u.type === 'ambulance') || {
    id: 'em-1',
    callsign: 'Ambulance Unit 108-A17',
    type: 'ambulance' as const,
    origin: 'Coimbatore Medical College Hospital (CMCH)',
    destination: selectedHospital.name,
    currentProgress: currentProgress,
    pathNodeIds: ['node-4', 'node-10', 'node-2', 'node-9', 'node-11'],
    status: (arrived ? 'arrived' : 'en_route') as any,
    etaSeconds: Math.max(15, Math.floor((100 - currentProgress) * 2.8)),
    timeSavedSeconds: 240,
    greenWaveActive: true
  };

  // Next upcoming junction along route
  const nextNodeId = activeUnit.pathNodeIds[Math.min(1, activeUnit.pathNodeIds.length - 1)];
  const nextNode = nodes.find(n => n.id === nextNodeId) || nodes[1];

  // Route advance handler
  const handleAdvance = () => {
    if (currentProgress < 95) {
      setCurrentProgress(prev => Math.min(100, prev + 25));
    } else {
      setCurrentProgress(100);
      setArrived(true);
    }
  };

  const handleReset = () => {
    setCurrentProgress(10);
    setArrived(false);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Driver Cockpit Floating Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Siren className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-slate-900">Ambulance Unit 108 (A17) — Driver Cockpit</h2>
              <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[10px] font-mono font-bold">
                PRIORITY PREEMPTION
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Navigating to Emergency Trauma Bay: <strong className="text-slate-800">{selectedHospital.name}</strong></p>
          </div>
        </div>

        {/* Live Corridor Stats Pill */}
        <div className="flex items-center gap-2">
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Green Wave Locked</span>
          </div>

          <button
            onClick={handleAdvance}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation className="w-4 h-4" />
            <span>{arrived ? 'Completed' : 'Simulate Forward Movement'}</span>
          </button>
        </div>
      </div>

      {/* Main Map & Navigation Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero Navigation Map (2 cols) */}
        <div className="lg:col-span-2 relative">
          <CoimbatoreOpenMap
            nodes={nodes}
            emergencyUnits={[activeUnit]}
            vehicles={vehicles}
            incidents={incidents}
            activeRoute={{
              pathNodeIds: activeUnit.pathNodeIds,
              etaSeconds: activeUnit.etaSeconds,
              destinationName: selectedHospital.name
            }}
            mode="driver"
            height="580px"
          />

          {/* Floating Driver Turn-by-Turn Guidance Banner */}
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 flex items-center justify-center font-black text-lg">
                ⮡
              </div>
              <div>
                <span className="text-[10px] text-cyan-300 font-bold uppercase tracking-wider block">In 200 meters</span>
                <h4 className="text-sm font-extrabold text-white">Continue onto Avinashi Road towards {nextNode.name}</h4>
              </div>
            </div>

            <div className="text-right pl-3 border-l border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">ETA</span>
              <span className="text-lg font-black font-mono text-emerald-400">
                {Math.floor(activeUnit.etaSeconds / 60)}m {activeUnit.etaSeconds % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Right Cockpit Telemetry & Hospital Destination Selector */}
        <div className="space-y-4">
          {/* Signal Light Status at Next Junction */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-600" />
                <span>Next Approaching Signal</span>
              </h3>
              <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-mono font-bold border border-emerald-200">
                PREEMPTED
              </span>
            </div>

            {/* Realistic Traffic Light Graphic */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {/* Traffic Light Housing */}
              <div className="w-12 bg-slate-900 rounded-xl p-2 flex flex-col items-center gap-2 shadow-inner border border-slate-800 shrink-0">
                <div className="w-6 h-6 rounded-full bg-rose-950/40 border border-rose-900/60" />
                <div className="w-6 h-6 rounded-full bg-amber-950/40 border border-amber-900/60" />
                <div className="w-6 h-6 rounded-full bg-emerald-500 border border-emerald-400 shadow-md shadow-emerald-500/80 animate-pulse" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-extrabold text-slate-900 block">{nextNode.name}</span>
                <span className="text-[11px] text-emerald-700 font-bold block">GREEN WAVE SIGNAL HOLD</span>
                <p className="text-[10px] text-slate-500">Signal held green for incoming emergency siren vector.</p>
                <div className="text-[11px] font-mono text-slate-700 font-bold mt-1">
                  Remaining Priority Window: <span className="text-cyan-700">{nextNode.phaseTimeRemaining || 24}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hospital Destination Selector */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Hospital className="w-4 h-4 text-rose-600" />
              <span>Hospital Destination</span>
            </h3>

            <div className="space-y-2">
              {COIMBATORE_HOSPITALS.map(hosp => {
                const isSelected = hosp.id === selectedHospitalId;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => {
                      setSelectedHospitalId(hosp.id);
                      setCurrentProgress(15);
                      setArrived(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-rose-50/70 border-rose-300 shadow-xs ring-1 ring-rose-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-900">{hosp.name}</span>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{hosp.address}</p>
                    <div className="text-[10px] text-rose-700 font-semibold mt-1">
                      Emergency Desk: {hosp.emergencyPhone}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trip Performance Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2.5 shadow-sm text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Time Saved by Signal Preemption:</span>
              <span className="font-mono font-bold text-emerald-700">~3.8 minutes</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Average Transit Velocity:</span>
              <span className="font-mono font-bold text-slate-900">68 km/h</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Traffic Corridor Impedance:</span>
              <span className="font-mono font-bold text-emerald-700">0% (All Clear)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
