import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  SlidersHorizontal, 
  Siren, 
  Search, 
  Bell, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Menu
} from 'lucide-react';

interface TopHeaderProps {
  onOpenAssistant: () => void;
  onOpenScenario: () => void;
  activeEmergencyCount: number;
  onToggleSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAssistant,
  onOpenScenario,
  activeEmergencyCount,
  onToggleSidebar
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#070B12]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 gap-3">
      {/* Left: Mobile Sidebar Toggle & Operational Header */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden shrink-0 absolute left-4"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex flex-col ml-12 lg:ml-0">
          <div className="flex items-center gap-2">
            <h1 className="text-slate-100 font-extrabold text-sm tracking-widest uppercase">
              SYNAPSECITY <span className="text-slate-500 font-normal mx-1">/</span> <span className="text-cyan-400">COIMBATORE URBAN MOBILITY OPERATIONS</span>
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">SYSTEM ONLINE</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium mt-1">
            <span className="text-slate-500 uppercase">Data Sources:</span>
            <span className="text-cyan-300">Simulation</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300">User Reports</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300">External Ref Feed</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300">Weather</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-300">Map/Routing</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500 line-through">Rail Schedule (UNAVAILABLE)</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Indicators */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Active Emergency Wave Banner */}
        {activeEmergencyCount > 0 && (
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 animate-pulse text-xs font-semibold">
            <Siren className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">{activeEmergencyCount} Emergency Corridor Active</span>
            <span className="md:hidden">{activeEmergencyCount} EV Active</span>
          </div>
        )}

        {/* Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{currentTime || '14:32:08 UTC'}</span>
        </div>

        {/* Scenario Simulator Modal Launcher */}
        <button
          onClick={onOpenScenario}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 text-xs font-medium transition-all shadow-sm hover:border-slate-600"
          title="Open Simulation Sandbox"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
          <span className="hidden sm:inline">Simulation</span>
        </button>

        {/* Gemini AI Co-Pilot Launcher */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 border border-cyan-400/40 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
          <span className="hidden sm:inline">Synapse Co-Pilot</span>
          <span className="sm:hidden">Co-Pilot</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

        {/* Operator Badge */}
        <div className="hidden md:flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-extrabold text-xs text-white shadow-sm">
            OP
          </div>
          <div className="hidden lg:block text-left text-xs">
            <div className="font-semibold text-slate-200 flex items-center gap-1">
              <span>Traffic Command</span>
              <ShieldCheck className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-[10px] text-slate-400">Level 4 Dispatcher</div>
          </div>
        </div>
      </div>
    </header>
  );
};
