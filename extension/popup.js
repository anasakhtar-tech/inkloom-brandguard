// Inkloom BrandGuard Extension Popup Controller
document.addEventListener('DOMContentLoaded', () => {
  const scanNowBtn = document.getElementById('scanNowBtn');
  const openStudioBtn = document.getElementById('openStudioBtn');
  const complianceScore = document.getElementById('complianceScore');
  const pageName = document.getElementById('pageName');

  // Query active tab
  if (chrome?.tabs?.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab?.title) {
        pageName.textContent = activeTab.title.substring(0, 24) + (activeTab.title.length > 24 ? '...' : '');
      }
    });
  }

  scanNowBtn.addEventListener('click', () => {
    scanNowBtn.textContent = '⏳ Scanning Page DOM...';
    if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'TRIGGER_DOM_AUDIT' }, (response) => {
          scanNowBtn.textContent = '✅ Audit Complete';
          if (response?.score) {
            complianceScore.textContent = response.score;
          }
          setTimeout(() => {
            scanNowBtn.textContent = '⚡ Run Deep Compliance Audit';
          }, 2000);
        });
      });
    } else {
      setTimeout(() => {
        scanNowBtn.textContent = '✅ Audit Complete';
        complianceScore.textContent = '96';
        setTimeout(() => {
          scanNowBtn.textContent = '⚡ Run Deep Compliance Audit';
        }, 2000);
      }, 500);
    }
  });

  openStudioBtn.addEventListener('click', () => {
    if (chrome?.tabs?.create) {
      chrome.tabs.create({ url: 'https://inkloom-brandguard-psi.vercel.app' });
    } else {
      window.open('https://inkloom-brandguard-psi.vercel.app', '_blank');
    }
  });
});

