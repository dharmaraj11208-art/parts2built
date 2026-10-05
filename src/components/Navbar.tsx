import React, { useState } from 'react';
import { Cpu, Menu, X, Plus, BookOpen, Bot } from 'lucide-react';

export type NavTab = 'dashboard' | 'inventory' | 'add' | 'projects' | 'recommendations' | 'marketplace';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAddModal: () => void;
  onOpenGuideModal: () => void;
  onOpenArise: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal,
  onOpenGuideModal,
  onOpenArise
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavTab; label: string; highlight?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Available Parts' },
    { id: 'projects', label: 'Reuse Projects' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'marketplace', label: 'Buy / Sell / Rent', highlight: true }
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
                className={`px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-inner'
                    : link.highlight
                    ? 'text-emerald-300 hover:text-white hover:bg-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60'
                }`}
              >
                <span>{link.label}</span>
                {link.highlight && !isActive && (
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 uppercase font-bold">
                    Trade
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions & Status */}
        <div className="flex items-center gap-2 sm:gap-2.5">
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
          </div>
        </div>
      )}
    </header>
  );
};

