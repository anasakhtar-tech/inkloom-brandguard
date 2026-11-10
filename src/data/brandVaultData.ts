import { BrandGuideline, GlossaryTerm, VerifiedFact, VisualAssetRule, DocumentItem } from '../types';

export const initialGuidelines: BrandGuideline[] = [
  {
    id: 'TONE-01',
    category: 'tone',
    title: 'Respectful & Empathetic Positioning',
    rule: 'Never use derogatory slang, aggressive bro-talk, or direct insults against legacy competitors (e.g. "dinosaurs", "sucks").',
    rationale: 'Our enterprise brand identity is authoritative, measured, and respectful. Disparaging others erodes customer trust.',
    severity: 'critical',
    examples: [
      { bad: 'Tired of legacy tools that totally suck? Ditch those dinosaurs!', good: 'Transition seamlessly from legacy tools to our modern cloud platform.' }
    ]
  },
  {
    id: 'TONE-02',
    category: 'tone',
    title: 'Measured Professionalism Over Hype',
    rule: 'Avoid hyperbolic buzzwords and sensationalist superlatives like "our badass tool" or "world-shattering AI".',
    rationale: 'Substantiate claims with technical value rather than hyperbole.',
    severity: 'warning',
    examples: [
      { bad: 'Our badass software will crush your competitors.', good: 'Our robust enterprise platform delivers a competitive edge.' }
    ]
  },
  {
    id: 'TERM-01',
    category: 'terminology',
    title: 'Deprecated Product Naming',
    rule: 'Replace deprecated phrases like "AI bot" with "Autonomous Copilot", and "web app" with "Web Portal".',
    rationale: 'Consistency in trademarked product names reinforces brand recognition across market analysts.',
    severity: 'critical',
    examples: [
      { bad: 'Our automated AI bot manages data.', good: 'Our Autonomous Copilot manages data.' }
    ]
  },
  {
    id: 'TERM-02',
    category: 'terminology',
    title: 'Inclusive Technical Terminology',
    rule: 'Use inclusive infrastructure terminology: replace "master-slave" with "primary-replica" or "active-standby".',
    rationale: 'Inkloom adheres to modern open-source inclusive language standards.',
    severity: 'critical',
    examples: [
      { bad: 'Configure our master-slave database cluster.', good: 'Configure our primary-replica database cluster.' }
    ]
  },
  {
    id: 'FACT-01',
    category: 'facts',
    title: 'Verified Uptime & Performance SLAs',
    rule: 'Only quote contractual SLA (99.9% uptime). Do not claim five-nines (99.999%) which is unverified.',
    rationale: 'Quoting uncontracted SLAs introduces breach-of-contract liability in enterprise sales.',
    severity: 'critical',
    examples: [
      { bad: 'Guaranteed 99.999% zero-downtime architecture.', good: 'Guaranteed 99.9% uptime supported by enterprise SLAs.' }
    ]
  },
  {
    id: 'FACT-02',
    category: 'facts',
    title: 'Audited Customer Counts & Metrics',
    rule: 'Reference verified customer scale of "over 12,000 active enterprises", not exaggerated counts like 50,000+.',
    rationale: 'Verified Q4 2025 audited numbers must be maintained across all public collateral.',
    severity: 'warning',
    examples: [
      { bad: 'Trusted by over 50,000 enterprise organizations.', good: 'Trusted by over 12,000 active enterprise organizations.' }
    ]
  },
  {
    id: 'CLAIM-01',
    category: 'promotional',
    title: 'Prohibition of "Risk-Free" Financial Guarantees',
    rule: 'Never claim "100% risk-free", "guaranteed profit", or "zero downside" without mandatory regulatory disclaimers.',
    rationale: 'Violates FTC and SEC marketing guidelines for enterprise financial technology products.',
    severity: 'critical',
    examples: [
      { bad: 'Invest risk-free today with zero downside guaranteed!', good: 'Explore algorithmic capital optimization designed to mitigate portfolio volatility.' }
    ]
  },
  {
    id: 'ACCESS-01',
    category: 'accessibility',
    title: 'Descriptive Hyperlink Text (WCAG 2.1)',
    rule: 'Never use ambiguous link anchors like "click here" or "learn more". Describe the destination clearly.',
    rationale: 'Screen readers require descriptive anchor text for accessibility compliance.',
    severity: 'suggestion',
    examples: [
      { bad: 'Click here to download our technical whitepaper.', good: 'Review the technical architecture whitepaper for implementation details.' }
    ]
  },
  {
    id: 'VISUAL-01',
    category: 'visual',
    title: 'Strict Brand Color Palette Adherence',
    rule: 'Prohibit unapproved fluorescent colors (e.g. Neon Magenta #FF007F or Neon Green #39FF14) in marketing banners.',
    rationale: 'Preserves the enterprise credibility and contrast standards of Inkloom corporate identity.',
    severity: 'warning',
    examples: [
      { bad: 'Background set to #FF007F neon magenta.', good: 'Background set to #0F172A corporate dark slate.' }
    ]
  }
];

export const initialGlossary: GlossaryTerm[] = [
  {
    id: 'GLOSS-1',
    deprecatedTerm: 'AI bot',
    approvedTerm: 'Autonomous Copilot',
    caseSensitive: false,
    category: 'Product Suite',
    reason: 'Updated in Q1 2026 to reflect autonomous agentic capabilities rather than scripted bots.'
  },
  {
    id: 'GLOSS-2',
    deprecatedTerm: 'crypto coins',
    approvedTerm: 'Digital Assets',
    caseSensitive: false,
    category: 'Industry Standard',
    reason: 'Institutional financial partners require compliant digital asset terminology.'
  },
  {
    id: 'GLOSS-3',
    deprecatedTerm: 'crypto coin',
    approvedTerm: 'Digital Asset',
    caseSensitive: false,
    category: 'Industry Standard',
    reason: 'Compliant institutional terminology.'
  },
  {
    id: 'GLOSS-4',
    deprecatedTerm: 'master-slave',
    approvedTerm: 'primary-replica',
    caseSensitive: false,
    category: 'Inclusivity',
    reason: 'Global inclusive engineering taxonomy compliance.'
  },
  {
    id: 'GLOSS-5',
    deprecatedTerm: 'patients',
    approvedTerm: 'members',
    caseSensitive: false,
    category: 'HealthTech Voice',
    reason: 'Brand guideline mandates empowering, member-centric vocabulary.'
  },
  {
    id: 'GLOSS-6',
    deprecatedTerm: 'web app',
    approvedTerm: 'Web Portal',
    caseSensitive: true,
    category: 'Product Trademark',
    reason: 'Official trademark capitalization standard.'
  }
];

export const initialVerifiedFacts: VerifiedFact[] = [
  {
    id: 'FACT-1',
    claimTopic: 'Active Enterprise Customers',
    verifiedValue: '12,000+ active enterprise organizations',
    source: 'Q4 2025 Audited Financial Statement',
    lastVerified: '2026-01-15',
    bannedOverstatements: ['50,000+', '100,000+', 'millions of companies']
  },
  {
    id: 'FACT-2',
    claimTopic: 'Uptime SLA Guarantee',
    verifiedValue: '99.9% uptime SLA backed by contractual guarantees',
    source: 'Enterprise Master Services Agreement (MSA)',
    lastVerified: '2026-02-01',
    bannedOverstatements: ['99.999%', '100% uptime', 'zero-downtime ever']
  },
  {
    id: 'FACT-3',
    claimTopic: 'Security Certification',
    verifiedValue: 'SOC-2 Type II Certified and ISO 27001 Compliant',
    source: 'Security Assurance Audit Report 2025',
    lastVerified: '2025-11-20',
    bannedOverstatements: ['Unhackable', '100% bulletproof security']
  },
  {
    id: 'FACT-4',
    claimTopic: 'Venture Capital Funding',
    verifiedValue: '$45M Series B funding led by Sequoia Growth',
    source: 'Official Press Release (October 2025)',
    lastVerified: '2025-10-12',
    bannedOverstatements: ['$100M funding', 'Series C valuation']
  }
];

export const initialVisualRules: VisualAssetRule = {
  id: 'VIS-RULE-1',
  name: 'Inkloom Global Digital Brand Standards',
  primaryHex: '#0F172A',
  secondaryHex: '#2563EB',
  accentHex: '#38BDF8',
  bannedColors: [
    { hex: '#FF007F', name: 'Neon Magenta', reason: 'Fails enterprise contrast standards and clashes with brand palette.' },
    { hex: '#39FF14', name: 'Fluorescent Green', reason: 'Unapproved promotional color.' },
    { hex: '#8B5CF6', name: 'Competitor Purple', reason: 'Reserved trademark hue of direct competitor.' }
  ],
  minContrastRatio: 4.5,
  logoClearSpacePx: 24
};

export const samplePresetDocuments: DocumentItem[] = [
  {
    id: 'DOC-001',
    title: 'Series B & Autonomous Copilot Expansion Announcement',
    author: 'Alex Turner (Growth Copywriter)',
    format: 'press_release',
    content: `Inkloom AI is excited to announce our brand new update! Tired of legacy financial tools that totally suck? Ditch those dinosaurs today and crush your competitors with our badass platform! 

Our automated AI bot helps enterprise teams manage crypto coins on our web app with guaranteed 99.999% uptime. Trusted by over 50,000 active enterprises, our system delivers a 100% risk-free guarantee with zero downside. 

Click here to view our new master-slave database architecture diagram and claim your promotional discount before midnight!`,
    status: 'draft',
    score: 38,
    violations: [],
    comments: [
      {
        id: 'COMM-1',
        author: 'Elena Rostova',
        role: 'Brand Manager',
        text: 'This draft contains multiple critical legal and terminology flags. Please review the highlighted rewrites before resubmitting.',
        timestamp: '10 mins ago'
      }
    ],
    createdAt: '2026-11-10 14:30',
    updatedAt: '2026-11-10 14:30'
  },
  {
    id: 'DOC-002',
    title: 'Scaling Distributed Ledger Tech for Enterprise',
    author: 'Dev Advocacy Team',
    format: 'blog_post',
    content: `Building scalable distributed systems requires resilient infrastructure. When configuring high-availability database clusters, engineering teams often rely on a traditional master-slave replication model. 

However, modern teams manage digital assets across distributed clouds. Our platform ensures that all members receive continuous performance backed by verified 99.9% uptime SLAs.

Review our technical architecture documentation for deep benchmarks and migration guides.`,
    status: 'under_review',
    score: 84,
    violations: [],
    comments: [
      {
        id: 'COMM-2',
        author: 'Marcus Vance',
        role: 'Legal & Compliance',
        text: 'Language is mostly compliant. Just needs the primary-replica terminology update on line 2.',
        timestamp: '25 mins ago'
      }
    ],
    createdAt: '2026-11-09 11:15',
    updatedAt: '2026-11-09 16:40'
  },
  {
    id: 'DOC-003',
    title: 'Social Ad Campaign: Fast Institutional Settlements',
    author: 'Agency Partner (Vanguard Creative)',
    format: 'social_ad',
    content: `Why wait days for bank settlements? Our unhackable AI bot allows instant transaction clearing with zero fees and guaranteed profits every single trading cycle! Click here right now!`,
    status: 'changes_requested',
    score: 22,
    violations: [],
    comments: [
      {
        id: 'COMM-3',
        author: 'Marcus Vance',
        role: 'Legal & Compliance',
        text: 'REJECTED: Claims of "unhackable" and "guaranteed profits" are severe regulatory violations under FTC Section 5. Needs immediate rewrite.',
        timestamp: '1 hour ago'
      }
    ],
    createdAt: '2026-11-08 09:00',
    updatedAt: '2026-11-08 10:12'
  },
  {
    id: 'DOC-004',
    title: 'Q4 Enterprise Growth & Security Milestones (Approved)',
    author: 'Corporate Communications',
    format: 'press_release',
    content: `Inkloom AI today announced significant corporate milestones for the fiscal year, surpassing 12,000+ active enterprise organizations utilizing its Autonomous Copilot suite.

Operating with a verified 99.9% uptime SLA and validated SOC-2 Type II certification, Inkloom provides institutions with dependable infrastructure to manage digital assets on the Web Portal.

Explore our verified security certifications and enterprise case studies to learn more about our privacy-first methodology.`,
    status: 'approved',
    score: 98,
    violations: [],
    comments: [
      {
        id: 'COMM-4',
        author: 'Elena Rostova',
        role: 'Brand Manager',
        text: 'Perfect compliance. All verified facts and terminology match our Q4 brand standards.',
        timestamp: 'Yesterday'
      },
      {
        id: 'COMM-5',
        author: 'Marcus Vance',
        role: 'Legal & Compliance',
        text: 'Approved for global press wire distribution.',
        timestamp: 'Yesterday'
      }
    ],
    createdAt: '2026-11-07 16:00',
    updatedAt: '2026-11-08 08:30',
    certifiedAt: '2026-11-08 08:30',
    certificateId: 'CERT-INKLOOM-2026-9812'
  }
];
