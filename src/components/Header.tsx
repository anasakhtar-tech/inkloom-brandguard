import React from 'react';
import { 
  ShieldCheck, 
  HelpCircle,
  Compass,
  FileText,
  Globe,
  Palette,
  GitBranch,
  Database,
  Users,
  BarChart3,
  Lock
} from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenWelcome?: () => void;
  overallScore?: number;
  onToggleTour?: () => void;
  isTourActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenWelcome,
  onToggleTour,
  isTourActive
}) => {
  const navTabs = [
    { id: 'studio', label: 'Studio', icon: FileText, desc: 'Real-Time Content Studio & Diff' },
    { id: 'extension', label: 'Extension', icon: Globe, desc: 'In-Situ Browser Extension Simulator' },
    { id: 'visual', label: 'Visual', icon: Palette, desc: 'Multimodal Brand & Visual Inspector' },
    { id: 'cicd', label: 'CI/CD', icon: GitBranch, desc: 'Enterprise Release & Webhook Gate' },
    { id: 'vault', label: 'Vault', icon: Database, desc: 'Brand Vault & Governing Policies' },
    { id: 'review', label: 'Review', icon: Users, desc: 'Multi-Stakeholder Sign-Off Queue' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, desc: 'Compliance & Governance Intelligence' },
    { id: 'responsible', label: 'Privacy', icon: Lock, desc: 'Confidentiality & PII Scrubber' }
  ];

  return (
    <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-xl w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[3.75rem] sm:min-h-[4.25rem] py-1.5 gap-2 sm:gap-4">
          
          {/* Brand Logo & Title */}
          <div 
            className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0 cursor-pointer select-none group" 
            onClick={() => onTabChange('studio')}
            title="Go to Content Studio"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-md shadow-blue-500/20 flex-shrink-0 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>

            <div className="flex flex-col justify-center">
              <div className="flex items-center space-x-2">
                <span className="text-sm sm:text-base md:text-lg font-black tracking-tight text-white font-sans whitespace-nowrap">
                  Inkloom BrandGuard
                </span>
              </div>
              <p className="text-[11px] text-slate-400 whitespace-nowrap hidden md:block">
                Intelligent Pre-Publication Brand Governance Platform
              </p>
            </div>
          </div>

          {/* Modern Desktop Navigation Tabs (Clean, Icon-Driven, No Numbers) */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 shadow-inner flex-shrink-0">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  title={tab.desc}
                  className={`group relative flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/90'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${
                    isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Section: Role Switcher & About Modal */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
            <div className="flex items-center bg-slate-950/80 p-1 rounded-2xl border border-slate-800 text-xs shadow-inner">
              <span className="text-slate-500 text-[11px] px-1.5 font-semibold hidden xl:inline">Role:</span>
              <button
                onClick={() => onRoleChange('creator')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                  currentRole === 'creator'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Switch to Creator role (Drafting & Applying Suggestions)"
              >
                <span>✍️</span>
                <span className="hidden sm:inline">Creator</span>
              </button>
              <button
                onClick={() => onRoleChange('reviewer')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                  currentRole === 'reviewer'
                    ? 'bg-indigo-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Switch to Reviewer role (Brand Consistency Sign-Off)"
              >
                <span>🔍</span>
                <span className="hidden sm:inline">Reviewer</span>
              </button>
              <button
                onClick={() => onRoleChange('legal')}
                className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-xl font-medium transition-all whitespace-nowrap ${
                  currentRole === 'legal'
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
                title="Switch to Legal role (Regulatory & Overrides)"
              >
                <span>⚖️</span>
                <span className="hidden sm:inline">Legal</span>
              </button>
            </div>

            {onToggleTour && (
              <button
                onClick={onToggleTour}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-semibold shadow-inner ${
                  isTourActive
                    ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 ring-1 ring-blue-500/30'
                    : 'bg-slate-950/80 border-slate-800 text-amber-400 hover:text-white hover:bg-slate-900'
                }`}
                title="Toggle Guided Demo Tour"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Tour</span>
              </button>
            )}

            {onOpenWelcome && (
              <button
                onClick={onOpenWelcome}
                className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-all text-xs font-semibold shadow-inner"
                title="About Inkloom BrandGuard"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">About</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile & Tablet Navigation Sub-Bar (Smooth horizontal scroll, Icons, No Numbers) */}
        <div className="xl:hidden flex items-center pb-2.5 pt-1.5 border-t border-slate-800/60 overflow-x-auto space-x-1.5 text-xs no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 font-bold'
                    : 'text-slate-400 bg-slate-950/70 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
