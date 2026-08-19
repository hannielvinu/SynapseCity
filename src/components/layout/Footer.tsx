import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-6 mt-8 rounded-2xl shadow-xs">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-bold tracking-tight text-slate-900">
              SynapseCity AI
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 font-medium">
              Coimbatore Urban Mobility Intelligence Platform
            </p>
            <p className="mt-1.5 max-w-md text-[11px] leading-relaxed text-slate-500">
              Adaptive signal control, emergency corridor preemption, and digital twin simulation.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-600">
            <a
              href="/dashboard"
              className="transition-colors hover:text-cyan-700"
            >
              Platform
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/architecture"
              className="transition-colors hover:text-cyan-700"
            >
              Architecture
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="/citizen-reports"
              className="transition-colors hover:text-cyan-700"
            >
              Citizen Portal
            </a>
          </nav>
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[11px] text-slate-500">
            © 2026 SynapseCity Urban Mobility Systems. All rights reserved.
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Build v4.2 • Operational Sim Node 10
          </p>
        </div>
      </div>
    </footer>
  );
};
