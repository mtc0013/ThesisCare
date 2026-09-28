# ThesisCare — Operations Guide

This guide covers day-to-day running of the ThesisCare website: running it locally, publishing changes, managing users and leads, and fixing common problems.

---

## 1. Quick reference

| What | Where |
|---|---|
| **Live website** (share with clients) | https://mtc0013.github.io/ThesisCare/ |
| Enquiry form | https://mtc0013.github.io/ThesisCare/enquire/ |
| Consultation booking | https://mtc0013.github.io/ThesisCare/book-consultation/ |
| Client portal | https://mtc0013.github.io/ThesisCare/portal/ |
| **Admin dashboard** (staff only) | https://mtc0013.github.io/ThesisCare/admin/ |
| Source code (GitHub) | https://github.com/mtc0013/ThesisCare |
| Deployments (build status) | https://github.com/mtc0013/ThesisCare/actions |
| GitHub Pages settings | https://github.com/mtc0013/ThesisCare/settings/pages |
| **Supabase project** (database, logins, files) | https://supabase.com/dashboard/project/nltzgbznhcvbrjwlcbig |
| Local project folder | `C:\Users\mohus\OneDrive\Documents\Claude_specific\medresearch-hub` |
| Local preview | http://localhost:4173 |

**Accounts:** GitHub `mtc0013` · Supabase organisation "ThesisCare" (Free Plan) · admin login `mohussai@yahoo.co.in`

**How it fits together**

```
Visitor ──► Website (GitHub Pages, free) ──► Supabase (database + file storage + logins, free)
                     ▲                                        ▲
     git push ───────┘ auto-deploys in ~1–2 min               └── Admin dashboard reads leads here
```

---

## 2. Running the site on your computer

You need **Node.js 18 or newer** (installed: v22). Nothing else is required.

### Start

Open **PowerShell** in the project folder and run:

```powershell
cd "C:\Users\mohus\OneDrive\Documents\Claude_specific\medresearch-hub"
npm run dev
```

You should see:

```
Built 54 indexed pages (+ apps) → dist/   base: /   backend: Supabase
Preview: http://localhost:4173
```

Open http://localhost:4173 in your browser.

### Stop

Click in the PowerShell window and press **Ctrl + C**.

### After editing files

The preview doesn't reload by itself. Stop it (**Ctrl + C**) and run `npm run dev` again, then refresh the browser.

### ⚠️ The local preview uses the REAL database

Forms submitted on `localhost` are saved to the same Supabase database as the live site, and they appear in the admin **Leads** tab. Name any test entries clearly (e.g. "TEST — delete me") and delete them afterwards (see §6).

### "Port 4173 is already in use"

Another preview server is still running, e.g. in another PowerShell window or one started by the Claude app. Either close that window, or use a different port:

```powershell
$env:PORT=4174; npm run dev
```

Then open http://localhost:4174.

---

## 3. Publishing changes (automatic deployment)

Every push to the `main` branch on GitHub rebuilds and publishes the site automatically within about **1–2 minutes**.

### From PowerShell

```powershell
cd "C:\Users\mohus\OneDrive\Documents\Claude_specific\medresearch-hub"
git pull
git add -A
git commit -m "Describe what you changed"
git push
```

- `git pull` first fetches any changes made directly on GitHub.
- Watch progress at https://github.com/mtc0013/ThesisCare/actions. A green ✓ on **"Deploy to GitHub Pages"** means it's live.
- If the site doesn't look updated, press **Ctrl + F5** in the browser to bypass its cache.

### From the GitHub website

Open a file on github.com → click ✏️ **Edit** → make the change → **Commit changes**. It deploys the same way. Afterwards, run `git pull` on your PC so your local copy stays in sync.

### Undo a bad change

Find the commit ID (the short code, e.g. `5db6819`) with `git log --oneline`, then:

```powershell
git revert 5db6819
git push
```

This creates a new commit that reverses the old one. History is kept, and the site redeploys.

### ⚠️ Never add a second Pages workflow

The only workflow must be `.github/workflows/deploy.yml`. If GitHub suggests **"Configure"** for a *Jekyll* or *Static HTML* workflow on the Pages settings page, **don't click it**: it overwrites the site with the README (you'd see a plain text page and 404s). If it happens, delete the extra file in `.github/workflows/` (e.g. `jekyll-gh-pages.yml`, `static.yml`) and push.

GitHub Pages **Source** must stay set to **GitHub Actions**.

---

## 4. Admin dashboard

### Sign in

https://mtc0013.github.io/ThesisCare/admin/ → email + password.

If it says **"This account does not have staff access"**, the user isn't an admin or consultant yet (see §5).

### Forgot password

Click **Forgot password?** on the sign-in page. Supabase emails a reset link, which opens the website where the password can be set. Supabase's built-in email sender is limited to a few emails per hour on the free plan. Alternatively, in Supabase go to **Authentication → Users**, click the user, then **Send password recovery**.

### Business details (no code needed)

**Admin → Settings**: company name, phone, WhatsApp, email, address, Google Maps link, social links, business hours, header button text, Google Analytics ID and Meta Pixel ID.

- Changes are live as soon as you click **Save**; no deploy is needed.
- Empty fields are **hidden** on the site (e.g. no WhatsApp button until a number is set).
- WhatsApp number: digits with country code, no `+` or spaces, e.g. `919812345678`.

---

## 5. Users and roles

| Role | Can do | How they get it |
|---|---|---|
| **admin** | Everything: all leads, settings, projects, deleting data | Promoted in Supabase (below) |
| **consultant** | Leads assigned to them (or unassigned), their projects. No settings. | Promoted in Supabase |
| **client** | Client portal: only their own projects, documents, invoices | Signs up at `/portal/`, or created by you |

Projects appear in a client's portal when the project's **client email** matches the email they signed up with.

### Add a staff member (admin or consultant)

1. Supabase → **Authentication → Users → Add user → Create new user**.
2. Enter their email and a temporary password, tick **Auto Confirm User**, then click **Create user**.
3. Supabase → **SQL Editor → New query**, paste, change the email and role, then **Run**:

   ```sql
   insert into public.profiles (id, email, role)
   select id, email, 'consultant' from auth.users where email = 'person@example.com'
   on conflict (id) do update set role = 'consultant';
   ```

   Use `'admin'` instead of `'consultant'` for a full administrator (in both places).
4. They sign in at `/admin/` and should change their password via **Forgot password?**.

### See who has which role

```sql
select email, role, created_at from public.profiles order by created_at;
```

### Remove someone's staff access

```sql
update public.profiles set role = 'client' where email = 'person@example.com';
```

To remove the account completely: **Authentication → Users**, then the **⋯** menu next to the user → **Delete user**.

### Security notes

- New sign-ups are **always** clients. Nobody can make themselves admin from the website.
- Role changes can only be made in the Supabase SQL Editor (by you, the project owner) or by an admin.

---

## 6. Leads, bookings and files

### Daily workflow

1. Admin → **Overview** shows new leads, follow-ups due and booking requests.
2. Admin → **Leads** → click a lead to see details and uploaded files.
3. Use the **WhatsApp**, **Call** or **Email (template)** buttons to reply.
4. Update **Status**, **Assigned consultant**, **Follow-up date** and **Internal notes**, then click **Save changes**. Every change is recorded in the lead's **Activity**.
5. When the client agrees to the scope, click **Convert to project**. This creates a project with milestones.

**Lead statuses:** New → Contacted → Consultation Scheduled → Proposal Sent → In Progress → Completed / Closed / Not Interested.

### Uploaded files

Files are private. Click **Open** in a lead to download through a link that expires after 5 minutes. Clients can upload PDF, DOC/DOCX, XLS/XLSX, CSV and PPTX, up to 10 MB each and 5 per enquiry.

### Export (recommended weekly backup)

Leads, Bookings and Resource leads each have an **Export CSV** button. The Free Plan's backups aren't downloadable, so exporting regularly is your safety copy.

### Delete a lead (e.g. a test or spam entry)

The dashboard has no delete button, to prevent accidents. In Supabase **SQL Editor**:

```sql
-- 1. Find it
select id, full_name, email, created_at from public.leads order by created_at desc limit 20;

-- 2. Delete it (paste the id from step 1)
delete from public.leads where id = 'PASTE-ID-HERE' returning full_name, email;
```

Delete its files in Supabase → **Storage → research-files → enquiries**: right-click the folder whose name matches the lead's id, then **Delete**.

Test bookings and messages are deleted the same way, using `public.appointments` or `public.contact_messages`.

---

## 7. Editing content

All site content lives in plain files in `src/content/`. Edit, preview (§2), then publish (§3).

| To change… | Edit this file |
|---|---|
| Services (text, deliverables, FAQs) | `src/content/services.mjs` |
| "Who we help" pages | `src/content/audiences.mjs` |
| Research areas / specialties | `src/content/areas.mjs` |
| FAQs | `src/content/faqs.mjs` |
| Blog / Resource articles | `src/content/posts.mjs` |
| Downloadable checklists | `src/content/resources.mjs` |
| Team profiles & testimonials | `src/content/people.mjs` |
| Legal pages (privacy, terms, refund…) | `src/content/legal.mjs` |
| City pages (hidden until `published: true`) | `src/content/locations.mjs` |
| SEO landing pages | `src/content/seo-pages.mjs` |
| Brand name, site URL, upload limits | `src/config.mjs` |
| Colours, fonts, layout | `src/assets/css/styles.css` |

**Rules for honest content:**
- Only mark a testimonial as publishable (`consentToPublish: true`) with the client's written consent.
- Replace sample team profiles with real people only, and set `sample: false`.
- Add statistics (e.g. "projects supported") only if they're real and verifiable.
- Never promise guaranteed publication or thesis approval.

---

## 8. Testing checklist (after any significant change)

Check these on the **live site** after the deploy finishes, and on a phone as well as a computer.

- [ ] Homepage loads; menu, search (🔍) and all header links work
- [ ] Enquiry form: submitting an empty form shows errors; a valid submission shows **"Thank you…"** with a reference number
- [ ] The test enquiry appears in Admin → **Leads**, and its uploaded file opens
- [ ] Booking page: a date and time can be selected, and the request appears in Admin → **Bookings**
- [ ] Contact form: the message appears in Admin → **Messages**
- [ ] WhatsApp / Call buttons appear (once set in Settings) and open correctly
- [ ] On a phone: no sideways scrolling, and the bottom bar (Book / Get Research Consultation) works
- [ ] **Delete the test entries** (§6)

---

## 9. Free-plan limits and keeping costs at ₹0

| Service | Free allowance (check current pricing pages) | Notes |
|---|---|---|
| GitHub Pages | ~1 GB site, ~100 GB traffic/month | More than enough for this site |
| Supabase Free | 500 MB database, 1 GB file storage, 50,000 monthly active users | Files are the likeliest limit. Delete old project files you no longer need. |

- The Supabase organisation is on the **Free Plan** with no payment method, so **nothing can be charged**. Don't add a card or upgrade unless you decide to.
- ⚠️ **Supabase pauses free projects after about 7 days without activity.** Normal website visits and form submissions count as activity. If the project is paused, forms and admin sign-in stop working. Fix: open the Supabase dashboard and click **Restore project** (takes a few minutes).
- Check usage: Supabase → organisation **Billing / Usage**.

---

## 10. Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| Live site shows the README / a plain text page, or 404 on `/admin/` | An extra Jekyll/Static workflow was added, or Pages source isn't "GitHub Actions" | §3 "Never add a second Pages workflow" |
| Site doesn't show my latest change | Deploy still running, or browser cache | Check the Actions tab, then **Ctrl + F5** |
| `npm run dev` → "address already in use :::4173" | Another preview is running | §2 "Port 4173 is already in use" |
| Build says `backend: DEMO MODE` | Supabase settings missing from `src/config.mjs` | Confirm `supabaseUrl` / `supabaseAnonKey` are set in `src/config.mjs` |
| Form says "Sorry — something went wrong" | Supabase project paused, or network problem | Restore the project in Supabase (§9); try again |
| File upload fails | Wrong file type, or over 10 MB | Only PDF/DOC/DOCX/XLS/XLSX/CSV/PPTX, max 10 MB |
| "This account does not have staff access" | User is a client | Promote them (§5) |
| "Invalid login credentials" | Wrong password, or user not confirmed | Reset password (§4); in Supabase make sure the user is confirmed |
| Git push fails with "Authentication failed" | Saved GitHub sign-in expired | Run `git push` again and sign in when the window opens |

---

## 11. Security — do and don't

**Safe to be public:** the Supabase project URL and the **publishable key** (`sb_publishable_…`) in `src/config.mjs`. Data is protected by the database's security rules, not by hiding this key.

**Never share or commit:**
- the Supabase **secret key** (`sb_secret_…`) or legacy `service_role` key
- the Supabase **database password**
- your admin or GitHub passwords

**Good practice:**
- Give staff their own accounts, and don't share the admin login.
- Ask clients to remove patient identifiers from datasets before uploading.
- Export leads regularly (§6).

---

## 12. Still to do before a full public launch

- [ ] Add business email, WhatsApp, phone, city and hours in **Admin → Settings**
- [ ] Fill in the `[bracketed]` gaps in `src/content/legal.mjs` (legal name, address, jurisdiction, retention periods), ideally reviewed by a lawyer
- [ ] Replace sample team profiles in `src/content/people.mjs`
- [ ] Set up **email alerts** for new enquiries (README → "Email notifications"; needs a free Resend account)
- [ ] Optional: a custom domain (e.g. `www.thesiscare.in`). Add a `CNAME` file, set the domain in GitHub Pages settings, and update Supabase → Authentication → URL Configuration.
- [ ] Optional: Google Analytics / Search Console IDs in Settings; submit `https://mtc0013.github.io/ThesisCare/sitemap.xml` to Search Console
