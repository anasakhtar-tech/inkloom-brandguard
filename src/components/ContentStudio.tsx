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
  RefreshCw,
  Plus,
  Edit3,
  Palette
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, Violation, UserRole } from '../types';
import { auditContent, applyCorrection, scrubConfidentialData, AuditResult } from '../services/brandEngine';
import { ViolationCard } from './ViolationCard';
import { samplePresetDocuments } from '../data/brandVaultData';
import { NextStageNavigator } from './NextStageNavigator';

interface ContentStudioProps {
  currentRole: UserRole;
  onOpenCertificate: (doc: DocumentItem) => void;
  onUpdateDocumentList: (docs: DocumentItem[]) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ContentStudio: React.FC<ContentStudioProps> = ({
  currentRole,
  onOpenCertificate,
  onNavigateToTab
}) => {
  const [activeDoc, setActiveDoc] = useState<DocumentItem>(samplePresetDocuments[0]);
  const [docTitle, setDocTitle] = useState<string>(samplePresetDocuments[0].title);
  const [editorText, setEditorText] = useState<string>(samplePresetDocuments[0].content);
  const [originalDraft, setOriginalDraft] = useState<string>(samplePresetDocuments[0].content);
  const [auditData, setAuditData] = useState<AuditResult>(() => auditContent(samplePresetDocuments[0].content));
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [piiScrubberActive, setPiiScrubberActive] = useState<boolean>(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(samplePresetDocuments[0].id);
  const [viewMode, setViewMode] = useState<'editor' | 'diff'>('editor');
  const [hasAppliedFixes, setHasAppliedFixes] = useState<boolean>(false);

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
      setDocTitle(selected.title);
      setEditorText(selected.content);
      setOriginalDraft(selected.content);
      setHasAppliedFixes(false);
      setViewMode('editor');
      const res = auditContent(selected.content);
      setAuditData(res);
    }
  };

  const handleCreateNewDoc = () => {
    const defaultTitle = 'My Custom Document';
    const newDoc: DocumentItem = {
      id: `custom-${Date.now()}`,
      title: defaultTitle,
      format: 'blog_post',
      content: '',
      status: 'draft',
      score: 100,
      violations: [],
      comments: [],
      author: 'Creator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSelectedPresetId('custom');
    setActiveDoc(newDoc);
    setDocTitle(defaultTitle);
    setEditorText('');
    setOriginalDraft('');
    setHasAppliedFixes(false);
    setViewMode('editor');
    const res = auditContent('');
    setAuditData(res);
  };

  const handleTitleChange = (newTitle: string) => {
    setDocTitle(newTitle);
    setActiveDoc(prev => ({
      ...prev,
      title: newTitle || 'Untitled Document'
    }));
  };

  const handleApplyViolation = (violation: Violation) => {
    // Lock in the original unedited text before applying the first fix
    if (!hasAppliedFixes || !originalDraft.trim()) {
      setOriginalDraft(editorText);
      setHasAppliedFixes(true);
    }
    const updated = applyCorrection(editorText, violation.flaggedText, violation.suggestedCorrection);
    setEditorText(updated);
    runAudit(updated);
  };

  const handleApplyAll = () => {
    // Lock in the original unedited text before applying the fixes
    if (!hasAppliedFixes || !originalDraft.trim()) {
      setOriginalDraft(editorText);
      setHasAppliedFixes(true);
    }
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
    if (originalDraft && originalDraft.trim()) {
      setEditorText(originalDraft);
      setHasAppliedFixes(false);
      setViewMode('editor');
      runAudit(originalDraft);
    }
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
  const hasChanges = Boolean(
    originalDraft.trim() && 
    editorText.trim() && 
    editorText.trim() !== originalDraft.trim()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      {/* Top Action Toolbar (Clean, minimal, single row) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        {/* Left: Preset Selector & New Doc Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto min-w-0">
          <div className="flex items-center gap-2 w-full sm:w-auto min-w-0">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap shrink-0">Scenario:</span>
            <select
              value={selectedPresetId}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  handleCreateNewDoc();
                } else {
                  handleSelectPreset(e.target.value);
                }
              }}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 sm:flex-initial min-w-0 max-w-full sm:max-w-xs md:max-w-sm truncate"
            >
              <optgroup label="Sample Presets">
                {samplePresetDocuments.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.title} ({doc.format.replace('_', ' ')})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Custom Document">
                <option value="__new__">+ Blank Custom Document</option>
                {selectedPresetId === 'custom' && (
                  <option value="custom">Current: {docTitle || 'Untitled Document'}</option>
                )}
              </optgroup>
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCreateNewDoc}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg transition-colors font-medium shadow-sm hover:bg-emerald-900/40"
              title="Create a new blank document to enter and audit your own custom text"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doc</span>
            </button>

            <button
              onClick={handleResetToOriginal}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800 rounded-lg transition-colors"
              title="Reset text back to original draft"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden md:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Right: View Toggle & Role-Based Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Editor vs Diff toggle (Diff is only enabled when text changes exist) */}
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
              onClick={() => {
                if (hasChanges) setViewMode('diff');
              }}
              disabled={!hasChanges}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md transition-all ${
                !hasChanges
                  ? 'text-slate-600 opacity-40 cursor-not-allowed'
                  : viewMode === 'diff'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
              title={
                hasChanges
                  ? "Compare original draft with revised compliant copy"
                  : "Apply suggestions or edit text first to enable diff comparison"
              }
            >
              <Split className="w-3.5 h-3.5" />
              <span>Diff</span>
              {hasChanges && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5"></span>}
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 mb-2.5 border-b border-slate-800 text-xs">
              <div className="flex items-center space-x-2 flex-1 mr-0 sm:mr-2">
                <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="relative flex items-center group max-w-sm sm:max-w-md w-full">
                  <input
                    type="text"
                    value={docTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter document title..."
                    className="w-full bg-slate-950/40 hover:bg-slate-950/80 focus:bg-slate-950 text-white font-semibold text-xs sm:text-sm px-2.5 py-1 rounded-md border border-slate-800/60 hover:border-slate-700 focus:border-blue-500 focus:outline-none transition-all truncate pr-7"
                    title="Click to rename document"
                  />
                  <Edit3 className="w-3.5 h-3.5 text-slate-500 absolute right-2 pointer-events-none group-hover:text-blue-400 transition-colors" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
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

            {/* Prominent Quick Stats & Top Primary Action Bar (Right above the text editor) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 mb-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs text-slate-400">
              <div className="flex items-center space-x-3 text-[11px]">
                <span>Words: <strong className="text-slate-200">{auditData.wordCount}</strong></span>
                <span>Characters: <strong className="text-slate-200">{auditData.charCount}</strong></span>
                <span className="hidden sm:inline">Readability: <strong className="text-slate-300">{auditData.readabilityLevel}</strong></span>
              </div>

              {unresolvedViolations.length > 0 ? (
                <button
                  onClick={handleApplyAll}
                  className="flex items-center space-x-1.5 px-3 py-1 font-semibold text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-md shadow-emerald-950/60"
                  title="Apply context-preserving rewrites for all detected issues"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply All Fixes ({unresolvedViolations.length})</span>
                </button>
              ) : (
                <div className="flex items-center space-x-1 text-emerald-400 text-[11px] font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>All Suggestions Applied</span>
                </div>
              )}
            </div>

            {/* Mode 1: Live Text Editor */}
            {viewMode === 'editor' && (
              <div className="relative flex-1">
                <textarea
                  value={editorText}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditorText(val);
                    // Keep original draft in sync while authoring custom text before any fixes are applied
                    if (!hasAppliedFixes && selectedPresetId === 'custom') {
                      setOriginalDraft(val);
                    }
                    runAudit(val);
                  }}
                  rows={14}
                  className="w-full bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 text-slate-200 text-sm font-sans leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500/60 resize-y"
                  placeholder="Type or paste your text here (e.g. blog post, press release, marketing copy) to audit compliance and brand voice..."
                />
              </div>
            )}

            {/* Mode 2: Side-by-Side Diff Comparison (Only shown when changes exist) */}
            {viewMode === 'diff' && hasChanges && (
              <div className="space-y-2 flex-1 flex flex-col">
                <div className="flex items-center justify-between px-1 text-[11px] text-slate-400">
                  <span className="flex items-center space-x-1.5 font-medium text-slate-300">
                    <Split className="w-3.5 h-3.5 text-blue-400" />
                    <span>Side-by-Side Revisions Comparison</span>
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                      Modifications detected
                    </span>
                    <button
                      onClick={handleResetToOriginal}
                      className="text-[10px] text-slate-400 hover:text-slate-200 underline"
                      title="Revert back to original off-brand text"
                    >
                      Revert to original
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 text-xs">
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-800/40 overflow-y-auto max-h-80">
                    <div className="text-[10px] uppercase font-bold text-red-400 mb-2 flex items-center justify-between">
                      <span>Original Draft (Off-Brand):</span>
                      <span className="text-[9px] bg-red-950/80 px-1.5 py-0.5 rounded text-red-300 border border-red-800/50">Before</span>
                    </div>
                    <p className="text-red-200/80 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                      {originalDraft.trim() || editorText}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-800/40 overflow-y-auto max-h-80">
                    <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 flex items-center justify-between">
                      <span>Revised Draft (Compliant):</span>
                      <span className="text-[9px] bg-emerald-950/80 px-1.5 py-0.5 rounded text-emerald-300 border border-emerald-800/50">After Fixes</span>
                    </div>
                    <p className="text-emerald-200 leading-relaxed font-mono text-[11px] whitespace-pre-line">
                      {editorText}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2 Fallback: When no changes exist yet */}
            {viewMode === 'diff' && !hasChanges && (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-950/60 rounded-xl border border-slate-800 space-y-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-400">
                  <Split className="w-5 h-5 text-blue-400" />
                </div>
                <div className="max-w-xs">
                  <h4 className="text-xs font-bold text-slate-200">Drafts are currently identical</h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No edits have been made yet. Apply suggestions from the right panel or edit text to view changes side-by-side.
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('editor')}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
                >
                  Return to Editor
                </button>
              </div>
            )}

            {/* Editor Footer Status Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
              <span>Markdown and plaintext supported</span>
              <span className="flex items-center space-x-1 text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                <span>In-Memory Sub-15ms Governance Engine</span>
              </span>
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

      {/* Next Stage in Governance Lifecycle */}
      {onNavigateToTab && (
        <NextStageNavigator
          currentStageNumber={1}
          totalStages={6}
          currentStageName="Content Studio (Text Governance)"
          nextTab="visual"
          nextTabName="Visual Brand Inspector"
          nextTabDescription="Verify promotional banners, logo clearspace buffer, and text-over-image WCAG luminance contrast."
          nextTabIcon={Palette}
          onNavigate={onNavigateToTab}
          recommendedAction="Click Auto-Conform in Visual Inspector to fix logo clearspace and aspect ratio."
        />
      )}
    </div>
  );
};
