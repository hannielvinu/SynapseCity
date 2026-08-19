import React from 'react';
import { IntersectionNode, SignalMode } from '../types';
import { Sparkles, Clock, MapPin, Activity, RadioTower, AlertTriangle } from 'lucide-react';

interface SignalControlViewProps {
  nodes: IntersectionNode[];
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  onUpdateNodeSignalMode: (nodeId: string, mode: SignalMode) => void;
  onUpdatePhaseDuration: (nodeId: string, phaseTime: number) => void;
  onTriggerAiRebalance: (nodeId: string) => void;
}

export const SignalControlView: React.FC<SignalControlViewProps> = ({
  nodes,
  onUpdateNodeSignalMode,
  onTriggerAiRebalance
}) => {
  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <RadioTower className="w-5 h-5 text-cyan-600" />
            <span>Simulated Signal Control Network</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5 font-medium">Real-time adaptive phase optimization and emergency preemption</p>
        </div>

        <button
          onClick={() => onTriggerAiRebalance(nodes[0]?.id || '')}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-sm shadow-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-emerald-200" />
          <span>Optimize Grid Timing</span>
        </button>
      </div>

      {/* Traffic Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nodes.map((node) => {
          const isEmergency = node.signalState === 'emergency_override' || node.signalState === 'emergency_green';
          const isGreen = node.signalState === 'green' || isEmergency;
          const isYellow = node.signalState === 'yellow';
          const isRed = node.signalState === 'red' && !isEmergency;

          return (
            <div 
              key={node.id} 
              className={`bg-white rounded-2xl border ${
                isEmergency 
                  ? 'border-emerald-400 shadow-md ring-2 ring-emerald-500/20' 
                  : 'border-slate-200 shadow-sm'
              } p-5 flex flex-col h-full relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5 z-10 relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {node.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold ml-5">{node.district}</p>
                </div>
                
                {/* Traffic Light Housing */}
                <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-full flex flex-col gap-1.5 shadow-inner w-8 z-10 relative">
                  <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    isRed 
                      ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] border border-rose-300' 
                      : 'bg-rose-950/40 opacity-30'
                  }`}></div>
                  
                  <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    isYellow 
                      ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] border border-amber-200' 
                      : 'bg-amber-950/40 opacity-30'
                  }`}></div>
                  
                  <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                    isGreen 
                      ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] border border-emerald-300' 
                      : 'bg-emerald-950/40 opacity-30'
                  }`}></div>
                </div>
              </div>

              {/* Status Display */}
              <div className="flex-grow space-y-3 z-10 relative">
                {isEmergency ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex flex-col items-center justify-center">
                    <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-emerald-600" />
                      EMERGENCY PRIORITY
                    </div>
                    <div className="text-xl font-black font-mono text-emerald-700 tracking-wider">
                      GREEN WAVE LOCK
                    </div>
                    {node.incidentAlert && (
                      <div className="text-[10px] text-emerald-800 mt-1 text-center font-medium">
                        {node.incidentAlert}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">Current Phase</span>
                      <span className="text-[11px] font-mono font-bold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-600" />
                        00:{node.phaseTimeRemaining.toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 truncate">
                      {node.currentPhase}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-cyan-600" />
                    <span className="text-slate-500 font-medium">Queue:</span>
                    <span className="font-mono text-cyan-700 font-bold">{node.queueLength} veh</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-medium">Load:</span>
                    <span className="font-mono text-slate-800 font-bold">{node.densityScore}%</span>
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="mt-4 pt-3 border-t border-slate-100 z-10 relative">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Mode</span>
                  <div className="flex bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                    <button
                      onClick={() => onUpdateNodeSignalMode(node.id, 'autonomous_ai')}
                      className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                        node.signalMode === 'autonomous_ai' 
                          ? 'bg-white text-cyan-800 shadow-xs border border-slate-200' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      AI
                    </button>
                    <button
                      onClick={() => onUpdateNodeSignalMode(node.id, 'manual_override')}
                      className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                        node.signalMode === 'manual_override' 
                          ? 'bg-white text-amber-800 shadow-xs border border-slate-200' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      MANUAL
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
