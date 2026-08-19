import React, { useState } from 'react';
import { CoimbatoreOpenMap } from '../components/CoimbatoreOpenMap';
import { COIMBATORE_JUNCTIONS } from '../data/coimbatoreData';
import { IntersectionNode, EmergencyUnit, IncidentItem } from '../types';
import { 
  Flame, 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  CheckCircle2
} from 'lucide-react';

interface FireDriverPageProps {
  nodes?: IntersectionNode[];
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  vehicles?: any[];
}

export const FireDriverPage: React.FC<FireDriverPageProps> = ({
  nodes = [],
  emergencyUnits = [],
  incidents = [],
  vehicles = []
}) => {
  const [currentProgress, setCurrentProgress] = useState<number>(20);
  const [arrived, setArrived] = useState<boolean>(false);

  const fireUnit: EmergencyUnit = {
    id: 'em-2',
    callsign: 'Coimbatore Fire Rescue 1',
    type: 'fire_engine',
    origin: 'Fire Station South (Ukkadam)',
    destination: 'Gandhipuram Terminal (Structure Fire Incident)',
    currentProgress: currentProgress,
    pathNodeIds: ['node-6', 'node-4', 'node-10', 'node-1'],
    status: arrived ? 'arrived' : 'en_route',
    etaSeconds: Math.max(10, Math.floor((100 - currentProgress) * 3.2)),
    timeSavedSeconds: 180,
    greenWaveActive: true
  };

  const handleAdvance = () => {
    if (currentProgress < 95) {
      setCurrentProgress(prev => Math.min(100, prev + 30));
    } else {
      setCurrentProgress(100);
      setArrived(true);
    }
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Fire Driver Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-slate-900">Coimbatore Fire & Rescue 1 — Tactical Cockpit</h2>
              <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-[10px] font-mono font-bold">
                INCIDENT DISPATCH
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Navigating to Incident Scene: <strong className="text-slate-800">Gandhipuram Commercial Terminal</strong></p>
          </div>
        </div>

        <button
          onClick={handleAdvance}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>{arrived ? 'Scene Secured' : 'Simulate Forward Movement'}</span>
        </button>
      </div>

      {/* Main Map & Navigation Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 relative">
          <CoimbatoreOpenMap
            nodes={nodes}
            emergencyUnits={[fireUnit]}
            vehicles={vehicles}
            incidents={incidents}
            activeRoute={{
              pathNodeIds: fireUnit.pathNodeIds,
              etaSeconds: fireUnit.etaSeconds,
              destinationName: 'Gandhipuram Terminal'
            }}
            mode="driver"
            height="560px"
          />

          {/* Floating Guidance Banner */}
          <div className="absolute top-4 left-4 right-4 z-[1000] bg-slate-900/95 text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg">
                ⮑
              </div>
              <div>
                <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">In 150 meters</span>
                <h4 className="text-sm font-extrabold text-white">Arriving onto Cross Cut Road towards Gandhipuram</h4>
              </div>
            </div>

            <div className="text-right pl-3 border-l border-slate-700">
              <span className="text-[10px] text-slate-400 block font-semibold">ETA</span>
              <span className="text-lg font-black font-mono text-amber-400">
                {Math.floor(fireUnit.etaSeconds / 60)}m {fireUnit.etaSeconds % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Incident Scene Details</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Target Location:</span>
                <strong className="text-slate-900 text-sm">Gandhipuram Commercial Terminal</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Emergency Type:</span>
                <strong className="text-amber-800">Commercial Electrical Fire & Crowd Evacuation</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Arterial Clearance:</span>
                <strong className="text-emerald-700">4 Intersections Preempted (All Green)</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 shadow-sm text-xs">
            <div className="flex justify-between items-center text-slate-600">
              <span>Time Saved by Signal Preemption:</span>
              <span className="font-mono font-bold text-emerald-700">~2.5 minutes</span>
            </div>
            <div className="flex justify-between items-center text-slate-600">
              <span>Nearest Fire Hydrant:</span>
              <span className="font-mono font-bold text-slate-900">Gandhipuram Bus Bay 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
