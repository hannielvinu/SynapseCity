import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CoimbatoreOpenMap } from '../components/CoimbatoreOpenMap';
import { COIMBATORE_JUNCTIONS } from '../data/coimbatoreData';
import { IntersectionNode } from '../types';
import { Radio, AlertTriangle, ShieldCheck, Zap, Activity, Clock } from 'lucide-react';

interface TrafficSignalsPageProps {
  nodes?: IntersectionNode[];
}

export const TrafficSignalsPage: React.FC<TrafficSignalsPageProps> = ({ nodes = [] }) => {
  const [activeSignalId, setActiveSignalId] = useState<string>('node-1');
  const [simulatedPreemptionNodeId, setSimulatedPreemptionNodeId] = useState<string | null>(null);

  const handleTestPreemption = (nodeId: string) => {
    setSimulatedPreemptionNodeId(nodeId);
    setTimeout(() => {
      setSimulatedPreemptionNodeId(null);
    }, 12000);
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Live Traffic Signal Operations & Emergency Preemption"
        subtitle="Operational network of 11 synchronized Coimbatore traffic signals with safe green-wave emergency corridor preemption."
        badgeText={`${nodes.length || 11} SIGNALS ONLINE`}
        badgeType="emerald"
      />

      {/* Hero OpenStreetMap Signal Network Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-600" />
            <span>Coimbatore Signal Topology Map</span>
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Click any signal marker to inspect timing</span>
        </div>

        <CoimbatoreOpenMap
          nodes={nodes}
          selectedNodeId={activeSignalId}
          onSelectNode={(id) => setActiveSignalId(id)}
          mode="signals"
          height="420px"
        />
      </div>

      {/* Grid of Authentic Traffic Lights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-600" />
            <span>Active Intersection Signals Ledger</span>
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
            Simulated Actuation
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COIMBATORE_JUNCTIONS.map((junction) => {
            const liveNode = nodes.find(n => n.id === junction.id);
            const isTestPreempted = simulatedPreemptionNodeId === junction.id;
            const signalState = isTestPreempted ? 'green' : (liveNode?.signalState || 'green');
            const phaseTime = isTestPreempted ? 28 : (liveNode?.phaseTimeRemaining || 18);
            const isEmergency = isTestPreempted || liveNode?.signalMode === 'emergency_corridor' || liveNode?.signalState === 'emergency_override';
            const density = liveNode?.densityScore || 35;
            const isSelected = activeSignalId === junction.id;

            return (
              <div 
                key={junction.id}
                onClick={() => setActiveSignalId(junction.id)}
                className={`bg-white rounded-2xl border p-5 space-y-4 shadow-sm transition-all cursor-pointer ${
                  isSelected ? 'border-cyan-400 ring-2 ring-cyan-100' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{junction.name}</h4>
                    <p className="text-[11px] text-slate-500 font-medium">{junction.road}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isEmergency 
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 animate-pulse'
                      : signalState === 'green' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {isEmergency ? 'AMBULANCE PRIORITY' : signalState}
                  </span>
                </div>

                {/* Traffic Light Visual Object & Details */}
                <div className="flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {/* Traffic Light Housing */}
                  <div className="w-11 bg-slate-900 rounded-xl p-2 flex flex-col items-center gap-2 shadow-inner border border-slate-800 shrink-0">
                    <div className={`w-5 h-5 rounded-full transition-all ${
                      signalState === 'red' && !isEmergency
                        ? 'bg-rose-500 shadow-md shadow-rose-500/80' 
                        : 'bg-rose-950/40 border border-rose-900/50'
                    }`} />
                    <div className={`w-5 h-5 rounded-full transition-all ${
                      signalState === 'yellow' && !isEmergency
                        ? 'bg-amber-400 shadow-md shadow-amber-400/80' 
                        : 'bg-amber-950/40 border border-amber-900/50'
                    }`} />
                    <div className={`w-5 h-5 rounded-full transition-all ${
                      signalState === 'green' || isEmergency
                        ? 'bg-emerald-400 shadow-md shadow-emerald-400/80' 
                        : 'bg-emerald-950/40 border border-emerald-900/50'
                    }`} />
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phase Countdown:</span>
                      <strong className="font-mono text-cyan-700 text-sm">{phaseTime}s</strong>
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Current Phase: <strong className="text-slate-800">{liveNode?.currentPhase || 'Protected Arterial Flow'}</strong>
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Density: <strong>{density}%</strong> • Queue: <strong>{liveNode?.queueLength || 8} veh</strong>
                    </div>
                  </div>
                </div>

                {/* Bottom Trigger Action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[10px] text-slate-400 font-medium">Mode: Adaptive AI</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTestPreemption(junction.id);
                    }}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-800 text-slate-700 font-bold rounded-lg text-[10px] transition-all border border-slate-200 cursor-pointer"
                  >
                    Test Green Wave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
