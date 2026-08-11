import React from 'react';
import { IntersectionNode, CityMetrics, EmergencyUnit, CameraFeed, NavigationTab } from '../types';
import { CityMap } from './CityMap';
import { 
  Activity, 
  Cpu, 
  Siren, 
  Car, 
  Zap, 
  TrendingDown, 
  Video, 
  Sliders, 
  AlertTriangle, 
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  BarChart2,
  Clock
} from 'lucide-react';

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
  // Find top congested node
  const highestDensityNode = [...nodes].sort((a, b) => b.densityScore - a.densityScore)[0];

  return (
    <div className="space-y-6 font-sans">
      {/* Top Quick Metric Stat Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Stat 1 */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active City Vehicles</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-white">{metrics.totalActiveVehicles.toLocaleString()}</span>
            <span className="text-[11px] text-emerald-400 font-bold block flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2.4% vs peak avg
            </span>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Avg Grid Speed</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{metrics.avgSpeedKmh} <span className="text-xs text-slate-400 font-normal">km/h</span></span>
            <span className="text-[11px] text-emerald-400 font-bold block flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2% faster flow
            </span>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Congestion Index</span>
            <TrendingDown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-amber-300">{metrics.congestionIndex}%</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1 uppercase tracking-wider">
              LOW CONGESTION
            </span>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Estimated Emissions Impact</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-emerald-300">Prototype</span>
            <span className="text-[11px] text-slate-500 font-bold block mt-1">
              Pending Calculation
            </span>
          </div>
        </div>

        {/* Stat 5 */}
        <div className="col-span-2 md:col-span-4 lg:col-span-1 bg-gradient-to-br from-cyan-950/60 to-slate-900 p-4 rounded-2xl border border-cyan-800/50 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-cyan-300 text-xs font-semibold">
            <span>Simulated Agents</span>
            <Cpu className="w-4 h-4 text-cyan-400 animate-pulse" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-black font-mono text-cyan-200">{metrics.activeAiAgents} <span className="text-xs text-slate-300 font-normal">Nodes</span></span>
            <span className="text-[11px] text-cyan-300 font-bold block mt-1">
              {metrics.signalOptimizationEfficiency}% Optimization Rate
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Interactive Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Live Interactive City Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Simulated Traffic Canvas</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Click any intersection to inspect signal phases</span>
          </div>

          <CityMap
            nodes={nodes}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            emergencyUnits={emergencyUnits}
            cameraFeeds={cameraFeeds}
            vehicles={vehicles}
            isSimulating={isSimulating}
          />
        </div>

        {/* Right 1 Column: Real-Time Command Center Panels */}
        <div className="space-y-4">
          {/* Active Emergency Alert Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-rose-500/40 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider">
                <Siren className="w-4 h-4 animate-bounce" />
                <span>Active Priority Corridor</span>
              </div>
              <button 
                onClick={() => onNavigateTab('emergency')}
                className="text-[11px] text-rose-300 hover:text-white underline font-bold"
              >
                Manage
              </button>
            </div>

            {emergencyUnits.length > 0 ? (
              <div className="mt-3 space-y-2">
                {emergencyUnits.map((unit) => (
                  <div key={unit.id} className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-100">
                      <span>{unit.callsign}</span>
                      <span className="text-rose-400 font-mono font-bold">ETA: {unit.etaSeconds}s</span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {unit.origin} → {unit.destination}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
                      <span className="text-emerald-400 font-bold">-{unit.timeSavedSeconds}s Delay Reduced</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono font-bold border border-emerald-500/30 uppercase">
                        GREEN WAVE ACTIVE
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-xs text-slate-400">All corridors clear. Standing by for priority siren triggers.</p>
            )}
          </div>

          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Simulated Agent Logs</span>
              </h3>
              <button onClick={() => onNavigateTab('predictive')} className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors">
                View All <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <div className="p-4 flex-1 flex flex-col gap-3 overflow-y-auto max-h-[300px] custom-scrollbar">
              {intelligenceEvents.slice(0, 5).map((ev, i) => (
                <div key={i} className="flex gap-3 items-start border-l-2 border-indigo-500 pl-3 py-1">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-300">
                      {ev.type === 'AGENT_PROPOSAL_APPROVED' ? 'Decision Executed' : 
                       ev.type === 'PREDICTION_UPDATED' ? 'Prediction Generated' : 
                       ev.type}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {ev.data.reason || JSON.stringify(ev.data).substring(0, 50) + "..."}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 whitespace-nowrap">
                    {new Date(ev.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
              {intelligenceEvents.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-500 text-sm font-semibold italic">
                  Awaiting Intelligence Events...
                </div>
              )}
            </div>
          </div>

          {/* Top Congested Intersection Highlight */}
          {highestDensityNode && (
            <div className="bg-slate-900/90 p-4 rounded-2xl border border-amber-500/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-amber-400 uppercase font-extrabold block">Highest Density Hub</span>
                <span className="font-extrabold text-white">{highestDensityNode.name}</span>
                <span className="text-slate-400 text-[11px] block mt-0.5">{highestDensityNode.densityScore}% density ({highestDensityNode.vehicleCount} vehicles)</span>
              </div>
              <button
                onClick={() => {
                  onSelectNode(highestDensityNode.id);
                  onNavigateTab('signals');
                }}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-xl text-xs font-bold"
              >
                Inspect
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Computer Vision Live Previews + Transit Lanes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cameraFeeds.slice(0, 4).map((cam) => (
          <div key={cam.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-md flex flex-col">
            {/* Cam Stream Visual Mock */}
            <div className="relative h-28 bg-slate-950 overflow-hidden group">
              <img
                src={cam.streamUrlPlaceholder}
                alt={cam.title}
                className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

              <div className="absolute top-2 left-2 px-2 py-0.5 bg-slate-950/80 rounded-md border border-slate-700 text-[10px] font-mono text-cyan-300 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                LIVE CV FEED
              </div>

              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] text-white font-bold">
                <span className="truncate">{cam.district}</span>
                <span className="text-emerald-400 font-mono">{cam.avgSpeedKmh} km/h</span>
              </div>
            </div>

            {/* Cam Stats */}
            <div className="p-3.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium">Detected Cars:</span>
                <span className="font-mono font-bold text-cyan-300">{cam.detections.cars}</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="font-medium font-sans">Heavy Vehicles / Buses:</span>
                <span className="font-mono font-bold text-amber-300">{cam.detections.buses + cam.detections.trucks}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
