import React, { useState } from 'react';
import { 
  Compass, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  ChevronRight, 
  Minimize2, 
  Maximize2,
  FileText,
  Palette,
  Globe,
  GitBranch,
  Users,
  BarChart3
} from 'lucide-react';

interface GuidedTourBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  tab: string;
  stepNumber: number;
  totalSteps: number;
  title: string;
  oneLiner: string;
  actionPrompt: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const GuidedTourBar: React.FC<GuidedTourBarProps> = ({
  activeTab,
  onTabChange,
  isOpen,
  onClose
}) => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const tourSteps: TourStep[] = [
    {
      tab: 'studio',
      stepNumber: 1,
      totalSteps: 6,
      title: 'Content Studio',
      oneLiner: 'Real-time text audit engine with 1-click context-preserving rewrites.',
      actionPrompt: 'Click "Apply All Fixes" and toggle "Diff" to see side-by-side revisions.',
      icon: FileText
    },
    {
      tab: 'visual',
      stepNumber: 2,
      totalSteps: 6,
      title: 'Visual Brand Inspector',
      oneLiner: 'HTML5 canvas computer vision inspecting clearspace, aspect ratio, and contrast.',
      actionPrompt: 'Click "Auto-Conform" to watch the canvas mathematically restore approved brand parameters.',
      icon: Palette
    },
    {
      tab: 'extension',
      stepNumber: 3,
      totalSteps: 6,
      title: 'In-Situ Browser Extension',
      oneLiner: 'Live ambient DOM simulator for Google Docs, Notion, and LinkedIn.',
      actionPrompt: 'Type in the live DOM sandbox to watch the floating pill flag violations in under 2ms.',
      icon: Globe
    },
    {
      tab: 'cicd',
      stepNumber: 4,
      totalSteps: 6,
      title: 'Enterprise CI/CD Gatekeeper',
      oneLiner: 'Pre-commit release blocker with Exit Codes (0, 1, 2) & cryptographic HMAC tokens.',
      actionPrompt: 'Click "Run CI/CD Audit" on PR #412 to test Exit Code 1 blocking, then test Legal Override.',
      icon: GitBranch
    },
    {
      tab: 'review',
      stepNumber: 5,
      totalSteps: 6,
      title: 'Multi-Stakeholder Review Hub',
      oneLiner: 'Collaborative sign-off queue for Creators, Brand Managers, and Legal.',
      actionPrompt: 'Switch role to Marcus (Legal), approve draft, and click "Certificate" to view cryptographic credentials.',
      icon: Users
    },
    {
      tab: 'analytics',
      stepNumber: 6,
      totalSteps: 6,
      title: 'Governance ROI Intelligence',
      oneLiner: 'Measures turnaround acceleration (-78%), $426k+ avoided liability, and policy disputes.',
      actionPrompt: 'Click "Publish Clarification" on Rule CLAIM-01 or click "Export Report" for executive briefing.',
      icon: BarChart3
    }
  ];

  if (!isOpen) return null;

  // Find step corresponding to activeTab or default to first
  const currentStepIndex = tourSteps.findIndex(s => s.tab === activeTab);
  const currentStep = currentStepIndex !== -1 ? tourSteps[currentStepIndex] : tourSteps[0];
  const Icon = currentStep.icon;

  const handleNext = () => {
    const nextIndex = currentStepIndex < tourSteps.length - 1 ? currentStepIndex + 1 : 0;
    onTabChange(tourSteps[nextIndex].tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    const prevIndex = currentStepIndex > 0 ? currentStepIndex - 1 : tourSteps.length - 1;
    onTabChange(tourSteps[prevIndex].tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If minimized, display a small floating pill at bottom right
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 animate-bounce">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl shadow-blue-500/40 text-xs font-bold border border-white/20 hover:scale-105 transition-all"
          title="Expand Interactive Tour Guide"
        >
          <Compass className="w-4 h-4 animate-spin-slow" />
          <span>Tour Guide (Step {currentStep.stepNumber}/6)</span>
          <Maximize2 className="w-3.5 h-3.5 ml-1 opacity-80" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-3xl w-[95%] sm:w-[90%] bg-slate-900/95 backdrop-blur-xl border border-blue-500/40 rounded-2xl p-3.5 sm:p-4 shadow-2xl shadow-black/90 animate-fade-in text-slate-100 ring-1 ring-blue-500/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Step Info & Guidance */}
        <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-500/30">
            <Icon className="w-5 h-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                Step {currentStep.stepNumber} of {currentStep.totalSteps}: {currentStep.title}
              </span>
              <span className="text-[11px] text-amber-400 hidden md:inline font-medium">
                ⚡ Evaluator Fast-Track
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium truncate mt-0.5">
              {currentStep.oneLiner}
            </p>

            <div className="text-[11px] text-amber-300 flex items-center space-x-1 font-mono mt-0.5">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Try this: {currentStep.actionPrompt}</span>
            </div>
          </div>
        </div>

        {/* Right: Navigation & Window Controls */}
        <div className="flex items-center justify-between sm:justify-end space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-950 text-slate-300 border border-slate-800 transition-all text-xs font-semibold flex items-center space-x-1"
              title="Previous Step"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Prev</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all group"
              title="Next Guided Step"
            >
              <span>{currentStepIndex < tourSteps.length - 1 ? 'Next Step' : 'Restart Tour'}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="flex items-center space-x-1 border-l border-slate-800 pl-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Minimize Tour"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-800 transition-colors"
              title="Exit Tour"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
