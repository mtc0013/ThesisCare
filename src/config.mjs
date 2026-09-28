// ─────────────────────────────────────────────────────────────
//  SITE CONFIGURATION
//  Change the brand name, contact details and integrations here.
//  Anything in `settings` can ALSO be changed later from
//  Admin → Settings without touching code (when Supabase is connected).
// ─────────────────────────────────────────────────────────────

const env = process.env;

export const site = {
  // Brand — change once here, it flows through every page.
  brandName: env.BRAND_NAME || 'ThesisCare',
  brandShort: 'TC',
  tagline: 'Medical research support, from idea to publication',

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
  supabaseUrl: env.SUPABASE_URL || '',
  supabaseAnonKey: env.SUPABASE_ANON_KEY || '',

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
