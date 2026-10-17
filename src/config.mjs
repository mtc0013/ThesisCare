// ─────────────────────────────────────────────────────────────
//  SITE CONFIGURATION
//  Change the brand name, contact details and integrations here.
//  Anything in `settings` can ALSO be changed later from
//  Admin → Settings without touching code (when Supabase is connected).
// ─────────────────────────────────────────────────────────────

const env = process.env;

// DEMO=1 builds a sales demo: no database (browser-only data), sample admin data,
// a "live demo" banner and no search-engine indexing.
const demo = env.DEMO === '1';

export const site = {
  // ── BRAND — rebranding for a new client is just this block (see docs/REBRANDING.md) ──
  brandName: env.BRAND_NAME || 'ThesisCare',
  brandShort: 'TC',
  tagline: 'Medical research support, from idea to publication',

  // Brand colours. Everything on the site (buttons, gradients, logo, footer, admin) is derived from these.
  theme: {
    primary: env.BRAND_PRIMARY || '#0B3B6F',          // main brand colour: buttons, logo, headings accents
    primaryDark: env.BRAND_PRIMARY_DARK || '#051A33', // footer, dark panels, admin sidebar
    accent: env.BRAND_ACCENT || '#0E9F9A',            // secondary colour: icons, links, gradient end
    highlight: env.BRAND_HIGHLIGHT || '#7FF0DF',      // bright highlight used on dark backgrounds
  },

  // Logo. Leave imageUrl empty to use the built-in mark (drawn in the theme colours above),
  // or put a logo file in src/assets/img/ and set e.g. 'assets/img/logo.svg' (square works best).
  logo: { imageUrl: env.BRAND_LOGO || '' },

  demo,

  // Public URL of the deployed site (used for canonical URLs, sitemap, OG tags).
  // e.g. https://mtc0013.github.io/ThesisCare  or  https://www.yourdomain.in
  // Origin only (scheme + host) — the path prefix comes from basePath.
  siteUrl: new URL(env.SITE_URL || 'http://localhost:4173').origin,

  // Path prefix the site is served from. GitHub Actions sets this automatically.
  basePath: normaliseBase(env.BASE_PATH || '/'),

  locale: 'en_IN',
  country: 'India',

  // Backend (optional). Without these the site runs in "demo mode":
  // forms and the admin dashboard work, but data is stored only in the visitor's browser.
  // The publishable key is designed to be public; data is protected by Row Level Security.
  supabaseUrl: demo ? '' : env.SUPABASE_URL || 'https://nltzgbznhcvbrjwlcbig.supabase.co',
  supabaseAnonKey: demo ? '' : env.SUPABASE_ANON_KEY || 'sb_publishable_ISKQ00p9aIM4XDOPVYuRpw_iAAtIurS',

  // Upload rules (also enforced by the storage bucket in supabase/schema.sql)
  upload: {
    maxFiles: 5,
    maxSizeMB: 10,
    extensions: ['pdf', 'doc', 'docx', 'xlsx', 'xls', 'csv', 'pptx'],
  },

  // Show clearly-labelled sample team profiles until real ones are added.
  showSampleTeam: true,
};

// Defaults for runtime-editable settings (Admin → Settings overrides these).
// Leave contact fields EMPTY until you have real details — empty fields are hidden
// on the site instead of showing fake numbers.
export const settings = {
  companyName: site.brandName,
  phone: '',            // e.g. +91 98xxxxxxxx
  whatsapp: '',         // digits with country code, e.g. 9198xxxxxxxx
  email: '',            // e.g. hello@yourdomain.in
  address: '',
  mapEmbedUrl: '',      // Google Maps embed URL
  businessHours: 'Monday – Saturday, 10:00 am – 7:00 pm IST',
  social: { linkedin: '', instagram: '', facebook: '', youtube: '' },
  ctaPrimary: 'Get Free Consultation',
  whatsappMessage: 'Hello, I would like to discuss my research project.',
  gaId: '',             // Google Analytics 4 measurement ID, e.g. G-XXXXXXX
  metaPixelId: '',
  gscVerification: '',  // Google Search Console verification token
  turnstileSiteKey: '', // optional Cloudflare Turnstile CAPTCHA site key
  seoTitleSuffix: '',
  seoDefaultDescription:
    'Research methodology, biostatistics, academic editing and publication support for medical students, postgraduate doctors, researchers and faculty in India.',
  // Real, verifiable numbers only. Leave empty to hide the stats strip entirely.
  stats: [
    // { value: '—', label: 'Research projects supported' },
  ],
};

function normaliseBase(b) {
  if (!b.startsWith('/')) b = '/' + b;
  if (!b.endsWith('/')) b += '/';
  return b;
}
