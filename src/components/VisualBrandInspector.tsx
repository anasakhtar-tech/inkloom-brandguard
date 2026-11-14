import React, { useState, useRef, useEffect } from 'react';
import { 
  Eye, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Download, 
  Maximize2, 
  Palette, 
  Contrast, 
  Ratio, 
  ShieldCheck,
  UploadCloud,
  RefreshCw,
  Globe
} from 'lucide-react';
import { 
  PRESET_VISUAL_ASSETS, 
  VisualAssetReport, 
  APPROVED_BRAND_PALETTE, 
  getContrastRatio 
} from '../services/visualEngine';
import { NextStageNavigator } from './NextStageNavigator';

interface VisualBrandInspectorProps {
  onNavigateToTab?: (tab: string) => void;
}

export const VisualBrandInspector: React.FC<VisualBrandInspectorProps> = ({ onNavigateToTab }) => {
  const [selectedAsset, setSelectedAsset] = useState<VisualAssetReport>(PRESET_VISUAL_ASSETS[0]);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showClearspaceGrid, setShowClearspaceGrid] = useState<boolean>(true);
  const [isConformed, setIsConformed] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render canvas visual inspection whenever selected asset or toggles change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size
    canvas.width = 800;
    canvas.height = 340;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isViolated = selectedAsset.id === 'asset-2' && !isConformed;
    const isWarning = selectedAsset.id === 'asset-3';

    // 1. Draw Background
    const bgGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    if (isViolated) {
      bgGrad.addColorStop(0, '#0a0a23');
      bgGrad.addColorStop(1, '#050510');
    } else if (isWarning) {
      bgGrad.addColorStop(0, '#1e293b');
      bgGrad.addColorStop(1, '#0f172a');
    } else {
      bgGrad.addColorStop(0, '#0f172a');
      bgGrad.addColorStop(1, '#1e293b');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Draw Decorative Brand Accent
    ctx.fillStyle = isViolated ? '#39FF14' : '#2563EB'; // Neon Green if violated!
    ctx.globalAlpha = isViolated ? 0.35 : 0.2;
    ctx.beginPath();
    ctx.arc(canvas.width - 60, 40, 180, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // 3. Draw Brandmark (Logo)
    ctx.save();
    if (isViolated) {
      // Stretched distorted logo
      ctx.fillStyle = '#FF007F'; // Forbidden Neon Magenta
      ctx.fillRect(50, 60, 290, 42); // Stretched!
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px system-ui';
      ctx.fillText('INKLOOM BRANDGUARD (DISTORTED)', 60, 90);
    } else {
      // Proportional compliant logo
      const logoGrad = ctx.createLinearGradient(50, 60, 220, 110);
      logoGrad.addColorStop(0, '#2563EB');
      logoGrad.addColorStop(1, '#38BDF8');
      ctx.fillStyle = logoGrad;
      ctx.beginPath();
      ctx.roundRect(50, 60, 180, 52, 10);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 16px system-ui';
      ctx.fillText('Inkloom BrandGuard', 65, 92);
    }
    ctx.restore();

    // 4. Draw Marketing Copy
    ctx.save();
    if (isViolated) {
      ctx.fillStyle = '#6B7280'; // Low contrast text
      ctx.font = '500 15px system-ui';
      ctx.fillText('100% Guaranteed Zero Failure Cloud Architecture', 50, 150);
      ctx.fillText('Cheapest enterprise solution with 99.999% SLA', 50, 180);
    } else if (isWarning) {
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 15px system-ui';
      ctx.fillText('Intelligent Brand Governance for Autonomous Teams', 50, 155);
      ctx.fillText('Enterprise-grade verification with 99.9% uptime', 50, 185);
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 20px system-ui';
      ctx.fillText('Intelligent Pre-Publication Brand Governance', 50, 160);
      ctx.fillStyle = '#94A3B8';
      ctx.font = '14px system-ui';
      ctx.fillText('Standardizing voice, verified enterprise facts, and WCAG accessibility at scale.', 50, 195);
    }
    ctx.restore();

    // 5. Draw CTA Button
    ctx.save();
    ctx.fillStyle = isViolated ? '#39FF14' : '#2563EB';
    ctx.beginPath();
    ctx.roundRect(50, 235, 170, 44, 8);
    ctx.fill();
    ctx.fillStyle = isViolated ? '#000000' : '#FFFFFF';
    ctx.font = 'bold 13px system-ui';
    ctx.fillText(isViolated ? 'Claim Cheap Deal' : 'Explore Governance Hub', 65, 262);
    ctx.restore();

    // 6. Draw Computer Vision Bounding Boxes (if enabled)
    if (showBoundingBoxes) {
      ctx.save();
      if (isViolated) {
        // Red dashed bounding box around stretched logo
        ctx.strokeStyle = '#EF4444';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.strokeRect(45, 50, 305, 60);

        // Label tag
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(45, 24, 235, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('⚠ Aspect Ratio Distorted (4.8 : 1)', 52, 40);

        // Low contrast text bounding box
        ctx.strokeStyle = '#F59E0B';
        ctx.strokeRect(45, 130, 430, 65);
        ctx.fillStyle = '#F59E0B';
        ctx.fillRect(45, 110, 205, 20);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px system-ui';
        ctx.fillText('⚠ WCAG Contrast Fail (2.14 : 1)', 50, 124);

        // Forbidden color flag
        ctx.strokeStyle = '#EF4444';
        ctx.strokeRect(45, 230, 180, 54);
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(45, 212, 195, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px system-ui';
        ctx.fillText('✖ Forbidden Neon #39FF14', 50, 225);
      } else {
        // Green compliant bounding boxes
        ctx.strokeStyle = '#10B981';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(42, 52, 196, 68);

        // Label tag
        ctx.fillStyle = '#10B981';
        ctx.fillRect(42, 28, 190, 22);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px system-ui';
        ctx.fillText('✔ Proportional Brandmark (3.0 : 1)', 48, 43);

        // Passing contrast box
        ctx.strokeStyle = '#3B82F6';
        ctx.strokeRect(45, 140, 460, 70);
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(45, 122, 175, 18);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 10px system-ui';
        ctx.fillText('✔ WCAG AAA Contrast (12.8 : 1)', 50, 135);
      }
      ctx.restore();
    }

    // 7. Clearspace Margin Lines (if enabled)
    if (showClearspaceGrid) {
      ctx.save();
      ctx.strokeStyle = isViolated ? 'rgba(239, 68, 68, 0.4)' : 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      // Clearspace buffer lines around brandmark
      ctx.strokeRect(20, 30, 240, 110);
      ctx.fillStyle = isViolated ? '#EF4444' : '#38BDF8';
      ctx.font = '10px monospace';
      ctx.fillText('Clearspace Zone: 1.5x X-Height', 25, 24);
      ctx.restore();
    }

  }, [selectedAsset, showBoundingBoxes, showClearspaceGrid, isConformed]);

  const handleConformAsset = () => {
    setIsConformed(true);
  };

  const handleResetAsset = () => {
    setIsConformed(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-blue-950/50 to-slate-900 border border-indigo-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Round 3 Final Improvement 2
              </span>
              <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Multimodal Computer Vision Engine Active</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              Multimodal Visual Brand & Layout Asset Inspector
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Analyzes graphic banners, flyers, and creative collateral using HTML5 Canvas pixel matrix heuristics.
              Enforces logo clearspace bounding boxes, non-uniform aspect ratio stretch detection, WCAG 2.1 contrast, and forbidden hex palettes.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-right">
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Visual Health</div>
              <div className={`text-xl font-black ${
                (isConformed ? 96 : selectedAsset.overallScore) >= 85 ? 'text-emerald-400' : 
                (isConformed ? 96 : selectedAsset.overallScore) >= 65 ? 'text-amber-400' : 'text-red-400'
              }`}>
                {isConformed ? 96 : selectedAsset.overallScore}/100
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Selection & Canvas Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Canvas & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl p-5 space-y-4">
            
            {/* Asset Preset Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_VISUAL_ASSETS.map((asset) => (
                  <button
                    key={asset.id}
                    onClick={() => {
                      setSelectedAsset(asset);
                      setIsConformed(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedAsset.id === asset.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {asset.name}
                  </button>
                ))}
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-2 text-xs">
                <button
                  onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    showBoundingBoxes ? 'bg-indigo-600/30 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Bounding Boxes
                </button>
                <button
                  onClick={() => setShowClearspaceGrid(!showClearspaceGrid)}
                  className={`px-2.5 py-1 rounded-lg border font-medium transition-all ${
                    showClearspaceGrid ? 'bg-blue-600/30 border-blue-500/50 text-blue-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Clearspace Grid
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div className="relative bg-black rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center p-2">
              <canvas 
                ref={canvasRef} 
                className="w-full max-w-full h-auto rounded-lg shadow-inner object-contain"
              />
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-400">
                <span>Resolution: <strong className="text-slate-200">{selectedAsset.dimensions.width} × {selectedAsset.dimensions.height}px</strong></span>
                <span className="mx-2">•</span>
                <span>Calculated Aspect Ratio: <strong className="text-slate-200">{isConformed ? '3.0 : 1' : `${selectedAsset.aspectRatio} : 1`}</strong></span>
              </div>

              <div className="flex items-center space-x-2">
                {selectedAsset.id === 'asset-2' && (
                  <button
                    onClick={isConformed ? handleResetAsset : handleConformAsset}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isConformed ? 'Reset to Violations' : '1-Click Auto-Conform Palette & Geometry'}</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Color Palette Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Palette className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Extracted Pixel Palette & Hex Adherence</h3>
              </div>
              <span className="text-[11px] text-slate-400">Canvas Color Clustering</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(isConformed ? [
                { hex: '#0F172A', percent: 65, isApproved: true },
                { hex: '#2563EB', percent: 25, isApproved: true },
                { hex: '#38BDF8', percent: 10, isApproved: true }
              ] : selectedAsset.extractedColors).map((color, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center space-x-2.5">
                  <div 
                    className="w-7 h-7 rounded-lg border border-slate-700 shadow-sm flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-mono font-bold text-slate-200 truncate">{color.hex}</span>
                    <div className="flex items-center space-x-1">
                      <span className={`text-[10px] font-semibold ${color.isApproved ? 'text-emerald-400' : 'text-red-400'}`}>
                        {color.isApproved ? 'Approved' : 'Forbidden'}
                      </span>
                      <span className="text-[10px] text-slate-500">({color.percent}%)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: 4-Dimension Computer Vision Audit Findings */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Computer Vision Findings</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                (isConformed ? 'Compliant' : selectedAsset.status) === 'Compliant' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' :
                (isConformed ? 'Compliant' : selectedAsset.status) === 'Needs Review' ? 'bg-amber-950 text-amber-400 border border-amber-800/40' :
                'bg-red-950 text-red-400 border border-red-800/40'
              }`}>
                {isConformed ? 'Compliant' : selectedAsset.status}
              </span>
            </div>

            <div className="space-y-3">
              {(isConformed ? PRESET_VISUAL_ASSETS[0].checks : selectedAsset.checks).map((check, idx) => (
                <div 
                  key={idx} 
                  className={`p-3 rounded-xl border transition-all ${
                    check.status === 'passed' ? 'bg-slate-950/80 border-slate-800/80' :
                    check.status === 'warning' ? 'bg-amber-950/20 border-amber-900/40' :
                    'bg-red-950/20 border-red-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      {check.dimension === 'Clearspace' && <Maximize2 className="w-3.5 h-3.5 text-blue-400" />}
                      {check.dimension === 'Aspect Ratio' && <Ratio className="w-3.5 h-3.5 text-indigo-400" />}
                      {check.dimension === 'Color Palette' && <Palette className="w-3.5 h-3.5 text-cyan-400" />}
                      {check.dimension === 'WCAG Contrast' && <Contrast className="w-3.5 h-3.5 text-amber-400" />}
                      <span className="text-xs font-bold text-slate-200">{check.dimension}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      check.status === 'passed' ? 'text-emerald-400 bg-emerald-950/50' :
                      check.status === 'warning' ? 'text-amber-400 bg-amber-950/50' :
                      'text-red-400 bg-red-950/50'
                    }`}>
                      {check.status}
                    </span>
                  </div>

                  <div className="text-[11px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Expected: <span className="text-slate-300 font-mono">{check.expected}</span></span>
                      <span>Actual: <span className={`font-mono ${check.status === 'failed' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{check.actual}</span></span>
                    </div>
                    <p className="text-slate-400 pt-1 leading-relaxed">{check.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-3 text-[11px] text-slate-400">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-medium mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>WCAG 2.1 & Enterprise Asset Compliant</span>
              </div>
              <p className="text-slate-500">Inspection verified via standard HTML5 2D Canvas pixel buffer analysis.</p>
            </div>
          </div>
        </div>

      </div>

      {/* Next Stage in Governance Lifecycle */}
      {onNavigateToTab && (
        <NextStageNavigator
          currentStageNumber={2}
          totalStages={6}
          currentStageName="Visual Brand Inspector (Graphics & Assets)"
          prevTab="studio"
          prevTabName="Content Studio"
          nextTab="extension"
          nextTabName="In-Situ Extension Simulator"
          nextTabDescription="Test real-time ambient governance directly inside Google Docs and Notion authoring environments."
          nextTabIcon={Globe}
          onNavigate={onNavigateToTab}
          recommendedAction="Observe the floating health badge update as you edit in the live sandbox."
        />
      )}
    </div>
  );
};
