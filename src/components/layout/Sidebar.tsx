import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  GitCommit, 
  Siren, 
  TrendingUp, 
  Cpu, 
  Bot, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Layers,
  ChevronRight,
  Zap,
  Radio,
  Globe
} from 'lucide-react';
import { AppRoute } from '../../types';

interface SidebarProps {
  activeIncidentsCount: number;
  activeEmergencyCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeIncidentsCount, 
  activeEmergencyCount,
  isOpen = false,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const navItems: { route: AppRoute; path: string; label: string; icon: React.ElementType; badge?: number; color?: string }[] = [
    { route: 'dashboard', path: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
    { route: 'traffic', path: '/traffic', label: 'Live Traffic', icon: Activity },
    { route: 'intersections', path: '/intersections', label: 'Intersections', icon: GitCommit },
    { route: 'incidents', path: '/incidents', label: 'Incident Desk', icon: AlertTriangle, badge: activeIncidentsCount, color: 'text-amber-400 bg-amber-500/20' },
    { route: 'emergency', path: '/emergency', label: 'Emergency Corridors', icon: Siren, badge: activeEmergencyCount, color: 'text-rose-400 bg-rose-500/20' },
    { route: 'predictions', path: '/predictions', label: 'Predictive Flow', icon: TrendingUp },
    { route: 'agents', path: '/agents', label: 'AI Agent Network', icon: Bot, color: 'text-cyan-400 bg-cyan-500/20' },
    { route: 'digital-twin', path: '/digital-twin', label: 'Digital Twin Sandbox', icon: Cpu },
    { route: 'analytics', path: '/analytics', label: 'Mobility Analytics', icon: BarChart3 },
    { route: 'citizen-reports', path: '/citizen-reports', label: 'Citizen Reports', icon: Users },
    { route: 'architecture', path: '/architecture', label: 'System Architecture', icon: Layers }
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose} 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-[#0A0E17] border-r border-slate-800/80 
        flex flex-col shrink-0 h-screen text-slate-300 font-sans backdrop-blur-md
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  SynapseCity
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  AI
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase">Urban Mobility OS v4.2</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )}
        </div>

        {/* Main Navigation List */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Operator Console
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path === '/dashboard' && currentPath === '/');
            
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${item.color || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Public Gateway
          </div>
          <button
            onClick={() => handleNavClick('/')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Public Showcase</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>

        {/* Live System Status Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
          <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200 text-[11px]">Grid Neural Mesh</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                ONLINE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">8 simulated edge nodes active.</p>
          </div>
        </div>
      </aside>
    </>
  );
};
