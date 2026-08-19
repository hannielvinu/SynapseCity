import React, { useState, useMemo } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { EmergencyUnit, IncidentItem, IntersectionNode } from '../types';
import { Bot, Terminal } from 'lucide-react';

interface AIAgentsPageProps {
  emergencyUnits?: EmergencyUnit[];
  incidents?: IncidentItem[];
  nodes?: IntersectionNode[];
  intelligenceEvents?: any[];
}

export const AIAgentsPage: React.FC<AIAgentsPageProps> = ({ 
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
            name: `Edge Agent (${id})`,
            status: 'active',
            type: 'Intersection Manager',
            activeProposals: 0
          });
        }
        const agent = agentsMap.get(id);
        agent.activeProposals++;
      }
    });

    if (agentsMap.size === 0) {
      // Default initial agents from canonical node roster
      return [
        { id: 'agent-coord', name: 'City Coordinator Agent', status: 'active', type: 'Mesh Orchestrator', activeProposals: 12 },
        { id: 'agent-node-1', name: 'Gandhipuram Edge Agent', status: 'active', type: 'Phase Split Optimizer', activeProposals: 5 },
        { id: 'agent-node-2', name: 'Lakshmi Mills Agent', status: 'active', type: 'Arterial Flow Controller', activeProposals: 8 },
        { id: 'agent-node-5', name: 'Singanallur Corridor Agent', status: 'active', type: 'Emergency Preemption', activeProposals: 3 },
      ];
    }

    return Array.from(agentsMap.values());
  }, [intelligenceEvents]);

  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const selectedAgent = derivedAgents.find(a => a.id === selectedAgentId) || derivedAgents[0];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Simulated Agent Network Operations"
        subtitle="Prototype heuristic agents performing localized signal timing adjustments and peer negotiation."
        badgeText={`${derivedAgents.length} PROTOTYPE AGENTS`}
        badgeType="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Roster */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-600" />
              <span>Simulated Agent Roster</span>
            </h3>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold">ACTIVE</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto custom-scrollbar">
            {derivedAgents.map((agent) => {
              const isSelected = selectedAgent && agent.id === selectedAgent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-50 border-cyan-400 shadow-xs ring-1 ring-cyan-400'
                      : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{agent.name}</span>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-cyan-50 text-cyan-800 border border-cyan-200 font-mono font-bold">
                      {agent.activeProposals || 0} calls
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 font-medium">{agent.type}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Agent Inspector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
            {selectedAgent && (
              <>
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-extrabold text-slate-900">{selectedAgent.name}</h3>
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {selectedAgent.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-medium">{selectedAgent.type}</p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-500 block font-medium">Decisions Logged</span>
                    <span className="text-xl font-extrabold font-mono text-cyan-700">{selectedAgent.activeProposals || 0}</span>
                  </div>
                </div>

                {/* Performance KPIs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Evaluation Latency</span>
                    <span className="text-xl font-extrabold font-mono text-cyan-700">~12 ms</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Execution State</span>
                    <span className="text-xl font-extrabold font-mono text-emerald-700">Synchronized</span>
                  </div>
                </div>

                {/* Real-Time Agent Stream Logs */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-slate-900 font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    <span>Live Agent Telemetry Stream</span>
                  </h3>
                  
                  <div className="bg-slate-900 text-slate-200 rounded-xl p-4 h-[250px] overflow-y-auto font-mono text-xs custom-scrollbar space-y-2 border border-slate-800 shadow-inner">
                    {intelligenceEvents.length === 0 ? (
                      <div className="text-slate-400 italic">Agent telemetry pipeline listening on WebSocket channel...</div>
                    ) : intelligenceEvents.map((log, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <span className="text-slate-500 text-[10px] shrink-0 font-semibold">
                          [{new Date(log.timestamp || Date.now()).toLocaleTimeString([], { hour12: false })}]
                        </span>
                        <span className={`
                          ${log.type?.includes('APPROVED') ? 'text-emerald-400 font-semibold' : ''}
                          ${log.type?.includes('REJECTED') ? 'text-rose-400 font-semibold' : ''}
                          ${log.type?.includes('CREATED') ? 'text-cyan-300' : 'text-slate-300'}
                        `}>
                          {log.type}: {log.data?.reason || JSON.stringify(log.data || {}).substring(0, 70)}
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
