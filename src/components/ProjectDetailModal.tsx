import React from 'react';
import { ReuseProject, ElectronicComponent } from '../types';
import { findMatchingInventoryComponent } from '../utils/calculator';
import {
  X,
  Clock,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ShieldAlert,
  Printer,
  FileText,
  Share2
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ReuseProject | null;
  inventory: ElectronicComponent[];
  isOpen: boolean;
  onClose: () => void;
  onNavigateToRecommendations?: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  inventory,
  isOpen,
  onClose,
  onNavigateToRecommendations
}) => {
  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/70">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <span className="text-emerald-400">{project.category}</span>
              <span>·</span>
              <span className="text-slate-300 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {project.estimatedBuildTimeMinutes} mins build
              </span>
              <span>·</span>
              <span className="text-amber-400 font-medium">Difficulty: {project.difficulty}</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-sm text-slate-300">{project.tagline}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print / Save PDF Project Presentation Brief"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Hero Media + Schematics Flow */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative h-56 rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                  <Wrench className="w-10 h-10 text-emerald-400/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <span className="text-xs font-mono text-slate-300">
                  Built using 100% reclaimed e-waste scrap
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-between bg-slate-950/70 border border-slate-800 p-4 rounded-xl font-mono text-xs">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-2">
                  Circuit Schematic Architecture
                </span>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-emerald-300 leading-relaxed overflow-x-auto">
                  {project.schematicSummary}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="text-white font-semibold">Desolder Precaution:</span> Use a 30W iron or desoldering pump. Avoid prolonged thermal stress &gt; 5 seconds on IC pins.
              </div>
            </div>
          </div>

          {/* Project Overview */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Project Overview & Industrial Utility
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Bill of Materials (BOM) & Inventory Availability Check */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Bill of Materials (BOM) & Salvage Stock Check</span>
              </h3>
              {onNavigateToRecommendations && (
                <button
                  onClick={() => {
                    onClose();
                    onNavigateToRecommendations();
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
                >
                  View live feasibility match &rarr;
                </button>
              )}
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-4">Required Component</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-center">Req. Qty</th>
                    <th className="py-2.5 px-4 text-center">In Stock</th>
                    <th className="py-2.5 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {project.requiredComponents.map((req, idx) => {
                    const { availableQuantity } = findMatchingInventoryComponent(
                      req.componentName,
                      req.category,
                      inventory
                    );
                    const isSatisfied = availableQuantity >= req.requiredQuantity;

                    return (
                      <tr key={idx} className="hover:bg-slate-900/60">
                        <td className="py-2.5 px-4 font-sans font-medium text-slate-200">
                          {req.componentName}
                        </td>
                        <td className="py-2.5 px-4 font-sans text-slate-400">{req.category}</td>
                        <td className="py-2.5 px-4 text-center tabular-nums text-slate-200">
                          {req.requiredQuantity} {req.unit}
                        </td>
                        <td className="py-2.5 px-4 text-center tabular-nums font-semibold text-white">
                          {availableQuantity} {req.unit}
                        </td>
                        <td className="py-2.5 px-4 text-right font-sans">
                          {isSatisfied ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                              <AlertCircle className="w-3.5 h-3.5" />
                              Need {req.requiredQuantity - availableQuantity} more
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Wiring Instructions */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Wiring & Interconnect Sequence
            </h3>
            <ul className="space-y-2 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
              {project.wiringInstructions.map((wire, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 font-mono text-[10px] font-bold text-emerald-400">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{wire}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Assembly Steps with Salvage Tips */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
              Step-by-Step Construction Guide
            </h3>
            <div className="space-y-3">
              {project.assemblySteps.map((step, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono">
                      Step {idx + 1}
                    </span>
                    <span>{step.title}</span>
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                  {step.salvageTip && (
                    <div className="flex items-start gap-2 pt-1 text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                      <Lightbulb className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                      <span>
                        <strong className="text-amber-200">Salvage Tip:</strong> {step.salvageTip}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Educational Takeaways & Scientific Principles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span>Educational Takeaways (For Presentation)</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {project.educationalTakeaways.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                <span>Safety & Environmental Precautions</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                {project.safetyPrecautions.map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <span className="text-xs text-slate-400 font-mono">
            Platform: PARTS 2 BUILD · Circular Electronics
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Print Project Guide</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
