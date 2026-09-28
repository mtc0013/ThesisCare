/* Admin dashboard — leads CRM, bookings, messages, resource leads, projects and site settings.
   Access is enforced server-side by Supabase Row Level Security (see supabase/schema.sql);
   this UI only reflects it. */
(function () {
  const C = window.MRH_CONFIG || {};
  const store = window.MRH.store;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = $('#admin-app');
  const view = $('#view');
  const drawer = $('#drawer');
  const backdrop = $('.drawer-backdrop');

  const LEAD_STATUSES = ['New', 'Contacted', 'Consultation Scheduled', 'Proposal Sent', 'In Progress', 'Completed', 'Closed', 'Not Interested'];
  const APPT_STATUSES = ['Requested', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];
  const MSG_STATUSES = ['New', 'Replied', 'Closed'];
  const PROJECT_STATUSES = ['Planning', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];
  const DEFAULT_MILESTONES = ['Research question', 'Study design', 'Protocol', 'Sample size', 'Data analysis', 'Manuscript', 'Final review'];
  const O = C.options || { roles: [], services: [] };

  let me = null;
  let staff = [];
  let cache = {};
  let tab = 'overview';

  const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const badge = (s) => `<span class="badge st-${slug(s)}">${esc(s || '—')}</span>`;
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const fmtDT = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '');
  const opt = (list, sel) => list.map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(sel || '') ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
  const staffName = (id) => { const s = staff.find((x) => x.id === id); return s ? s.full_name || s.email : id ? 'Unknown' : 'Unassigned'; };
  const isAdmin = () => me && me.profile.role === 'admin';
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const waNumber = (p) => { let d = digits(p); if (d.length === 10) d = '91' + d; return d; };

  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 2600); }
  const err = (e) => { console.error(e); toast('Error: ' + (e.message || e)); };

  /* ── Auth ─────────────────────────────────────────────────── */
  async function boot() {
    $$('[data-demo-only]').forEach((el) => (el.hidden = store.live));
    $$('[data-live-only]').forEach((el) => (el.hidden = !store.live));
    try { me = await store.auth.current(); } catch (e) { me = null; }
    if (me && ['admin', 'consultant'].includes(me.profile.role)) return enter();
    if (me) { await store.auth.signOut(); status('This account does not have staff access.'); }
    show('login');
  }
  function show(v) { $$('[data-view]', app).forEach((el) => (el.hidden = el.dataset.view !== v)); }
  function status(msg) { const s = $('[data-auth-form] .form-status', app); if (s) { s.textContent = msg; s.classList.add('error'); } }
  $('[data-demo-enter]', app) && $('[data-demo-enter]', app).addEventListener('click', () => { store.auth.demoEnter('admin'); boot(); });
  const authForm = $('[data-auth-form]', app);
  authForm && authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const b = $('button[type=submit]', authForm); b.disabled = true;
    try { await store.auth.signIn(authForm.email.value.trim(), authForm.password.value); await boot(); }
    catch (x) { status(x.message || 'Sign in failed'); }
    b.disabled = false;
  });
  $('[data-reset]', app) && $('[data-reset]', app).addEventListener('click', async () => {
    const email = authForm.email.value.trim(); if (!email) return status('Enter your email first.');
    try { await store.auth.reset(email); status('If the account exists, a reset link has been sent.'); } catch (x) { status(x.message); }
  });
  $$('[data-logout]', app).forEach((b) => b.addEventListener('click', async () => { await store.auth.signOut(); location.reload(); }));

  async function enter() {
    show('app');
    $('[data-user-email]').textContent = me.profile.full_name || me.user.email;
    $('[data-user-role]').textContent = me.profile.role + (store.live ? '' : ' · demo');
    $$('[data-admin-only]').forEach((el) => (el.hidden = !isAdmin()));
    try { staff = store.live ? await store.list('profiles', { select: 'id, full_name, email, role', order: ['full_name', 'asc'] }).then((r) => r.filter((p) => ['admin', 'consultant'].includes(p.role))) : [{ id: 'demo', full_name: 'Demo user', role: 'admin' }]; } catch (e) { staff = []; }
    if (!store.live) seedDemo();
    go(location.hash.slice(1) || 'overview');
  }

  function seedDemo() {
    // Demo only: create one clearly-labelled example lead the first time so the CRM isn't empty.
    try {
      if (localStorage.getItem('mrh:demo-seeded')) return;
      localStorage.setItem('mrh:demo-seeded', '1');
      const rows = JSON.parse(localStorage.getItem('mrh:leads') || '[]');
      rows.push({ id: store.uuid(), created_at: new Date().toISOString(), full_name: 'Example Lead (demo data)', phone: '+91 00000 00000', email: 'example@example.test', user_type: 'MD/MS Student', service: 'Biostatistics', specialty: 'MD General Medicine', institution: 'Example Institution', city: 'Example City', research_stage: 'Statistical Analysis', timeline: '1 – 3 months', message: 'This is sample demo data so you can explore the dashboard. Submit the enquiry form on the website to create real leads in demo mode.', attachments: [], source: 'demo', status: 'New', activity: [] });
      localStorage.setItem('mrh:leads', JSON.stringify(rows));
    } catch (e) {}
  }

  /* ── Navigation ───────────────────────────────────────────── */
  const titles = { overview: 'Overview', leads: 'Leads', appointments: 'Consultation bookings', messages: 'Contact messages', downloads: 'Resource leads', projects: 'Projects', settings: 'Site settings' };
  function go(t) {
    if (!titles[t] || (t === 'settings' && !isAdmin())) t = 'overview';
    tab = t; history.replaceState(null, '', '#' + t);
    $$('.app-nav button').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === t));
    $('[data-view-title]').textContent = titles[t];
    $('#app-side').classList.remove('open');
    view.innerHTML = '<p class="muted">Loading…</p>';
    ({ overview, leads: leadsView, appointments: apptView, messages: msgView, downloads: dlView, projects: projectsView, settings: settingsView }[t])().catch(err);
  }
  $$('.app-nav button').forEach((b) => b.addEventListener('click', () => go(b.dataset.tab)));
  $('.side-toggle').addEventListener('click', () => $('#app-side').classList.toggle('open'));

  async function load(table, force) {
    if (!cache[table] || force) cache[table] = await store.list(table);
    return cache[table];
  }
  async function refreshCounts() {
    try {
      const [l, a, m] = await Promise.all([load('leads'), load('appointments'), load('contact_messages')]);
      const set = (k, n) => { const el = $(`[data-count="${k}"]`); if (el) el.textContent = n || ''; };
      set('leads', l.filter((x) => x.status === 'New').length);
      set('appointments', a.filter((x) => x.status === 'Requested').length);
      set('contact_messages', m.filter((x) => x.status === 'New').length);
    } catch (e) {}
  }

  /* ── Overview ─────────────────────────────────────────────── */
  async function overview() {
    const [leads, appts, msgs, dls] = await Promise.all([load('leads', true), load('appointments', true), load('contact_messages', true), load('resource_downloads', true)]);
    refreshCounts();
    const now = Date.now(), week = 7 * 864e5;
    const today = new Date().toISOString().slice(0, 10);
    const due = leads.filter((l) => l.follow_up_date && l.follow_up_date <= today && !['Completed', 'Closed', 'Not Interested'].includes(l.status));
    const count = (arr, key) => arr.reduce((m, x) => ((m[x[key] || '—'] = (m[x[key] || '—'] || 0) + 1), m), {});
    const bars = (obj) => { const e = Object.entries(obj).sort((a, b) => b[1] - a[1]).slice(0, 8); const max = Math.max(1, ...e.map((x) => x[1])); return e.length ? `<div class="bars">${e.map(([k, v]) => `<div class="bar-row"><span>${esc(k)}</span><div class="bar-track"><div class="bar-fill" style="width:${(v / max) * 100}%"></div></div><strong>${v}</strong></div>`).join('')}</div>` : '<p class="muted">No data yet.</p>'; };
    view.innerHTML = `
      <div class="kpis">
        <div class="card kpi"><span>New leads</span><strong>${leads.filter((l) => l.status === 'New').length}</strong></div>
        <div class="card kpi"><span>Leads this week</span><strong>${leads.filter((l) => now - new Date(l.created_at) < week).length}</strong></div>
        <div class="card kpi"><span>Follow-ups due</span><strong>${due.length}</strong></div>
        <div class="card kpi"><span>Booking requests</span><strong>${appts.filter((a) => a.status === 'Requested').length}</strong></div>
        <div class="card kpi"><span>Unread messages</span><strong>${msgs.filter((m) => m.status === 'New').length}</strong></div>
        <div class="card kpi"><span>Resource downloads</span><strong>${dls.length}</strong></div>
      </div>
      <div class="panel-grid">
        <div class="card panel"><h2>Pipeline by status</h2>${bars(Object.fromEntries(LEAD_STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length]).filter(([, v]) => v)))}</div>
        <div class="card panel"><h2>Requested services</h2>${bars(count(leads, 'service'))}</div>
      </div>
      <div class="card panel"><h2>Follow-ups due</h2>${due.length ? leadTable(due) : '<p class="muted">Nothing due today.</p>'}</div>
      <div class="card panel"><h2>Latest leads</h2>${leads.length ? leadTable(leads.slice(0, 6)) : emptyState('No leads yet. Enquiries submitted on the website appear here automatically.')}</div>`;
    bindLeadRows();
  }
  const emptyState = (msg) => `<div class="empty"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5h13L22 12v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z"/></svg><p>${esc(msg)}</p></div>`;

  /* ── Leads ────────────────────────────────────────────────── */
  const leadFilters = { q: '', status: '', service: '', user_type: '', assigned: '', from: '', to: '', due: false };
  function leadTable(rows) {
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Lead</th><th>Phone</th><th>Profile</th><th>Service</th><th>Status</th><th>Assigned</th><th>Follow-up</th><th>Received</th></tr></thead><tbody>${rows
      .map((l) => `<tr data-lead="${esc(l.id)}" tabindex="0"><td data-label=""><div class="t-main">${esc(l.full_name)}</div><div class="t-sub">${esc(l.email)}</div></td><td data-label="Phone">${esc(l.phone)}</td><td data-label="Profile">${esc(l.user_type || '—')}<div class="t-sub">${esc(l.specialty || '')}</div></td><td data-label="Service">${esc(l.service || '—')}${l.request_type === 'quote' ? ' <span class="badge">Quote</span>' : ''}</td><td data-label="Status">${badge(l.status)}</td><td data-label="Assigned">${esc(staffName(l.assigned_to))}</td><td data-label="Follow-up">${fmtDate(l.follow_up_date)}</td><td data-label="Received">${fmtDate(l.created_at)}</td></tr>`)
      .join('')}</tbody></table></div>`;
  }
  function bindLeadRows() {
    $$('[data-lead]', view).forEach((tr) => {
      const open = () => openLead(tr.dataset.lead);
      tr.addEventListener('click', open);
      tr.addEventListener('keydown', (e) => { if (e.key === 'Enter') open(); });
    });
  }
  function filterLeads(rows) {
    const f = leadFilters, q = f.q.toLowerCase(), today = new Date().toISOString().slice(0, 10);
    return rows.filter((l) =>
      (!q || [l.full_name, l.email, l.phone, l.institution, l.city, l.specialty, l.message].join(' ').toLowerCase().includes(q)) &&
      (!f.status || l.status === f.status) && (!f.service || l.service === f.service) && (!f.user_type || l.user_type === f.user_type) &&
      (!f.assigned || (f.assigned === '_none' ? !l.assigned_to : l.assigned_to === f.assigned)) &&
      (!f.from || l.created_at.slice(0, 10) >= f.from) && (!f.to || l.created_at.slice(0, 10) <= f.to) &&
      (!f.due || (l.follow_up_date && l.follow_up_date <= today)));
  }
  async function leadsView() {
    const rows = await load('leads', true);
    refreshCounts();
    view.innerHTML = `
      <div class="toolbar">
        <input class="input search" type="search" placeholder="Search name, email, phone, institution…" data-f="q" value="${esc(leadFilters.q)}" aria-label="Search leads">
        <select class="input" data-f="status" aria-label="Status"><option value="">All statuses</option>${opt(LEAD_STATUSES, leadFilters.status)}</select>
        <select class="input" data-f="service" aria-label="Service"><option value="">All services</option>${opt(O.services, leadFilters.service)}</select>
        <select class="input" data-f="user_type" aria-label="User type"><option value="">All user types</option>${opt(O.roles, leadFilters.user_type)}</select>
        <select class="input" data-f="assigned" aria-label="Assigned"><option value="">Anyone</option><option value="_none" ${leadFilters.assigned === '_none' ? 'selected' : ''}>Unassigned</option>${opt(staff.map((s) => [s.id, s.full_name || s.email]), leadFilters.assigned)}</select>
        <input class="input" type="date" data-f="from" value="${leadFilters.from}" aria-label="From date" title="From">
        <input class="input" type="date" data-f="to" value="${leadFilters.to}" aria-label="To date" title="To">
        <label class="checkbox small"><input type="checkbox" data-f="due" ${leadFilters.due ? 'checked' : ''}><span>Follow-up due</span></label>
        <button class="btn btn-outline btn-sm" data-export>Export CSV</button>
      </div>
      <p class="muted small" data-result-count></p>
      <div data-lead-table></div>`;
    const draw = () => {
      const r = filterLeads(rows);
      $('[data-result-count]').textContent = `${r.length} of ${rows.length} leads`;
      $('[data-lead-table]').innerHTML = r.length ? leadTable(r) : emptyState(rows.length ? 'No leads match these filters.' : 'No leads yet. Enquiries submitted on the website appear here automatically.');
      bindLeadRows();
    };
    $$('[data-f]', view).forEach((el) => el.addEventListener(el.type === 'search' ? 'input' : 'change', () => { leadFilters[el.dataset.f] = el.type === 'checkbox' ? el.checked : el.value; draw(); }));
    $('[data-export]', view).addEventListener('click', () => csv('leads', filterLeads(rows), ['created_at', 'full_name', 'phone', 'email', 'user_type', 'specialty', 'institution', 'city', 'service', 'research_stage', 'timeline', 'request_type', 'status', 'assigned_to', 'follow_up_date', 'source', 'message', 'notes']));
    draw();
  }

  function openDrawer(html) { drawer.innerHTML = html; drawer.hidden = false; backdrop.hidden = false; document.body.style.overflow = 'hidden'; const f = $('.icon-btn', drawer); f && f.focus(); }
  function closeDrawer() { drawer.hidden = true; backdrop.hidden = true; document.body.style.overflow = ''; }
  backdrop.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
  drawer.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeDrawer(); });
  const closeBtn = '<button class="icon-btn" data-close aria-label="Close"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';

  async function attachmentsHtml(list) {
    if (!list || !list.length) return '<p class="muted small">No files uploaded.</p>';
    return list.map((f, i) => `<div class="attach"><span>📄 ${esc(f.name)}</span><small class="muted">${(f.size / 1048576).toFixed(1)} MB</small>${store.live ? `<button class="btn btn-outline btn-sm" data-file="${i}">Open</button>` : '<small class="muted">demo: not stored</small>'}</div>`).join('');
  }

  async function openLead(id) {
    const l = (cache.leads || []).find((x) => x.id === id);
    if (!l) return;
    const S = window.MRH.settings || C.settings || {};
    const brand = S.companyName || C.brandName;
    const autoReply = `Thank you for contacting ${brand}. We have received your research enquiry and will review your requirements shortly.`;
    const firstName = (l.full_name || '').split(' ')[0];
    const waText = `Hello ${firstName}, ${autoReply}`;
    openDrawer(`
      <div class="drawer-head"><div><h2>${esc(l.full_name)}</h2><p class="muted small">${badge(l.status)} · received ${fmtDT(l.created_at)} · ref ${esc(String(l.id).slice(0, 8).toUpperCase())}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="quick-actions">
          ${l.phone ? `<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/${waNumber(l.phone)}?text=${encodeURIComponent(waText)}">WhatsApp</a><a class="btn btn-outline btn-sm" href="tel:${esc(l.phone.replace(/[^\d+]/g, ''))}">Call</a>` : ''}
          ${l.email ? `<a class="btn btn-outline btn-sm" href="mailto:${esc(l.email)}?subject=${encodeURIComponent('Your research enquiry — ' + brand)}&body=${encodeURIComponent(`Dear ${l.full_name},\n\n${autoReply}\n\nWarm regards,\n${brand}`)}">Email (template)</a>` : ''}
        </div>
        <dl class="kv">
          <dt>Email</dt><dd>${esc(l.email)}</dd><dt>Phone / WhatsApp</dt><dd>${esc(l.phone)}</dd>
          <dt>I am a</dt><dd>${esc(l.user_type || '—')}</dd><dt>Course / specialty</dt><dd>${esc(l.specialty || '—')}</dd>
          <dt>Institution</dt><dd>${esc(l.institution || '—')}</dd><dt>City / State</dt><dd>${esc(l.city || '—')}</dd>
          <dt>Research stage</dt><dd>${esc(l.research_stage || '—')}</dd><dt>Service</dt><dd>${esc(l.service || '—')} ${l.request_type === 'quote' ? '<span class="badge">Quote request</span>' : ''}</dd>
          <dt>Timeline</dt><dd>${esc(l.timeline || '—')}</dd><dt>Source</dt><dd>${esc(l.source || '—')} ${l.meta && l.meta.page_url ? `<span class="muted small">(${esc(l.meta.page_url)})</span>` : ''}</dd>
        </dl>
        <h3>Message</h3><div class="msg-box">${esc(l.message || '—')}</div>
        <h3>Uploaded files</h3><div data-files>${await attachmentsHtml(l.attachments)}</div>
        <h3>Manage lead</h3>
        <form data-lead-form>
          <div class="field-row">
            <div class="field"><label for="ld-status">Status</label><select id="ld-status" name="status">${opt(LEAD_STATUSES, l.status)}</select></div>
            <div class="field"><label for="ld-assign">Assigned consultant</label><select id="ld-assign" name="assigned_to"><option value="">Unassigned</option>${opt(staff.map((s) => [s.id, s.full_name || s.email]), l.assigned_to)}</select></div>
          </div>
          <div class="field"><label for="ld-fu">Follow-up date</label><input id="ld-fu" type="date" name="follow_up_date" value="${esc(l.follow_up_date || '')}"></div>
          <div class="field"><label for="ld-notes">Internal notes</label><textarea id="ld-notes" name="notes" rows="4" placeholder="Visible to staff only">${esc(l.notes || '')}</textarea></div>
        </form>
        <h3>Activity</h3>
        <ul class="activity">${(l.activity || []).slice().reverse().map((a) => `<li>${esc(a.text)}<time>${fmtDT(a.at)} · ${esc(a.by || '')}</time></li>`).join('') || '<li class="muted">No activity yet.</li>'}</ul>
      </div>
      <div class="drawer-foot"><button class="btn btn-outline" data-to-project>Convert to project</button><button class="btn btn-primary" data-save>Save changes</button></div>`);
    $$('[data-file]', drawer).forEach((b) => b.addEventListener('click', async () => {
      try { const u = await store.fileUrl(l.attachments[+b.dataset.file].path); window.open(u, '_blank', 'noopener'); } catch (e) { err(e); }
    }));
    $('[data-save]', drawer).addEventListener('click', async () => {
      const f = $('[data-lead-form]', drawer);
      const patch = { status: f.status.value, assigned_to: f.assigned_to.value || null, follow_up_date: f.follow_up_date.value || null, notes: f.notes.value };
      const changes = [];
      if (patch.status !== l.status) changes.push(`Status: ${l.status} → ${patch.status}`);
      if ((patch.assigned_to || null) !== (l.assigned_to || null)) changes.push(`Assigned to ${staffName(patch.assigned_to)}`);
      if ((patch.follow_up_date || null) !== (l.follow_up_date || null)) changes.push(`Follow-up set to ${fmtDate(patch.follow_up_date)}`);
      if ((patch.notes || '') !== (l.notes || '')) changes.push('Notes updated');
      if (changes.length) patch.activity = (l.activity || []).concat([{ at: new Date().toISOString(), by: me.profile.full_name || me.user.email, text: changes.join(' · ') }]);
      try { await store.update('leads', l.id, patch); Object.assign(l, patch); toast('Lead updated'); closeDrawer(); go(tab); } catch (e) { err(e); }
    });
    $('[data-to-project]', drawer).addEventListener('click', () => newProjectForm(l));
  }

  /* ── Bookings / messages / downloads ──────────────────────── */
  async function apptView() {
    const rows = await load('appointments', true); refreshCounts();
    view.innerHTML = `<div class="toolbar"><select class="input" data-st aria-label="Status"><option value="">All statuses</option>${opt(APPT_STATUSES)}</select><button class="btn btn-outline btn-sm" data-export>Export CSV</button></div><div data-t></div>`;
    const draw = () => {
      const st = $('[data-st]').value; const r = rows.filter((x) => !st || x.status === st);
      $('[data-t]').innerHTML = r.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Type</th><th>Preferred slot</th><th>Mode</th><th>Status</th><th>Requested</th></tr></thead><tbody>${r.map((a) => `<tr data-id="${esc(a.id)}" tabindex="0"><td data-label=""><div class="t-main">${esc(a.name)}</div><div class="t-sub">${esc(a.email)} · ${esc(a.phone)}</div></td><td data-label="Type">${esc(a.consultation_type)}</td><td data-label="Slot">${fmtDate(a.preferred_date)} · ${esc(a.preferred_time)}</td><td data-label="Mode">${esc(a.mode || '—')}</td><td data-label="Status">${badge(a.status)}</td><td data-label="Requested">${fmtDate(a.created_at)}</td></tr>`).join('')}</tbody></table></div>` : emptyState('No consultation bookings yet.');
      $$('[data-id]', view).forEach((tr) => tr.addEventListener('click', () => simpleDrawer('appointments', rows.find((x) => x.id === tr.dataset.id), APPT_STATUSES, [['Email', 'email'], ['WhatsApp', 'phone'], ['Type', 'consultation_type'], ['Preferred date', 'preferred_date'], ['Preferred time', 'preferred_time'], ['Mode', 'mode'], ['Notes', 'notes']])));
    };
    $('[data-st]').addEventListener('change', draw);
    $('[data-export]').addEventListener('click', () => csv('bookings', rows, ['created_at', 'name', 'email', 'phone', 'consultation_type', 'preferred_date', 'preferred_time', 'mode', 'status', 'notes']));
    draw();
  }
  async function msgView() {
    const rows = await load('contact_messages', true); refreshCounts();
    view.innerHTML = rows.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>From</th><th>Subject</th><th>Status</th><th>Received</th></tr></thead><tbody>${rows.map((m) => `<tr data-id="${esc(m.id)}" tabindex="0"><td data-label=""><div class="t-main">${esc(m.name)}</div><div class="t-sub">${esc(m.email)}</div></td><td data-label="Subject">${esc(m.subject || (m.message || '').slice(0, 60))}</td><td data-label="Status">${badge(m.status)}</td><td data-label="Received">${fmtDate(m.created_at)}</td></tr>`).join('')}</tbody></table></div>` : emptyState('No messages yet.');
    $$('[data-id]', view).forEach((tr) => tr.addEventListener('click', () => simpleDrawer('contact_messages', rows.find((x) => x.id === tr.dataset.id), MSG_STATUSES, [['Email', 'email'], ['Phone', 'phone'], ['Subject', 'subject'], ['Message', 'message']])));
  }
  async function dlView() {
    const rows = await load('resource_downloads', true);
    view.innerHTML = `<div class="toolbar"><button class="btn btn-outline btn-sm" data-export>Export CSV</button></div>` + (rows.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>WhatsApp</th><th>Role</th><th>Resource</th><th>Date</th></tr></thead><tbody>${rows.map((d) => `<tr><td data-label=""><div class="t-main">${esc(d.name)}</div><div class="t-sub">${esc(d.email)}</div></td><td data-label="WhatsApp">${esc(d.phone || '—')}</td><td data-label="Role">${esc(d.role || '—')}</td><td data-label="Resource">${esc(d.resource)}</td><td data-label="Date">${fmtDate(d.created_at)}</td></tr>`).join('')}</tbody></table></div>` : emptyState('No resource downloads yet.'));
    $('[data-export]').addEventListener('click', () => csv('resource-leads', rows, ['created_at', 'name', 'email', 'phone', 'role', 'resource']));
  }
  function simpleDrawer(table, r, statuses, fields) {
    openDrawer(`<div class="drawer-head"><div><h2>${esc(r.name)}</h2><p class="muted small">${badge(r.status)} · ${fmtDT(r.created_at)}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="quick-actions">${r.phone ? `<a class="btn btn-whatsapp btn-sm" target="_blank" rel="noopener" href="https://wa.me/${waNumber(r.phone)}">WhatsApp</a>` : ''}${r.email ? `<a class="btn btn-outline btn-sm" href="mailto:${esc(r.email)}">Email</a>` : ''}</div>
        <dl class="kv">${fields.map(([l, k]) => `<dt>${l}</dt><dd>${k === 'message' || k === 'notes' ? `<div class="msg-box">${esc(r[k] || '—')}</div>` : esc(r[k] || '—')}</dd>`).join('')}</dl>
        <div class="field"><label for="sd-status">Status</label><select id="sd-status">${opt(statuses, r.status)}</select></div>
        <div class="field"><label for="sd-notes">Internal notes</label><textarea id="sd-notes" rows="3">${esc(r.staff_notes || '')}</textarea></div>
      </div>
      <div class="drawer-foot"><button class="btn btn-primary" data-save>Save</button></div>`);
    $('[data-save]', drawer).addEventListener('click', async () => {
      try { await store.update(table, r.id, { status: $('#sd-status').value, staff_notes: $('#sd-notes').value }); toast('Saved'); closeDrawer(); go(tab); } catch (e) { err(e); }
    });
  }

  /* ── Projects ─────────────────────────────────────────────── */
  async function projectsView() {
    const [projects, ms] = await Promise.all([load('projects', true), load('project_milestones', true)]);
    view.innerHTML = `<div class="toolbar"><button class="btn btn-primary btn-sm" data-new>+ New project</button><span class="muted small">Create projects from a lead (Leads → open → Convert to project) or here.</span></div>
      ${projects.length ? `<div class="grid grid-auto">${projects.map((p) => { const m = ms.filter((x) => x.project_id === p.id); const done = m.filter((x) => x.done).length; const pct = m.length ? Math.round((done / m.length) * 100) : 0; return `<button class="card project-card" data-p="${esc(p.id)}" style="text-align:left"><p class="muted small">${esc(p.service || '')}</p><h3>${esc(p.title)}</h3><p class="small">${esc(p.client_name || '')}</p><div class="progress"><i style="width:${pct}%"></i></div><p class="small muted">${done}/${m.length} milestones · ${badge(p.status)} · due ${fmtDate(p.due_date)}</p></button>`; }).join('')}</div>` : emptyState('No projects yet.')}`;
    $('[data-new]').addEventListener('click', () => newProjectForm(null));
    $$('[data-p]', view).forEach((b) => b.addEventListener('click', () => openProject(b.dataset.p)));
  }
  function newProjectForm(lead) {
    openDrawer(`<div class="drawer-head"><div><h2>New project</h2><p class="muted small">${lead ? 'From lead: ' + esc(lead.full_name) : 'Create a client project'}</p></div>${closeBtn}</div>
      <form class="drawer-body" data-np>
        <div class="field"><label for="np-title">Project title</label><input id="np-title" name="title" required value="${esc(lead ? `${lead.service || 'Research'} — ${lead.full_name}` : '')}"></div>
        <div class="field-row"><div class="field"><label for="np-cn">Client name</label><input id="np-cn" name="client_name" required value="${esc(lead ? lead.full_name : '')}"></div><div class="field"><label for="np-ce">Client email</label><input id="np-ce" name="client_email" type="email" value="${esc(lead ? lead.email : '')}"></div></div>
        <div class="field-row"><div class="field"><label for="np-svc">Service</label><select id="np-svc" name="service">${opt(O.services, lead && lead.service)}</select></div><div class="field"><label for="np-due">Due date</label><input id="np-due" name="due_date" type="date"></div></div>
        <div class="field"><label for="np-con">Consultant</label><select id="np-con" name="consultant_id"><option value="">Unassigned</option>${opt(staff.map((s) => [s.id, s.full_name || s.email]), lead && lead.assigned_to)}</select></div>
        <div class="field"><label for="np-ms">Milestones (one per line)</label><textarea id="np-ms" name="milestones" rows="7">${DEFAULT_MILESTONES.join('\n')}</textarea></div>
      </form>
      <div class="drawer-foot"><button class="btn btn-primary" data-create>Create project</button></div>`);
    $('[data-create]', drawer).addEventListener('click', async () => {
      const f = $('[data-np]', drawer);
      if (!f.title.value.trim() || !f.client_name.value.trim()) return toast('Title and client name are required');
      try {
        const p = await store.insert('projects', { title: f.title.value.trim(), client_name: f.client_name.value.trim(), client_email: f.client_email.value.trim().toLowerCase(), service: f.service.value, due_date: f.due_date.value || null, consultant_id: f.consultant_id.value || null, lead_id: lead ? lead.id : null, status: 'Planning' });
        const lines = f.milestones.value.split('\n').map((s) => s.trim()).filter(Boolean);
        for (let i = 0; i < lines.length; i++) await store.insert('project_milestones', { project_id: p.id, title: lines[i], position: i, done: false });
        if (lead && lead.status !== 'In Progress') await store.update('leads', lead.id, { status: 'In Progress', activity: (lead.activity || []).concat([{ at: new Date().toISOString(), by: me.profile.full_name || me.user.email, text: 'Converted to project' }]) });
        toast('Project created'); closeDrawer(); go('projects');
      } catch (e) { err(e); }
    });
  }
  async function openProject(id) {
    const p = (cache.projects || []).find((x) => x.id === id);
    const [ms, pays, docs] = await Promise.all([store.list('project_milestones', { eq: { project_id: id }, order: ['position', 'asc'] }), store.list('payments', { eq: { project_id: id } }), store.list('documents', { eq: { project_id: id } })]);
    openDrawer(`<div class="drawer-head"><div><h2>${esc(p.title)}</h2><p class="muted small">${esc(p.client_name)} · ${esc(p.client_email || '')}</p></div>${closeBtn}</div>
      <div class="drawer-body">
        <div class="field-row"><div class="field"><label for="pp-st">Status</label><select id="pp-st">${opt(PROJECT_STATUSES, p.status)}</select></div><div class="field"><label for="pp-due">Due date</label><input id="pp-due" type="date" value="${esc(p.due_date || '')}"></div></div>
        <div class="field"><label for="pp-con">Consultant</label><select id="pp-con"><option value="">Unassigned</option>${opt(staff.map((s) => [s.id, s.full_name || s.email]), p.consultant_id)}</select></div>
        <h3>Milestones</h3>
        <ul class="milestones">${ms.map((m) => `<li class="${m.done ? 'done' : ''}"><input type="checkbox" data-ms="${esc(m.id)}" ${m.done ? 'checked' : ''} aria-label="${esc(m.title)}"><span>${esc(m.title)}</span></li>`).join('') || '<li class="muted">No milestones.</li>'}</ul>
        <h3>Documents</h3>
        ${docs.map((d) => `<div class="attach"><span>📄 ${esc(d.name)}</span>${store.live ? `<button class="btn btn-outline btn-sm" data-doc="${esc(d.path)}">Open</button>` : ''}</div>`).join('') || '<p class="muted small">No documents.</p>'}
        <label class="btn btn-outline btn-sm" style="margin-top:6px">Upload deliverable<input type="file" data-up class="sr-only" accept="${(C.upload.extensions || []).map((e) => '.' + e).join(',')}"></label>
        <h3>Payments</h3>
        ${pays.map((x) => `<div class="attach"><span>₹${esc(x.amount)} · ${esc(x.description || '')}</span>${badge(x.status)}</div>`).join('') || '<p class="muted small">No payments recorded.</p>'}
        <div class="field-row" style="margin-top:8px"><div class="field"><input class="input" id="pay-amt" type="number" min="0" placeholder="Amount (₹)" aria-label="Amount"></div><div class="field"><input class="input" id="pay-desc" placeholder="Description / invoice no." aria-label="Description"></div></div>
        <div class="toolbar"><select class="input" id="pay-st" aria-label="Payment status">${opt(['Pending', 'Paid', 'Refunded'])}</select><button class="btn btn-outline btn-sm" data-pay>Add payment</button></div>
        <h3>Notes</h3><textarea class="input" id="pp-notes" rows="4" aria-label="Project notes">${esc(p.notes || '')}</textarea>
      </div>
      <div class="drawer-foot"><button class="btn btn-primary" data-save>Save project</button></div>`);
    $$('[data-ms]', drawer).forEach((c) => c.addEventListener('change', async () => { try { await store.update('project_milestones', c.dataset.ms, { done: c.checked, done_at: c.checked ? new Date().toISOString() : null }); c.closest('li').classList.toggle('done', c.checked); cache.project_milestones = null; } catch (e) { err(e); } }));
    $$('[data-doc]', drawer).forEach((b) => b.addEventListener('click', async () => { try { window.open(await store.fileUrl(b.dataset.doc), '_blank', 'noopener'); } catch (e) { err(e); } }));
    $('[data-up]', drawer).addEventListener('change', async (e) => {
      const f = e.target.files[0]; if (!f) return;
      const ext = f.name.split('.').pop().toLowerCase();
      if (!C.upload.extensions.includes(ext) || f.size > C.upload.maxSizeMB * 1048576) return toast('File type or size not allowed');
      try { const up = await store.upload(f, `projects/${id}`); await store.insert('documents', { project_id: id, name: up.name, path: up.path, size: up.size, kind: 'deliverable', uploaded_by: me.user.id }); toast('Uploaded'); openProject(id); } catch (x) { err(x); }
    });
    $('[data-pay]', drawer).addEventListener('click', async () => {
      const amt = Number($('#pay-amt').value); if (!amt) return toast('Enter an amount');
      try { await store.insert('payments', { project_id: id, amount: amt, description: $('#pay-desc').value, status: $('#pay-st').value, currency: 'INR' }); openProject(id); } catch (e) { err(e); }
    });
    $('[data-save]', drawer).addEventListener('click', async () => {
      try { await store.update('projects', id, { status: $('#pp-st').value, due_date: $('#pp-due').value || null, consultant_id: $('#pp-con').value || null, notes: $('#pp-notes').value }); toast('Project saved'); closeDrawer(); go('projects'); } catch (e) { err(e); }
    });
  }

  /* ── Settings ─────────────────────────────────────────────── */
  async function settingsView() {
    const S = await store.getSettings();
    const inp = (k, label, type = 'text', hint = '') => `<div class="field"><label for="st-${k}">${label}</label><input id="st-${k}" name="${k}" type="${type}" value="${esc(S[k] || '')}">${hint ? `<p class="hint">${hint}</p>` : ''}</div>`;
    const soc = S.social || {};
    view.innerHTML = `<form class="settings-form" data-settings>
      <fieldset><legend>Business</legend>${inp('companyName', 'Company name')}
        <div class="field-row">${inp('phone', 'Phone', 'tel', 'Shown in footer and Call buttons. Leave empty to hide.')}${inp('whatsapp', 'WhatsApp number', 'tel', 'Digits with country code, e.g. 9198xxxxxxxx. Empty hides WhatsApp buttons.')}</div>
        <div class="field-row">${inp('email', 'Email', 'email')}${inp('businessHours', 'Business hours')}</div>
        ${inp('address', 'Address', 'text', 'Only a real address. Empty hides the location block.')}
        ${inp('mapEmbedUrl', 'Google Maps embed URL', 'url', 'From Google Maps → Share → Embed a map → copy the src URL (https://www.google.com/maps/embed?...)')}
        ${inp('whatsappMessage', 'WhatsApp pre-filled message')}</fieldset>
      <fieldset><legend>Social links</legend><p class="hint">Icons appear in the footer only when a URL is set.</p>
        <div class="field-row">${['linkedin', 'instagram', 'facebook', 'youtube'].map((s) => `<div class="field"><label for="so-${s}">${s[0].toUpperCase() + s.slice(1)}</label><input id="so-${s}" name="social.${s}" type="url" value="${esc(soc[s] || '')}"></div>`).join('')}</div></fieldset>
      <fieldset><legend>Calls to action &amp; SEO</legend>${inp('ctaPrimary', 'Header CTA text')}${inp('seoDefaultDescription', 'Default meta description')}</fieldset>
      <fieldset><legend>Analytics &amp; verification</legend>
        <div class="field-row">${inp('gaId', 'Google Analytics 4 ID', 'text', 'e.g. G-XXXXXXXXXX. Loads only after visitor consent.')}${inp('metaPixelId', 'Meta Pixel ID')}</div>
        ${inp('turnstileSiteKey', 'Cloudflare Turnstile site key (optional CAPTCHA)')}
        <p class="hint">Search Console verification and logo changes are set in <code>src/config.mjs</code> because they must be in the page HTML at build time.</p></fieldset>
      <button class="btn btn-primary btn-lg" type="submit">Save settings</button>
      ${store.live ? '' : '<p class="hint">Demo mode: settings are saved in this browser only.</p>'}
    </form>`;
    $('[data-settings]').addEventListener('submit', async (e) => {
      e.preventDefault();
      const next = Object.assign({}, S, { social: Object.assign({}, soc) });
      $$('input', e.target).forEach((i) => { if (i.name.startsWith('social.')) next.social[i.name.slice(7)] = i.value.trim(); else next[i.name] = i.value.trim(); });
      if (next.whatsapp) next.whatsapp = digits(next.whatsapp);
      try { await store.saveSettings(next); window.MRH.settings = next; toast('Settings saved — live on the website now'); } catch (x) { err(x); }
    });
  }

  /* ── CSV export ───────────────────────────────────────────── */
  function csv(name, rows, cols) {
    const cell = (v) => { v = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
    const data = [cols.join(',')].concat(rows.map((r) => cols.map((c) => cell(c === 'assigned_to' ? staffName(r[c]) : r[c])).join(','))).join('\r\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + data], { type: 'text/csv;charset=utf-8' }));
    a.download = `${name}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  boot();
})();
