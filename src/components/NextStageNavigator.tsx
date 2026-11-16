import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface NextStageNavigatorProps {
  currentStageNumber: number;
  totalStages?: number;
  currentStageName: string;
  nextTab: string;
  nextTabName: string;
  nextTabDescription: string;
  nextTabIcon: React.ComponentType<{ className?: string }>;
  prevTab?: string;
  prevTabName?: string;
  onNavigate: (tab: string) => void;
  recommendedAction?: string;
}

export const NextStageNavigator: React.FC<NextStageNavigatorProps> = ({
  currentStageNumber,
  totalStages = 6,
  currentStageName,
  nextTab,
  nextTabName,
  nextTabDescription,
  nextTabIcon: NextIcon,
  prevTab,
  prevTabName,
  onNavigate,
  recommendedAction
}) => {
  return (
    <div className="mt-8 pt-6 border-t border-slate-800/80">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Pipeline Progress Indicator */}
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center space-x-2 text-xs">
            <span className="flex items-center space-x-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Stage {currentStageNumber} of {totalStages} Complete</span>
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300 font-medium">{currentStageName}</span>
          </div>

          <div className="flex items-start sm:items-center space-x-3 pt-1">
            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <NextIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>Next Stage in Governance Pipeline:</span>
                <span className="text-blue-400">{nextTabName}</span>
              </h4>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {nextTabDescription}
              </p>
              {recommendedAction && (
                <div className="text-[11px] text-amber-300/90 mt-1 flex items-center space-x-1 font-mono">
                  <span>💡 Recommended Action: {recommendedAction}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Navigation Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0 pt-2 md:pt-0 w-full md:w-auto">
          {prevTab && prevTabName && (
            <button
              onClick={() => {
                onNavigate(prevTab);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex-1 sm:flex-initial flex items-center justify-center space-x-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={() => {
              onNavigate(nextTab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white transition-all text-xs font-bold shadow-lg shadow-blue-600/30 group"
          >
            <span>Proceed to {nextTabName}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
