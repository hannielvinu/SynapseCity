import React from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Layers, Cpu, Radio, Eye, TrendingUp, Bot, ShieldAlert, Zap, CheckCircle2 } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const layers = [
    {
      num: 'Layer 1',
      title: 'Heterogeneous Sensor & Data Ingestion',
      icon: Radio,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      description: 'Simulates ingestion of high-frequency beacon data, pulse counters, camera feeds, GPS telemetry, and citizen emergency mobile reports.'
    },
    {
      num: 'Layer 2',
      title: 'Ultra-Low Latency Edge Messaging Broker',
      icon: Zap,
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      description: 'High-throughput event streaming engine simulating message delivery from physical intersections to local compute nodes.'
    },
    {
      num: 'Layer 3',
      title: 'Simulated Edge Perception Pipeline',
      icon: Eye,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      description: 'Simulates object detection to identify vehicle types, speed vectors, pedestrian counts, and license plates at the physical edge.'
    },
    {
      num: 'Layer 4',
      title: 'Prototype Predictive Modeling Engine',
      icon: TrendingUp,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      description: 'Prototype heuristic forecasting models predict citywide queue buildup.'
    },
    {
      num: 'Layer 5',
      title: 'Simulated Heuristic Agent Network',
      icon: Bot,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      description: 'Every intersection operates a simulated heuristic agent. Agents use localized logic to adjust green-time allocations.'
    },
    {
      num: 'Layer 6',
      title: 'Digital Twin Simulation & Stress-Test Sandbox',
      icon: Cpu,
      color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
      description: 'Simulates extreme monsoon rainfall, major stadium evacuation surges, and AV truck platoons before logging optimized signal weights.'
    },
    {
      num: 'Layer 7',
      title: 'Emergency Siren & Preemption Supervisor',
      icon: ShieldAlert,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      description: 'Overrides standard optimization with deterministic green-wave locks whenever simulated sirens or GPS emergency dispatch beacons are identified.'
    },
    {
      num: 'Layer 8',
      title: 'Target Architecture: Hardware Actuation & NEMA Controller Interfacing',
      icon: Layers,
      color: 'text-cyan-300 border-cyan-400/30 bg-cyan-400/10',
      description: 'Planned integration to translate high-level phase commands into physical signal phase changes on NEMA TS2, ATC, and 2070 hardware.'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="SynapseCity Prototype System Architecture Specification"
        subtitle="Prototype 8-layer urban mobility stack simulating edge sensors and localized signal actuation."
        badgeText="8-LAYER STACK"
        badgeType="cyan"
      />

      <div className="space-y-4">
        {layers.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={idx} className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl border ${layer.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">{layer.num}</span>
                    <h3 className="text-base font-extrabold text-white">{layer.title}</h3>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-14 font-normal">{layer.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
