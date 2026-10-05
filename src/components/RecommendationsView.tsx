import React, { useState, useMemo } from 'react';
import { ReuseProject, ElectronicComponent, ProjectFeasibility } from '../types';
import { calculateProjectFeasibility, findMatchingInventoryComponent } from '../utils/calculator';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Leaf,
  Layers,
  Wrench,
  Check,
  RotateCcw
} from 'lucide-react';

interface RecommendationsViewProps {
  projects: ReuseProject[];
  inventory: ElectronicComponent[];
  onSelectProject: (project: ReuseProject) => void;
  onAllocateComponentsForProject: (project: ReuseProject) => void;
  onNavigateToInventory: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  projects,
  inventory,
  onSelectProject,
  onAllocateComponentsForProject,
  onNavigateToInventory
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'ready' | 'near'>('all');
  const [allocatedProjectIds, setAllocatedProjectIds] = useState<string[]>([]);

  // Calculate feasibility for every project
  const feasibilityList: ProjectFeasibility[] = useMemo(() => {
    return projects
      .map((proj) => calculateProjectFeasibility(proj, inventory))
      .sort((a, b) => b.scorePercentage - a.scorePercentage);
  }, [projects, inventory]);

  const fullyReadyCount = useMemo(
    () => feasibilityList.filter((f) => f.scorePercentage === 100).length,
    [feasibilityList]
  );

  const potentialWasteDivertedGrams = useMemo(
    () => feasibilityList.reduce((sum, f) => sum + f.estimatedWasteReductionGrams, 0),
    [feasibilityList]
  );

  const totalCO2AvoidedKg = useMemo(
    () => Number(((potentialWasteDivertedGrams / 1000) * 2.45).toFixed(2)),
    [potentialWasteDivertedGrams]
  );

  const filteredList = useMemo(() => {
    if (filterMode === 'ready') {
      return feasibilityList.filter((f) => f.scorePercentage === 100);
    }
    if (filterMode === 'near') {
      return feasibilityList.filter((f) => f.scorePercentage >= 50 && f.scorePercentage < 100);
    }
    return feasibilityList;
  }, [feasibilityList, filterMode]);

  const handleBuildAllocate = (project: ReuseProject) => {
    onAllocateComponentsForProject(project);
    setAllocatedProjectIds((prev) => [...prev, project.id]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-emerald-400" />
            <span>AI & Feasibility Project Recommendations</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Dynamic algorithm comparing your active component inventory against project BOMs with estimated waste diversion.
          </p>
        </div>

        <button
          onClick={onNavigateToInventory}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Manage Stock ({inventory.length} SKUs)</span>
        </button>
      </div>

      {/* Mathematical Formula Rigor Card */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>Transparent Matching & Waste Reduction Model</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Feasibility Score = <code className="text-emerald-300 font-mono">(&sum; min(Stock, Required) / &sum; Required) &times; 100%</code>.
              Estimated Waste Diverted = <code className="text-emerald-300 font-mono">&sum; (Component Qty &times; Component Unit Weight)</code>.
              Carbon Offset = <code className="text-emerald-300 font-mono">Diverted Mass (kg) &times; 2.45 kg CO₂e</code>.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80 font-mono text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Ready to Build</span>
              <span className="text-emerald-400 font-bold text-lg tabular-nums">
                {fullyReadyCount} Projects
              </span>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Avoided CO₂</span>
              <span className="text-white font-bold text-lg tabular-nums flex items-center gap-1">
                <Leaf className="w-4 h-4 text-emerald-400" />
                {totalCO2AvoidedKg} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Segmented Filter Bar */}
      <div className="flex items-center gap-2 p-1 bg-slate-900/90 border border-slate-800 rounded-xl w-fit">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            filterMode === 'all'
              ? 'bg-slate-800 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Recommendations ({feasibilityList.length})
        </button>
        <button
          onClick={() => setFilterMode('ready')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            filterMode === 'ready'
              ? 'bg-emerald-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>100% Ready to Build ({fullyReadyCount})</span>
        </button>
        <button
          onClick={() => setFilterMode('near')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
            filterMode === 'near'
              ? 'bg-amber-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span>Near Matches 50-99% ({feasibilityList.filter(f => f.scorePercentage >= 50 && f.scorePercentage < 100).length})</span>
        </button>
      </div>

      {/* Recommended Projects List */}
      <div className="space-y-4">
        {filteredList.map(({ project, scorePercentage, isFullyFeasible, missingComponents, estimatedWasteReductionGrams, estimatedCO2AvoidedKg, matchedQuantity, totalRequiredQuantity }) => {
          const isBuilt = allocatedProjectIds.includes(project.id);

          return (
            <div
              key={project.id}
              className={`rounded-2xl border p-5 transition-all ${
                isFullyFeasible
                  ? 'border-emerald-500/40 bg-slate-900/90 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                  : scorePercentage >= 50
                    ? 'border-amber-500/30 bg-slate-900/70'
                    : 'border-slate-800 bg-slate-900/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                {/* Left side: Project Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-emerald-400">{project.category}</span>
                    <span className="text-slate-500">·</span>
                    <span className="text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {project.estimatedBuildTimeMinutes} mins
                    </span>
                    <span className="text-slate-500">·</span>
                    <span className="text-amber-300 font-medium">Difficulty: {project.difficulty}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    <span>{project.title}</span>
                    {isFullyFeasible && (
                      <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        INSTANT BUILD READY
                      </span>
                    )}
                  </h3>

                  <p className="text-xs text-slate-300 max-w-2xl">
                    {project.tagline}
                  </p>

                  {/* Impact pill badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-mono text-slate-400">
                    <div>
                      Diverted E-Waste: <span className="text-emerald-400 font-semibold tabular-nums">{estimatedWasteReductionGrams}g</span>
                    </div>
                    <span>·</span>
                    <div>
                      Offset CO₂: <span className="text-white font-semibold tabular-nums">{estimatedCO2AvoidedKg} kg</span>
                    </div>
                    <span>·</span>
                    <div>
                      Parts: <span className="text-white font-semibold tabular-nums">{matchedQuantity} / {totalRequiredQuantity} items</span>
                    </div>
                  </div>
                </div>

                {/* Center / Right: Progress Bar & Actions */}
                <div className="w-full lg:w-72 shrink-0 space-y-3 bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      Feasibility Score
                    </span>
                    <span
                      className={`font-mono text-xl font-bold tabular-nums ${
                        isFullyFeasible
                          ? 'text-emerald-400'
                          : scorePercentage >= 50
                            ? 'text-amber-400'
                            : 'text-rose-400'
                      }`}
                    >
                      {scorePercentage}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isFullyFeasible
                          ? 'bg-emerald-500'
                          : scorePercentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${scorePercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onSelectProject(project)}
                      className="flex-1 py-2 px-3 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-center"
                    >
                      Inspect Schematic
                    </button>

                    {isFullyFeasible ? (
                      <button
                        onClick={() => handleBuildAllocate(project)}
                        disabled={isBuilt}
                        className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                          isBuilt
                            ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                        title="Deduct required parts from inventory and record project build"
                      >
                        {isBuilt ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Built</span>
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3.5 h-3.5" />
                            <span>Build &amp; Deduct</span>
                          </>
                        )}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Missing Components Drawer */}
              {missingComponents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-medium text-amber-300 mb-2">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>Missing Components for 100% Assembly ({missingComponents.length}):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {missingComponents.map((missing, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-950/80 border border-slate-800 px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between"
                      >
                        <span className="text-slate-300 truncate mr-2" title={missing.name}>
                          {missing.name}
                        </span>
                        <span className="text-rose-400 font-bold shrink-0">
                          Need +{missing.shortfall}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
