/* Site-wide behaviour: navigation, search, settings, analytics, forms. */
(function () {
  const C = window.MRH_CONFIG || {};
  const store = window.MRH.store;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const base = C.basePath || '/';
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  let S = Object.assign({}, C.settings);

  /* ── Analytics (loads only after consent) ─────────────────── */
  const consentKey = 'mrh:cookie-consent';
  const getConsent = () => { try { return localStorage.getItem(consentKey); } catch (e) { return null; } };
  function track(event, params) {
    params = Object.assign({ page_path: location.pathname }, params || {});
    if (window.gtag) window.gtag('event', event, params);
    if (window.fbq) {
      const map = { enquiry_submit: 'Lead', booking_submit: 'Schedule', contact_submit: 'Contact', resource_download: 'Lead', quote_request: 'Lead' };
      window.fbq(map[event] ? 'track' : 'trackCustom', map[event] || event, params);
    }
    (window.dataLayer = window.dataLayer || []).push(Object.assign({ event }, params));
  }
  window.MRH.track = track;
  function loadAnalytics() {
    if (S.gaId && !window.gtag) {
      const s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(S.gaId); document.head.appendChild(s);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date()); window.gtag('config', S.gaId, { anonymize_ip: true });
    }
    if (S.metaPixelId && !window.fbq) {
      /* Meta Pixel base code */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      window.fbq('init', S.metaPixelId); window.fbq('track', 'PageView');
    }
    if (/\/services\//.test(location.pathname)) track('service_page_view', { service: location.pathname.split('/').filter(Boolean).pop() });
  }
  function initConsent() {
    const banner = $('#cookie-banner');
    const needed = S.gaId || S.metaPixelId;
    const c = getConsent();
    if (c === 'accept') loadAnalytics();
    else if (!c && needed && banner) banner.hidden = false;
    $$('[data-cookie]').forEach((b) => b.addEventListener('click', () => {
      try { localStorage.setItem(consentKey, b.dataset.cookie); } catch (e) {}
      banner.hidden = true;
      if (b.dataset.cookie === 'accept') loadAnalytics();
    }));
    $$('[data-cookie-prefs]').forEach((b) => b.addEventListener('click', () => { if (banner) banner.hidden = false; }));
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-track]');
    if (t) track(t.dataset.track, { label: (t.textContent || '').trim().slice(0, 60) });
  });

  /* ── Settings → page ──────────────────────────────────────── */
  const digits = (s) => String(s || '').replace(/\D/g, '');
  function waHref() {
    const n = digits(S.whatsapp);
    return n ? `https://wa.me/${n}?text=${encodeURIComponent(S.whatsappMessage || '')}` : '';
  }
  function applySettings() {
    $$('[data-setting]').forEach((el) => {
      const k = el.dataset.setting;
      let v = S[k];
      if (k === 'whatsappDisplay') v = S.whatsapp ? '+' + digits(S.whatsapp) : '';
      if (v) el.textContent = v;
    });
    $$('[data-setting-href]').forEach((el) => {
      const kind = el.dataset.settingHref;
      if (kind === 'tel' && S.phone) el.href = 'tel:' + S.phone.replace(/[^\d+]/g, '');
      if (kind === 'mailto' && S.email) el.href = 'mailto:' + S.email;
    });
    $$('[data-show-if]').forEach((el) => { el.hidden = !S[el.dataset.showIf]; });
    const wa = waHref();
    $$('[data-wa-link]').forEach((el) => { if (wa) { el.href = wa; el.target = '_blank'; el.rel = 'noopener'; el.hidden = false; } else el.hidden = true; });
    $$('[data-tel-link]').forEach((el) => { if (S.phone) { el.href = 'tel:' + S.phone.replace(/[^\d+]/g, ''); el.hidden = false; } else el.hidden = true; });
    $$('[data-social]').forEach((el) => { const u = (S.social || {})[el.dataset.social]; if (u) { el.href = u; el.hidden = false; } else el.hidden = true; });
    const map = $('[data-map]');
    if (map && S.mapEmbedUrl && /^https:\/\/(www\.)?google\.[a-z.]+\/maps\/embed/.test(S.mapEmbedUrl)) {
      map.innerHTML = `<iframe src="${esc(S.mapEmbedUrl)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Map"></iframe>`;
    }
    if (S.ctaPrimary) $$('[data-setting="ctaPrimary"]').forEach((el) => (el.textContent = S.ctaPrimary));
  }
  $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ── Header, menu ─────────────────────────────────────────── */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const mnav = $('#mobile-nav');
  const toggle = $('.menu-toggle');
  const setMenu = (open) => { if (!mnav) return; mnav.hidden = !open; toggle && toggle.setAttribute('aria-expanded', String(open)); document.body.style.overflow = open ? 'hidden' : ''; };
  toggle && toggle.addEventListener('click', () => setMenu(true));
  $$('[data-close-menu]').forEach((b) => b.addEventListener('click', () => setMenu(false)));
  mnav && mnav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });

  /* ── Search ───────────────────────────────────────────────── */
  let idx = null;
  const loadIndex = () => idx ? Promise.resolve(idx) : fetch(base + 'search-index.json').then((r) => r.json()).then((d) => (idx = d));
  function search(q) {
    const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    return idx.map((it) => {
      const t = it.t.toLowerCase(), d = (it.d || '').toLowerCase(), x = (it.x || '').toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (t.includes(term)) score += 10; else if (d.includes(term)) score += 4; else if (x.includes(term)) score += 1; else return null;
      }
      return { it, score };
    }).filter(Boolean).sort((a, b) => b.score - a.score).slice(0, 20).map((r) => r.it);
  }
  const hl = (s, q) => { let out = esc(s); q.split(/\s+/).filter((t) => t.length > 1).forEach((t) => { out = out.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return out; };
  const renderResults = (list, q) => list.length
    ? list.map((it) => `<a href="${base + it.u}"><span class="sr-kind">${esc(it.k)}</span><span class="sr-title">${hl(it.t, q)}</span><span class="sr-desc">${hl(it.d || '', q)}</span></a>`).join('')
    : `<p class="search-empty">No results for “${esc(q)}”. Try “statistics”, “thesis” or “PubMed” — or <a href="${base}enquire/">ask us directly</a>.</p>`;
  const overlay = $('#search-overlay');
  const input = $('#search-input');
  const live = $('#search-live');
  const openSearch = () => { overlay.hidden = false; input.focus(); loadIndex(); };
  const closeSearch = () => { overlay.hidden = true; };
  $$('[data-open-search]').forEach((b) => b.addEventListener('click', openSearch));
  $$('[data-close-search]').forEach((b) => b.addEventListener('click', closeSearch));
  overlay && overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (overlay && !overlay.hidden) closeSearch(); setMenu(false); closeModal(); }
    if ((e.key === '/' || (e.key === 'k' && (e.ctrlKey || e.metaKey))) && overlay && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); openSearch(); }
  });
  input && input.addEventListener('input', () => { const q = input.value.trim(); loadIndex().then(() => { live.innerHTML = q.length > 1 ? renderResults(search(q).slice(0, 8), q) : ''; }); });
  const spResults = $('#search-page-results');
  if (spResults) {
    const q = new URLSearchParams(location.search).get('q') || '';
    const box = $('#sp-q'); box.value = q;
    if (q) loadIndex().then(() => { const r = search(q); spResults.innerHTML = `<p class="muted">${r.length} result${r.length === 1 ? '' : 's'} for “${esc(q)}”</p><div class="search-results">${renderResults(r, q)}</div>`; });
  }

  /* ── Filters, tabs, TOC ───────────────────────────────────── */
  $$('[data-cat-filter]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-cat-filter]').forEach((x) => { x.classList.toggle('is-active', x === b); x.setAttribute('aria-selected', String(x === b)); });
    $$('#post-grid [data-cat]').forEach((c) => { c.hidden = b.dataset.catFilter && c.dataset.cat !== b.dataset.catFilter; });
  }));
  $$('[data-filter-target]').forEach((inp) => inp.addEventListener('input', () => {
    const q = inp.value.toLowerCase();
    $$(inp.dataset.filterTarget + ' > *').forEach((c) => { c.hidden = !c.textContent.toLowerCase().includes(q); });
  }));
  const tocLinks = $$('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) tocLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-20% 0px -70% 0px' });
    $$('.prose h2[id]').forEach((h) => io.observe(h));
  }

  /* ── Modal (resource downloads) ───────────────────────────── */
  const modal = $('#download-modal');
  let pendingHref = '';
  function closeModal() { if (modal && !modal.hidden) { modal.hidden = true; document.body.style.overflow = ''; } }
  $$('[data-download]').forEach((b) => b.addEventListener('click', () => {
    pendingHref = b.dataset.href;
    let done = false; try { done = localStorage.getItem('mrh:dl-ok') === '1'; } catch (e) {}
    if (done) { track('resource_download', { resource: b.dataset.download }); window.open(pendingHref, '_blank', 'noopener'); return; }
    $('[data-dl-title]', modal).textContent = b.dataset.title;
    $('input[name=resource]', modal).value = b.dataset.download;
    modal.hidden = false; document.body.style.overflow = 'hidden';
    $('input[name=name]', modal).focus();
  }));
  modal && modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('[data-close-modal]')) closeModal(); });

  /* ── Forms ────────────────────────────────────────────────── */
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const validPhone = (v) => /^\+?[\d\s\-()]{8,20}$/.test(v) && digits(v).length >= 10;
  function setErr(input, msg) {
    const f = input.closest('.field'); const e = f && f.querySelector('.field-error');
    if (f) f.classList.toggle('has-error', !!msg);
    if (e) e.textContent = msg || '';
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }
  function validateField(el) {
    const v = (el.value || '').trim();
    if (el.type === 'checkbox') return setErr(el, el.required && !el.checked ? 'Please tick this box to continue.' : '');
    if (el.required && !v) return setErr(el, 'This field is required.');
    if (v && el.type === 'email' && !EMAIL.test(v)) return setErr(el, 'Please enter a valid email address.');
    if (v && el.type === 'tel' && !validPhone(v)) return setErr(el, 'Please enter a valid mobile number with at least 10 digits.');
    if (el.name === 'full_name' || el.name === 'name') { if (v && v.length < 2) return setErr(el, 'Please enter your full name.'); }
    return setErr(el, '');
  }
  const validateAll = (scope) => {
    const els = $$('input, select, textarea', scope).filter((el) => !el.closest('.hp') && el.type !== 'hidden' && el.type !== 'file');
    const ok = els.map(validateField).every(Boolean);
    if (!ok) { const first = els.find((el) => el.getAttribute('aria-invalid') === 'true'); first && first.focus(); }
    return ok;
  };

  function fileHandler(form) {
    const inp = $('input[type=file]', form); if (!inp) return () => [];
    const list = $('[data-file-list]', form); const drop = inp.closest('.dropzone');
    const up = C.upload || { maxFiles: 5, maxSizeMB: 10, extensions: [] };
    let files = [];
    const render = () => { list.innerHTML = files.map((f, i) => `<li><span>${esc(f.name)}</span><small>${(f.size / 1048576).toFixed(1)} MB</small><button type="button" data-rm="${i}" aria-label="Remove ${esc(f.name)}">✕</button></li>`).join(''); };
    const add = (incoming) => {
      const errs = [];
      for (const f of incoming) {
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        if (!up.extensions.includes(ext)) { errs.push(`${f.name}: file type not allowed`); continue; }
        if (f.size > up.maxSizeMB * 1048576) { errs.push(`${f.name}: larger than ${up.maxSizeMB} MB`); continue; }
        if (files.length >= up.maxFiles) { errs.push(`Maximum ${up.maxFiles} files`); break; }
        files.push(f);
      }
      setErr(inp, errs.join(' · ')); render();
    };
    inp.addEventListener('change', () => { add(Array.from(inp.files)); inp.value = ''; });
    list.addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { files.splice(+b.dataset.rm, 1); render(); } });
    if (drop) {
      ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
      ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
      drop.addEventListener('drop', (e) => add(Array.from(e.dataTransfer.files)));
    }
    return () => files;
  }

  // Optional Cloudflare Turnstile (verify the token server-side — see README).
  function initCaptcha() {
    const slots = $$('[data-captcha]');
    if (!S.turnstileSiteKey || !slots.length) return;
    window.mrhTurnstile = () => slots.forEach((s) => window.turnstile.render(s, { sitekey: S.turnstileSiteKey }));
    const sc = document.createElement('script'); sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=mrhTurnstile'; sc.async = true; document.head.appendChild(sc);
  }
  const captchaToken = (form) => { const i = $('[name="cf-turnstile-response"]', form); return i ? i.value : null; };

  function spamCheck(form) {
    if ($('.hp input', form) && $('.hp input', form).value) return 'bot';
    const started = +($('input[name=_started]', form) || {}).value || 0;
    if (started && Date.now() - started < 2500) return 'fast';
    let last = 0; try { last = +localStorage.getItem('mrh:last-submit') || 0; } catch (e) {}
    if (Date.now() - last < 20000) return 'rate';
    if (S.turnstileSiteKey && !captchaToken(form)) return 'captcha';
    return '';
  }
  const spamMsg = { fast: 'Please take a moment to review your details, then submit again.', rate: 'You submitted a form a moment ago. Please wait a few seconds before trying again.', captcha: 'Please complete the verification check.' };

  function finish(form, rec) {
    try { localStorage.setItem('mrh:last-submit', String(Date.now())); } catch (e) {}
    Array.from(form.children).forEach((el) => { if (!el.classList.contains('form-success')) el.hidden = true; });
    const sb = $('.form-success', form);
    if (sb) {
      sb.hidden = false;
      const ref = $('[data-ref]', sb); if (ref && rec) ref.textContent = 'Reference: ' + String(rec.id).slice(0, 8).toUpperCase() + (store.live ? '' : ' · demo mode — saved in this browser only');
      sb.focus(); sb.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  function status(form, msg, isErr) { const s = $$('.form-status', form).pop(); if (s) { s.textContent = msg || ''; s.classList.toggle('error', !!isErr); } }
  const val = (form, n) => { const el = form.elements[n]; return el ? (el.value || '').trim() : ''; };
  const utm = () => { const p = new URLSearchParams(location.search); const o = {}; ['utm_source', 'utm_medium', 'utm_campaign'].forEach((k) => p.get(k) && (o[k] = p.get(k))); return o; };

  $$('form[data-form]').forEach((form) => {
    const started = $('input[name=_started]', form);
    const stamp = () => { if (started && !started.value) started.value = String(Date.now()); };
    form.addEventListener('focusin', stamp, { once: true });
    $$('input, select, textarea', form).forEach((el) => el.addEventListener('blur', () => { if (el.value || el.getAttribute('aria-invalid') === 'true') validateField(el); }));
    const kind = form.dataset.form;
    const getFiles = kind === 'enquiry' ? fileHandler(form) : () => [];

    if (kind === 'enquiry') {
      const steps = $$('fieldset[data-step]', form); const marks = $$('.form-steps li', form);
      const go = (n) => { steps.forEach((s, i) => (s.hidden = i !== n)); marks.forEach((m, i) => { m.classList.toggle('is-active', i === n); m.classList.toggle('is-done', i < n); }); const f = $('input, select, textarea', steps[n]); f && f.focus({ preventScroll: true }); };
      $('[data-next]', form).addEventListener('click', () => { stamp(); if (validateAll(steps[0])) { go(1); track('enquiry_step2', { source: form.dataset.source }); } });
      $('[data-prev]', form).addEventListener('click', () => go(0));
      // Prefill from URL (?service=...&type=quote&plan=...)
      const p = new URLSearchParams(location.search);
      if (p.get('service')) { const sel = form.elements.service; const o = Array.from(sel.options).find((x) => x.value === p.get('service')); if (o) sel.value = o.value; }
      if (p.get('type') === 'quote') { const t = $('.form-title', form); if (t) t.textContent = 'Request a Quote'; }
      if (p.get('plan')) { const m = form.elements.message; if (m && !m.value) m.value = `Quote request: ${p.get('plan')}\n`; }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault(); stamp();
      const scope = kind === 'enquiry' ? $('fieldset[data-step="2"]', form) : form;
      if (kind === 'booking' && !validateBooking(form)) return;
      if (!validateAll(scope)) return;
      const spam = spamCheck(form);
      if (spam === 'bot') { finish(form, null); return; }
      if (spam) { status(form, spamMsg[spam], true); return; }
      const btn = $('button[type=submit]', form); const label = btn.innerHTML;
      btn.disabled = true; btn.textContent = 'Sending…'; status(form, '');
      try {
        let rec;
        const meta = { page_url: location.pathname, utm: utm(), captcha_token: captchaToken(form) || undefined };
        if (kind === 'enquiry') {
          const id = store.uuid();
          const files = getFiles();
          const attachments = [];
          for (const f of files) { btn.textContent = `Uploading ${attachments.length + 1}/${files.length}…`; attachments.push(await store.upload(f, `enquiries/${id}`)); }
          const q = new URLSearchParams(location.search);
          rec = await store.insert('leads', {
            id, full_name: val(form, 'full_name'), phone: val(form, 'phone'), email: val(form, 'email').toLowerCase(),
            user_type: val(form, 'user_type'), service: val(form, 'service'), specialty: val(form, 'specialty'), institution: val(form, 'institution'),
            city: val(form, 'city'), research_stage: val(form, 'research_stage'), timeline: val(form, 'timeline'), message: val(form, 'message'),
            attachments, source: form.dataset.source, request_type: q.get('type') === 'quote' ? 'quote' : 'consultation', status: 'New', consent: true, meta,
          });
          track(q.get('type') === 'quote' ? 'quote_request' : 'enquiry_submit', { source: form.dataset.source, service: val(form, 'service') });
        } else if (kind === 'contact') {
          rec = await store.insert('contact_messages', { name: val(form, 'name'), email: val(form, 'email').toLowerCase(), phone: val(form, 'phone'), subject: val(form, 'subject'), message: val(form, 'message'), status: 'New', meta });
          track('contact_submit');
        } else if (kind === 'booking') {
          rec = await store.insert('appointments', { name: val(form, 'name'), email: val(form, 'email').toLowerCase(), phone: val(form, 'phone'), consultation_type: (form.querySelector('[name=consultation_type]:checked') || {}).value, preferred_date: val(form, 'preferred_date'), preferred_time: val(form, 'preferred_time'), mode: val(form, 'mode'), notes: val(form, 'notes'), status: 'Requested', meta });
          track('booking_submit', { type: rec.consultation_type });
        } else if (kind === 'download') {
          rec = await store.insert('resource_downloads', { name: val(form, 'name'), email: val(form, 'email').toLowerCase(), phone: val(form, 'phone'), role: val(form, 'role'), resource: val(form, 'resource'), meta });
          try { localStorage.setItem('mrh:dl-ok', '1'); localStorage.setItem('mrh:last-submit', String(Date.now() - 19000)); } catch (e2) {}
          track('resource_download', { resource: rec.resource });
          btn.disabled = false; btn.innerHTML = label; closeModal(); form.reset();
          window.open(pendingHref, '_blank', 'noopener') || (location.href = pendingHref);
          return;
        }
        finish(form, rec);
      } catch (err) {
        console.error(err);
        status(form, 'Sorry — something went wrong while sending. Please try again' + (S.whatsapp ? ' or message us on WhatsApp.' : ' in a moment.'), true);
        btn.disabled = false; btn.innerHTML = label;
      }
    });
  });

  function validateBooking(form) {
    const d = form.elements.preferred_date.value, t = form.elements.preferred_time.value;
    const e = $('#b-date-err');
    e.textContent = !d || !t ? 'Please choose a preferred date and time.' : '';
    if (!d || !t) { e.scrollIntoView({ behavior: 'smooth', block: 'center' }); return false; }
    return true;
  }

  /* ── Password reset (link from "Forgot password?" email) ──── */
  window.addEventListener('mrh:password-recovery', () => {
    const m = document.createElement('div');
    m.className = 'modal';
    m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = `<div class="modal-card"><form novalidate>
      <h2 class="form-title">Set a new password</h2>
      <p class="muted small">Choose a new password for your account (at least 8 characters).</p>
      <div class="field"><label for="np-1">New password</label><input id="np-1" type="password" autocomplete="new-password" minlength="8" required></div>
      <div class="field"><label for="np-2">Confirm new password</label><input id="np-2" type="password" autocomplete="new-password" minlength="8" required></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Save new password</button>
      <p class="form-status" role="status" aria-live="polite"></p></form></div>`;
    document.body.appendChild(m);
    const f = m.querySelector('form'); const st = m.querySelector('.form-status');
    m.querySelector('#np-1').focus();
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const a = m.querySelector('#np-1').value, b = m.querySelector('#np-2').value;
      st.classList.add('error');
      if (a.length < 8) { st.textContent = 'Use at least 8 characters.'; return; }
      if (a !== b) { st.textContent = 'The two passwords do not match.'; return; }
      try {
        await store.auth.updatePassword(a);
        st.classList.remove('error'); st.textContent = 'Password updated.';
        setTimeout(() => { m.remove(); history.replaceState(null, '', location.pathname); location.reload(); }, 1200);
      } catch (err) { st.textContent = err.message || 'Could not update the password. Please request a new reset link.'; }
    });
  });

  /* ── Boot ─────────────────────────────────────────────────── */
  applySettings();
  store.getSettings().then((s) => { S = s; window.MRH.settings = s; applySettings(); initConsent(); initCaptcha(); });
})();
