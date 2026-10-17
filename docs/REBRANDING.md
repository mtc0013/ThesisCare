# Rebranding the platform for a new client

Use this checklist when you license the platform to another business. Each client gets **their own copy**: their own GitHub repository, website, Supabase database and admin accounts. Never share ThesisCare's database or leads with a client.

Typical time: about 1–2 hours.

---

## 1. Give the client their own copy of the code

1. The client creates a free GitHub account and an empty repository, then adds you as a collaborator. You can also create it for them and transfer it later.
2. On your PC, copy the project folder (without `dist/`, `node_modules/` or `.git/`) to a new folder, e.g. `client-scholarmed`.
3. In the new folder:

   ```powershell
   git init -b main
   git add -A
   git commit -m "Initial site for <Client name>"
   git remote add origin https://github.com/<client>/<repo>.git
   git push -u origin main
   ```
4. In their repository, go to **Settings → Pages → Source** and choose **GitHub Actions**.

## 2. Change the brand (one file: `src/config.mjs`)

At the top of `src/config.mjs`:

```js
brandName: env.BRAND_NAME || 'ScholarMed',
theme: {
  primary:     '#4C1D95',  // main colour: buttons, logo, headline gradient
  primaryDark: '#1E1038',  // footer, dark panels, admin sidebar
  accent:      '#DB2777',  // icons, links, gradient end
  highlight:   '#F9A8D4',  // bright highlight on dark backgrounds
},
logo: { imageUrl: '' },    // or 'assets/img/logo.svg' after adding their logo file
```

Everything updates automatically: logo mark, favicon, buttons, gradients, footer, admin dashboard and browser tab colour.

**Choosing colours:**
- `primary` and `primaryDark` must be **dark** enough for white text, and `highlight` **light** enough to read on dark backgrounds.
- Use the client's brand colours if they have them. Check contrast at https://webaim.org/resources/contrastchecker/ (aim for 4.5:1 or higher).

**Using their own logo:** put a square logo file (SVG or PNG, at least 256×256) in `src/assets/img/`, e.g. `logo.svg`, and set `logo: { imageUrl: 'assets/img/logo.svg' }`.

Preview before pushing:

```powershell
npm run dev
```

## 3. Give them their own database

1. In **the client's** Supabase account (Free Plan), create a project: region **South Asia (Mumbai)**, password generated and saved by them.
2. In **SQL Editor**, run the whole of `supabase/schema.sql`.
3. **Authentication → URL Configuration:**
   - Site URL: `https://<client>.github.io/<repo>/`
   - Redirect URL: `https://<client>.github.io/<repo>/**`
4. **Authentication → Users → Add user** for the client's admin. Tick **Auto Confirm User**, then promote them in SQL Editor:

   ```sql
   insert into public.profiles (id, email, role)
   select id, email, 'admin' from auth.users where email = 'admin@client.com'
   on conflict (id) do update set role = 'admin';
   ```
5. In `src/config.mjs`, replace `supabaseUrl` and `supabaseAnonKey` with **their** project URL and **publishable** key (Project Settings → API Keys). Never use the secret key.

## 4. Update content and remove anything ThesisCare-specific

| What | Where |
|---|---|
| Legal pages: their legal name, address, jurisdiction | `src/content/legal.mjs` |
| Team profiles (real people only) | `src/content/people.mjs` |
| Services, prices and FAQs if they differ | `src/content/services.mjs`, `faqs.mjs` |
| Contact details, WhatsApp, hours, analytics IDs | Their **Admin → Settings** after launch |
| The "ThesisCare" example URLs in the docs | `README.md`, `docs/OPERATIONS.md` |
| The keep-alive job (it reads the Supabase settings from config automatically) | Nothing to change |

Search the folder for "ThesisCare" and "mtc0013" to catch anything left over.

## 5. Publish and hand over

1. Commit and push. The site goes live at `https://<client>.github.io/<repo>/` in about 2 minutes.
2. Test the checklist in `docs/OPERATIONS.md` §8 on their live site, then delete the test entries.
3. Hand over:
   - their admin login (they set their own password via **Forgot password?**)
   - `docs/OPERATIONS.md`
   - ownership of the GitHub repository and Supabase project, if you agreed to transfer them
4. **Optional:** connect their custom domain (`CNAME` file, GitHub Pages settings, Supabase URL configuration).

## The sales demo

Every deploy of this repository also publishes a **sales demo** at `/ThesisCare/demo/`:
- it's branded "MedResearch Hub" and uses browser-only data
- it has sample admin data and a "Live demo" banner
- search engines are told not to index it

It's built by the "Build sales demo" step in `.github/workflows/deploy.yml`. To show a prospect their own name and colours, change `BRAND_NAME` there (and add `BRAND_PRIMARY`, `BRAND_PRIMARY_DARK`, `BRAND_ACCENT`, `BRAND_HIGHLIGHT` lines), then push.
