import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmergencyUnit, IncidentItem, IntersectionNode } from '../types';
import { Bot, Cpu, Zap, Activity, CheckCircle2, ShieldCheck, MessageSquare, Terminal } from 'lucide-react';

interface AIAgentsPageProps {
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  nodes?: IntersectionNode[];
  intelligenceEvents?: any[];
}

export const AIAgentsPage: React.FC<AIAgentsPageProps> = ({ 
  emergencyUnits, 
  incidents, 
  nodes, 
  intelligenceEvents = []
}) => {
  // Derive agents purely from actual intelligence events
  const derivedAgents = useMemo(() => {
    const agentsMap = new Map<string, any>();
    
    intelligenceEvents.forEach(ev => {
      if (ev.type === 'AGENT_PROPOSAL_CREATED' || ev.type === 'AGENT_PROPOSAL_APPROVED') {
        const id = ev.data.agentId || 'node-agent-' + ev.data.intersectionId;
        if (!agentsMap.has(id)) {
          agentsMap.set(id, {
            id,
            name: `Agent ${id}`,
            status: 'active',
            type: 'Intersection Manager',
            confidence: ev.data.confidence || 0.85,
            activeProposals: 0
          });
        }
        const agent = agentsMap.get(id);
        agent.activeProposals++;
      }
    });

    return Array.from(agentsMap.values());
  }, [intelligenceEvents]);

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const selectedAgent = derivedAgents.find(a => a.id === selectedAgentId) || derivedAgents[0];

  const activeEmergencies = emergencyUnits?.filter(u => u.greenWaveActive) || [];
  const activeIncidents = incidents?.filter(i => i.status !== 'resolved') || [];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Simulated Agent Network Operations"
        subtitle="Prototype heuristic agents performing localized signal timing adjustments."
        badgeText={`${derivedAgents.length} PROTOTYPE AGENTS`}
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
            {derivedAgents.length === 0 ? (
              <div className="p-4 text-center text-slate-500 italic text-sm border border-dashed border-slate-700 rounded-xl">
                Awaiting Agent Telemetry...
              </div>
            ) : derivedAgents.map((agent) => {
              const isSelected = selectedAgent && agent.id === selectedAgent.id;
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
            {!selectedAgent ? (
              <div className="p-10 text-center text-slate-500 italic">
                Awaiting Agent Telemetry...
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-white">{selectedAgent.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30`}>
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{selectedAgent.type}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Active Proposals</span>
                    <span className="text-xl font-extrabold font-mono text-cyan-400">{selectedAgent.activeProposals || 0}</span>
                  </div>
                </div>

                {/* Performance KPIs */}
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Response Latency</span>
                    <span className="text-lg font-extrabold font-mono text-cyan-300">~15 ms</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Agent Confidence</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-300">{(selectedAgent.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block mb-1">Last Action</span>
                    <span className="text-lg font-extrabold font-mono text-indigo-300">Live</span>
                  </div>
                </div>

                {/* Real-Time Agent Stream Logs */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                    <Terminal className="w-5 h-5 text-indigo-400" />
                    Live Agent Telemetry Stream
                  </h3>
                  <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 h-[250px] overflow-y-auto font-mono text-[11px] custom-scrollbar space-y-2">
                    {intelligenceEvents.filter(e => e.data.agentId === selectedAgent.id || e.data.intersectionId === selectedAgent.id.replace('node-agent-', '')).length === 0 ? (
                      <div className="text-slate-600">Waiting for agent events...</div>
                    ) : intelligenceEvents
                        .filter(e => e.data.agentId === selectedAgent.id || e.data.intersectionId === selectedAgent.id.replace('node-agent-', ''))
                        .map((log, i) => (
                      <div key={i} className="flex gap-3">
                        <span className="text-slate-500 whitespace-nowrap">
                          [{new Date(log.timestamp || Date.now()).toLocaleTimeString([], { hour12: false })}]
                        </span>
                        <span className={`
                          ${log.type.includes('APPROVED') ? 'text-emerald-400' : ''}
                          ${log.type.includes('REJECTED') ? 'text-rose-400' : ''}
                          ${log.type.includes('CREATED') ? 'text-cyan-400' : ''}
                        `}>
                          {log.type}: {log.data.reason || JSON.stringify(log.data).substring(0,60)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
