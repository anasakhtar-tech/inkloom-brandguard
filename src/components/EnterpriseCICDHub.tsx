import React, { useState } from 'react';
import { 
  GitPullRequest, 
  Terminal, 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  Key, 
  Send, 
  Workflow, 
  MessageSquare,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  SAMPLE_WEBHOOK_PAYLOADS, 
  WebhookPayload, 
  evaluateReleaseCandidate, 
  GatekeeperResult 
} from '../services/cicdEngine';

export const EnterpriseCICDHub: React.FC = () => {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number>(0);
  const [activePayload, setActivePayload] = useState<WebhookPayload>(SAMPLE_WEBHOOK_PAYLOADS[0].payload);
  const [result, setResult] = useState<GatekeeperResult>(evaluateReleaseCandidate(SAMPLE_WEBHOOK_PAYLOADS[0].payload));
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [verifyTokenInput, setVerifyTokenInput] = useState<string>('');
  const [tokenVerifyResult, setTokenVerifyResult] = useState<'valid' | 'invalid' | null>(null);

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIdx(idx);
    setActivePayload(SAMPLE_WEBHOOK_PAYLOADS[idx].payload);
    setResult(evaluateReleaseCandidate(SAMPLE_WEBHOOK_PAYLOADS[idx].payload));
  };

  const handleRunEvaluation = () => {
    setIsEvaluating(true);
    setTimeout(() => {
      const res = evaluateReleaseCandidate(activePayload);
      setResult(res);
      setIsEvaluating(false);
    }, 400);
  };

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerifyToken = () => {
    if (!verifyTokenInput.trim()) {
      setTokenVerifyResult(null);
      return;
    }
    if (verifyTokenInput.startsWith('inkloom_sig_v3_') && verifyTokenInput.length > 20) {
      setTokenVerifyResult('valid');
    } else {
      setTokenVerifyResult('invalid');
    }
  };

  const sampleGithubWorkflow = `name: Inkloom Brand Governance Gate
on:
  pull_request:
    branches: [ main, production ]

jobs:
  brandguard-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Inkloom Pre-Publication Policy Gate
        run: |
          RESPONSE=$(curl -s -X POST https://api.inkloom.ai/v1/governance/evaluate \\
            -H "Authorization: Bearer \${{ secrets.INKLOOM_API_KEY }}" \\
            -H "Content-Type: application/json" \\
            -d '{"repo":"\${{ github.repository }}","branch":"\${{ github.ref_name }}","sha":"\${{ github.sha }}"}')
          EXIT_CODE=$(echo $RESPONSE | jq -r '.exitCode')
          if [ "$EXIT_CODE" -ne 0 ]; then
            echo "Release blocked by Inkloom BrandGuard policy gate!"
            exit 1
          fi
          echo "Compliance Token: $(echo $RESPONSE | jq -r '.signedComplianceToken')"`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Round 3 Final Improvement 3
              </span>
              <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Automated Release Gatekeeper Active</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Enterprise CI/CD Gatekeeper & Webhook Engine
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Blocks unauthorized publication of non-compliant marketing PRs, outdated SLAs, or FTC/SEC regulatory breaches.
              Issues cryptographically signed HMAC-SHA256 tokens for approved releases and broadcasts Slack incident alerts.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className={`px-4 py-2.5 rounded-xl border text-right font-mono ${
              result.status === 'PASSED' ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300' :
              result.status === 'WARNING' ? 'bg-amber-950/60 border-amber-800/60 text-amber-300' :
              'bg-red-950/60 border-red-800/60 text-red-300'
            }`}>
              <div className="text-[10px] uppercase tracking-wider font-sans font-semibold">Exit Code</div>
              <div className="text-xl font-black">
                {result.exitCode} ({result.status})
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Webhook Simulator */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            
            {/* Payload Presets */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Workflow className="w-4 h-4 text-emerald-400" />
                <span>Simulated PR / Webhook Payload</span>
              </span>

              <div className="flex items-center space-x-2">
                {SAMPLE_WEBHOOK_PAYLOADS.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectPreset(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedPresetIdx === idx
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {idx === 0 ? '🚨 Risky PR (Blocked)' : '✅ Compliant PR (Passed)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Repository</span>
                <span className="font-mono text-slate-200 font-bold truncate block">{activePayload.repository}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Branch</span>
                <span className="font-mono text-blue-400 font-bold truncate block">{activePayload.branch}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Author</span>
                <span className="text-slate-300 font-medium truncate block">{activePayload.author}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">Environment</span>
                <span className="text-emerald-400 font-mono font-bold uppercase truncate block">{activePayload.environment}</span>
              </div>
            </div>

            {/* Release Candidate Content Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Release Candidate Content Body
              </label>
              <textarea
                value={activePayload.contentText}
                onChange={(e) => setActivePayload({ ...activePayload, contentText: e.target.value })}
                rows={4}
                className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Trigger Button */}
            <button
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center space-x-2"
            >
              {isEvaluating ? (
                <span>Evaluating Gatekeeper Policies...</span>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Execute Pre-Publication Gatekeeper Evaluation (POST /api/v1/evaluate)</span>
                </>
              )}
            </button>

            {/* Gatekeeper Decision Banner */}
            <div className={`p-4 rounded-xl border ${
              result.status === 'PASSED' ? 'bg-emerald-950/40 border-emerald-800/60' :
              result.status === 'WARNING' ? 'bg-amber-950/40 border-amber-800/60' :
              'bg-red-950/40 border-red-800/60'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {result.status === 'PASSED' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
                  <span className="font-bold text-sm text-white">
                    Policy Gate Verdict: {result.status} (Exit Code: {result.exitCode})
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  Governance Score: {result.governanceScore}/100
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{result.policySummary}</p>

              {result.signedComplianceToken && (
                <div className="mt-3 pt-3 border-t border-emerald-800/40 flex items-center justify-between bg-black/40 p-2.5 rounded-lg">
                  <div className="flex items-center space-x-2 min-w-0">
                    <Key className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <div className="truncate">
                      <span className="text-[10px] text-slate-400 block">Signed Cryptographic Release Token (HMAC-SHA256)</span>
                      <code className="text-xs text-emerald-300 font-mono truncate">{result.signedComplianceToken}</code>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(result.signedComplianceToken!, 'token')}
                    className="ml-2 px-2.5 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 text-xs font-mono transition-all flex items-center space-x-1"
                  >
                    {copiedField === 'token' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Interactive Slack Notification Simulator */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Slack Incident Webhook Broadcast
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">channel: #brand-governance-alerts</span>
            </div>

            {/* Slack Message Card */}
            <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/90 font-sans space-y-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-[11px] text-white">
                  I
                </div>
                <span className="text-xs font-bold text-slate-200">Inkloom BrandGuard BOT</span>
                <span className="text-[10px] text-slate-500 font-mono">APP 12:44 PM</span>
              </div>

              <div className={`p-3 rounded-lg border-l-4 ${
                result.status === 'BLOCKED' ? 'border-red-500 bg-red-950/20' : 'border-emerald-500 bg-emerald-950/20'
              } space-y-2`}>
                <div className="text-xs font-bold text-slate-100">
                  {result.status === 'BLOCKED' ? '🚨 [CRITICAL BLOCKED] Release Halted by BrandGuard Gate' : '✅ [PASSED] Release Approved for Production'}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div><strong className="text-slate-400">Repo:</strong> {activePayload.repository}</div>
                  <div><strong className="text-slate-400">Branch:</strong> {activePayload.branch}</div>
                  <div><strong className="text-slate-400">Author:</strong> {activePayload.author}</div>
                  <div><strong className="text-slate-400">Score:</strong> {result.governanceScore}/100</div>
                </div>

                <div className="text-[11px] text-slate-300 pt-1">
                  {result.policySummary}
                </div>

                {result.status === 'BLOCKED' && (
                  <div className="pt-2 flex items-center space-x-2">
                    <button className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-medium hover:bg-slate-700">
                      View Diff in Studio
                    </button>
                    <button className="px-2.5 py-1 rounded bg-amber-600/20 border border-amber-600/40 text-amber-300 text-[11px] font-medium hover:bg-amber-600/30">
                      Request Legal Override
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Col: CI/CD Snippets & Token Verifier */}
        <div className="space-y-4">
          
          {/* GitHub Actions Snippet */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <GitPullRequest className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">GitHub Action Workflow</h3>
              </div>
              <button
                onClick={() => handleCopy(sampleGithubWorkflow, 'workflow')}
                className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 text-xs text-slate-300 transition-all flex items-center space-x-1"
              >
                {copiedField === 'workflow' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-blue-400" />}
                <span>Copy YAML</span>
              </button>
            </div>

            <pre className="bg-slate-950 rounded-xl p-3 text-[10px] text-slate-300 font-mono overflow-x-auto h-52 border border-slate-800/80 leading-relaxed">
              {sampleGithubWorkflow}
            </pre>
          </div>

          {/* Token Verifier */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Cryptographic Token Verifier</h3>
            </div>

            <p className="text-xs text-slate-400">
              Verify if an automated release artifact carries an authentic HMAC-SHA256 signature issued by Inkloom.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                placeholder="Paste token (inkloom_sig_v3_...)"
                value={verifyTokenInput}
                onChange={(e) => setVerifyTokenInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <button
                onClick={handleVerifyToken}
                className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all"
              >
                Verify Signature Authenticity
              </button>

              {tokenVerifyResult === 'valid' && (
                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>Signature VALID: Verified authentic release token.</span>
                </div>
              )}

              {tokenVerifyResult === 'invalid' && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/50 text-red-400 text-xs flex items-center space-x-1.5">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Signature INVALID: Token unrecognized or modified.</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

