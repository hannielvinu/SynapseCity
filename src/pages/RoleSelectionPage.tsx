import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Siren, 
  Flame, 
  Activity, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  LockOpen, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../components/RoleSwitcherModal';

interface RoleSelectionPageProps {
  onSelectRole: (role: UserRole) => void;
}

export const RoleSelectionPage: React.FC<RoleSelectionPageProps> = ({ onSelectRole }) => {
  const navigate = useNavigate();

  const roles: {
    id: UserRole;
    title: string;
    badge: string;
    badgeColor: string;
    icon: React.ElementType;
    iconBg: string;
    description: string;
    capabilities: string[];
    primaryPath: string;
    cta: string;
  }[] = [
    {
      id: 'citizen',
      title: 'Coimbatore Citizen',
      badge: 'COMMUNITY & PUBLIC',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: Users,
      iconBg: 'bg-emerald-600',
      description: 'Report road hazards, potholes, waterlogging, or signal failures with simulated photo evidence and view nearby traffic congestion.',
      capabilities: [
        'Live Community Hazard Map',
        'One-Click Incident Reporting with Photo',
        'Report Triage Tracking (Submitted → Verified)',
        'Direct Emergency Helplines (108 / Police / CMCH)'
      ],
      primaryPath: '/citizen-portal',
      cta: 'Enter as Citizen'
    },
    {
      id: 'ambulance_driver',
      title: '108 Ambulance Driver',
      badge: 'EMERGENCY FIRST RESPONDER',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: Siren,
      iconBg: 'bg-rose-600',
      description: 'Turn-by-turn emergency navigation cockpit (Google Maps/Rapido style) with real-time green wave signal preemption to PSG, KMCH, and CMCH.',
      capabilities: [
        'Turn-by-Turn Guidance & ETA Countdown',
        'Hospital Destination Selector (PSG, KMCH, CMCH)',
        'Corridor Signal Preemption Lock (All Green)',
        'Live Distance & Progress Advancement'
      ],
      primaryPath: '/ambulance-driver',
      cta: 'Launch Ambulance Cockpit'
    },
    {
      id: 'fire_driver',
      title: 'Fire & Rescue Operator',
      badge: 'TACTICAL FIRST RESPONDER',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: Flame,
      iconBg: 'bg-amber-600',
      description: 'Tactical emergency navigation to structure fires and commercial incidents with automated arterial clearance.',
      capabilities: [
        'Incident Location Routing',
        'Multi-Intersection Clearance Lock',
        'Time Saved Metric Counter',
        'Nearest Hydrant Telemetry'
      ],
      primaryPath: '/fire-driver',
      cta: 'Launch Fire Cockpit'
    },
    {
      id: 'traffic_operator',
      title: 'Traffic Operations Center',
      badge: 'COMMAND CENTER (RECOMMENDED)',
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: Activity,
      iconBg: 'bg-cyan-600',
      description: 'Citywide operations portal managing 11 Coimbatore traffic signals, live perception camera, incident triage, and simulated AI agent stream.',
      capabilities: [
        'Hero OpenStreetMap Network Canvas',
        '11 Active Traffic Light Lamps & Phase Counters',
        'Live Camera & Vehicle Telemetry Ledger',
        'Autonomous Edge Agent Negotiation Feed'
      ],
      primaryPath: '/dashboard',
      cta: 'Open Operations Center'
    },
    {
      id: 'admin',
      title: 'City Administrator',
      badge: 'EXECUTIVE & GOVERNANCE',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      icon: ShieldCheck,
      iconBg: 'bg-indigo-600',
      description: 'Digital twin scenario sandbox, historical travel-time benchmarks, and 8-layer municipal architecture specifications.',
      capabilities: [
        'Digital Twin Offline Policy Sandbox',
        'Historical Congestion & Throughput Analytics',
        '8-Layer System Architecture Documentation',
        'Official Data Sources & Third-Party Citations'
      ],
      primaryPath: '/digital-twin',
      cta: 'Open Admin Console'
    }
  ];

  const handleSelect = (role: typeof roles[0]) => {
    onSelectRole(role.id);
    navigate(role.primaryPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50/25 to-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white py-12 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/40 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-2xl tracking-tight text-slate-900">SynapseCity</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 border border-cyan-300">
                  COIMBATORE
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Urban Mobility Operations Portal</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs mt-2">
            <LockOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Instant Role Access • Zero Passwords Required</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose Your Demonstration Role
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl font-medium">
            Select an operational perspective to experience the SynapseCity mobility ecosystem from citizen reporting to emergency ambulance green waves.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isFeatured = role.id === 'traffic_operator' || role.id === 'ambulance_driver';

            return (
              <div
                key={role.id}
                onClick={() => handleSelect(role)}
                className={`bg-white rounded-3xl border p-6 flex flex-col justify-between space-y-6 shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer group ${
                  isFeatured 
                    ? 'border-cyan-300 ring-2 ring-cyan-100 hover:border-cyan-500' 
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon */}
                  <div className="flex items-start justify-between gap-2">
                    <div className={`w-12 h-12 rounded-2xl ${role.iconBg} flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-mono font-extrabold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                      {role.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {role.description}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Key Capabilities:</span>
                    {role.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Button */}
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
                    role.id === 'ambulance_driver' 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : role.id === 'traffic_operator'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white'
                      : role.id === 'citizen'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : role.id === 'fire_driver'
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <span>{role.cta}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Back to Showcase Link */}
        <div className="text-center pt-4">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors cursor-pointer"
          >
            ← Return to Public Showcase
          </button>
        </div>
      </div>
    </div>
  );
};
