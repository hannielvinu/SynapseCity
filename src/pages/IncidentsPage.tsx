import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { INITIAL_INCIDENTS } from '../data/mockData';
import { IncidentItem } from '../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, Clock, MapPin, Zap, ArrowRight } from 'lucide-react';

interface IncidentsPageProps {
  incidents?: IncidentItem[];
  onResolveIncident?: (id: string) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ 
  incidents: propIncidents, 
  onResolveIncident 
}) => {
  const [localIncidents, setLocalIncidents] = useState<IncidentItem[]>(INITIAL_INCIDENTS);
  
  const incidents = propIncidents || localIncidents;

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(incidents[0]?.id || INITIAL_INCIDENTS[0].id);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || INITIAL_INCIDENTS[0];

  const handleResolve = (id: string) => {
    if (onResolveIncident) {
      onResolveIncident(id);
    } else {
      setLocalIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'resolved' } : inc));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Incident Operations Desk"
        subtitle="Simulated anomaly detection and automated signal mitigation logic."
        badgeText={`${incidents.filter(i => i.status !== 'resolved').length} UNRESOLVED INCIDENTS`}
        badgeType="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Active Incidents</span>
            </h3>
            <span className="text-[10px] text-amber-400 font-mono font-bold">{incidents.length} Logged</span>
          </div>

          <div className="space-y-2.5">
            {incidents.map((incident) => {
              const isSelected = incident.id === selectedIncident.id;
              return (
                <div
                  key={incident.id}
                  onClick={() => setSelectedIncidentId(incident.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-amber-500 shadow-md shadow-amber-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs text-white">
                    <span className="truncate max-w-[180px]">{incident.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      incident.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {incident.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {incident.location}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Incident Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Reported {selectedIncident.reportedAt}
                </span>
                <h3 className="text-lg font-extrabold text-white mt-1">{selectedIncident.title}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {selectedIncident.location}
                </p>
              </div>

              {selectedIncident.status !== 'resolved' && (
                <button
                  onClick={() => handleResolve(selectedIncident.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Mark Incident Resolved
                </button>
              )}
            </div>

            {/* AI Action Taken */}
            <div className="p-4 bg-slate-950 rounded-xl border border-cyan-500/30 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4" /> Simulated Mitigation Executed
              </h4>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{selectedIncident.aiActionTaken}</p>
            </div>

            {/* Incident Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Severity Level</span>
                <span className="text-base font-extrabold uppercase text-amber-400">{selectedIncident.severity}</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Delay Impact</span>
                <span className="text-base font-extrabold font-mono text-rose-400">+{selectedIncident.impactDelayMinutes} min</span>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-slate-400 block mb-1">Status</span>
                <span className="text-base font-extrabold uppercase text-emerald-400">{selectedIncident.status}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
