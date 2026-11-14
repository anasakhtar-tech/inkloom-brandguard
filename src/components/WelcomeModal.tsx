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
                Round 3 Finalist Build
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              CodeTitans India 2026 • Top 50 Finalist
            </p>
          </div>
        </div>

        {/* Problem & Purpose Statement */}
        <p className="text-xs text-slate-300 leading-relaxed mb-5 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <strong>Inkloom BrandGuard</strong> is an intelligent pre-publication governance platform that intercepts brand drift, factual hallucinations, and regulatory breaches before content goes public.
        </p>

        {/* 3 Major Round 3 Improvements */}
        <div className="space-y-2.5 mb-6 text-xs">
          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0 mt-0.5 font-bold text-xs">
              1
            </div>
            <div>
              <h4 className="font-bold text-slate-200">In-Situ Extension & Web Overlay</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Real-time Manifest V3 Chrome Extension and in-app interactive sandbox overlay for Google Docs and Notion.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0 mt-0.5 font-bold text-xs">
              2
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Multimodal Visual Brand Inspector</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                HTML5 Canvas computer vision verifying logo clearspace, aspect ratio distortion, WCAG contrast, and forbidden hex colors.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5 font-bold text-xs">
              3
            </div>
            <div>
              <h4 className="font-bold text-slate-200">Enterprise CI/CD & Webhook Gatekeeper</h4>
              <p className="text-slate-400 text-[11px] mt-0.5">
                Automated release blocker with signed HMAC-SHA256 compliance tokens and real-time Slack incident broadcasts.
              </p>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Tested across all 8 modules • Sub-15ms engine
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

