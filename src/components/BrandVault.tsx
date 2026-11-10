import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Database, 
  Palette, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ShieldCheck,
  Search
} from 'lucide-react';
import { BrandGuideline, GlossaryTerm, VerifiedFact, VisualAssetRule } from '../types';
import { initialGuidelines, initialGlossary, initialVerifiedFacts, initialVisualRules } from '../data/brandVaultData';

export const BrandVault: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'guidelines' | 'glossary' | 'facts' | 'visuals'>('glossary');
  const [guidelines, setGuidelines] = useState<BrandGuideline[]>(initialGuidelines);
  const [glossary, setGlossary] = useState<GlossaryTerm[]>(initialGlossary);
  const [facts, setFacts] = useState<VerifiedFact[]>(initialVerifiedFacts);
  const [visualRules] = useState<VisualAssetRule>(initialVisualRules);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Add new glossary term state
  const [showAddTermModal, setShowAddTermModal] = useState<boolean>(false);
  const [newDeprecated, setNewDeprecated] = useState<string>('');
  const [newApproved, setNewApproved] = useState<string>('');
  const [newReason, setNewReason] = useState<string>('');

  const handleAddTerm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeprecated || !newApproved) return;

    const newTerm: GlossaryTerm = {
      id: `GLOSS-${Date.now()}`,
      deprecatedTerm: newDeprecated,
      approvedTerm: newApproved,
      caseSensitive: false,
      category: 'Custom Product Standard',
      reason: newReason || 'Added by brand management policy.'
    };

    setGlossary(prev => [newTerm, ...prev]);
    setNewDeprecated('');
    setNewApproved('');
    setNewReason('');
    setShowAddTermModal(false);
  };

  const filteredGlossary = glossary.filter(g => 
    g.deprecatedTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.approvedTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Vault Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-md">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Brand Vault (Single Source of Truth)</h2>
              <p className="text-xs text-slate-400">
                Centrally define, version, and manage the approved brand rules, glossaries, and verified facts.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubTab('glossary')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeSubTab === 'glossary' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Glossary ({glossary.length})
            </button>
            <button
              onClick={() => setActiveSubTab('guidelines')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeSubTab === 'guidelines' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Guidelines ({guidelines.length})
            </button>
            <button
              onClick={() => setActiveSubTab('facts')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeSubTab === 'facts' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verified Facts ({facts.length})
            </button>
            <button
              onClick={() => setActiveSubTab('visuals')}
              className={`px-3 py-1.5 font-medium rounded-lg transition-all ${
                activeSubTab === 'visuals' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Standards
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: GLOSSARY */}
      {activeSubTab === 'glossary' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search deprecated or approved terms..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={() => setShowAddTermModal(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Terminology Rule</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Deprecated / Banned Term</th>
                  <th className="p-3">Approved Official Replacement</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Brand Rationale & Context</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredGlossary.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-950/40 transition-colors">
                    <td className="p-3">
                      <span className="font-mono text-red-400 font-semibold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                        "{item.deprecatedTerm}"
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        "{item.approvedTerm}"
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 font-medium">{item.category}</td>
                    <td className="p-3 text-slate-300 max-w-xs">{item.reason}</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setGlossary(prev => prev.filter(g => g.id !== item.id))}
                        className="text-slate-500 hover:text-red-400 transition-colors p-1"
                        title="Delete term"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GUIDELINES */}
      {activeSubTab === 'guidelines' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {guidelines.map(g => (
            <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {g.id}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  {g.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white mb-1">{g.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{g.rule}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">Context & Rationale:</div>
                <div className="text-slate-400">{g.rationale}</div>
              </div>

              {g.examples.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div className="text-red-400 flex items-start space-x-1">
                    <span className="font-bold">❌ Bad:</span>
                    <span className="italic">"{g.examples[0].bad}"</span>
                  </div>
                  <div className="text-emerald-400 flex items-start space-x-1">
                    <span className="font-bold">✅ Good:</span>
                    <span className="italic">"{g.examples[0].good}"</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 3: VERIFIED FACTS */}
      {activeSubTab === 'facts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Audited Enterprise Facts & Regulatory Metrics</h3>
            <p className="text-xs text-slate-400">
              Only claims substantiated in this repository may be published in public copy without disclaimers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {facts.map(fact => (
              <div key={fact.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">{fact.claimTopic}</span>
                  <span className="text-[10px] text-slate-500">Verified: {fact.lastVerified}</span>
                </div>

                <div className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
                  ✓ {fact.verifiedValue}
                </div>

                <div className="text-[11px] text-slate-400">
                  Source: <strong className="text-slate-300">{fact.source}</strong>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-red-400/90">
                  Prohibited Overstatements: {fact.bannedOverstatements.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: VISUAL STANDARDS */}
      {activeSubTab === 'visuals' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div>
            <h3 className="text-sm font-bold text-white">Digital Brand Palette & Logo Specifications</h3>
            <p className="text-xs text-slate-400">Automatic validation for banners, social cards, and PDFs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Primary Brand Dark</div>
              <div className="h-14 rounded-lg bg-[#0F172A] border border-slate-700 flex items-center justify-center font-mono text-xs font-bold text-white mb-2">
                #0F172A
              </div>
              <p className="text-[11px] text-slate-400">Used for editorial backgrounds, primary typography, and containers.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Primary Brand Blue</div>
              <div className="h-14 rounded-lg bg-[#2563EB] flex items-center justify-center font-mono text-xs font-bold text-white mb-2">
                #2563EB
              </div>
              <p className="text-[11px] text-slate-400">Used for primary action triggers, badges, and brand identity marks.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-xs font-bold text-slate-400 uppercase mb-2">Cyan Accent</div>
              <div className="h-14 rounded-lg bg-[#38BDF8] flex items-center justify-center font-mono text-xs font-bold text-slate-900 mb-2">
                #38BDF8
              </div>
              <p className="text-[11px] text-slate-400">Used for high-priority badges, metric highlights, and charts.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/30">
            <h4 className="text-xs font-bold text-red-400 uppercase mb-2">Explicitly Banned Colors (Automatic Flags)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {visualRules.bannedColors.map(bc => (
                <div key={bc.hex} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full flex-shrink-0" style={{ backgroundColor: bc.hex }} />
                  <div className="text-xs">
                    <span className="font-semibold text-slate-200">{bc.name}</span>
                    <span className="font-mono text-slate-400 block text-[10px]">{bc.hex}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Term Modal */}
      {showAddTermModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-3">Add Terminology Rule to Brand Vault</h3>
            <form onSubmit={handleAddTerm} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Deprecated or Banned Term</label>
                <input
                  type="text"
                  required
                  value={newDeprecated}
                  onChange={(e) => setNewDeprecated(e.target.value)}
                  placeholder="e.g. crypto coins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Approved Official Replacement</label>
                <input
                  type="text"
                  required
                  value={newApproved}
                  onChange={(e) => setNewApproved(e.target.value)}
                  placeholder="e.g. Digital Assets"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Brand Rationale & Context</label>
                <textarea
                  rows={3}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Explain why this term was deprecated..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddTermModal(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
