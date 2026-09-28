/* Client portal (MVP): projects & milestones, documents, consultations, invoices, messages/revision requests.
   Data visibility is enforced by Supabase RLS — clients only ever receive their own rows. */
(function () {
  const C = window.MRH_CONFIG || {};
  const store = window.MRH.store;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const app = $('#portal-app');
  const pview = $('#pview');
  const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—');
  const badge = (s) => `<span class="badge st-${String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${esc(s)}</span>`;
  const empty = (m) => `<div class="card empty"><p>${esc(m)}</p></div>`;
  let me = null;
  let signup = false;
  let data = {};

  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.hidden = false; clearTimeout(t._h); t._h = setTimeout(() => (t.hidden = true), 2600); }
  const show = (v) => $$('[data-view]', app).forEach((el) => (el.hidden = el.dataset.view !== v));
  const status = (m, bad = true) => { const s = $('[data-auth-form] .form-status', app); s.textContent = m; s.classList.toggle('error', bad); };

  async function boot() {
    $$('[data-demo-only]', app).forEach((el) => (el.hidden = store.live));
    $$('[data-live-only]', app).forEach((el) => (el.hidden = !store.live));
    me = await store.auth.current().catch(() => null);
    if (!me) return show('login');
    show('app');
    $('[data-user-name]').textContent = me.profile.full_name ? ', ' + me.profile.full_name.split(' ')[0] : '';
    await loadData();
    tab('projects');
  }

  const form = $('[data-auth-form]', app);
  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = form.email.value.trim(), pw = form.password.value;
    if (!email || pw.length < 8) return status('Enter your email and a password of at least 8 characters.');
    try {
      if (signup) { await store.auth.signUp(email, pw, {}); status('Check your email to confirm your account, then sign in.', false); }
      else { await store.auth.signIn(email, pw); boot(); }
    } catch (x) { status(x.message || 'Something went wrong'); }
  });
  const tgl = $('[data-toggle-signup]', app);
  tgl && tgl.addEventListener('click', () => { signup = !signup; $('button[type=submit]', form).textContent = signup ? 'Create account' : 'Sign in'; tgl.textContent = signup ? 'Already have an account? Sign in' : 'New client? Create an account'; form.password.autocomplete = signup ? 'new-password' : 'current-password'; });
  $('[data-reset]', app) && $('[data-reset]', app).addEventListener('click', async () => { try { await store.auth.reset(form.email.value.trim()); status('If the account exists, a reset link has been sent.', false); } catch (x) { status(x.message); } });
  $('[data-demo-enter]', app) && $('[data-demo-enter]', app).addEventListener('click', () => { store.auth.demoEnter('client'); boot(); });
  $$('[data-logout]', app).forEach((b) => b.addEventListener('click', async () => { await store.auth.signOut(); location.reload(); }));
  $$('[data-ptab]', app).forEach((b) => b.addEventListener('click', () => tab(b.dataset.ptab)));

  async function loadData() {
    if (!store.live) {
      // Demo: clearly-marked sample structure (not real client data).
      data = {
        projects: [{ id: 'p1', title: 'Sample project — Research Methodology Consultation', service: 'Research Methodology', status: 'In Progress', due_date: null }],
        project_milestones: ['Research question', 'Study design', 'Protocol', 'Sample size', 'Data analysis', 'Manuscript', 'Final review'].map((t, i) => ({ id: 'm' + i, project_id: 'p1', title: t, position: i, done: i < 2 })),
        documents: [], payments: [], appointments: [], project_messages: [],
      };
      return;
    }
    const tables = ['projects', 'project_milestones', 'documents', 'payments', 'appointments', 'project_messages'];
    const res = await Promise.all(tables.map((t) => store.list(t).catch(() => [])));
    tables.forEach((t, i) => (data[t] = res[i]));
  }

  function tab(t) {
    $$('[data-ptab]', app).forEach((b) => b.classList.toggle('is-active', b.dataset.ptab === t));
    ({ projects, documents, consultations, invoices, messages }[t])();
  }

  function projects() {
    if (!data.projects.length) { pview.innerHTML = empty('No active projects yet. Once your scope is agreed, your project and milestones will appear here.') + `<p class="center mt-2"><a class="btn btn-primary" href="${C.basePath}enquire/">Start a new enquiry</a></p>`; return; }
    pview.innerHTML = `<div class="grid grid-auto">${data.projects.map((p) => {
      const ms = data.project_milestones.filter((m) => m.project_id === p.id).sort((a, b) => a.position - b.position);
      const done = ms.filter((m) => m.done).length; const pct = ms.length ? Math.round((done / ms.length) * 100) : 0;
      return `<div class="card project-card">${store.live ? '' : '<span class="sample-badge" style="position:static;display:inline-block;margin-bottom:8px">Sample</span>'}<p class="muted small">${esc(p.service || '')}</p><h3>${esc(p.title)}</h3><p class="small">${badge(p.status)} · due ${fmtDate(p.due_date)}</p><div class="progress"><i style="width:${pct}%"></i></div><p class="small muted">${done} of ${ms.length} milestones complete</p><ul class="milestones">${ms.map((m) => `<li class="${m.done ? 'done' : ''}"><input type="checkbox" disabled ${m.done ? 'checked' : ''} aria-label="${esc(m.title)}"><span>${esc(m.title)}</span></li>`).join('')}</ul></div>`;
    }).join('')}</div>`;
  }

  function documents() {
    const docs = data.documents;
    const exts = (C.upload.extensions || []).map((e) => '.' + e).join(',');
    pview.innerHTML = `<div class="card panel"><h2>Upload a document</h2><p class="muted small">PDF, DOCX, XLSX, CSV, PPTX · up to ${C.upload.maxSizeMB} MB. Please remove patient identifiers.</p>
      <div class="toolbar"><select class="input" id="doc-p" aria-label="Project">${data.projects.map((p) => `<option value="${esc(p.id)}">${esc(p.title)}</option>`).join('')}</select><label class="btn btn-primary btn-sm">Choose file<input type="file" id="doc-f" class="sr-only" accept="${exts}" ${store.live && data.projects.length ? '' : 'disabled'}></label></div>
      ${store.live ? '' : '<p class="hint">Uploads are available once the backend is connected.</p>'}</div>
      ${docs.length ? `<div class="card panel"><h2>Your documents</h2>${docs.map((d) => `<div class="attach"><span>📄 ${esc(d.name)}</span><small class="muted">${esc(d.kind || '')} · ${fmtDate(d.created_at)}</small><button class="btn btn-outline btn-sm" data-open="${esc(d.path)}">Download</button></div>`).join('')}</div>` : empty('No documents yet. Deliverables shared by your consultant will appear here.')}`;
    $$('[data-open]', pview).forEach((b) => b.addEventListener('click', async () => { try { window.open(await store.fileUrl(b.dataset.open), '_blank', 'noopener'); } catch (e) { toast(e.message); } }));
    const f = $('#doc-f');
    f && f.addEventListener('change', async () => {
      const file = f.files[0]; if (!file) return;
      const ext = file.name.split('.').pop().toLowerCase();
      if (!C.upload.extensions.includes(ext) || file.size > C.upload.maxSizeMB * 1048576) return toast('File type or size not allowed');
      try { const pid = $('#doc-p').value; const up = await store.upload(file, `projects/${pid}`); await store.insert('documents', { project_id: pid, name: up.name, path: up.path, size: up.size, kind: 'client upload', uploaded_by: me.user.id }); toast('Uploaded'); await loadData(); documents(); } catch (e) { toast(e.message); }
    });
  }

  function consultations() {
    const a = data.appointments;
    pview.innerHTML = (a.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Type</th><th>Preferred slot</th><th>Status</th></tr></thead><tbody>${a.map((x) => `<tr><td data-label="Type">${esc(x.consultation_type)}</td><td data-label="Slot">${fmtDate(x.preferred_date)} · ${esc(x.preferred_time)}</td><td data-label="Status">${badge(x.status)}</td></tr>`).join('')}</tbody></table></div>` : empty('No consultations yet.')) + `<p class="center mt-2"><a class="btn btn-primary" href="${C.basePath}book-consultation/">Book a consultation</a></p>`;
  }

  function invoices() {
    const p = data.payments;
    pview.innerHTML = p.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Description</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>${p.map((x) => `<tr><td data-label="Description">${esc(x.description || 'Payment')}</td><td data-label="Amount">₹${esc(x.amount)}</td><td data-label="Status">${badge(x.status)}</td><td data-label="Date">${fmtDate(x.created_at)}</td></tr>`).join('')}</tbody></table></div>` : empty('No invoices yet. Invoices linked to your project will appear here.');
  }

  function messages() {
    const m = data.project_messages;
    pview.innerHTML = `<div class="card panel"><h2>Message your consultant / request a revision</h2>
      <form data-msg><div class="field-row"><div class="field"><label for="pm-p">Project</label><select id="pm-p" name="project_id">${data.projects.map((p) => `<option value="${esc(p.id)}">${esc(p.title)}</option>`).join('')}</select></div>
      <div class="field"><label for="pm-k">Type</label><select id="pm-k" name="kind"><option>Message</option><option>Revision request</option></select></div></div>
      <div class="field"><label for="pm-b">Message</label><textarea id="pm-b" name="body" rows="4" required maxlength="3000"></textarea></div>
      <button class="btn btn-primary" ${store.live && data.projects.length ? '' : 'disabled'}>Send</button>${store.live ? '' : '<p class="hint">Messaging is available once the backend is connected.</p>'}</form></div>
      ${m.length ? `<div class="card panel"><h2>History</h2><ul class="activity">${m.map((x) => `<li><strong>${esc(x.kind)}</strong> — ${esc(x.body)}<time>${fmtDate(x.created_at)} · ${esc(x.author_role || '')}</time></li>`).join('')}</ul></div>` : ''}`;
    const f = $('[data-msg]');
    f.addEventListener('submit', async (e) => {
      e.preventDefault(); if (!f.body.value.trim()) return;
      try { await store.insert('project_messages', { project_id: f.project_id.value, kind: f.kind.value, body: f.body.value.trim(), author_id: me.user.id, author_role: 'client' }); toast('Sent'); await loadData(); messages(); } catch (x) { toast(x.message); }
    });
  }

  boot();
})();
