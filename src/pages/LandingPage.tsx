import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  ArrowRight, 
  ShieldAlert, 
  Clock, 
  Activity, 
  Cpu, 
  Bot, 
  Siren, 
  TrendingUp, 
  Eye, 
  Users, 
  BarChart3, 
  CheckCircle2, 
  Globe, 
  Sparkles,
  ChevronRight,
  Radio,
  Layers,
  Menu,
  X
} from 'lucide-react';
import { INITIAL_CITY_METRICS } from '../data/mockData';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070B12]/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40 shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-tight text-white font-sans">SynapseCity</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">AI OS</span>
              </div>
              <p className="text-[9px] sm:text-[10px] text-slate-400 font-semibold uppercase tracking-wider hidden sm:block">Autonomous Urban Mobility Platform</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Platform Capabilities</a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">Multi-Agent Engine</a>
            <a href="#impact" className="hover:text-cyan-400 transition-colors">Environmental Impact</a>
            <button onClick={() => navigate('/architecture')} className="hover:text-cyan-400 transition-colors">System Specs</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/25 border border-cyan-400/40 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Command Center</span>
              <ArrowRight className="w-4 h-4 hidden sm:block" />
            </button>

            {/* Mobile Menu Trigger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#0A0E17] border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-300">
              <a 
                href="#features" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
              >
                <span>Platform Capabilities</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </a>
              <a 
                href="#architecture" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
              >
                <span>Multi-Agent Engine</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </a>
              <a 
                href="#impact" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
              >
                <span>Environmental Impact</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </a>
              <button 
                onClick={() => { setIsMobileMenuOpen(false); navigate('/architecture'); }}
                className="w-full p-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-200 flex items-center justify-between text-left"
              >
                <span>System Specifications</span>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex gap-3">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-950"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Next-Generation Autonomous Traffic Infrastructure</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.1] font-sans">
            AI-Driven Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300">Autonomous Urban Mobility</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            SynapseCity AI orchestrates simulated citywide traffic signals, edge cameras, and multi-agent systems to demonstrate congestion reduction and prioritized emergency corridors.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-xl shadow-cyan-500/20 border border-cyan-400/50 flex items-center gap-2.5 transition-all transform hover:scale-105"
            >
              <Activity className="w-4 h-4 text-cyan-200" />
              <span>Explore Live Command Center</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/digital-twin')}
              className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-bold text-sm tracking-wide border border-slate-700/80 flex items-center gap-2.5 transition-all shadow-md hover:border-slate-600"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Digital Twin Sandbox</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
              <div className="text-2xl font-black text-cyan-400 font-sans">8</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Simulated Intersections</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
              <div className="text-2xl font-black text-emerald-400 font-sans">Prototype</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Signal Optimization</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
              <div className="text-2xl font-black text-blue-400 font-sans">0 Tons</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Daily CO2 Emissions Reduced</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-md">
              <div className="text-2xl font-black text-indigo-400 font-sans">8</div>
              <div className="text-xs text-slate-400 font-medium mt-1">Simulated Edge Controllers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-slate-950/60 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-white font-sans">
              Why Cities Are Upgrading to <span className="text-cyan-400">Autonomous Infrastructure</span>
            </h2>
            <p className="mt-3 text-slate-400 text-sm max-w-2xl mx-auto">
              Legacy fixed-timer traffic lights cost metropolitan areas billions in delayed transit, fuel waste, and emergency response delays.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* The Old Way */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-rose-500/20 relative overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Legacy Traffic Control</h3>
                  <p className="text-xs text-slate-400">Fixed timings & uncoordinated signals</p>
                </div>
              </div>
              <ul className="space-y-4 text-xs text-slate-300">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span><strong>Static Timers:</strong> Signals cycle regardless of real-time traffic volume or sudden accidents.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span><strong>Emergency Delays:</strong> Ambulances wait in traffic, adding critical minutes to life-saving response times.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span><strong>Excess CO2 Emissions:</strong> Idle vehicles consume thousands of gallons of excess fuel daily in gridlock.</span>
                </li>
              </ul>
            </div>

            {/* SynapseCity AI */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/30 border border-cyan-500/40 relative overflow-hidden shadow-2xl shadow-cyan-950/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">SynapseCity Autonomous AI</h3>
                  <p className="text-xs text-cyan-400 font-medium">Distributed Multi-Agent Reinforcement Engine</p>
                </div>
              </div>
              <ul className="space-y-4 text-xs text-slate-200">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Simulated Adaptation:</strong> Prototype vision feeds demonstrate dynamic phase adjustments based on vehicle counts.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Smart Green Waves:</strong> Prototype siren beacons trigger seamless green corridors for first responders.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Predictive Congestion Forecasts:</strong> Prototype algorithms forecast urban bottlenecks and adjust signals in advance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Bento Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            Core Infrastructure
          </div>
          <h2 className="text-3xl font-extrabold text-white font-sans">
            End-to-End Autonomous Mobility Modules
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div 
            onClick={() => navigate('/traffic')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">Prototype Vision Edge Nodes</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Demonstrates real-time multi-class object detection (cars, trucks, buses, cyclists, pedestrians) in a simulated environment.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
              <span>View Vision Feeds</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/emergency')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 group-hover:scale-110 transition-transform">
              <Siren className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">Emergency Green Wave Lock</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Automated siren detection & GPS corridor locking clears intersections ahead of ambulances and fire rescue units, reducing transit times by up to 60%.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-rose-400">
              <span>Emergency Dispatch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/predictions')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">Predictive Congestion Forecasting</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Prototype spatial-temporal algorithms forecast urban bottlenecks in advance, pre-adjusting adjacent signal networks.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span>Predictive Flow</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/agents')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-5 group-hover:scale-110 transition-transform">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">Multi-Agent AI Mesh (Simulated)</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Intersections operate a localized heuristic agent that negotiates green time with neighbor nodes to maximize grid throughput.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <span>Inspect AI Mesh</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/digital-twin')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">Digital Twin Simulation</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Test weather events, severe monsoon storms, stadium crowd exits, or road closures in a full digital twin simulation before applying to live hardware.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-400">
              <span>Run Simulation</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div 
            onClick={() => navigate('/citizen-reports')}
            className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Citizen Participation Portal</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Citizens report road hazards or signal faults. AI vision instantly cross-verifies reported locations against local camera feeds for rapid dispatch.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <span>Citizen Portal</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-20 px-6 border-t border-slate-800/80 bg-gradient-to-b from-[#070B12] to-slate-950 text-center">
        <div className="max-w-4xl mx-auto p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-2xl">
          <h2 className="text-3xl font-extrabold text-white font-sans">Ready to Transform Your Urban Traffic Grid?</h2>
          <p className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto">
            Experience the future of autonomous signal optimization, multi-agent AI networks, and emergency green corridors.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 border border-cyan-400/40"
            >
              Open Command Center
            </button>
            <button
              onClick={() => navigate('/architecture')}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700"
            >
              View System Architecture
            </button>
          </div>
        </div>
      </section>

      {/* Professional Municipal Infrastructure Footer */}
      <Footer />
    </div>
  );
};
