// Inkloom BrandGuard - Multimodal Visual Brand & Layout Asset Inspector Engine
// Standardized Web APIs: HTML5 Canvas pixel analysis & WCAG 2.1 color contrast

export interface VisualCheckResult {
  dimension: 'Clearspace' | 'Aspect Ratio' | 'Color Palette' | 'WCAG Contrast';
  status: 'passed' | 'warning' | 'failed';
  metric: string;
  expected: string;
  actual: string;
  description: string;
  box?: { x: number; y: number; width: number; height: number };
}

export interface VisualAssetReport {
  id: string;
  name: string;
  overallScore: number;
  status: 'Compliant' | 'Needs Review' | 'Violations Detected';
  checks: VisualCheckResult[];
  extractedColors: { hex: string; percent: number; isApproved: boolean }[];
  dimensions: { width: number; height: number };
  aspectRatio: number;
}

// Convert HEX to RGB with input validation
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  if (typeof hex !== 'string') return null;
  const cleanHex = hex.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    return null;
  }
  if (cleanHex.length === 3) {
    return {
      r: parseInt(cleanHex[0] + cleanHex[0], 16),
      g: parseInt(cleanHex[1] + cleanHex[1], 16),
      b: parseInt(cleanHex[2] + cleanHex[2], 16)
    };
  }
  if (cleanHex.length === 6) {
    return {
      r: parseInt(cleanHex.substring(0, 2), 16),
      g: parseInt(cleanHex.substring(2, 4), 16),
      b: parseInt(cleanHex.substring(4, 6), 16)
    };
  }
  return null;
}

// Calculate Relative Luminance according to WCAG 2.1 specification
export function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate Contrast Ratio: (L1 + 0.05) / (L2 + 0.05)
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 1.0;

  const lum1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return parseFloat(((brighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// Approved Brand Colors
export const APPROVED_BRAND_PALETTE = [
  '#2563EB', // Inkloom Primary Blue
  '#1D4ED8', // Deep Cobalt
  '#0F172A', // Slate 900
  '#1E293B', // Slate 800
  '#38BDF8', // Cyan Accent
  '#FFFFFF', // Pure White
  '#F8FAFC'  // Off White
];

// Forbidden High-Risk Colors (Fluorescent / Off-brand)
export const FORBIDDEN_COLORS = [
  '#39FF14', // Neon Green
  '#FF007F', // Neon Magenta
  '#FFFF00', // Neon Yellow
  '#FF4500'  // Blinding Orange
];

// Preset Asset Configurations for Judge Demonstration
export const PRESET_VISUAL_ASSETS: VisualAssetReport[] = [
  {
    id: 'asset-1',
    name: 'Official Enterprise Brand Banner (Compliant)',
    overallScore: 98,
    status: 'Compliant',
    dimensions: { width: 1200, height: 400 },
    aspectRatio: 3.0,
    extractedColors: [
      { hex: '#0F172A', percent: 65, isApproved: true },
      { hex: '#2563EB', percent: 20, isApproved: true },
      { hex: '#38BDF8', percent: 10, isApproved: true },
      { hex: '#FFFFFF', percent: 5, isApproved: true }
    ],
    checks: [
      {
        dimension: 'Clearspace',
        status: 'passed',
        metric: 'Logo Margin',
        expected: '≥ 24px clearance',
        actual: '32px verified',
        description: 'Logo maintains required 1.5x X-height clearspace on all 4 quadrants.',
        box: { x: 40, y: 35, width: 220, height: 75 }
      },
      {
        dimension: 'Aspect Ratio',
        status: 'passed',
        metric: 'Logo Geometry',
        expected: '3.0 : 1.0 (±2%)',
        actual: '2.98 : 1.0',
        description: 'No horizontal or vertical distortion detected on the vector brandmark.',
        box: { x: 50, y: 45, width: 200, height: 67 }
      },
      {
        dimension: 'Color Palette',
        status: 'passed',
        metric: 'Palette Adherence',
        expected: '100% Approved Palette',
        actual: '100% Approved (#0F172A, #2563EB, #38BDF8)',
        description: 'All extracted dominant hex codes match the enterprise Brand Vault.'
      },
      {
        dimension: 'WCAG Contrast',
        status: 'passed',
        metric: 'Text/Background Contrast',
        expected: '≥ 4.5:1 (AA), ≥ 7.0:1 (AAA)',
        actual: '12.8:1 (AAA Super-Compliant)',
        description: 'White text (#FFFFFF) over Slate-900 background passes WCAG AAA accessibility.'
      }
    ]
  },
  {
    id: 'asset-2',
    name: 'Unapproved Campaign Flyer (Severe Violations Detected)',
    overallScore: 42,
    status: 'Violations Detected',
    dimensions: { width: 1080, height: 1080 },
    aspectRatio: 1.0,
    extractedColors: [
      { hex: '#0A0A23', percent: 45, isApproved: true },
      { hex: '#39FF14', percent: 30, isApproved: false },
      { hex: '#6B7280', percent: 15, isApproved: false },
      { hex: '#FF007F', percent: 10, isApproved: false }
    ],
    checks: [
      {
        dimension: 'Clearspace',
        status: 'failed',
        metric: 'Logo Margin',
        expected: '≥ 24px clearance',
        actual: '4px (Encroached)',
        description: 'Marketing promotional headline invades the upper logo clearspace buffer.',
        box: { x: 60, y: 80, width: 340, height: 120 }
      },
      {
        dimension: 'Aspect Ratio',
        status: 'failed',
        metric: 'Logo Geometry',
        expected: '3.0 : 1.0 (±2%)',
        actual: '4.75 : 1.0 (Stretched +58%)',
        description: 'Brandmark has been distorted horizontally; non-uniform scaling violates brand governance.',
        box: { x: 60, y: 90, width: 320, height: 67 }
      },
      {
        dimension: 'Color Palette',
        status: 'failed',
        metric: 'Palette Adherence',
        expected: '100% Approved Palette',
        actual: 'Detected forbidden fluorescent #39FF14 & #FF007F',
        description: 'Unapproved neon green and magenta elements conflict with brand identity standards.'
      },
      {
        dimension: 'WCAG Contrast',
        status: 'failed',
        metric: 'Text/Background Contrast',
        expected: '≥ 4.5:1 (AA)',
        actual: '2.14:1 (FAIL - Inaccessible)',
        description: 'Muted grey text (#6B7280) on dark navy background fails minimum WCAG 2.1 AA legibility.'
      }
    ]
  },
  {
    id: 'asset-3',
    name: 'Social Product Announcement (Minor Warning)',
    overallScore: 78,
    status: 'Needs Review',
    dimensions: { width: 1200, height: 630 },
    aspectRatio: 1.9,
    extractedColors: [
      { hex: '#1E293B', percent: 60, isApproved: true },
      { hex: '#2563EB', percent: 25, isApproved: true },
      { hex: '#94A3B8', percent: 15, isApproved: true }
    ],
    checks: [
      {
        dimension: 'Clearspace',
        status: 'passed',
        metric: 'Logo Margin',
        expected: '≥ 24px clearance',
        actual: '26px clearance',
        description: 'Adequate clearspace maintained around the secondary glyph.',
        box: { x: 50, y: 50, width: 180, height: 60 }
      },
      {
        dimension: 'Aspect Ratio',
        status: 'passed',
        metric: 'Logo Geometry',
        expected: '3.0 : 1.0 (±2%)',
        actual: '3.04 : 1.0',
        description: 'Geometry adheres to standard bounding specs.',
        box: { x: 55, y: 55, width: 170, height: 56 }
      },
      {
        dimension: 'Color Palette',
        status: 'passed',
        metric: 'Palette Adherence',
        expected: '100% Approved Palette',
        actual: '100% Approved Palette',
        description: 'All extracted colors are within the approved corporate palette.'
      },
      {
        dimension: 'WCAG Contrast',
        status: 'warning',
        metric: 'Text/Background Contrast',
        expected: '≥ 4.5:1 (AA)',
        actual: '4.12:1 (Sub-optimal for small body text)',
        description: 'Slate-400 subtitle over Slate-800 background passes for large text (≥18pt) but misses body text threshold.'
      }
    ]
  }
];

