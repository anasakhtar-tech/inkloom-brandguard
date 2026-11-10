import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Cpu, 
  FileLock2, 
  CheckCircle2,
  Server,
  Zap
} from 'lucide-react';
import { scrubConfidentialData } from '../services/brandEngine';

export const ResponsibleAICenter: React.FC = () => {
  const [testInput, setTestInput] = useState<string>(
    'Contact our lead engineer at alex.turner@inkloom.internal or call +1-415-555-0199 regarding Project Titan launch metrics.'
  );

  const { scrubbedText, redactedCount } = scrubConfidentialData(testInput);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Responsible AI, Privacy & Security Architecture</h2>
            <p className="text-xs text-slate-400">
              Enterprise data protection, client-side PII scrubbing, and transparent external service disclosures.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive PII Scrubber Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Interactive Client-Side PII & Confidentiality Redactor</span>
            </h3>
            <p className="text-xs text-slate-400">
              Drafts are sanitized locally in-browser before any semantic or external processing takes place.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            {redactedCount} Sensitive Items Redacted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Raw Internal Draft (Contains Confidential Data):
            </label>
            <textarea
              rows={4}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Sanitized Engine Payload (Safe for Semantic Evaluation):
            </label>
            <div className="w-full h-24 bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 font-mono overflow-y-auto">
              {scrubbedText}
            </div>
          </div>
        </div>
      </div>

      {/* External AI Disclosures & Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Hybrid Engine Architecture</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deterministic AST & regex rules execute locally in &lt;15ms for 500+ glossary terms. Only complex semantic tone and claim verification utilize Google Gemini 2.5/3.8 Flash.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <FileLock2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Zero Data Retention (ZDR)</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Customer content is never persisted in external logs, cached, or used to train third-party foundation models. All API payloads execute under enterprise privacy agreements.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Human Authority Guarantee</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            BrandGuard acts strictly as a co-pilot. It never silently modifies drafts or overrides human decisions. Every recommendation is an explainable diff requiring explicit human approval.
          </p>
        </div>
      </div>
    </div>
  );
};
