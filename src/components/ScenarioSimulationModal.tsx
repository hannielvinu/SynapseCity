import React from 'react';
import { SimulationConfig } from '../types';
import { PRESET_SCENARIOS } from '../data/mockData';
import { Sliders, X, Sun, CloudRain, CloudFog, Snowflake, Zap, AlertTriangle } from 'lucide-react';

interface ScenarioSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simConfig: SimulationConfig;
  setSimConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

export const ScenarioSimulationModal: React.FC<ScenarioSimulationModalProps> = ({
  isOpen,
  onClose,
  simConfig,
  setSimConfig
}) => {
  if (!isOpen) return null;

  const handleApplyPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setSimConfig((prev) => ({
      ...prev,
      weather: preset.weather as any,
      trafficSurge: preset.trafficSurge
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-slate-100">Urban Mobility Simulation Sandbox</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed & Weather Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="text-slate-300 font-bold block">Simulation Time Speed</label>
            <div className="flex gap-2">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimConfig((prev) => ({ ...prev, speedMultiplier: s }))}
                  className={`flex-1 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                    simConfig.speedMultiplier === s 
                      ? 'bg-cyan-600 text-white' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {s}x Speed
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <label className="text-slate-300 font-bold block">Weather Condition</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'clear', label: 'Clear', icon: <Sun className="w-3.5 h-3.5 text-amber-400" /> },
                { id: 'heavy_rain', label: 'Heavy Rain', icon: <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> },
                { id: 'dense_fog', label: 'Dense Fog', icon: <CloudFog className="w-3.5 h-3.5 text-slate-400" /> },
                { id: 'snow', label: 'Blizzard', icon: <Snowflake className="w-3.5 h-3.5 text-blue-300" /> }
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSimConfig((prev) => ({ ...prev, weather: w.id as any }))}
                  className={`flex items-center space-x-1.5 p-1.5 rounded-lg text-[11px] font-medium transition-colors ${
                    simConfig.weather === w.id
                      ? 'bg-slate-800 text-white border border-cyan-500/50'
                      : 'text-slate-400 hover:bg-slate-900'
                  }`}
                >
                  {w.icon}
                  <span>{w.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preset Scenarios */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Preset City Stress-Test Scenarios</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => handleApplyPreset(scenario)}
                className="p-3 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-200 group-hover:text-cyan-300">
                  <span>{scenario.name.split('(')[0]}</span>
                  <span className="text-amber-400 font-mono text-[10px]">{scenario.trafficSurge > 0 ? `+${scenario.trafficSurge}%` : `${scenario.trafficSurge}%`}</span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
