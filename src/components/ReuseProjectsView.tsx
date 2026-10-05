import React, { useState, useMemo } from 'react';
import { ReuseProject, ElectronicComponent } from '../types';
import { calculateProjectFeasibility } from '../utils/calculator';
import { Search, Wrench, Clock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface ReuseProjectsViewProps {
  projects: ReuseProject[];
  inventory: ElectronicComponent[];
  onSelectProject: (project: ReuseProject) => void;
  onNavigateToRecommendations: () => void;
}

export const ReuseProjectsView: React.FC<ReuseProjectsViewProps> = ({
  projects,
  inventory,
  onSelectProject,
  onNavigateToRecommendations
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.requiredComponents.some((rc) => rc.componentName.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDiff = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;

      return matchesSearch && matchesDiff && matchesCat;
    });
  }, [projects, searchTerm, selectedDifficulty, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-emerald-400" />
            <span>Repurposing & Reuse Projects Catalog</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Engineered hardware builds that upcycle discarded LEDs, microcontrollers, sensors, and passive components.
          </p>
        </div>

        <button
          onClick={onNavigateToRecommendations}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none"
        >
          <Sparkles className="w-4 h-4" />
          <span>Calculate Live Matches</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by name, required component (e.g. Arduino, LED, Motor)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner (&le; 30 mins)</option>
            <option value="Intermediate">Intermediate (~45-60 mins)</option>
            <option value="Advanced">Advanced (Robotics / IoT)</option>
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Domains</option>
            <option value="Educational / Maker">Educational / Maker</option>
            <option value="Industrial Utility">Industrial Utility</option>
            <option value="Environmental IoT">Environmental IoT</option>
            <option value="Emergency & Safety">Emergency & Safety</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const feasibility = calculateProjectFeasibility(project, inventory);

          return (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900 transition-all p-5 cursor-pointer shadow-sm hover:shadow-lg"
            >
              <div>
                {/* Image slot */}
                <div className="relative w-full h-44 rounded-lg overflow-hidden bg-slate-950 mb-4 border border-slate-800/80">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-950">
                      <Wrench className="w-8 h-8 text-emerald-500/40" />
                    </div>
                  )}

                  {/* Feasibility score tag in corner */}
                  <div className="absolute top-2 right-2 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-mono font-bold border border-slate-800 flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        feasibility.scorePercentage === 100
                          ? 'bg-emerald-500'
                          : feasibility.scorePercentage >= 50
                            ? 'bg-amber-500'
                            : 'bg-rose-500'
                      }`}
                    />
                    <span className="text-white tabular-nums">
                      {feasibility.scorePercentage}% Feasible
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{project.estimatedBuildTimeMinutes} min</span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <span className="text-emerald-400 font-medium">{project.category}</span>
                  <span>·</span>
                  <span className="text-amber-300">{project.difficulty}</span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors">
                  {project.title}
                </h3>

                <p className="mt-1.5 text-xs text-slate-300 line-clamp-2">
                  {project.tagline}
                </p>

                {/* Required Components Pills */}
                <div className="mt-3 pt-3 border-t border-slate-800/80">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                    BOM Requirements ({project.requiredComponents.length} items):
                  </span>
                  <div className="flex flex-wrap gap-1 text-[11px] font-mono text-slate-300">
                    {project.requiredComponents.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800/80 text-slate-300"
                      >
                        {req.requiredQuantity}x {req.componentName.split(' ')[0]}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Feasibility Strip */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="text-[11px] font-mono">
                  {feasibility.isFullyFeasible ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Assemble
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      Need {feasibility.missingComponents.length} more parts
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  className="font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-0.5"
                >
                  <span>Inspect</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
