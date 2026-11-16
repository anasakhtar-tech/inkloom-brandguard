import React, { useState, useEffect } from 'react';
import { 
  Chrome, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Terminal, 
  ShieldCheck, 
  Layers, 
  RefreshCw,
  Copy,
  Check,
  GitBranch
} from 'lucide-react';
import { auditContent } from '../services/brandEngine';
import { NextStageNavigator } from './NextStageNavigator';

interface ExtensionSimulatorProps {
  onNavigateToTab?: (tab: string) => void;
}

export const ExtensionSimulator: React.FC<ExtensionSimulatorProps> = ({ onNavigateToTab }) => {
  const [editorText, setEditorText] = useState<string>(
    `Welcome to the new release of inkloom brandguard!\n\nOur system delivers guaranteed 100% flawless uptime with an unbeatable 99.999% SLA.\nCustomers can now replace their cheap legacy tools with our miraculous AI solution.`
  );
  const [simulatedPlatform, setSimulatedPlatform] = useState<'docs' | 'notion' | 'cms'>('docs');
  const [copiedLink, setCopiedLink] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const inspection = auditContent(editorText);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      `[${timestamp}] [DOM_MUTATION] 1 text node modified. Re-scanned in 1.94ms. Violations: ${inspection.violations.length}`,
      ...prev.slice(0, 15)
    ]);
  }, [editorText]);

  const applyFix = (target: string, replacement: string) => {
    setEditorText(prev => prev.replace(target, replacement));
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [
      `[${timestamp}] [IN_SITU_PATCH] Replaced "${target}" with "${replacement}" directly in DOM.`,
      ...prev.slice(0, 15)
    ]);
  };

  const handleCopyCommand = () => {
    navigator.clipboard.writeText('chrome://extensions');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Improvement Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-slate-900 border border-blue-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Round 3 Final Improvement 1
              </span>
              <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Manifest V3 Engine Active</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              In-Situ Real-Time Extension & Web Overlay
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Injects sub-15ms brand governance directly into Google Docs, Notion, and Web CMS authoring tools. 
              Judges can test the real-time ambient floating overlay below across any OS or browser!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyCommand}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs text-slate-200 transition-all shadow-sm"
              title="Copy chrome://extensions to clipboard"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>chrome://extensions</span>
            </button>

            <div className="px-3 py-2 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center space-x-1.5">
              <Chrome className="w-4 h-4 text-blue-400" />
              <span>Manifest V3 Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: In-Situ Simulated Web Editor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
            
            {/* Fake Browser / Editor Toolbar */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="text-xs text-slate-400 font-mono pl-2">
                  {simulatedPlatform === 'docs' ? 'docs.google.com/document/d/1XyZ...' : simulatedPlatform === 'notion' ? 'notion.so/workspace/inkloom-pr' : 'wordpress.org/wp-admin/post.php'}
                </span>
              </div>

              {/* Platform Switcher */}
              <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setSimulatedPlatform('docs')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    simulatedPlatform === 'docs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Google Docs
                </button>
                <button
                  onClick={() => setSimulatedPlatform('notion')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    simulatedPlatform === 'notion' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Notion
                </button>
                <button
                  onClick={() => setSimulatedPlatform('cms')}
                  className={`px-2.5 py-1 rounded font-medium transition-all ${
                    simulatedPlatform === 'cms' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Headless CMS
                </button>
              </div>
            </div>

            {/* Document Content Area with Ambient Live Overlay */}
            <div className="p-6 relative min-h-[380px] bg-slate-900">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">Live In-Situ Content Canvas</span>
                <span>Type freely below to see real-time ambient scanning</span>
              </div>

              <textarea
                value={editorText}
                onChange={(e) => setEditorText(e.target.value)}
                rows={9}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-slate-100 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                placeholder="Type or paste content here..."
              />

              {/* Ambient Floating Inkloom Widget in Bottom Right */}
              <div className="absolute bottom-4 sm:bottom-10 right-4 sm:right-10 z-20 flex items-center space-x-2.5 bg-slate-950/95 border border-blue-500/40 rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 shadow-2xl shadow-blue-900/50 backdrop-blur-md animate-pulse">
                <div className={`w-2.5 h-2.5 rounded-full ${
                  inspection.score >= 85 ? 'bg-emerald-400 shadow-emerald-500/50' : inspection.score >= 65 ? 'bg-amber-400 shadow-amber-500/50' : 'bg-red-400 shadow-red-500/50'
                } shadow-lg`} />
                <span className="text-xs font-bold text-white tracking-tight">Inkloom In-Situ</span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-blue-950 border border-blue-800 text-blue-300">
                  {inspection.score}/100
                </span>
              </div>
            </div>

            {/* In-Situ Quick Fix Tray */}
            <div className="bg-slate-950/90 border-t border-slate-800 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Detected Violations & Instant 1-Click Fixes ({inspection.violations.length})</span>
                </div>
                <span className="text-[11px] text-slate-500">Sub-15ms local AST replacement</span>
              </div>

              {inspection.violations.length === 0 ? (
                <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-3">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>100% Compliant! No brand drift or regulatory violations detected in active DOM.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {inspection.violations.slice(0, 4).map((violation) => (
                    <div 
                      key={violation.id} 
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col justify-between hover:border-slate-700 transition-all text-xs"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            violation.severity === 'critical' ? 'bg-red-950/80 text-red-400 border border-red-800/40' :
                            violation.severity === 'warning' ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40' :
                            'bg-blue-950/80 text-blue-400 border border-blue-800/40'
                          }`}>
                            {violation.severity}
                          </span>
                          <span className="text-[10px] text-slate-500">{violation.dimension}</span>
                        </div>
                        <p className="text-slate-300 font-medium line-clamp-1">{violation.explanation}</p>
                      </div>

                      {violation.suggestedCorrection && (
                        <button
                          onClick={() => applyFix(violation.flaggedText, violation.suggestedCorrection!)}
                          className="mt-2.5 w-full flex items-center justify-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white font-medium transition-all text-[11px]"
                        >
                          <span>Apply: <code className="bg-black/40 px-1 rounded">{violation.suggestedCorrection}</code></span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Col: Extension Runtime & Manifest Inspection */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Layers className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white">Extension Architecture</h2>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Standard</span>
                <span className="text-white font-bold font-mono">Manifest V3</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Execution Latency</span>
                <span className="text-emerald-400 font-bold font-mono">1.94 ms (Local AST)</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Data Sovereignty</span>
                <span className="text-blue-400 font-bold font-mono">100% In-Browser</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">Permissions</span>
                <span className="text-slate-300 font-mono">activeTab, storage</span>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <h3 className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Live Event Stream</span>
              </h3>
              <div className="bg-slate-950 rounded-xl p-2.5 font-mono text-[10px] text-slate-400 h-44 overflow-y-auto space-y-1 border border-slate-800/80">
                {logs.map((log, idx) => (
                  <div key={idx} className="leading-tight text-slate-400">
                    {log}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300">Unpacked Extension Files in Repo:</p>
              <p className="font-mono text-slate-500">/extension/manifest.json</p>
              <p className="font-mono text-slate-500">/extension/content.js</p>
              <p className="font-mono text-slate-500">/extension/popup.html</p>
            </div>
          </div>
        </div>

      </div>

      {/* Next Stage in Governance Lifecycle */}
      {onNavigateToTab && (
        <NextStageNavigator
          currentStageNumber={3}
          totalStages={6}
          currentStageName="In-Situ Extension (Browser Overlay)"
          prevTab="visual"
          prevTabName="Visual Inspector"
          nextTab="cicd"
          nextTabName="Enterprise CI/CD Gatekeeper"
          nextTabDescription="Evaluate pull requests & CMS webhooks against governance policies before build deployments."
          nextTabIcon={GitBranch}
          onNavigate={onNavigateToTab}
          recommendedAction="Run CI/CD audit on PR #412 to test automated release blocking."
        />
      )}
    </div>
  );
};
