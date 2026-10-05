import React from 'react';
import { MonthlyQuotaConfig } from '../types';
import { getMonthlyDisposalMetrics } from '../utils/calculator';
import { AlertTriangle, CheckCircle2, ShieldAlert, Sliders, PlusCircle } from 'lucide-react';

interface DisposalQuotaBarometerProps {
  config: MonthlyQuotaConfig;
  onOpenRecordsModal: () => void;
  onOpenAddRecordModal: () => void;
  compact?: boolean;
}

export const DisposalQuotaBarometer: React.FC<DisposalQuotaBarometerProps> = ({
  config,
  onOpenRecordsModal,
  onOpenAddRecordModal,
  compact = false
}) => {
  const metrics = getMonthlyDisposalMetrics(config);

  const statusConfig = {
    safe: {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      barColor: 'bg-emerald-500',
      accentGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
      badge: 'SAFE COMPLIANCE',
      label: 'Normal Plant Recycling Stream',
      description: 'Monthly disposal volume is safely within the facility sustainability limits.'
    },
    warning: {
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      barColor: 'bg-amber-500',
      accentGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
      badge: 'CAUTION THRESHOLD',
      label: 'Approaching Monthly Limit (≥65%)',
      description: 'Recommend prioritizing component repurposing and desoldering to avoid penalty.'
    },
    danger: {
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      barColor: 'bg-rose-500',
      accentGlow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
      badge: 'DANGER THRESHOLD EXCEEDED',
      label: 'Critical Quota Breach (≥85%)',
      description: 'Immediate halt on scrap hauling required. Repurpose all salvageable circuit boards.'
    }
  }[metrics.status];

  const StatusIcon = metrics.status === 'safe'
    ? CheckCircle2
    : metrics.status === 'warning'
      ? AlertTriangle
      : ShieldAlert;

  if (compact) {
    return (
      <div className={`p-4 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor} transition-all`}>
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
            <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
              Disposal Barometer: {metrics.status.toUpperCase()}
            </span>
          </div>
          <span className="font-mono text-xs tabular-nums text-slate-200">
            {metrics.totalDisposedKg} / {metrics.quotaKg} kg ({metrics.percentageOfQuota}%)
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
          <div
            className={`h-full transition-all duration-500 ${statusConfig.barColor}`}
            style={{ width: `${Math.min(100, metrics.percentageOfQuota)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.accentGlow} p-6 transition-all`}>
      {/* Background radial gradient indicator */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{
          backgroundColor:
            metrics.status === 'safe'
              ? '#10b981'
              : metrics.status === 'warning'
                ? '#f59e0b'
                : '#ef4444'
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Indicator & Explanations */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/60 border border-slate-700/50 text-slate-200">
              <span className={`w-2 h-2 rounded-full animate-pulse ${statusConfig.barColor}`} />
              {config.currentMonthName} Facility Monitor
            </span>
            <span className={`px-2.5 py-1 rounded-md font-bold tracking-wider ${statusConfig.color} bg-slate-900/60 border ${statusConfig.borderColor}`}>
              {statusConfig.badge}
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
              <StatusIcon className={`w-6 h-6 ${statusConfig.color} shrink-0`} />
              <span>{statusConfig.label}</span>
            </h2>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              {statusConfig.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1 font-mono">
            <div>
              Disposed This Month: <span className="text-white font-semibold tabular-nums">{metrics.totalDisposedKg} kg</span>
            </div>
            <span>·</span>
            <div>
              Monthly Quota: <span className="text-white font-semibold tabular-nums">{metrics.quotaKg} kg</span>
            </div>
            <span>·</span>
            <div>
              Remaining Safe Buffer: <span className={`font-semibold tabular-nums ${metrics.remainingSafeQuotaKg > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{metrics.remainingSafeQuotaKg} kg</span>
            </div>
          </div>
        </div>

        {/* Right Side: Meter & Quick Actions */}
        <div className="w-full lg:w-80 shrink-0 space-y-4 bg-slate-900/80 border border-slate-800 p-5 rounded-xl">
          <div className="flex items-baseline justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">Disposal Barometer</span>
            <span className="font-mono text-2xl font-bold tabular-nums text-white">
              {metrics.percentageOfQuota}%
            </span>
          </div>

          {/* Three-zone multi-segmented progress bar */}
          <div className="space-y-1.5">
            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full transition-all duration-700 ${statusConfig.barColor}`}
                style={{ width: `${Math.min(100, metrics.percentageOfQuota)}%` }}
              />
              {/* Zone demarcation marks */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700/80 z-20 pointer-events-none"
                style={{ left: `${config.warningThresholdPercent}%` }}
                title="Warning Threshold (65%)"
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-rose-500/80 z-20 pointer-events-none"
                style={{ left: `${config.dangerThresholdPercent}%` }}
                title="Danger Threshold (85%)"
              />
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400">Safe (0-65%)</span>
              <span className="text-amber-400">Caution (65-85%)</span>
              <span className="text-rose-400">Danger (&gt;85%)</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={onOpenAddRecordModal}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Disposal</span>
            </button>
            <button
              onClick={onOpenRecordsModal}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="View records and configure monthly quota"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Quota Config</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
