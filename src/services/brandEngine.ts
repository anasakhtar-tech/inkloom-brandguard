import { Violation, Dimension, Severity } from '../types';
import { initialGuidelines, initialGlossary, initialVerifiedFacts, initialVisualRules } from '../data/brandVaultData';

export interface AuditResult {
  score: number;
  violations: Violation[];
  dimensionScores: Record<Dimension, number>;
  charCount: number;
  wordCount: number;
  readabilityLevel: string;
}

export function auditContent(text: string, activeColors: string[] = []): AuditResult {
  const violations: Violation[] = [];
  const lowerText = text.toLowerCase();

  // -------------------------------------------------------------
  // 1. TERMINOLOGY & GLOSSARY CHECKS
  // -------------------------------------------------------------
  for (const term of initialGlossary) {
    const regex = term.caseSensitive
      ? new RegExp(`\\b${term.deprecatedTerm}\\b`, 'g')
      : new RegExp(`\\b${term.deprecatedTerm}\\b`, 'gi');

    let match;
    while ((match = regex.exec(text)) !== null) {
      violations.push({
        id: `term-${term.id}-${match.index}`,
        dimension: 'terminology',
        severity: 'critical',
        flaggedText: match[0],
        explanation: `Deprecated terminology: "${match[0]}". ${term.reason}`,
        guidelineCitation: 'Brand Guideline Rule TERM-01 (Product Suite Glossary)',
        guidelineId: 'TERM-01',
        suggestedCorrection: term.approvedTerm,
        applied: false,
        ignored: false,
        charIndex: match.index
      });
    }
  }

  // -------------------------------------------------------------
  // 2. TONE & VOICE CHECKS
  // -------------------------------------------------------------
  const tonePatterns = [
    {
      regex: /totally suck[s]?/gi,
      bad: 'totally sucks',
      good: 'face critical operational constraints',
      explanation: 'Derogatory informal language disparages legacy systems and breaches enterprise tone standards.',
      citation: 'Brand Guideline Rule TONE-01 (Respectful Positioning)'
    },
    {
      regex: /ditch those dinosaurs/gi,
      bad: 'ditch those dinosaurs',
      good: 'transition smoothly from legacy infrastructure',
      explanation: 'Aggressive disparagement of competitor tools damages institutional credibility.',
      citation: 'Brand Guideline Rule TONE-01 (Empathetic Brand Identity)'
    },
    {
      regex: /crush your competitors/gi,
      bad: 'crush your competitors',
      good: 'accelerate your team\'s competitive advantage',
      explanation: 'Overly aggressive "bro-talk" conflicts with empathetic and collaborative brand pillars.',
      citation: 'Brand Guideline Rule TONE-01 (Professional Demeanor)'
    },
    {
      regex: /badass platform|badass software|badass tool/gi,
      bad: 'badass platform',
      good: 'enterprise-grade platform',
      explanation: 'Hyperbolic profanity/slang weakens positioning with executive and enterprise procurement teams.',
      citation: 'Brand Guideline Rule TONE-02 (Measured Enterprise Voice)'
    }
  ];

  for (const p of tonePatterns) {
    let match;
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `tone-${match.index}`,
        dimension: 'tone',
        severity: 'critical',
        flaggedText: match[0],
        explanation: p.explanation,
        guidelineCitation: p.citation,
        guidelineId: 'TONE-01',
        suggestedCorrection: p.good,
        applied: false,
        ignored: false,
        charIndex: match.index
      });
    }
  }

  // -------------------------------------------------------------
  // 3. FACTUAL CLAIMS & ACCURACY CHECKS
  // -------------------------------------------------------------
  // Check for five-nines uptime exaggeration
  const fiveNinesRegex = /\b99\.999%\b/g;
  let match;
  while ((match = fiveNinesRegex.exec(text)) !== null) {
    violations.push({
      id: `fact-uptime-${match.index}`,
      dimension: 'facts',
      severity: 'critical',
      flaggedText: match[0],
      explanation: 'Unverified SLA claim: Contractual enterprise commitment is 99.9% uptime, not five-nines (99.999%).',
      guidelineCitation: 'Brand Guideline Rule FACT-01 (Audited SLA Commitments)',
      guidelineId: 'FACT-01',
      suggestedCorrection: '99.9%',
      applied: false,
      ignored: false,
      charIndex: match.index
    });
  }

  // Check for exaggerated customer count
  const customerCountRegex = /\b50,000(\+)?\s*(active)?\s*enterprises\b/gi;
  while ((match = customerCountRegex.exec(text)) !== null) {
    violations.push({
      id: `fact-customers-${match.index}`,
      dimension: 'facts',
      severity: 'warning',
      flaggedText: match[0],
      explanation: 'Outdated/Exaggerated metric: Q4 2025 audited scale is "over 12,000 active enterprises".',
      guidelineCitation: 'Brand Guideline Rule FACT-02 (Audited Scale Metrics)',
      guidelineId: 'FACT-02',
      suggestedCorrection: '12,000+ active enterprise organizations',
      applied: false,
      ignored: false,
      charIndex: match.index
    });
  }

  // Check for "unhackable" claim
  const unhackableRegex = /\bunhackable\b/gi;
  while ((match = unhackableRegex.exec(text)) !== null) {
    violations.push({
      id: `fact-unhackable-${match.index}`,
      dimension: 'facts',
      severity: 'critical',
      flaggedText: match[0],
      explanation: 'Absolute security claim ("unhackable") violates corporate risk disclosure policy. Use SOC-2 certified posture.',
      guidelineCitation: 'Brand Guideline Rule FACT-03 (Security Assurance Language)',
      guidelineId: 'FACT-03',
      suggestedCorrection: 'SOC-2 Type II validated',
      applied: false,
      ignored: false,
      charIndex: match.index
    });
  }

  // -------------------------------------------------------------
  // 4. UNSUPPORTED PROMOTIONAL CLAIMS & REGULATORY RISKS
  // -------------------------------------------------------------
  const promoPatterns = [
    {
      regex: /100% risk-free guarantee|100% risk-free/gi,
      good: 'comprehensive risk-mitigation framework',
      explanation: 'Promising "100% risk-free" returns or guarantees violates FTC and SEC financial promotion guidelines.',
      citation: 'Brand Guideline Rule CLAIM-01 (Prohibition of Risk-Free Guarantees)'
    },
    {
      regex: /zero downside/gi,
      good: 'calibrated downside exposure',
      explanation: 'Unsubstantiated claim of "zero downside" is legally prohibited without statutory risk disclaimers.',
      citation: 'Brand Guideline Rule CLAIM-01 (Regulatory Financial Disclaimers)'
    },
    {
      regex: /guaranteed profit[s]?/gi,
      good: 'algorithmic return targets',
      explanation: 'Guaranteed profits claim introduces immediate regulatory enforcement and false advertising liability.',
      citation: 'Brand Guideline Rule CLAIM-01 (SEC Advertising Rule 206(4)-1)'
    }
  ];

  for (const p of promoPatterns) {
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `promo-${match.index}`,
        dimension: 'promotional',
        severity: 'critical',
        flaggedText: match[0],
        explanation: p.explanation,
        guidelineCitation: p.citation,
        guidelineId: 'CLAIM-01',
        suggestedCorrection: p.good,
        applied: false,
        ignored: false,
        charIndex: match.index
      });
    }
  }

  // -------------------------------------------------------------
  // 5. ACCESSIBILITY & INCLUSIVITY (WCAG 2.1)
  // -------------------------------------------------------------
  const accessPatterns = [
    {
      regex: /click here right now|click here/gi,
      good: 'review our technical documentation',
      explanation: 'Non-descriptive anchor text ("click here") violates WCAG 2.1 SC 2.4.4 for screen-reader accessibility.',
      citation: 'Brand Guideline Rule ACCESS-01 (Descriptive Link Anchors)'
    }
  ];

  for (const p of accessPatterns) {
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `access-${match.index}`,
        dimension: 'accessibility',
        severity: 'suggestion',
        flaggedText: match[0],
        explanation: p.explanation,
        guidelineCitation: p.citation,
        guidelineId: 'ACCESS-01',
        suggestedCorrection: p.good,
        applied: false,
        ignored: false,
        charIndex: match.index
      });
    }
  }

  // -------------------------------------------------------------
  // 6. VISUAL & COLOR PALETTE CHECKS
  // -------------------------------------------------------------
  for (const banned of initialVisualRules.bannedColors) {
    // Check if the banned color is explicitly in activeColors or mentioned in text
    const inColors = activeColors.some(c => c.toLowerCase() === banned.hex.toLowerCase());
    const inText = lowerText.includes(banned.hex.toLowerCase());

    if (inColors || inText) {
      violations.push({
        id: `vis-${banned.hex}`,
        dimension: 'visual',
        severity: 'warning',
        flaggedText: banned.hex,
        explanation: `Unapproved palette color: ${banned.name} (${banned.hex}). ${banned.reason}`,
        guidelineCitation: 'Brand Guideline Rule VISUAL-01 (Approved Brand Palette Standards)',
        guidelineId: 'VISUAL-01',
        suggestedCorrection: initialVisualRules.primaryHex,
        applied: false,
        ignored: false
      });
    }
  }

  // -------------------------------------------------------------
  // CALCULATE OVERALL SCORE & DIMENSION BREAKDOWN
  // -------------------------------------------------------------
  let score = 100;
  const dimensionScores: Record<Dimension, number> = {
    tone: 100,
    terminology: 100,
    facts: 100,
    promotional: 100,
    visual: 100,
    accessibility: 100
  };

  for (const v of violations) {
    let penalty = 0;
    if (v.severity === 'critical') penalty = 15;
    else if (v.severity === 'warning') penalty = 8;
    else penalty = 4;

    score = Math.max(0, score - penalty);
    dimensionScores[v.dimension] = Math.max(0, dimensionScores[v.dimension] - penalty * 2);
  }

  // Word & Char counts
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;

  // Readability
  let readability = 'Professional & Accessible (Grade 9-11)';
  if (words > 100 && text.includes(';') && text.includes('architecture')) {
    readability = 'Advanced Technical / Institutional';
  }

  return {
    score,
    violations,
    dimensionScores,
    charCount: chars,
    wordCount: words,
    readabilityLevel: readability
  };
}

/**
 * Cleanly applies a suggestion to the text without destroying other text
 */
export function applyCorrection(originalText: string, flaggedText: string, suggestedCorrection: string): string {
  // Replace the first occurrence of flaggedText
  return originalText.replace(flaggedText, suggestedCorrection);
}

/**
 * Client-Side PII & Confidential Data Scrubber
 */
export function scrubConfidentialData(rawText: string): { scrubbedText: string; redactedCount: number } {
  let count = 0;
  let text = rawText;

  // Email regex
  text = text.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, () => {
    count++;
    return '[REDACTED_EMAIL]';
  });

  // Phone number regex
  text = text.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

  // Internal confidential codenames
  const codenames = ['Project Titan', 'Project Valkyrie', 'Stealth Core', 'Apollo 26'];
  for (const code of codenames) {
    const r = new RegExp(code, 'gi');
    if (r.test(text)) {
      text = text.replace(r, () => {
        count++;
        return '[REDACTED_INTERNAL_CODENAME]';
      });
    }
  }

  return { scrubbedText: text, redactedCount: count };
}
