import { site, settings } from '../config.mjs';
import { services, process } from '../content/services.mjs';
import { team, testimonials } from '../content/people.mjs';
import { icon } from './icons.mjs';
import { esc, url } from './layout.mjs';

export const ROLES = ['MBBS Student', 'MD/MS Student', 'DNB Resident', 'DM/MCh Student', 'PhD Scholar', 'Faculty', 'Researcher', 'Other'];
export const STAGES = ['Topic Selection', 'Proposal / Synopsis', 'Ethics / IEC Preparation', 'Data Collection', 'Statistical Analysis', 'Thesis / Dissertation Guidance', 'Manuscript Preparation', 'Publication', 'Systematic Review', 'Other'];
export const SERVICE_OPTIONS = ['Research Methodology', 'Biostatistics', 'Data Analysis', 'Literature Review', 'Systematic Review', 'Manuscript Editing', 'Publication Support', 'Thesis Guidance', 'Research Protocol', 'Sample Size Calculation', 'Reference Management', 'Presentation / Viva Preparation', 'Other'];
export const TIMELINES = ['Within 2 weeks', '2 – 4 weeks', '1 – 3 months', '3 – 6 months', 'More than 6 months', 'Not sure yet'];
// Maps service page slug → default "Service Required" option.
export const SERVICE_MAP = {
  'research-methodology': 'Research Methodology', 'thesis-guidance': 'Thesis Guidance', biostatistics: 'Biostatistics',
  'research-protocol': 'Research Protocol', 'systematic-review': 'Systematic Review', 'manuscript-support': 'Manuscript Editing',
  'publication-support': 'Publication Support', 'academic-editing': 'Manuscript Editing', 'viva-presentation': 'Presentation / Viva Preparation',
  'literature-search': 'Literature Review',
};

const opts = (list, sel = '') => list.map((o) => `<option${o === sel ? ' selected' : ''}>${esc(o)}</option>`).join('');

const field = (id, label, input, { req = false, hint = '', cls = '' } = {}) =>
  `<div class="field ${cls}"><label for="${id}">${label}${req ? ' <span class="req" aria-hidden="true">*</span>' : ''}</label>${input}${hint ? `<p class="hint">${hint}</p>` : ''}<p class="field-error" id="${id}-err" role="alert"></p></div>`;

export function enquiryForm({ id = 'enq', source = 'website', service = '', role = '', title = 'Tell Us About Your Research', subtitle = 'Free consultation · Confidential · No obligation', ctaLabel = 'Request Free Consultation' } = {}) {
  const f = (n) => `${id}-${n}`;
  const exts = site.upload.extensions.map((e) => '.' + e).join(',');
  return `
<form class="enquiry-form" data-form="enquiry" data-source="${esc(source)}" id="${id}" novalidate>
  <div class="form-head">
    <h2 class="form-title">${esc(title)}</h2>
    <p class="form-sub">${icon('lock')} ${esc(subtitle)}</p>
    <ol class="form-steps" aria-label="Form progress"><li class="is-active"><span>1</span> About you</li><li><span>2</span> Your research</li></ol>
  </div>
  <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <input type="hidden" name="_started">
  <fieldset data-step="1">
    <legend class="sr-only">About you</legend>
    ${field(f('name'), 'Full Name', `<input id="${f('name')}" name="full_name" autocomplete="name" required maxlength="120" aria-describedby="${f('name')}-err">`, { req: true })}
    <div class="field-row">
      ${field(f('phone'), 'Mobile / WhatsApp', `<input id="${f('phone')}" name="phone" type="tel" inputmode="tel" autocomplete="tel" required placeholder="+91" maxlength="20" aria-describedby="${f('phone')}-err">`, { req: true })}
      ${field(f('email'), 'Email', `<input id="${f('email')}" name="email" type="email" autocomplete="email" required maxlength="160" aria-describedby="${f('email')}-err">`, { req: true })}
    </div>
    <div class="field-row">
      ${field(f('role'), 'I am a', `<select id="${f('role')}" name="user_type"><option value="">Select…</option>${opts(ROLES, role)}</select>`)}
      ${field(f('service'), 'Service Required', `<select id="${f('service')}" name="service"><option value="">Select…</option>${opts(SERVICE_OPTIONS, service)}</select>`)}
    </div>
    <button type="button" class="btn btn-primary btn-lg btn-block" data-next>Continue ${icon('arrow')}</button>
    <p class="form-note">Takes about 1 minute. We never share your details.</p>
  </fieldset>
  <fieldset data-step="2" hidden>
    <legend class="sr-only">Your research</legend>
    <div class="field-row">
      ${field(f('spec'), 'Course / Specialty', `<input id="${f('spec')}" name="specialty" maxlength="120" placeholder="e.g. MD General Medicine">`)}
      ${field(f('inst'), 'Medical College / Institution', `<input id="${f('inst')}" name="institution" maxlength="160" autocomplete="organization">`)}
    </div>
    <div class="field-row">
      ${field(f('city'), 'City / State', `<input id="${f('city')}" name="city" maxlength="120" autocomplete="address-level2">`)}
      ${field(f('stage'), 'Research Stage', `<select id="${f('stage')}" name="research_stage"><option value="">Select…</option>${opts(STAGES)}</select>`)}
    </div>
    ${field(f('timeline'), 'Expected Timeline', `<select id="${f('timeline')}" name="timeline"><option value="">Select…</option>${opts(TIMELINES)}</select>`)}
    ${field(f('desc'), 'Brief Description', `<textarea id="${f('desc')}" name="message" rows="4" maxlength="3000" placeholder="Your topic, study design, what you need help with, and any deadlines."></textarea>`)}
    <div class="field">
      <label for="${f('files')}">Upload File <span class="muted">(optional)</span></label>
      <label class="dropzone" for="${f('files')}">
        ${icon('upload')}<span><strong>Choose files</strong> or drag them here</span>
        <small>PDF, DOCX, XLSX, CSV, PPTX · up to ${site.upload.maxFiles} files, ${site.upload.maxSizeMB} MB each</small>
        <input id="${f('files')}" name="files" type="file" multiple accept="${exts}" class="sr-only">
      </label>
      <ul class="file-list" data-file-list></ul>
      <p class="field-error" id="${f('files')}-err" role="alert"></p>
    </div>
    <div class="field check">
      <label class="checkbox"><input type="checkbox" name="consent" id="${f('consent')}" required aria-describedby="${f('consent')}-err"><span>I agree to be contacted regarding my research enquiry and understand that services are provided as research guidance/support. <a href="${url('privacy-policy/')}" target="_blank">Privacy Policy</a></span></label>
      <p class="field-error" id="${f('consent')}-err" role="alert"></p>
    </div>
    <div class="captcha-slot" data-captcha></div>
    <div class="form-actions">
      <button type="button" class="btn btn-outline btn-lg" data-prev>Back</button>
      <button type="submit" class="btn btn-primary btn-lg grow" data-track-submit="enquiry_submit">${esc(ctaLabel)}</button>
    </div>
    <p class="form-status" role="status" aria-live="polite"></p>
  </fieldset>
  ${successBlock('Thank you. Your research enquiry has been received.', 'Our research coordinator will review your requirements and contact you shortly.')}
</form>`;
}

export const successBlock = (h, p) => `
<div class="form-success" hidden tabindex="-1">
  <div class="success-icon">${icon('checkCircle')}</div>
  <h3>${esc(h)}</h3>
  <p>${esc(p)}</p>
  <p class="muted small" data-ref></p>
  <div class="success-actions">
    <a class="btn btn-outline" href="${url('resources/')}">Browse research guides</a>
    <a class="btn btn-whatsapp" data-wa-link href="${url('contact/')}" hidden>${icon('whatsapp')} Message us on WhatsApp</a>
  </div>
</div>`;

export function contactForm() {
  return `
<form class="card form-card" data-form="contact" novalidate>
  <h2 class="form-title">Send us a message</h2>
  <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <input type="hidden" name="_started">
  <div class="field-row">
    ${field('c-name', 'Full Name', '<input id="c-name" name="name" required maxlength="120" autocomplete="name">', { req: true })}
    ${field('c-email', 'Email', '<input id="c-email" name="email" type="email" required maxlength="160" autocomplete="email">', { req: true })}
  </div>
  <div class="field-row">
    ${field('c-phone', 'Mobile / WhatsApp', '<input id="c-phone" name="phone" type="tel" inputmode="tel" maxlength="20" autocomplete="tel" placeholder="+91">')}
    ${field('c-subject', 'Subject', '<input id="c-subject" name="subject" maxlength="160">')}
  </div>
  ${field('c-msg', 'Message', '<textarea id="c-msg" name="message" rows="5" required maxlength="3000"></textarea>', { req: true })}
  <div class="field check"><label class="checkbox"><input type="checkbox" name="consent" id="c-consent" required><span>I agree to be contacted about my message.</span></label><p class="field-error" id="c-consent-err"></p></div>
  <div class="captcha-slot" data-captcha></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit">Send Message</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  ${successBlock('Thank you — your message has been received.', 'A member of our team will reply as soon as possible during business hours.')}
</form>`;
}

export function bookingForm() {
  const types = [
    ['15-minute consultation', 'Quick call to understand your requirement', 'clock'],
    ['30-minute consultation', 'Detailed discussion of your study and scope', 'chat'],
    ['Research methodology consultation', 'Design, objectives, variables and plan', 'compass'],
    ['Biostatistics consultation', 'Sample size, analysis plan or results', 'chart'],
    ['Publication consultation', 'Journal selection and manuscript readiness', 'send'],
  ];
  return `
<form class="card form-card booking" data-form="booking" novalidate>
  <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
  <input type="hidden" name="_started">
  <h2 class="form-title">1. Choose a consultation type</h2>
  <div class="type-grid" role="radiogroup" aria-label="Consultation type">
    ${types.map(([t, d, i], k) => `<label class="type-card"><input type="radio" name="consultation_type" value="${esc(t)}" ${k === 0 ? 'checked' : ''}>${icon(i)}<span><strong>${esc(t)}</strong><small>${esc(d)}</small></span></label>`).join('')}
  </div>
  <h2 class="form-title">2. Pick a preferred date &amp; time</h2>
  <p class="muted small">Times are in IST. This is a request — we confirm the slot by email or WhatsApp.</p>
  <div class="booking-grid">
    <div class="cal" data-calendar aria-label="Choose a date"></div>
    <div class="slots" data-slots><p class="muted">Select a date to see available times.</p></div>
  </div>
  <input type="hidden" name="preferred_date" id="b-date"><input type="hidden" name="preferred_time" id="b-time">
  <p class="field-error" id="b-date-err" role="alert"></p>
  <h2 class="form-title">3. Your details</h2>
  <div class="field-row">
    ${field('b-name', 'Name', '<input id="b-name" name="name" required maxlength="120" autocomplete="name">', { req: true })}
    ${field('b-email', 'Email', '<input id="b-email" name="email" type="email" required maxlength="160" autocomplete="email">', { req: true })}
  </div>
  <div class="field-row">
    ${field('b-phone', 'WhatsApp Number', '<input id="b-phone" name="phone" type="tel" inputmode="tel" required maxlength="20" autocomplete="tel" placeholder="+91">', { req: true })}
    ${field('b-mode', 'Preferred mode', '<select id="b-mode" name="mode"><option>Video call</option><option>Phone call</option><option>WhatsApp call</option></select>')}
  </div>
  ${field('b-notes', 'Anything we should know? (optional)', '<textarea id="b-notes" name="notes" rows="3" maxlength="2000"></textarea>')}
  <div class="field check"><label class="checkbox"><input type="checkbox" name="consent" id="b-consent" required><span>I agree to be contacted to confirm this consultation.</span></label><p class="field-error" id="b-consent-err"></p></div>
  <div class="captcha-slot" data-captcha></div>
  <button class="btn btn-primary btn-lg btn-block" type="submit" data-track-submit="booking_submit">Request Consultation Slot</button>
  <p class="form-status" role="status" aria-live="polite"></p>
  ${successBlock('Your consultation request has been received.', 'We will confirm your slot by email or WhatsApp. If the time is unavailable, we will suggest the nearest alternative.')}
</form>`;
}

export function downloadGate() {
  return `
<div class="modal" id="download-modal" hidden role="dialog" aria-modal="true" aria-labelledby="dl-title">
  <div class="modal-card">
    <button class="icon-btn modal-close" data-close-modal aria-label="Close">${icon('x')}</button>
    <form data-form="download" novalidate>
      <p class="eyebrow">Free resource</p>
      <h2 id="dl-title" class="form-title" data-dl-title>Download</h2>
      <p class="muted small">Tell us where to send updates (optional fields can be left blank). You’ll get instant access.</p>
      <div class="hp" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
      <input type="hidden" name="_started"><input type="hidden" name="resource">
      ${field('d-name', 'Name', '<input id="d-name" name="name" required maxlength="120" autocomplete="name">', { req: true })}
      ${field('d-email', 'Email', '<input id="d-email" name="email" type="email" required maxlength="160" autocomplete="email">', { req: true })}
      <div class="field-row">
        ${field('d-phone', 'WhatsApp', '<input id="d-phone" name="phone" type="tel" maxlength="20" placeholder="+91" autocomplete="tel">')}
        ${field('d-role', 'Role', `<select id="d-role" name="role"><option value="">Select…</option>${opts(ROLES)}</select>`)}
      </div>
      <div class="field check"><label class="checkbox"><input type="checkbox" name="consent" id="d-consent" required><span>I agree to receive this resource and occasional research tips. I can unsubscribe any time.</span></label><p class="field-error" id="d-consent-err"></p></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">${icon('download')} Get the checklist</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</div>`;
}

// ── Reusable sections ───────────────────────────────────────

export const pageHero = ({ eyebrow = '', title, lead = '', crumbs = [], actions = '', aside = '' }) => `
<section class="page-hero">
  <div class="container ${aside ? 'page-hero-grid' : ''}">
    <div>
      ${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${url('')}">Home</a>${crumbs.map(([l, h]) => (h ? `<span>/</span><a href="${url(h)}">${esc(l)}</a>` : `<span>/</span><span aria-current="page">${esc(l)}</span>`)).join('')}</nav>` : ''}
      ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
      <h1>${title}</h1>
      ${lead ? `<p class="lead">${lead}</p>` : ''}
      ${actions ? `<div class="hero-actions">${actions}</div>` : ''}
    </div>
    ${aside}
  </div>
</section>`;

export const breadcrumbSchema = (crumbs) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [['Home', ''], ...crumbs].map(([name, h], i) => ({ '@type': 'ListItem', position: i + 1, name, item: site.siteUrl + site.basePath + (h || '') })),
});

export const sectionHead = (eyebrow, title, lead = '', center = true) => `
<div class="section-head ${center ? 'center' : ''}">
  ${eyebrow ? `<p class="eyebrow">${esc(eyebrow)}</p>` : ''}
  <h2>${title}</h2>
  ${lead ? `<p class="lead">${lead}</p>` : ''}
</div>`;

export const serviceCard = (s) => `
<a class="card service-card" href="${url(`services/${s.slug}/`)}">
  <span class="card-icon">${icon(s.icon)}</span>
  <h3>${esc(s.name)}</h3>
  <p>${esc(s.summary)}</p>
  <span class="card-link">Learn more ${icon('arrow')}</span>
</a>`;

export const servicesGrid = (list = services) => `<div class="grid grid-3">${list.map(serviceCard).join('')}</div>`;

export const checkList = (items, cls = '') => `<ul class="checklist ${cls}">${items.map((i) => `<li>${icon('check')}<span>${esc(i)}</span></li>`).join('')}</ul>`;

export const timeline = (steps = process) => `
<ol class="timeline">
  ${steps.map((s, i) => `<li class="tl-step"><span class="tl-num">${String(i + 1).padStart(2, '0')}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></li>`).join('')}
</ol>`;

export const faqList = (items, { schema = false } = {}) => {
  const html = `<div class="faq-list">${items
    .map((f) => `<details class="faq"><summary><span>${esc(f.q)}</span>${icon('plus')}</summary><div class="faq-a"><p>${esc(f.a)}</p></div></details>`)
    .join('')}</div>`;
  return html;
};
export const faqSchema = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const trustItems = [
  ['compass', 'Research methodology specialists', 'Study design and planning guided by people who work in medical research methods.'],
  ['chart', 'Professional biostatistics', 'Analysis in SPSS, R, STATA or Python — explained so you can defend it.'],
  ['stethoscope', 'Medical-domain understanding', 'We speak the language of clinical research, specialties and Indian PG programmes.'],
  ['lock', 'Confidential handling', 'Private file storage, access limited to authorised staff, NDA on request.'],
  ['milestone', 'Milestone-based workflow', 'Structured stages with your review at each step — no black box.'],
  ['scale', 'Transparent scope & pricing', 'Written scope, deliverables and quote before any work begins.'],
  ['target', 'Evidence-based approach', 'Recognised reporting guidelines and sound statistical practice.'],
  ['shield', 'Academic integrity policy', 'Guidance and support — never fabricated data or ghostwritten submissions.'],
];

export const trustGrid = (items = trustItems) => `
<div class="grid grid-4 trust-grid">${items
  .map(([i, t, d]) => `<div class="trust-item"><span class="trust-icon">${icon(i)}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></div>`)
  .join('')}</div>`;

export const statsStrip = () =>
  settings.stats && settings.stats.length
    ? `<div class="stats">${settings.stats.map((s) => `<div><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></div>`).join('')}</div>`
    : '';

const initials = (n) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export const teamCard = (m) => `
<article class="card team-card ${m.sample ? 'is-sample' : ''}">
  ${m.sample ? '<span class="sample-badge">Sample profile — to be replaced</span>' : ''}
  <div class="avatar">${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">` : m.sample ? icon('user') : initials(m.name)}</div>
  <h3>${esc(m.sample ? m.role : m.name)}</h3>
  <p class="team-role">${esc(m.sample ? m.name : m.role)}</p>
  <dl>
    <div><dt>Qualification</dt><dd>${esc(m.qualification)}</dd></div>
    <div><dt>Specialization</dt><dd>${esc(m.specialization)}</dd></div>
    <div><dt>Research interests</dt><dd>${esc(m.interests)}</dd></div>
    <div><dt>Experience</dt><dd>${esc(m.experience)}</dd></div>
  </dl>
  ${Object.entries(m.links || {}).filter(([, v]) => v).length ? `<div class="team-links">${Object.entries(m.links).filter(([, v]) => v).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${k === 'scholar' ? 'Google Scholar' : k === 'orcid' ? 'ORCID' : 'LinkedIn'}</a>`).join('')}</div>` : ''}
</article>`;

export const teamGrid = (limit) => {
  const list = team.filter((m) => !m.sample || site.showSampleTeam).slice(0, limit || team.length);
  return list.length ? `<div class="grid grid-${limit && limit < 4 ? 3 : 'auto'} team-grid">${list.map(teamCard).join('')}</div>` : '';
};

export const testimonialsBlock = () => {
  const real = testimonials.filter((t) => t.consentToPublish && !t.sample);
  if (real.length) {
    return `<div class="grid grid-3">${real
      .map((t) => `<figure class="card testimonial">${icon('quote')}<blockquote>${esc(t.testimonial)}</blockquote><figcaption><strong>${esc(t.name)}</strong><span>${esc([t.designation, t.course, t.institution].filter(Boolean).join(' · '))}</span>${t.service ? `<small>${esc(t.service)}</small>` : ''}</figcaption></figure>`)
      .join('')}</div>`;
  }
  return `<div class="grid grid-3">${[1, 2, 3]
    .map(() => `<figure class="card testimonial is-placeholder"><span class="sample-badge">Placeholder</span>${icon('quote')}<blockquote>Verified client testimonials will appear here once clients have given written consent to publish their feedback.</blockquote><figcaption><strong>Client name</strong><span>Course · Institution</span><small>Service received</small></figcaption></figure>`)
    .join('')}</div><p class="center muted small mt-2">We publish only genuine feedback, with consent. We never write or buy reviews.</p>`;
};

export const ctaInline = (title = 'Not sure what you need?', text = 'Tell us where you are in your research. A consultant will help you work out the right support — free and without obligation.', label = 'Talk to a Research Consultant', href = 'enquire/') => `
<div class="cta-inline">
  <div><h3>${esc(title)}</h3><p>${esc(text)}</p></div>
  <div class="cta-inline-actions"><a class="btn btn-primary btn-lg" href="${url(href)}" data-track="cta_inline">${esc(label)}</a><a class="btn btn-outline btn-lg" href="${url('book-consultation/')}">${icon('calendar')} Book a slot</a></div>
</div>`;

// Decorative clinical-research visual for heroes (original SVG, no stock imagery).
export const heroVisual = () => `
<div class="hero-visual" aria-hidden="true">
  <div class="hv-glow"></div>
  <svg class="hv-grid" viewBox="0 0 400 400"><defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="currentColor"/></pattern></defs><rect width="400" height="400" fill="url(#dots)"/></svg>
  <div class="hv-card hv-main">
    <div class="hv-head"><span class="dot"></span><span class="dot"></span><span class="dot"></span><strong>Survival analysis</strong><em>Kaplan–Meier</em></div>
    <svg viewBox="0 0 300 150" class="hv-chart">
      <g stroke="currentColor" opacity=".12"><path d="M30 20h260M30 55h260M30 90h260M30 125h260"/></g>
      <path d="M30 20h40v12h30v10h40v14h35v8h45v12h40" fill="none" stroke="#0E9F9A" stroke-width="3"/>
      <path d="M30 20h25v22h35v20h30v18h40v16h40v10h60" fill="none" stroke="#1D4E89" stroke-width="3" stroke-dasharray="1 0"/>
      <path d="M30 20h25v22h35v20h30v18h40v16h40v10h60" fill="none" stroke="#1D4E89" stroke-width="3" opacity=".25" transform="translate(0 6)"/>
      <path d="M30 10v125h260" fill="none" stroke="currentColor" opacity=".35"/>
    </svg>
    <div class="hv-legend"><span><i style="background:#0E9F9A"></i>Group A</span><span><i style="background:#1D4E89"></i>Group B</span><span class="mono">log-rank p = 0.02</span></div>
  </div>
  <div class="hv-card hv-forest">
    <strong>Meta-analysis</strong>
    <svg viewBox="0 0 180 90"><path d="M90 5v80" stroke="currentColor" opacity=".3" stroke-dasharray="3 3"/>
      <g stroke="#1D4E89" stroke-width="2"><path d="M40 15h60M55 32h55M30 49h50M60 66h40"/></g>
      <g fill="#1D4E89"><rect x="66" y="11" width="8" height="8"/><rect x="78" y="28" width="10" height="8"/><rect x="50" y="45" width="7" height="8"/><rect x="76" y="62" width="9" height="8"/></g>
      <path d="M62 82l10-5 10 5-10 5z" fill="#0E9F9A"/></svg>
  </div>
  <div class="hv-card hv-check">
    <strong>Protocol review</strong>
    <ul><li class="ok">Research question (PICO)</li><li class="ok">Sample size justified</li><li class="ok">Analysis plan</li><li>IEC documents</li></ul>
  </div>
  <div class="hv-chip hv-chip-1">${icon('shield')} Confidential</div>
  <div class="hv-chip hv-chip-2">${icon('checkCircle')} Scope agreed</div>
</div>`;

export const articleCover = (post, big = false) => {
  const hues = { 'Biostatistics': 'b', 'Research Methodology': 'a', 'Thesis Guidance': 'c', 'Systematic Reviews': 'd', 'Publication': 'e', 'Medical Writing': 'c', 'Reference Management': 'a' };
  const v = hues[post.category] || 'a';
  const motif = {
    a: '<circle cx="60" cy="60" r="26" /><circle cx="140" cy="44" r="14"/><circle cx="220" cy="80" r="20"/><path d="M60 60 140 44 220 80"/>',
    b: '<path d="M20 110 70 70 110 90 160 40 210 60 260 20"/><path d="M20 120h260" opacity=".4"/>',
    c: '<rect x="70" y="20" width="80" height="100" rx="6"/><path d="M85 45h50M85 60h50M85 75h35"/><rect x="160" y="30" width="80" height="90" rx="6" opacity=".6"/>',
    d: '<path d="M150 10v120" stroke-dasharray="4 4"/><path d="M90 30h90M110 55h80M70 80h70M120 105h60"/>',
    e: '<path d="M60 100 230 30 170 120 140 85z"/><path d="M140 85 230 30"/>',
  }[v];
  return `<div class="cover cover-${v} ${big ? 'cover-big' : ''}" role="img" aria-label="${esc(post.category)} illustration"><svg viewBox="0 0 300 140" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">${motif}</svg><span>${esc(post.category)}</span></div>`;
};
