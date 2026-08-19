import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Layers, Cpu, Radio, Eye, TrendingUp, Bot, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const layers = [
    {
      num: 'Layer 1',
      title: 'Heterogeneous Sensor & Data Ingestion',
      icon: Radio,
      color: 'text-cyan-700 border-cyan-200 bg-cyan-50',
      description: 'Simulates ingestion of high-frequency beacon data, pulse counters, camera feeds, GPS telemetry, and citizen emergency mobile reports.'
    },
    {
      num: 'Layer 2',
      title: 'Ultra-Low Latency Edge Messaging Broker',
      icon: Zap,
      color: 'text-blue-700 border-blue-200 bg-blue-50',
      description: 'High-throughput event streaming engine simulating message delivery from physical intersections to local compute nodes.'
    },
    {
      num: 'Layer 3',
      title: 'Simulated Edge Perception Pipeline',
      icon: Eye,
      color: 'text-purple-700 border-purple-200 bg-purple-50',
      description: 'Simulates object detection to identify vehicle types, speed vectors, pedestrian counts, and license plates at the physical edge.'
    },
    {
      num: 'Layer 4',
      title: 'Prototype Predictive Modeling Engine',
      icon: TrendingUp,
      color: 'text-amber-700 border-amber-200 bg-amber-50',
      description: 'Prototype heuristic forecasting models predict citywide queue buildup at 15/30/60 min horizons using rule-based congestion analysis.'
    },
    {
      num: 'Layer 5',
      title: 'Simulated Heuristic Agent Network',
      icon: Bot,
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50',
      description: 'Every intersection operates a simulated heuristic agent. Agents use localized logic to adjust green-time allocations.'
    },
    {
      num: 'Layer 6',
      title: 'Digital Twin Simulation & Stress-Test Sandbox',
      icon: Cpu,
      color: 'text-indigo-700 border-indigo-200 bg-indigo-50',
      description: 'Isolated snapshot comparison engine. Captures live state, runs baseline vs strategy scenarios on cloned data, and derives measured performance recommendations.'
    },
    {
      num: 'Layer 7',
      title: 'Emergency Siren & Preemption Supervisor',
      icon: ShieldAlert,
      color: 'text-rose-700 border-rose-200 bg-rose-50',
      description: 'Lifecycle-managed emergency corridors with SafetyValidator-protected signal preemption. Routes through PREPARING → ACTIVE → RESTORING → COMPLETED states.'
    },
    {
      num: 'Layer 8',
      title: 'Target Architecture: Hardware Actuation & NEMA Controller Interfacing',
      icon: Layers,
      color: 'text-teal-700 border-teal-200 bg-teal-50',
      description: 'Planned integration to translate high-level phase commands into physical signal phase changes on NEMA TS2, ATC, and 2070 hardware.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="SynapseCity System Architecture Specification"
        subtitle="8-layer modular urban mobility stack simulating edge sensors, heuristic multi-agent coordination, and localized signal actuation."
        badgeText="8-LAYER STACK"
        badgeType="cyan"
      />

      <div className="space-y-4">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl border ${layer.color} shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">{layer.num}</span>
                    <h3 className="text-base font-extrabold text-slate-900">{layer.title}</h3>
                  </div>
                </div>
                <CheckCircle2 className={`w-5 h-5 ${idx === 7 ? 'text-amber-500' : 'text-emerald-500'}`} />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-14 font-medium">{layer.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
