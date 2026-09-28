import { icon } from './icons.mjs';
import { logo, url } from './layout.mjs';

const loginCard = (kind) => `
<div class="auth-wrap" data-view="login">
  <div class="card auth-card">
    ${logo('a' + kind)}
    <h1>${kind === 'admin' ? 'Staff sign in' : 'Client portal'}</h1>
    <p class="muted">${kind === 'admin' ? 'For administrators and consultants only.' : 'View your projects, milestones, documents and consultations.'}</p>
    <div class="demo-note" data-demo-only hidden>${icon('sparkle')}<div><strong>Demo mode</strong><p>No backend is connected yet, so data is stored only in this browser. Connect Supabase (see README) to enable secure logins.</p><button class="btn btn-primary btn-block" data-demo-enter>Open demo ${kind === 'admin' ? 'dashboard' : 'portal'}</button></div></div>
    <form data-auth-form novalidate data-live-only>
      <div class="field"><label for="${kind}-email">Email</label><input id="${kind}-email" name="email" type="email" autocomplete="username" required></div>
      <div class="field"><label for="${kind}-pw">Password</label><input id="${kind}-pw" name="password" type="password" autocomplete="${kind === 'portal' ? 'current-password' : 'current-password'}" required minlength="8"></div>
      <button class="btn btn-primary btn-lg btn-block" type="submit">Sign in</button>
      ${kind === 'portal' ? `<p class="small center mt-2"><button type="button" class="linklike" data-toggle-signup>New client? Create an account</button></p>` : ''}
      <p class="small center"><button type="button" class="linklike" data-reset>Forgot password?</button></p>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
    <p class="small center mt-2"><a href="${url('')}">← Back to website</a></p>
  </div>
</div>`;

export const adminShell = () => `
<div class="app" id="admin-app" data-app="admin">
  ${loginCard('admin')}
  <div class="app-shell" data-view="app" hidden>
    <aside class="app-side" id="app-side">
      ${logo('s')}
      <nav class="app-nav" aria-label="Dashboard">
        <button data-tab="overview" class="is-active">${icon('grid')}Overview</button>
        <button data-tab="leads">${icon('inbox')}Leads <span class="count" data-count="leads"></span></button>
        <button data-tab="appointments">${icon('calendar')}Bookings <span class="count" data-count="appointments"></span></button>
        <button data-tab="messages">${icon('mail')}Messages <span class="count" data-count="contact_messages"></span></button>
        <button data-tab="downloads">${icon('download')}Resource leads</button>
        <button data-tab="projects">${icon('folder')}Projects</button>
        <button data-tab="settings" data-admin-only>${icon('settings')}Settings</button>
      </nav>
      <div class="app-user"><span class="avatar sm">${icon('user')}</span><div><strong data-user-email></strong><small data-user-role></small></div><button class="icon-btn" data-logout aria-label="Sign out">${icon('logout')}</button></div>
    </aside>
    <section class="app-main">
      <header class="app-top">
        <button class="icon-btn side-toggle" aria-label="Menu">${icon('menu')}</button>
        <h1 data-view-title>Overview</h1>
        <span class="badge badge-demo" data-demo-only hidden>Demo mode — browser storage</span>
        <a class="btn btn-outline btn-sm" href="${url('')}" target="_blank">View site</a>
      </header>
      <div class="app-content" id="view"></div>
    </section>
  </div>
  <div class="drawer-backdrop" hidden></div>
  <aside class="drawer" id="drawer" hidden aria-modal="true" role="dialog"></aside>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
</div>`;

export const portalShell = () => `
<div class="app portal" id="portal-app" data-app="portal">
  ${loginCard('portal')}
  <div class="portal-shell container" data-view="app" hidden>
    <div class="portal-head">
      <div><p class="eyebrow">Client portal</p><h1>Welcome<span data-user-name></span></h1><p class="muted">Track your projects, milestones, documents and consultations.</p></div>
      <div class="portal-actions"><span class="badge badge-demo" data-demo-only hidden>Demo — sample structure</span><button class="btn btn-outline btn-sm" data-logout>${icon('logout')} Sign out</button></div>
    </div>
    <div class="tabs" role="tablist">
      <button class="tab is-active" data-ptab="projects">Projects</button>
      <button class="tab" data-ptab="documents">Documents</button>
      <button class="tab" data-ptab="consultations">Consultations</button>
      <button class="tab" data-ptab="invoices">Invoices</button>
      <button class="tab" data-ptab="messages">Messages &amp; revisions</button>
    </div>
    <div id="pview"></div>
  </div>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
</div>`;
