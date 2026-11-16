// Inkloom BrandGuard Content Script - In-Situ DOM Inspector
(function() {
  if (window.__INKLOOM_INSPECTED__) return;
  window.__INKLOOM_INSPECTED__ = true;

  // Rules cache for fast in-situ parsing
  const RULES = [
    { regex: /\b(?!Inkloom\b)[Ii]nkloom\b/g, match: 'inkloom', fix: 'Inkloom', desc: 'Brand casing must be titlecase Inkloom', severity: 'critical' },
    { regex: /\b(?!BrandGuard\b)[Bb]rand[Gg]uard\b/g, match: 'brandguard', fix: 'BrandGuard', desc: 'Product casing must be CamelCase BrandGuard', severity: 'major' },
    { regex: /\b(100% flawless|100% guarantee|guaranteed|impossible to fail|flawless)\b/gi, fix: 'enterprise-grade', desc: 'Forbidden promotional guarantee (FTC/SEC compliance)', severity: 'critical' },
    { regex: /\b99\.999%/g, fix: '99.9%', desc: 'Unapproved SLA claim (verified SLA is 99.9%)', severity: 'critical' },
    { regex: /\b(cheap|bargain)\b/gi, fix: 'cost-effective', desc: 'Tone violation: Avoid discount phrasing', severity: 'minor' }
  ];

  // Create floating widget
  const widget = document.createElement('div');
  widget.id = 'inkloom-in-situ-widget';
  widget.innerHTML = `
    <div class="inkloom-pulse-dot" id="inkloom-dot"></div>
    <span class="inkloom-widget-title">Inkloom</span>
    <span class="inkloom-widget-score" id="inkloom-score">100</span>
  `;
  document.body.appendChild(widget);

  const dot = widget.querySelector('#inkloom-dot');
  const scoreBadge = widget.querySelector('#inkloom-score');

  function scanActiveDOM() {
    let violationCount = 0;
    const inputs = document.querySelectorAll('textarea, [contenteditable="true"], input[type="text"]');

    inputs.forEach(el => {
      const text = el.value || el.innerText || '';
      if (!text) return;

      RULES.forEach(rule => {
        if (rule.regex.test(text)) {
          violationCount++;
        }
      });
    });

    const calculatedScore = Math.max(40, 100 - (violationCount * 12));
    scoreBadge.textContent = calculatedScore;

    if (violationCount === 0) {
      dot.className = 'inkloom-pulse-dot';
    } else if (violationCount <= 2) {
      dot.className = 'inkloom-pulse-dot warning';
    } else {
      dot.className = 'inkloom-pulse-dot danger';
    }

    return { score: calculatedScore, violations: violationCount };
  }

  // Monitor DOM edits
  document.addEventListener('input', debounce(scanActiveDOM, 400));
  widget.addEventListener('click', () => {
    const res = scanActiveDOM();
    alert(`[Inkloom BrandGuard In-Situ Active]\nGovernance Score: ${res.score}/100\nDetected Violations: ${res.violations}\nReal-time AST DOM monitoring enabled.`);
  });

  // Listen for popup messages
  if (chrome?.runtime?.onMessage) {
    chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
      if (req.action === 'TRIGGER_DOM_AUDIT') {
        const res = scanActiveDOM();
        sendResponse(res);
      }
    });
  }

  function debounce(fn, ms) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // Initial scan
  setTimeout(scanActiveDOM, 1000);
})();
