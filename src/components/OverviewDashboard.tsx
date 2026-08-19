import React from 'react';
import { IntersectionNode, CityMetrics, EmergencyUnit, CameraFeed, NavigationTab } from '../types';
import { CoimbatoreOpenMap } from './CoimbatoreOpenMap';
import { 
  Activity, 
  Cpu, 
  Siren, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Radio, 
  Train,
  Hospital
} from 'lucide-react';
import { COIMBATORE_HOSPITALS, COIMBATORE_RAILWAY_LIVE } from '../data/coimbatoreData';

interface OverviewDashboardProps {
  nodes: IntersectionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  metrics: CityMetrics;
  emergencyUnits: EmergencyUnit[];
  cameraFeeds: CameraFeed[];
  vehicles: any[];
  intelligenceEvents?: any[];
  predictions?: any[];
  isSimulating: boolean;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenAiAssistant: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
  metrics,
  emergencyUnits,
  cameraFeeds,
  vehicles,
  intelligenceEvents = [],
  predictions = [],
  isSimulating,
  onNavigateTab,
  onOpenAiAssistant
}) => {
  const highestDensityNode = [...nodes].sort((a, b) => b.densityScore - a.densityScore)[0];
  const activeEmergency = emergencyUnits.find(u => u.greenWaveActive && u.status === 'en_route') || emergencyUnits[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Hero Map-First Operational Canvas */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-600" />
              <span>Coimbatore Urban Mobility & Signal Mesh Live View</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium">Real-time OpenStreetMap canvas tracking 11 signal junctions, live vehicle vectors, hospitals, and emergency corridors.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-mono font-bold">
              ● 11 Nodes Synchronized
            </span>
          </div>
        </div>

        <CoimbatoreOpenMap
          nodes={nodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          emergencyUnits={emergencyUnits}
          vehicles={vehicles}
          mode="operator"
          height="540px"
        />
      </div>

      {/* Floating Operational Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Priority Emergency Corridor Widget */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-xs uppercase tracking-wider">
              <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Emergency Corridor Lock</span>
            </div>
            <button 
              onClick={() => onNavigateTab('emergency')}
              className="text-xs text-rose-700 hover:text-rose-900 font-bold underline cursor-pointer"
            >
              Control
            </button>
          </div>

          {activeEmergency ? (
            <div className="p-3.5 bg-rose-50/70 rounded-xl border border-rose-200 text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>{activeEmergency.callsign}</span>
                <span className="text-rose-700 font-mono font-extrabold">ETA: ~{Math.floor(activeEmergency.etaSeconds / 60)}m</span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                Route: {activeEmergency.origin} → <strong>{activeEmergency.destination}</strong>
              </div>
              <div className="flex items-center justify-between text-[10px] pt-1">
                <span className="text-emerald-700 font-bold">Time Saved: {activeEmergency.timeSavedSeconds}s</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-mono font-bold border border-emerald-300">
                  PREEMPTED
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 font-medium py-2">
              Corridors clear. Preemption standby active for 108 Emergency Ambulance units.
            </p>
          )}
        </div>

        {/* Heuristic Multi-Agent Decisions Stream */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-600" />
              <span>Edge Agent Mesh</span>
            </h3>
            <button 
              onClick={() => onNavigateTab('predictive')} 
              className="text-xs text-cyan-700 hover:text-cyan-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              Stream <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <div className="space-y-2 max-h-[140px] overflow-y-auto custom-scrollbar">
            {intelligenceEvents.slice(0, 3).map((ev, i) => (
              <div key={i} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-semibold">
                  <span className="text-cyan-700 font-bold">{ev.type}</span>
                  <span>{new Date(ev.timestamp).toLocaleTimeString([], { hour12: false })}</span>
                </div>
                <p className="text-[11px] text-slate-700 font-medium mt-1 truncate">
                  {ev.data?.reason || JSON.stringify(ev.data || {}).substring(0, 45)}
                </p>
              </div>
            ))}
            {intelligenceEvents.length === 0 && (
              <div className="text-center py-4 text-slate-400 text-xs font-medium italic">
                Agent decision stream active on WebSocket...
              </div>
            )}
          </div>
        </div>

        {/* Railway Schedule Reference (eRail.in) */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-amber-100">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-xs uppercase tracking-wider">
              <Train className="w-4 h-4 text-amber-600" />
              <span>Coimbatore Jn (CBE) Reference</span>
            </div>
            <a 
              href="https://erail.in/station-live/coimbatore-jn-CBE" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[10px] text-amber-800 underline font-bold"
            >
              eRail.in
            </a>
          </div>

          <div className="space-y-1.5 text-xs">
            {COIMBATORE_RAILWAY_LIVE.trains.slice(0, 2).map((t, idx) => (
              <div key={idx} className="p-2 bg-amber-50/60 rounded-xl border border-amber-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{t.trainNumber} {t.trainName.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 block">PF {t.platform} • {t.destination.split(' ')[0]}</span>
                </div>
                <span className="font-mono font-bold text-amber-800">{t.scheduledDeparture}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
