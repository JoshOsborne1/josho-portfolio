// josho.pro Premium Gate
(function() {
  const PREMIUM_KEY = 'josho_premium_expires';
  
  function isPremium() {
    const exp = parseInt(localStorage.getItem(PREMIUM_KEY) || '0', 10);
    return exp > Date.now();
  }
  
  function showAdBanner() {
    if (isPremium()) return;
    const banner = document.createElement('div');
    banner.id = 'josho-ad-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;height:60px;background:#111113;border-top:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:space-between;padding:0 16px;z-index:9999;font-family:Inter,sans-serif;';
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;">
        <div style="width:200px;height:40px;background:rgba(255,255,255,0.05);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;color:rgba(255,255,255,0.2);">
          Advertisement
        </div>
      </div>
      <a href="/premium" style="background:#7c3aed;color:#fff;padding:6px 14px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">Remove ads</a>
    `;
    document.body.appendChild(banner);
    // Pad body to avoid content being hidden behind banner
    document.body.style.paddingBottom = '60px';
  }
  
  function lockHardMode() {
    if (isPremium()) return;
    // Disable any button/element with data-premium attribute
    document.querySelectorAll('[data-premium]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Hard mode is a Premium feature. Get Premium for £2.99/month?')) return;
        window.location.href = '/premium';
      }, true);
    });
  }
  
  // Run after DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { showAdBanner(); lockHardMode(); });
  } else {
    showAdBanner();
    lockHardMode();
  }
})();
