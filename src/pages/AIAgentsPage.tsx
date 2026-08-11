import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { INITIAL_AGENTS, INITIAL_AGENT_LOGS } from '../data/mockData';
import { EmergencyUnit, IncidentItem, IntersectionNode } from '../types';
import { Bot, Cpu, Zap, Activity, CheckCircle2, ShieldCheck, MessageSquare, Terminal } from 'lucide-react';

interface AIAgentsPageProps {
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  nodes?: IntersectionNode[];
  agents?: any[];
  agentLogs?: any[];
}

export const AIAgentsPage: React.FC<AIAgentsPageProps> = ({ 
  emergencyUnits, 
  incidents, 
  nodes, 
  agents = INITIAL_AGENTS, 
  agentLogs = INITIAL_AGENT_LOGS 
}) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || INITIAL_AGENTS[0].id);

  const selectedAgent = (agents.find(a => a.id === selectedAgentId) || agents[0] || INITIAL_AGENTS[0]) as any;

  const activeEmergencies = emergencyUnits?.filter(u => u.greenWaveActive) || [];
  const activeIncidents = incidents?.filter(i => i.status !== 'resolved') || [];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Simulated Agent Network Operations"
        subtitle="Prototype heuristic agents performing localized signal timing adjustments."
        badgeText={`${agents.length} PROTOTYPE AGENTS`}
        badgeType="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Roster */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Simulated Agent Roster</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">PROTOTYPE</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar">
            {agents.map((agent) => {
              const isSelected = agent.id === selectedAgent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{agent.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono">
                      {agent.latencyMs}ms
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{agent.roleDescription}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-extrabold text-white">{selectedAgent.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    selectedAgent.status === 'warning' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                    selectedAgent.status === 'optimizing' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {selectedAgent.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{selectedAgent.roleDescription}</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Decisions Today</span>
                <span className="text-xl font-extrabold font-mono text-cyan-400">{selectedAgent.decisionsMadeToday.toLocaleString()}</span>
              </div>
            </div>

            {/* Performance KPIs */}
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Response Latency</span>
                <span className="text-lg font-extrabold font-mono text-cyan-300">{selectedAgent.latencyMs} ms</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Simulated Confidence</span>
                <span className="text-lg font-extrabold font-mono text-emerald-300">{selectedAgent.accuracyRate ? selectedAgent.accuracyRate.toFixed(1) : 98}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Last Action</span>
                <span className="text-lg font-extrabold font-mono text-indigo-300">{selectedAgent.lastDecisionTime}</span>
              </div>
            </div>

            {/* Agent Inputs & Outputs Inspector (AI Explainability) */}
            {selectedAgent.inputs && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2 text-[10px]">Active Inputs Analyzed</h4>
                  <div className="space-y-1.5 font-mono text-slate-400">
                    <div className="flex justify-between"><span>Density Score:</span><span className="text-cyan-400">{selectedAgent.inputs.density}%</span></div>
                    <div className="flex justify-between"><span>Queue Length:</span><span className="text-amber-400">{selectedAgent.inputs.queueLength} cars</span></div>
                    <div className="flex justify-between"><span>Current Phase:</span><span className="text-slate-300 truncate max-w-[150px]">{selectedAgent.inputs.currentPhase}</span></div>
                    <div className="flex justify-between"><span>Emergency Preemption:</span><span className={selectedAgent.inputs.emergencyActive ? "text-rose-400 font-bold" : "text-slate-500"}>{selectedAgent.inputs.emergencyActive ? "ACTIVE" : "FALSE"}</span></div>
                  </div>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/20 text-xs">
                  <h4 className="font-bold text-cyan-300 uppercase tracking-wider mb-2 text-[10px]">Action Recommendation Output</h4>
                  {selectedAgent.outputs && (
                    <div className="space-y-2">
                      <div className="text-slate-200"><span className="text-slate-400 font-mono">Decision:</span> <strong className="text-emerald-400">{selectedAgent.outputs.recommendedPhase}</strong></div>
                      <div className="text-slate-200"><span className="text-slate-400 font-mono">Timing:</span> <strong className="text-cyan-400">{selectedAgent.outputs.duration} seconds</strong></div>
                      <div className="text-[11px] text-slate-400 italic">"{selectedAgent.outputs.reason}"</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Real-Time Agent Stream Logs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" /> Event Bus Log Stream
                </span>
                <span className="text-[10px] text-cyan-400 font-mono animate-pulse">STREAMING LIVE</span>
              </h4>

              <div className="space-y-2 text-xs font-mono max-h-[300px] overflow-y-auto custom-scrollbar">
                {agentLogs.map((log) => (
                  <div key={log.id} className={`p-2.5 rounded-lg border space-y-1 ${
                    log.type === 'warning' ? 'bg-amber-950/20 border-amber-500/20' :
                    log.type === 'action' ? 'bg-cyan-950/20 border-cyan-500/20' :
                    'bg-slate-900 border-slate-800/80'
                  }`}>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`font-bold ${
                        log.type === 'warning' ? 'text-amber-400' :
                        log.type === 'action' ? 'text-cyan-400' :
                        'text-slate-400'
                      }`}>{log.agentName}</span>
                      <span className="text-slate-500">{log.timestamp}</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{log.message}</p>
                    <div className="text-[10px] text-emerald-400 font-bold">
                      Confidence: {(log.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
