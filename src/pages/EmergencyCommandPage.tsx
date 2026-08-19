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

const statusConfig: Record<string, { badgeClass: string; icon: React.ReactNode; label: string }> = {
  PREPARING: { badgeClass: 'bg-amber-50 text-amber-800 border-amber-200', icon: <Clock className="w-4 h-4 text-amber-600" />, label: 'Preparing' },
  ACTIVE: { badgeClass: 'bg-rose-50 text-rose-800 border-rose-200', icon: <Siren className="w-4 h-4 text-rose-600" />, label: 'Active' },
  RESTORING: { badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200', icon: <Route className="w-4 h-4 text-cyan-600" />, label: 'Restoring' },
  COMPLETED: { badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />, label: 'Completed' },
  CANCELLED: { badgeClass: 'bg-slate-100 text-slate-700 border-slate-200', icon: <XCircle className="w-4 h-4 text-slate-500" />, label: 'Cancelled' },
  FAILED: { badgeClass: 'bg-rose-50 text-rose-800 border-rose-200', icon: <AlertTriangle className="w-4 h-4 text-rose-600" />, label: 'Failed' },
};

export const EmergencyCommandPage: React.FC<EmergencyCommandPageProps> = (props) => {
  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Smart Emergency Corridor Command"
        subtitle="Simulated green-wave corridor dispatch with SafetyValidator-protected signal preemption."
        badgeText={`${props.emergencyUnits.length} ACTIVE DISPATCHES`}
        badgeType={props.emergencyUnits.length > 0 ? 'rose' : 'emerald'}
      />

      {/* Corridor Lifecycle Panel */}
      {(props.corridors || []).length > 0 && (
        <div className="bg-white rounded-2xl border border-rose-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-rose-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Route className="w-4 h-4 text-rose-600" />
              <span>Emergency Corridor Lifecycle</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono font-bold">
              SIMULATED CORRIDOR
            </span>
          </div>

          <div className="space-y-3">
            {(props.corridors || []).map((corridor: any) => {
              const cfg = statusConfig[corridor.status] || statusConfig.PREPARING;
              return (
                <div key={corridor.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {cfg.icon}
                      <span className="font-bold text-sm text-slate-900">{corridor.callsign}</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase border ${cfg.badgeClass}`}>
                      {cfg.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-medium">Route</span>
                      <span className="text-slate-900 font-mono font-semibold">{corridor.route?.join(' → ') || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-medium">Intersections</span>
                      <span className="text-slate-900 font-mono font-semibold">{corridor.metrics?.totalIntersections || 0}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-medium">Estimated ETA</span>
                      <span className="text-cyan-800 font-mono font-bold">{corridor.currentEtaSeconds || corridor.estimatedEtaSeconds || 0}s</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] font-medium">Intersections Cleared</span>
                      <span className="text-emerald-700 font-mono font-bold">{corridor.metrics?.intersectionsCleared || 0} / {corridor.metrics?.totalIntersections || 0}</span>
                    </div>
                  </div>
                  
                  {corridor.routingFactors && (
                    <div className="mt-3 p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                      <div className="text-slate-600 font-bold mb-1 border-b border-slate-100 pb-1 text-[11px]">Corridor Scoring Factors</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between"><span className="text-slate-500">Base Travel Time:</span> <span className="text-slate-800 font-mono">{Math.floor(corridor.routingFactors.baseTravelTime)}s</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Traffic Penalty:</span> <span className="text-amber-700 font-mono font-bold">+{Math.floor(corridor.routingFactors.congestionPenalty)}s</span></div>
                        <div className="flex justify-between"><span className="text-slate-500">Incident Penalty:</span> 
                          <span className={corridor.routingFactors.incidentPenalty > 0 ? "text-rose-700 font-mono font-bold" : "text-emerald-700 font-mono"}>
                            {corridor.routingFactors.incidentPenalty > 0 ? `+${corridor.routingFactors.incidentPenalty}s` : 'NONE'}
                          </span>
                        </div>
                        <div className="flex justify-between"><span className="text-slate-500">Weather Penalty:</span> 
                          <span className={corridor.routingFactors.weatherPenalty > 0 ? "text-amber-700 font-mono font-bold" : "text-slate-500 font-mono"}>
                            {corridor.routingFactors.weatherPenalty > 0 ? `+${corridor.routingFactors.weatherPenalty}s` : 'UNAVAILABLE'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {corridor.status === 'COMPLETED' && corridor.metrics?.timeSavedSeconds > 0 && (
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 font-semibold">
                      Corridor completed. MEASURED IN DIGITAL TWIN: {corridor.metrics.timeSavedSeconds}s saved.
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
