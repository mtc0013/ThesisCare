/* Data layer. Uses Supabase when configured, otherwise a browser-only demo store.
   Every page talks to MRH.store — never directly to a backend. */
(function () {
  const C = window.MRH_CONFIG || {};
  const live = !!(C.supabaseUrl && C.supabaseAnonKey);
  const SDK = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  const BUCKET = 'research-files';
  let client = null;

  const uuid = () =>
    (window.crypto && crypto.randomUUID) ? crypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === 'x' ? r : (r & 3) | 8).toString(16); });

  function loadSdk() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = SDK; s.onload = res; s.onerror = () => rej(new Error('Could not load Supabase SDK')); document.head.appendChild(s); });
  }
  const ready = live
    ? loadSdk().then(() => {
        client = window.supabase.createClient(C.supabaseUrl, C.supabaseAnonKey, { auth: { persistSession: true } });
        // A password-reset email link signs the user in with this event; app.js then asks for a new password.
        client.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') window.dispatchEvent(new Event('mrh:password-recovery')); });
      })
    : Promise.resolve();

  // ── Demo store (localStorage) ──
  const ls = {
    get(k, d) { try { const v = localStorage.getItem('mrh:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mrh:' + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  };
  const ss = {
    get(k) { try { return JSON.parse(sessionStorage.getItem('mrh:' + k)); } catch (e) { return null; } },
    set(k, v) { try { v == null ? sessionStorage.removeItem('mrh:' + k) : sessionStorage.setItem('mrh:' + k, JSON.stringify(v)); } catch (e) {} },
  };
  function applyQuery(rows, q = {}) {
    let r = rows.slice();
    if (q.eq) for (const [k, v] of Object.entries(q.eq)) r = r.filter((x) => x[k] === v);
    const [col, dir] = q.order || ['created_at', 'desc'];
    r.sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'desc' ? -1 : 1));
    return r;
  }

  const store = {
    live,
    ready,
    uuid,
    get client() { return client; },

    async insert(table, row) {
      await ready;
      const rec = Object.assign({ id: uuid(), created_at: new Date().toISOString() }, row);
      if (live) {
        const { error } = await client.from(table).insert(rec); // no .select(): public roles can insert but not read
        if (error) throw error;
        return rec;
      }
      const rows = ls.get(table, []);
      rows.push(rec);
      if (!ls.set(table, rows)) throw new Error('Browser storage is unavailable');
      return rec;
    },

    async list(table, q = {}) {
      await ready;
      if (live) {
        let query = client.from(table).select(q.select || '*');
        if (q.eq) for (const [k, v] of Object.entries(q.eq)) query = query.eq(k, v);
        const [col, dir] = q.order || ['created_at', 'desc'];
        query = query.order(col, { ascending: dir !== 'desc' }).limit(q.limit || 1000);
        const { data, error } = await query;
        if (error) throw error;
        return data;
      }
      return applyQuery(ls.get(table, []), q);
    },

    async update(table, id, patch) {
      await ready;
      patch = Object.assign({}, patch, { updated_at: new Date().toISOString() });
      if (live) {
        const { error } = await client.from(table).update(patch).eq('id', id);
        if (error) throw error;
        return;
      }
      ls.set(table, ls.get(table, []).map((r) => (r.id === id ? Object.assign({}, r, patch) : r)));
    },

    async remove(table, id) {
      await ready;
      if (live) { const { error } = await client.from(table).delete().eq('id', id); if (error) throw error; return; }
      ls.set(table, ls.get(table, []).filter((r) => r.id !== id));
    },

    // Files: uploaded to a private bucket; only staff can create signed download links.
    async upload(file, folder) {
      await ready;
      const safe = file.name.replace(/[^\w.\-]+/g, '_').slice(-120);
      const path = `${folder}/${Date.now()}-${safe}`;
      if (live) {
        const { error } = await client.storage.from(BUCKET).upload(path, file, { upsert: false, contentType: file.type || undefined });
        if (error) throw error;
      }
      return { path, name: file.name, size: file.size, type: file.type };
    },
    async fileUrl(path) {
      await ready;
      if (!live) return null;
      const { data, error } = await client.storage.from(BUCKET).createSignedUrl(path, 300);
      if (error) throw error;
      return data.signedUrl;
    },

    // Runtime-editable site settings (Admin → Settings).
    async getSettings() {
      const base = Object.assign({}, C.settings || {});
      try {
        await ready;
        if (live) {
          const { data } = await client.from('site_settings').select('data').eq('id', 1).maybeSingle();
          if (data && data.data) return Object.assign(base, data.data);
          return base;
        }
      } catch (e) { return base; }
      return Object.assign(base, ls.get('settings', {}));
    },
    async saveSettings(obj) {
      await ready;
      if (live) {
        const { error } = await client.from('site_settings').upsert({ id: 1, data: obj, updated_at: new Date().toISOString() });
        if (error) throw error;
        return;
      }
      ls.set('settings', obj);
    },

    auth: {
      async signIn(email, password) {
        await ready;
        if (!live) throw new Error('Demo mode: use “Open demo”.');
        const { error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
      },
      async signUp(email, password, meta) {
        await ready;
        const { error } = await client.auth.signUp({ email, password, options: { data: meta || {} } });
        if (error) throw error;
      },
      async reset(email) {
        await ready;
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo: location.href });
        if (error) throw error;
      },
      async updatePassword(password) {
        await ready;
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
      },
      async signOut() { await ready; if (live) await client.auth.signOut(); ss.set('demo-auth', null); },
      demoEnter(role) { ss.set('demo-auth', { email: 'demo@example.test', role, full_name: 'Demo user' }); },
      async current() {
        await ready;
        if (!live) { const d = ss.get('demo-auth'); return d ? { user: { id: 'demo', email: d.email }, profile: { id: 'demo', role: d.role, full_name: d.full_name, email: d.email } } : null; }
        const { data } = await client.auth.getUser();
        if (!data || !data.user) return null;
        const { data: profile } = await client.from('profiles').select('*').eq('id', data.user.id).maybeSingle();
        return { user: data.user, profile: profile || { role: 'client' } };
      },
    },
  };
  window.MRH = window.MRH || {};
  window.MRH.store = store;
})();
