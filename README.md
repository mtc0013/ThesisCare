# ThesisCare

A medical research support website and web app for an India-focused research consultancy. It includes the marketing site, an enquiry and CRM workflow, an admin dashboard, consultation booking, a resource centre and a client portal.

- **Frontend:** a static site built by a zero-dependency Node script (`build.mjs`) and hosted free on **GitHub Pages**.
- **Backend (optional):** **Supabase** (Postgres, Auth, private file storage and Row Level Security), also on a free tier.
- **Demo mode:** until Supabase is connected, forms and the admin dashboard still work, but data is stored only in the visitor's own browser. This is useful for previewing. Don't use it for real enquiries.

---

## 1. Run locally

Requires Node 18 or newer. There is nothing to install.

```bash
npm run dev          # builds to dist/ and serves http://localhost:4173
```

- Website: `http://localhost:4173/`
- Admin: `http://localhost:4173/admin/` → **Open demo dashboard**
- Client portal: `http://localhost:4173/portal/`

## 2. Publish on GitHub Pages

1. Create a new repository on GitHub, `ThesisCare`.
2. Push this folder:
   ```bash
   git remote add origin https://github.com/mtc0013/ThesisCare.git
   git push -u origin main
   ```
3. In the repo, open **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
4. Every push to `main` now builds and deploys through `.github/workflows/deploy.yml`. Your site is at `https://mtc0013.github.io/ThesisCare/`. The URL prefix is handled automatically.

**Custom domain (optional):** add a `CNAME` file containing your domain (e.g. `www.yourdomain.in`) to the project root, set the domain in Settings → Pages, and add a repository **variable** `SITE_URL=https://www.yourdomain.in`.

## 3. Connect the backend (Supabase) — required before going live

1. Create a free project at <https://supabase.com> (choose the Mumbai region for India).
2. Open **SQL Editor**, paste all of `supabase/schema.sql` and click **Run**. This creates:
   - all tables: Users/profiles, Leads, Clients, Consultants, Services, Projects, ProjectMilestones, Tasks, Documents, Appointments, Payments, Testimonials, FAQs, BlogPosts, ResearchAreas, Locations, ContactMessages, SiteSettings, ResourceDownloads and ProjectMessages
   - Row Level Security. The public can **submit** forms but can't read anything. Admins see everything, consultants see their assigned or unassigned leads, and clients see only their own projects.
   - a **private** `research-files` bucket with a 10 MB limit that only accepts PDF/DOC(X)/XLS(X)/CSV/PPTX files
3. Go to **Authentication → Users → Add user** and create your admin account.
4. In the SQL Editor, promote it to admin:
   ```sql
   update public.profiles set role = 'admin' where email = 'you@yourdomain.in';
   ```
   (Use `'consultant'` for team members. Everyone who signs up through the portal becomes a `client`.)
5. From **Project Settings → API**, copy the Project URL and the `anon` public key. In GitHub, go to **Settings → Secrets and variables → Actions → Variables** and add them as repository variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

   The anon key is designed to be public. Your data is protected by the RLS policies, not by hiding the key.
6. Re-run the workflow (Actions → Deploy → Run workflow). The admin login then uses real accounts, and enquiries are stored in the database.

### Email notifications and the automatic reply

`supabase/functions/notify-lead` emails the admin about every new lead, booking or message. It also sends the enquirer the acknowledgement: *"Thank you for contacting ThesisCare. We have received your research enquiry and will review your requirements shortly."*

```bash
npx supabase functions deploy notify-lead --no-verify-jwt
npx supabase secrets set RESEND_API_KEY=... ADMIN_EMAIL=... FROM_EMAIL="ThesisCare <hello@yourdomain.in>" BRAND_NAME="ThesisCare" WEBHOOK_SECRET=<random> SITE_URL=https://mtc0013.github.io/ThesisCare
```

Then go to **Database → Webhooks → Create**. Set it to fire on INSERT on `leads` (and optionally `appointments` and `contact_messages`), call the `notify-lead` function, and add the HTTP header `x-webhook-secret: <same random value>`.

Email is sent through [Resend](https://resend.com) (free tier). To use another provider, change `sendEmail()` in the function.

### WhatsApp

WhatsApp buttons appear automatically once a number is saved in **Admin → Settings**. Each lead in the admin dashboard also has a **WhatsApp** button that opens a chat pre-filled with the acknowledgement template. Automated WhatsApp messages (the WhatsApp Business API) are planned for Phase 3.

## 4. Before launch — replace the placeholders

All of these are deliberate. The site never invents facts.

| What | Where | Default |
|---|---|---|
| Phone, WhatsApp, email, address, map, social links, hours, CTA text, GA4 ID, Meta Pixel ID | **Admin → Settings** (no code needed) | Empty → hidden on the site |
| Brand name | `src/config.mjs` → `brandName` (or `BRAND_NAME` env) | "ThesisCare" |
| Team profiles | `src/content/people.mjs` → set `sample: false` | 5 profiles labelled "Sample profile" |
| Testimonials | `src/content/people.mjs` → only shown with `consentToPublish: true` | Labelled placeholders |
| Statistics strip | `src/config.mjs` → `settings.stats` | Hidden (empty) |
| Legal text | `src/content/legal.mjs` → fill in `[bracketed]` items | Templates. Have them reviewed by a lawyer. |
| Article author and reviewer | `src/content/posts.mjs` | "Editorial Team" |
| City pages | `src/content/locations.mjs` → add real info and set `published: true` | None published |
| Social share image | add `src/assets/img/og-image.png` (1200×630) and re-add the `og:image` tag in `layout.mjs` | Not set |
| Hero photo (optional) | replace `heroVisual()` in `components.mjs` with an `<img>` of a real, licensed photo | Original SVG research illustration |

## 5. Adding content (no redesign needed)

Everything is driven by the data files in `src/content/`. Add an entry, commit, and the site rebuilds automatically:

- **Service** → `services.mjs`. This generates its page, menu entry, footer link, search entry and sitemap entry.
- **Article** → `posts.mjs`. The table of contents is built from each `<h2>`.
- **FAQ** → `faqs.mjs`. Use `tags` to show it on the home page, the pricing page or specific service pages.
- **Specialty**, **Who-we-help** page, **SEO landing page**, **city page** → `areas.mjs`, `audiences.mjs`, `seo-pages.mjs`, `locations.mjs`

## 6. What's included

**Website:** home page (in the requested section order) · 10 service pages (with FAQs, deliverables, process and an enquiry form) · 6 audience landing pages · 27 research areas · How It Works · Pricing (custom quotes) · Resource Center (10 articles) · 6 printable checklists behind an optional lead form · About · Team · FAQ · Contact · Consultation booking · Academic Integrity · 5 legal policies · 9 SEO landing pages · site-wide search (press `/`) · 404 page · sitemap.xml · robots.txt · JSON-LD (Organization, Service, FAQPage, Article, Breadcrumb) · canonical and Open Graph tags.

**Conversion:** two-step enquiry form with validation and file upload · sticky mobile bar (WhatsApp / Call / Enquire) · floating desktop contact button · quote requests prefilled from service and pricing pages.

**Admin (`/admin/`):**
- Overview KPIs
- Leads CRM: search, filters by status, service, user type, consultant, date range and follow-up due; status changes, consultant assignment, follow-up dates, internal notes, activity log, secure file downloads, WhatsApp/email templates and CSV export
- Bookings, messages and resource leads
- Projects: milestones, deliverable uploads and payments
- Site settings

**Client portal (`/portal/`):** sign-up and login · projects and milestone progress · document upload and download · consultations · invoices · messages and revision requests.

**Security and privacy:**
- Supabase Auth with admin, consultant and client roles
- RLS on every table; a private storage bucket; time-limited (5-minute) download links
- Server-side sanitising of public submissions
- Client- and database-level validation; file type and size limits on both sides
- Honeypot, minimum-fill-time and rate-limit spam checks; optional Cloudflare Turnstile
- Analytics load only after cookie consent

**Analytics events:** `enquiry_submit`, `quote_request`, `booking_submit`, `contact_submit`, `resource_download`, `whatsapp_click`, `phone_click`, `service_page_view` and every CTA click, sent to GA4, Meta Pixel and `dataLayer`.

## 7. Known limits and next steps (Phase 2/3)

- **Turnstile:** if you enable it, verify the token server-side, e.g. with a Postgres function or an Edge Function in front of inserts. Right now the widget only blocks casual bots in the browser.
- **Content editing:** the CMS tables exist in the database, but pages are currently generated from `src/content/` at build time, which is best for SEO. Admin editing of articles, FAQs and team is a natural next step.
- **Planned:** online payments (Razorpay), invoice PDFs, WhatsApp Business API automation and consultant-specific dashboards.
