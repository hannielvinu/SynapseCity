import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { SimulationConfig } from '../types';
import { PRESET_SCENARIOS } from '../data/mockData';
import { Cpu, Play, Pause, RefreshCw, CloudRain, Sun, Flame, Wind, Sliders, CheckCircle2, Save, Activity, Settings, Database, Camera, Beaker, ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DigitalTwinPageProps {
  simulationConfig: SimulationConfig;
  onUpdateSimulationConfig: (config: Partial<SimulationConfig>) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simEngineName: string;
  timelineStage: string;
  strategy: string;
  comparison: any;
  history: any[];
  onResetSimulation: () => void;
  onSetStrategy: (strategy: 'baseline' | 'ai') => void;
  onSaveRun: () => void;
  onSetSumoEnabled: (enabled: boolean) => void;
  digitalTwinComparison?: any;
  digitalTwinStatus?: 'idle' | 'capturing' | 'running' | 'completed';
  capturedSnapshotId?: string | null;
  onCaptureSnapshot?: () => void;
  onRunDigitalTwin?: (scenarioType: string) => void;
}

export const DigitalTwinPage: React.FC<DigitalTwinPageProps> = ({
  simulationConfig,
  onUpdateSimulationConfig,
  isSimulating,
  onToggleSimulation,
  simEngineName,
  timelineStage,
  strategy,
  comparison,
  history,
  onResetSimulation,
  onSetStrategy,
  onSaveRun,
  onSetSumoEnabled,
  digitalTwinComparison,
  digitalTwinStatus = 'idle',
  capturedSnapshotId,
  onCaptureSnapshot,
  onRunDigitalTwin
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [sumoToggle, setSumoToggle] = useState<boolean>(false);

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

  const handleSumoCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.checked;
    setSumoToggle(val);
    onSetSumoEnabled(val);
  };

  const stageLabels: { [key: string]: string } = {
    start: '1. Traffic Start',
    congestion: '2. Congestion Formation',
    prediction: '3. Prediction Alert',
    intervention: '4. Agent Intervention',
    recovery: '5. Traffic Recovery'
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Digital Twin Simulation Engine"
        subtitle="Virtual urban mobility sandbox to simulate weather emergencies, traffic surges, and signal optimization models."
        badgeText={simEngineName.includes("SUMO") ? "SUMO OFFLINE (FALLBACK)" : "PROTOTYPE ENGINE ACTIVE"}
        badgeType={simEngineName.includes("SUMO") ? "amber" : "emerald"}
      />

      {/* Timeline stages progress bar */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3 shadow-xl">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>Active Simulation Stage Timeline</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
          {Object.keys(stageLabels).map((stageKey) => {
            const isActive = timelineStage === stageKey;
            return (
              <div 
                key={stageKey} 
                className={`p-3 rounded-xl border text-center transition-all ${
                  isActive 
                    ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold shadow-lg shadow-cyan-950/20' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-500'
                }`}
              >
                <div className="text-[11px] uppercase tracking-wider font-bold">{stageLabels[stageKey]}</div>
                {isActive && <div className="text-[9px] text-cyan-400 font-mono mt-1 animate-pulse">STAGE ACTIVE</div>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Presets & Config Controls */}
        <div className="space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Simulation Configurations</span>
              </h3>
              <button 
                onClick={onResetSimulation}
                className="text-[10px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-rose-500/20 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* SUMO Toggle */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Enable SUMO Simulator</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Launch TraCI pipeline (Requires local SUMO)</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={sumoToggle}
                  onChange={handleSumoCheck}
                  className="w-4 h-4 accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Strategy Selector */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white block">Optimization Strategy</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetStrategy('baseline')}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      strategy === 'baseline' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                        : 'bg-slate-900 text-slate-400 border border-transparent'
                    }`}
                  >
                    Fixed Cycle
                  </button>
                  <button
                    onClick={() => onSetStrategy('ai')}
                    className={`py-2 rounded-lg font-bold transition-all ${
                      strategy === 'ai' 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                        : 'bg-slate-900 text-slate-400 border border-transparent'
                    }`}
                  >
                    Heuristic Agent Optimization
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Presets</span>
              {PRESET_SCENARIOS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => applyPreset(preset.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-500 shadow-lg'
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
        </div>

        {/* Live Simulation Parameters & Output Comparator */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-extrabold text-white">Live Parameter Tuning & Outputs</h3>
                <p className="text-xs text-slate-400">Tweak environmental factors and compare strategy outcomes in real-time</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleSimulation}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                    isSimulating
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950'
                  }`}
                >
                  {isSimulating ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
                </button>
                
                <button
                  onClick={onSaveRun}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save Run
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <label className="font-bold text-slate-200">Weather Friction</label>
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

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Surge Traffic Load</span>
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
                  <span>Normal</span>
                  <span>+100% (Surge Gridlock)</span>
                </div>
              </div>
            </div>

            {/* Performance metrics dashboard comparison */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-4">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4" /> Live Engine Outcomes Comparison
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs font-mono">
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Avg Delay</span>
                  <span className="text-sm font-bold text-cyan-400">{comparison.avgDelaySeconds.toFixed(1)}s</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Travel Time</span>
                  <span className="text-sm font-bold text-cyan-400">{comparison.travelTimeSeconds.toFixed(0)}s</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Grid Queue</span>
                  <span className="text-sm font-bold text-rose-400">{comparison.queueLength} cars</span>
                </div>
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block font-sans">Throughput</span>
                  <span className="text-sm font-bold text-emerald-400">+{comparison.throughput} veh/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Runs Registry */}
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-3">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Simulation History Ledger</span>
            </h3>

            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-2.5 px-3">Run ID</th>
                    <th className="py-2.5 px-3">Strategy</th>
                    <th className="py-2.5 px-3">Surge</th>
                    <th className="py-2.5 px-3">Avg Delay</th>
                    <th className="py-2.5 px-3">Throughput</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-slate-300 font-mono">
                  {history.slice(0, 10).map((run) => (
                    <tr key={run.id} className="hover:bg-slate-800/10 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-200">{run.id.split('-')[1] || run.id}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          run.strategy === 'ai' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {run.strategy}
                        </span>
                      </td>
                      <td className="py-3 px-3">+{run.config.trafficSurge}%</td>
                      <td className="py-3 px-3 font-bold text-cyan-400">{run.results.avgDelaySeconds.toFixed(1)}s</td>
                      <td className="py-3 px-3 text-emerald-400">+{run.results.throughput}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">{run.timestamp}</td>
                    </tr>
                  ))}
                  {history.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-500 font-sans">
                        No previous simulation runs logged.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 4: Isolated Digital Twin Comparison */}
      <div className="bg-slate-900/90 rounded-2xl border border-indigo-500/30 p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <Beaker className="w-4 h-4 text-indigo-400" />
            Isolated Digital Twin — Snapshot Comparison
          </h3>
          <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-mono font-bold">
            SIMULATED SANDBOX
          </span>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed">
          Capture an isolated snapshot of the live simulation, then run baseline vs. coordinated strategy scenarios on the clone.
          The live simulation is never mutated by Digital Twin runs.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onCaptureSnapshot}
            disabled={digitalTwinStatus === 'running'}
            className="px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg disabled:opacity-50"
          >
            <Camera className="w-4 h-4" />
            {digitalTwinStatus === 'capturing' ? 'Capturing...' : 'Capture Snapshot'}
          </button>

          <button
            onClick={() => onRunDigitalTwin && onRunDigitalTwin('BASELINE')}
            disabled={!capturedSnapshotId || digitalTwinStatus === 'running'}
            className="px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {digitalTwinStatus === 'running' ? 'Simulating...' : 'Run Comparison'}
          </button>

          <div className={`px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border ${
            capturedSnapshotId 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            {capturedSnapshotId ? (
              <><CheckCircle2 className="w-4 h-4" /> Snapshot Ready</>
            ) : (
              'No Snapshot'
            )}
          </div>
        </div>

        {/* Comparison Results */}
        {digitalTwinComparison && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs">
              {[
                { label: 'Speed Delta', value: digitalTwinComparison.differences?.speedDelta, unit: ' km/h', positive: true },
                { label: 'Queue Delta', value: digitalTwinComparison.differences?.queueDelta, unit: ' cars', positive: false },
                { label: 'Throughput Delta', value: digitalTwinComparison.differences?.throughputDelta, unit: ' veh', positive: true },
                { label: 'Delay Delta', value: digitalTwinComparison.differences?.delayDelta, unit: 's', positive: false }
              ].map((metric, i) => {
                const val = metric.value || 0;
                const isGood = metric.positive ? val > 0 : val < 0;
                const isNeutral = Math.abs(val) < 0.5;
                return (
                  <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[9px] text-slate-400 block font-sans mb-1">{metric.label}</span>
                    <div className="flex items-center justify-center gap-1">
                      {isNeutral ? <Minus className="w-3 h-3 text-slate-500" /> : isGood ? <TrendingUp className="w-3 h-3 text-emerald-400" /> : <TrendingDown className="w-3 h-3 text-rose-400" />}
                      <span className={`text-sm font-bold font-mono ${
                        isNeutral ? 'text-slate-400' : isGood ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {val > 0 ? '+' : ''}{val.toFixed(1)}{metric.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recommendation */}
            <div className={`p-4 rounded-xl border text-xs ${
              digitalTwinComparison.recommendation === 'STRATEGY_FAVORED' 
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : digitalTwinComparison.recommendation === 'BASELINE_FAVORED'
                ? 'bg-rose-500/10 border-rose-500/30'
                : 'bg-slate-950 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  digitalTwinComparison.recommendation === 'STRATEGY_FAVORED' 
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : digitalTwinComparison.recommendation === 'BASELINE_FAVORED'
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {(digitalTwinComparison.recommendation || 'INCONCLUSIVE').replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{digitalTwinComparison.explanation || 'No explanation available.'}</p>
            </div>

            {/* Baseline vs Strategy side by side */}
            {digitalTwinComparison.baselineMetrics && digitalTwinComparison.strategyMetrics && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 rounded-xl border border-rose-500/20 text-xs space-y-2">
                  <h5 className="font-bold text-rose-300 uppercase tracking-wider text-[10px]">Baseline (Fixed Cycle)</h5>
                  <div className="font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between"><span>Avg Speed:</span><span className="text-slate-200">{digitalTwinComparison.baselineMetrics.averageSpeedKmh?.toFixed(1)} km/h</span></div>
                    <div className="flex justify-between"><span>Avg Queue:</span><span className="text-slate-200">{digitalTwinComparison.baselineMetrics.averageQueueLength?.toFixed(1)}</span></div>
                    <div className="flex justify-between"><span>Avg Delay:</span><span className="text-slate-200">{digitalTwinComparison.baselineMetrics.averageDelaySeconds?.toFixed(1)}s</span></div>
                  </div>
                </div>
                <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/20 text-xs space-y-2">
                  <h5 className="font-bold text-emerald-300 uppercase tracking-wider text-[10px]">Strategy (Heuristic Agent)</h5>
                  <div className="font-mono text-slate-400 space-y-1">
                    <div className="flex justify-between"><span>Avg Speed:</span><span className="text-slate-200">{digitalTwinComparison.strategyMetrics.averageSpeedKmh?.toFixed(1)} km/h</span></div>
                    <div className="flex justify-between"><span>Avg Queue:</span><span className="text-slate-200">{digitalTwinComparison.strategyMetrics.averageQueueLength?.toFixed(1)}</span></div>
                    <div className="flex justify-between"><span>Avg Delay:</span><span className="text-slate-200">{digitalTwinComparison.strategyMetrics.averageDelaySeconds?.toFixed(1)}s</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
