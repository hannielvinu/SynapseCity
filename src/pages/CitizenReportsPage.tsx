import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { CitizenReport } from '../types';
import { Users, Send, CheckCircle2, ShieldCheck, MapPin, Camera, AlertCircle } from 'lucide-react';

interface CitizenReportsPageProps {
  citizenReports: CitizenReport[];
  onSubmitReport: (report: Partial<CitizenReport>) => void;
  onVerifyReport: (reportId: string) => void;
}

export const CitizenReportsPage: React.FC<CitizenReportsPageProps> = ({
  citizenReports,
  onSubmitReport,
  onVerifyReport
}) => {
  const [category, setCategory] = useState<CitizenReport['category']>('Accident');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [photoEvidence, setPhotoEvidence] = useState(false);
  const [severity, setSeverity] = useState<CitizenReport['severity']>('medium');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport({
      category,
      locationName: locationName || 'Unknown Location',
      description: description || 'No description provided.',
      photoEvidence,
      severity,
      reporterContact: reporterContact || 'Anonymous'
    });

    setLocationName('');
    setDescription('');
    setPhotoEvidence(false);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Citizen Reports & Hazard Triage"
        subtitle="Crowdsourced citizen reporting tool. Reports marked VERIFIED are fed into the canonical operations network."
        badgeText="OPERATIONAL"
        badgeType="emerald"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Report Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-600" />
              <span>Submit Hazard Report</span>
            </h3>
          </div>

          {submittedMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Report submitted for operator triage!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Reporter Contact (Optional)</label>
              <input
                type="text"
                placeholder="e.g., Alex Mercer or 99999XXXXX"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Hazard Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium"
              >
                <option value="Accident">Accident</option>
                <option value="Heavy Traffic">Heavy Traffic</option>
                <option value="Road Obstruction">Road Obstruction</option>
                <option value="Vehicle Breakdown">Vehicle Breakdown</option>
                <option value="Protest / Gathering">Protest / Gathering</option>
                <option value="Flooding / Waterlogging">Flooding / Waterlogging</option>
                <option value="Road Damage">Road Damage</option>
                <option value="Signal Failure">Signal Failure</option>
                <option value="Railway Crossing Delay">Railway Crossing Delay</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Location / Intersection</label>
              <input
                type="text"
                placeholder="e.g., Avinashi Road near Lakshmi Mills"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Severity</label>
              <select
                value={severity}
                onChange={(e: any) => setSeverity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium"
              >
                <option value="low">Low - Minor Inconvenience</option>
                <option value="medium">Medium - Partial Lane Blockage</option>
                <option value="high">High - Major Disruption</option>
                <option value="critical">Critical - Total Blockage / Emergency</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Provide details about the hazard..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 p-2.5 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="photoCheck" 
                checked={photoEvidence} 
                onChange={(e) => setPhotoEvidence(e.target.checked)} 
                className="rounded border-slate-300 bg-slate-50 text-cyan-600 focus:ring-cyan-500/20 cursor-pointer"
              />
              <label htmlFor="photoCheck" className="text-slate-700 font-medium flex items-center gap-1.5 cursor-pointer">
                <Camera className="w-3.5 h-3.5 text-cyan-600" /> Attach Photo Evidence (Simulated)
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl text-xs shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Report
            </button>
          </form>
        </div>

        {/* Community Triage List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
            Operator Triage Stream
          </h3>

          <div className="space-y-3">
            {citizenReports.length === 0 ? (
              <div className="p-10 bg-white rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2 shadow-xs">
                <AlertCircle className="w-8 h-8 opacity-40 mb-1 text-slate-500" />
                <p className="font-bold text-slate-700 text-sm">No Active Citizen Reports</p>
                <p className="text-xs max-w-sm text-center text-slate-500 font-medium">There are currently no citizen reports in the queue. Submit a new report to see it appear in the triage queue.</p>
              </div>
            ) : (
              citizenReports.map((report) => (
                <div key={report.id} className={`bg-white rounded-2xl border p-4 space-y-3 shadow-xs transition-colors ${
                  report.status === 'VERIFIED' ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-cyan-800 font-mono">{report.reportNumber}</span>
                      <span className="text-slate-900 font-bold">{report.category}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 flex items-center gap-1 font-medium"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {report.locationName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {report.status === 'VERIFIED' ? (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> VERIFIED
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                          {report.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{report.description}</p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 gap-2">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-slate-500">
                      <span>Reporter: <strong className="text-slate-800 font-semibold">{report.reporterContact}</strong></span>
                      <span>•</span>
                      <span>Severity: <strong className="text-slate-800 font-semibold uppercase">{report.severity}</strong></span>
                      {report.photoEvidence && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 flex items-center gap-1 font-medium"><Camera className="w-3 h-3" /> Photo Attached</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{report.submittedAt}</span>
                    </div>

                    {report.status === 'SUBMITTED' && (
                      <button
                        onClick={() => onVerifyReport(report.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify & Broadcast to Network</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
