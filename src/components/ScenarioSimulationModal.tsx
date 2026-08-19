import React from 'react';
import { SimulationConfig } from '../types';
import { PRESET_SCENARIOS } from '../data/mockData';
import { Sliders, X, Sun, CloudRain, CloudFog, Snowflake } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-600" />
            <h3 className="font-extrabold text-base text-slate-900">Urban Mobility Simulation Sandbox</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Speed & Weather Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <label className="text-slate-700 font-bold block">Simulation Rate Speed</label>
            <div className="flex gap-2">
              {[1, 2, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimConfig((prev) => ({ ...prev, speedMultiplier: s }))}
                  className={`flex-1 py-2 rounded-lg font-mono font-bold text-xs transition-colors cursor-pointer ${
                    simConfig.speedMultiplier === s 
                      ? 'bg-cyan-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}x Speed
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
            <label className="text-slate-700 font-bold block">Weather Condition</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'clear', label: 'Clear', icon: <Sun className="w-3.5 h-3.5 text-amber-500" /> },
                { id: 'heavy_rain', label: 'Heavy Rain', icon: <CloudRain className="w-3.5 h-3.5 text-cyan-600" /> },
                { id: 'dense_fog', label: 'Dense Fog', icon: <CloudFog className="w-3.5 h-3.5 text-slate-500" /> },
                { id: 'snow', label: 'Snow Storm', icon: <Snowflake className="w-3.5 h-3.5 text-blue-500" /> }
              ].map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSimConfig((prev) => ({ ...prev, weather: w.id as any }))}
                  className={`flex items-center space-x-1.5 p-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    simConfig.weather === w.id
                      ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 font-bold shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
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
          <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Preset Stress-Test Scenarios</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PRESET_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => handleApplyPreset(scenario)}
                className="p-3.5 bg-slate-50 hover:bg-cyan-50/50 rounded-xl border border-slate-200 hover:border-cyan-300 cursor-pointer transition-all space-y-1.5 group shadow-2xs"
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 group-hover:text-cyan-700">
                  <span>{scenario.name.split('(')[0]}</span>
                  <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 font-mono text-[10px]">{scenario.trafficSurge > 0 ? `+${scenario.trafficSurge}%` : `${scenario.trafficSurge}%`}</span>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-medium">{scenario.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
