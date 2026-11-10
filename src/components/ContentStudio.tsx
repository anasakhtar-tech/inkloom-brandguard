import React, { useState, useEffect } from 'react';
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
  MessageSquare, 
  Award,
  Layers,
  Wand2,
  Copy,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, Violation, UserRole, Dimension } from '../types';
import { auditContent, applyCorrection, scrubConfidentialData, AuditResult } from '../services/brandEngine';
import { ViolationCard } from './ViolationCard';
import { samplePresetDocuments, initialVisualRules } from '../data/brandVaultData';

interface ContentStudioProps {
  currentRole: UserRole;
  onOpenCertificate: (doc: DocumentItem) => void;
  onUpdateDocumentList: (docs: DocumentItem[]) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  currentRole,
  onOpenCertificate,
  onUpdateDocumentList
}) => {
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(samplePresetDocuments[0]);
  const [editorText, setEditorText] = useState<string>(samplePresetDocuments[0].content);
  const [auditData, setAuditData] = useState<AuditResult>(() => auditContent(samplePresetDocuments[0].content));
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [piiScrubberActive, setPiiScrubberActive] = useState<boolean>(false);
  const [activeColors, setActiveColors] = useState<string[]>(['#0F172A', '#2563EB']);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(samplePresetDocuments[0].id);

  // Re-run audit when editor text changes
  const runAudit = (text: string, colors = activeColors) => {
    setIsAuditing(true);
    setTimeout(() => {
      const result = auditContent(text, colors);
      setAuditData(result);
      setActiveDoc(prev => ({
        ...prev,
        content: text,
        score: result.score,
        violations: result.violations
      }));
      setIsAuditing(false);
    }, 150);
  };

  // Change preset document
  const handleSelectPreset = (docId: string) => {
    const selected = samplePresetDocuments.find(d => d.id === docId);
    if (selected) {
      setSelectedPresetId(docId);
      setActiveDoc(selected);
      setEditorText(selected.content);
      const res = auditContent(selected.content, activeColors);
      setAuditData(res);
    }
  };

  // Apply single violation correction
  const handleApplyViolation = (violation: Violation) => {
    const updated = applyCorrection(editorText, violation.flaggedText, violation.suggestedCorrection);
    setEditorText(updated);
    runAudit(updated);
  };

  // Apply all suggestions in one click
  const handleApplyAll = () => {
    let current = editorText;
    for (const v of auditData.violations) {
      if (!v.applied && !v.ignored) {
        current = applyCorrection(current, v.flaggedText, v.suggestedCorrection);
      }
    }
    setEditorText(current);
    runAudit(current);
  };

  // Handle ignore/exemption
  const handleIgnore = (violationId: string) => {
    setAuditData(prev => ({
      ...prev,
      violations: prev.violations.map(v => v.id === violationId ? { ...v, ignored: true } : v)
    }));
  };

  // Toggle PII Scrubber
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

  // Workflow actions
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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return { text: 'text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-500/10' };
    if (score >= 70) return { text: 'text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-500/10' };
    return { text: 'text-red-400', stroke: '#EF4444', bg: 'bg-red-500/10' };
  };

  const scoreTheme = getScoreColor(auditData.score);
  const unresolvedViolations = auditData.violations.filter(v => !v.applied && !v.ignored);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Controls: Preset selector & Workflow Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Demo Scenarios:</span>
          </span>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {samplePresetDocuments.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.format.replace('_', ' ')})
              </option>
            ))}
          </select>

          {/* Document Status Tag */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Status:</span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border uppercase tracking-wider ${
              activeDoc.status === 'approved' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : activeDoc.status === 'under_review'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : activeDoc.status === 'changes_requested'
                ? 'bg-red-500/10 text-red-400 border-red-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700'
            }`}>
              {activeDoc.status.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Right side: Action triggers according to role */}
        <div className="flex items-center space-x-2">
          {currentRole === 'creator' && (
            <button
              onClick={() => handleStatusChange('under_review')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Brand Review</span>
            </button>
          )}

          {currentRole === 'reviewer' && (
            <>
              <button
                onClick={() => handleStatusChange('changes_requested')}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/30 transition-all"
              >
                <span>Request Revisions</span>
              </button>
              <button
                onClick={() => handleStatusChange('approved')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Approve Content</span>
              </button>
            </>
          )}

          {currentRole === 'legal' && (
            <button
              onClick={() => handleStatusChange('approved')}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Grant Legal Sign-Off</span>
            </button>
          )}

          {activeDoc.status === 'approved' && (
            <button
              onClick={() => onOpenCertificate(activeDoc)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>View Audit Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Content Editor (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col flex-1">
            {/* Editor Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-white">{activeDoc.title}</span>
              </div>

              {/* Scrubber & Formatting Controls */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleTogglePii}
                  className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                    piiScrubberActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  title="Automatically mask personal emails, phone numbers, and confidential codenames before inspection"
                >
                  <Lock className="w-3 h-3" />
                  <span>PII Masking: {piiScrubberActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => runAudit(editorText)}
                  disabled={isAuditing}
                  className="flex items-center space-x-1 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAuditing ? 'Auditing...' : 'Re-Audit'}</span>
                </button>
              </div>
            </div>

            {/* Live Textarea Editor */}
            <div className="relative flex-1">
              <textarea
                value={editorText}
                onChange={(e) => {
                  setEditorText(e.target.value);
                  runAudit(e.target.value);
                }}
                rows={14}
                className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-y"
                placeholder="Paste or write your marketing draft, press release, blog post, or social copy here..."
              />
            </div>

            {/* Editor Footer: Word Count, Char Count, Readability Level */}
            <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <span>Words: <strong className="text-slate-200">{auditData.wordCount}</strong></span>
                <span>Characters: <strong className="text-slate-200">{auditData.charCount}</strong></span>
                <span className="hidden sm:inline">Format: <strong className="text-blue-400 uppercase">{activeDoc.format}</strong></span>
              </div>
              <div className="text-slate-400">
                Readability: <strong className="text-slate-300">{auditData.readabilityLevel}</strong>
              </div>
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>
                <strong>Inkloom Non-Punitive Philosophy:</strong> Content is not blocked. All suggestions explain the brand rule and preserve your narrative voice.
              </span>
            </div>
            {unresolvedViolations.length > 0 && (
              <button
                onClick={handleApplyAll}
                className="flex-shrink-0 ml-3 flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold bg-emerald-600/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-600/30 rounded-lg transition-all"
              >
                <Wand2 className="w-3 h-3" />
                <span>Apply All ({unresolvedViolations.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Explainable AI Inspector (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Score Card & 6-Dimension Health */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Brand Compliance Score</h3>
                <p className="text-xs text-slate-400">Evaluated across 6 governance dimensions</p>
              </div>

              {/* Circular Score Badge */}
              <div className={`flex items-center justify-center w-16 h-16 rounded-2xl border-2 ${scoreTheme.bg} ${scoreTheme.text} border-current font-bold text-2xl shadow-lg`}>
                {auditData.score}%
              </div>
            </div>

            {/* 6 Dimension Pills */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Tone & Voice</span>
                <span className={`font-semibold ${auditData.dimensionScores.tone >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.tone}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Terminology</span>
                <span className={`font-semibold ${auditData.dimensionScores.terminology >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {auditData.dimensionScores.terminology}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Verified Facts</span>
                <span className={`font-semibold ${auditData.dimensionScores.facts >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.facts}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Promo Claims</span>
                <span className={`font-semibold ${auditData.dimensionScores.promotional >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.promotional}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Visual Rules</span>
                <span className={`font-semibold ${auditData.dimensionScores.visual >= 90 ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {auditData.dimensionScores.visual}%
                </span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400">Accessibility</span>
                <span className={`font-semibold ${auditData.dimensionScores.accessibility >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.accessibility}%
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Findings Header */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Explainable Findings ({unresolvedViolations.length} Active)
            </span>
            <span className="text-[11px] text-slate-500">
              Preserves author purpose
            </span>
          </div>

          {/* Violations List */}
          <div className="space-y-3 overflow-y-auto max-h-[520px] pr-1">
            {unresolvedViolations.length === 0 ? (
              <div className="p-8 bg-slate-900 border border-emerald-500/20 rounded-2xl text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">All Clear — 100% Brand Compliant</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    This content passes all tone, terminology, facts, promotional claims, and accessibility checks.
                  </p>
                </div>
                {activeDoc.status !== 'approved' && currentRole !== 'creator' && (
                  <button
                    onClick={() => handleStatusChange('approved')}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md shadow-emerald-600/20"
                  >
                    Grant Official Approval
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
