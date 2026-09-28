/* Consultation booking calendar. Slots are requests; staff confirm them in the admin dashboard. */
(function () {
  const cal = document.querySelector('[data-calendar]');
  const slotsEl = document.querySelector('[data-slots]');
  if (!cal) return;
  const dateIn = document.getElementById('b-date');
  const timeIn = document.getElementById('b-time');
  const CLOSED_DAYS = [0]; // Sunday
  const SLOTS = ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30'];
  const MAX_DAYS_AHEAD = 45;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const maxDate = new Date(today); maxDate.setDate(maxDate.getDate() + MAX_DAYS_AHEAD);
  let view = new Date(today.getFullYear(), today.getMonth(), 1);
  let selected = null;
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const fmt12 = (t) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`; };

  function render() {
    const y = view.getFullYear(), m = view.getMonth();
    const first = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const canPrev = view > new Date(today.getFullYear(), today.getMonth(), 1);
    const canNext = new Date(y, m + 1, 1) <= maxDate;
    let html = `<div class="cal-head"><button type="button" class="icon-btn" data-nav="-1" ${canPrev ? '' : 'disabled'} aria-label="Previous month">‹</button><span>${view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span><button type="button" class="icon-btn" data-nav="1" ${canNext ? '' : 'disabled'} aria-label="Next month">›</button></div><div class="cal-grid">`;
    html += ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => `<span class="cal-dow" aria-hidden="true">${d}</span>`).join('');
    for (let i = 0; i < first; i++) html += '<span></span>';
    for (let d = 1; d <= days; d++) {
      const dt = new Date(y, m, d);
      const off = dt <= today || dt > maxDate || CLOSED_DAYS.includes(dt.getDay());
      const cls = ['cal-day', selected && iso(dt) === iso(selected) ? 'is-selected' : '', iso(dt) === iso(today) ? 'is-today' : ''].join(' ');
      html += `<button type="button" class="${cls}" data-date="${iso(dt)}" ${off ? 'disabled' : ''} aria-label="${dt.toDateString()}">${d}</button>`;
    }
    cal.innerHTML = html + '</div>';
  }
  function renderSlots() {
    if (!selected) return;
    slotsEl.innerHTML = `<h3>${selected.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</h3><div class="slot-grid">${SLOTS.map((s) => `<button type="button" class="slot ${timeIn.value === s ? 'is-selected' : ''}" data-slot="${s}">${fmt12(s)}</button>`).join('')}</div>`;
  }
  cal.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav) { view = new Date(view.getFullYear(), view.getMonth() + Number(nav.dataset.nav), 1); render(); return; }
    const b = e.target.closest('[data-date]');
    if (b && !b.disabled) { selected = new Date(b.dataset.date + 'T00:00:00'); dateIn.value = b.dataset.date; timeIn.value = ''; render(); renderSlots(); }
  });
  slotsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-slot]');
    if (b) { timeIn.value = b.dataset.slot; renderSlots(); document.getElementById('b-date-err').textContent = ''; }
  });
  render();
})();
