/**
 * Inkloom BrandGuard - Round 3 Final Build Submission PDF Generator
 * Team ALTAIR | CodeTitans India 2026 (Top 50 Finalist)
 * Pure Node.js vector PDF generation (Zero external dependencies, cross-platform)
 */

import fs from 'fs';

class Round3PDFBuilder {
  constructor(pageWidth = 612, pageHeight = 792) {
    this.pageWidth = pageWidth;
    this.pageHeight = pageHeight;
    this.pages = [];
    this.currentPage = null;
    this.currentY = 740;
    this.marginLeft = 50;
    this.marginRight = 50;
    this.contentWidth = pageWidth - this.marginLeft - this.marginRight;
    this.pageNumber = 0;
    this.addNewPage();
  }

  addNewPage() {
    this.pageNumber++;
    this.currentPage = {
      number: this.pageNumber,
      commands: []
    };
    this.pages.push(this.currentPage);
    this.currentY = this.pageHeight - 55;
    
    if (this.pageNumber > 1) {
      this.drawRunningHeader();
    }
  }

  drawRunningHeader() {
    const y = this.pageHeight - 35;
    this.currentPage.commands.push(
      `q 0.85 0.88 0.92 RG 0.5 w ${this.marginLeft} ${y - 4} ${this.pageWidth - this.marginRight} ${y - 4} m l S Q`
    );
    this.currentPage.commands.push(
      `BT /F2 8 Tf 0.35 0.42 0.52 rg ${this.marginLeft} ${y} Td (CodeTitans India 2026 | Round 3: The Final Build | Team ALTAIR) Tj ET`
    );
    this.currentPage.commands.push(
      `BT /F1 8 Tf 0.15 0.35 0.75 rg ${this.pageWidth - this.marginRight - 120} ${y} Td (Inkloom BrandGuard) Tj ET`
    );
  }

  drawRunningFooter(totalPages) {
    for (let p of this.pages) {
      const y = 35;
      p.commands.push(
        `q 0.85 0.88 0.92 RG 0.5 w ${this.marginLeft} ${y + 12} ${this.pageWidth - this.marginRight} ${y + 12} m l S Q`
      );
      p.commands.push(
        `BT /F2 8 Tf 0.45 0.52 0.60 rg ${this.marginLeft} ${y} Td (FINAL ROUND 3 SUBMISSION - TEAM ALTAIR - LEAD: MD ANAS AKHTAR) Tj ET`
      );
      const pageStr = `Page ${p.number} of ${totalPages}`;
      p.commands.push(
        `BT /F2 8 Tf 0.45 0.52 0.60 rg ${this.pageWidth - this.marginRight - 55} ${y} Td (${pageStr}) Tj ET`
      );
    }
  }

  checkPageBreak(neededHeight) {
    if (this.currentY - neededHeight < 55) {
      this.addNewPage();
    }
  }

  escapeText(str) {
    return str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  addTitle(text, subtitle = null) {
    this.checkPageBreak(85);
    this.currentPage.commands.push(
      `BT /F1 20 Tf 0.06 0.12 0.25 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 24;

    if (subtitle) {
      this.currentPage.commands.push(
        `BT /F2 10 Tf 0.35 0.42 0.52 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(subtitle)}) Tj ET`
      );
      this.currentY -= 16;
    }

    this.currentPage.commands.push(
      `q 0.15 0.39 0.92 RG 2 w ${this.marginLeft} ${this.currentY + 6} ${this.marginLeft + 140} ${this.currentY + 6} m l S Q`
    );
    this.currentY -= 14;
  }

  addHeading1(text) {
    this.checkPageBreak(50);
    this.currentY -= 10;
    this.currentPage.commands.push(
      `BT /F1 13 Tf 0.10 0.20 0.45 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 6;
    this.currentPage.commands.push(
      `q 0.82 0.86 0.92 RG 1 w ${this.marginLeft} ${this.currentY + 2} ${this.pageWidth - this.marginRight} ${this.currentY + 2} m l S Q`
    );
    this.currentY -= 12;
  }

  addHeading2(text) {
    this.checkPageBreak(35);
    this.currentY -= 6;
    this.currentPage.commands.push(
      `BT /F1 10.5 Tf 0.15 0.30 0.60 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 14;
  }

  addParagraph(text) {
    const words = text.split(' ');
    let line = '';
    const maxChars = 85;

    for (let word of words) {
      if ((line + ' ' + word).trim().length > maxChars) {
        this.checkPageBreak(14);
        this.currentPage.commands.push(
          `BT /F3 9.5 Tf 0.20 0.24 0.32 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(line.trim())}) Tj ET`
        );
        this.currentY -= 13;
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    }
    if (line.length > 0) {
      this.checkPageBreak(14);
      this.currentPage.commands.push(
        `BT /F3 9.5 Tf 0.20 0.24 0.32 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(line.trim())}) Tj ET`
      );
      this.currentY -= 15;
    }
  }

  addCallout(title, body) {
    this.checkPageBreak(50);
    const boxHeight = 44;
    const boxY = this.currentY - boxHeight + 10;
    
    this.currentPage.commands.push(
      `q 0.94 0.97 1.0 rg 0.70 0.82 0.98 RG 1 w ${this.marginLeft} ${boxY} ${this.contentWidth} ${boxHeight} re B Q`
    );
    this.currentPage.commands.push(
      `q 0.15 0.39 0.92 rg ${this.marginLeft} ${boxY} 3.5 ${boxHeight} re f Q`
    );
    this.currentPage.commands.push(
      `BT /F1 9 Tf 0.10 0.25 0.65 rg ${this.marginLeft + 12} ${boxY + 26} Td (${this.escapeText(title)}) Tj ET`
    );
    this.currentPage.commands.push(
      `BT /F3 8.5 Tf 0.25 0.32 0.45 rg ${this.marginLeft + 12} ${boxY + 12} Td (${this.escapeText(body)}) Tj ET`
    );
    this.currentY = boxY - 14;
  }

  addBullet(lead, text) {
    this.checkPageBreak(24);
    this.currentPage.commands.push(
      `BT /F1 9 Tf 0.15 0.39 0.92 rg ${this.marginLeft + 4} ${this.currentY} Td (- ) Tj ET`
    );
    this.currentPage.commands.push(
      `BT /F1 9 Tf 0.12 0.18 0.30 rg ${this.marginLeft + 14} ${this.currentY} Td (${this.escapeText(lead)}) Tj ET`
    );
    this.currentY -= 12;

    const words = text.split(' ');
    let line = '';
    const maxChars = 80;

    for (let word of words) {
      if ((line + ' ' + word).trim().length > maxChars) {
        this.checkPageBreak(13);
        this.currentPage.commands.push(
          `BT /F3 9 Tf 0.25 0.30 0.40 rg ${this.marginLeft + 14} ${this.currentY} Td (${this.escapeText(line.trim())}) Tj ET`
        );
        this.currentY -= 12;
        line = word;
      } else {
        line = (line + ' ' + word).trim();
      }
    }
    if (line.length > 0) {
      this.checkPageBreak(13);
      this.currentPage.commands.push(
        `BT /F3 9 Tf 0.25 0.30 0.40 rg ${this.marginLeft + 14} ${this.currentY} Td (${this.escapeText(line.trim())}) Tj ET`
      );
      this.currentY -= 14;
    }
  }

  addTable(headers, rows, colWidths) {
    this.checkPageBreak(28 + rows.length * 18);
    const rowHeight = 18;
    let y = this.currentY;

    // Header background
    this.currentPage.commands.push(
      `q 0.12 0.22 0.42 rg ${this.marginLeft} ${y - rowHeight + 4} ${this.contentWidth} ${rowHeight} re f Q`
    );

    let curX = this.marginLeft;
    for (let i = 0; i < headers.length; i++) {
      this.currentPage.commands.push(
        `BT /F1 8.5 Tf 1 1 1 rg ${curX + 6} ${y - 8} Td (${this.escapeText(headers[i])}) Tj ET`
      );
      curX += colWidths[i];
    }
    y -= rowHeight;

    // Rows
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (r % 2 === 1) {
        this.currentPage.commands.push(
          `q 0.96 0.97 0.99 rg ${this.marginLeft} ${y - rowHeight + 4} ${this.contentWidth} ${rowHeight} re f Q`
        );
      }
      this.currentPage.commands.push(
        `q 0.88 0.90 0.94 RG 0.5 w ${this.marginLeft} ${y - rowHeight + 4} ${this.pageWidth - this.marginRight} ${y - rowHeight + 4} m l S Q`
      );

      curX = this.marginLeft;
      for (let c = 0; c < row.length; c++) {
        const textVal = row[c] || '';
        const font = c === 0 ? '/F1' : '/F3';
        const color = c === 0 ? '0.15 0.20 0.35' : '0.25 0.30 0.40';
        this.currentPage.commands.push(
          `BT ${font} 8 Tf ${color} rg ${curX + 6} ${y - 8} Td (${this.escapeText(textVal)}) Tj ET`
        );
        curX += colWidths[c];
      }
      y -= rowHeight;
    }
    this.currentY = y - 12;
  }

  generatePDFBytes() {
    this.drawRunningFooter(this.pages.length);

    let objects = [];
    let xref = [];
    let offset = 0;

    const addObject = (content) => {
      xref.push(offset);
      const str = `${objects.length + 1} 0 obj\n${content}\nendobj\n`;
      offset += Buffer.byteLength(str, 'utf8');
      objects.push(str);
      return objects.length;
    };

    let body = '%PDF-1.4\n%âãÏÓ\n';
    offset = Buffer.byteLength(body, 'utf8');

    // Font 1: Helvetica-Bold
    const font1Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
    // Font 2: Helvetica-Oblique
    const font2Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique /Encoding /WinAnsiEncoding >>');
    // Font 3: Helvetica
    const font3Id = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');

    // Resources
    const resourcesId = addObject(
      `<< /Font << /F1 ${font1Id} 0 R /F2 ${font2Id} 0 R /F3 ${font3Id} 0 R >> /ProcSet [ /PDF /Text ] >>`
    );

    // Page objects
    let pageObjectIds = [];
    for (let p of this.pages) {
      const streamContent = p.commands.join('\n');
      const streamLen = Buffer.byteLength(streamContent, 'utf8');
      const contentId = addObject(`<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`);

      const pageId = addObject(
        `<< /Type /Page /Parent 0 0 R /MediaBox [ 0 0 ${this.pageWidth} ${this.pageHeight} ] /Contents ${contentId} 0 R /Resources ${resourcesId} 0 R >>`
      );
      pageObjectIds.push(pageId);
    }

    // Pages root
    const pagesKids = pageObjectIds.map(id => `${id} 0 R`).join(' ');
    const pagesId = addObject(`<< /Type /Pages /Kids [ ${pagesKids} ] /Count ${pageObjectIds.length} >>`);

    // Patch Parent in Page objects
    for (let i = 0; i < pageObjectIds.length; i++) {
      const idx = pageObjectIds[i] - 1;
      objects[idx] = objects[idx].replace('/Parent 0 0 R', `/Parent ${pagesId} 0 R`);
    }

    // Catalog
    const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

    // Cross-reference table
    const xrefOffset = offset;
    let xrefStr = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
    for (let o of xref) {
      xrefStr += `${o.toString().padStart(10, '0')} 00000 n \n`;
    }

    const trailer = `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

    return Buffer.concat([
      Buffer.from(body, 'utf8'),
      Buffer.from(objects.join(''), 'utf8'),
      Buffer.from(xrefStr, 'utf8'),
      Buffer.from(trailer, 'utf8')
    ]);
  }
}

// Build Round 3 Document
const doc = new Round3PDFBuilder();

// TITLE & METADATA
doc.addTitle(
  "Inkloom BrandGuard - The Final Build",
  "CodeTitans India 2026 | Round 3 Finalist Submission | Team ALTAIR"
);

doc.addCallout(
  "Top 50 Finalist Project (Selected from 1,000+ Registered Teams Nationwide)",
  "Live Deployment: https://inkloom-brandguard.vercel.app  |  GitHub: https://github.com/anasakhtar-tech/inkloom-brandguard"
);

// SECTION 1: EXECUTIVE OVERVIEW
doc.addHeading1("1. Executive Overview & Problem Context");
doc.addParagraph(
  "Modern enterprises face an unprecedented brand governance crisis: generative AI tools, rapid marketing cadences, and distributed content authors produce thousands of marketing assets, documentation pages, and customer communications daily. Without automated pre-publication controls, organizations suffer from subtle brand voice drift, trademark miscapitalization, hallucinated enterprise SLAs, FTC/SEC regulatory violations, and WCAG accessibility failures."
);
doc.addParagraph(
  "Inkloom BrandGuard is an intelligent pre-publication governance platform that acts as an ambient, explainable release gatekeeper. In Round 3 (The Final Build), Team ALTAIR expanded the platform from a web studio into a complete enterprise ecosystem delivering all three promised improvements: an In-Situ Chrome Extension, a Multimodal Visual Brand Inspector, and an Enterprise CI/CD Gatekeeper."
);

// SECTION 2: DELIVERY OF THE THREE PROMISED IMPROVEMENTS
doc.addHeading1("2. Delivery of the Three Major Promised Improvements");

doc.addHeading2("Improvement 1: Real-Time Chrome Extension & In-Situ Content Interceptor");
doc.addParagraph(
  "We engineered and delivered a complete Manifest V3 Chrome Extension paired with an in-app cross-platform Live DOM Sandbox Simulator. The extension injects an ambient floating governance widget directly into third-party authoring tools (Google Docs, Notion, WordPress, and LinkedIn)."
);
doc.addBullet(
  "Sub-15ms In-Situ DOM Parser:",
  "Watches DOM input and contenteditable mutations, evaluating 6 governance dimensions in under 1.94ms locally in-browser without sending sensitive corporate drafts to external servers."
);
doc.addBullet(
  "Ambient Floating Health Pill & 1-Click Inline Diff Applicator:",
  "Displays real-time governance scores (0-100) and enables authors to accept token-level diff fixes with a single click without breaking document formatting."
);
doc.addBullet(
  "Universal Cross-Platform Accessibility:",
  "Judges on any operating system (Windows, macOS, Linux, iOS, Android) can test the full in-situ experience directly via the in-app interactive sandbox simulator."
);

doc.addHeading2("Improvement 2: Multimodal Visual Brand & Layout Asset Inspector");
doc.addParagraph(
  "We developed the Visual Brand Studio to expand brand governance beyond text into marketing graphics, banners, and presentation flyers using pure HTML5 Canvas pixel analysis."
);
doc.addBullet(
  "Logo Clearspace & Margin Box Verification:",
  "Enforces a strict 1.5x X-height minimum clearance buffer around the brandmark, flagging encroaching headlines or graphic artifacts with interactive canvas overlays."
);
doc.addBullet(
  "Non-Uniform Aspect Ratio Distortion Detection:",
  "Mathematically detects if vector logos or brand assets have been stretched horizontally (+58% in test cases) or squashed vertically."
);
doc.addBullet(
  "Canvas Color Clustering & Forbidden Palette Scanner:",
  "Extracts dominant pixel colors from canvas buffers, flagging unapproved fluorescent colors (e.g. #39FF14 neon green) and ensuring adherence to enterprise brand palettes."
);
doc.addBullet(
  "WCAG 2.1 Text-over-Image Luminance Contrast:",
  "Computes relative luminance ratios across overlay text, enforcing 4.5:1 (AA) and 7.0:1 (AAA) standards with 1-click auto-conform recoloring."
);

doc.addHeading2("Improvement 3: Enterprise CI/CD Gatekeeper & Webhook Engine");
doc.addParagraph(
  "We built an automated pre-publication release gate that integrates directly into GitHub Actions, GitLab CI, and Headless CMS webhooks (Strapi, WordPress, Webflow)."
);
doc.addBullet(
  "Automated Release Blocking Policies:",
  "Incoming PRs and drafts evaluated via POST /api/v1/governance/evaluate. If critical SLA or legal violations exist, the release is blocked with process Exit Code 1."
);
doc.addBullet(
  "Cryptographically Signed HMAC-SHA256 Compliance Tokens:",
  "Approved production releases receive a cryptographic signature (e.g. inkloom_sig_v3_...) that downstream deployment scripts verify before publishing."
);
doc.addBullet(
  "Interactive Slack Incident Broadcast Simulator:",
  "Broadcasts rich Slack Block Kit alerts to #brand-governance-alerts with author metadata, commit SHAs, and interactive Legal Override buttons."
);

// SECTION 3: COMPREHENSIVE ARCHITECTURE & BENCHMARKS
doc.addHeading1("3. System Architecture & Technical Specifications");

doc.addTable(
  ["Component Layer", "Implementation Technology", "Technical Specifications & Hard Problems Solved"],
  [
    ["In-Situ Extension", "Chrome Manifest V3 / Web APIs", "Service worker background architecture, DOM mutation observers, zero battery drain"],
    ["Visual Inspection", "HTML5 Canvas 2D Pixel Buffer", "Relative luminance contrast math, aspect ratio bounding boxes, color clustering"],
    ["CI/CD Gatekeeper", "Web Crypto API / HMAC-SHA256", "Exit code mapping (0/1/2), automated release blocking, Slack Block Kit payloads"],
    ["Hybrid Text Engine", "Deterministic AST + Gemini Flash", "Sub-15ms local checks for 500+ rules, nuanced tone reasoning, 1-click token diffs"],
    ["Client-Side Privacy", "Zero-Retention Regex Sanitizer", "Pre-flight scrubbing of PII, internal codenames, and API keys before external transit"]
  ],
  [110, 145, 257]
);

// SECTION 4: TESTING & VERIFICATION RESULTS
doc.addHeading1("4. Automated Testing Battery & Verification Notes");
doc.addParagraph(
  "To guarantee rock-solid stability and zero judge confusion, the test battery was expanded to 103 automated scenarios across 15 distinct suites covering text, vision, and webhook pipelines:"
);

doc.addTable(
  ["Test Suite Category", "Tests", "Result", "Latency / Metric Benchmark"],
  [
    ["Suite 1: Severe Multi-Violation Content", "7 tests", "100% PASS", "Catches all 6 governance dimensions simultaneously"],
    ["Suite 2: 1-Click Diff & Correction", "7 tests", "100% PASS", "100% clean document restoration (Score 100)"],
    ["Suite 3: Clean Compliant Benchmark", "2 tests", "100% PASS", "Clean enterprise press release receives 100/100"],
    ["Suite 4: Punctuation & Case Resilience", "4 tests", "100% PASS", "Punctuation-agnostic word boundary matching"],
    ["Suite 5: Client-Side PII Sanitizer", "5 tests", "100% PASS", "Masks emails, phone numbers, and codenames"],
    ["Suite 6: Stress & Latency Benchmarks", "5 tests", "100% PASS", "1.24ms execution time on 4,560 words (40x faster than goal)"],
    ["Suite 7: Extension In-Situ Interceptor", "5 tests", "100% PASS", "In-situ DOM scanning and 1-click patch verification"],
    ["Suite 8: Multimodal Visual Engine", "5 tests", "100% PASS", "Luminance math, 21:1 max contrast, aspect ratio +58%"],
    ["Suite 9: Enterprise CI/CD Gatekeeper", "6 tests", "100% PASS", "Exit code 1 blocking, Exit code 0 passing, HMAC tokens"],
    ["Suite 10: Expanded Terminology & Inclusivity", "7 tests", "100% PASS", "allowlist, denylist, sample data, team, customer"],
    ["Suite 11: Pluralization & Grammatical Agreement", "6 tests", "100% PASS", "Preserves plurals & vowel agreement ('a/an')"],
    ["Suite 12: Morphology, Casing & Compound Resilience", "14 tests", "100% PASS", "Participles, gerunds, TitleCase, and UPPERCASE"],
    ["Suite 13: Secrets, Plus-Aliased & International PII", "8 tests", "100% PASS", "AWS/OpenAI keys, +91/+44 phones, plus-aliases"],
    ["Suite 14: Complex Adversarial Multi-Violations", "8 tests", "100% PASS", "Adversarial paragraphs, possessives, code ticks"],
    ["Suite 15: Extreme Visual & Cryptographic Webhooks", "7 tests", "100% PASS", "Boundary contrast (4.49 vs 4.51), HMAC tampering"],
    ["TOTAL TEST COVERAGE", "103 tests", "100% PASS", "103 / 103 Assertions Passing (100.0% Pass Rate)"]
  ],
  [165, 55, 65, 227]
);

// SECTION 5: TEAM ALTAIR CONTRIBUTIONS
doc.addHeading1("5. Team ALTAIR Member Contributions");

doc.addTable(
  ["Team Member", "Assigned Project Role", "Specific Round 3 Contributions & Engineering Ownership"],
  [
    ["MD ANAS AKHTAR", "Team Leader & AI/ML Engineer", "Overall platform architecture, Manifest V3 extension, Canvas vision engine, CI/CD gatekeeper, HMAC token logic, 103-test battery, and final report compilation."],
    ["Collaborating Teammates", "Full-Stack & UI/UX Engineers", "Vite/Tailwind UI implementation, mobile responsive navigation, Slack Block Kit simulator styling, and Brand Vault configuration."]
  ],
  [110, 145, 257]
);

// SECTION 6: PRODUCT ROADMAP & FUTURE HORIZONS
doc.addHeading1("6. Product Roadmap & Future Commercial Horizon");
doc.addParagraph(
  "Inkloom BrandGuard is architected as an enterprise-grade commercial product. Our engineering roadmap outlines the trajectory following the hackathon:"
);

doc.addBullet(
  "Phase 1 (Q1 2027) — Chrome Web Store & Google Workspace Marketplace Publication:",
  "Public packaging of the Manifest V3 extension on the Chrome Web Store and Microsoft Edge Add-ons catalog. Release of a native Google Workspace add-on injecting BrandGuard into Google Docs and Slides."
);
doc.addBullet(
  "Phase 2 (Q2 2027) — Automated Brand Guideline Ingestion via Document Parsing:",
  "Enabling enterprise brand managers to upload raw PDF brand books or company style guide URLs. Inkloom automatically vectorizes and extracts rules, regex, and tone vectors into the Brand Vault."
);
doc.addBullet(
  "Phase 3 (Q3 2027) — Multilingual & Regional Regulatory Governance:",
  "Expanding inspection across 15+ global languages (German, Spanish, Japanese, Hindi) with automated compliance checks for EU AI Act, GDPR marketing disclosures, and UK Advertising Standards Authority."
);
doc.addBullet(
  "Phase 4 (Q4 2027) — Native Figma & Creative Cloud Ecosystem Plugins:",
  "Direct canvas-layer integration into Figma and Adobe Creative Cloud, verifying design tokens, vector logo clearspace, and component library adherence before UI exports."
);

// Write output PDF
const pdfBytes = doc.generatePDFBytes();
const outputPath = './Inkloom_BrandGuard_Round3_The_Final_Build.pdf';
fs.writeFileSync(outputPath, pdfBytes);
console.log(`Successfully generated Round 3 PDF: ${outputPath} (${pdfBytes.length} bytes, ${doc.pages.length} pages)`);

