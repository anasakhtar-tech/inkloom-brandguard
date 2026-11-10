import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Printer, X, Download } from 'lucide-react';
import { DocumentItem } from '../types';

interface AuditCertificateModalProps {
  document: DocumentItem;
  onClose: () => void;
}

export const AuditCertificateModal: React.FC<AuditCertificateModalProps> = ({
  document,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border-2 border-slate-700 rounded-3xl max-w-2xl w-full p-8 shadow-2xl relative my-8 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Outer Border Frame */}
        <div className="border border-blue-500/30 rounded-2xl p-6 bg-slate-950/80 relative overflow-hidden">
          {/* Watermark / Background Icon */}
          <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
            <ShieldCheck className="w-80 h-80 text-blue-400" />
          </div>

          {/* Certificate Header */}
          <div className="text-center pb-6 border-b border-slate-800">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 shadow-lg mb-3">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-extrabold uppercase tracking-widest text-white">
              Official Brand Compliance Certificate
            </h2>
            <p className="text-xs text-blue-400 font-mono tracking-wider mt-1">
              Certificate ID: {document.certificateId || 'CERT-INKLOOM-2026-9812'}
            </p>
          </div>

          {/* Certificate Body */}
          <div className="py-6 space-y-4 text-xs">
            <p className="text-center text-slate-300 leading-relaxed max-w-lg mx-auto">
              This certifies that the digital publication collateral described below has been audited and approved in accordance with official Inkloom enterprise brand guidelines and regulatory mandates.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Document Title</span>
                <span className="font-semibold text-slate-200">{document.title}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Author / Submitter</span>
                <span className="font-semibold text-slate-200">{document.author}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Content Format</span>
                <span className="font-semibold text-blue-400 uppercase">{document.format}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Audited Score</span>
                <span className="font-bold text-emerald-400">{document.score}% (Compliant)</span>
              </div>
            </div>

            {/* Dimension Checklist */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Audited Compliance Dimensions:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tone & Empathetic Positioning</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Product Terminology & Casing</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Contractual Fact & SLA Verification</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FTC / SEC Promotional Claim Checks</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Corporate Palette & Visual Rules</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>WCAG 2.1 AA Accessibility Standards</span>
                </div>
              </div>
            </div>

            {/* Authorized Signatures */}
            <div className="pt-6 border-t border-slate-800 grid grid-cols-2 gap-6 text-[11px]">
              <div>
                <div className="font-serif italic text-slate-300 text-sm mb-1">Elena Rostova</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Brand Governance Lead</div>
                <div className="text-[10px] text-slate-400">Inkloom Global Brand Council</div>
              </div>
              <div>
                <div className="font-serif italic text-slate-300 text-sm mb-1">Marcus Vance</div>
                <div className="text-[10px] text-slate-500 uppercase font-bold">Legal & Regulatory Counsel</div>
                <div className="text-[10px] text-slate-400">Enterprise Compliance Division</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all shadow-md shadow-blue-600/20"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save Certificate PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

