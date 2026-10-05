import React, { useState } from 'react';
import { ThresholdStatus } from '../types';
import { Cpu, Menu, X, Plus, BookOpen, ShieldCheck, AlertTriangle, ShieldAlert, Bot, Sparkles } from 'lucide-react';

export type NavTab = 'dashboard' | 'inventory' | 'add' | 'projects' | 'recommendations' | 'quota';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onOpenArise: () => void;
  onOpenDoraemon: () => void;
  thresholdStatus: ThresholdStatus;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  onOpenGuideModal,
  onOpenArise,
  onOpenDoraemon,
  thresholdStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const statusIndicator = {
    safe: {
      color: 'text-emerald-400',
      dotColor: 'bg-emerald-500',
      text: 'Safe Disposal Rate',
      icon: ShieldCheck
    },
    warning: {
      color: 'text-amber-400',
      dotColor: 'bg-amber-500',
      text: 'Caution Limit',
      icon: AlertTriangle
    },
    danger: {
      color: 'text-rose-400',
      dotColor: 'bg-rose-500',
      text: 'Danger Threshold',
      icon: ShieldAlert
    }
  }[thresholdStatus];

  const StatusIcon = statusIndicator.icon;

  const navLinks: { id: NavTab; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Available Parts' },
    { id: 'projects', label: 'Reuse Projects' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'quota', label: 'Disposal Quota' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectTab('dashboard')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Cpu className="h-5 w-5" />
            </div>
            <span className="font-['Syne',sans-serif] text-lg font-bold tracking-tight text-white group-hover:text-emerald-300 transition-colors">
              PARTS 2 BUILD
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Doraemon AI Robot Demo Button */}
          <button
            onClick={onOpenDoraemon}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all focus:outline-none"
            title="Doraemon AI Robot Demonstration (Speaks English)"
          >
            <span className="text-sm leading-none">🤖</span>
            <span className="font-mono">Robot Demo</span>
            <span className="hidden xl:inline text-[10px] text-cyan-400">· Speaks EN</span>
          </button>

          {/* ARISE AI Agent Button */}
          <button
            onClick={onOpenArise}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-emerald-500/20 text-emerald-300 hover:text-white border border-emerald-500/40 hover:border-emerald-400 shadow-sm transition-all focus:outline-none"
            title="Chat with ARISE - AI IoT Mentor"
          >
            <Bot className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span className="font-mono tracking-wide">ARISE AI</span>
            <span className="hidden xl:inline text-[10px] text-emerald-400/80">· IoT Friend</span>
          </button>

          {/* Facility Status Indicator Pill */}
          <button
            onClick={() => onSelectTab('quota')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors"
            title="Click to view facility disposal monitor"
          >
            <span className={`w-2 h-2 rounded-full ${statusIndicator.dotColor} animate-pulse`} />
            <StatusIcon className={`w-3 h-3 ${statusIndicator.color}`} />
            <span className="font-mono text-slate-300 text-[11px]">{statusIndicator.text}</span>
          </button>

          {/* Student Presentation Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors"
            title="Open College Presentation Guide & Project Roadmap"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guide & Roadmap</span>
          </button>

          {/* Add Component Action */}
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Component</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950 px-4 py-3 space-y-2">
          {/* Mobile Doraemon Trigger */}
          <button
            onClick={() => {
              onOpenDoraemon();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
          >
            <span className="flex items-center gap-2">
              <span className="text-base leading-none">🤖</span>
              <span>Doraemon AI Robot Demo (English Voice)</span>
            </span>
            <span className="text-[10px] font-mono text-cyan-400">Play &rarr;</span>
          </button>

          {/* Mobile ARISE Trigger */}
          <button
            onClick={() => {
              onOpenArise();
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 text-emerald-300"
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>ARISE AI IoT Companion</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-400">Launch &rarr;</span>
          </button>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                onSelectTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                activeTab === link.id
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenGuideModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:text-white bg-slate-900 rounded-lg"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>College Presentation Guide & Roadmap</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('quota');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between px-3 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800"
            >
              <span className="text-slate-400">Monthly Facility Status:</span>
              <span className={`font-semibold flex items-center gap-1.5 ${statusIndicator.color}`}>
                <span className={`w-2 h-2 rounded-full ${statusIndicator.dotColor}`} />
                {statusIndicator.text}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

