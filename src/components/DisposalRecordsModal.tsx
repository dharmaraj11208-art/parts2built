import React, { useState } from 'react';
import { MonthlyQuotaConfig, DisposalLog } from '../types';
import { getMonthlyDisposalMetrics } from '../utils/calculator';
import {
  X,
  Plus,
  Trash2,
  Sliders,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Scale,
  Calendar,
  Building
} from 'lucide-react';

interface DisposalRecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MonthlyQuotaConfig;
  onUpdateQuotaConfig: (newConfig: MonthlyQuotaConfig) => void;
}

export const DisposalRecordsModal: React.FC<DisposalRecordsModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateQuotaConfig
}) => {
  const [quotaKg, setQuotaKg] = useState<number>(config.monthlyQuotaKg);
  const [warningThresholdPercent, setWarningThresholdPercent] = useState<number>(config.warningThresholdPercent);
  const [dangerThresholdPercent, setDangerThresholdPercent] = useState<number>(config.dangerThresholdPercent);

  // New log form state
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [logDate, setLogDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [logWeightKg, setLogWeightKg] = useState<number>(5.0);
  const [facilityDepartment, setFacilityDepartment] = useState<string>('Factory Line 2 Maintenance');
  const [wasteType, setWasteType] = useState<DisposalLog['wasteType']>('Non-reusable Scrap');
  const [disposalContractor, setDisposalContractor] = useState<string>('EcoRecycle Certified Ltd');
  const [logNotes, setLogNotes] = useState<string>('');

  if (!isOpen) return null;

  const currentMetrics = getMonthlyDisposalMetrics({
    ...config,
    monthlyQuotaKg: quotaKg,
    warningThresholdPercent,
    dangerThresholdPercent
  });

  const handleSaveConfig = () => {
    onUpdateQuotaConfig({
      ...config,
      monthlyQuotaKg: Number(quotaKg),
      warningThresholdPercent: Number(warningThresholdPercent),
      dangerThresholdPercent: Number(dangerThresholdPercent)
    });
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (logWeightKg <= 0) return;

    const newLog: DisposalLog = {
      id: `disp-${Date.now()}`,
      date: logDate,
      weightKg: Number(logWeightKg),
      facilityDepartment: facilityDepartment.trim(),
      wasteType,
      disposalContractor: disposalContractor.trim(),
      notes: logNotes.trim() || 'Scheduled scrap pickup.'
    };

    onUpdateQuotaConfig({
      ...config,
      monthlyQuotaKg: Number(quotaKg),
      warningThresholdPercent: Number(warningThresholdPercent),
      dangerThresholdPercent: Number(dangerThresholdPercent),
      disposalLogs: [newLog, ...config.disposalLogs]
    });

    setShowAddForm(false);
    setLogWeightKg(5.0);
    setLogNotes('');
  };

  const handleDeleteLog = (id: string) => {
    onUpdateQuotaConfig({
      ...config,
      disposalLogs: config.disposalLogs.filter((l) => l.id !== id)
    });
  };

  const StatusIcon = currentMetrics.status === 'safe'
    ? ShieldCheck
    : currentMetrics.status === 'warning'
      ? AlertTriangle
      : ShieldAlert;

  const statusColor = currentMetrics.status === 'safe'
    ? 'text-emerald-400'
    : currentMetrics.status === 'warning'
      ? 'text-amber-400'
      : 'text-rose-400';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-emerald-400" />
              <span>Monthly Waste Disposal Quota &amp; Threshold Log</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Set industrial facility monthly e-waste limits and monitor safe, caution, and danger thresholds.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Current Status Preview */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-slate-900 border border-slate-800 ${statusColor}`}>
                <StatusIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-400 font-mono">
                  {config.currentMonthName} Status
                </div>
                <div className={`text-base font-bold ${statusColor}`}>
                  {currentMetrics.status.toUpperCase()} ({currentMetrics.percentageOfQuota}% Quota Used)
                </div>
              </div>
            </div>

            <div className="font-mono text-xs text-slate-300 space-y-0.5 sm:text-right">
              <div>
                Disposed: <span className="font-bold text-white tabular-nums">{currentMetrics.totalDisposedKg} kg</span> / {currentMetrics.quotaKg} kg
              </div>
              <div>
                Remaining Buffer: <span className={`font-semibold tabular-nums ${currentMetrics.remainingSafeQuotaKg > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{currentMetrics.remainingSafeQuotaKg} kg</span>
              </div>
            </div>
          </div>

          {/* Quota Threshold Setting Controls */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Facility Threshold Configuration</span>
              </h4>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors"
              >
                Save Limits
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Monthly Disposal Quota (kg)
                </label>
                <input
                  type="number"
                  min="10"
                  max="1000"
                  step="5"
                  value={quotaKg}
                  onChange={(e) => setQuotaKg(Math.max(1, parseFloat(e.target.value) || 50))}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-amber-300 mb-1">
                  Caution Limit (% of quota)
                </label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  value={warningThresholdPercent}
                  onChange={(e) => setWarningThresholdPercent(parseInt(e.target.value) || 65)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                  Triggers at: {((warningThresholdPercent / 100) * quotaKg).toFixed(1)} kg
                </span>
              </div>

              <div>
                <label className="block text-xs text-rose-300 mb-1">
                  Danger Limit (% of quota)
                </label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={dangerThresholdPercent}
                  onChange={(e) => setDangerThresholdPercent(parseInt(e.target.value) || 85)}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">
                  Triggers at: {((dangerThresholdPercent / 100) * quotaKg).toFixed(1)} kg
                </span>
              </div>
            </div>
          </div>

          {/* Log New Disposal Event */}
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>Monthly Disposal Event History ({config.disposalLogs.length} logs)</span>
              </h4>
              <button
                type="button"
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showAddForm ? 'Cancel Entry' : '+ Log Disposal Record'}</span>
              </button>
            </div>

            {/* Add Record Form */}
            {showAddForm && (
              <form onSubmit={handleAddLog} className="p-4 bg-slate-900/90 border-b border-slate-800 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Date</label>
                    <input
                      type="date"
                      value={logDate}
                      onChange={(e) => setLogDate(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Disposed Weight (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={logWeightKg}
                      onChange={(e) => setLogWeightKg(parseFloat(e.target.value) || 1)}
                      className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Classification</label>
                    <select
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value as DisposalLog['wasteType'])}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="Non-reusable Scrap">Non-reusable Scrap</option>
                      <option value="Hazardous Chemical Battery">Hazardous Chemical Battery</option>
                      <option value="Heavy Metal Slag">Heavy Metal Slag</option>
                      <option value="Shattered Glass/Casings">Shattered Glass/Casings</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Origin Facility Dept</label>
                    <input
                      type="text"
                      value={facilityDepartment}
                      onChange={(e) => setFacilityDepartment(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Licensed Contractor</label>
                    <input
                      type="text"
                      value={disposalContractor}
                      onChange={(e) => setDisposalContractor(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">Disposal Notes</label>
                  <input
                    type="text"
                    value={logNotes}
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="e.g. Unrecoverable copper corrosion on PCB traces"
                    className="w-full px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Confirm &amp; Record Weight
                  </button>
                </div>
              </form>
            )}

            {/* Logs List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4">Date</th>
                    <th className="py-2.5 px-4">Origin Dept</th>
                    <th className="py-2.5 px-4">Classification</th>
                    <th className="py-2.5 px-4 text-right">Disposed Mass</th>
                    <th className="py-2.5 px-4">Contractor</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {config.disposalLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-6 text-center text-slate-500">
                        No disposal logs recorded this month. Zero e-waste discarded.
                      </td>
                    </tr>
                  ) : (
                    config.disposalLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/60">
                        <td className="py-2.5 px-4 text-slate-300">{log.date}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-200">{log.facilityDepartment}</td>
                        <td className="py-2.5 px-4 font-sans text-slate-400">{log.wasteType}</td>
                        <td className="py-2.5 px-4 text-right text-rose-400 font-bold tabular-nums">
                          {log.weightKg} kg
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-400 truncate max-w-[140px]">{log.disposalContractor}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                            title="Delete log entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
