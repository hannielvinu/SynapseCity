import React from 'react';
import { 
  Users, 
  Siren, 
  Flame, 
  Radio, 
  ShieldCheck, 
  X, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export type UserRole = 'citizen' | 'ambulance_driver' | 'fire_driver' | 'traffic_operator' | 'admin';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const ROLES_CONFIG: {
  id: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  features: string[];
}[] = [
  {
    id: 'citizen',
    title: 'Citizen Portal',
    badge: 'PUBLIC MOBILITY',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: Users,
    description: 'Crowdsourced hazard reporting, real-time traffic view, and emergency helpline dispatch.',
    features: ['Report Road Hazards with Photo', 'View My Incident Triage Status', 'Nearby Congestion & Hospital Contacts']
  },
  {
    id: 'ambulance_driver',
    title: 'Ambulance Driver Cockpit',
    badge: 'PRIORITY EMERGENCY',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
    icon: Siren,
    description: 'Navigation-app interface with live green-wave signal preemption and hospital ETA routing.',
    features: ['Rapido/Google Maps Style Turn View', 'Emergency Corridor Signal Lock Status', 'Direct Hospital Route to PSG / KMCH / CMCH']
  },
  {
    id: 'fire_driver',
    title: 'Fire & Rescue Cockpit',
    badge: 'FIRST RESPONDER',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Flame,
    description: 'Tactical emergency navigation to hazard scenes with arterial clearance and obstruction bypass.',
    features: ['Incident Route Clearance', 'Hydrant & Hazard Proximity', 'Preemption Signal Lock']
  },
  {
    id: 'traffic_operator',
    title: 'Traffic Operations Center',
    badge: 'MUNICIPAL COMMAND',
    badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    icon: Radio,
    description: 'Full citywide map, signal adjustments, computer vision streams, and heuristic agent coordination.',
    features: ['Citywide OpenStreetMap Grid', 'Live Traffic Signal Phase Control', 'Incident Verification & Corridor Dispatch']
  },
  {
    id: 'admin',
    title: 'City Administrator',
    badge: 'GOVERNANCE & AUDIT',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    icon: ShieldCheck,
    description: 'Digital Twin simulation sandbox, historical delay benchmarks, and 8-layer architecture audit.',
    features: ['Digital Twin Snapshot Comparison', 'Historical Benchmark Analytics', 'System Stack & Data Sources Spec']
  }
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar font-sans">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg text-slate-900">Select Demonstration Role</h3>
              <span className="text-[10px] bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-full font-bold uppercase">
                Instant Switch • No Passwords
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Switch perspective to experience tailored interfaces for Citizens, Emergency Drivers, and City Operators.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 gap-3">
          {ROLES_CONFIG.map(role => {
            const Icon = role.icon;
            const isSelected = currentRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => {
                  onSelectRole(role.id);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isSelected
                    ? 'bg-cyan-50/70 border-cyan-400 shadow-xs ring-1 ring-cyan-400'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-xl border shadow-xs ${
                    role.id === 'ambulance_driver' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                    role.id === 'fire_driver' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                    role.id === 'citizen' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                    role.id === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                    'bg-cyan-100 text-cyan-700 border-cyan-200'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-slate-900">{role.title}</h4>
                      <span className={`text-[9px] px-2 py-0.2 rounded-md font-bold uppercase border ${role.badgeColor}`}>
                        {role.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">{role.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {role.features.map((feat, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-medium">
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 transition-all ${
                  isSelected 
                    ? 'bg-cyan-600 text-white shadow-xs' 
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}>
                  {isSelected ? (
                    <><CheckCircle2 className="w-3.5 h-3.5" /> Active</>
                  ) : (
                    <>Launch <ArrowRight className="w-3.5 h-3.5" /></>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
