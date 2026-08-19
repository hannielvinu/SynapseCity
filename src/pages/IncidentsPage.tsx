import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { IncidentItem } from '../types';
import { AlertTriangle, MapPin, Zap, CheckCircle } from 'lucide-react';

interface IncidentsPageProps {
  incidents?: IncidentItem[];
  onResolveIncident?: (id: string) => void;
}

export const IncidentsPage: React.FC<IncidentsPageProps> = ({ 
  incidents = [], 
  onResolveIncident 
}) => {
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(incidents[0]?.id || null);

  const selectedIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0] || null;

  const handleResolve = (id: string) => {
    if (onResolveIncident) {
      onResolveIncident(id);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Incident Operations Desk"
        subtitle="Canonical incident state repository integrating citizen reports and automated network mitigation logic."
        badgeText={`${incidents.filter(i => i.status !== 'resolved').length} ACTIVE INCIDENTS`}
        badgeType="amber"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Network Incidents</span>
            </h3>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-mono font-bold">{incidents.length} Logged</span>
          </div>

          <div className="space-y-2.5">
            {incidents.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
                <p className="font-bold text-xs text-slate-700">No Active Incidents</p>
                <p className="text-[11px] mt-1 text-slate-500">The network is currently operating normally.</p>
              </div>
            ) : (
              incidents.map((incident) => {
                const isSelected = selectedIncident && incident.id === selectedIncident.id;
                return (
                  <div
                    key={incident.id}
                    onClick={() => setSelectedIncidentId(incident.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-300 shadow-xs ring-1 ring-amber-300'
                        : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs text-slate-900">
                      <span className="truncate max-w-[150px]">{incident.title}</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        incident.status === 'resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1.5 flex items-center justify-between font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {incident.location}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Incident Details */}
        <div className="lg:col-span-2 space-y-6">
          {selectedIncident ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase tracking-wider">
                      Reported {selectedIncident.reportedAt}
                    </span>
                    {selectedIncident.source && (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold uppercase rounded border border-slate-200">
                        SOURCE: {selectedIncident.source}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-2">{selectedIncident.title}</h3>
                  <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-cyan-600" /> {selectedIncident.location}
                  </p>
                </div>

                {selectedIncident.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolve(selectedIncident.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer transition-all"
                  >
                    Mark Incident Resolved
                  </button>
                )}
              </div>

              {/* AI Action Taken */}
              <div className="p-4 bg-cyan-50/60 rounded-xl border border-cyan-200 space-y-2">
                <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-600" /> Operational Mitigation Executed
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedIncident.aiActionTaken}</p>
              </div>

              {/* Incident Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Severity Level</span>
                  <span className="text-base font-extrabold uppercase text-amber-700">{selectedIncident.severity}</span>
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Estimated Delay</span>
                  <span className="text-base font-extrabold font-mono text-rose-700">+{selectedIncident.impactDelayMinutes} min</span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block mb-1 font-semibold text-[11px]">Status</span>
                  <span className="text-base font-extrabold uppercase text-emerald-700">{selectedIncident.status}</span>
                </div>
              </div>
            </div>
          ) : (
             <div className="bg-white rounded-2xl border border-slate-200 p-12 flex flex-col items-center justify-center text-center space-y-4 shadow-sm">
                <CheckCircle className="w-12 h-12 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-800">All Corridors Clear</h3>
                <p className="text-xs text-slate-500 max-w-sm font-medium">There are currently no active incidents requiring operational mitigation. Monitor the Citizen Reports tab for incoming hazards.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
