/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ElectronicComponent,
  ReuseProject
} from './types';
import {
  INITIAL_COMPONENTS,
  PREDEFINED_PROJECTS
} from './data/mockData';
import { findMatchingInventoryComponent } from './utils/calculator';
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
import { AriseAgentDrawer } from './components/AriseAgentDrawer';

const STORAGE_KEYS = {
  COMPONENTS: 'parts2build_components_v1',
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

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals & Drawers state
  const [selectedProject, setSelectedProject] = useState<ReuseProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isAriseOpen, setIsAriseOpen] = useState<boolean>(false);
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
    showToast('Reset inventory to industrial demo samples.');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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
      />

      {/* Main Content Viewport */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            components={components}
            projects={projects}
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
            onOpenArise={() => setIsAriseOpen(true)}
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
            <span>Empowering sustainable electronic component reuse</span>
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
