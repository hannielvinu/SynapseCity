import React, { useState } from 'react';
import { CoimbatoreOpenMap } from '../components/CoimbatoreOpenMap';
import { COIMBATORE_JUNCTIONS, COIMBATORE_HOSPITALS } from '../data/coimbatoreData';
import { CitizenReport, IntersectionNode, IncidentItem } from '../types';
import { 
  Users, 
  Send, 
  Camera, 
  MapPin, 
  AlertTriangle, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  Plus, 
  CheckCircle2, 
  ChevronRight,
  Activity
} from 'lucide-react';

interface CitizenPortalPageProps {
  nodes?: IntersectionNode[];
  citizenReports?: CitizenReport[];
  incidents?: IncidentItem[];
  onSubmitReport?: (report: any) => void;
}

export const CitizenPortalPage: React.FC<CitizenPortalPageProps> = ({
  nodes = [],
  citizenReports = [],
  incidents = [],
  onSubmitReport
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [category, setCategory] = useState<string>('Accident');
  const [locationName, setLocationName] = useState('Avinashi Road near Lakshmi Mills');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [reporterContact, setReporterContact] = useState('');
  const [photoAttached, setPhotoAttached] = useState(true);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitReport) {
      onSubmitReport({
        category,
        locationName,
        description: description || 'Vehicle breakdown causing partial lane blockage.',
        severity,
        reporterContact: reporterContact || 'Citizen (Mobile App)',
        photoEvidence: photoAttached
      });
    }

    setDescription('');
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setIsFormOpen(false);
    }, 2500);
  };

  return (
    <div className="space-y-4 font-sans">
      {/* Citizen Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-base text-slate-900">Coimbatore Citizen Mobility & Safety Portal</h2>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-mono font-bold">
                COMMUNITY PARTICIPATION
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Report road obstructions, view nearby congestion, and access emergency helplines.</p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report Road Hazard</span>
        </button>
      </div>

      {/* Main Grid: Map-First Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero Interactive Map (2 cols) */}
        <div className="lg:col-span-2 relative">
          <CoimbatoreOpenMap
            nodes={nodes}
            incidents={incidents}
            mode="citizen"
            height="560px"
          />

          {/* Floating Action Badge on map */}
          <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-200 shadow-lg flex items-center gap-2 text-xs text-slate-700 font-medium">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Live Community Feed: <strong>{citizenReports.length} Reports Logged</strong></span>
          </div>
        </div>

        {/* Right Drawer: Submit Form / My Reports / Emergency Helpline */}
        <div className="space-y-4">
          {/* Quick Submit Form Drawer */}
          {isFormOpen ? (
            <div className="bg-white rounded-2xl border border-cyan-300 p-5 space-y-4 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Report Road Hazard</span>
                </h3>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-700 font-bold"
                >
                  Cancel
                </button>
              </div>

              {submittedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Incident submitted and broadcast to Operations Center!</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hazard Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium"
                  >
                    <option value="Accident">Accident / Collision</option>
                    <option value="Heavy Traffic">Heavy Congestion Gridlock</option>
                    <option value="Road Obstruction">Road Obstruction / Fallen Tree</option>
                    <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                    <option value="Flooding / Waterlogging">Waterlogging / Monsoon Flood</option>
                    <option value="Road Damage">Pothole / Road Damage</option>
                    <option value="Signal Failure">Traffic Signal Malfunction</option>
                    <option value="Railway Crossing Delay">Railway Gate Delay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location / Intersection</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Avinashi Road near Lakshmi Mills"
                    className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:border-cyan-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['low', 'medium', 'high'] as const).map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setSeverity(s)}
                        className={`py-1.5 rounded-lg font-bold uppercase text-[10px] border transition-all cursor-pointer ${
                          severity === s 
                            ? 'bg-amber-50 text-amber-800 border-amber-300 font-extrabold shadow-2xs' 
                            : 'bg-white text-slate-600 border-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe obstruction and affected lanes..."
                    className="w-full bg-slate-50 border border-slate-300 p-2 rounded-xl text-slate-900 font-medium focus:border-cyan-600 text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="citizenPhotoCheck"
                    checked={photoAttached}
                    onChange={(e) => setPhotoAttached(e.target.checked)}
                    className="accent-cyan-600 w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="citizenPhotoCheck" className="text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
                    <Camera className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Attach Photo Evidence (Simulated)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> Submit to Triage
                </button>
              </form>
            </div>
          ) : (
            /* My Reports Feed */
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>Recent Citizen Reports</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-500 font-bold">{citizenReports.length} Logged</span>
              </div>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto custom-scrollbar">
                {citizenReports.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    <p className="text-xs font-bold text-slate-700">No Citizen Reports Yet</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Click "Report Road Hazard" above to submit the first incident.</p>
                  </div>
                ) : (
                  citizenReports.map(rep => (
                    <div key={rep.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900">{rep.category}</span>
                        <span className={`text-[9px] px-2 py-0.2 rounded font-bold uppercase ${
                          rep.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" /> {rep.locationName}
                      </p>
                      <div className="text-[10px] text-slate-500 flex justify-between pt-1">
                        <span>Report #{rep.reportNumber}</span>
                        <span>{rep.submittedAt}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Emergency Helplines Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-rose-600" />
              <span>Coimbatore Emergency Contacts</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-rose-50 rounded-xl border border-rose-200 flex justify-between items-center">
                <span className="font-bold text-rose-900">Ambulance Emergency (108)</span>
                <span className="font-mono font-extrabold text-rose-700">108</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">Police Control Room</span>
                <span className="font-mono font-bold text-slate-700">0422 230 0970</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800">CMCH Govt Hospital</span>
                <span className="font-mono font-bold text-slate-700">0422 230 1393</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
