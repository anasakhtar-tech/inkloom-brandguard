import React from 'react';
import { ShieldCheck, Sparkles, Wand2, Users2, ArrowRight, X, CheckCircle2 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-slate-100 overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          title="Close introduction"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Icon */}
        <div className="flex items-center space-x-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
            <ShieldCheck className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold tracking-tight text-white font-sans">
                Inkloom BrandGuard
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                Platform Overview
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Intelligent Pre-Publication Brand Governance & Compliance
            </p>
          </div>
        </div>

        {/* Problem & Purpose Statement */}
        <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          Growing organizations publish content across distributed teams, agencies, and generative AI tools. 
          <strong> Inkloom BrandGuard</strong> intercepts brand drift, factual hallucinations, and high-risk claims before content goes public.
        </p>

        {/* 3 Core Highlights */}
        <div className="space-y-3 mb-6 text-xs">
          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">1. Real-Time 6-Dimension Scanner</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Checks tone, deprecated terminology, verified enterprise facts, promotional claims, visual palettes, and accessibility in under 15ms.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">2. Explainable 1-Click Smart Rewrites</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Never acts as an opaque blocker. Explains why an issue was flagged, cites the brand rule, and provides non-destructive 1-click rewrites.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0 mt-0.5">
              <Users2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-slate-200">3. Human-in-the-Loop Collaboration</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Switch roles between Creator, Reviewer, and Legal to inspect diffs, comment, approve, and generate certified compliance certificates.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Tested across all 6 governance dimensions
          </span>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30"
          >
            <span>Explore Live Platform</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

