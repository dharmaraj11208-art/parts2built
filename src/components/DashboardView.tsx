import React from 'react';
import {
  ElectronicComponent,
  ReuseProject
} from '../types';
import {
  calculateTotalInventoryMassKg,
  calculateProjectFeasibility
} from '../utils/calculator';
import { Interactive3DComponent } from './Interactive3DComponent';
import {
  Cpu,
  Wrench,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Leaf,
  Layers,
  ShieldCheck,
  BookOpen,
  Plus,
  Bot,
  Zap,
  MessageSquare
} from 'lucide-react';
import { NavTab } from './Navbar';

interface DashboardViewProps {
  components: ElectronicComponent[];
  projects: ReuseProject[];
  onNavigate: (tab: NavTab) => void;
  onSelectProject: (project: ReuseProject) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onOpenArise: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  components,
  projects,
  onNavigate,
  onSelectProject,
  onOpenAddModal,
  onOpenGuideModal,
  onOpenArise
}) => {
  const totalMassKg = calculateTotalInventoryMassKg(components);
  const totalUnits = components.reduce((sum, c) => sum + c.quantity, 0);

  // Feasibility matching
  const feasibilityList = projects.map((p) => calculateProjectFeasibility(p, components));
  const readyProjects = feasibilityList.filter((f) => f.scorePercentage === 100);
  const potentialCO2AvoidedKg = feasibilityList.reduce((sum, f) => sum + f.estimatedCO2AvoidedKg, 0);

  return (
    <div className="space-y-8">
      {/* Hero Welcome & Quick Intro */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold tracking-wider text-emerald-400 uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Industrial Circular Electronics Platform</span>
          </div>

          <h1 className="font-['Syne',sans-serif] text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Transform Industrial E-Waste Into Practical Hardware Projects
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Discarded electronic components and decommissioned devices carry immense educational and practical potential. <strong>PARTS 2 BUILD</strong> catalogs salvage inventory, tracks reclaimed component volumes, and matches components with viable engineering builds.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('recommendations')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Projects ({readyProjects.length} Ready)</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Register Component</span>
            </button>

            <button
              onClick={onOpenGuideModal}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Roadmap Guide</span>
            </button>
          </div>
        </div>

        {/* Hero subtle background decoration */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ready Projects */}
        <div
          onClick={() => onNavigate('recommendations')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-emerald-500/50 hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Ready to Build
            </span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-emerald-400 tabular-nums">
              {readyProjects.length}
            </span>
            <span className="text-xs text-slate-400">/ {projects.length} projects</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            100% component availability in your current inventory.
          </p>
        </div>

        {/* KPI 2: Reclaimable Inventory Units */}
        <div
          onClick={() => onNavigate('inventory')}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-5 hover:border-slate-700 hover:bg-slate-900 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Reclaimable Stock
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white tabular-nums">
              {totalUnits}
            </span>
            <span className="text-xs text-slate-400 font-mono">({components.length} SKUs)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            LEDs, microcontrollers, motors &amp; sensors in active stock.
          </p>
        </div>

        {/* KPI 3: Salvaged Mass Diverted */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Salvaged Mass
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-white tabular-nums">
              {totalMassKg}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Solid electronic scrap diverted from toxic landfill burial.
          </p>
        </div>

        {/* KPI 4: CO2 Offset Potential */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-medium">
              Offset CO₂ Potential
            </span>
            <div className="p-2 rounded-lg bg-slate-800 text-emerald-400">
              <Leaf className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-extrabold text-emerald-400 tabular-nums">
              {Number(potentialCO2AvoidedKg.toFixed(1))}
            </span>
            <span className="text-xs text-slate-400 font-mono">kg CO₂e</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Avoided raw semiconductor &amp; copper mining smelting.
          </p>
        </div>
      </div>

      {/* ARISE AI Agent Spotlight Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 p-6 shadow-lg shadow-emerald-500/5">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Bot className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-400">
                Meet ARISE · Your AI Hardware &amp; IoT Friend
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Gemini 3.8 Powered
              </span>
            </div>

            <h3 className="text-xl font-bold tracking-tight text-white">
              Need fresh IoT ideas or step-by-step tasks to build hardware from your e-waste?
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              ARISE analyzes your <strong>{components.length} available salvage components</strong> and invents custom IoT projects, plans wiring pinouts, provides Arduino/ESP32 code, and breaks down the build into concrete step-by-step tasks!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenArise}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-500/20 transition-all focus:outline-none"
            >
              <Bot className="w-4 h-4" />
              <span>Chat with ARISE</span>
            </button>

            <button
              onClick={onOpenArise}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Generate Custom IoT Project</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-500/10 blur-2xl" />
      </div>

      {/* 3D Component Visualizer + Circular Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Interactive 3D Component Inspector */}
        <div className="lg:col-span-7">
          <Interactive3DComponent initialType="microcontroller" />
        </div>

        {/* Right Column (5 cols): How Circular Salvage Works */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
              Industrial Workflow
            </span>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Circular Electronics Lifecycle
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              How plants, makerspaces, and university labs convert hazardous scrap into functioning hardware:
            </p>
          </div>

          <div className="space-y-3.5 pt-1">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400">
                1
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Desolder &amp; Benchmark</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Harvest LEDs, resistors, motors, and boards from decommissioned scrap. Test pins on digital multimeters.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400">
                2
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Algorithmic BOM Matching</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  PARTS 2 BUILD compares available stock against required project parts, ranking builds by percentage feasibility.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 font-mono text-xs font-bold text-emerald-400">
                3
              </span>
              <div>
                <h4 className="text-xs font-bold text-white">Assemble &amp; Prevent Landfill</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Build emergency lights, fume fans, and IoT soil sensors while keeping disposal metrics within the safe green band.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Facility Compliance: <span className="text-emerald-400 font-semibold">Active</span>
            </span>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
            >
              <span>View All 7 Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Ready-to-Build Spotlight Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Recommended Builds Ready for Immediate Assembly</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These engineering builds have 100% component availability based on your workshop stock.
            </p>
          </div>

          <button
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1"
          >
            <span>See full recommendations list &rarr;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {feasibilityList.slice(0, 3).map(({ project, scorePercentage, isFullyFeasible, estimatedWasteReductionGrams }) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-slate-700 hover:bg-slate-900 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full h-32 rounded-lg overflow-hidden bg-slate-950 mb-3 border border-slate-800/80">
                  {project.imageUrl ? (
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-900">
                      <Wrench className="w-6 h-6 text-emerald-400/40" />
                    </div>
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-950/90 text-emerald-400 border border-slate-800">
                    {scorePercentage}% Feasible
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 mb-1 flex items-center gap-1.5">
                  <span className="text-emerald-400 font-medium">{project.category}</span>
                  <span>·</span>
                  <span>{project.difficulty}</span>
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {project.title}
                </h3>

                <p className="mt-1 text-xs text-slate-300 line-clamp-2">
                  {project.tagline}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  Diverts: <strong className="text-emerald-400">{estimatedWasteReductionGrams}g</strong>
                </span>
                <span className="text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Inspect &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
