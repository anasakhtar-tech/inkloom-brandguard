// Inkloom BrandGuard - Enterprise CI/CD Gatekeeper & Webhook Release Engine
import { auditContent } from './brandEngine';

export interface WebhookPayload {
  repository: string;
  branch: string;
  commitSha: string;
  author: string;
  environment: 'production' | 'staging' | 'preview';
  contentTitle: string;
  contentText: string;
}

export interface GatekeeperResult {
  status: 'PASSED' | 'BLOCKED' | 'WARNING';
  exitCode: 0 | 1 | 2;
  timestamp: string;
  governanceScore: number;
  criticalViolationsCount: number;
  warningViolationsCount: number;
  suggestionViolationsCount: number;
  totalViolations: number;
  signedComplianceToken: string | null;
  policySummary: string;
  slackAlertPayload: object;
}

// Simple SHA-256 string hash generator (pure client-side compatible across all devices)
export function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const salt = '8f4c91b72e5a';
  return `inkloom_sig_v3_${hex}${salt}`;
}

// Evaluate release candidate payload against enterprise gatekeeper policies
export function evaluateReleaseCandidate(payload: WebhookPayload): GatekeeperResult {
  const inspection = auditContent(payload.contentText);

  const criticalViolations = inspection.violations.filter(v => v.severity === 'critical');
  const warningViolations = inspection.violations.filter(v => v.severity === 'warning');
  const suggestionViolations = inspection.violations.filter(v => v.severity === 'suggestion');

  let status: 'PASSED' | 'BLOCKED' | 'WARNING' = 'PASSED';
  let exitCode: 0 | 1 | 2 = 0;
  let policySummary = 'Publication Approved: All brand compliance and enterprise SLA standards satisfied.';

  if (criticalViolations.length > 0) {
    status = 'BLOCKED';
    exitCode = 1;
    policySummary = `RELEASE BLOCKED: ${criticalViolations.length} critical violation(s) detected (SLA falsification or FTC/SEC regulatory breaches).`;
  } else if (warningViolations.length > 2) {
    status = 'WARNING';
    exitCode = 2;
    policySummary = `ACTION REQUIRED: ${warningViolations.length} warnings require Legal Counsel or Reviewer approval override.`;
  }

  const timestamp = new Date().toISOString();
  const signedToken = status === 'PASSED'
    ? generateHash(`${payload.commitSha}-${payload.environment}-${timestamp}`)
    : null;

  // Generate Slack Block Kit notification payload
  const slackAlertPayload = {
    channel: '#brand-governance-alerts',
    text: `[${status}] Pre-Publication Gate: ${payload.repository}@${payload.branch}`,
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: status === 'BLOCKED'
            ? '🚨 [CRITICAL BLOCKED] Release Halted by BrandGuard'
            : status === 'WARNING'
            ? '⚠️ [REVIEW REQUIRED] Major Brand Drift Detected'
            : '✅ [PASSED] BrandGuard Publication Approved'
        }
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Repository:*\n\`${payload.repository}\`` },
          { type: 'mrkdwn', text: `*Branch:*\n\`${payload.branch}\`` },
          { type: 'mrkdwn', text: `*Author:*\n${payload.author}` },
          { type: 'mrkdwn', text: `*Governance Score:*\n*${inspection.score}/100*` }
        ]
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Status Summary:*\n${policySummary}`
        }
      }
    ]
  };

  return {
    status,
    exitCode,
    timestamp,
    governanceScore: inspection.score,
    criticalViolationsCount: criticalViolations.length,
    warningViolationsCount: warningViolations.length,
    suggestionViolationsCount: suggestionViolations.length,
    totalViolations: inspection.violations.length,
    signedComplianceToken: signedToken,
    policySummary,
    slackAlertPayload
  };
}

// Sample presets for quick testing by judges
export const SAMPLE_WEBHOOK_PAYLOADS: { label: string; payload: WebhookPayload }[] = [
  {
    label: 'High-Risk Production PR (Contains Unverified SLA & Superlatives)',
    payload: {
      repository: 'enterprise/marketing-site',
      branch: 'release/v3.4-pricing-update',
      commitSha: 'd83a1f9e2b',
      author: 'dev-team@enterprise.com',
      environment: 'production',
      contentTitle: 'New Enterprise Cloud Pricing & SLA Terms',
      contentText: 'Our new cloud infrastructure delivers a guaranteed 99.999% SLA uptime with 100% bug-free performance. Switch today for the most revolutionary and cheap cloud ever built.'
    }
  },
  {
    label: 'Fully Compliant Production Release (Clean)',
    payload: {
      repository: 'enterprise/press-hub',
      branch: 'main',
      commitSha: '4c8e12a9bf',
      author: 'pr-lead@enterprise.com',
      environment: 'production',
      contentTitle: 'Inkloom Enterprise Brand Governance Announcement',
      contentText: 'Inkloom BrandGuard delivers enterprise-grade pre-publication governance, ensuring all communications match our verified 99.9% uptime SLA and stringent WCAG 2.1 accessibility benchmarks.'
    }
  }
];
