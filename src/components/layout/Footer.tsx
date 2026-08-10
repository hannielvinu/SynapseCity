import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-100">
              SynapseCity AI
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Urban Mobility Intelligence Platform
            </p>
            <p className="mt-2 max-w-md text-[11px] leading-relaxed text-slate-500">
              AI-powered traffic management for smarter, safer, connected
              cities.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-500">
            <a
              href="/dashboard"
              className="transition-colors hover:text-cyan-400"
            >
              Platform
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/architecture"
              className="transition-colors hover:text-cyan-400"
            >
              Architecture
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/citizen-reports"
              className="transition-colors hover:text-cyan-400"
            >
              Citizen Portal
            </a>
            <span className="text-slate-700">•</span>
            <a
              href="/status"
              className="transition-colors hover:text-cyan-400"
            >
              System Status
            </a>
          </nav>
        </div>

        <div className="mt-5 border-t border-slate-800/70 pt-4">
          <p className="text-[10px] text-slate-600">
            © 2026 SynapseCity AI Systems Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};