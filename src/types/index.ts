export type Dimension = 
  | 'tone' 
  | 'terminology' 
  | 'facts' 
  | 'promotional' 
  | 'visual' 
  | 'accessibility';

export type Severity = 'critical' | 'warning' | 'suggestion';

export interface Violation {
  id: string;
  dimension: Dimension;
  severity: Severity;
  flaggedText: string;
  explanation: string;
  guidelineCitation: string;
  guidelineId: string;
  suggestedCorrection: string;
  applied: boolean;
  ignored: boolean;
  ignoreReason?: string;
  charIndex?: number;
}

export interface BrandGuideline {
  id: string;
  category: Dimension;
  title: string;
  rule: string;
  rationale: string;
  severity: Severity;
  examples: { bad: string; good: string }[];
}

export interface GlossaryTerm {
  id: string;
  deprecatedTerm: string;
  approvedTerm: string;
  caseSensitive: boolean;
  category: string;
  reason: string;
}

export interface VerifiedFact {
  id: string;
  claimTopic: string;
  verifiedValue: string;
  source: string;
  lastVerified: string;
  bannedOverstatements: string[];
}

export interface VisualAssetRule {
  id: string;
  name: string;
  primaryHex: string;
  secondaryHex: string;
  accentHex: string;
  bannedColors: { hex: string; name: string; reason: string }[];
  minContrastRatio: number;
  logoClearSpacePx: number;
}

export type DocumentFormat = 'press_release' | 'blog_post' | 'social_ad' | 'banner' | 'whitepaper';

export type DocumentStatus = 'draft' | 'under_review' | 'changes_requested' | 'approved' | 'published';

export interface AuditComment {
  id: string;
  author: string;
  role: string;
  text: string;
  timestamp: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  author: string;
  format: DocumentFormat;
  content: string;
  bannerImage?: string;
  status: DocumentStatus;
  score: number;
  violations: Violation[];
  comments: AuditComment[];
  createdAt: string;
  updatedAt: string;
  certifiedAt?: string;
  certificateId?: string;
}

export type UserRole = 'creator' | 'reviewer' | 'legal';

