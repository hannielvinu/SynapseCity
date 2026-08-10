import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { INITIAL_AGENTS, INITIAL_AGENT_LOGS } from '../data/mockData';
import { EmergencyUnit, IncidentItem, IntersectionNode } from '../types';
import { Bot, Cpu, Zap, Activity, CheckCircle2, ShieldCheck, MessageSquare, Terminal } from 'lucide-react';

interface AIAgentsPageProps {
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  nodes?: IntersectionNode[];
}

export const AIAgentsPage: React.FC<AIAgentsPageProps> = ({ emergencyUnits, incidents, nodes }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>(INITIAL_AGENTS[0].id);

  const selectedAgent = INITIAL_AGENTS.find(a => a.id === selectedAgentId) || INITIAL_AGENTS[0];

  const activeEmergencies = emergencyUnits?.filter(u => u.greenWaveActive) || [];
  const activeIncidents = incidents?.filter(i => i.status !== 'resolved') || [];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Multi-Agent AI Mesh Operations"
        subtitle="Distributed reinforcement learning agents performing cooperative game-theoretic signal negotiation and global grid equilibrium."
        badgeText="142 ACTIVE AGENTS"
        badgeType="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Roster */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <span>Active Agent Roster</span>
            </h3>
            <span className="text-[10px] text-emerald-400 font-mono font-bold">100% ONLINE</span>
          </div>

          <div className="space-y-2.5">
            {INITIAL_AGENTS.map((agent) => {
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
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
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
                <span className="text-slate-400 block mb-1">Decision Accuracy</span>
                <span className="text-lg font-extrabold font-mono text-emerald-300">{selectedAgent.accuracyRate}%</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Last Action</span>
                <span className="text-lg font-extrabold font-mono text-indigo-300">{selectedAgent.lastDecisionTime}</span>
              </div>
            </div>

            {/* Real-Time Agent Stream Logs */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" /> Agent Decision Log Stream
                </span>
                <span className="text-[10px] text-cyan-400 font-mono animate-pulse">STREAMING LIVE</span>
              </h4>

              <div className="space-y-2 text-xs font-mono">
                {/* Dynamic logs based on live state */}
                {activeEmergencies.map(unit => (
                  <div key={`dynamic-em-${unit.id}`} className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/40 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-rose-400 font-bold">Corridor-Green Sentinel</span>
                      <span className="text-slate-400">Live Active</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">
                      Priority Lock Active: Holding green wave for {unit.callsign} ({unit.origin} → {unit.destination}). ETA: {unit.etaSeconds}s.
                    </p>
                    <div className="text-[10px] text-emerald-400 font-bold">Confidence: 100%</div>
                  </div>
                ))}

                {activeIncidents.map(inc => (
                  <div key={`dynamic-inc-${inc.id}`} className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/40 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-amber-400 font-bold">Incident Response AI</span>
                      <span className="text-slate-400">Active Alert</span>
                    </div>
                    <p className="text-slate-200 text-[11px]">
                      {inc.title} @ {inc.location}: {inc.aiActionTaken}
                    </p>
                    <div className="text-[10px] text-amber-300 font-bold">Status: {inc.status}</div>
                  </div>
                ))}

                {INITIAL_AGENT_LOGS.map((log) => (
                  <div key={log.id} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-cyan-400 font-bold">{log.agentName}</span>
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
