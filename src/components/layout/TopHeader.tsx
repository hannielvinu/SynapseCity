import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Siren, 
  Bell, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Menu,
  UserCheck,
  ChevronDown,
  Database
} from 'lucide-react';
import { UserRole, ROLES_CONFIG } from '../RoleSwitcherModal';

interface TopHeaderProps {
  onOpenAssistant: () => void;
  onOpenScenario: () => void;
  onOpenRoleSwitcher: () => void;
  currentRole: UserRole;
  activeEmergencyCount: number;
  onToggleSidebar?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenAssistant,
  onOpenScenario,
  onOpenRoleSwitcher,
  currentRole,
  activeEmergencyCount,
  onToggleSidebar
}) => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState<string>('');

  const activeRoleConfig = ROLES_CONFIG.find(r => r.id === currentRole) || ROLES_CONFIG[3];

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
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between z-20 shrink-0 gap-3 shadow-xs font-sans">
      {/* Left: Mobile Sidebar Toggle & Operational Header */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 lg:hidden shrink-0 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-slate-900 font-extrabold text-xs sm:text-sm tracking-wide uppercase flex items-center gap-1.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <span>SYNAPSECITY</span>
              <span className="text-slate-300 font-normal">/</span>
              <span className="text-cyan-700 font-bold">COIMBATORE OPERATIONS</span>
            </h1>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-emerald-700 tracking-wider">LIVE CANONICAL STATE</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-[10px] text-slate-500 font-medium mt-0.5">
            <span>11 Signal Junctions Synchronized</span>
            <span className="text-slate-300">•</span>
            <span>Emergency Corridor Ready</span>
            <span className="text-slate-300">•</span>
            <span>Weather Active</span>
          </div>
        </div>
      </div>

      {/* Right: Actions & Role Switcher */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Prominent Role Switcher Button */}
        <button
          onClick={onOpenRoleSwitcher}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-900 text-xs font-bold transition-all shadow-xs cursor-pointer group"
          title="Switch Demonstration Role"
        >
          <UserCheck className="w-4 h-4 text-cyan-700" />
          <span className="hidden sm:inline">Role:</span>
          <span className="text-cyan-800 font-extrabold">{activeRoleConfig.title}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:translate-y-0.5 transition-transform" />
        </button>

        {/* Data Sources Shortcut */}
        <button
          onClick={() => navigate('/sources')}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          title="View Data Sources & Citations"
        >
          <Database className="w-3.5 h-3.5 text-slate-500" />
          <span>Sources</span>
        </button>

        {/* Active Emergency Wave Banner */}
        {activeEmergencyCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 animate-pulse text-xs font-bold shadow-xs">
            <Siren className="w-3.5 h-3.5 shrink-0 text-rose-600" />
            <span className="hidden md:inline">{activeEmergencyCount} Corridor Locked</span>
            <span className="md:hidden">EV</span>
          </div>
        )}

        {/* Clock */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-semibold">
          <Clock className="w-3.5 h-3.5 text-cyan-600" />
          <span>{currentTime || '14:32:08 UTC'}</span>
        </div>

        {/* Scenario Simulator Modal Launcher */}
        <button
          onClick={onOpenScenario}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-semibold transition-all shadow-xs cursor-pointer"
          title="Open Simulation Sandbox"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="hidden sm:inline">Sandbox</span>
        </button>

        {/* Gemini AI Co-Pilot Launcher */}
        <button
          onClick={onOpenAssistant}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white text-xs font-bold shadow-sm shadow-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin shrink-0" style={{ animationDuration: '4s' }} />
          <span className="hidden sm:inline">AI Co-Pilot</span>
          <span className="sm:hidden">AI</span>
        </button>
      </div>
    </header>
  );
};
