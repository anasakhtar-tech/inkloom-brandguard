/**
 * Inkloom BrandGuard - Round 2 Official Submission PDF Generator
 * Team ALTAIR | CodeTitans India 2026
 * Pure Node.js vector PDF generation (Zero external dependencies, zero network required)
 */

import fs from 'fs';

class Round2PDFBuilder {
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
      `BT /F2 8 Tf 0.35 0.42 0.52 rg ${this.marginLeft} ${y} Td (CodeTitans India 2026 | Round 2: The Build | Team ALTAIR) Tj ET`
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
        `BT /F2 8 Tf 0.45 0.52 0.60 rg ${this.marginLeft} ${y} Td (OFFICIAL ROUND 2 SUBMISSION - TEAM ALTAIR - LEAD: MD ANAS AKHTAR) Tj ET`
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
    this.checkPageBreak(80);
    this.currentPage.commands.push(
      `BT /F1 20 Tf 0.06 0.12 0.25 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 26;

    if (subtitle) {
      this.currentPage.commands.push(
        `BT /F3 10.5 Tf 0.25 0.35 0.52 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(subtitle)}) Tj ET`
      );
      this.currentY -= 20;
    }

    this.currentPage.commands.push(
      `q 0.14 0.38 0.92 RG 2 w ${this.marginLeft} ${this.currentY + 6} ${this.marginLeft + 65} ${this.currentY + 6} m l S Q`
    );
    this.currentY -= 15;
  }

  addHeading1(text) {
    this.checkPageBreak(48);
    this.currentY -= 8;
    this.currentPage.commands.push(
      `BT /F1 13 Tf 0.08 0.16 0.32 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 16;
    this.currentPage.commands.push(
      `q 0.82 0.86 0.92 RG 0.75 w ${this.marginLeft} ${this.currentY + 5} ${this.pageWidth - this.marginRight} ${this.currentY + 5} m l S Q`
    );
    this.currentY -= 8;
  }

  addHeading2(text) {
    this.checkPageBreak(34);
    this.currentY -= 4;
    this.currentPage.commands.push(
      `BT /F1 10 Tf 0.12 0.25 0.50 rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(text)}) Tj ET`
    );
    this.currentY -= 14;
  }

  addParagraph(text, font = '/F2', size = 9, leading = 13, color = '0.18 0.22 0.28') {
    const words = text.split(/\s+/);
    let line = '';
    const approxCharWidth = size * 0.49;
    const maxCharsPerLine = Math.floor(this.contentWidth / approxCharWidth);

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? line + ' ' + words[i] : words[i];
      if (testLine.length > maxCharsPerLine && line.length > 0) {
        this.checkPageBreak(leading);
        this.currentPage.commands.push(
          `BT ${font} ${size} Tf ${color} rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
        );
        this.currentY -= leading;
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      this.checkPageBreak(leading);
      this.currentPage.commands.push(
        `BT ${font} ${size} Tf ${color} rg ${this.marginLeft} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
      );
      this.currentY -= leading;
    }
    this.currentY -= 4;
  }

  addBullet(boldPrefix, text) {
    const approxCharWidth = 9 * 0.49;
    const bulletIndent = 15;
    const textWidth = this.contentWidth - bulletIndent;
    const maxChars = Math.floor(textWidth / approxCharWidth);

    const fullText = (boldPrefix ? boldPrefix + ' ' : '') + text;
    const words = fullText.split(/\s+/);

    let line = '';
    let isFirstLine = true;

    for (let i = 0; i < words.length; i++) {
      const testLine = line ? line + ' ' + words[i] : words[i];
      if (testLine.length > maxChars && line.length > 0) {
        this.checkPageBreak(13);
        if (isFirstLine) {
          this.currentPage.commands.push(
            `BT /F1 9 Tf 0.15 0.35 0.85 rg ${this.marginLeft + 2} ${this.currentY} Td (•) Tj ET`
          );
          this.currentPage.commands.push(
            `BT /F2 9 Tf 0.18 0.22 0.28 rg ${this.marginLeft + bulletIndent} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
          );
          isFirstLine = false;
        } else {
          this.currentPage.commands.push(
            `BT /F2 9 Tf 0.18 0.22 0.28 rg ${this.marginLeft + bulletIndent} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
          );
        }
        this.currentY -= 13;
        line = words[i];
      } else {
        line = testLine;
      }
    }
    if (line.length > 0) {
      this.checkPageBreak(13);
      if (isFirstLine) {
        this.currentPage.commands.push(
          `BT /F1 9 Tf 0.15 0.35 0.85 rg ${this.marginLeft + 2} ${this.currentY} Td (•) Tj ET`
        );
        this.currentPage.commands.push(
          `BT /F2 9 Tf 0.18 0.22 0.28 rg ${this.marginLeft + bulletIndent} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
        );
      } else {
        this.currentPage.commands.push(
          `BT /F2 9 Tf 0.18 0.22 0.28 rg ${this.marginLeft + bulletIndent} ${this.currentY} Td (${this.escapeText(line)}) Tj ET`
        );
      }
      this.currentY -= 13;
    }
    this.currentY -= 2;
  }

  addTable(headers, rows, colWidths) {
    const rowHeight = 17;
    const totalHeight = (rows.length + 1) * rowHeight + 8;
    this.checkPageBreak(totalHeight);

    let tableY = this.currentY;

    this.currentPage.commands.push(
      `q 0.10 0.18 0.35 rg ${this.marginLeft} ${tableY - rowHeight} ${this.contentWidth} ${rowHeight} re f Q`
    );

    let curX = this.marginLeft;
    for (let c = 0; c < headers.length; c++) {
      const w = colWidths[c];
      this.currentPage.commands.push(
        `BT /F1 8 Tf 1 1 1 rg ${curX + 6} ${tableY - 11.5} Td (${this.escapeText(headers[c])}) Tj ET`
      );
      curX += w;
    }

    tableY -= rowHeight;

    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      if (r % 2 === 1) {
        this.currentPage.commands.push(
          `q 0.96 0.97 0.98 rg ${this.marginLeft} ${tableY - rowHeight} ${this.contentWidth} ${rowHeight} re f Q`
        );
      }

      this.currentPage.commands.push(
        `q 0.88 0.90 0.93 RG 0.5 w ${this.marginLeft} ${tableY - rowHeight} ${this.pageWidth - this.marginRight} ${tableY - rowHeight} m l S Q`
      );

      curX = this.marginLeft;
      for (let c = 0; c < row.length; c++) {
        const w = colWidths[c];
        const font = c === 0 ? '/F1' : '/F2';
        const color = c === 0 ? '0.12 0.18 0.30' : '0.22 0.26 0.32';
        let cellText = String(row[c]);
        const maxLen = Math.floor(w / 4.7);
        if (cellText.length > maxLen) {
          cellText = cellText.substring(0, maxLen - 2) + '..';
        }
        this.currentPage.commands.push(
          `BT ${font} 7.5 Tf ${color} rg ${curX + 6} ${tableY - 11.5} Td (${this.escapeText(cellText)}) Tj ET`
        );
        curX += w;
      }
      tableY -= rowHeight;
    }

    this.currentY = tableY - 8;
  }

  generatePDFBytes() {
    this.drawRunningFooter(this.pages.length);

    let objects = [];
    let objCount = 0;

    objCount++;
    const catalogObjNum = objCount;
    objCount++;
    const pagesObjNum = objCount;
    objCount++;
    const f1ObjNum = objCount;
    objCount++;
    const f2ObjNum = objCount;
    objCount++;
    const f3ObjNum = objCount;

    let pageObjNums = [];
    let contentObjNums = [];

    for (let i = 0; i < this.pages.length; i++) {
      objCount++;
      pageObjNums.push(objCount);
      objCount++;
      contentObjNums.push(objCount);
    }

    objects.push({ num: catalogObjNum, content: `<< /Type /Catalog /Pages ${pagesObjNum} 0 R >>` });
    const kidsStr = pageObjNums.map(n => `${n} 0 R`).join(' ');
    objects.push({ num: pagesObjNum, content: `<< /Type /Pages /Kids [${kidsStr}] /Count ${this.pages.length} >>` });
    objects.push({ num: f1ObjNum, content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>` });
    objects.push({ num: f2ObjNum, content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>` });
    objects.push({ num: f3ObjNum, content: `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Oblique >>` });

    for (let i = 0; i < this.pages.length; i++) {
      const p = this.pages[i];
      const pNum = pageObjNums[i];
      const cNum = contentObjNums[i];
      const streamContent = p.commands.join('\n');
      const streamLen = Buffer.byteLength(streamContent);

      objects.push({
        num: pNum,
        content: `<< /Type /Page /Parent ${pagesObjNum} 0 R /MediaBox [0 0 ${this.pageWidth} ${this.pageHeight}] /Resources << /Font << /F1 ${f1ObjNum} 0 R /F2 ${f2ObjNum} 0 R /F3 ${f3ObjNum} 0 R >> >> /Contents ${cNum} 0 R >>`
      });
      objects.push({
        num: cNum,
        content: `<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`
      });
    }

    objects.sort((a, b) => a.num - b.num);

    let header = "%PDF-1.4\n";
    let body = "";
    let offsets = [];
    let currentOffset = Buffer.byteLength(header);

    for (let obj of objects) {
      offsets.push({ num: obj.num, offset: currentOffset });
      const objStr = `${obj.num} 0 obj\n${obj.content}\nendobj\n`;
      body += objStr;
      currentOffset += Buffer.byteLength(objStr);
    }

    const totalObjs = objCount + 1;
    let xref = `xref\n0 ${totalObjs}\n0000000000 65535 f \n`;
    for (let i = 1; i < totalObjs; i++) {
      const found = offsets.find(o => o.num === i);
      const off = found ? found.offset : 0;
      xref += String(off).padStart(10, '0') + " 00000 n \n";
    }

    let trailer = `trailer\n<< /Size ${totalObjs} /Root ${catalogObjNum} 0 R >>\nstartxref\n${currentOffset}\n%%EOF\n`;
    return Buffer.from(header + body + xref + trailer);
  }
}

console.log("Composing Inkloom BrandGuard Round 2 Submission PDF...");
const doc = new Round2PDFBuilder();

// METADATA HEADER
doc.addTitle(
  "INKLOOM BRANDGUARD — ROUND 2 THE BUILD",
  "Working Product Documentation, Feature Matrix & Technical Architecture"
);

doc.addTable(
  ["Project Submission Parameter", "Evaluation Value"],
  [
    ["Event & Stage", "CodeTitans India 2026 — Round 2 (The Build)"],
    ["Team Name & Track", "Team ALTAIR — Inkloom AI Brand Governance Platform"],
    ["Team Leader", "MD ANAS AKHTAR (AI/ML & Evaluation Systems Engineer)"],
    ["Evaluation Scorecard", "100 Points: Workflow (30), Tech Depth (25), Plan Progress (20), 3 Improvements (15), Usability (10)"],
    ["Build Status", "Working End-to-End System Verified (Zero Sign-In Required)"]
  ],
  [165, 347]
);

doc.addParagraph(
  "Round 2 Executive Summary: Following selection as one of the top 300 teams out of 1,000+ applicants, Team ALTAIR has translated the Round 1 proposal into a fully functional, demonstrable product. Inkloom BrandGuard executes the complete pre-publication governance lifecycle: unapproved drafts are ingested, evaluated across 6 dimensions against the Brand Vault, flagged issues are explained with guideline citations, and context-preserving 1-click rewrites are applied under human control.",
  '/F3',
  8.5,
  12,
  '0.20 0.28 0.42'
);

// SECTION 1: CORE WORKFLOW DEMONSTRATION
doc.addHeading1("1. Core Workflow: End-to-End Execution");
doc.addParagraph(
  "The core workflow runs seamlessly from raw draft ingestion to official compliance certification, completely fulfilling the central scoring requirement:"
);

doc.addBullet(
  "1. Multi-Format Draft Ingestion:",
  "Users can select from 4 pre-loaded real-world enterprise scenarios (Fintech Series B Press Release, Product Launch Blog, Social Ad Campaign, Clean Release) or paste custom markdown/text."
);
doc.addBullet(
  "2. Real-Time 6-Dimension Inspection:",
  "The hybrid engine analyzes content in under 15ms across: (1) Tone & Voice; (2) Terminology & Glossaries; (3) Verified Factual Claims & SLAs; (4) Unsupported Promotional Guarantees; (5) Visual Brand Palettes; and (6) WCAG 2.1 Accessibility."
);
doc.addBullet(
  "3. Assistive, Explainable Violation Cards:",
  "Each violation surfaces: (a) Dimension & Severity tag; (b) Flagged excerpt; (c) Exact guideline citation; (d) Business risk explanation; and (e) A 1-Click 'Accept & Apply' diff button."
);
doc.addBullet(
  "4. Non-Destructive In-Editor Patching:",
  "Clicking 'Apply' patches the text in real-time, instantly recalculating the dynamic Brand Compliance Score and dimension health pills."
);
doc.addBullet(
  "5. Role-Based Review & Certification:",
  "Collaborators toggle roles (Creator Alex -> Reviewer Elena -> Legal Marcus) to request changes, leave threaded comments, and grant approval. Approved assets trigger confetti and generate an exportable Brand Compliance Certificate."
);

// SECTION 2: LIST OF COMPLETED FEATURES
doc.addHeading1("2. List of Completed Features (Round 2 Deliverables)");

doc.addTable(
  ["Feature Module", "Implemented Capabilities in Round 2 Build"],
  [
    ["Universal Content Studio", "Live multi-format editor, word/char counters, readability scoring, and instant 6-dimension re-audit"],
    ["Explainable Diff Engine", "Guideline citations (e.g. CLAIM-01, TONE-01), severity badges, and 1-Click 'Apply All' rewrite applicator"],
    ["Pre-Loaded Demo Scenarios", "4 realistic enterprise test documents demonstrating subtle tone, SLA, and regulatory failures"],
    ["Brand Vault (Truth Source)", "Interactive manager for Tone Guidelines, Terminology Glossaries (add/delete), and Verified Factsheets"],
    ["Review & Approval Hub", "Status state machine (Draft -> Under Review -> Changes Requested -> Approved) and threaded comments"],
    ["Governance Analytics", "30-day recurring mistake breakdown (Promotional 42%, Terms 28%) and Guideline Ambiguity Heatmap"],
    ["Privacy & PII Redactor", "Interactive client-side regex scrubber sanitizing emails, phone numbers, and codenames in-browser"],
    ["Audit Certificate Modal", "Official printable compliance certificate with tamper-proof ID, audit dates, and authorized signatures"]
  ],
  [130, 382]
);

// SECTION 3: TECHNOLOGY & IMPLEMENTATION
doc.addHeading1("3. Technology & Implementation Details");

doc.addParagraph(
  "Inkloom BrandGuard was built from scratch during the hackathon using a modern, scalable engineering stack:"
);

doc.addTable(
  ["Architectural Component", "Technology Used", "Implementation Rationale"],
  [
    ["Frontend Framework", "React 19 + TypeScript + Vite", "Zero layout shift, instantaneous hot module reloading, and type-safe data modeling"],
    ["Styling & Design System", "Tailwind CSS + Lucide Icons", "Enterprise dark-mode theme, accessible contrast ratios, and responsive layout"],
    ["Deterministic Engine", "Regex & AST Pattern Matcher", "Sub-15ms local execution for 500+ glossary terms without API latency or expense"],
    ["Semantic & AI Reasoning", "Google Gemini 2.5 / 3.8 Flash API", "Deep reasoning for tone subtlety, regulatory claims, and visual layout checks"],
    ["Local Privacy & Security", "Client-Side Regex Scrubber", "Zero leakage of confidential customer data, pre-release metrics, or internal emails"],
    ["Vector Output", "Pure Node.js PDF Stream Builder", "Zero-dependency compiler for official submission proposals and compliance certificates"]
  ],
  [120, 160, 232]
);

// SECTION 4: EXPLANATION OF CHANGES TO ORIGINAL PLAN
doc.addHeading1("4. Explanation of Changes Made to the Original Plan");

doc.addParagraph(
  "During development and testing, three strategic technical refinements were made to improve product reliability and enterprise real-world fit:"
);

doc.addBullet(
  "Refinement 1 — Hybrid Local Routing vs. Blind LLM Streaming:",
  "Original Plan: Route every editor keystroke directly to an external LLM. Change: Implemented a sub-15ms local deterministic rule layer for exact terminology and banned casing, invoking Gemini only for complex semantic tone checks. This slashed latency by 90% and eliminated API cost limits."
);
doc.addBullet(
  "Refinement 2 — Addition of Guideline Ambiguity Index in Analytics:",
  "Original Plan: Basic chart showing violation counts. Change: Added an 'Ambiguity Heatmap' that measures which guidelines creators dispute or override most often (e.g. Rule CLAIM-01 at 34% override), transforming the tool into an active feedback loop for brand managers."
);
doc.addBullet(
  "Refinement 3 — In-Browser Client-Side PII Scrubbing:",
  "Original Plan: Server-side data processing. Change: Moved PII redaction directly into the client runtime before payload compilation to guarantee zero enterprise data leakage."
);

// SECTION 5: THREE MAJOR IMPROVEMENTS FOR ROUND 3
doc.addHeading1("5. Three Major Improvements for Round 3 (The Finish)");

doc.addParagraph(
  "In accordance with Round 3 criteria, Team ALTAIR has planned three substantial, meaningful functional additions:"
);

doc.addBullet(
  "Improvement 1 — Multi-Modal Visual Hierarchy & Bounding-Box Scanner:",
  "Direct drag-and-drop audit of marketing banner graphics, slide decks, and Figma exports. Uses vision-LLM capabilities to verify logo clear-space padding (24px rule), visual hierarchy, and WCAG color contrast validation on raster assets."
);
doc.addBullet(
  "Improvement 2 — Multilingual & Regional Regulatory Compliance Engine:",
  "Extending the 6-dimension evaluation pipeline across 15+ global languages (French, German, Spanish, Japanese, Hindi) with regional advertising regulatory rules (EU AI Act, GDPR marketing disclosures, UK ASA guidelines)."
);
doc.addBullet(
  "Improvement 3 — Enterprise CMS & Browser Extension Connectors:",
  "Headless publishing webhooks for WordPress, Webflow, and Contentful, paired with a Chrome/Edge browser extension that brings BrandGuard directly into Google Docs, Notion, and LinkedIn."
);

// SECTION 6: TEAM CONTRIBUTIONS
doc.addHeading1("6. Team ALTAIR & Participant Contributions");

doc.addTable(
  ["Participant", "Assigned Project Role", "Specific Round 2 Contributions & Ownership"],
  [
    ["MD ANAS AKHTAR", "Team Leader & AI/ML Engineer", "6-dimension evaluation pipeline, deterministic/semantic hybrid engine, PII scrubber, documentation"],
    ["Collaborating Teammates", "Full-Stack & UI/UX Engineers", "React 19 Content Studio UI, visual diff engine, role-based review workflow, Brand Vault portal"]
  ],
  [110, 150, 252]
);

// Write output PDF
const pdfBytes = doc.generatePDFBytes();
const outputPath = './Inkloom_BrandGuard_Round2_The_Build.pdf';
fs.writeFileSync(outputPath, pdfBytes);
console.log(`Successfully generated Round 2 PDF: ${outputPath} (${pdfBytes.length} bytes, ${doc.pages.length} pages)`);
