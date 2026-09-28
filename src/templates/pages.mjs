import { site, settings } from '../config.mjs';
import { services, process } from '../content/services.mjs';
import { audiences } from '../content/audiences.mjs';
import { areas } from '../content/areas.mjs';
import { faqs } from '../content/faqs.mjs';
import { posts, categories } from '../content/posts.mjs';
import { checklists } from '../content/resources.mjs';
import { icon } from './icons.mjs';
import { esc, url, brand } from './layout.mjs';
import {
  enquiryForm, contactForm, bookingForm, downloadGate, pageHero, sectionHead, servicesGrid, serviceCard, checkList,
  timeline, faqList, trustGrid, statsStrip, teamGrid, testimonialsBlock, ctaInline, heroVisual, articleCover, SERVICE_MAP, trustItems,
} from './components.mjs';

const fmtDate = (d) => new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
const readTime = (html) => Math.max(2, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 200));
const faqsFor = (tag) => faqs.filter((f) => f.tags.includes(tag));

const audienceCard = (a) => `
<${a.page ? `a href="${url(a.page + '/')}"` : 'div'} class="card audience-card">
  <span class="card-icon soft">${icon(a.icon)}</span>
  <div><h3>${esc(a.name)}</h3><p>${esc(a.short)}</p>${a.page ? `<span class="card-link">Explore ${icon('arrow')}</span>` : ''}</div>
</${a.page ? 'a' : 'div'}>`;

const postCard = (p) => `
<a class="card post-card" href="${url(`resources/${p.slug}/`)}" data-cat="${esc(p.category)}">
  ${articleCover(p)}
  <div class="post-body"><p class="post-meta">${esc(p.category)} · ${readTime(p.body)} min read</p><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div>
</a>`;

const areaCard = (a) => `<div class="area-card"><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div>`;

// ── HOME ─────────────────────────────────────────────────────
export function home() {
  const trust = ['Confidential Consultation', 'Medical Research Specialists', 'Evidence-Based Approach', 'Transparent Scope & Pricing'];
  return `
<section class="hero">
  <div class="hero-bg" aria-hidden="true"></div>
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow pill">${icon('pulse')} India’s professional medical research support platform</p>
      <h1>Medical Research Support, <span class="grad">From Idea to Publication</span></h1>
      <p class="lead">Professional research methodology, biostatistics, academic editing and publication support for medical students, postgraduate doctors, researchers and faculty.</p>
      <div class="hero-actions">
        <a class="btn btn-primary btn-lg" href="#enquire" data-track="cta_hero_primary">Get Free Research Consultation</a>
        <a class="btn btn-outline btn-lg" href="${url('services/')}" data-track="cta_hero_secondary">Explore Our Services</a>
      </div>
      <ul class="hero-trust">${trust.map((t) => `<li>${icon('check')}${t}</li>`).join('')}</ul>
    </div>
    ${heroVisual()}
  </div>
</section>

<section class="enquire-band" id="enquire">
  <div class="container enquire-grid">
    <div class="enquire-copy">
      <p class="eyebrow">Start here</p>
      <h2>Share your requirement. Speak to a research professional.</h2>
      <p>Tell us your study, stage and what you need. A research coordinator reviews it and contacts you to discuss — then you receive a written scope and quote. No obligation.</p>
      <ul class="mini-steps">
        <li>${icon('inbox')}<span><strong>Reviewed by a research coordinator</strong>Not an automated sales bot.</span></li>
        <li>${icon('scale')}<span><strong>Transparent written scope</strong>Deliverables, timeline and quote agreed first.</span></li>
        <li>${icon('lock')}<span><strong>Confidential</strong>Files are stored privately. NDA on request.</span></li>
      </ul>
    </div>
    <div class="card form-card elevated">${enquiryForm({ id: 'home-enq', source: 'home' })}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${statsStrip()}
    ${sectionHead('Why researchers trust us', 'Built on method, transparency and integrity', 'We work the way good research is done — carefully, transparently and with you in control of your work.')}
    ${trustGrid(trustItems.slice(0, 4))}
  </div>
</section>

<section class="section tinted" id="services">
  <div class="container">
    ${sectionHead('Services', 'Research support for every stage of your study', 'From the first research question to responding to reviewers — pick one service or combine them into a structured plan.')}
    ${servicesGrid(services.slice(0, 9))}
    <div class="center mt-3"><a class="btn btn-outline btn-lg" href="${url('services/')}">View all services ${icon('arrow')}</a></div>
  </div>
</section>

<section class="section" id="who-we-help">
  <div class="container">
    ${sectionHead('Who we help', 'Support tailored to where you are in your career')}
    <div class="grid grid-3">${audiences.filter((a) => a.page || ['DM / MCh Students', 'PhD Scholars'].includes(a.name)).slice(0, 6).map(audienceCard).join('')}</div>
    <div class="center mt-3"><a class="btn btn-outline" href="${url('who-we-help/')}">See everyone we support ${icon('arrow')}</a></div>
  </div>
</section>

<section class="section tinted">
  <div class="container">
    ${sectionHead('Research areas', 'Experience across medical and allied specialties', 'We support studies across clinical, diagnostic, surgical and community specialties.')}
    <div class="chips">${areas.map((a) => `<span class="chip">${esc(a.name)}</span>`).join('')}</div>
    <div class="center mt-3"><a class="btn btn-outline" href="${url('research-areas/')}">Explore research areas ${icon('arrow')}</a></div>
  </div>
</section>

<section class="section" id="how-it-works">
  <div class="container">
    ${sectionHead('How it works', 'A clear, five-step process', 'You always know what is being done, by when, and what you will receive.')}
    ${timeline()}
    <div class="center mt-3"><a class="btn btn-primary btn-lg" href="#enquire" data-track="cta_process">Submit Your Requirement</a></div>
  </div>
</section>

<section class="section tinted">
  <div class="container">
    ${sectionHead('Why choose us', 'A research consultancy — not an essay mill')}
    ${trustGrid(trustItems.slice(4))}
    <div class="integrity-callout card">
      <div class="ic-icon">${icon('shield')}</div>
      <div><h3>Our integrity commitment</h3><p>We support your learning and your own research: methodology, statistics, editing, formatting and publication preparation. We never fabricate data, ghostwrite work for submission as your own, or promise guaranteed outcomes.</p></div>
      <a class="btn btn-outline" href="${url('academic-integrity/')}">Read the policy</a>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Expert team', 'The people behind your research support', 'Research consultants, biostatisticians, methodologists and medical editors.')}
    ${teamGrid(3)}
    <div class="center mt-3"><a class="btn btn-outline" href="${url('team/')}">Meet the team ${icon('arrow')}</a></div>
  </div>
</section>

<section class="section tinted">
  <div class="container">
    ${sectionHead('Testimonials', 'What researchers say')}
    ${testimonialsBlock()}
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead('Research resources', 'Learn research methods, one guide at a time', 'Practical guides on methodology, statistics, writing and publication.')}
    <div class="grid grid-3">${posts.slice(0, 3).map(postCard).join('')}</div>
    <div class="center mt-3"><a class="btn btn-outline" href="${url('resources/')}">Visit the Resource Center ${icon('arrow')}</a></div>
  </div>
</section>

<section class="section tinted">
  <div class="container narrow">
    ${sectionHead('FAQs', 'Common questions')}
    ${faqList(faqsFor('home'))}
    <div class="center mt-3"><a class="btn btn-outline" href="${url('faq/')}">All FAQs ${icon('arrow')}</a></div>
  </div>
</section>`;
}
home.faqs = () => faqsFor('home');

// ── SERVICES ────────────────────────────────────────────────
export function servicesIndex() {
  return `
${pageHero({ eyebrow: 'Services', title: 'Medical research services', lead: 'Structured research support tailored to your study — from methodology and biostatistics to editing, publication preparation and viva support.', crumbs: [['Services']], actions: `<a class="btn btn-primary btn-lg" href="${url('enquire/')}">Request a Research Assessment</a><a class="btn btn-outline btn-lg" href="${url('pricing/')}">Plans &amp; Pricing</a>` })}
<section class="section"><div class="container">
  ${servicesGrid()}
  ${ctaInline()}
</div></section>
<section class="section tinted"><div class="container">
  ${sectionHead('Our approach', 'How every engagement works')}
  ${timeline()}
</div></section>`;
}

export function serviceDetail(s) {
  const sFaqs = [...s.faqs, ...faqsFor(s.slug)].filter((f, i, arr) => arr.findIndex((x) => x.q === f.q) === i);
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  return `
${pageHero({
  eyebrow: 'Service',
  title: esc(s.name),
  lead: esc(s.summary),
  crumbs: [['Services', 'services/'], [s.short]],
  actions: `<a class="btn btn-primary btn-lg" href="#service-enquiry" data-track="cta_service_hero">Get Free Consultation</a><a class="btn btn-outline btn-lg" href="${url(`enquire/?service=${encodeURIComponent(SERVICE_MAP[s.slug] || '')}&type=quote`)}" data-track="quote_request">Request a Quote</a>`,
  aside: `<div class="hero-icon-card">${icon(s.icon)}${s.tools ? `<div class="tool-tags">${s.tools.map((t) => `<span>${t}</span>`).join('')}</div>` : ''}</div>`,
})}
<section class="section"><div class="container two-col">
  <div>
    <p class="eyebrow">The challenge</p>
    <h2>Why this matters</h2>
    <p class="lead-sm">${esc(s.problem)}</p>
    <h2 class="mt-3">What we help with</h2>
    ${checkList(s.helpWith, 'cols-2')}
  </div>
  <aside class="sticky-aside">
    <div class="card aside-card">
      <h3>Who it’s for</h3>
      <ul class="dot-list">${s.whoFor.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
      <a class="btn btn-primary btn-block" href="#service-enquiry">Discuss Your Project</a>
    </div>
  </aside>
</div></section>
<section class="section tinted"><div class="container">
  ${sectionHead('Deliverables', 'What you receive', 'Exact deliverables are confirmed in your written scope before work starts.')}
  <div class="grid grid-3">${s.deliverables.map((d, i) => `<div class="card deliverable"><span class="num">${String(i + 1).padStart(2, '0')}</span><p>${esc(d)}</p></div>`).join('')}</div>
</div></section>
<section class="section"><div class="container">
  ${sectionHead('Process', 'How we work together')}
  ${timeline()}
</div></section>
<section class="section tinted"><div class="container">
  ${sectionHead('Example outputs', 'The kind of work you can expect', 'Illustrative formats only — every output is prepared from your own study and data.')}
  <div class="grid grid-3">${s.outputs.map((o) => `<div class="card output-card"><div class="output-thumb">${icon(s.icon)}</div><h3>${esc(o)}</h3></div>`).join('')}</div>
</div></section>
<section class="section"><div class="container narrow">
  ${sectionHead('FAQs', `Questions about ${esc(s.short.toLowerCase())}`)}
  ${faqList(sFaqs)}
</div></section>
<section class="section tinted" id="service-enquiry"><div class="container enquire-grid">
  <div class="enquire-copy">
    <p class="eyebrow">Not sure what you need?</p>
    <h2>Talk to a Research Consultant</h2>
    <p>Share your requirement and a consultant will review it with you. You’ll receive a clear scope and quote before anything begins.</p>
    <h3 class="mt-3 h-sm">Related services</h3>
    <ul class="related-links">${related.map((r) => `<li><a href="${url(`services/${r.slug}/`)}">${icon(r.icon)}${esc(r.name)}</a></li>`).join('')}</ul>
  </div>
  <div class="card form-card elevated">${enquiryForm({ id: 'svc-enq', source: `service:${s.slug}`, service: SERVICE_MAP[s.slug] || '' })}</div>
</div></section>`;
}

// ── WHO WE HELP ─────────────────────────────────────────────
export function audiencesIndex() {
  return `
${pageHero({ eyebrow: 'Who we help', title: 'Research support for every stage of a medical career', lead: 'From your first MBBS project to faculty-level systematic reviews — support that fits your programme, timeline and experience.', crumbs: [['Who We Help']] })}
<section class="section"><div class="container">
  <div class="grid grid-3">${audiences.map(audienceCard).join('')}</div>
  ${ctaInline()}
</div></section>`;
}

export function audiencePage(a) {
  const svc = a.services.map((sl) => services.find((s) => s.slug === sl)).filter(Boolean);
  return `
${pageHero({ eyebrow: a.name, title: esc(a.headline), lead: esc(a.intro), crumbs: [['Who We Help', 'who-we-help/'], [a.name]], actions: `<a class="btn btn-primary btn-lg" href="#aud-enquiry">Get Free Consultation</a><a class="btn btn-outline btn-lg" href="${url('book-consultation/')}">${icon('calendar')} Book a Consultation</a>` })}
<section class="section"><div class="container two-col">
  <div><p class="eyebrow">Common challenges</p><h2>We understand where research gets difficult</h2>${checkList(a.challenges)}</div>
  <div><p class="eyebrow">Typical workflow</p><h2>How support usually runs</h2>
    <ol class="mini-timeline">${a.workflow.map((w) => `<li>${esc(w)}</li>`).join('')}</ol></div>
</div></section>
<section class="section tinted"><div class="container">
  ${sectionHead('Relevant services', 'Services most often used')}
  ${servicesGrid(svc)}
</div></section>
<section class="section"><div class="container two-col">
  <div><p class="eyebrow">Example deliverables</p><h2>What you can expect</h2>${checkList(a.deliverables)}</div>
  <div><p class="eyebrow">FAQs</p><h2>Questions we hear often</h2>${faqList(a.faqs)}</div>
</div></section>
<section class="section tinted" id="aud-enquiry"><div class="container enquire-grid">
  <div class="enquire-copy"><p class="eyebrow">Next step</p><h2>Discuss your project</h2><p>Tell us about your study. We’ll help you identify the right support and send a transparent scope.</p></div>
  <div class="card form-card elevated">${enquiryForm({ id: 'aud-enq', source: `audience:${a.page}`, role: a.role })}</div>
</div></section>`;
}

// ── RESEARCH AREAS ──────────────────────────────────────────
export function areasPage() {
  return `
${pageHero({ eyebrow: 'Research areas', title: 'Specialties we support', lead: 'Methodology, statistics and publication support across medical, surgical, diagnostic, dental, nursing and allied specialties.', crumbs: [['Research Areas']] })}
<section class="section"><div class="container">
  <div class="filter-bar"><label class="sr-only" for="area-filter">Filter specialties</label><input id="area-filter" type="search" placeholder="Filter specialties…" data-filter-target="#area-grid"></div>
  <div class="grid grid-3 area-grid" id="area-grid">${areas.map(areaCard).join('')}</div>
  ${ctaInline('Your specialty not listed?', 'We support research across most medical and allied health disciplines. Tell us about your study.', 'Discuss Your Project')}
</div></section>`;
}

// ── HOW IT WORKS ────────────────────────────────────────────
export function howItWorks() {
  return `
${pageHero({ eyebrow: 'How it works', title: 'A clear, structured process', lead: 'Every engagement follows the same transparent steps, so you always know what is happening, what you will receive and when.', crumbs: [['How It Works']] })}
<section class="section"><div class="container narrow">${timeline()}</div></section>
<section class="section tinted"><div class="container">
  ${sectionHead('What to expect', 'Principles we work by')}
  ${trustGrid()}
  ${ctaInline('Ready to start?', 'Submit your requirement — it takes about a minute.', 'Upload Your Requirement')}
</div></section>`;
}

// ── PRICING ─────────────────────────────────────────────────
export function pricing() {
  const plans = [
    ['Research Consultation', 'chat', 'A focused session on your topic, design, sample size or analysis plan.', 'Free initial consultation'],
    ['Statistics Package', 'chart', 'Analysis plan, analysis, tables, figures and interpretation for your dataset.', 'Custom Quote'],
    ['Synopsis / Protocol Support', 'clipboard', 'Protocol review, sample size, analysis plan and formatting.', 'Custom Quote'],
    ['Manuscript Editing', 'edit', 'Language, structure, references and journal formatting.', 'Custom Quote'],
    ['Systematic Review Support', 'layers', 'Search, screening framework, extraction, risk of bias and meta-analysis.', 'Custom Quote'],
    ['Publication Support', 'send', 'Journal selection, submission preparation, cover letter and revisions.', 'Custom Quote'],
    ['Thesis Guidance', 'book', 'Milestone-based guidance from planning to viva.', 'Custom Quote'],
  ];
  const factors = ['Study design', 'Complexity of analysis', 'Size of dataset', 'Number of analyses and outcomes', 'Timeline', 'Deliverables required'];
  return `
${pageHero({ eyebrow: 'Plans & Pricing', title: 'Transparent pricing, based on your scope', lead: 'We don’t publish one-size-fits-all prices because every study is different. After a free consultation you receive a written, itemised quote — before any work begins.', crumbs: [['Plans & Pricing']] })}
<section class="section"><div class="container">
  <div class="grid grid-3 pricing-grid">${plans
    .map(([t, i, d, p], k) => `<div class="card price-card ${k === 0 ? 'featured' : ''}"><span class="card-icon">${icon(i)}</span><h3>${t}</h3><p>${d}</p><p class="price">${p}</p><a class="btn ${k === 0 ? 'btn-primary' : 'btn-outline'} btn-block" href="${url(k === 0 ? 'book-consultation/' : `enquire/?type=quote&plan=${encodeURIComponent(t)}`)}" data-track="quote_request">${k === 0 ? 'Book Free Consultation' : 'Request a Quote'}</a></div>`)
    .join('')}</div>
</div></section>
<section class="section tinted"><div class="container two-col">
  <div><p class="eyebrow">How pricing works</p><h2>What your quote depends on</h2><p class="lead-sm">Pricing depends on study design, complexity, data size, number of analyses, timeline and deliverables.</p>${checkList(factors, 'cols-2')}</div>
  <div class="card aside-card"><h3>Our pricing commitments</h3>${checkList(['Free, no-obligation first consultation', 'Written scope and itemised quote', 'No hidden charges', 'Milestone-based payment for larger projects', 'Clear refund policy'])}<a class="btn btn-primary btn-block" href="${url('enquire/?type=quote')}" data-track="quote_request">Request a Quote</a></div>
</div></section>
<section class="section"><div class="container narrow">${sectionHead('FAQs', 'Pricing questions')}${faqList(faqsFor('pricing'))}</div></section>`;
}

// ── RESOURCES ───────────────────────────────────────────────
export function resourcesIndex() {
  const used = categories.filter((c) => posts.some((p) => p.category === c));
  return `
${pageHero({ eyebrow: 'Resource Center', title: 'Medical research knowledge hub', lead: 'Practical, plain-language guides on research methodology, biostatistics, thesis writing, systematic reviews and publication.', crumbs: [['Resources']] })}
<section class="section"><div class="container">
  <div class="tabs" role="tablist" aria-label="Filter by category">
    <button class="tab is-active" data-cat-filter="" role="tab" aria-selected="true">All</button>
    ${used.map((c) => `<button class="tab" data-cat-filter="${esc(c)}" role="tab" aria-selected="false">${esc(c)}</button>`).join('')}
  </div>
  <div class="grid grid-3" id="post-grid">${posts.map(postCard).join('')}</div>
  <p class="muted small mt-2">More topics coming soon: ${categories.filter((c) => !used.includes(c)).map(esc).join(', ')}.</p>
</div></section>
<section class="section tinted" id="downloads"><div class="container">
  ${sectionHead('Free downloads', 'Checklists & guides', 'Printable checklists to keep your research on track.')}
  <div class="grid grid-3">${checklists
    .map((c) => `<div class="card download-card"><span class="card-icon">${icon('clipboard')}</span><h3>${esc(c.title)}</h3><p>${esc(c.blurb)}</p><button class="btn btn-outline btn-block" data-download="${esc(c.slug)}" data-title="${esc(c.title)}" data-href="${url(`resources/checklists/${c.slug}/`)}">${icon('download')} Get checklist</button></div>`)
    .join('')}</div>
</div></section>
${downloadGate()}`;
}

export function article(p) {
  const toc = [...p.body.matchAll(/<h2>(.*?)<\/h2>/g)].map((m) => m[1]);
  let i = 0;
  const body = p.body.replace(/<h2>/g, () => `<h2 id="s${++i}">`);
  const related = posts.filter((x) => x.slug !== p.slug).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
  return `
<article>
<header class="article-hero">
  <div class="container narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="${url('')}">Home</a><span>/</span><a href="${url('resources/')}">Resources</a><span>/</span><span aria-current="page">${esc(p.category)}</span></nav>
    <p class="eyebrow">${esc(p.category)}</p>
    <h1>${esc(p.title)}</h1>
    <p class="lead">${esc(p.excerpt)}</p>
    <div class="byline"><span class="avatar sm">${icon('user')}</span><div><strong>${esc(p.author)}</strong><span>${esc(p.credentials)}</span></div><span class="sep"></span><span>${fmtDate(p.date)}</span><span class="sep"></span><span>${readTime(p.body)} min read</span></div>
  </div>
  <div class="container narrow">${articleCover(p, true)}</div>
</header>
<div class="container article-grid">
  <aside class="toc"><div class="toc-inner"><p class="toc-title">On this page</p><ol>${toc.map((t, k) => `<li><a href="#s${k + 1}">${t}</a></li>`).join('')}</ol>
    <div class="toc-cta"><p>Need help applying this to your study?</p><a class="btn btn-primary btn-sm btn-block" href="${url('enquire/')}" data-track="cta_article_toc">Get Free Consultation</a></div></div></aside>
  <div class="prose">${body}
    <div class="article-note">${icon('shield')}<p>This article is for general educational purposes. Always follow your institution’s guidelines and your guide’s advice.</p></div>
  </div>
</div>
</article>
<section class="section"><div class="container">
  ${ctaInline('Working on something similar?', 'Our consultants can help you apply these principles to your own study.', 'Discuss Your Project')}
  <h2 class="mt-3">Related articles</h2>
  <div class="grid grid-3">${related.map(postCard).join('')}</div>
</div></section>`;
}

export function checklistPage(c) {
  return `
<section class="checklist-page">
  <div class="container narrow">
    <div class="no-print"><nav class="crumbs"><a href="${url('')}">Home</a><span>/</span><a href="${url('resources/#downloads')}">Downloads</a></nav></div>
    <div class="cl-head"><div>${icon('clipboard')}</div><div><p class="eyebrow">${esc(brand)} · Free checklist</p><h1>${esc(c.title)}</h1><p class="lead">${esc(c.blurb)}</p></div></div>
    <div class="no-print cl-actions"><button class="btn btn-primary" onclick="window.print()">${icon('download')} Print / Save as PDF</button><a class="btn btn-outline" href="${url('enquire/')}">Get help with your research</a></div>
    ${c.sections.map(([h, items]) => `<section class="cl-section"><h2>${esc(h)}</h2><ul>${items.map((it) => `<li><label><input type="checkbox"><span>${esc(it)}</span></label></li>`).join('')}</ul></section>`).join('')}
    <p class="muted small">General guidance only — always follow your institution’s specific requirements. © ${esc(brand)}</p>
  </div>
</section>`;
}

// ── ABOUT / TEAM ────────────────────────────────────────────
export function about() {
  return `
${pageHero({ eyebrow: 'About us', title: `About ${esc(brand)}`, lead: 'We are a medical research support consultancy helping students, residents, researchers and faculty across India plan, analyse and publish sound research.', crumbs: [['About Us']] })}
<section class="section"><div class="container two-col">
  <div>
    <p class="eyebrow">Our purpose</p>
    <h2>Better research, understood by the people who do it</h2>
    <p class="lead-sm">Many clinicians are asked to do research with little formal training in methodology or statistics, and limited time. We exist to close that gap — with structured guidance, professional analysis and careful editing that help you produce work you understand and can stand behind.</p>
    <p>We work transparently: every engagement starts with a free consultation and a written scope. We follow recognised reporting guidelines and sound statistical practice, and we hold ourselves to a clear academic integrity policy.</p>
  </div>
  <div class="card aside-card">
    <h3>What we stand for</h3>
    ${checkList(['Research learning, not shortcuts', 'Scientific accuracy over impressive claims', 'Confidentiality for every client', 'Transparent scope and pricing', 'Respect for institutional rules and guides'])}
  </div>
</div></section>
<section class="section tinted"><div class="container">${sectionHead('Why choose us', 'How we are different')}${trustGrid()}</div></section>
<section class="section" id="team"><div class="container">
  ${sectionHead('Team', 'Our expert team', 'Research consultants, biostatisticians, methodologists and medical editors.')}
  ${teamGrid()}
</div></section>
<section class="section tinted"><div class="container">${sectionHead('Testimonials', 'Client feedback')}${testimonialsBlock()}</div></section>`;
}

export function teamPage() {
  return `
${pageHero({ eyebrow: 'Team', title: 'Our expert team', lead: 'Medical research consultants, biostatisticians, research methodologists, medical editors and publication consultants.', crumbs: [['About Us', 'about/'], ['Team']] })}
<section class="section"><div class="container">
  ${teamGrid()}
  ${ctaInline('Talk to a consultant', 'Tell us about your study and we’ll match you with the right specialist.', 'Get Free Consultation')}
</div></section>`;
}

// ── FAQ ─────────────────────────────────────────────────────
export function faqPage() {
  const cats = [...new Set(faqs.map((f) => f.cat))];
  return `
${pageHero({ eyebrow: 'FAQs', title: 'Frequently asked questions', lead: 'Clear answers about our services, process, pricing and integrity policy.', crumbs: [['FAQs']] })}
<section class="section"><div class="container narrow">
  ${cats.map((c) => `<h2 class="faq-cat">${esc(c)}</h2>${faqList(faqs.filter((f) => f.cat === c))}`).join('')}
  ${ctaInline('Still have a question?', 'Ask us directly — we usually reply within one business day.', 'Contact Us', 'contact/')}
</div></section>`;
}

// ── CONTACT / ENQUIRE / BOOK ────────────────────────────────
export function contact() {
  return `
${pageHero({ eyebrow: 'Contact', title: 'Get in touch', lead: 'Reach us by form, WhatsApp, phone or email. For research requirements, the enquiry form is fastest.', crumbs: [['Contact']] })}
<section class="section"><div class="container contact-grid">
  <div class="contact-info">
    <a class="card contact-tile" href="${url('enquire/')}">${icon('clipboard')}<span><strong>Research enquiry</strong><small>Share your requirement and upload files</small></span>${icon('arrow')}</a>
    <a class="card contact-tile" data-wa-link data-track="whatsapp_click" href="#" hidden>${icon('whatsapp')}<span><strong>WhatsApp</strong><small data-setting="whatsappDisplay">Chat with us</small></span>${icon('arrow')}</a>
    <a class="card contact-tile" data-show-if="phone" ${settings.phone ? '' : 'hidden'} data-setting-href="tel" data-track="phone_click" href="#">${icon('phone')}<span><strong>Phone</strong><small data-setting="phone"></small></span>${icon('arrow')}</a>
    <a class="card contact-tile" data-show-if="email" ${settings.email ? '' : 'hidden'} data-setting-href="mailto" href="#">${icon('mail')}<span><strong>Email</strong><small data-setting="email"></small></span>${icon('arrow')}</a>
    <div class="card contact-tile static">${icon('clock')}<span><strong>Business hours</strong><small data-setting="businessHours">${esc(settings.businessHours)}</small></span></div>
    <div class="card contact-tile static" data-show-if="address" ${settings.address ? '' : 'hidden'}>${icon('map')}<span><strong>Location</strong><small data-setting="address"></small></span></div>
    <div class="map-slot" data-map><div class="map-placeholder">${icon('map')}<p>Map will appear here once a location is added in Admin → Settings.</p></div></div>
  </div>
  ${contactForm()}
</div></section>`;
}

export function enquire() {
  return `
${pageHero({ eyebrow: 'Free research consultation', title: 'Tell us about your research', lead: 'Share your requirement — a research coordinator will review it and contact you to discuss scope, timeline and a transparent quote.', crumbs: [['Enquire']] })}
<section class="section"><div class="container enquire-grid">
  <div class="enquire-copy">
    <h2 class="h-sm">What happens next</h2>
    <ol class="mini-timeline">${process.slice(1).map((p) => `<li><strong>${esc(p.title)}</strong><br><span class="muted">${esc(p.text)}</span></li>`).join('')}</ol>
    <div class="card note-card">${icon('lock')}<p>Your details and files are confidential and accessible only to authorised team members. Please remove patient identifiers from datasets.</p></div>
  </div>
  <div class="card form-card elevated">${enquiryForm({ id: 'page-enq', source: 'enquire-page' })}</div>
</div></section>`;
}

export function booking() {
  return `
${pageHero({ eyebrow: 'Consultation booking', title: 'Book a research consultation', lead: 'Choose the type of consultation and a preferred time. We confirm every booking personally.', crumbs: [['Book a Consultation']] })}
<section class="section"><div class="container narrow-wide">${bookingForm()}</div></section>`;
}

// ── ACADEMIC INTEGRITY ─────────────────────────────────────
export function integrity() {
  const yes = ['Research learning and mentoring', 'Research methodology and planning', 'Statistical analysis and interpretation', 'Language editing and formatting', 'Literature searching and reference management', 'Publication preparation', 'Presentation and viva preparation'];
  const no = ['Fabricated data', 'Falsified or manipulated results', 'Plagiarism', 'Fake or unverified citations', 'Fake or gift authorship', 'Impersonation in exams, vivas or communications', 'Contract cheating', 'Submission of purchased work as one’s own', 'Fabrication of participants or clinical observations'];
  return `
${pageHero({ eyebrow: 'Academic integrity', title: 'Our Academic Integrity Policy', lead: 'We believe good research support makes you a better researcher. Here is exactly what we do — and what we won’t do.', crumbs: [['Academic Integrity']] })}
<section class="section"><div class="container two-col">
  <div class="card integrity-card yes"><h2>${icon('checkCircle')} What we support</h2>${checkList(yes)}</div>
  <div class="card integrity-card no"><h2>${icon('x')} What we do not support</h2><ul class="xlist">${no.map((n) => `<li>${icon('x')}<span>${esc(n)}</span></li>`).join('')}</ul></div>
</div></section>
<section class="section tinted"><div class="container narrow prose">
  <h2>You remain the author</h2>
  <p>Your thesis, dissertation or manuscript is your work. We help you plan it, analyse your data, understand the results and present them clearly. You should be able to explain every part of your work to your guide, examiners or reviewers — and we aim to make sure you can.</p>
  <h2>Your data, analysed honestly</h2>
  <p>We analyse the data you collect, as it is. We do not alter data or selectively report analyses to produce “significant” results. Negative and non-significant findings are valuable and we help you report them properly.</p>
  <h2>Acknowledge support where required</h2>
  <p>Many institutions and journals expect statistical or editorial assistance to be acknowledged. We encourage you to follow your institution’s rules and ICMJE recommendations, and we can suggest appropriate wording.</p>
  <h2>If a request crosses the line</h2>
  <p>If we’re asked for something that conflicts with this policy, we’ll explain why and suggest an ethical alternative. We may decline or end an engagement if the policy is not respected.</p>
  <h2>Questions?</h2>
  <p>If you’re unsure whether a particular kind of help is appropriate for your situation, ask us — and check with your guide or institution. We’re always happy to talk it through.</p>
</div></section>`;
}

export function legalPage(l) {
  return `
${pageHero({ eyebrow: 'Legal', title: esc(l.title), lead: esc(l.summary), crumbs: [[l.title]] })}
<section class="section"><div class="container narrow prose">${l.body.replace(/\{\{brand\}\}/g, esc(brand))}</div></section>`;
}

// ── SEARCH ──────────────────────────────────────────────────
export function searchPage() {
  return `
${pageHero({ eyebrow: 'Search', title: 'Search the site', lead: 'Find services, research topics, articles, guides and FAQs.', crumbs: [['Search']] })}
<section class="section"><div class="container narrow">
  <form class="search-page-form" role="search" action=""><label class="sr-only" for="sp-q">Search</label>${icon('search')}<input id="sp-q" name="q" type="search" placeholder="e.g. sample size, SPSS, PRISMA, viva" autofocus><button class="btn btn-primary">Search</button></form>
  <div id="search-page-results" aria-live="polite"></div>
</div></section>`;
}

// ── SEO LANDING PAGES ───────────────────────────────────────
export function seoLanding(l) {
  const s = services.find((x) => x.slug === l.service);
  return `
${pageHero({ eyebrow: l.eyebrow, title: esc(l.h1), lead: esc(l.intro), crumbs: [[l.h1]], actions: `<a class="btn btn-primary btn-lg" href="#seo-enquiry">Get Free Consultation</a><a class="btn btn-outline btn-lg" href="${url(`services/${s.slug}/`)}">Service details</a>` })}
<section class="section"><div class="container two-col">
  <div><h2>What we help with</h2>${checkList(s.helpWith, 'cols-2')}</div>
  <div class="card aside-card"><h3>Deliverables</h3>${checkList(s.deliverables)}</div>
</div></section>
<section class="section tinted"><div class="container">${sectionHead('Process', 'How it works')}${timeline()}</div></section>
<section class="section"><div class="container">${sectionHead('Related services', 'Explore more support')}${servicesGrid(services.filter((x) => x.slug !== s.slug).slice(0, 3))}</div></section>
<section class="section tinted" id="seo-enquiry"><div class="container enquire-grid">
  <div class="enquire-copy"><p class="eyebrow">Free consultation</p><h2>Discuss your project</h2><p>${esc(l.cta)}</p></div>
  <div class="card form-card elevated">${enquiryForm({ id: 'seo-enq', source: `seo:${l.slug}`, service: SERVICE_MAP[s.slug] || '' })}</div>
</div></section>`;
}

export function locationPage(loc) {
  return `
${pageHero({ eyebrow: 'Location', title: `Medical research support in ${esc(loc.city)}`, lead: esc(loc.intro), crumbs: [['Locations', 'locations/'], [loc.city]] })}
<section class="section"><div class="container two-col">
  <div><h2>How we work with researchers in ${esc(loc.city)}</h2><p>${esc(loc.meetingOptions)}</p>${loc.notes.length ? checkList(loc.notes) : ''}${loc.officeAddress ? `<p><strong>Office:</strong> ${esc(loc.officeAddress)}</p>` : ''}</div>
  <div class="card aside-card"><h3>Services</h3><ul class="dot-list">${services.slice(0, 7).map((s) => `<li><a href="${url(`services/${s.slug}/`)}">${esc(s.name)}</a></li>`).join('')}</ul></div>
</div></section>
<section class="section tinted"><div class="container enquire-grid"><div class="enquire-copy"><h2>Talk to a Research Consultant</h2></div><div class="card form-card elevated">${enquiryForm({ id: 'loc-enq', source: `location:${loc.slug}` })}</div></div></section>`;
}

export function locationsIndex(list) {
  return `
${pageHero({ eyebrow: 'Locations', title: 'Research support across India', lead: 'We support researchers across India through online consultations.', crumbs: [['Locations']] })}
<section class="section"><div class="container"><div class="grid grid-4">${list.map((l) => `<a class="card area-card" href="${url(`locations/${l.slug}/`)}"><h3>${esc(l.city)}</h3><p>View details ${icon('arrow')}</p></a>`).join('')}</div></div></section>`;
}

export function notFound() {
  return `
<section class="section"><div class="container narrow center">
  <p class="eyebrow">Error 404</p><h1>Page not found</h1>
  <p class="lead">The page you’re looking for doesn’t exist or has moved.</p>
  <div class="hero-actions center-actions"><a class="btn btn-primary btn-lg" href="${url('')}">Go to homepage</a><a class="btn btn-outline btn-lg" href="${url('search/')}">Search the site</a></div>
</div></section>`;
}
