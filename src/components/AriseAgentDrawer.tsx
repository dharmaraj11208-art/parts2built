import React, { useState, useRef, useEffect } from 'react';
import { ElectronicComponent, ReuseProject } from '../types';
import { AriseOrbVisualizer, AriseOrbState } from './AriseOrbVisualizer';
import { ariseAudio } from '../utils/audioSynth';
import {
  Bot,
  Send,
  Sparkles,
  X,
  PlusCircle,
  CheckCircle2,
  Cpu,
  Layers,
  Wrench,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  Zap,
  ListTodo,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  FileDown,
  Trash2,
  Calculator,
  Compass,
  ArrowRight,
  Sliders,
  Play,
  Share2,
  AlertTriangle
} from 'lucide-react';

interface AriseMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  generatedProject?: ReuseProject;
  suggestedFollowUps?: string[];
}

interface AriseAgentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  inventory: ElectronicComponent[];
  onAddGeneratedProject: (project: ReuseProject) => void;
  onSelectProject?: (project: ReuseProject) => void;
}

type AriseTab = 'chat' | 'blueprint' | 'tasks' | 'tools';

interface TaskItem {
  id: string;
  text: string;
  category: 'Desolder' | 'Circuit' | 'Firmware' | 'Enclosure';
  completed: boolean;
}

const INITIAL_TASKS: TaskItem[] = [
  { id: 't1', text: 'Desolder components from scrap boards using 30W iron or wick', category: 'Desolder', completed: true },
  { id: 't2', text: 'Test resistor resistance and LED forward polarity with multimeter', category: 'Desolder', completed: true },
  { id: 't3', text: 'Place microcontroller and connect common Ground (GND) rail on breadboard', category: 'Circuit', completed: false },
  { id: 't4', text: 'Wire sensor pins (VCC to 5V, Trig to D9, Echo to D10) with jumper leads', category: 'Circuit', completed: false },
  { id: 't5', text: 'Install 220Ω current-limiting resistors inline with indicator LEDs', category: 'Circuit', completed: false },
  { id: 't6', text: 'Flash C++ Arduino sketch and test serial telemetry at 9600 baud', category: 'Firmware', completed: false },
  { id: 't7', text: 'Fabricate protective enclosure using recycled plastic bottle or acrylic scrap', category: 'Enclosure', completed: false }
];

const QUICK_PROMPTS = [
  '💡 Suggest a creative IoT project with my parts',
  '📋 Step-by-step tasks to build a smart plant monitor',
  '🔌 Pinout & wiring for ultrasonic sensor + Arduino',
  '📱 How can I repurpose an old phone for an IoT CCTV?',
  '⚡ Explain how to calculate LED resistor values'
];

export const AriseAgentDrawer: React.FC<AriseAgentDrawerProps> = ({
  isOpen,
  onClose,
  inventory,
  onAddGeneratedProject,
  onSelectProject
}) => {
  // Navigation inside ARISE
  const [activeTab, setActiveTab] = useState<AriseTab>('chat');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [orbState, setOrbState] = useState<AriseOrbState>('idle');
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(false);
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(true);

  // Chat state
  const [messages, setMessages] = useState<AriseMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `### ⚡ Hey friend! I'm ARISE!

I'm your intelligent **AI Hardware & IoT Companion** on **PARTS 2 BUILD**. Think of me as your collaborative workshop partner, here to transform industrial e-waste scrap into functioning IoT creations!

Here is what we can do together:
- 💡 **Invent Custom IoT Projects** dynamically matched to your **${inventory.length} available inventory items**.
- 📋 **Break down hardware builds into concrete micro-tasks** in the **Tasks** tab.
- ⚡ **Calculate resistor values & voltage drops** in the **Tools** tab.
- 🚀 **Design ready-to-build blueprints** that save directly into your platform catalog!

Ask me anything about circuit wiring, IoT code, or select a prompt below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        '💡 What can I build with an Arduino and Ultrasonic sensor?',
        '⚡ How do I safely desolder components from old PCBs?',
        '📋 Generate tasks for an IoT plant monitor'
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [addedProjectIds, setAddedProjectIds] = useState<string[]>([]);

  // Blueprint Studio Customizer State
  const [bpTargetController, setBpTargetController] = useState('Arduino Uno Rev3');
  const [bpSensorFocus, setBpSensorFocus] = useState('HC-SR04 Ultrasonic Distance');
  const [bpConnectivity, setBpConnectivity] = useState('WiFi Web Server / MQTT');
  const [bpProjectGoal, setBpProjectGoal] = useState('Smart Workshop Security & Safety Monitor');
  const [isGeneratingBlueprint, setIsGeneratingBlueprint] = useState(false);

  // Interactive Task Tracker State
  const [taskList, setTaskList] = useState<TaskItem[]>(INITIAL_TASKS);
  const [newTaskInput, setNewTaskInput] = useState('');

  // Ohm's Law Calculator State
  const [supplyVoltage, setSupplyVoltage] = useState<number>(5.0);
  const [ledForwardVoltage, setLedForwardVoltage] = useState<number>(2.0); // e.g. Red LED
  const [targetCurrentMA, setTargetCurrentMA] = useState<number>(20); // 20mA

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    ariseAudio.voiceEnabled = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    ariseAudio.sfxEnabled = sfxEnabled;
  }, [sfxEnabled]);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, activeTab]);

  if (!isOpen) return null;

  // Send message to backend
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    ariseAudio.playChime('send');

    const userMsg: AriseMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);
    setOrbState('thinking');

    try {
      const response = await fetch('/api/arise/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          inventory: inventory.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            category: i.category
          }))
        })
      });

      const data = await response.json();
      const replyText = data.reply || "I'm ready! What hardware shall we engineer next?";

      ariseAudio.playChime('receive');
      setOrbState('speaking');

      // Determine contextual follow-ups
      const followUps: string[] = [];
      if (replyText.toLowerCase().includes('task') || replyText.toLowerCase().includes('step')) {
        followUps.push('📋 Add these steps to my Task Master checklist', '🔌 Show me the circuit schematic wiring');
      } else if (replyText.toLowerCase().includes('arduino') || replyText.toLowerCase().includes('sensor')) {
        followUps.push('⚡ What Arduino sketch code do I need?', '🛡️ Are there any voltage or safety warnings?');
      } else {
        followUps.push('💡 Show another creative IoT project idea', '📋 Step-by-step build tasks');
      }

      const assistantMsg: AriseMessage = {
        id: `arise-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: followUps
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Voice read-out if enabled
      if (voiceEnabled) {
        ariseAudio.speak(replyText, () => setOrbState('idle'));
      } else {
        setTimeout(() => setOrbState('idle'), 1400);
      }
    } catch (err) {
      console.error('Failed to communicate with ARISE:', err);
      setOrbState('idle');
      const fallbackMsg: AriseMessage = {
        id: `arise-err-${Date.now()}`,
        role: 'assistant',
        content: `I'm right here with you! You currently have **${inventory.length} component types** logged in your inventory. Try asking me for an IoT soil monitor or autonomous robot guide!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate complete IoT project blueprint
  const handleGenerateBlueprint = async () => {
    setIsGeneratingBlueprint(true);
    setOrbState('thinking');
    ariseAudio.playChime('send');

    const topic = `${bpProjectGoal} with ${bpTargetController}, ${bpSensorFocus}, and ${bpConnectivity}`;

    try {
      const response = await fetch('/api/arise/generate-iot-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          inventory: inventory.map((i) => ({
            name: i.name,
            quantity: i.quantity,
            unit: i.unit,
            category: i.category
          }))
        })
      });

      const data = await response.json();
      if (data.project) {
        ariseAudio.playChime('success');
        setOrbState('speaking');

        // Automatically add generated assembly steps to Task Master
        if (data.project.assemblySteps && data.project.assemblySteps.length > 0) {
          const newTasks: TaskItem[] = data.project.assemblySteps.map((st: any, idx: number) => ({
            id: `gen-task-${Date.now()}-${idx}`,
            text: `${st.title}: ${st.description.slice(0, 80)}...`,
            category: idx === 0 ? 'Desolder' : idx === 1 ? 'Circuit' : idx === 2 ? 'Firmware' : 'Enclosure',
            completed: false
          }));
          setTaskList((prev) => [...newTasks, ...prev]);
        }

        const assistantMsg: AriseMessage = {
          id: `arise-proj-${Date.now()}`,
          role: 'assistant',
          content: `### 🚀 Custom Blueprint Ready: ${data.project.title}\n\n*${data.project.tagline}*\n\n- **Target Hardware:** ${bpTargetController} · **Sensor:** ${bpSensorFocus}\n- **Difficulty:** ${data.project.difficulty} · **Est. Build Time:** ${data.project.estimatedBuildTimeMinutes} mins\n- **Circuit Architecture:** \`${data.project.schematicSummary}\`\n\nI have automatically synchronized the assembly steps to your **Tasks** tab, and you can add this blueprint directly to your platform catalog!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          generatedProject: data.project,
          suggestedFollowUps: [
            '📋 Review the assembly checklist in the Tasks tab',
            '⚡ Show me the C++ code for this project'
          ]
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setActiveTab('chat');
        setTimeout(() => setOrbState('idle'), 1500);
      }
    } catch (err) {
      console.error('Failed to generate blueprint:', err);
      setOrbState('idle');
    } finally {
      setIsGeneratingBlueprint(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    ariseAudio.playChime('receive');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddProject = (project: ReuseProject) => {
    onAddGeneratedProject(project);
    setAddedProjectIds((prev) => [...prev, project.id]);
    ariseAudio.playChime('success');
  };

  const handleToggleTask = (id: string) => {
    setTaskList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
    ariseAudio.playChime('receive');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      text: newTaskInput.trim(),
      category: 'Circuit',
      completed: false
    };

    setTaskList((prev) => [newTask, ...prev]);
    setNewTaskInput('');
    ariseAudio.playChime('send');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `### ⚡ Chat Reset! Ready for your next IoT build!
What component or IoT project shall we tackle next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleExportChat = () => {
    const markdownContent = messages
      .map((m) => `### ${m.role === 'user' ? '👤 Maker' : '⚡ ARISE AI'} (${m.timestamp})\n\n${m.content}\n\n---\n`)
      .join('\n');

    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ARISE_IoT_Session_${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Ohm's law calculation: R = (Vs - Vf) / I
  const voltageDrop = Math.max(0, supplyVoltage - ledForwardVoltage);
  const targetCurrentA = targetCurrentMA / 1000;
  const calculatedResistorOhms = targetCurrentA > 0 ? Math.round(voltageDrop / targetCurrentA) : 0;
  const powerDissipationWatts = (voltageDrop * targetCurrentA).toFixed(3);

  // Task completion progress
  const completedTaskCount = taskList.filter((t) => t.completed).length;
  const taskProgressPercent = taskList.length > 0 ? Math.round((completedTaskCount / taskList.length) * 100) : 0;

  return (
    <div
      className={`fixed inset-0 z-50 flex ${
        isExpanded ? 'items-center justify-center p-3 sm:p-6' : 'justify-end'
      } bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200`}
    >
      <div
        className={`relative flex flex-col bg-slate-900 border border-slate-800 shadow-2xl transition-all duration-300 ${
          isExpanded
            ? 'w-full max-w-5xl h-[92vh] rounded-2xl overflow-hidden'
            : 'w-full max-w-xl h-full border-l'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-3">
            {/* Animated Hologram Core Orb */}
            <AriseOrbVisualizer state={orbState} size={44} />

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Syne',sans-serif] text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                  <span>ARISE</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    AI IOT MENTOR
                  </span>
                </h3>
              </div>
              <p className="text-[11px] text-slate-400">
                Adaptive Reuse &amp; IoT Systems Expert · Workshop Companion
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5">
            {/* Voice Speech Toggle */}
            <button
              onClick={() => {
                const nextVal = !voiceEnabled;
                setVoiceEnabled(nextVal);
                if (!nextVal) ariseAudio.stopSpeaking();
              }}
              className={`p-2 rounded-lg text-xs transition-colors ${
                voiceEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
              title={voiceEnabled ? 'Voice read-out: ON (Click to mute)' : 'Voice read-out: OFF (Click to unmute)'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Expand / Minimize toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors hidden sm:inline-flex"
              title={isExpanded ? 'Collapse to Side Drawer' : 'Expand to Studio Workshop Mode'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs Strip */}
        <div className="flex items-center justify-between px-5 bg-slate-950/70 border-b border-slate-800/80 text-xs">
          <div className="flex items-center gap-1 py-1.5 overflow-x-auto">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'chat'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>IoT Mentor Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('blueprint')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'blueprint'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Blueprint Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5 text-amber-400" />
              <span>Task Master ({taskProgressPercent}%)</span>
            </button>

            <button
              onClick={() => setActiveTab('tools')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                activeTab === 'tools'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-teal-400" />
              <span>Pinouts &amp; Ohm's Law</span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>Inventory: <strong className="text-emerald-400">{inventory.length} SKUs</strong></span>
          </div>
        </div>

        {/* TAB 1: Chat & Mentor */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0 bg-slate-900/60">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400 px-1">
                    {msg.role === 'assistant' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" /> ARISE
                      </span>
                    ) : (
                      <span>You</span>
                    )}
                    <span>·</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative max-w-[94%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-3 shadow-md'
                    }`}
                  >
                    <div className="whitespace-pre-wrap font-sans text-xs space-y-2">
                      {msg.content}
                    </div>

                    {/* Generated Blueprint Card */}
                    {msg.generatedProject && (
                      <div className="mt-3 p-4 rounded-xl border border-emerald-500/40 bg-slate-900/90 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                            Bill of Materials ({msg.generatedProject.requiredComponents.length} parts)
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ~{msg.generatedProject.estimatedBuildTimeMinutes} mins
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {msg.generatedProject.requiredComponents.map((req, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
                            >
                              {req.requiredQuantity}x {req.componentName.split(' ')[0]}
                            </span>
                          ))}
                        </div>

                        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                          <button
                            onClick={() => onSelectProject && onSelectProject(msg.generatedProject!)}
                            className="text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1"
                          >
                            <span>Inspect Full Schematics</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleAddProject(msg.generatedProject!)}
                            disabled={addedProjectIds.includes(msg.generatedProject.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                              addedProjectIds.includes(msg.generatedProject.id)
                                ? 'bg-slate-800 text-emerald-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                            }`}
                          >
                            {addedProjectIds.includes(msg.generatedProject.id) ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Saved in Catalog</span>
                              </>
                            ) : (
                              <>
                                <PlusCircle className="w-3.5 h-3.5" />
                                <span>Save into Catalog</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Follow-up suggestions */}
                    {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                      <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                          Suggested next steps:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {msg.suggestedFollowUps.map((suggestion, sIdx) => (
                            <button
                              key={sIdx}
                              onClick={() => handleSendMessage(suggestion)}
                              className="text-left text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 hover:text-emerald-300 border border-slate-800 transition-colors"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Copy and speak buttons */}
                    {msg.role === 'assistant' && (
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
                        <button
                          onClick={() => ariseAudio.speak(msg.content)}
                          className="hover:text-emerald-400 flex items-center gap-1"
                          title="Read this response aloud"
                        >
                          <Play className="w-3 h-3" />
                          <span>Speak Aloud</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.content)}
                          className="hover:text-slate-200 flex items-center gap-1"
                          title="Copy text"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2.5 text-xs font-mono text-emerald-400 bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl w-fit">
                  <AriseOrbVisualizer state="thinking" size={28} />
                  <span>ARISE is calculating hardware parameters...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-5 py-2.5 bg-slate-950/80 border-t border-slate-800/80 overflow-x-auto">
              <div className="flex gap-2 text-xs whitespace-nowrap">
                {QUICK_PROMPTS.map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] transition-colors shrink-0"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input & Action Bar */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask ARISE: 'How do I wire this motor?' or 'Give me an IoT idea'..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-40 text-white transition-all shadow-md shadow-emerald-500/10"
                  title="Send message to ARISE"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <div className="flex items-center gap-3">
                  <button onClick={handleClearChat} className="hover:text-slate-400 flex items-center gap-1">
                    <Trash2 className="w-3 h-3" />
                    <span>Clear Chat</span>
                  </button>
                  <button onClick={handleExportChat} className="hover:text-slate-400 flex items-center gap-1">
                    <FileDown className="w-3 h-3" />
                    <span>Export (.md)</span>
                  </button>
                </div>
                <span>Gemini 3.8 Flash Engine</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Blueprint Studio */}
        {activeTab === 'blueprint' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40">
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-cyan-400">
                <Zap className="w-4 h-4" />
                <span>ARISE Parametric IoT Blueprint Studio</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Engineer a Custom IoT Project from Salvaged Parts
              </h4>
              <p className="text-xs text-slate-400">
                Select your microcontroller target, key sensor, and telemetry protocol. ARISE will synthesize a complete hardware BOM, circuit architecture, and task list.
              </p>
            </div>

            {/* Customizer Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Microcontroller / Core
                </label>
                <select
                  value={bpTargetController}
                  onChange={(e) => setBpTargetController(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Arduino Uno Rev3 (ATmega328P)">Arduino Uno Rev3 (ATmega328P)</option>
                  <option value="ESP32 (WiFi + BLE Dual-Core)">ESP32 (WiFi + Bluetooth BLE)</option>
                  <option value="Raspberry Pi Pico (RP2040)">Raspberry Pi Pico (RP2040)</option>
                  <option value="Salvaged Android Phone Host">Salvaged Android Phone Host (IP Webcam/Host)</option>
                  <option value="ATtiny85 Ultra Low-Power">ATtiny85 Ultra Low-Power 8-Pin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Primary Sensor / Transducer
                </label>
                <select
                  value={bpSensorFocus}
                  onChange={(e) => setBpSensorFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="HC-SR04 Ultrasonic Distance Sensor">HC-SR04 Ultrasonic Distance Sensor</option>
                  <option value="Analog Soil Moisture Probe">Analog Soil Moisture Probe</option>
                  <option value="LDR Light-Dependent Resistor">LDR Light-Dependent Resistor</option>
                  <option value="PIR Pyroelectric Motion Sensor">PIR Pyroelectric Motion Sensor</option>
                  <option value="DC Geared Motor Impeller / Tachometer">DC Geared Motor Impeller / Tachometer</option>
                  <option value="Vibration & Tilt Switch">Vibration &amp; Tilt Switch</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  IoT Connectivity &amp; Telemetry
                </label>
                <select
                  value={bpConnectivity}
                  onChange={(e) => setBpConnectivity(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="WiFi Web Server / MQTT Telemetry">WiFi Web Server / MQTT Telemetry</option>
                  <option value="Blynk IoT Mobile Dashboard">Blynk IoT Mobile Dashboard</option>
                  <option value="Bluetooth Serial BLE to Smartphone">Bluetooth Serial BLE to Smartphone</option>
                  <option value="USB Serial Stream to PC Dashboard">USB Serial Stream to PC Dashboard</option>
                  <option value="Standalone Autonomous LED/Buzzer Beacon">Standalone Autonomous LED/Buzzer Beacon</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Application Goal / Use Case
                </label>
                <input
                  type="text"
                  value={bpProjectGoal}
                  onChange={(e) => setBpProjectGoal(e.target.value)}
                  placeholder="e.g. Smart Plant Irrigation, Anti-Intruder Laser, Desk Fan"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateBlueprint}
              disabled={isGeneratingBlueprint}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
            >
              {isGeneratingBlueprint ? (
                <>
                  <AriseOrbVisualizer state="thinking" size={24} />
                  <span>Synthesizing IoT Blueprint &amp; Code...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Complete IoT Blueprint Now</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* TAB 3: Interactive Task Master */}
        {activeTab === 'tasks' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-900/40">
            {/* Progress header */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ListTodo className="w-4 h-4 text-amber-400" />
                  <span>Hardware Build Progress</span>
                </span>
                <span className="font-mono text-emerald-400 font-bold">
                  {completedTaskCount} / {taskList.length} Completed ({taskProgressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-300"
                  style={{ width: `${taskProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Add custom task form */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add custom hardware step (e.g., 'Solder female header pins')..."
                className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
              >
                + Add Task
              </button>
            </form>

            {/* Task list */}
            <div className="space-y-2">
              {taskList.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    task.completed
                      ? 'border-emerald-500/30 bg-emerald-500/5 text-slate-400'
                      : 'border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 hover:border-emerald-400" />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <span className={task.completed ? 'line-through text-slate-500' : 'text-slate-200'}>
                      {task.text}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Pinouts & Ohm's Calculator */}
        {activeTab === 'tools' && (
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-900/40">
            {/* Live Ohm's Law & LED Resistor Calculator */}
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-slate-950/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Calculator className="w-4 h-4" />
                  <span>Interactive LED Current-Limiter Calculator</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">Ohm's Law: R = (Vs - Vf) / I</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Supply Voltage Vs (Volts)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={supplyVoltage}
                    onChange={(e) => setSupplyVoltage(parseFloat(e.target.value) || 5.0)}
                    className="w-full px-3 py-1.5 font-mono bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">e.g. 5.0V USB / Arduino</span>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">LED Forward Voltage Vf (Volts)</label>
                  <select
                    value={ledForwardVoltage}
                    onChange={(e) => setLedForwardVoltage(parseFloat(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                  >
                    <option value={2.0}>Red LED (2.0V)</option>
                    <option value={2.1}>Yellow / Amber (2.1V)</option>
                    <option value={3.0}>Green LED (3.0V)</option>
                    <option value={3.2}>Blue / White LED (3.2V)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Target Current (mA)</label>
                  <input
                    type="number"
                    value={targetCurrentMA}
                    onChange={(e) => setTargetCurrentMA(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-1.5 font-mono bg-slate-900 border border-slate-800 rounded-lg text-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Standard safe: 15-20 mA</span>
                </div>
              </div>

              {/* Calculated Result Card */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between font-mono text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Recommended Resistor</span>
                  <span className="text-lg font-bold text-emerald-400 tabular-nums">
                    {calculatedResistorOhms} &Omega; (nearest standard: 220&Omega; / 330&Omega;)
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Power Dissipation</span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {powerDissipationWatts} W (use 1/4 Watt resistor)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Pinouts Grid */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>Common E-Waste Component Pinouts</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-emerald-400 font-bold block font-sans">HC-SR04 Ultrasonic Sensor</span>
                  <p className="text-slate-400 text-[11px]">Pin 1: VCC (5V DC)</p>
                  <p className="text-slate-400 text-[11px]">Pin 2: Trig (10&mu;s pulse input)</p>
                  <p className="text-slate-400 text-[11px]">Pin 3: Echo (pulse width return)</p>
                  <p className="text-slate-400 text-[11px]">Pin 4: GND (0V)</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-cyan-400 font-bold block font-sans">USB 2.0 A-Type Cable Conductors</span>
                  <p className="text-rose-400 text-[11px]">Red Wire: +5V Power Supply</p>
                  <p className="text-slate-400 text-[11px]">Black Wire: Ground (GND)</p>
                  <p className="text-emerald-400 text-[11px]">Green Wire: Data+ (D+)</p>
                  <p className="text-slate-400 text-[11px]">White Wire: Data- (D-)</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-amber-400 font-bold block font-sans">Resistor Color Code (220&Omega; &amp; 1k&Omega;)</span>
                  <p className="text-slate-300 text-[11px]">220&Omega;: Red (2) - Red (2) - Brown (&times;10) - Gold (5%)</p>
                  <p className="text-slate-300 text-[11px]">1k&Omega;: Brown (1) - Black (0) - Red (&times;100) - Gold (5%)</p>
                  <p className="text-slate-300 text-[11px]">10k&Omega;: Brown (1) - Black (0) - Orange (&times;1000) - Gold</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/80 space-y-1">
                  <span className="text-teal-400 font-bold block font-sans">5mm High-Intensity LED</span>
                  <p className="text-slate-300 text-[11px]">Long Lead = Anode (+ Positive)</p>
                  <p className="text-slate-300 text-[11px]">Short Lead &amp; Flat Notch = Cathode (- Ground)</p>
                  <p className="text-slate-400 text-[11px]">Max Continuous Current: 25mA</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
