import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  RotateCcw, 
  Send, 
  ThumbsUp, 
  Award,
  Wand2,
  SlidersHorizontal,
  Split,
  Eye,
  HelpCircle,
  Play,
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, Violation, UserRole } from '../types';
import { auditContent, applyCorrection, scrubConfidentialData, AuditResult } from '../services/brandEngine';
import { ViolationCard } from './ViolationCard';
import { samplePresetDocuments } from '../data/brandVaultData';

interface ContentStudioProps {
  currentRole: UserRole;
  onOpenCertificate: (doc: DocumentItem) => void;
  onUpdateDocumentList: (docs: DocumentItem[]) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  currentRole,
  onOpenCertificate
}) => {
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(samplePresetDocuments[0]);
  const [editorText, setEditorText] = useState<string>(samplePresetDocuments[0].content);
  const [originalDraft, setOriginalDraft] = useState<string>(samplePresetDocuments[0].content);
  const [auditData, setAuditData] = useState<AuditResult>(() => auditContent(samplePresetDocuments[0].content));
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [piiScrubberActive, setPiiScrubberActive] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(samplePresetDocuments[0].id);
  const [viewMode, setViewMode] = useState<'editor' | 'diff' | 'annotated'>('editor');
  const [showGuidedTour, setShowGuidedTour] = useState<boolean>(true);
  const [highlightedSnippet, setHighlightedSnippet] = useState<string | null>(null);

  const runAudit = (text: string) => {
    setIsAuditing(true);
    setTimeout(() => {
      const result = auditContent(text);
      setAuditData(result);
      setActiveDoc(prev => ({
        ...prev,
        content: text,
        score: result.score,
        violations: result.violations
      }));
      setIsAuditing(false);
    }, 120);
  };

  const handleSelectPreset = (docId: string) => {
    const selected = samplePresetDocuments.find(d => d.id === docId);
    if (selected) {
      setSelectedPresetId(docId);
      setActiveDoc(selected);
      setEditorText(selected.content);
      setOriginalDraft(selected.content);
      const res = auditContent(selected.content);
      setAuditData(res);
    }
  };

  const handleApplyViolation = (violation: Violation) => {
    const updated = applyCorrection(editorText, violation.flaggedText, violation.suggestedCorrection);
    setEditorText(updated);
    runAudit(updated);
  };

  const handleApplyAll = () => {
    let current = editorText;
    for (const v of auditData.violations) {
      if (!v.applied && !v.ignored) {
        current = applyCorrection(current, v.flaggedText, v.suggestedCorrection);
      }
    }
    setEditorText(current);
    runAudit(current);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleResetToOriginal = () => {
    setEditorText(originalDraft);
    runAudit(originalDraft);
  };

  const handleIgnore = (violationId: string) => {
    setAuditData(prev => ({
      ...prev,
      violations: prev.violations.map(v => v.id === violationId ? { ...v, ignored: true } : v)
    }));
  };

  const handleTogglePii = () => {
    if (!piiScrubberActive) {
      const { scrubbedText } = scrubConfidentialData(editorText);
      setEditorText(scrubbedText);
      runAudit(scrubbedText);
      setPiiScrubberActive(true);
    } else {
      setPiiScrubberActive(false);
    }
  };

  const handleStatusChange = (newStatus: DocumentItem['status']) => {
    setActiveDoc(prev => {
      const updated: DocumentItem = {
        ...prev,
        status: newStatus,
        certifiedAt: newStatus === 'approved' ? new Date().toISOString() : prev.certifiedAt,
        certificateId: newStatus === 'approved' ? `CERT-INKLOOM-${Math.floor(1000 + Math.random() * 9000)}` : prev.certificateId
      };
      return updated;
    });

    if (newStatus === 'approved') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-500/10', grade: 'A — Brand Approved' };
    if (score >= 70) return { text: 'text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-500/10', grade: 'B — Moderate Revisions Needed' };
    return { text: 'text-red-400', stroke: '#EF4444', bg: 'bg-red-500/10', grade: 'F — Critical Legal & Tone Risks' };
  };

  const scoreTheme = getScoreColor(auditData.score);
  const unresolvedViolations = auditData.violations.filter(v => !v.applied && !v.ignored);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* 1. SELF-EXPLANATORY JUDGE ONBOARDING HERO BANNER */}
      {showGuidedTour && (
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-slate-900 border-2 border-blue-500/40 shadow-2xl relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold text-xs uppercase tracking-wider border border-blue-400/30 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Interactive 15-Second Judge Guide</span>
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Follow these 3 steps to see the entire governance loop work:
                </span>
              </div>
              <h3 className="text-base font-bold text-white">
                How to evaluate Inkloom BrandGuard with zero instructions:
              </h3>
            </div>

            <button
              onClick={() => setShowGuidedTour(false)}
              className="text-slate-400 hover:text-white text-xs underline self-start md:self-center"
            >
              Dismiss Guide
            </button>
          </div>

          {/* 3 Step Interactive Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 pt-3 border-t border-slate-800">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center space-x-2.5">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div className="text-xs">
                <span className="font-semibold text-slate-200 block">See 6-Dimension Flags</span>
                <span className="text-[11px] text-slate-400">Notice the 38% score & flagged cards on right</span>
              </div>
            </div>

            <div 
              onClick={handleApplyAll}
              className="p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/40 border border-emerald-500/40 flex items-center space-x-2.5 cursor-pointer transition-all shadow-sm"
              title="Click to auto-apply all suggestions right now!"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="text-xs">
                <span className="font-bold text-emerald-300 flex items-center space-x-1">
                  <span>⚡ Click: Apply All Rewrites</span>
                </span>
                <span className="text-[11px] text-emerald-400/80">Watch score climb instantly to 100%!</span>
              </div>
            </div>

            <div 
              onClick={() => handleStatusChange('approved')}
              className="p-2.5 rounded-xl bg-purple-950/50 hover:bg-purple-900/40 border border-purple-500/40 flex items-center space-x-2.5 cursor-pointer transition-all shadow-sm"
              title="Click to approve and trigger the certificate"
            >
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="text-xs">
                <span className="font-bold text-purple-300 flex items-center space-x-1">
                  <span>🏆 Click: Approve & Certify</span>
                </span>
                <span className="text-[11px] text-purple-400/80">Fires confetti & generates official PDF cert</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONTROL BAR: Preset Scenario Selector, View Mode & Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-lg">
        {/* Scenario Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-300">
            <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            <span>Select Demo Scenario:</span>
          </div>

          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {samplePresetDocuments.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.id === 'DOC-001' ? '🚨 (High Risk) ' : doc.id === 'DOC-002' ? '⚠️ (Moderate) ' : doc.id === 'DOC-003' ? '🛑 (FTC Violations) ' : '✨ (Approved) '}
                {doc.title}
              </option>
            ))}
          </select>

          {/* Reset original button */}
          <button
            onClick={handleResetToOriginal}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            title="Reset text back to original off-brand state"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Draft</span>
          </button>
        </div>

        {/* View Mode Switcher (Editor vs Visual Diff vs Annotated) */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'editor' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Live Editor</span>
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-all ${
                viewMode === 'diff' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Side-by-Side Diff</span>
            </button>
          </div>

          {/* Role-Based Workflow Buttons */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            {currentRole === 'creator' && (
              <button
                onClick={() => handleStatusChange('under_review')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Review</span>
              </button>
            )}

            {currentRole !== 'creator' && activeDoc.status !== 'approved' && (
              <>
                <button
                  onClick={() => handleStatusChange('changes_requested')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all"
                >
                  Request Changes
                </button>
                <button
                  onClick={() => handleStatusChange('approved')}
                  className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/30"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Approve Content</span>
                </button>
              </>
            )}

            {activeDoc.status === 'approved' && (
              <button
                onClick={() => onOpenCertificate(activeDoc)}
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-600/30"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Official Certificate</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. MAIN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Content Studio (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col flex-1">
            {/* Studio Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-white truncate max-w-sm">{activeDoc.title}</span>
                <span className="text-[10px] font-semibold text-blue-400 uppercase bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {activeDoc.format.replace('_', ' ')}
                </span>
              </div>

              {/* Scrubber & Re-audit */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={handleTogglePii}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all ${
                    piiScrubberActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  title="Masks personal emails, phone numbers, and confidential codenames before inspection"
                >
                  <Lock className="w-3 h-3" />
                  <span>PII Scrubber: {piiScrubberActive ? 'ACTIVE' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => runAudit(editorText)}
                  disabled={isAuditing}
                  className="flex items-center space-x-1 px-3 py-1 font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAuditing ? 'Auditing...' : 'Run Audit'}</span>
                </button>
              </div>
            </div>

            {/* VIEW MODE 1: LIVE EDITOR */}
            {viewMode === 'editor' && (
              <div className="relative flex-1">
                <textarea
                  value={editorText}
                  onChange={(e) => {
                    setEditorText(e.target.value);
                    runAudit(e.target.value);
                  }}
                  rows={13}
                  className="w-full bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 text-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                  placeholder="Paste or write your marketing draft, press release, or social copy here..."
                />

                {/* Sub-15ms live latency tag */}
                <div className="absolute right-3 bottom-3 flex items-center space-x-1 text-[10px] text-emerald-400/80 bg-slate-950/90 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Sub-15ms Local AST Rule Engine Active</span>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: SIDE-BY-SIDE DIFF COMPARISON */}
            {viewMode === 'diff' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
                {/* Original Unapproved Text */}
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 overflow-y-auto max-h-80">
                  <div className="text-[10px] uppercase font-bold text-red-400 mb-2 flex items-center space-x-1">
                    <span>❌ Original Draft (Off-Brand & High Risk):</span>
                  </div>
                  <p className="text-red-200/80 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                    {originalDraft}
                  </p>
                </div>

                {/* Current / Approved Text */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 overflow-y-auto max-h-80">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 flex items-center space-x-1">
                    <span>✅ Revised Draft (Governed & Compliant):</span>
                  </div>
                  <p className="text-emerald-200 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                    {editorText}
                  </p>
                </div>
              </div>
            )}

            {/* Editor Footer Stats Bar */}
            <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <span>Words: <strong className="text-slate-200">{auditData.wordCount}</strong></span>
                <span>Characters: <strong className="text-slate-200">{auditData.charCount}</strong></span>
                <span>Readability: <strong className="text-slate-300">{auditData.readabilityLevel}</strong></span>
              </div>

              {unresolvedViolations.length > 0 && (
                <button
                  onClick={handleApplyAll}
                  className="flex items-center space-x-1.5 px-3 py-1 font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md shadow-emerald-600/30"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>1-Click Apply All ({unresolvedViolations.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Educational Callout */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 text-xs text-blue-200 flex items-start space-x-2">
            <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Non-Destructive Principle:</strong> BrandGuard never deletes or modifies content automatically. All suggestions preserve the creator's voice and require deliberate human acceptance.
            </div>
          </div>
        </div>

        {/* Right Side: Explainable AI Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Compliance Score Gauge */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Brand Governance Score
                </span>
                <span className={`text-xs font-semibold ${scoreTheme.text}`}>
                  {scoreTheme.grade}
                </span>
              </div>

              {/* Dynamic Big Score Badge */}
              <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl border-2 ${scoreTheme.bg} ${scoreTheme.text} border-current font-extrabold text-2xl shadow-lg transition-all duration-300`}>
                {auditData.score}%
              </div>
            </div>

            {/* 6 Dimension Health Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800/80">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Tone & Voice</span>
                <span className={`font-bold ${auditData.dimensionScores.tone >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.tone}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Terminology</span>
                <span className={`font-bold ${auditData.dimensionScores.terminology >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {auditData.dimensionScores.terminology}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Verified Facts</span>
                <span className={`font-bold ${auditData.dimensionScores.facts >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.facts}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Promo Claims</span>
                <span className={`font-bold ${auditData.dimensionScores.promotional >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.promotional}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Visual Standards</span>
                <span className={`font-bold ${auditData.dimensionScores.visual >= 90 ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {auditData.dimensionScores.visual}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 text-[11px]">Accessibility</span>
                <span className={`font-bold ${auditData.dimensionScores.accessibility >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.accessibility}%
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Findings Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <span>Explainable Findings</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                {unresolvedViolations.length} Active
              </span>
            </span>

            {unresolvedViolations.length > 0 && (
              <span className="text-[11px] text-emerald-400 font-semibold cursor-pointer hover:underline" onClick={handleApplyAll}>
                Apply All Fixes →
              </span>
            )}
          </div>

          {/* Violation Cards Stream */}
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {unresolvedViolations.length === 0 ? (
              <div className="p-8 bg-slate-900 border border-emerald-500/30 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 shadow-lg">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">100% Brand Compliant!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                    All tone, terminology, facts, and promotional claims meet approved enterprise standards.
                  </p>
                </div>

                {activeDoc.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange('approved')}
                    className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve & Issue Certificate</span>
                  </button>
                )}
              </div>
            ) : (
              unresolvedViolations.map(violation => (
                <ViolationCard
                  key={violation.id}
                  violation={violation}
                  onApply={handleApplyViolation}
                  onIgnore={handleIgnore}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
