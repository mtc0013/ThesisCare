// Zero-dependency static site builder.  Usage:  node build.mjs
// Output goes to ./dist — ready for GitHub Pages or any static host.
import { mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { site, settings } from './src/config.mjs';
import { services } from './src/content/services.mjs';
import { audiences } from './src/content/audiences.mjs';
import { areas } from './src/content/areas.mjs';
import { faqs } from './src/content/faqs.mjs';
import { posts } from './src/content/posts.mjs';
import { checklists } from './src/content/resources.mjs';
import { legal } from './src/content/legal.mjs';
import { locations } from './src/content/locations.mjs';
import { seoPages } from './src/content/seo-pages.mjs';
import { layout, url } from './src/templates/layout.mjs';
import { breadcrumbSchema, faqSchema, ROLES, STAGES, SERVICE_OPTIONS } from './src/templates/components.mjs';
import * as P from './src/templates/pages.mjs';
import { adminShell, portalShell } from './src/templates/apps.mjs';

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, 'dist');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const pages = []; // for sitemap
const index = []; // for site search

function emit(path, html, { sitemap = true, priority = 0.6 } = {}) {
  const file = path.endsWith('.html') ? join(out, path) : join(out, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  if (sitemap) pages.push({ path, priority });
}
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

// ── Core pages ──
emit('', layout({ path: '', body: P.home(), schema: [faqSchema(P.home.faqs()), { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brandName, url: site.siteUrl + site.basePath, potentialAction: { '@type': 'SearchAction', target: site.siteUrl + site.basePath + 'search/?q={q}', 'query-input': 'required name=q' } }] }), { priority: 1 });

emit('services/', layout({ title: 'Medical Research Services', description: 'Research methodology, biostatistics, thesis guidance, systematic reviews, manuscript editing, publication and viva support for medical researchers in India.', path: 'services/', body: P.servicesIndex(), schema: [breadcrumbSchema([['Services', 'services/']])] }), { priority: 0.9 });

for (const s of services) {
  const path = `services/${s.slug}/`;
  emit(path, layout({
    title: s.name,
    description: s.summary,
    path,
    body: P.serviceDetail(s),
    schema: [
      { '@context': 'https://schema.org', '@type': 'Service', name: s.name, description: s.summary, serviceType: s.name, areaServed: 'IN', provider: { '@type': 'ProfessionalService', name: site.brandName } },
      breadcrumbSchema([['Services', 'services/'], [s.short, path]]),
      faqSchema(s.faqs),
    ],
  }), { priority: 0.9 });
  index.push({ t: s.name, u: path, k: 'Service', d: s.summary, x: [s.tags.join(' '), s.helpWith.join(' ')].join(' ') });
}

emit('who-we-help/', layout({ title: 'Who We Help', description: 'Research support for MBBS, MD/MS, DNB, DM/MCh, PhD, nursing and allied health students, faculty and researchers.', path: 'who-we-help/', body: P.audiencesIndex() }), { priority: 0.8 });
for (const a of audiences.filter((a) => a.page)) {
  const path = `${a.page}/`;
  emit(path, layout({ title: a.headline, description: a.intro, path, body: P.audiencePage(a), schema: [breadcrumbSchema([['Who We Help', 'who-we-help/'], [a.name, path]]), faqSchema(a.faqs)] }), { priority: 0.8 });
  index.push({ t: a.headline, u: path, k: 'Who we help', d: a.short, x: a.challenges.join(' ') });
}

emit('research-areas/', layout({ title: 'Research Areas', description: 'Research methodology, biostatistics and publication support across 27 medical, surgical, diagnostic, dental, nursing and allied specialties.', path: 'research-areas/', body: P.areasPage() }), { priority: 0.7 });
for (const a of areas) index.push({ t: a.name, u: 'research-areas/', k: 'Research area', d: a.text });

emit('how-it-works/', layout({ title: 'How It Works', description: 'Submit your requirement, get a free consultation, agree a written scope, and receive milestone-based expert support.', path: 'how-it-works/', body: P.howItWorks() }));
emit('pricing/', layout({ title: 'Plans & Pricing', description: 'Transparent, scope-based pricing for medical research support. Free initial consultation and written, itemised quotes.', path: 'pricing/', body: P.pricing() }));
emit('resources/', layout({ title: 'Resource Center', description: 'Guides on research methodology, biostatistics, thesis writing, systematic reviews and publication — plus free checklists.', path: 'resources/', body: P.resourcesIndex() }), { priority: 0.8 });

for (const p of posts) {
  const path = `resources/${p.slug}/`;
  emit(path, layout({
    title: p.title, description: p.excerpt, path, ogType: 'article', body: P.article(p),
    schema: [{ '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.excerpt, datePublished: p.date, author: { '@type': 'Organization', name: p.author }, publisher: { '@type': 'Organization', name: site.brandName } }, breadcrumbSchema([['Resources', 'resources/'], [p.title, path]])],
  }), { priority: 0.7 });
  index.push({ t: p.title, u: path, k: 'Article · ' + p.category, d: p.excerpt, x: strip(p.body).slice(0, 1500) });
}
for (const c of checklists) {
  const path = `resources/checklists/${c.slug}/`;
  emit(path, layout({ title: c.title, description: c.blurb, path, body: P.checklistPage(c), noindex: true, bodyClass: 'print-page' }), { sitemap: false });
  index.push({ t: c.title, u: 'resources/#downloads', k: 'Guide', d: c.blurb });
}

emit('about/', layout({ title: 'About Us', description: `About ${site.brandName} — a medical research support consultancy for students, residents, researchers and faculty in India.`, path: 'about/', body: P.about() }));
emit('team/', layout({ title: 'Our Team', description: 'Medical research consultants, biostatisticians, methodologists, medical editors and publication consultants.', path: 'team/', body: P.teamPage() }));
emit('faq/', layout({ title: 'FAQs', description: 'Answers about our research support services, process, pricing, confidentiality and academic integrity.', path: 'faq/', body: P.faqPage(), schema: [faqSchema(faqs)] }));
for (const f of faqs) index.push({ t: f.q, u: 'faq/', k: 'FAQ', d: f.a });

emit('contact/', layout({ title: 'Contact', description: 'Contact our research team by enquiry form, WhatsApp, phone or email.', path: 'contact/', body: P.contact() }));
emit('enquire/', layout({ title: 'Get Free Research Consultation', description: 'Tell us about your research and request a free, confidential consultation.', path: 'enquire/', body: P.enquire() }), { priority: 0.9 });
emit('book-consultation/', layout({ title: 'Book a Consultation', description: 'Book a 15- or 30-minute research, biostatistics or publication consultation.', path: 'book-consultation/', body: P.booking(), scripts: ['booking.js'] }));
emit('academic-integrity/', layout({ title: 'Academic Integrity Policy', description: 'What we support — and what we never do. Our commitment to ethical research support.', path: 'academic-integrity/', body: P.integrity() }));
index.push({ t: 'Academic Integrity Policy', u: 'academic-integrity/', k: 'Policy', d: 'What we support and what we do not.' });

for (const l of legal) emit(`${l.slug}/`, layout({ title: l.title, description: l.summary, path: `${l.slug}/`, body: P.legalPage(l) }), { priority: 0.3 });

emit('search/', layout({ title: 'Search', path: 'search/', body: P.searchPage(), noindex: true }), { sitemap: false });

for (const l of seoPages) {
  emit(`${l.slug}/`, layout({ title: l.title, description: l.desc, path: `${l.slug}/`, body: P.seoLanding(l), schema: [breadcrumbSchema([[l.h1, `${l.slug}/`]])] }), { priority: 0.8 });
}

const liveLocations = locations.filter((l) => l.published);
if (liveLocations.length) {
  emit('locations/', layout({ title: 'Locations', path: 'locations/', body: P.locationsIndex(liveLocations) }));
  for (const loc of liveLocations) emit(`locations/${loc.slug}/`, layout({ title: `Medical Research Support in ${loc.city}`, description: loc.intro, path: `locations/${loc.slug}/`, body: P.locationPage(loc) }));
}

// ── Apps (not indexed) ──
emit('admin/', layout({ title: 'Admin Dashboard', path: 'admin/', body: adminShell(), noindex: true, bare: true, bodyClass: 'app-body', scripts: ['admin.js'] }), { sitemap: false });
emit('portal/', layout({ title: 'Client Portal', path: 'portal/', body: portalShell(), noindex: true, bodyClass: 'portal-body', scripts: ['portal.js'] }), { sitemap: false });
emit('404.html', layout({ title: 'Page not found', path: '404.html', body: P.notFound(), noindex: true }), { sitemap: false });

// ── Assets ──
cpSync(join(root, 'src/assets'), join(out, 'assets'), { recursive: true });
writeFileSync(join(out, 'assets/js/config.js'), `window.MRH_CONFIG=${JSON.stringify({
  brandName: site.brandName, basePath: site.basePath, siteUrl: site.siteUrl,
  supabaseUrl: site.supabaseUrl, supabaseAnonKey: site.supabaseAnonKey,
  upload: site.upload, settings,
  options: { roles: ROLES, stages: STAGES, services: SERVICE_OPTIONS },
})};\n`);
writeFileSync(join(out, 'search-index.json'), JSON.stringify(index));
writeFileSync(join(out, '.nojekyll'), '');
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: ${site.basePath}admin/\nDisallow: ${site.basePath}portal/\n\nSitemap: ${site.siteUrl}${site.basePath}sitemap.xml\n`);
const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
  .map((p) => `  <url><loc>${site.siteUrl}${site.basePath}${p.path}</loc><lastmod>${today}</lastmod><priority>${p.priority}</priority></url>`)
  .join('\n')}\n</urlset>\n`);
if (existsSync(join(root, 'CNAME'))) cpSync(join(root, 'CNAME'), join(out, 'CNAME'));

console.log(`Built ${pages.length} indexed pages (+ apps) → dist/   base: ${site.basePath}   backend: ${site.supabaseUrl ? 'Supabase' : 'DEMO MODE (browser storage)'}`);
