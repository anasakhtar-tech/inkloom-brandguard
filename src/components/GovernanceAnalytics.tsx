import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  HelpCircle,
  Users,
  Lightbulb,
  Clock
} from 'lucide-react';

export const GovernanceAnalytics: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Brand Governance & Compliance Intelligence</h2>
            <p className="text-xs text-slate-400">
              Longitudinal insights into repeated mistakes, team compliance trends, and ambiguous brand guidelines.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Review Cycle Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">4.2 hrs <span className="text-xs text-emerald-400 font-normal">(-78%)</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Down from 19.5 hrs manual proofreading</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Drafts Governed</span>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">1,480+</div>
          <div className="text-[11px] text-slate-500 mt-1">Across 14 distributed departments</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Regulatory Flags Caught</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">142</div>
          <div className="text-[11px] text-slate-500 mt-1">100% intercepted before publication</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Avg Brand Compliance</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">93.4%</div>
          <div className="text-[11px] text-slate-500 mt-1">+24% improvement over 60 days</div>
        </div>
      </div>

      {/* Main Grid: Recurring Mistakes vs Ambiguous Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Top Recurring Mistakes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Most Frequent Content Violations</h3>
              <p className="text-xs text-slate-400">Analysis of 628 flagged instances over the past 30 days</p>
            </div>
            <span className="text-xs font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              30-Day Trend
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Item 1 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-200">1. Unsupported Promotional Claims ("100% risk-free")</span>
                <span className="text-slate-400 font-mono">42% (264 flags)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            {/* Item 2 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-200">2. Deprecated Terminology ("AI bot", "crypto coins")</span>
                <span className="text-slate-400 font-mono">28% (176 flags)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            {/* Item 3 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-200">3. Tone & Bro-Talk ("totally sucks", "crush competitors")</span>
                <span className="text-slate-400 font-mono">18% (113 flags)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            {/* Item 4 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-200">4. Factual Metrics Drift ("99.999% uptime", "50k customers")</span>
                <span className="text-slate-400 font-mono">12% (75 flags)</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Guideline Ambiguity Detector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>Guideline Ambiguity Heatmap</span>
              </h3>
              <p className="text-xs text-slate-400">
                Highlights brand rules with high creator disputes or overrides.
              </p>
            </div>
            <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Needs Clarification
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-amber-300">
                <span>Rule CLAIM-01: Promotional Financial Disclaimers</span>
                <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">34% Override Rate</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Writers frequently dispute whether product feature descriptions count as financial claims.
              </p>
              <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-medium pt-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Suggested Action: Add 3 concrete approved disclaimer templates in the Brand Vault.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between font-bold text-slate-200">
                <span>Rule TONE-02: Casual vs Informal in Social Ads</span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded">21% Dispute Rate</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Agency copywriters argue that Gen-Z social campaigns require more colloquial tone than B2B press releases.
              </p>
              <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-medium pt-1">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Suggested Action: Create format-specific tone tiers (e.g. Social vs Enterprise PR).</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Departmental Performance Scorecard */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center space-x-2">
          <Users className="w-4 h-4 text-blue-400" />
          <span>Departmental Brand Governance Scorecard</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 mb-1">Corporate Communications</div>
            <div className="text-xl font-bold text-emerald-400">96.8%</div>
            <div className="text-[11px] text-slate-500 mt-1">42 articles audited • 0 high-risk flags</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 mb-1">Sales & SDR Outbound</div>
            <div className="text-xl font-bold text-amber-400">76.2%</div>
            <div className="text-[11px] text-slate-500 mt-1">620 emails audited • 34 SLA exaggerations</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 mb-1">Growth & Paid Social</div>
            <div className="text-xl font-bold text-amber-400">71.5%</div>
            <div className="text-[11px] text-slate-500 mt-1">190 ads audited • 58 guarantee claims</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-400 mb-1">External Freelance Agencies</div>
            <div className="text-xl font-bold text-red-400">62.4%</div>
            <div className="text-[11px] text-slate-500 mt-1">84 drafts audited • 48 deprecated terms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
