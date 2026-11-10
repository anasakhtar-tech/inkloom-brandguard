import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContentStudio } from './components/ContentStudio';
import { BrandVault } from './components/BrandVault';
import { ReviewHub } from './components/ReviewHub';
import { GovernanceAnalytics } from './components/GovernanceAnalytics';
import { ResponsibleAICenter } from './components/ResponsibleAICenter';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { UserRole, DocumentItem } from './types';
import { samplePresetDocuments } from './data/brandVaultData';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('creator');
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [documents, setDocuments] = useState<DocumentItem[]>(samplePresetDocuments);
  const [certificateDoc, setCertificateDoc] = useState<DocumentItem | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Global Navigation Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        overallScore={94}
      />

      {/* Main Tab Routing */}
      <main className="flex-1">
        {activeTab === 'studio' && (
          <ContentStudio
            currentRole={currentRole}
            onOpenCertificate={(doc) => setCertificateDoc(doc)}
            onUpdateDocumentList={setDocuments}
          />
        )}

        {activeTab === 'vault' && <BrandVault />}

        {activeTab === 'review' && (
          <ReviewHub
            currentRole={currentRole}
            onOpenCertificate={(doc) => setCertificateDoc(doc)}
          />
        )}

        {activeTab === 'analytics' && <GovernanceAnalytics />}

        {activeTab === 'responsible' && <ResponsibleAICenter />}
      </main>

      {/* Compliance Audit Certificate Modal */}
      {certificateDoc && (
        <AuditCertificateModal
          document={certificateDoc}
          onClose={() => setCertificateDoc(null)}
        />
      )}

      {/* Application Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Inkloom BrandGuard</span>
            <span>•</span>
            <span>Team ALTAIR</span>
            <span>•</span>
            <span>CodeTitans India 2026 Round 2 Submission</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-400">Lead AI/ML: MD ANAS AKHTAR</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">Core Workflow Verified</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

