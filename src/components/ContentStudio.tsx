import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  CheckCircle, 
  Lock, 
  RotateCcw, 
  Send, 
  ThumbsUp, 
  Award,
  Wand2,
  SlidersHorizontal,
  Split,
  RefreshCw
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
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor');

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
    }, 100);
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
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 }
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
    if (score >= 90) return { text: 'text-emerald-400', stroke: '#10B981', bg: 'bg-emerald-500/10', grade: 'Compliant' };
    if (score >= 70) return { text: 'text-amber-400', stroke: '#F59E0B', bg: 'bg-amber-500/10', grade: 'Revisions Needed' };
    return { text: 'text-red-400', stroke: '#EF4444', bg: 'bg-red-500/10', grade: 'Risks Detected' };
  };

  const scoreTheme = getScoreColor(auditData.score);
  const unresolvedViolations = auditData.violations.filter(v => !v.applied && !v.ignored);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Top Action Toolbar (Clean, minimal, single row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Left: Preset Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Scenario:</span>
          <select
            value={selectedPresetId}
            onChange={(e) => handleSelectPreset(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {samplePresetDocuments.map(doc => (
              <option key={doc.id} value={doc.id}>
                {doc.title} ({doc.format.replace('_', ' ')})
              </option>
            ))}
          </select>

          <button
            onClick={handleResetToOriginal}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg transition-colors"
            title="Reset text back to original draft"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden md:inline">Reset</span>
          </button>
        </div>

        {/* Right: View Toggle & Role-Based Actions */}
        <div className="flex items-center space-x-2">
          {/* Editor vs Diff toggle */}
          <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'editor' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => setViewMode('diff')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                viewMode === 'diff' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>Diff</span>
            </button>
          </div>

          {/* Workflow Action Buttons */}
          {currentRole === 'creator' && (
            <button
              onClick={() => handleStatusChange('under_review')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit for Review</span>
            </button>
          )}

          {currentRole !== 'creator' && activeDoc.status !== 'approved' && (
            <button
              onClick={() => handleStatusChange('approved')}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Approve Content</span>
            </button>
          )}

          {activeDoc.status === 'approved' && (
            <button
              onClick={() => onOpenCertificate(activeDoc)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Content Editor (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col flex-1">
            {/* Editor Sub-Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-white truncate max-w-sm">{activeDoc.title}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleTogglePii}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-md border transition-all text-[11px] ${
                    piiScrubberActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                  title="Mask personal emails, phone numbers, and codenames"
                >
                  <Lock className="w-3 h-3" />
                  <span>PII Masking: {piiScrubberActive ? 'ON' : 'OFF'}</span>
                </button>

                <button
                  onClick={() => runAudit(editorText)}
                  disabled={isAuditing}
                  className="flex items-center space-x-1 px-2.5 py-1 font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-all disabled:opacity-50 text-[11px]"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{isAuditing ? 'Scanning...' : 'Re-Scan'}</span>
                </button>
              </div>
            </div>

            {/* Mode 1: Live Text Editor */}
            {viewMode === 'editor' && (
              <div className="relative flex-1">
                <textarea
                  value={editorText}
                  onChange={(e) => {
                    setEditorText(e.target.value);
                    runAudit(e.target.value);
                  }}
                  rows={14}
                  className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500/60 resize-y"
                  placeholder="Paste or write your content here..."
                />
              </div>
            )}

            {/* Mode 2: Side-by-Side Diff Comparison */}
            {viewMode === 'diff' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
                <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 overflow-y-auto max-h-80">
                  <div className="text-[10px] uppercase font-bold text-red-400 mb-2">
                    Original Draft (Off-Brand):
                  </div>
                  <p className="text-red-200/80 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                    {originalDraft}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 overflow-y-auto max-h-80">
                  <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2">
                    Revised Draft (Compliant):
                  </div>
                  <p className="text-emerald-200 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                    {editorText}
                  </p>
                </div>
              </div>
            )}

            {/* Editor Footer Stats */}
            <div className="flex flex-wrap items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-xs text-slate-400">
              <div className="flex items-center space-x-4">
                <span>Words: <strong className="text-slate-200">{auditData.wordCount}</strong></span>
                <span>Characters: <strong className="text-slate-200">{auditData.charCount}</strong></span>
                <span className="hidden sm:inline">Readability: <strong className="text-slate-300">{auditData.readabilityLevel}</strong></span>
              </div>

              {unresolvedViolations.length > 0 && (
                <button
                  onClick={handleApplyAll}
                  className="flex items-center space-x-1.5 px-3 py-1 font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply All Fixes ({unresolvedViolations.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Explainable Findings & Score (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-3">
          {/* Score Header */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Compliance Score
                </span>
                <span className={`text-xs font-semibold ${scoreTheme.text}`}>
                  {scoreTheme.grade}
                </span>
              </div>

              <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 ${scoreTheme.bg} ${scoreTheme.text} border-current font-extrabold text-2xl shadow-md`}>
                {auditData.score}%
              </div>
            </div>

            {/* 6 Dimension Health Pills */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-2 border-t border-slate-800/80">
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Tone</span>
                <span className={`font-bold ${auditData.dimensionScores.tone >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.tone}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Terminology</span>
                <span className={`font-bold ${auditData.dimensionScores.terminology >= 90 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                  {auditData.dimensionScores.terminology}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Facts</span>
                <span className={`font-bold ${auditData.dimensionScores.facts >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.facts}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Claims</span>
                <span className={`font-bold ${auditData.dimensionScores.promotional >= 90 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {auditData.dimensionScores.promotional}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Visuals</span>
                <span className={`font-bold ${auditData.dimensionScores.visual >= 90 ? 'text-emerald-400' : 'text-pink-400'}`}>
                  {auditData.dimensionScores.visual}%
                </span>
              </div>
              <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-slate-400 block text-[10px]">Accessibility</span>
                <span className={`font-bold ${auditData.dimensionScores.accessibility >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {auditData.dimensionScores.accessibility}%
                </span>
              </div>
            </div>
          </div>

          {/* Actionable Findings Header */}
          <div className="flex items-center justify-between px-1 text-xs">
            <span className="font-bold text-slate-300 uppercase tracking-wider">
              Findings ({unresolvedViolations.length})
            </span>

            {unresolvedViolations.length > 0 && (
              <button 
                onClick={handleApplyAll} 
                className="text-emerald-400 font-semibold hover:underline"
              >
                Apply All Fixes →
              </button>
            )}
          </div>

          {/* Violations List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1">
            {unresolvedViolations.length === 0 ? (
              <div className="p-8 bg-slate-900 border border-emerald-500/20 rounded-2xl text-center flex flex-col items-center justify-center space-y-3 shadow-md">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">100% Brand Compliant!</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Content passes all tone, terminology, facts, and promotional guidelines.
                  </p>
                </div>

                {activeDoc.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange('approved')}
                    className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-md flex items-center space-x-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve & Certify</span>
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
