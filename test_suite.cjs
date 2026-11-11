// Self-contained test suite for Inkloom BrandGuard
const initialGlossary = [
  { id: 'GLOSS-1', deprecatedTerm: 'AI bot', approvedTerm: 'Autonomous Copilot', caseSensitive: false, reason: 'Updated to reflect autonomous agentic capabilities.' },
  { id: 'GLOSS-2', deprecatedTerm: 'crypto coins', approvedTerm: 'Digital Assets', caseSensitive: false, reason: 'Institutional compliance.' },
  { id: 'GLOSS-3', deprecatedTerm: 'crypto coin', approvedTerm: 'Digital Asset', caseSensitive: false, reason: 'Institutional compliance.' },
  { id: 'GLOSS-4', deprecatedTerm: 'master-slave', approvedTerm: 'primary-replica', caseSensitive: false, reason: 'Inclusive language.' },
  { id: 'GLOSS-5', deprecatedTerm: 'patients', approvedTerm: 'members', caseSensitive: false, reason: 'Member-centric vocabulary.' },
  { id: 'GLOSS-6', deprecatedTerm: 'web app', approvedTerm: 'Web Portal', caseSensitive: true, reason: 'Official trademark.' }
];

function auditContent(text, activeColors = []) {
  const violations = [];
  const lowerText = text.toLowerCase();

  // Terminology
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
        suggestedCorrection: term.approvedTerm
      });
    }
  }

  // Tone
  const tonePatterns = [
    { regex: /totally suck[s]?/gi, good: 'face critical operational constraints' },
    { regex: /ditch those dinosaurs/gi, good: 'transition smoothly from legacy infrastructure' },
    { regex: /crush your competitors/gi, good: 'accelerate your team\'s competitive advantage' },
    { regex: /badass platform|badass software|badass tool/gi, good: 'enterprise-grade platform' }
  ];

  for (const p of tonePatterns) {
    let match;
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `tone-${match.index}`,
        dimension: 'tone',
        severity: 'critical',
        flaggedText: match[0],
        explanation: 'Derogatory or aggressive language.',
        guidelineCitation: 'Brand Guideline Rule TONE-01',
        suggestedCorrection: p.good
      });
    }
  }

  // Facts
  const fiveNinesRegex = /\b99\.999%/g;
  let match;
  while ((match = fiveNinesRegex.exec(text)) !== null) {
    violations.push({
      id: `fact-uptime-${match.index}`,
      dimension: 'facts',
      severity: 'critical',
      flaggedText: match[0],
      explanation: 'Unverified SLA claim (99.999% vs 99.9%).',
      guidelineCitation: 'Brand Guideline Rule FACT-01',
      suggestedCorrection: '99.9%'
    });
  }

  const customerCountRegex = /\b50,000(\+)?\s*(active)?\s*enterprises\b/gi;
  while ((match = customerCountRegex.exec(text)) !== null) {
    violations.push({
      id: `fact-customers-${match.index}`,
      dimension: 'facts',
      severity: 'warning',
      flaggedText: match[0],
      explanation: 'Outdated metric (12,000 verified).',
      guidelineCitation: 'Brand Guideline Rule FACT-02',
      suggestedCorrection: '12,000+ active enterprise organizations'
    });
  }

  // Promotional Claims
  const promoPatterns = [
    { regex: /100% risk-free guarantee|100% risk-free/gi, good: 'comprehensive risk-mitigation framework' },
    { regex: /zero downside/gi, good: 'calibrated downside exposure' },
    { regex: /guaranteed profit[s]?/gi, good: 'algorithmic return targets' }
  ];

  for (const p of promoPatterns) {
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `promo-${match.index}`,
        dimension: 'promotional',
        severity: 'critical',
        flaggedText: match[0],
        explanation: 'Unsupported promotional guarantee.',
        guidelineCitation: 'Brand Guideline Rule CLAIM-01',
        suggestedCorrection: p.good
      });
    }
  }

  // Accessibility
  const accessPatterns = [
    { regex: /click here right now|click here/gi, good: 'review our technical documentation' }
  ];

  for (const p of accessPatterns) {
    while ((match = p.regex.exec(text)) !== null) {
      violations.push({
        id: `access-${match.index}`,
        dimension: 'accessibility',
        severity: 'suggestion',
        flaggedText: match[0],
        explanation: 'Non-descriptive link anchor text.',
        guidelineCitation: 'Brand Guideline Rule ACCESS-01',
        suggestedCorrection: p.good
      });
    }
  }

  // Calculate score
  let score = 100;
  for (const v of violations) {
    let penalty = v.severity === 'critical' ? 15 : v.severity === 'warning' ? 8 : 4;
    score = Math.max(0, score - penalty);
  }

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return { score, violations, wordCount: words, charCount: text.length };
}

function applyCorrection(originalText, flaggedText, suggestedCorrection) {
  return originalText.replace(flaggedText, suggestedCorrection);
}

function scrubConfidentialData(rawText) {
  let count = 0;
  let text = rawText;

  text = text.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, () => {
    count++;
    return '[REDACTED_EMAIL]';
  });

  text = text.replace(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

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

// ==============================================================
// TEST EXECUTION
// ==============================================================
console.log("==================================================================");
console.log("   INKLOOM BRANDGUARD - COMPREHENSIVE AUTOMATED TEST SUITE        ");
console.log("==================================================================\n");

let passed = 0;
let total = 0;

function check(cond, name, details = '') {
  total++;
  if (cond) {
    console.log(`[PASS] Test ${total.toString().padStart(2, ' ')}: ${name}`);
    passed++;
  } else {
    console.error(`[FAIL] Test ${total.toString().padStart(2, ' ')}: ${name} - ${details}`);
  }
}

// SUITE 1
console.log("--- SUITE 1: Severe Multi-Violation Content ---");
const severeDraft = `Inkloom AI is excited to announce our brand new update! Tired of legacy financial tools that totally suck? Ditch those dinosaurs today and crush your competitors with our badass platform! 

Our automated AI bot helps enterprise teams manage crypto coins on our web app with guaranteed 99.999% uptime. Trusted by over 50,000 active enterprises, our system delivers a 100% risk-free guarantee with zero downside. 

Click here to view our new master-slave database architecture diagram!`;

const a1 = auditContent(severeDraft);
check(a1.score <= 45, 'Score correctly penalizes multiple critical risks', `Score was: ${a1.score}`);
check(a1.violations.length >= 8, 'Detects at least 8 distinct violations', `Found: ${a1.violations.length}`);
check(a1.violations.some(v => v.dimension === 'tone'), 'Dimension 1 detected: Tone & Voice violations');
check(a1.violations.some(v => v.dimension === 'terminology'), 'Dimension 2 detected: Terminology violations');
check(a1.violations.some(v => v.dimension === 'facts'), 'Dimension 3 detected: Factual accuracy & SLA overstatement');
check(a1.violations.some(v => v.dimension === 'promotional'), 'Dimension 4 detected: Illegal promotional guarantees');
check(a1.violations.some(v => v.dimension === 'accessibility'), 'Dimension 5 detected: WCAG accessibility violation');

// SUITE 2
console.log("\n--- SUITE 2: 1-Click Correction & Diff Integrity ---");
let fixedText = severeDraft;
for (const v of a1.violations) {
  fixedText = applyCorrection(fixedText, v.flaggedText, v.suggestedCorrection);
}
const a2 = auditContent(fixedText);
check(a2.score >= 95, 'Score climbs to compliant range after applying suggestions', `Score: ${a2.score}`);
check(a2.violations.length === 0, 'Zero unresolved violations remain after applying fixes', `Count: ${a2.violations.length}`);
check(!fixedText.includes('totally suck'), 'Replaced "totally suck"');
check(!fixedText.includes('AI bot'), 'Replaced "AI bot"');
check(!fixedText.includes('100% risk-free guarantee'), 'Replaced "100% risk-free guarantee"');
check(fixedText.includes('Autonomous Copilot'), 'Now contains approved "Autonomous Copilot"');
check(fixedText.includes('99.9%'), 'Now contains compliant SLA "99.9%"');

// SUITE 3
console.log("\n--- SUITE 3: Clean Compliant Benchmark ---");
const cleanText = `Inkloom AI provides enterprise institutions with dependable infrastructure to manage digital assets on the Web Portal. Operating with verified 99.9% uptime SLAs backed by SOC-2 Type II certification, our platform delivers enterprise resilience. Review our technical documentation for integration guides.`;
const a3 = auditContent(cleanText);
check(a3.score === 100, 'Clean content scores 100%', `Score: ${a3.score}`);
check(a3.violations.length === 0, 'Clean content generates 0 violations');

// SUITE 4
console.log("\n--- SUITE 4: Case-Insensitivity & Punctuation Resilience ---");
const boundaryText = `Managing CRYPTO COIN with our ai bot, and master-slave clusters. It totally SUCKS!`;
const a4 = auditContent(boundaryText);
check(a4.violations.some(v => v.suggestedCorrection === 'Digital Asset'), 'Matches "CRYPTO COIN" uppercase');
check(a4.violations.some(v => v.suggestedCorrection === 'Autonomous Copilot'), 'Matches "ai bot" lowercase with comma');
check(a4.violations.some(v => v.suggestedCorrection === 'primary-replica'), 'Matches "master-slave" hyphenated');
check(a4.violations.some(v => v.flaggedText.toLowerCase() === 'totally sucks'), 'Matches "totally SUCKS!" uppercase with exclamation mark');

// SUITE 5
console.log("\n--- SUITE 5: Client-Side Confidentiality & PII Redactor ---");
const secretText = `Please email sarah.connor@acme-corp.com or call +1 (415) 555-0199 about confidential Project Titan deliverables.`;
const { scrubbedText, redactedCount } = scrubConfidentialData(secretText);
check(redactedCount === 3, 'Redacts 3 sensitive items (Email, Phone, Codename)', `Count: ${redactedCount}`);
check(scrubbedText.includes('[REDACTED_EMAIL]'), 'Email masked properly');
check(scrubbedText.includes('[REDACTED_PHONE]'), 'Phone masked properly');
check(scrubbedText.includes('[REDACTED_INTERNAL_CODENAME]'), 'Internal codename masked properly');
check(!scrubbedText.includes('sarah.connor@acme-corp.com'), 'Original email completely removed');

// SUITE 6
console.log("\n--- SUITE 6: Edge Cases & Performance Latency ---");
const emptyAudit = auditContent('');
check(emptyAudit.score === 100, 'Empty string scores 100% without throwing');
check(emptyAudit.wordCount === 0, 'Empty string word count is 0');

const wsAudit = auditContent('    \n\n\t   ');
check(wsAudit.score === 100, 'Whitespace-only scores 100% without error');

// High-volume performance stress test (5,000 words)
const largeChunk = severeDraft + "\n\n" + cleanText + "\n\n";
let massiveText = '';
for (let i = 0; i < 40; i++) {
  massiveText += largeChunk;
}
const start = performance.now();
const aMassive = auditContent(massiveText);
const elapsed = performance.now() - start;

check(elapsed < 50, `High-volume audit executed in under 50ms (Actual: ${elapsed.toFixed(2)}ms)`);
check(aMassive.wordCount > 3000, `Processed ${aMassive.wordCount} words cleanly`);

console.log("\n==================================================================");
console.log(`TEST SUMMARY: ${passed} / ${total} TESTS PASSED (${((passed/total)*100).toFixed(1)}%)`);
console.log("==================================================================");
