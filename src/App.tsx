import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContentStudio } from './components/ContentStudio';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { VisualBrandInspector } from './components/VisualBrandInspector';
import { EnterpriseCICDHub } from './components/EnterpriseCICDHub';
import { BrandVault } from './components/BrandVault';
import { ReviewHub } from './components/ReviewHub';
import { GovernanceAnalytics } from './components/GovernanceAnalytics';
import { ResponsibleAICenter } from './components/ResponsibleAICenter';
import { AuditCertificateModal } from './components/AuditCertificateModal';
import { WelcomeModal } from './components/WelcomeModal';
import { GuidedTourBar } from './components/GuidedTourBar';
import { UserRole, DocumentItem } from './types';
import { samplePresetDocuments } from './data/brandVaultData';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('creator');
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [documents, setDocuments] = useState<DocumentItem[]>(samplePresetDocuments);
  const [certificateDoc, setCertificateDoc] = useState<DocumentItem | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const handleStartTour = () => {
    setShowWelcome(false);
    setIsTourOpen(true);
    setActiveTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white w-full max-w-full overflow-x-hidden">
      {/* Global Navigation Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenWelcome={() => setShowWelcome(true)}
        overallScore={94}
        onToggleTour={() => setIsTourOpen(!isTourOpen)}
        isTourActive={isTourOpen}
      />

      {/* Main Tab Routing */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' && (
          <ContentStudio
            currentRole={currentRole}
            onOpenCertificate={(doc) => setCertificateDoc(doc)}
            onUpdateDocumentList={setDocuments}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'extension' && (
          <ExtensionSimulator onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'visual' && (
          <VisualBrandInspector onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'cicd' && (
          <EnterpriseCICDHub onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'vault' && (
          <BrandVault />
        )}

        {activeTab === 'review' && (
          <ReviewHub
            currentRole={currentRole}
            onOpenCertificate={(doc) => setCertificateDoc(doc)}
            onNavigateToStudio={() => setActiveTab('studio')}
            onRoleChange={setCurrentRole}
            onNavigateToTab={setActiveTab}
          />
        )}

        {activeTab === 'analytics' && (
          <GovernanceAnalytics onNavigateToTab={setActiveTab} />
        )}

        {activeTab === 'responsible' && (
          <ResponsibleAICenter />
        )}
      </main>

      {/* Interactive Floating Guided Tour Bar */}
      <GuidedTourBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
      />

      {/* Compliance Audit Certificate Modal */}
      {certificateDoc && (
        <AuditCertificateModal
          document={certificateDoc}
          onClose={() => setCertificateDoc(null)}
        />
      )}

      {/* Platform Introduction Modal (Opens on first visit or via About button) */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStartTour={handleStartTour}
        onNavigateToTab={setActiveTab}
      />

      {/* Application Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Inkloom BrandGuard</span>
            <span>•</span>
            <span>Intelligent Pre-Publication Brand Governance Platform</span>
          </div>

          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Core Governance Pipeline Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
