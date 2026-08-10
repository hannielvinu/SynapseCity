import React, { useState } from 'react';
import { IntersectionNode, SignalMode } from '../types';
import { Sliders, Cpu, AlertTriangle, CheckCircle2, RotateCcw, Zap, Sparkles, Clock, Users, ArrowUpRight } from 'lucide-react';

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
  selectedNodeId,
  onSelectNode,
  onUpdateNodeSignalMode,
  onUpdatePhaseDuration,
  onTriggerAiRebalance
}) => {
  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const [phaseDurationInput, setPhaseDurationInput] = useState(activeNode.phaseTimeRemaining);

  return (
    <div className="space-y-6 font-sans">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-extrabold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Multi-Agent Traffic Signal Control Hub</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time adaptive phase optimization and manual controller override interface</p>
        </div>

        <button
          onClick={() => onTriggerAiRebalance(activeNode.id)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-cyan-950/40 border border-cyan-400/30 rounded-xl transition-all"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Optimize All Node Phase Cycles</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of All City Intersection Nodes */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">City Intersection Nodes ({nodes.length})</h3>
            <span className="text-[10px] text-cyan-400 font-mono font-bold">100% Connected</span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {nodes.map((node) => {
              const isSelected = activeNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => {
                    onSelectNode(node.id);
                    setPhaseDurationInput(node.phaseTimeRemaining);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-950/40' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        node.signalState === 'green' ? 'bg-emerald-500 shadow-sm shadow-emerald-500' :
                        node.signalState === 'yellow' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}></span>
                      <h4 className="font-bold text-xs text-white">{node.name}</h4>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono font-bold border border-slate-700">
                      {node.densityScore}% Density
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                    <span>{node.district}</span>
                    <span className="text-slate-300 font-mono font-medium">{node.vehicleCount} cars queue</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Middle & Right 2 Columns: Detailed Selected Node Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5">
            {/* Selected Node Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-white">{activeNode.name}</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    {activeNode.district}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Current Active Phase: <strong className="text-amber-300 font-mono">{activeNode.currentPhase}</strong></p>
              </div>

              {/* Mode Selector */}
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => onUpdateNodeSignalMode(activeNode.id, 'autonomous_ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    activeNode.signalMode === 'autonomous_ai'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Autonomous AI
                </button>
                <button
                  onClick={() => onUpdateNodeSignalMode(activeNode.id, 'manual_override')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                    activeNode.signalMode === 'manual_override'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Manual Override
                </button>
              </div>
            </div>

            {/* Density & Directional Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px] font-medium">North-South Corridor</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-white">{activeNode.northSouthDensity}%</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">Vehicles</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${activeNode.northSouthDensity}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px] font-medium">East-West Corridor</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-white">{activeNode.eastWestDensity}%</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono">Vehicles</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${activeNode.eastWestDensity}%` }}></div>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px] font-medium">Pedestrian Demand</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-emerald-400">{activeNode.pedestrianWaiting}</span>
                  <span className="text-[10px] text-slate-400">waiting</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1 text-[11px] font-medium">AI Agent Confidence</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-emerald-300">{activeNode.aiConfidence}%</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Interactive Phase Duration Controls */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>Green Phase Duration Tuning</span>
                </h4>
                <span className="text-xs font-mono text-amber-300 font-bold">{phaseDurationInput} seconds remaining</span>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={phaseDurationInput}
                  onChange={(e) => setPhaseDurationInput(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>10s (Fast Cycle)</span>
                  <span>45s (Standard)</span>
                  <span>90s (Heavy Throughput)</span>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onUpdatePhaseDuration(activeNode.id, phaseDurationInput)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-xs shadow-md shadow-emerald-950/40 transition-all"
                >
                  Apply Phase Duration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
