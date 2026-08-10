import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SimulationConfig } from '../types';
import { PRESET_SCENARIOS } from '../data/mockData';
import { Cpu, Play, Pause, RefreshCw, CloudRain, Sun, Flame, Wind, Sliders, CheckCircle2 } from 'lucide-react';

interface DigitalTwinPageProps {
  simulationConfig: SimulationConfig;
  onUpdateSimulationConfig: (config: Partial<SimulationConfig>) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  simulationConfig,
  onUpdateSimulationConfig,
  isSimulating,
  onToggleSimulation
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const applyPreset = (presetId: string) => {
    const scenario = PRESET_SCENARIOS.find(s => s.id === presetId);
    if (scenario) {
      setSelectedPreset(presetId);
      onUpdateSimulationConfig({
        weather: scenario.weather as any,
        trafficSurge: scenario.trafficSurge
      });
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Digital Twin Simulation Engine"
        subtitle="Virtual urban mobility sandbox to simulate weather emergencies, stadium crowd exits, and heavy freight platoons before live edge deployment."
        badgeText={isSimulating ? "SIMULATION ACTIVE (2.5x)" : "STANDBY MODE"}
        badgeType={isSimulating ? "cyan" : "amber"}
      />

      {/* Main Controls & Scenario Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Presets */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Preset Urban Scenarios</span>
            </h3>
            <span className="text-[10px] text-cyan-400 font-mono">4 Presets</span>
          </div>

          <div className="space-y-2.5">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-lg shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-slate-100">
                    <span>{preset.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">{preset.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulation Parameters */}
        <div className="lg:col-span-2 bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-extrabold text-white">Simulation Parameter Tuning</h3>
              <p className="text-xs text-slate-400">Inject dynamic environmental friction and traffic surge vectors</p>
            </div>

            <button
              onClick={onToggleSimulation}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                isSimulating
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
              }`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-4 h-4" /> Pause Twin Simulation
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Start Twin Simulation
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Weather Slider */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <label className="font-bold text-slate-200 flex items-center justify-between">
                <span>Weather & Atmospheric Condition</span>
                <CloudRain className="w-4 h-4 text-cyan-400" />
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['clear', 'heavy_rain', 'dense_fog', 'snow'] as const).map((w) => (
                  <button
                    key={w}
                    onClick={() => onUpdateSimulationConfig({ weather: w })}
                    className={`p-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-all ${
                      simulationConfig.weather === w
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {w.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Traffic Surge Slider */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Traffic Volume Surge</span>
                <span className="font-mono text-cyan-400">{simulationConfig.trafficSurge > 0 ? `+${simulationConfig.trafficSurge}%` : `${simulationConfig.trafficSurge}%`}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="100"
                value={simulationConfig.trafficSurge}
                onChange={(e) => onUpdateSimulationConfig({ trafficSurge: Number(e.target.value) })}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>-50% (Off-Peak)</span>
                <span>0% (Normal)</span>
                <span>+100% (Gridlock Surge)</span>
              </div>
            </div>
          </div>

          {/* Strategy Comparison Summary */}
          <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-3">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4" /> Strategy Performance Delta
            </h4>
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Unmanaged Delay</span>
                <span className="text-sm font-bold font-mono text-rose-400">14.2 min/km</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">AI Agent Managed</span>
                <span className="text-sm font-bold font-mono text-emerald-400">4.8 min/km</span>
              </div>
              <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Efficiency Lift</span>
                <span className="text-sm font-bold font-mono text-cyan-400">+66.2%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
