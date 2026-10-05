/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ElectronicComponent,
  ReuseProject,
  MonthlyQuotaConfig,
  ThresholdStatus
} from './types';
import {
  INITIAL_COMPONENTS,
  PREDEFINED_PROJECTS,
  INITIAL_QUOTA_CONFIG
} from './data/mockData';
import { getMonthlyDisposalMetrics, findMatchingInventoryComponent } from './utils/calculator';
import { Bot } from 'lucide-react';

// Components
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { AvailableComponentsView } from './components/AvailableComponentsView';
import { ReuseProjectsView } from './components/ReuseProjectsView';
import { RecommendationsView } from './components/RecommendationsView';
import { AddEditComponentModal } from './components/AddEditComponentModal';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { PresentationGuideModal } from './components/PresentationGuideModal';
import { DisposalRecordsModal } from './components/DisposalRecordsModal';
import { DisposalQuotaBarometer } from './components/DisposalQuotaBarometer';
import { AriseAgentDrawer } from './components/AriseAgentDrawer';
import { DoraemonRobotDemonstrator } from './components/DoraemonRobotDemonstrator';

const STORAGE_KEYS = {
  COMPONENTS: 'parts2build_components_v1',
  QUOTA: 'parts2build_quota_v1',
  PROJECTS: 'parts2build_projects_v1'
};

export default function App() {
  // Main state with localStorage persistence
  const [components, setComponents] = useState<ElectronicComponent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMPONENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load components from localStorage', e);
    }
    return INITIAL_COMPONENTS;
  });

  const [projects, setProjects] = useState<ReuseProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load projects from localStorage', e);
    }
    return PREDEFINED_PROJECTS;
  });

  const [quotaConfig, setQuotaConfig] = useState<MonthlyQuotaConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTA);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load quota from localStorage', e);
    }
    return INITIAL_QUOTA_CONFIG;
  });

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals & Drawers state
  const [selectedProject, setSelectedProject] = useState<ReuseProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState<boolean>(false);
  const [isAriseOpen, setIsAriseOpen] = useState<boolean>(false);
  const [isDoraemonOpen, setIsDoraemonOpen] = useState<boolean>(false);
  const [editingComponent, setEditingComponent] = useState<ElectronicComponent | null>(null);

  // Success toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMPONENTS, JSON.stringify(components));
    } catch (e) {
      console.error('Failed to save components', e);
    }
  }, [components]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUOTA, JSON.stringify(quotaConfig));
    } catch (e) {
      console.error('Failed to save quota config', e);
    }
  }, [quotaConfig]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAddGeneratedProject = (newProject: ReuseProject) => {
    setProjects((prev) => [newProject, ...prev]);
    showToast(`ARISE created "${newProject.title}" and saved it to your catalog!`);
  };

  // Monthly Quota Metrics & Global Threshold Status
  const disposalMetrics = getMonthlyDisposalMetrics(quotaConfig);
  const thresholdStatus: ThresholdStatus = disposalMetrics.status;

  // Handlers for Components
  const handleSaveComponent = (
    componentData: Omit<ElectronicComponent, 'id' | 'dateAdded'>,
    editId?: string
  ) => {
    if (editId) {
      setComponents((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, ...componentData }
            : item
        )
      );
      showToast(`Updated "${componentData.name}" in inventory.`);
    } else {
      const newComponent: ElectronicComponent = {
        ...componentData,
        id: `comp-${Date.now()}`,
        dateAdded: new Date().toISOString().split('T')[0]
      };
      setComponents((prev) => [newComponent, ...prev]);
      showToast(`Added "${componentData.name}" (${componentData.quantity} ${componentData.unit}) to inventory.`);
    }
    setEditingComponent(null);
  };

  const handleEditComponent = (comp: ElectronicComponent) => {
    setEditingComponent(comp);
    setIsAddModalOpen(true);
  };

  const handleDeleteComponent = (id: string) => {
    const comp = components.find((c) => c.id === id);
    setComponents((prev) => prev.filter((c) => c.id !== id));
    showToast(`Removed "${comp?.name || 'Item'}" from inventory.`);
  };

  const handleUpdateQuantity = (id: string, newQty: number) => {
    setComponents((prev) =>
      prev.map((c) => (c.id === id ? { ...c, quantity: newQty } : c))
    );
  };

  const handleResetToSampleData = () => {
    setComponents(INITIAL_COMPONENTS);
    setQuotaConfig(INITIAL_QUOTA_CONFIG);
    showToast('Reset inventory and monthly quota to industrial demo samples.');
  };

  // Allocate components for project assembly (deduct inventory)
  const handleAllocateComponentsForProject = (project: ReuseProject) => {
    setComponents((prev) => {
      const updated = [...prev];
      for (const req of project.requiredComponents) {
        const { matchedComponent } = findMatchingInventoryComponent(
          req.componentName,
          req.category,
          updated
        );
        if (matchedComponent) {
          const compIndex = updated.findIndex((c) => c.id === matchedComponent.id);
          if (compIndex !== -1) {
            const newQty = Math.max(0, updated[compIndex].quantity - req.requiredQuantity);
            updated[compIndex] = { ...updated[compIndex], quantity: newQty };
          }
        }
      }
      return updated;
    });

    showToast(`Successfully simulated assembly of "${project.title}"! Required components deducted.`);
  };

  // Border accent matching the safe-to-danger status
  const containerAmbientRing = {
    safe: 'ring-1 ring-emerald-500/20',
    warning: 'ring-1 ring-amber-500/30',
    danger: 'ring-1 ring-rose-500/40'
  }[thresholdStatus];

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${containerAmbientRing}`}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 border border-emerald-500/50 px-4 py-3 text-xs font-mono text-white shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAddModal={() => {
          setEditingComponent(null);
          setIsAddModalOpen(true);
        }}
        onOpenGuideModal={() => setIsGuideModalOpen(true)}
        onOpenArise={() => setIsAriseOpen(true)}
        onOpenDoraemon={() => setIsDoraemonOpen(true)}
        thresholdStatus={thresholdStatus}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            components={components}
            projects={projects}
            quotaConfig={quotaConfig}
            onNavigate={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenAddModal={() => {
              setEditingComponent(null);
              setIsAddModalOpen(true);
            }}
            onOpenGuideModal={() => setIsGuideModalOpen(true)}
            onOpenQuotaModal={() => setIsQuotaModalOpen(true)}
            onOpenArise={() => setIsAriseOpen(true)}
            onOpenDoraemon={() => setIsDoraemonOpen(true)}
          />
        )}

        {activeTab === 'inventory' && (
          <AvailableComponentsView
            components={components}
            onOpenAddModal={() => {
              setEditingComponent(null);
              setIsAddModalOpen(true);
            }}
            onEditComponent={handleEditComponent}
            onDeleteComponent={handleDeleteComponent}
            onUpdateQuantity={handleUpdateQuantity}
            onResetToSampleData={handleResetToSampleData}
            onNavigateToProjects={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'projects' && (
          <ReuseProjectsView
            projects={projects}
            inventory={components}
            onSelectProject={(p) => setSelectedProject(p)}
            onNavigateToRecommendations={() => setActiveTab('recommendations')}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            projects={projects}
            inventory={components}
            onSelectProject={(p) => setSelectedProject(p)}
            onAllocateComponentsForProject={handleAllocateComponentsForProject}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {activeTab === 'quota' && (
          <div className="space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Monthly E-Waste Disposal Quota &amp; Threshold Barometer
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Monitor facility scrap disposal volumes, maintain compliance below safety limits, and analyze month-by-month hazardous e-waste generation.
              </p>
            </div>

            <DisposalQuotaBarometer
              config={quotaConfig}
              onOpenRecordsModal={() => setIsQuotaModalOpen(true)}
              onOpenAddRecordModal={() => setIsQuotaModalOpen(true)}
            />

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Logged Disposal Shipments ({quotaConfig.disposalLogs.length} Records)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Authorized pickups and non-reusable scrap destruction.
                  </p>
                </div>
                <button
                  onClick={() => setIsQuotaModalOpen(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  Manage Logs &amp; Limits
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-[11px] font-semibold text-slate-400 uppercase border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Facility Dept</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4 text-right">Disposed Mass</th>
                      <th className="py-3 px-4">Contractor</th>
                      <th className="py-3 px-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono">
                    {quotaConfig.disposalLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/60">
                        <td className="py-3 px-4 text-slate-300">{log.date}</td>
                        <td className="py-3 px-4 font-sans text-slate-200">{log.facilityDepartment}</td>
                        <td className="py-3 px-4 font-sans text-slate-400">{log.wasteType}</td>
                        <td className="py-3 px-4 text-right text-rose-400 font-bold tabular-nums">
                          {log.weightKg} kg
                        </td>
                        <td className="py-3 px-4 font-sans text-slate-400">{log.disposalContractor}</td>
                        <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        inventory={components}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onNavigateToRecommendations={() => {
          setSelectedProject(null);
          setActiveTab('recommendations');
        }}
      />

      {/* Add / Edit Component Modal */}
      <AddEditComponentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingComponent(null);
        }}
        onSave={handleSaveComponent}
        initialData={editingComponent}
      />

      {/* College Presentation Guide Modal */}
      <PresentationGuideModal
        isOpen={isGuideModalOpen}
        onClose={() => setIsGuideModalOpen(false)}
        onLaunchDoraemonDemo={() => setIsDoraemonOpen(true)}
      />

      {/* Monthly Quota & Logs Modal */}
      <DisposalRecordsModal
        isOpen={isQuotaModalOpen}
        onClose={() => setIsQuotaModalOpen(false)}
        config={quotaConfig}
        onUpdateQuotaConfig={(newConfig) => {
          setQuotaConfig(newConfig);
          showToast('Updated facility monthly disposal quota and logs.');
        }}
      />

      {/* Doraemon AI Robot Cartoon Demonstrator Modal */}
      <DoraemonRobotDemonstrator
        isOpen={isDoraemonOpen}
        onClose={() => setIsDoraemonOpen(false)}
        onNavigateToTab={(t) => setActiveTab(t)}
      />

      {/* ARISE AI Agent Companion Drawer */}
      <AriseAgentDrawer
        isOpen={isAriseOpen}
        onClose={() => setIsAriseOpen(false)}
        inventory={components}
        onAddGeneratedProject={handleAddGeneratedProject}
        onSelectProject={(p) => {
          setIsAriseOpen(false);
          setSelectedProject(p);
        }}
      />

      {/* Floating Doraemon Robot Cartoon Presenter Button */}
      <button
        onClick={() => setIsDoraemonOpen(true)}
        className="fixed bottom-6 right-36 z-30 hidden sm:flex items-center gap-2 rounded-full bg-slate-900/95 border-2 border-cyan-400/80 px-3.5 py-2.5 text-white shadow-2xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all focus:outline-none"
        title="Doraemon AI Robot Demonstration (Speaks in English)"
      >
        <div className="w-6 h-6 rounded-full overflow-hidden border border-cyan-300 shrink-0">
          <img
            src="/src/assets/images/doraemon_ai_robot_1791203744626.jpg"
            alt="Doraemon Robot Cartoon"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="font-['Syne',sans-serif] text-xs font-bold text-cyan-300">
          Robot Demo 🔊
        </span>
      </button>

      {/* Floating ARISE AI Companion Trigger Widget */}
      <button
        onClick={() => setIsAriseOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-4 py-3 text-white shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all focus:outline-none ring-2 ring-emerald-400/40"
        title="Open ARISE - AI IoT Mentor"
      >
        <div className="relative flex h-6 w-6 items-center justify-center">
          <Bot className="h-5 w-5 text-white animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
          </span>
        </div>
        <span className="font-['Syne',sans-serif] text-xs font-bold tracking-wide">
          ARISE AI
        </span>
      </button>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">PARTS 2 BUILD</span>
            <span>·</span>
            <span>Industrial E-Waste Repurposing Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>Monthly Quota: {quotaConfig.monthlyQuotaKg} kg</span>
            <span>·</span>
            <span>Status: <strong className={thresholdStatus === 'safe' ? 'text-emerald-400' : thresholdStatus === 'warning' ? 'text-amber-400' : 'text-rose-400'}>{thresholdStatus.toUpperCase()}</strong></span>
            <span>·</span>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Academic Presentation Guide
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
