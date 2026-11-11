import React from 'react';
import { ShieldCheck, UserCheck, Scale, Sparkles, Lock, FileCheck, HelpCircle } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenWelcome?: () => void;
  overallScore?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenWelcome
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[4.25rem] py-1 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title (Protected against shrinking and wrapping) */}
          <div 
            className="flex items-center space-x-3 flex-shrink-0 cursor-pointer select-none" 
            onClick={() => onTabChange('studio')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white font-sans whitespace-nowrap">
                  Inkloom BrandGuard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-nowrap hidden md:block">
                Intelligent Pre-Publication Brand Governance & Compliance Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex-shrink-0">
            <button
              onClick={() => onTabChange('studio')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'studio'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              1. Studio
            </button>
            <button
              onClick={() => onTabChange('vault')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'vault'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              2. Brand Vault
            </button>
            <button
              onClick={() => onTabChange('review')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'review'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              3. Review Hub
            </button>
            <button
              onClick={() => onTabChange('analytics')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              4. Analytics
            </button>
            <button
              onClick={() => onTabChange('responsible')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                activeTab === 'responsible'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              5. Privacy
            </button>
          </nav>

          {/* Right Section: Role Switcher */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="text-slate-400 text-[11px] px-1.5 font-semibold hidden xl:inline">Role:</span>
              <button
                onClick={() => onRoleChange('creator')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentRole === 'creator'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Creator role"
              >
                <span>✍️ Creator</span>
              </button>
              <button
                onClick={() => onRoleChange('reviewer')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentRole === 'reviewer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Reviewer role"
              >
                <span>🔍 Reviewer</span>
              </button>
              <button
                onClick={() => onRoleChange('legal')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium transition-all whitespace-nowrap ${
                  currentRole === 'legal'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Switch to Legal role"
              >
                <span>⚖️ Legal</span>
              </button>
            </div>

            {onOpenWelcome && (
              <button
                onClick={onOpenWelcome}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all text-xs font-medium"
                title="About Inkloom BrandGuard"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">About</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Sub-Bar (Visible on small & medium screens so tabs are always accessible) */}
        <div className="lg:hidden flex items-center justify-between pb-2 pt-1 border-t border-slate-800/60 overflow-x-auto space-x-1 text-xs">
          <button
            onClick={() => onTabChange('studio')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'studio' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            1. Studio
          </button>
          <button
            onClick={() => onTabChange('vault')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'vault' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            2. Vault
          </button>
          <button
            onClick={() => onTabChange('review')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'review' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            3. Review Hub
          </button>
          <button
            onClick={() => onTabChange('analytics')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            4. Analytics
          </button>
          <button
            onClick={() => onTabChange('responsible')}
            className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'responsible' ? 'bg-blue-600 text-white' : 'text-slate-400'
            }`}
          >
            5. Privacy
          </button>
        </div>

      </div>
    </header>
  );
};
