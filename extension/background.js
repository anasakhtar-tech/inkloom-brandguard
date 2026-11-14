// Inkloom BrandGuard Background Service Worker (Manifest V3)
chrome.runtime.onInstalled.addListener(() => {
  console.log('[Inkloom BrandGuard] Background worker initialized. In-situ governance ready.');
});

