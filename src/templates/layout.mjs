import { site, settings } from '../config.mjs';
import { services } from '../content/services.mjs';
import { audiences } from '../content/audiences.mjs';
import { icon } from './icons.mjs';

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Site-relative link that respects the GitHub Pages base path.
export const url = (p = '') => site.basePath + String(p).replace(/^\//, '');

export const brand = site.brandName;

export const logo = (cls = '') => `
<a class="logo ${cls}" href="${url('')}" aria-label="${esc(brand)} home">
  <svg class="logo-mark" viewBox="0 0 40 40" aria-hidden="true">
    <defs><linearGradient id="lg-${cls || 'h'}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B3B6F"/><stop offset="1" stop-color="#0E9F9A"/></linearGradient></defs>
    <rect width="40" height="40" rx="11" fill="url(#lg-${cls || 'h'})"/>
    <path d="M8 24h6l2.5-6 4 11 3-8H32" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26 7.5v7M22.5 11h7" stroke="#7FF0DF" stroke-width="2.6" stroke-linecap="round"/>
  </svg>
  <span class="logo-text" data-setting="companyName">${esc(brand)}</span>
</a>`;

const navItems = [
  { label: 'Home', href: '' },
  { label: 'Services', href: 'services/', mega: 'services' },
  { label: 'Who We Help', href: 'who-we-help/', mega: 'audiences' },
  { label: 'Research Areas', href: 'research-areas/' },
  { label: 'How It Works', href: 'how-it-works/' },
  { label: 'Resources', href: 'resources/' },
  { label: 'About Us', href: 'about/' },
  { label: 'Contact', href: 'contact/' },
];

function megaMenu(kind) {
  if (kind === 'services') {
    return `<div class="mega"><div class="mega-grid">${services
      .map((s) => `<a href="${url(`services/${s.slug}/`)}" class="mega-link">${icon(s.icon)}<span><strong>${esc(s.short)}</strong><small>${esc(s.summary.split(/[—.,]/)[0])}</small></span></a>`)
      .join('')}</div><div class="mega-foot"><span>Not sure what you need?</span><a href="${url('enquire/')}" data-track="cta_mega">Talk to a Research Consultant ${icon('arrow')}</a></div></div>`;
  }
  return `<div class="mega mega-sm"><div class="mega-grid">${audiences
    .filter((a) => a.page)
    .map((a) => `<a href="${url(a.page + '/')}" class="mega-link">${icon(a.icon)}<span><strong>${esc(a.name)}</strong><small>${esc(a.short.split(',')[0])}</small></span></a>`)
    .join('')}</div><div class="mega-foot"><a href="${url('who-we-help/')}">See everyone we support ${icon('arrow')}</a></div></div>`;
}

function header(path) {
  const isActive = (h) => (h === '' ? path === '' : path.startsWith(h.replace(/\/$/, '')));
  return `
<a class="skip" href="#main">Skip to content</a>
<header class="site-header" id="top">
  <div class="container header-inner">
    ${logo()}
    <nav class="main-nav" aria-label="Main">
      <ul>${navItems
        .map(
          (n) => `<li class="${n.mega ? 'has-mega' : ''}"><a href="${url(n.href)}" ${isActive(n.href) ? 'aria-current="page"' : ''}>${n.label}${n.mega ? icon('chevron', 'chev') : ''}</a>${n.mega ? megaMenu(n.mega) : ''}</li>`
        )
        .join('')}</ul>
    </nav>
    <div class="header-actions">
      <button class="icon-btn" data-open-search aria-label="Search">${icon('search')}</button>
      <a class="btn btn-primary btn-sm hide-sm" href="${url('enquire/')}" data-track="cta_header" data-setting="ctaPrimary">${esc(settings.ctaPrimary)}</a>
      <button class="icon-btn menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="mobile-nav" id="mobile-nav" hidden>
  <div class="mobile-nav-head">${logo('m')}<button class="icon-btn" data-close-menu aria-label="Close menu">${icon('x')}</button></div>
  <nav aria-label="Mobile"><ul>
    ${navItems
      .map((n) =>
        n.mega
          ? `<li><details><summary>${n.label}${icon('chevron')}</summary><ul>
              <li><a href="${url(n.href)}">All ${n.label.toLowerCase()}</a></li>
              ${(n.mega === 'services' ? services.map((s) => [s.short, `services/${s.slug}/`]) : audiences.filter((a) => a.page).map((a) => [a.name, a.page + '/'])).map(([l, h]) => `<li><a href="${url(h)}">${esc(l)}</a></li>`).join('')}
            </ul></details></li>`
          : `<li><a href="${url(n.href)}">${n.label}</a></li>`
      )
      .join('')}
    <li><a href="${url('pricing/')}">Plans &amp; Pricing</a></li>
    <li><a href="${url('faq/')}">FAQs</a></li>
    <li><a href="${url('book-consultation/')}">Book a Consultation</a></li>
    <li><a href="${url('portal/')}">Client Portal</a></li>
  </ul></nav>
  <a class="btn btn-primary btn-lg btn-block" href="${url('enquire/')}" data-track="cta_mobile_menu">Get Research Consultation</a>
</div>
<div class="search-overlay" id="search-overlay" hidden>
  <div class="search-box" role="dialog" aria-modal="true" aria-label="Search the site">
    <form action="${url('search/')}" class="search-form" role="search">
      ${icon('search')}<input type="search" name="q" id="search-input" placeholder="Search services, topics, articles, FAQs…" autocomplete="off" aria-label="Search">
      <button type="button" class="icon-btn" data-close-search aria-label="Close search">${icon('x')}</button>
    </form>
    <div class="search-results" id="search-live" aria-live="polite"></div>
  </div>
</div>`;
}

function footer() {
  const col = (title, links) =>
    `<div class="f-col"><h3>${title}</h3><ul>${links.map(([l, h]) => `<li><a href="${url(h)}">${esc(l)}</a></li>`).join('')}</ul></div>`;
  return `
<section class="final-cta">
  <div class="container final-cta-inner">
    <div>
      <p class="eyebrow light">Free, no-obligation consultation</p>
      <h2>Discuss your research with a specialist</h2>
      <p>Share where you are in your study. We’ll help you understand what support you need and send a transparent scope and quote.</p>
    </div>
    <div class="final-cta-actions">
      <a class="btn btn-white btn-lg" href="${url('enquire/')}" data-track="cta_footer_band">Get Free Consultation</a>
      <a class="btn btn-ghost-light btn-lg" href="${url('book-consultation/')}" data-track="cta_book_band">${icon('calendar')} Book a Slot</a>
    </div>
  </div>
</section>
<footer class="site-footer">
  <div class="container">
    <div class="f-top">
      <div class="f-brand">
        ${logo('f')}
        <p>Structured, evidence-based research support for medical students, postgraduate doctors, researchers and faculty across India.</p>
        <ul class="f-contact">
          <li data-show-if="email" ${settings.email ? '' : 'hidden'}>${icon('mail')}<a data-setting="email" data-setting-href="mailto" href="#"></a></li>
          <li data-show-if="phone" ${settings.phone ? '' : 'hidden'}>${icon('phone')}<a data-setting="phone" data-setting-href="tel" data-track="phone_click" href="#"></a></li>
          <li>${icon('clock')}<span data-setting="businessHours">${esc(settings.businessHours)}</span></li>
        </ul>
        <div class="socials">${['linkedin', 'instagram', 'facebook', 'youtube']
          .map((s) => `<a class="social" data-social="${s}" href="#" hidden target="_blank" rel="noopener" aria-label="${s}">${icon(s)}</a>`)
          .join('')}</div>
      </div>
      ${col('Services', services.slice(0, 7).map((s) => [s.short, `services/${s.slug}/`]).concat([['All services', 'services/']]))}
      ${col('Who We Help', audiences.filter((a) => a.page).map((a) => [a.name, a.page + '/']))}
      ${col('Resources', [['Resource Center', 'resources/'], ['Checklists & Guides', 'resources/#downloads'], ['FAQs', 'faq/'], ['Research Areas', 'research-areas/'], ['Search', 'search/']])}
      ${col('Company', [['About Us', 'about/'], ['Our Team', 'team/'], ['How It Works', 'how-it-works/'], ['Plans & Pricing', 'pricing/'], ['Contact', 'contact/'], ['Client Portal', 'portal/']])}
      ${col('Legal', [['Privacy Policy', 'privacy-policy/'], ['Terms of Service', 'terms-of-service/'], ['Academic Integrity', 'academic-integrity/'], ['Refund Policy', 'refund-policy/'], ['Data Handling', 'data-handling-policy/'], ['Cookie Policy', 'cookie-policy/']])}
    </div>
    <div class="f-integrity">${icon('shield')}<p><strong>Research support, not ghostwriting.</strong> We provide guidance, statistical analysis, editing and publication preparation. We do not fabricate data, write work for submission as your own, or guarantee publication. <a href="${url('academic-integrity/')}">Read our Academic Integrity Policy</a>.</p></div>
    <div class="f-bottom">
      <p>© <span data-year></span> <span data-setting="companyName">${esc(brand)}</span>. All rights reserved.</p>
      <p><button class="linklike" data-cookie-prefs>Cookie preferences</button> · <a href="${url('admin/')}" rel="nofollow">Staff login</a></p>
    </div>
  </div>
</footer>
<div class="float-contact" aria-label="Quick contact">
  <a class="float-btn float-wa" data-wa-link data-track="whatsapp_click" href="${url('enquire/')}" hidden aria-label="Chat on WhatsApp">${icon('whatsapp')}<span>WhatsApp us</span></a>
  <a class="float-btn float-enq" href="${url('enquire/')}" data-track="cta_float" aria-label="Enquire">${icon('chat')}<span>Enquire</span></a>
</div>
<nav class="mobile-bar" aria-label="Quick actions">
  <a data-wa-link data-track="whatsapp_click" href="${url('enquire/')}" hidden>${icon('whatsapp')}<span>WhatsApp</span></a>
  <a data-tel-link data-track="phone_click" href="#" hidden>${icon('phone')}<span>Call</span></a>
  <a class="mb-book" href="${url('book-consultation/')}" data-track="cta_mobilebar_book">${icon('calendar')}<span>Book</span></a>
  <a class="mb-primary" href="${url('enquire/')}" data-track="cta_mobilebar">${icon('chat')}<span>Get Research Consultation</span></a>
</nav>
<div class="cookie-banner" id="cookie-banner" hidden>
  <p>We use optional analytics cookies to understand how the site is used. They load only if you accept. <a href="${url('cookie-policy/')}">Cookie Policy</a></p>
  <div><button class="btn btn-outline btn-sm" data-cookie="decline">Decline</button><button class="btn btn-primary btn-sm" data-cookie="accept">Accept</button></div>
</div>`;
}

export function layout({ title, description, path = '', body, schema = [], noindex = false, bodyClass = '', ogType = 'website', bare = false, scripts = [] }) {
  const fullTitle = title ? `${title} | ${brand}` : `${brand} — Medical Research Support, From Idea to Publication`;
  const desc = description || settings.seoDefaultDescription;
  const canonical = site.siteUrl + site.basePath + path;
  const org = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: brand,
    url: site.siteUrl + site.basePath,
    description: settings.seoDefaultDescription,
    areaServed: 'IN',
    ...(settings.email ? { email: settings.email } : {}),
    ...(settings.phone ? { telephone: settings.phone } : {}),
  };
  const ld = [org, ...schema].map((s) => `<script type="application/ld+json">${JSON.stringify(s)}</script>`).join('');
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
${settings.gscVerification ? `<meta name="google-site-verification" content="${esc(settings.gscVerification)}">` : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(brand)}">
<meta property="og:title" content="${esc(title || fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:locale" content="${site.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B3B6F">
<link rel="icon" href="${url('assets/img/favicon.svg')}" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${url('assets/css/styles.css')}">
${ld}
</head>
<body class="${bodyClass}">
${bare ? '' : header(path)}
<main id="main">
${body}
</main>
${bare ? '' : footer()}
<script src="${url('assets/js/config.js')}"></script>
<script src="${url('assets/js/store.js')}"></script>
<script src="${url('assets/js/app.js')}"></script>
${scripts.map((s) => `<script src="${url('assets/js/' + s)}"></script>`).join('\n')}
</body>
</html>`;
}
