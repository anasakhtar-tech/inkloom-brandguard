import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  UserCheck, 
  History, 
  ArrowRight, 
  Filter, 
  FileCheck,
  Search,
  Award,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers,
  Scale,
  HelpCircle,
  Check,
  Info,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocumentItem, UserRole, AuditComment } from '../types';
import { samplePresetDocuments } from '../data/brandVaultData';
import { NextStageNavigator } from './NextStageNavigator';
import { auditContent } from '../services/brandEngine';

interface ReviewHubProps {
  currentRole: UserRole;
  onOpenCertificate: (doc: DocumentItem) => void;
  onNavigateToStudio?: () => void;
  onRoleChange?: (role: UserRole) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const ReviewHub: React.FC<ReviewHubProps> = ({
  currentRole,
  onOpenCertificate,
  onNavigateToStudio,
  onRoleChange,
  onNavigateToTab
}) => {
  const [docs, setDocs] = useState<DocumentItem[]>(samplePresetDocuments);
  const [selectedDocId, setSelectedDocId] = useState<string>(samplePresetDocuments[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(true);

  const selectedDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  // Real-time policy evaluation for the selected document
  const liveAudit = useMemo(() => {
    return auditContent(selectedDoc.content);
  }, [selectedDoc.content]);

  const toneViolations = liveAudit.violations.filter(v => v.dimension === 'tone').length;
  const termViolations = liveAudit.violations.filter(v => v.dimension === 'terminology').length;
  const claimViolations = liveAudit.violations.filter(v => v.dimension === 'facts' || v.dimension === 'promotional').length;
  const accessViolations = liveAudit.violations.filter(v => v.dimension === 'accessibility').length;

  const quickPresets = [
    'Approved from brand tone and voice perspective.',
    'Please verify the SLA claim before final sign-off.',
    'Add mandatory regulatory disclaimers under FTC rules.',
    'Terminology successfully updated to inclusive taxonomy.'
  ];

  const handleAddComment = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const commentText = customText || newCommentText;
    if (!commentText.trim()) return;

    const roleName = currentRole === 'creator' 
      ? 'Alex Turner (Creator)'
      : currentRole === 'reviewer'
      ? 'Elena Rostova (Brand Manager)'
      : 'Marcus Vance (Legal & Compliance)';

    const newComment: AuditComment = {
      id: `COMM-${Date.now()}`,
      author: roleName,
      role: currentRole,
      text: commentText,
      timestamp: 'Just now'
    };

    setDocs(prev => prev.map(d => {
      if (d.id === selectedDocId) {
        return {
          ...d,
          comments: [...d.comments, newComment]
        };
      }
      return d;
    }));

    if (!customText) {
      setNewCommentText('');
    }
  };

  const handleStatusUpdate = (docId: string, newStatus: DocumentItem['status']) => {
    setDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return {
          ...d,
          status: newStatus,
          certifiedAt: newStatus === 'approved' ? new Date().toISOString() : d.certifiedAt,
          certificateId: newStatus === 'approved' ? `CERT-INKLOOM-${Math.floor(1000 + Math.random() * 9000)}` : d.certificateId
        };
      }
      return d;
    }));

    if (newStatus === 'approved') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const filteredDocs = docs.filter(d => {
    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesQuery = !searchQuery.trim() || 
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      
      {/* Self-Explanatory Visual Header & Quick Role Simulator */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-wider">
                Multi-Stakeholder Sign-Off Hub
              </span>
              <button 
                onClick={() => setShowHowItWorks(!showHowItWorks)}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>{showHowItWorks ? 'Hide Guide' : 'What is this tab?'}</span>
              </button>
            </div>
            <h1 className="text-xl font-black text-white tracking-tight mt-1">
              Document Approval & Team Review Queue
            </h1>
            <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
              Where writers submit drafts, brand managers verify guidelines, and legal officers issue verified publication certificates.
            </p>
          </div>

          {/* Quick Active Role Switcher directly in the view */}
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 flex flex-col space-y-1.5 shrink-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Simulate Team Role:
            </span>
            <div className="flex items-center space-x-1 text-xs">
              <button
                onClick={() => onRoleChange && onRoleChange('creator')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'creator'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title="Creator submits drafts for review"
              >
                ✍️ Alex (Creator)
              </button>
              <button
                onClick={() => onRoleChange && onRoleChange('reviewer')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'reviewer'
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title="Reviewer can approve or request changes"
              >
                🔍 Elena (Reviewer)
              </button>
              <button
                onClick={() => onRoleChange && onRoleChange('legal')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentRole === 'legal'
                    ? 'bg-purple-600 text-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
                title="Legal counsel issues compliance certificates"
              >
                ⚖️ Marcus (Legal)
              </button>
            </div>
          </div>
        </div>

        {/* Expandable 3-Step "How This Works" Explainer Card */}
        {showHowItWorks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div>
                <strong className="text-white block font-semibold">Pick a Draft from Queue</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Select any document on the left to see its live compliance score and policy health.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div>
                <strong className="text-white block font-semibold">Leave Feedback or Changes</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Click quick feedback presets or type comments to record feedback in the permanent audit trail.
                </p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start space-x-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                3
              </div>
              <div>
                <strong className="text-white block font-semibold">Approve & Certify</strong>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Switch to <em>Reviewer</em> or <em>Legal</em> and click <strong>Approve</strong> to issue an official Compliance Certificate!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Document Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-white flex items-center space-x-1.5 uppercase tracking-wider">
                  <FileCheck className="w-4 h-4 text-blue-400" />
                  <span>Pending Document Queue ({filteredDocs.length})</span>
                </h3>
                <span className="text-[10px] text-slate-500">Click a document to review its status</span>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="draft">Drafts</option>
                <option value="under_review">Under Review</option>
                <option value="changes_requested">Changes Requested</option>
                <option value="approved">Approved & Certified</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search documents by title, author, or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800/90 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Document Cards List */}
            <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
              {filteredDocs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                  No collateral matches the search or filter.
                </div>
              ) : (
                filteredDocs.map(doc => {
                  const isSelected = doc.id === selectedDocId;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/60 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-xs font-bold text-slate-100 truncate flex-1">{doc.title}</h4>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          doc.score >= 90 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                          doc.score >= 70 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {doc.score}%
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                        <span>By {doc.author}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          doc.status === 'approved' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50' :
                          doc.status === 'under_review' ? 'bg-blue-950/80 text-blue-400 border border-blue-800/50' :
                          doc.status === 'changes_requested' ? 'bg-red-950/80 text-red-400 border border-red-800/50' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Document Details, Pipeline, & Threaded Collaboration (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            
            {/* Header info & Workflow Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDoc.title}</h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>Author: <strong className="text-slate-300">{selectedDoc.author}</strong></span>
                  <span>•</span>
                  <span>Format: <strong className="text-blue-400 uppercase">{selectedDoc.format}</strong></span>
                  <span>•</span>
                  <span>Score: <strong className="text-emerald-400 font-bold">{selectedDoc.score}%</strong></span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {onNavigateToStudio && (
                  <button
                    onClick={onNavigateToStudio}
                    className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-600 text-slate-300 hover:text-white transition-all shadow-sm"
                    title="Open document in Content Studio to inspect and edit"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                    <span>Open in Studio</span>
                  </button>
                )}

                {/* Role-governed action buttons */}
                {currentRole === 'creator' && selectedDoc.status === 'draft' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedDoc.id, 'under_review')}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center space-x-1"
                  >
                    <span>Submit for Review</span>
                  </button>
                )}

                {currentRole !== 'creator' && selectedDoc.status !== 'approved' && (
                  <>
                    <button
                      onClick={() => handleStatusUpdate(selectedDoc.id, 'changes_requested')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-600/20 text-red-300 border border-red-500/30 hover:bg-red-600/30 transition-all"
                    >
                      Request Changes
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedDoc.id, 'approved')}
                      className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-950/50 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Certify</span>
                    </button>
                  </>
                )}

                {selectedDoc.status === 'approved' && (
                  <button
                    onClick={() => onOpenCertificate(selectedDoc)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-md shadow-purple-950/50 flex items-center space-x-1.5"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>View Certificate</span>
                  </button>
                )}
              </div>
            </div>

            {/* Approved Document Banner */}
            {selectedDoc.status === 'approved' && (
              <div className="bg-emerald-950/30 border border-emerald-800/60 p-3 rounded-xl flex items-center justify-between text-xs text-emerald-300">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-white block">Official Compliance Certification Granted</span>
                    <span className="text-[11px] text-emerald-400/80 font-mono">
                      Certificate #{selectedDoc.certificateId || 'CERT-INKLOOM-9021'} • Valid for Public Release
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onOpenCertificate(selectedDoc)}
                  className="px-3 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-white font-semibold text-xs transition-all"
                >
                  Inspect Certificate
                </button>
              </div>
            )}

            {/* Visual Governance Lifecycle Stepper */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center space-x-1">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  <span>Document Lifecycle Progress</span>
                </span>
                <span className="font-mono text-slate-300">
                  Current Status: <strong className="text-white uppercase">{selectedDoc.status.replace('_', ' ')}</strong>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-medium">
                <div className={`p-2 rounded-lg border transition-all ${
                  selectedDoc.status === 'draft' 
                    ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  1. Draft Created
                </div>
                <div className={`p-2 rounded-lg border transition-all ${
                  selectedDoc.status === 'under_review' 
                    ? 'bg-blue-600/20 border-blue-500/60 text-blue-300 font-bold'
                    : selectedDoc.status === 'approved'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  2. Under Review
                </div>
                <div className={`p-2 rounded-lg border transition-all ${
                  selectedDoc.status === 'changes_requested'
                    ? 'bg-amber-950/40 border-amber-800/60 text-amber-300 font-bold'
                    : selectedDoc.status === 'approved'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-400 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}>
                  3. {selectedDoc.status === 'changes_requested' ? 'Changes Needed' : 'Sign-Off'}
                </div>
                <div className={`p-2 rounded-lg border transition-all ${
                  selectedDoc.status === 'approved'
                    ? 'bg-purple-950/40 border-purple-800/60 text-purple-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-500'
                }`}>
                  4. Certified
                </div>
              </div>
            </div>

            {/* Policy Dimensions Health Overview */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Policy Health Breakdown (Click to understand issues):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className={`p-2.5 rounded-xl border ${
                  toneViolations === 0 
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                    : 'bg-red-950/20 border-red-900/40 text-red-300'
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Tone & Voice</span>
                  <span className="font-bold">{toneViolations === 0 ? '✅ Compliant' : `❌ ${toneViolations} Tone Risk(s)`}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  termViolations === 0 
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                    : 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">Terminology</span>
                  <span className="font-bold">{termViolations === 0 ? '✅ Approved' : `⚠️ ${termViolations} Jargon Flag(s)`}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  claimViolations === 0 
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                    : 'bg-red-950/20 border-red-900/40 text-red-300'
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">SLA & FTC Claims</span>
                  <span className="font-bold">{claimViolations === 0 ? '✅ Verified' : `❌ ${claimViolations} Claim Risk(s)`}</span>
                </div>

                <div className={`p-2.5 rounded-xl border ${
                  accessViolations === 0 
                    ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300' 
                    : 'bg-blue-950/20 border-blue-900/40 text-blue-300'
                }`}>
                  <span className="text-[10px] text-slate-500 block uppercase font-mono">WCAG 2.1</span>
                  <span className="font-bold">{accessViolations === 0 ? '✅ Passed' : `ℹ️ ${accessViolations} Anchor Alert`}</span>
                </div>
              </div>
            </div>

            {/* Document Content Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                <span>Draft Content Body:</span>
                <span className="text-slate-400 font-mono">Length: {selectedDoc.content.length} characters</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line max-h-40 overflow-y-auto pr-1">
                {selectedDoc.content}
              </p>
            </div>

            {/* Threaded Discussion Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                    <span>Team Review Audit Trail & Notes ({selectedDoc.comments.length})</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Every comment is logged with author name, role, and timestamp</span>
                </div>
                <span className="text-[10px] text-indigo-400 font-mono bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-900/50">
                  Posting as: {currentRole.toUpperCase()}
                </span>
              </div>

              {/* Comments stream */}
              <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                {selectedDoc.comments.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-500 bg-slate-950 rounded-xl border border-slate-800">
                    No review comments yet. Use the quick presets below to leave feedback!
                  </div>
                ) : (
                  selectedDoc.comments.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{c.author}</span>
                        <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Quick Preset Feedback Pills */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  1-Click Feedback Suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickPresets.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddComment(undefined, preset)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all text-left"
                      title="Click to post this comment directly"
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add Comment input form */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Write review note as ${currentRole === 'creator' ? 'Alex Turner (Creator)' : currentRole === 'reviewer' ? 'Elena Rostova (Brand Manager)' : 'Marcus Vance (Legal)'}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-1 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Note</span>
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>

      {/* Next Stage in Governance Lifecycle */}
      {onNavigateToTab && (
        <NextStageNavigator
          currentStageNumber={5}
          totalStages={6}
          currentStageName="Review Hub (Multi-Role Sign-Off)"
          prevTab="cicd"
          prevTabName="CI/CD Gatekeeper"
          nextTab="analytics"
          nextTabName="Governance Analytics & ROI"
          nextTabDescription="Longitudinal intelligence measuring turnaround acceleration (-78%), $426k+ avoided liability, and policy dispute heatmaps."
          nextTabIcon={BarChart3}
          onNavigate={onNavigateToTab}
          recommendedAction="Examine the Guideline Ambiguity Heatmap and click Publish Clarification to resolve writer confusion."
        />
      )}
    </div>
  );
};
