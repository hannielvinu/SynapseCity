import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeType?: 'cyan' | 'emerald' | 'amber' | 'rose';
  actions?: React.ReactNode;
  onRefresh?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeType = 'cyan',
  actions,
  onRefresh
}) => {
  const badgeStyles = {
    cyan: 'bg-cyan-50 text-cyan-800 border-cyan-200 font-bold',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-bold',
    amber: 'bg-amber-50 text-amber-800 border-amber-200 font-bold',
    rose: 'bg-rose-50 text-rose-800 border-rose-200 font-bold'
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 font-sans">
            {title}
          </h1>
          {badgeText && (
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider border shadow-2xs ${badgeStyles[badgeType]}`}>
              {badgeText}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-slate-600 mt-1 font-medium max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
            title="Refresh View State"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
        {actions}
      </div>
    </div>
  );
};
