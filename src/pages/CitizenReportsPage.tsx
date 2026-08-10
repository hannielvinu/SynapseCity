import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { INITIAL_CITIZEN_REPORTS } from '../data/mockData';
import { CitizenReport } from '../types';
import { Users, Send, CheckCircle2, AlertTriangle, Sparkles, MapPin, ThumbsUp } from 'lucide-react';

export const CitizenReportsPage: React.FC = () => {
  const [reports, setReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [category, setCategory] = useState<CitizenReport['category']>('traffic_light_broken');
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: CitizenReport = {
      id: `cit-${Date.now()}`,
      reportNumber: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      category,
      locationName: locationName || '5th Ave Crossing',
      description: description || 'Reported hazard by citizen',
      submittedAt: 'Just now',
      status: 'ai_verified',
      upvotes: 1,
      citizenName: citizenName || 'Anonymous Citizen',
      aiVerificationConfidence: 97.5
    };

    setReports([newReport, ...reports]);
    setLocationName('');
    setDescription('');
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  const handleUpvote = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r));
  };

  return (
    <div className="space-y-6 font-sans">
      <PageHeader
        title="Citizen Reports & Hazard Triage"
        subtitle="Crowdsourced citizen reporting tool. AI computer vision instantly cross-verifies reported hazards against local edge camera feeds."
        badgeText="AI AUTO-TRIAGE"
        badgeType="cyan"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submit Report Form */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Submit Hazard Report</span>
            </h3>
          </div>

          {submittedMessage && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Report verified by AI vision and logged for operator triage!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Your Name</label>
              <input
                type="text"
                placeholder="e.g., Alex Mercer"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hazard Category</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100"
              >
                <option value="traffic_light_broken">Broken Signal / Flashing Lights</option>
                <option value="hazard">Roadway Debris / Hazard</option>
                <option value="pothole">Pothole / Road Damage</option>
                <option value="accident">Unreported Accident</option>
                <option value="congestion_spike">Sudden Gridlock Spike</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Location / Intersection</label>
              <input
                type="text"
                placeholder="e.g., Bayfront Pkwy Lane 2"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Provide details about the hazard..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-slate-100 focus:outline-none focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-cyan-950/40 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Report to SynapseCity AI
            </button>
          </form>
        </div>

        {/* Community Triage List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">
            Live Citizen Reports & AI Verification Stream
          </h3>

          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-slate-900/90 rounded-2xl border border-slate-800 p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-cyan-400 font-mono">{report.reportNumber}</span>
                    <span className="text-slate-200 font-bold">{report.locationName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {report.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{report.description}</p>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400 text-[11px]">Submitted by <strong>{report.citizenName}</strong> • {report.submittedAt}</span>

                  <button
                    onClick={() => handleUpvote(report.id)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-200 font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{report.upvotes} Upvotes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
