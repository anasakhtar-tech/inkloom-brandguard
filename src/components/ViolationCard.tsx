import React from 'react';
import { Violation, Dimension, Severity } from '../types';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ArrowRight, CornerDownLeft, BookOpen, ShieldAlert } from 'lucide-react';

interface ViolationCardProps {
  violation: Violation;
  onApply: (violation: Violation) => void;
  onIgnore: (violationId: string) => void;
}

const severityConfig: Record<Severity, { bg: string; text: string; border: string; icon: React.ReactNode }> = {
  critical: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
    icon: <AlertCircle className="w-4 h-4 text-red-400" />
  },
  warning: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
  },
  suggestion: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
    icon: <Info className="w-4 h-4 text-blue-400" />
  }
};

const dimensionLabels: Record<Dimension, { label: string; badge: string }> = {
  tone: { label: 'Tone & Voice', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  terminology: { label: 'Terminology', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  facts: { label: 'Verified Facts', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  promotional: { label: 'Promotional Claims', badge: 'bg-red-500/10 text-red-400 border-red-500/20' },
  visual: { label: 'Visual Standards', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  accessibility: { label: 'WCAG Accessibility', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
};

export const ViolationCard: React.FC<ViolationCardProps> = ({
  violation,
  onApply,
  onIgnore
}) => {
  const sev = severityConfig[violation.severity];
  const dim = dimensionLabels[violation.dimension];

  if (violation.ignored) {
    return (
      <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800 opacity-60 text-xs flex items-center justify-between">
        <span className="text-slate-400 line-through">Flagged: "{violation.flaggedText}"</span>
        <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded">Exemption Granted</span>
      </div>
    );
  }

  if (violation.applied) {
    return (
      <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-800/30 text-xs flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-300 font-medium">Applied: "{violation.suggestedCorrection}"</span>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Resolved
        </span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl border transition-all duration-200 bg-slate-900/80 hover:bg-slate-900 ${sev.border} shadow-sm`}>
      {/* Top Header: Dimension and Severity Tag */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-full border ${dim.badge}`}>
            {dim.label}
          </span>
          <span className={`flex items-center space-x-1 px-2 py-0.5 text-[11px] font-semibold rounded-full border ${sev.bg} ${sev.text} ${sev.border}`}>
            {sev.icon}
            <span className="uppercase tracking-wider">{violation.severity}</span>
          </span>
        </div>

        <button
          onClick={() => onIgnore(violation.id)}
          className="text-[11px] text-slate-400 hover:text-slate-300 transition-colors"
          title="Mark as false positive or deliberate exemption"
        >
          Exemption
        </button>
      </div>

      {/* Flagged Snippet */}
      <div className="mb-2 p-2 rounded-lg bg-slate-950 border border-slate-800/80">
        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Flagged Phrase:</div>
        <div className="text-xs font-mono text-red-300 font-medium">
          "{violation.flaggedText}"
        </div>
      </div>

      {/* Why it was flagged */}
      <p className="text-xs text-slate-300 mb-2 leading-relaxed">
        {violation.explanation}
      </p>

      {/* Guideline Citation */}
      <div className="flex items-center space-x-1.5 text-[11px] text-blue-400/90 bg-blue-500/5 px-2.5 py-1.5 rounded-lg border border-blue-500/10 mb-3">
        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">{violation.guidelineCitation}</span>
      </div>

      {/* Suggested Context-Preserving Rewrite & 1-Click Action */}
      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider mb-0.5">
            Smart Suggestion:
          </div>
          <div className="text-xs font-medium text-emerald-300 truncate">
            "{violation.suggestedCorrection}"
          </div>
        </div>

        <button
          onClick={() => onApply(violation)}
          className="flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-sm shadow-emerald-600/30"
          title="Click to automatically apply this suggestion to your content"
        >
          <CornerDownLeft className="w-3 h-3" />
          <span>Apply</span>
        </button>
      </div>
    </div>
  );
};
