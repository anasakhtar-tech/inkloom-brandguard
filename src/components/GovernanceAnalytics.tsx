import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  HelpCircle,
  Users,
  Lightbulb,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Info,
  Copy,
  Check,
  Send,
  FileText,
  Calendar,
  X,
  ShieldCheck,
  ArrowRight,
  Database
} from 'lucide-react';
import { NextStageNavigator } from './NextStageNavigator';

interface GovernanceAnalyticsProps {
  onNavigateToTab?: (tab: string) => void;
}

type TimeframeOption = '7d' | '30d' | '90d' | 'all';

export const GovernanceAnalytics: React.FC<GovernanceAnalyticsProps> = ({ onNavigateToTab }) => {
  const [timeframe, setTimeframe] = useState<TimeframeOption>('30d');
  const [showExplainer, setShowExplainer] = useState<boolean>(true);
  const [selectedDeptId, setSelectedDeptId] = useState<string>('external-agencies');
  const [expandedMistakeIndex, setExpandedMistakeIndex] = useState<number | null>(0);
  const [clarifiedRules, setClarifiedRules] = useState<Set<string>>(new Set());
  const [dispatchedNotice, setDispatchedNotice] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [hasCopiedReport, setHasCopiedReport] = useState<boolean>(false);

  // Dynamic metrics based on selected timeframe
  const timeframeData = {
    '7d': {
      label: 'Past 7 Days',
      reviewCycle: '3.8 hrs',
      cycleDelta: '-80%',
      baselineHours: '19.5 hrs manual',
      hoursSavedPerDoc: '15.7 hrs',
      totalDrafts: '312',
      departmentsCovered: '14 active teams',
      flagsCaught: '29',
      riskAvoidanceDollars: '$87,000+',
      avgCompliance: '95.1%',
      complianceDelta: '+26% vs baseline',
      mistakes: [
        { label: 'Unsupported Promotional Claims ("100% risk-free")', percent: 40, count: 112, why: 'Sales reps push aggressive guarantees to boost conversion rates.', fix: 'Replaces absolute guarantees with verified SLA commitments.', vaultRule: 'CLAIM-01' },
        { label: 'Deprecated Terminology ("AI bot", "crypto coins")', percent: 28, count: 78, why: 'Writers rely on legacy habit or colloquial buzzwords.', fix: 'Substitutes approved terms like "Autonomous Copilot" & "Digital Assets".', vaultRule: 'TERM-03' },
        { label: 'Tone & Bro-Talk ("totally sucks", "crush competitors")', percent: 19, count: 54, why: 'Informal internal slang bleeds into public blog copy.', fix: 'Prompts objective, authoritative enterprise voice.', vaultRule: 'TONE-01' },
        { label: 'Factual Metrics Drift ("99.999% uptime")', percent: 13, count: 36, why: 'Marketing uses rounded figures without checking verified SLA ledger.', fix: 'Verifies against immutable source of truth in Brand Vault.', vaultRule: 'FACT-02' }
      ]
    },
    '30d': {
      label: 'Past 30 Days',
      reviewCycle: '4.2 hrs',
      cycleDelta: '-78%',
      baselineHours: '19.5 hrs manual',
      hoursSavedPerDoc: '15.3 hrs',
      totalDrafts: '1,480+',
      departmentsCovered: '14 active teams',
      flagsCaught: '142',
      riskAvoidanceDollars: '$426,000+',
      avgCompliance: '93.4%',
      complianceDelta: '+24% vs baseline',
      mistakes: [
        { label: 'Unsupported Promotional Claims ("100% risk-free")', percent: 42, count: 264, why: 'Sales reps push aggressive guarantees to boost conversion rates.', fix: 'Replaces absolute guarantees with verified SLA commitments.', vaultRule: 'CLAIM-01' },
        { label: 'Deprecated Terminology ("AI bot", "crypto coins")', percent: 28, count: 176, why: 'Writers rely on legacy habit or colloquial buzzwords.', fix: 'Substitutes approved terms like "Autonomous Copilot" & "Digital Assets".', vaultRule: 'TERM-03' },
        { label: 'Tone & Bro-Talk ("totally sucks", "crush competitors")', percent: 18, count: 113, why: 'Informal internal slang bleeds into public blog copy.', fix: 'Prompts objective, authoritative enterprise voice.', vaultRule: 'TONE-01' },
        { label: 'Factual Metrics Drift ("99.999% uptime")', percent: 12, count: 75, why: 'Marketing uses rounded figures without checking verified SLA ledger.', fix: 'Verifies against immutable source of truth in Brand Vault.', vaultRule: 'FACT-02' }
      ]
    },
    '90d': {
      label: 'Past 90 Days',
      reviewCycle: '5.1 hrs',
      cycleDelta: '-73%',
      baselineHours: '19.5 hrs manual',
      hoursSavedPerDoc: '14.4 hrs',
      totalDrafts: '4,210+',
      departmentsCovered: '14 active teams',
      flagsCaught: '418',
      riskAvoidanceDollars: '$1,250,000+',
      avgCompliance: '91.2%',
      complianceDelta: '+21% vs baseline',
      mistakes: [
        { label: 'Unsupported Promotional Claims ("100% risk-free")', percent: 44, count: 780, why: 'Sales reps push aggressive guarantees to boost conversion rates.', fix: 'Replaces absolute guarantees with verified SLA commitments.', vaultRule: 'CLAIM-01' },
        { label: 'Deprecated Terminology ("AI bot", "crypto coins")', percent: 28, count: 492, why: 'Writers rely on legacy habit or colloquial buzzwords.', fix: 'Substitutes approved terms like "Autonomous Copilot" & "Digital Assets".', vaultRule: 'TERM-03' },
        { label: 'Tone & Bro-Talk ("totally sucks", "crush competitors")', percent: 18, count: 312, why: 'Informal internal slang bleeds into public blog copy.', fix: 'Prompts objective, authoritative enterprise voice.', vaultRule: 'TONE-01' },
        { label: 'Factual Metrics Drift ("99.999% uptime")', percent: 10, count: 178, why: 'Marketing uses rounded figures without checking verified SLA ledger.', fix: 'Verifies against immutable source of truth in Brand Vault.', vaultRule: 'FACT-02' }
      ]
    },
    'all': {
      label: 'All Time (1 Year)',
      reviewCycle: '6.4 hrs',
      cycleDelta: '-67%',
      baselineHours: '19.5 hrs manual',
      hoursSavedPerDoc: '13.1 hrs',
      totalDrafts: '18,920+',
      departmentsCovered: '14 active teams',
      flagsCaught: '1,840',
      riskAvoidanceDollars: '$5,520,000+',
      avgCompliance: '89.6%',
      complianceDelta: '+18% vs baseline',
      mistakes: [
        { label: 'Unsupported Promotional Claims ("100% risk-free")', percent: 46, count: 3540, why: 'Sales reps push aggressive guarantees to boost conversion rates.', fix: 'Replaces absolute guarantees with verified SLA commitments.', vaultRule: 'CLAIM-01' },
        { label: 'Deprecated Terminology ("AI bot", "crypto coins")', percent: 27, count: 2120, why: 'Writers rely on legacy habit or colloquial buzzwords.', fix: 'Substitutes approved terms like "Autonomous Copilot" & "Digital Assets".', vaultRule: 'TERM-03' },
        { label: 'Tone & Bro-Talk ("totally sucks", "crush competitors")', percent: 18, count: 1380, why: 'Informal internal slang bleeds into public blog copy.', fix: 'Prompts objective, authoritative enterprise voice.', vaultRule: 'TONE-01' },
        { label: 'Factual Metrics Drift ("99.999% uptime")', percent: 9, count: 690, why: 'Marketing uses rounded figures without checking verified SLA ledger.', fix: 'Verifies against immutable source of truth in Brand Vault.', vaultRule: 'FACT-02' }
      ]
    }
  };

  const currentMetrics = timeframeData[timeframe];

  // Departmental scorecard data
  const departments = [
    {
      id: 'corp-comm',
      name: 'Corporate Communications & PR',
      score: 96.8,
      grade: 'A+',
      status: 'Low Risk',
      statusColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      auditedStats: '42 press releases • 0 critical violations',
      description: 'Maintains highest compliance across the company. Follows Brand Vault rules strictly with zero high-severity incidents.',
      topIssues: [
        'Minor quote attribution formatting delays',
        'Occasional passive voice in executive statements',
        'Spacing variations around em-dashes'
      ],
      actionLabel: 'Pre-cleared for Autonomous Publishing'
    },
    {
      id: 'sales-sdr',
      name: 'Sales & Outbound SDRs',
      score: 76.2,
      grade: 'C',
      status: 'Moderate Risk',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      auditedStats: '620 prospect emails • 34 SLA exaggerations',
      description: 'Frequently guarantees impossible uptime and unvetted features in 1-on-1 cold emails to prospective enterprise clients.',
      topIssues: [
        'Overpromising 100% uptime with zero downtime guarantees',
        'Informal bro-talk greetings ("Hey bro", "Kill the competition")',
        'Unverified pricing figures not backed by sales operations'
      ],
      actionLabel: 'Enforce Gmail Extension Pre-Send Gate'
    },
    {
      id: 'growth-social',
      name: 'Growth & Paid Social Ads',
      score: 71.5,
      grade: 'C-',
      status: 'Needs Attention',
      statusColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      auditedStats: '190 ad campaigns • 58 guarantee claims',
      description: 'Ad copywriters repeatedly use clickbait guarantees to maximize CTR on Meta and LinkedIn, risking FTC scrutiny.',
      topIssues: [
        'Claims like "Guaranteed 10x ROI or full refund" without legal disclaimer',
        'Missing required #sponsored disclosure on influencer content',
        'Low contrast ratios on dark creative visual banners'
      ],
      actionLabel: 'Deploy 5 Pre-Approved Ad Formulas'
    },
    {
      id: 'external-agencies',
      name: 'External Freelance Agencies',
      score: 62.4,
      grade: 'D+',
      status: 'High Risk',
      statusColor: 'text-red-400 bg-red-500/10 border-red-500/20',
      auditedStats: '84 outsourced drafts • 48 deprecated terms',
      description: 'External copywriters lack familiarity with brand terminology and repeatedly deploy forbidden slurs and deprecated product names.',
      topIssues: [
        'Using deprecated terms: "AI bot", "crypto coins", "master/slave"',
        'Aggressive competitor disparagement violating brand positioning',
        'Missing standard copyright disclaimers on whitepapers'
      ],
      actionLabel: 'Enforce CI/CD Pre-Commit Audit Gate'
    }
  ];

  const activeDept = departments.find(d => d.id === selectedDeptId) || departments[3];

  const handleDispatchBrief = (deptName: string) => {
    setDispatchedNotice(`Targeted 1-page Brand Style Brief dispatched to ${deptName} leads & agency portal.`);
    setTimeout(() => {
      setDispatchedNotice(null);
    }, 4500);
  };

  const handleClarifyRule = (ruleId: string) => {
    setClarifiedRules(prev => {
      const next = new Set(prev);
      if (next.has(ruleId)) {
        next.delete(ruleId);
      } else {
        next.add(ruleId);
      }
      return next;
    });
  };

  const handleCopyReport = () => {
    const reportText = `Inkloom BrandGuard Executive Governance Summary (${currentMetrics.label})
------------------------------------------------------------
• Review Turnaround: ${currentMetrics.reviewCycle} (${currentMetrics.cycleDelta} vs ${currentMetrics.baselineHours})
• Total Content Audited: ${currentMetrics.totalDrafts} across ${currentMetrics.departmentsCovered}
• Regulatory/Legal Risks Intercepted: ${currentMetrics.flagsCaught} (${currentMetrics.riskAvoidanceDollars} liability avoided)
• Organization Compliance Grade: ${currentMetrics.avgCompliance} (${currentMetrics.complianceDelta})

Top Repeated Violations:
1. Unsupported Promotional Claims (${currentMetrics.mistakes[0].percent}%)
2. Deprecated Terminology (${currentMetrics.mistakes[1].percent}%)
3. Inappropriate Tone & Slang (${currentMetrics.mistakes[2].percent}%)
4. Factual Metrics Drift (${currentMetrics.mistakes[3].percent}%)

Department Health:
• Corp Comm: 96.8% (Grade A+)
• Sales/SDRs: 76.2% (Grade C)
• Growth Social: 71.5% (Grade C-)
• External Agencies: 62.4% (Grade D+)

Audited by Inkloom BrandGuard Pre-Publication Governance Engine.`;

    navigator.clipboard.writeText(reportText);
    setHasCopiedReport(true);
    setTimeout(() => setHasCopiedReport(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Toast Notification */}
      {dispatchedNotice && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium animate-fade-in border border-emerald-400/30">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{dispatchedNotice}</span>
        </div>
      )}

      {/* Top Banner & Orientation Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30 shrink-0">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white">Brand Governance & Compliance Intelligence</h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Audit Stream</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Tracks company-wide brand consistency, quantifies avoided legal liability, and uncovers which brand rules confuse human writers so leadership can clarify policies.
              </p>
            </div>
          </div>

          {/* Timeframe & Export Action Controls */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Timeframe Filter */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['7d', '30d', '90d', 'all'] as TimeframeOption[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                    timeframe === tf
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : tf === '90d' ? '90 Days' : 'All Time'}
                </button>
              ))}
            </div>

            {/* Export Summary Button */}
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all shadow-sm"
              title="Export executive summary for CMO and legal leadership"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* Expandable "What is this tab?" Orientation Box */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>How To Read This Dashboard (3 Core Insights)</span>
            </span>
            <button
              onClick={() => setShowExplainer(!showExplainer)}
              className="text-[11px] text-blue-400 hover:text-blue-300 underline font-medium"
            >
              {showExplainer ? 'Hide Guide' : 'Show Guide'}
            </button>
          </div>

          {showExplainer && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2 font-semibold text-emerald-400">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>1. Operational Velocity (ROI)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Measures turnaround acceleration. Automated checks replace 19-hour manual legal email chains with instant 15ms scans.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2 font-semibold text-red-400">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>2. Risk Prevention Ledger</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Shows high-severity regulatory claims and forbidden slurs stopped <em>before</em> customer release, averting FTC fines and PR crises.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center space-x-2 font-semibold text-indigo-400">
                  <Lightbulb className="w-4 h-4 shrink-0" />
                  <span>3. Policy Ambiguity Heatmap</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When human writers repeatedly dispute a brand rule, the rule itself is unclear! It pinpoints which policies need rewrites.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Self-Explanatory KPI Metric Cards with Plain-English Value Explanations */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium">Review Cycle Turnaround</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {currentMetrics.reviewCycle}{' '}
              <span className="text-xs text-emerald-400 font-semibold">{currentMetrics.cycleDelta}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Down from <span className="line-through text-slate-500">{currentMetrics.baselineHours}</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Time saved per doc:</span>
            <span className="font-bold text-emerald-400">~{currentMetrics.hoursSavedPerDoc}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium">Total Governed Drafts</span>
              <CheckCircle className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{currentMetrics.totalDrafts}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across <strong className="text-slate-300">{currentMetrics.departmentsCovered}</strong>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Pre-launch coverage:</span>
            <span className="font-bold text-blue-400">100% Intercepted</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium">Regulatory Risks Prevented</span>
              <ShieldAlert className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black text-red-400">{currentMetrics.flagsCaught}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              100% blocked before public exposure
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Avoided legal exposure:</span>
            <span className="font-bold text-emerald-400">{currentMetrics.riskAvoidanceDollars}</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="font-medium">Org Brand Consistency</span>
              <TrendingUp className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {currentMetrics.avgCompliance}{' '}
              <span className="text-xs text-emerald-400 font-semibold">{currentMetrics.complianceDelta}</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Up from 68.2% pre-Inkloom rollout
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Enterprise Grade:</span>
            <span className="font-bold text-indigo-400">Grade A (Passing)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recurring Mistakes vs Ambiguous Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Recurring Content Mistakes with Interactive Drilldown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Top Content Violations & Root Causes</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any violation to see why writers make the mistake and how BrandGuard corrects it.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20 shrink-0">
              {currentMetrics.label}
            </span>
          </div>

          <div className="space-y-3">
            {currentMetrics.mistakes.map((m, idx) => {
              const isExpanded = expandedMistakeIndex === idx;
              const barColors = ['bg-red-500', 'bg-cyan-500', 'bg-purple-500', 'bg-amber-500'];
              const currentColor = barColors[idx % barColors.length];

              return (
                <div
                  key={idx}
                  onClick={() => setExpandedMistakeIndex(isExpanded ? null : idx)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isExpanded
                      ? 'bg-slate-950 border-blue-500/50 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200 flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300">
                        {idx + 1}
                      </span>
                      <span>{m.label}</span>
                    </span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {m.percent}% ({m.count} flags)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden mb-2">
                    <div className={`h-full ${currentColor} rounded-full transition-all duration-500`} style={{ width: `${m.percent}%` }} />
                  </div>

                  {/* Expandable Explanation & Fix Details */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2 text-xs animate-fade-in">
                      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Why writers write this:</div>
                        <p className="text-slate-300 text-[11px] leading-relaxed">{m.why}</p>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30 space-y-1">
                        <div className="text-[10px] uppercase font-bold text-emerald-400 flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3" />
                          <span>How BrandGuard fixes it automatically:</span>
                        </div>
                        <p className="text-emerald-200/90 text-[11px] leading-relaxed">{m.fix}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <span className="text-slate-500 font-mono">Governed Rule ID: {m.vaultRule}</span>
                        {onNavigateToTab && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigateToTab('vault');
                            }}
                            className="text-blue-400 hover:text-blue-300 flex items-center space-x-1 font-medium"
                          >
                            <span>Inspect rule in Brand Vault</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Cols): Guideline Ambiguity Heatmap (Leadership Action Hub) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>Guideline Ambiguity Heatmap</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Rules with high creator disputes (tells leadership where policies are confusing).
                </p>
              </div>
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 shrink-0">
                Action Required
              </span>
            </div>

            <div className="space-y-3.5 mt-3">
              {/* Confusing Rule 1 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-amber-300">
                  <span>Rule CLAIM-01: Financial Disclaimers</span>
                  <span className="text-[10px] bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                    34% Dispute Rate
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Writer Confusion:</strong> Copywriters frequently dispute whether cloud pricing savings calculator counts as a regulated financial forecast.
                </p>

                {clarifiedRules.has('CLAIM-01') ? (
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Clarification published to Brand Vault! (Dispute rate dropped to 4%)</span>
                  </div>
                ) : (
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Recommended: Add 3 pre-cleared template phrases.</span>
                    </div>
                    <button
                      onClick={() => handleClarifyRule('CLAIM-01')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-sm shrink-0"
                    >
                      Publish Clarification
                    </button>
                  </div>
                )}
              </div>

              {/* Confusing Rule 2 */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-200">
                  <span>Rule TONE-02: Casual Voice in Social Media</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-slate-300">
                    21% Dispute Rate
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  <strong>Writer Confusion:</strong> Social media managers argue that strict B2B press release tone sounds robotic and hurts viral reach on TikTok and X (Twitter).
                </p>

                {clarifiedRules.has('TONE-02') ? (
                  <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-[11px] flex items-center space-x-1.5 font-medium">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Tiered tone guidelines created for Social vs Enterprise PR!</span>
                  </div>
                ) : (
                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Recommended: Split into Social vs Corporate PR tiers.</span>
                    </div>
                    <button
                      onClick={() => handleClarifyRule('TONE-02')}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition-all shrink-0 border border-slate-700"
                    >
                      Publish Clarification
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-950/20 border border-blue-800/30 text-[11px] text-blue-300 flex items-center space-x-2 mt-2">
            <Info className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              <strong>Continuous Improvement:</strong> Clarifying ambiguous rules permanently prevents repeated violations without blaming authors.
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Departmental Brand Health Leaderboard & Drilldown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Departmental Brand Governance Scorecards</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any department below to view their specific recurring mistakes and take targeted corrective action.
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any department card to drill down ▾
          </span>
        </div>

        {/* 4 Interactive Department Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {departments.map((dept) => {
            const isSelected = selectedDeptId === dept.id;
            return (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`text-left p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-950 border-blue-500 shadow-lg shadow-blue-900/20 ring-1 ring-blue-500/50'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-300 truncate max-w-[140px]">{dept.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${dept.statusColor}`}>
                      {dept.grade}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-white">{dept.score}%</div>
                  <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{dept.auditedStats}</div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className={isSelected ? 'text-blue-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? '● Viewing Details' : 'Click to inspect'}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-blue-400' : 'text-slate-600'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Department Drill-Down Action Drawer */}
        <div className="p-4 sm:p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Department Deep Dive:</span>
                <span className="text-sm font-bold text-white">{activeDept.name}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${activeDept.statusColor}`}>
                  Grade: {activeDept.grade} ({activeDept.score}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{activeDept.description}</p>
            </div>

            {/* Department Actions */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => handleDispatchBrief(activeDept.name)}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send 1-Click Style Brief</span>
              </button>

              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('studio')}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition-all shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Test in Studio</span>
                </button>
              )}
            </div>
          </div>

          {/* Top 3 Issues For This Specific Department */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300">
              Top 3 Recurring Mistakes From {activeDept.name}:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              {activeDept.topIssues.map((issue, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-start space-x-2">
                  <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 text-[11px] leading-relaxed">{issue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Stage in Governance Lifecycle */}
      {onNavigateToTab && (
        <NextStageNavigator
          currentStageNumber={6}
          totalStages={6}
          currentStageName="Governance Analytics & ROI Intelligence"
          prevTab="review"
          prevTabName="Review Hub"
          nextTab="vault"
          nextTabName="Brand Vault (Rules & Policy Ledger)"
          nextTabDescription="Explore the single source of truth: verified factual SLA ledger, deprecated terminology glossary, and brand voice guidelines."
          nextTabIcon={Database}
          onNavigate={onNavigateToTab}
          recommendedAction="Customize verified SLA claims and deprecated terms directly in the Brand Vault."
        />
      )}

      {/* Executive Report Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative space-y-4 my-auto max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Executive Governance Summary Report</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Ready-to-present briefing for Chief Marketing Officer, Chief Legal Officer, and Board Governance Committee.
            </p>

            {/* Formatted Summary Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono space-y-2 max-h-72 overflow-y-auto leading-relaxed">
              <div className="text-blue-400 font-bold">INKLOOM BRANDGUARD PRE-PUBLICATION GOVERNANCE</div>
              <div className="text-slate-500">Timeframe: {currentMetrics.label} | Generated: {new Date().toLocaleDateString()}</div>
              <div className="border-b border-slate-800 my-2" />
              <div>• Review Turnaround: <strong className="text-white">{currentMetrics.reviewCycle}</strong> ({currentMetrics.cycleDelta} vs {currentMetrics.baselineHours})</div>
              <div>• Total Content Governed: <strong className="text-white">{currentMetrics.totalDrafts}</strong> across {currentMetrics.departmentsCovered}</div>
              <div>• High-Risk Liabilities Caught: <strong className="text-red-400">{currentMetrics.flagsCaught}</strong> ({currentMetrics.riskAvoidanceDollars} legal exposure avoided)</div>
              <div>• Company Brand Fidelity Grade: <strong className="text-emerald-400">{currentMetrics.avgCompliance}</strong> ({currentMetrics.complianceDelta})</div>
              <div className="border-b border-slate-800 my-2" />
              <div className="text-slate-400 font-bold">Top Repeated Violations:</div>
              <div>1. Unsupported Promotional Claims: 42% (264 flags)</div>
              <div>2. Deprecated Terminology: 28% (176 flags)</div>
              <div>3. Inappropriate Tone & Slang: 18% (113 flags)</div>
              <div>4. Factual Metrics Drift: 12% (75 flags)</div>
              <div className="border-b border-slate-800 my-2" />
              <div className="text-slate-400 font-bold">Department Scorecard:</div>
              <div>• Corporate PR: 96.8% (Grade A+ - Passing)</div>
              <div>• Sales/SDR Outbound: 76.2% (Grade C - Moderate Risk)</div>
              <div>• Growth Paid Social: 71.5% (Grade C- - Needs Attention)</div>
              <div>• External Agencies: 62.4% (Grade D+ - High Risk)</div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={handleCopyReport}
                className="flex items-center space-x-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                {hasCopiedReport ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedReport ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
              </button>

              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
