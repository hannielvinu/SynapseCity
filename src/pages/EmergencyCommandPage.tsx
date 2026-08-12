import React from 'react';
import { EmergencyCorridorView } from '../components/EmergencyCorridorView';
import { PageHeader } from '../components/layout/PageHeader';
import { EmergencyUnit, IntersectionNode } from '../types';
import { Siren, Route, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface EmergencyCommandPageProps {
  emergencyUnits: EmergencyUnit[];
  nodes: IntersectionNode[];
  onDispatchEmergency: (newUnit: Omit<EmergencyUnit, 'id'>) => void;
  onClearEmergency: (unitId: string) => void;
  corridors?: any[];
}

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  PREPARING: { color: 'amber', icon: <Clock className="w-4 h-4" />, label: 'Preparing' },
  ACTIVE: { color: 'rose', icon: <Siren className="w-4 h-4" />, label: 'Active' },
  RESTORING: { color: 'cyan', icon: <Route className="w-4 h-4" />, label: 'Restoring' },
  COMPLETED: { color: 'emerald', icon: <CheckCircle2 className="w-4 h-4" />, label: 'Completed' },
  CANCELLED: { color: 'slate', icon: <XCircle className="w-4 h-4" />, label: 'Cancelled' },
  FAILED: { color: 'rose', icon: <AlertTriangle className="w-4 h-4" />, label: 'Failed' },
};

export const EmergencyCommandPage: React.FC<EmergencyCommandPageProps> = (props) => {
  const activeCorridors = (props.corridors || []).filter(c => 
    c.status === 'PREPARING' || c.status === 'ACTIVE' || c.status === 'RESTORING'
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Smart Emergency Corridor Command"
        subtitle="Simulated green-wave corridor dispatch with SafetyValidator-protected signal preemption."
        badgeText={`${props.emergencyUnits.length} ACTIVE DISPATCHES`}
        badgeType={props.emergencyUnits.length > 0 ? 'rose' : 'emerald'}
      />

      {/* Corridor Lifecycle Panel */}
      {(props.corridors || []).length > 0 && (
        <div className="bg-slate-900/90 rounded-2xl border border-rose-500/20 p-5 space-y-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Route className="w-4 h-4 text-rose-400" />
            <span>Emergency Corridor Lifecycle</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 font-mono">
              SIMULATED CORRIDOR
            </span>
          </h3>

          <div className="space-y-3">
            {(props.corridors || []).map((corridor: any) => {
              const cfg = statusConfig[corridor.status] || statusConfig.PREPARING;
              return (
                <div key={corridor.id} className={`p-4 rounded-xl border bg-slate-950 border-${cfg.color}-500/20`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-${cfg.color}-400`}>{cfg.icon}</span>
                      <span className="font-bold text-xs text-white">{corridor.callsign}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-${cfg.color}-500/20 text-${cfg.color}-300 border border-${cfg.color}-500/30`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-400 block">Route</span>
                      <span className="text-slate-200 font-mono">{corridor.route?.join(' → ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Affected Intersections</span>
                      <span className="text-slate-200 font-mono">{corridor.metrics?.totalIntersections || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Estimated ETA</span>
                      <span className="text-cyan-300 font-mono font-bold">{corridor.currentEtaSeconds || corridor.estimatedEtaSeconds || 0}s</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Intersections Cleared</span>
                      <span className="text-emerald-300 font-mono font-bold">{corridor.metrics?.intersectionsCleared || 0} / {corridor.metrics?.totalIntersections || 0}</span>
                    </div>
                  </div>

                  {corridor.status === 'COMPLETED' && corridor.metrics?.timeSavedSeconds > 0 && (
                    <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                      Corridor completed. Estimated time saved: {corridor.metrics.timeSavedSeconds}s
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <EmergencyCorridorView 
        emergencyUnits={props.emergencyUnits}
        nodes={props.nodes}
        onDispatchEmergency={props.onDispatchEmergency}
        onClearEmergency={props.onClearEmergency}
      />
    </div>
  );
};

