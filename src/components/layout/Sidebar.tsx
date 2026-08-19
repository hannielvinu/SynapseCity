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
  Layers,
  ChevronRight,
  Zap,
  Radio,
  Globe,
  Users,
  Flame,
  Database,
  Navigation,
  UserCheck
} from 'lucide-react';
import { UserRole, ROLES_CONFIG } from '../RoleSwitcherModal';

interface SidebarProps {
  currentRole?: UserRole;
  onOpenRoleSwitcher?: () => void;
  activeIncidentsCount: number;
  activeEmergencyCount: number;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentRole = 'traffic_operator',
  onOpenRoleSwitcher,
  activeIncidentsCount, 
  activeEmergencyCount,
  isOpen = false,
  onClose
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const activeRoleConfig = ROLES_CONFIG.find(r => r.id === currentRole) || ROLES_CONFIG[3];

  // Dynamic Navigation items filtered strictly by active role
  const getRoleNavItems = () => {
    switch (currentRole) {
      case 'citizen':
        return [
          { path: '/citizen-portal', label: 'Citizen Mobility Map', icon: Users },
          { path: '/citizen-reports', label: 'Submit Road Hazard', icon: AlertTriangle, badge: activeIncidentsCount, badgeColor: 'text-amber-700 bg-amber-50 border border-amber-200' },
          { path: '/sources', label: 'Data Sources & Credits', icon: Database },
        ];
      case 'ambulance_driver':
        return [
          { path: '/ambulance-driver', label: 'Emergency Nav Cockpit', icon: Siren, badge: activeEmergencyCount, badgeColor: 'text-rose-700 bg-rose-50 border border-rose-200' },
          { path: '/traffic-signals', label: 'Corridor Signal Status', icon: GitCommit },
          { path: '/sources', label: 'Data Sources & Credits', icon: Database },
        ];
      case 'fire_driver':
        return [
          { path: '/fire-driver', label: 'Fire Tactical Cockpit', icon: Flame },
          { path: '/incidents', label: 'Active Incident Clearance', icon: AlertTriangle, badge: activeIncidentsCount, badgeColor: 'text-amber-700 bg-amber-50 border border-amber-200' },
          { path: '/traffic-signals', label: 'Corridor Signal Status', icon: GitCommit },
          { path: '/sources', label: 'Data Sources & Credits', icon: Database },
        ];
      case 'admin':
        return [
          { path: '/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
          { path: '/live-traffic', label: 'Live Traffic & Perception', icon: Activity },
          { path: '/traffic-signals', label: 'Traffic Signal Operations', icon: GitCommit },
          { path: '/emergency', label: 'Emergency Green Waves', icon: Siren, badge: activeEmergencyCount, badgeColor: 'text-rose-700 bg-rose-50 border border-rose-200' },
          { path: '/incidents', label: 'Incident Desk', icon: AlertTriangle, badge: activeIncidentsCount, badgeColor: 'text-amber-700 bg-amber-50 border border-amber-200' },
          { path: '/digital-twin', label: 'Digital Twin Sandbox', icon: Cpu },
          { path: '/analytics', label: 'Historical Benchmarks', icon: BarChart3 },
          { path: '/architecture', label: '8-Layer Architecture', icon: Layers },
          { path: '/sources', label: 'Data Sources & Credits', icon: Database },
        ];
      case 'traffic_operator':
      default:
        return [
          { path: '/dashboard', label: 'Operations Overview', icon: LayoutDashboard },
          { path: '/live-traffic', label: 'Live Traffic & Perception', icon: Activity },
          { path: '/traffic-signals', label: 'Traffic Signal Operations', icon: GitCommit },
          { path: '/emergency', label: 'Emergency Command', icon: Siren, badge: activeEmergencyCount, badgeColor: 'text-rose-700 bg-rose-50 border border-rose-200' },
          { path: '/citizen-reports', label: 'Citizen Incident Triage', icon: AlertTriangle, badge: activeIncidentsCount, badgeColor: 'text-amber-700 bg-amber-50 border border-amber-200' },
          { path: '/ai-agents', label: 'Simulated Agent Network', icon: Bot },
          { path: '/predictions', label: 'Congestion Forecasts', icon: TrendingUp },
          { path: '/digital-twin', label: 'Digital Twin Sandbox', icon: Cpu },
          { path: '/sources', label: 'Data Sources & Credits', icon: Database },
        ];
    }
  };

  const navItems = getRoleNavItems();

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
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 bg-white border-r border-slate-200
        flex flex-col shrink-0 h-screen text-slate-700 font-sans
        transition-transform duration-300 ease-in-out shadow-sm lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div 
            onClick={() => handleNavClick('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20 border border-cyan-400/40 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-slate-900 group-hover:text-cyan-700 transition-colors">
                  SynapseCity
                </span>
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
                  CBE
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 tracking-wide uppercase">Urban Mobility OS</p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onClose && (
            <button 
              onClick={onClose} 
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          )}
        </div>

        {/* Role Perspective Card */}
        <div className="p-3 bg-slate-50 border-b border-slate-200">
          <div 
            onClick={onOpenRoleSwitcher}
            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-cyan-300 shadow-2xs cursor-pointer transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${
                currentRole === 'ambulance_driver' ? 'bg-rose-500 animate-pulse' :
                currentRole === 'fire_driver' ? 'bg-amber-500 animate-pulse' :
                currentRole === 'citizen' ? 'bg-emerald-500' : 'bg-cyan-500'
              }`} />
              <div>
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">Current View</span>
                <span className="text-xs font-black text-slate-900">{activeRoleConfig.title}</span>
              </div>
            </div>
            <UserCheck className="w-4 h-4 text-slate-400 group-hover:text-cyan-700 transition-colors" />
          </div>
        </div>

        {/* Main Navigation List */}
        <div className="flex-1 py-3 px-3 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {activeRoleConfig.badge}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-200 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-700' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Showcase
          </div>
          <button
            onClick={() => handleNavClick('/')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer border border-transparent"
          >
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>Public Showcase</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>
        </div>

        {/* Live System Status Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="font-bold text-slate-800 text-[11px]">Coimbatore Mesh</span>
              </div>
              <span className="text-[9px] text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 uppercase">
                Active
              </span>
            </div>
            <p className="text-[10px] text-slate-500">11 Junctions • PSG/KMCH Hospitals</p>
          </div>
        </div>
      </aside>
    </>
  );
};
