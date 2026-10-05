import React from 'react';
import { X, BookOpen, Layers, Cpu, Award, Milestone, Lightbulb, Compass, Printer } from 'lucide-react';

interface PresentationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchDoraemonDemo?: () => void;
}

export const PresentationGuideModal: React.FC<PresentationGuideModalProps> = ({
  isOpen,
  onClose,
  onLaunchDoraemonDemo
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                College Presentation &amp; Technical Roadmap Guide
              </h2>
              <p className="text-xs text-slate-400">
                Complete walkthrough, architectural breakdown, formulas, and talking points for academic presentation.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onLaunchDoraemonDemo && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchDoraemonDemo();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/20 transition-colors"
              >
                <span>🤖 Doraemon Demo</span>
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print Presentation Guide"
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

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-300 leading-relaxed font-sans">
          {/* Doraemon Interactive Audio Presentation Spotlight */}
          {onLaunchDoraemonDemo && (
            <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-slate-950 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-cyan-400/60 shadow-md shrink-0">
                  <img
                    src="/src/assets/images/doraemon_ai_robot_1791203744626.jpg"
                    alt="Doraemon AI Robot Cartoon Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider block">
                    Interactive English Audio Presenter
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    Watch Doraemon Robot Speak &amp; Present the Project in English
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Step-by-step narration explaining the e-waste problem, quota barometer, and 3D visualizer.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onLaunchDoraemonDemo();
                }}
                className="shrink-0 px-4 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-md transition-all flex items-center gap-1.5"
              >
                <span>🤖 Launch Robot Voice Demo</span>
              </button>
            </div>
          )}

          {/* Section 1: Title & Summary */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              01. Project Summary &amp; Core Problem Statement
            </span>
            <h3 className="text-base font-bold text-white">
              PARTS 2 BUILD: Industrial E-Waste Repurposing &amp; Hardware Lifecycle Extension
            </h3>
            <p className="text-xs text-slate-300">
              Over 53.6 million metric tons of e-waste are generated globally each year, with industrial test benches, assembly lines, and enterprise hardware refreshes discarding hundreds of thousands of functioning passive components (LEDs, resistors), microcontrollers (Arduino/ATmega), actuators, and sensors. <strong>PARTS 2 BUILD</strong> bridges this gap by cataloging discarded components, matching them dynamically against practical engineering reuse projects, calculating instant feasibility scores, and providing an industrial monthly waste disposal barometer with real-time Safe, Caution, and Danger alerts.
            </p>
          </div>

          {/* Section 2: Mathematical Models */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              02. Mathematical Formulas &amp; Algorithms
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold block mb-1">A. Project Feasibility Score</span>
                <p className="text-slate-300 text-[11px]">
                  <code>Feasibility(%) = [ &sum; min(Stock_i, Req_i) / &sum; Req_i ] &times; 100%</code>
                </p>
                <p className="text-slate-400 text-[10px] mt-1 font-sans">
                  Guarantees that partial matches (e.g. having 4 of 6 LEDs) are weighted proportionally without division by zero.
                </p>
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <span className="text-emerald-400 font-bold block mb-1">B. Waste Reduction &amp; Carbon Offset</span>
                <p className="text-slate-300 text-[11px]">
                  <code>Mass_diverted = &sum; (Units_reused &times; Unit_Weight_grams)</code>
                </p>
                <p className="text-slate-300 text-[11px] mt-1">
                  <code>CO₂_avoided (kg) = Mass_diverted(kg) &times; 2.45</code>
                </p>
                <p className="text-slate-400 text-[10px] mt-1 font-sans">
                  Derived from EPA and WEEE Life Cycle Assessment factor for primary smelting avoidance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Safe-to-Danger Monthly Quota Logic */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              03. Safe-to-Danger Monthly Disposal Barometer
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
                <span className="font-bold block">&lt; 65%: SAFE (Green)</span>
                <span className="text-[11px] text-slate-300 font-sans block mt-1">
                  Plant waste within municipal limits; normal recycling stream active.
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                <span className="font-bold block">65% - 85%: CAUTION (Yellow)</span>
                <span className="text-[11px] text-slate-300 font-sans block mt-1">
                  Waste volume surging; technicians alerted to prioritize salvage desoldering.
                </span>
              </div>
              <div className="p-2.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300">
                <span className="font-bold block">&gt; 85%: DANGER (Red)</span>
                <span className="text-[11px] text-slate-300 font-sans block mt-1">
                  Critical compliance breach; scrap shipments suspended until parts repurposed.
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Architecture Structure */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              04. Software Architecture &amp; Tech Stack
            </span>
            <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
              <li><strong>Frontend Engine:</strong> React 19 + TypeScript + Vite with full responsive layout for mobile, tablet, and desktop viewports.</li>
              <li><strong>Styling &amp; Theme:</strong> Tailwind CSS v4 with bespoke industrial slate/emerald palette, WCAG AA compliance, and zero layout shift.</li>
              <li><strong>3D Hardware Visualizer:</strong> Pure HTML5 Canvas 60fps rotational vector engine with 360&deg; perspective projection matrix and zero external runtime lag.</li>
              <li><strong>State &amp; Persistence:</strong> Client-side reactive state with LocalStorage synchronization allowing full operation without complex cloud backend requirements.</li>
            </ul>
          </div>

          {/* Section 5: Demonstration Roadmap for Evaluators */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              05. Evaluator Presentation Walkthrough (3-Minute Demo)
            </span>
            <ol className="space-y-2 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Step 1</span>
                <span><strong>Dashboard Overview:</strong> Show the global KPIs (reclaimed components count, diverted mass in kg, and the Safe/Caution/Danger disposal barometer).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Step 2</span>
                <span><strong>3D Component Interaction:</strong> Spin the 3D IC Chip / Resistor model to demonstrate interactive component inspection with lead pinouts and desoldering specs.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Step 3</span>
                <span><strong>Component Registration:</strong> Click &ldquo;Add Component&rdquo;, use an industrial preset (e.g. 5mm LEDs or Arduino), and demonstrate how batch weight is calculated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Step 4</span>
                <span><strong>Smart Matching Engine:</strong> Navigate to &ldquo;Recommendations&rdquo; to showcase real-time percentage matching, missing part shortfall indicators, and 1-click Build &amp; Deduct.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-mono font-bold text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">Step 5</span>
                <span><strong>Project Schematics &amp; Print:</strong> Open the &ldquo;LED Emergency Light&rdquo; or &ldquo;Obstacle Detector Rover&rdquo; modal to display the circuit schematic, salvage tips, and print-ready brief.</span>
              </li>
            </ol>
          </div>

          {/* Section 6: Future Expansion Ideas */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-mono font-bold block">
              06. Future Expansion Roadmap
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-white font-semibold block mb-1">1. Computer Vision OCR Scanner</span>
                <p className="text-slate-400 text-[11px]">
                  Integrate camera-based chip labeling OCR and resistor color band recognition directly through device cameras.
                </p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-white font-semibold block mb-1">2. Inter-Facility B2B Trading</span>
                <p className="text-slate-400 text-[11px]">
                  Allow regional factories and university engineering labs to swap surplus components to minimize regional e-waste transport costs.
                </p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-white font-semibold block mb-1">3. Automated Gerber / KiCAD Exporter</span>
                <p className="text-slate-400 text-[11px]">
                  Generate open-source wiring breadboard layout files and 3D printable scrap enclosure models for every project.
                </p>
              </div>
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg">
                <span className="text-white font-semibold block mb-1">4. Certified ESG Compliance Reporting</span>
                <p className="text-slate-400 text-[11px]">
                  Export automated ISO 14001 and RoHS environmental sustainability audit certificates for corporate ESG filings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/70">
          <span className="text-xs text-slate-400 font-mono">
            College Presentation Brief · PARTS 2 BUILD v1.0
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
