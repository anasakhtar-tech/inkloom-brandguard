import React from 'react';
import { ShieldCheck, UserCheck, Scale, Sparkles, Lock, FileCheck, HelpCircle } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  overallScore: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('studio')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white font-sans">Inkloom BrandGuard</span>
                <span className="px-2 py-0.5 text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full">
                  Team ALTAIR
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full hidden sm:inline">
                  Round 2 Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Intelligent Pre-Publication Brand Governance & Compliance Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTabChange('studio')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              1. Content Studio
            </button>
            <button
              onClick={() => onTabChange('vault')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'vault'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              2. Brand Vault
            </button>
            <button
              onClick={() => onTabChange('review')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              3. Review Hub
            </button>
            <button
              onClick={() => onTabChange('analytics')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              4. Governance Insights
            </button>
            <button
              onClick={() => onTabChange('responsible')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === 'responsible'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              5. Trust & Privacy
            </button>
          </nav>

          {/* Right Section: Role Switcher with Clear Visual Prompts */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] px-2 font-semibold hidden lg:inline">Active Role:</span>
              <button
                onClick={() => onRoleChange('creator')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'creator'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Creator role (Write, Review suggestions & Submit)"
              >
                <span>✍️ Creator</span>
              </button>
              <button
                onClick={() => onRoleChange('reviewer')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'reviewer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Brand Manager role (Inspect & Approve)"
              >
                <span>🔍 Reviewer</span>
              </button>
              <button
                onClick={() => onRoleChange('legal')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'legal'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Legal & Compliance role (Regulatory Sign-off)"
              >
                <span>⚖️ Legal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
