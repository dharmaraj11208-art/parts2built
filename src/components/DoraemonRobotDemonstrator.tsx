import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Bot,
  Award,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface DemonstrationStep {
  id: number;
  title: string;
  subtitle: string;
  speechText: string;
  visualHighlight: string;
  proTip: string;
}

const DEMO_STEPS: DemonstrationStep[] = [
  {
    id: 1,
    title: 'Introduction & Welcome to PARTS 2 BUILD',
    subtitle: 'The Circular Electronics Repurposing Platform',
    speechText:
      'Hello friends! I am your AI robot companion! Welcome to PARTS 2 BUILD, where we rescue discarded electronic components from industrial scrap bins and turn them into incredible hardware projects! Are you ready to see how this project works?',
    visualHighlight: 'Overview of circular economy and industrial e-waste diversion.',
    proTip: 'Begin your college presentation by stating the global challenge: 53.6 million metric tons of electronic waste discarded every year.'
  },
  {
    id: 2,
    title: 'The Industrial E-Waste Problem',
    subtitle: 'Rescuing Working Semiconductors from Toxic Landfills',
    speechText:
      'Look at standard industrial test benches and assembly lines! Millions of perfectly working LEDs, resistors, Arduino boards, and sensors are thrown into the garbage when products are upgraded. This causes severe heavy metal contamination from lead, cadmium, and mercury!',
    visualHighlight: 'Reclaiming high-grade semiconductors before municipal scrap disposal.',
    proTip: 'Point out that over 70% of discarded circuit boards contain fully functional passive and active electronic parts.'
  },
  {
    id: 3,
    title: 'The Safe-to-Danger Monthly Disposal Barometer',
    subtitle: 'Green, Yellow, and Red Compliance Thresholds',
    speechText:
      'Here is our first major feature: the Monthly Disposal Barometer! Facilities set a monthly disposal quota, like 50 kilograms. When disposal is under 65 percent, the indicator shines green for Safe! Between 65 and 85 percent, it turns yellow for Caution! Above 85 percent, it flashes red for Danger, alerting technicians to immediately repurpose components instead of discarding them!',
    visualHighlight: 'Dynamic mathematical quota barometer with real-time color shifting.',
    proTip: 'Show evaluators how logging a new scrap shipment updates the percentage and shifts the alert status.'
  },
  {
    id: 4,
    title: 'Interactive 3D Component Inspection',
    subtitle: 'Testing Pinouts, Tolerances & Salvage Integrity',
    speechText:
      'Check out our 3D Component Visualizer! Makers can rotate salvaged microcontrollers, resistors, and ultrasonic sensors 360 degrees, inspect metal lead pinouts, and test electrical ratings before soldering. It runs at a smooth 60 frames per second with zero lag!',
    visualHighlight: 'Full 360-degree rotational 3D canvas with wireframe mode and lead pinouts.',
    proTip: 'Drag the 3D model with your mouse or finger during the presentation to demonstrate lag-free canvas performance.'
  },
  {
    id: 5,
    title: 'Algorithmic Feasibility Matching Engine',
    subtitle: 'Comparing Salvaged Inventory with Project BOMs',
    speechText:
      'Our intelligent matching engine compares your registered scrap parts against project Bills of Materials! It calculates an exact feasibility percentage, flags missing items with shortfalls, and computes the exact grams of e-waste diverted and kilograms of carbon dioxide avoided!',
    visualHighlight: 'Mathematical matching formula: ∑ min(Stock, Required) / ∑ Required × 100%.',
    proTip: 'Demonstrate clicking "Build & Deduct" on an emergency lamp to show how stock is subtracted from inventory in real-time.'
  },
  {
    id: 6,
    title: 'Meet ARISE: The AI IoT Engineering Companion',
    subtitle: 'Generative AI Hardware Blueprints & Step-by-Step Tasks',
    speechText:
      'Meet ARISE, our intelligent AI IoT mentor powered by Gemini! You can ask ARISE for fresh IoT ideas, calculate LED resistor values with Ohm’s law, or ask ARISE to invent brand new custom IoT projects and save them directly into your catalog!',
    visualHighlight: 'AI IoT Companion with speech synthesis, task master, and blueprint generator.',
    proTip: 'Demonstrate generating an IoT blueprint in the Blueprint Studio tab and adding it straight to your catalog.'
  },
  {
    id: 7,
    title: 'Academic Conclusion & Q&A Summary',
    subtitle: 'Inspiring Sustainable Hardware Engineering',
    speechText:
      'And that is how PARTS 2 BUILD converts hazardous e-waste into sustainable engineering brilliance! You now have a complete, runnable, and verifiable project ready to present with full confidence. Thank you, and let us protect our planet together!',
    visualHighlight: 'Complete end-to-end circular engineering platform demonstration.',
    proTip: 'Conclude by inviting your professors to inspect the printable PDF project briefs and the live Ohm’s law calculator.'
  }
];

interface DoraemonRobotDemonstratorProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: any) => void;
}

export const DoraemonRobotDemonstrator: React.FC<DoraemonRobotDemonstratorProps> = ({
  isOpen,
  onClose,
  onNavigateToTab
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  const currentStep = DEMO_STEPS[currentStepIndex];

  // Stop speech when closing
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Speak current step text
  const speakCurrentStep = (stepText: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(stepText);
    utterance.rate = speechRate;
    utterance.pitch = 1.15; // slightly cheerful robotic tone

    // Try finding clean English voice
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Junior') || v.name.includes('Alex'))) ||
      voices.find((v) => v.lang.startsWith('en'));

    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onstart = () => {
      setIsPlayingSpeech(true);
    };

    utterance.onend = () => {
      setIsPlayingSpeech(false);
      // Auto-advance if enabled and not at the last step
      if (autoAdvance && currentStepIndex < DEMO_STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex((prev) => {
            const nextIdx = prev + 1;
            speakCurrentStep(DEMO_STEPS[nextIdx].speechText);
            return nextIdx;
          });
        }, 800);
      }
    };

    utterance.onerror = () => {
      setIsPlayingSpeech(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (isPlayingSpeech) {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingSpeech(false);
    } else {
      speakCurrentStep(currentStep.speechText);
    }
  };

  const handleNextStep = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (isPlayingSpeech) {
        speakCurrentStep(DEMO_STEPS[nextIdx].speechText);
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (isPlayingSpeech) {
        speakCurrentStep(DEMO_STEPS[prevIdx].speechText);
      }
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    speakCurrentStep(DEMO_STEPS[0].speechText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-500/10 overflow-hidden my-4">
        {/* Header Ribbon */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Bot className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Syne',sans-serif] text-base font-bold text-white tracking-tight">
                  Doraemon AI Robot Demonstrator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                  ENGLISH VOICE DEMO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Interactive English Speech Presentation Guide for College Evaluation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Demonstrator Body */}
        <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto">
          {/* Top Stage: Doraemon Cartoon Picture & Speech Bubble */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-950/80 border border-slate-800 p-5 rounded-2xl">
            {/* Left: Doraemon AI Robot Cartoon Avatar */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
              <div className="relative group">
                <div
                  className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 shadow-xl transition-all duration-300 ${
                    isPlayingSpeech
                      ? 'border-cyan-400 shadow-cyan-500/30 ring-4 ring-cyan-500/20 scale-105'
                      : 'border-slate-700 shadow-slate-900'
                  }`}
                >
                  <img
                    src="/src/assets/images/doraemon_ai_robot_1791203744626.jpg"
                    alt="Doraemon AI Robot Cartoon Guide"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Animated Voice/Pulse Halo Badge */}
                {isPlayingSpeech && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg animate-pulse">
                    <Volume2 className="w-3 h-3" />
                    <span>SPEAKING</span>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <span className="font-['Syne',sans-serif] font-bold text-sm text-cyan-300 block">
                  Robo-Guide Doraemon
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  AI Academic Presenter
                </span>
              </div>
            </div>

            {/* Right: Live Speech Bubble in English */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
                  <Sparkles className="w-4 h-4" />
                  <span>Scene {currentStepIndex + 1} of {DEMO_STEPS.length}</span>
                </span>
                <span>English Audio Engine</span>
              </div>

              {/* Speech Dialogue Bubble */}
              <div className="relative p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/90 border border-cyan-500/30 shadow-inner">
                <h4 className="text-base font-bold text-white mb-1">
                  {currentStep.title}
                </h4>
                <p className="text-xs text-cyan-300 font-mono mb-3">
                  {currentStep.subtitle}
                </p>

                <p className="text-sm text-slate-200 leading-relaxed font-sans font-medium">
                  &ldquo;{currentStep.speechText}&rdquo;
                </p>

                {/* Sound wave visualizer when speaking */}
                {isPlayingSpeech && (
                  <div className="mt-4 flex items-center gap-1 pt-2 border-t border-slate-800">
                    <div className="w-1 h-4 bg-cyan-400 animate-pulse" />
                    <div className="w-1 h-6 bg-emerald-400 animate-bounce" />
                    <div className="w-1 h-3 bg-cyan-400 animate-pulse" />
                    <div className="w-1 h-5 bg-teal-400 animate-bounce" />
                    <div className="w-1 h-2 bg-emerald-400 animate-pulse" />
                    <span className="text-[11px] font-mono text-cyan-300 ml-2">
                      Voice playing in English aloud...
                    </span>
                  </div>
                )}
              </div>

              {/* Audio Controls Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTogglePlay}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
                      isPlayingSpeech
                        ? 'bg-amber-600 hover:bg-amber-500 text-white'
                        : 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-500/20'
                    }`}
                  >
                    {isPlayingSpeech ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>Pause Speech</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        <span>Speak Aloud in English</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    title="Restart Demo from Step 1"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Speed:</span>
                  <button
                    onClick={() => setSpeechRate(0.9)}
                    className={`px-2 py-1 rounded ${speechRate === 0.9 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-white'}`}
                  >
                    0.9x
                  </button>
                  <button
                    onClick={() => setSpeechRate(1.0)}
                    className={`px-2 py-1 rounded ${speechRate === 1.0 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-white'}`}
                  >
                    1.0x
                  </button>
                  <button
                    onClick={() => setSpeechRate(1.2)}
                    className={`px-2 py-1 rounded ${speechRate === 1.2 ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'hover:text-white'}`}
                  >
                    1.2x
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Demonstration Key Takeaway & Student Presenter Tip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Feature Demonstrated</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.visualHighlight}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>College Evaluator Tip</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentStep.proTip}
              </p>
            </div>
          </div>

          {/* Stepper Navigation Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Presentation Progress</span>
              <span>
                Step {currentStepIndex + 1} / {DEMO_STEPS.length}
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {DEMO_STEPS.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    speakCurrentStep(s.speechText);
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    idx === currentStepIndex
                      ? 'bg-cyan-400 ring-2 ring-cyan-400/50'
                      : idx < currentStepIndex
                        ? 'bg-emerald-500'
                        : 'bg-slate-800'
                  }`}
                  title={`Step ${idx + 1}: ${s.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/90">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIndex === 0}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Exit Demo
            </button>

            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-md transition-all disabled:opacity-40"
            >
              <span>Next Demo Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
