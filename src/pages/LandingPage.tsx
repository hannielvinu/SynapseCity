import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  Activity, 
  Cpu, 
  Bot, 
  Siren, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ShieldCheck,
  UserCheck,
  Navigation,
  Flame,
  Clock
} from 'lucide-react';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/40 shrink-0">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-slate-900">SynapseCity</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-200">
                  COIMBATORE
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider hidden sm:block">Urban Mobility Operations Portal</p>
            </div>
          </div>

          {/* Right Action: Single Clean Prominent "Choose Role" Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/role-selection')}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-extrabold text-xs tracking-wide shadow-md shadow-cyan-500/25 border border-cyan-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Choose Role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 overflow-hidden bg-gradient-to-b from-cyan-50/50 via-slate-50 to-slate-50">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-900 text-xs font-bold uppercase tracking-wider mb-8 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Coimbatore Urban Mobility & Emergency Response Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 max-w-5xl mx-auto leading-[1.1]">
            Autonomous Traffic Grid & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600">Emergency Corridor Control</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            SynapseCity synchronizes 11 Coimbatore arterial intersections, prioritizing 108 Emergency Ambulances with real-time green wave signal locks to PSG, KMCH, and CMCH hospitals.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/role-selection')}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-black text-sm tracking-wide shadow-lg shadow-cyan-500/25 border border-cyan-500/40 flex items-center gap-2.5 transition-all transform hover:scale-105 cursor-pointer"
            >
              <UserCheck className="w-5 h-5 text-cyan-100" />
              <span>Choose Role & Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm tracking-wide border border-slate-300 flex items-center gap-2.5 transition-all shadow-sm cursor-pointer"
            >
              <Activity className="w-5 h-5 text-cyan-600" />
              <span>Live Operations Center</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5 Distinct Demonstration Roles Overview */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200 uppercase">
            Interactive Demonstrations
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            5 Dedicated Role Perspectives
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl mx-auto font-medium">
            Experience the mobility network through dedicated interfaces designed for citizens, first responders, and traffic dispatchers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div 
            onClick={() => navigate('/citizen-portal')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Citizen Portal</h3>
              <p className="text-[11px] text-slate-500 mt-1">Hazard reporting with photo evidence and nearby traffic maps.</p>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 pt-2 border-t border-slate-100">
              Launch Portal →
            </span>
          </div>

          <div 
            onClick={() => navigate('/ambulance-driver')}
            className="bg-white p-5 rounded-2xl border border-rose-200 hover:border-rose-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 text-left ring-1 ring-rose-100"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <Siren className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Ambulance Cockpit</h3>
              <p className="text-[11px] text-slate-500 mt-1">Turn navigation & green wave signal lock to PSG & KMCH.</p>
            </div>
            <span className="text-[10px] text-rose-700 font-bold flex items-center gap-1 pt-2 border-t border-slate-100">
              Launch Cockpit →
            </span>
          </div>

          <div 
            onClick={() => navigate('/fire-driver')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Fire & Rescue</h3>
              <p className="text-[11px] text-slate-500 mt-1">Tactical incident dispatch and intersection clearance.</p>
            </div>
            <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1 pt-2 border-t border-slate-100">
              Launch Cockpit →
            </span>
          </div>

          <div 
            onClick={() => navigate('/dashboard')}
            className="bg-white p-5 rounded-2xl border border-cyan-200 hover:border-cyan-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 text-left ring-1 ring-cyan-100"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">Traffic Command</h3>
              <p className="text-[11px] text-slate-500 mt-1">Citywide map, 11 traffic signals, and AI agent coordination.</p>
            </div>
            <span className="text-[10px] text-cyan-700 font-bold flex items-center gap-1 pt-2 border-t border-slate-100">
              Launch Command →
            </span>
          </div>

          <div 
            onClick={() => navigate('/digital-twin')}
            className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-3 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">City Admin</h3>
              <p className="text-[11px] text-slate-500 mt-1">Digital twin policy simulation and historical benchmarks.</p>
            </div>
            <span className="text-[10px] text-indigo-700 font-bold flex items-center gap-1 pt-2 border-t border-slate-100">
              Launch Console →
            </span>
          </div>
        </div>
      </section>

      {/* Core Technical Highlights */}
      <section className="py-16 px-6 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">11 Synchronized Signal Nodes</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Real Coimbatore junctions from Gandhipuram to Hopes College with authentic Red, Amber, and Green timing cycles.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <Siren className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Emergency Corridor Wave</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              SafetyValidator enforces minimum all-red clearances before granting emergency green waves, saving ~3.8 minutes per run.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-sm text-slate-900">Edge Agent Negotiation</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Multi-agent heuristic algorithms coordinate phase splits and dynamically adjust green windows based on live queue lengths.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
