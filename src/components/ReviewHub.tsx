import React, { useState } from 'react';
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
  FileCheck
} from 'lucide-react';
import { DocumentItem, UserRole, AuditComment } from '../types';
import { samplePresetDocuments } from '../data/brandVaultData';

interface ReviewHubProps {
  currentRole: UserRole;
  onOpenCertificate: (doc: DocumentItem) => void;
}

export const ReviewHub: React.FC<ReviewHubProps> = ({
  currentRole,
  onOpenCertificate
}) => {
  const [docs, setDocs] = useState<DocumentItem[]>(samplePresetDocuments);
  const [selectedDocId, setSelectedDocId] = useState<string>(samplePresetDocuments[0].id);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [newCommentText, setNewCommentText] = useState<string>('');

  const selectedDoc = docs.find(d => d.id === selectedDocId) || docs[0];

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const roleName = currentRole === 'creator' 
      ? 'Alex Turner (Creator)'
      : currentRole === 'reviewer'
      ? 'Elena Rostova (Brand Manager)'
      : 'Marcus Vance (Legal & Compliance)';

    const newComment: AuditComment = {
      id: `COMM-${Date.now()}`,
      author: roleName,
      role: currentRole,
      text: newCommentText,
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

    setNewCommentText('');
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
  };

  const filteredDocs = docs.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Document Queue (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                <span>Governance Queue ({filteredDocs.length})</span>
              </h3>

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
                <option value="approved">Approved</option>
              </select>
            </div>

            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredDocs.map(doc => {
                const isSelected = doc.id === selectedDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-600/10 border-blue-500/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-xs font-bold text-slate-100 truncate flex-1">{doc.title}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        doc.score >= 90 ? 'bg-emerald-500/10 text-emerald-400' :
                        doc.score >= 70 ? 'bg-amber-500/10 text-amber-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>
                        {doc.score}%
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                      <span>{doc.author}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        doc.status === 'approved' ? 'bg-emerald-950 text-emerald-400' :
                        doc.status === 'under_review' ? 'bg-blue-950 text-blue-400' :
                        doc.status === 'changes_requested' ? 'bg-red-950 text-red-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {doc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Document Details & Threaded Collaboration (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">{selectedDoc.title}</h3>
                <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
                  <span>Author: <strong className="text-slate-300">{selectedDoc.author}</strong></span>
                  <span>•</span>
                  <span>Format: <strong className="text-blue-400 uppercase">{selectedDoc.format}</strong></span>
                  <span>•</span>
                  <span>Compliance Score: <strong className="text-emerald-400">{selectedDoc.score}%</strong></span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center space-x-2">
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
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm"
                    >
                      Approve
                    </button>
                  </>
                )}

                {selectedDoc.status === 'approved' && (
                  <button
                    onClick={() => onOpenCertificate(selectedDoc)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm"
                  >
                    View Certificate
                  </button>
                )}
              </div>
            </div>

            {/* Document Content Preview */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Current Draft Content:
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-line">
                {selectedDoc.content}
              </p>
            </div>

            {/* Threaded Discussion Section */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                <span>Threaded Review & Approval Comments ({selectedDoc.comments.length})</span>
              </h4>

              {/* Comments stream */}
              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {selectedDoc.comments.map(c => (
                  <div key={c.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-200">{c.author}</span>
                      <span className="text-[10px] text-slate-500">{c.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment input */}
              <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder={`Leave review feedback as ${currentRole}...`}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-all flex items-center space-x-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
