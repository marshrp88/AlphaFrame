export function loadPlausibleIfConsent() {
  try {
    const consent = localStorage.getItem('alphaframe_consent') === 'true';
    const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
    if (!consent || !domain) return;
    const existing = document.querySelector('script[data-plausible]');
    if (existing) return;
    const s = document.createElement('script');
    s.setAttribute('defer', '');
    s.setAttribute('data-domain', domain);
    s.setAttribute('data-plausible', 'true');
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  } catch (_) {}
}


