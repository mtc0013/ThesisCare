// Supabase Edge Function: emails the admin about each new enquiry and sends
// the enquirer an automatic acknowledgement.
//
// Trigger: Database Webhook on INSERT into public.leads (and optionally
// public.appointments / public.contact_messages) → this function.
// Secrets (Dashboard → Edge Functions → Secrets):
//   RESEND_API_KEY   — from resend.com (or swap sendEmail() for any provider)
//   ADMIN_EMAIL      — where new-lead notifications go
//   FROM_EMAIL       — a verified sender, e.g. "ThesisCare <hello@yourdomain.in>"
//   BRAND_NAME       — e.g. ThesisCare
//   WEBHOOK_SECRET   — same value set as a custom header "x-webhook-secret" on the webhook
//   SITE_URL         — e.g. https://mtc0013.github.io/ThesisCare

const env = (k: string) => Deno.env.get(k) ?? '';
const esc = (s: unknown) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

async function sendEmail(to: string, subject: string, html: string, replyTo?: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env('FROM_EMAIL'), to: [to], subject, html, reply_to: replyTo }),
  });
  if (!r.ok) console.error('Email failed', r.status, await r.text());
}

Deno.serve(async (req) => {
  if (env('WEBHOOK_SECRET') && req.headers.get('x-webhook-secret') !== env('WEBHOOK_SECRET')) {
    return new Response('Unauthorized', { status: 401 });
  }
  const payload = await req.json();
  if (payload.type !== 'INSERT') return new Response('ignored');
  const r = payload.record ?? {};
  const brand = env('BRAND_NAME') || 'ThesisCare';
  const admin = env('SITE_URL') ? `${env('SITE_URL')}/admin/` : '';

  if (payload.table === 'leads') {
    const rows = [
      ['Name', r.full_name], ['Phone / WhatsApp', r.phone], ['Email', r.email], ['I am a', r.user_type],
      ['Specialty', r.specialty], ['Institution', r.institution], ['City', r.city], ['Stage', r.research_stage],
      ['Service', r.service], ['Timeline', r.timeline], ['Type', r.request_type], ['Files', (r.attachments ?? []).length],
    ];
    await sendEmail(
      env('ADMIN_EMAIL'),
      `New research enquiry — ${r.full_name} (${r.service || 'General'})`,
      `<h2>New research enquiry</h2><table cellpadding="6">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${esc(v)}</td></tr>`).join('')}</table>
       <p><b>Message</b><br>${esc(r.message).replace(/\n/g, '<br>')}</p>${admin ? `<p><a href="${admin}#leads">Open in admin dashboard</a></p>` : ''}`,
      r.email,
    );
    // Automated acknowledgement to the enquirer
    await sendEmail(
      r.email,
      `We received your research enquiry — ${brand}`,
      `<p>Dear ${esc(r.full_name)},</p>
       <p>Thank you for contacting ${esc(brand)}. We have received your research enquiry and will review your requirements shortly.</p>
       <p>A research coordinator will contact you to discuss your study, the support you need, and a transparent scope and quote.</p>
       <p>Warm regards,<br>${esc(brand)}</p>
       <p style="color:#888;font-size:12px">You are receiving this because you submitted an enquiry on our website.</p>`,
    );
  } else if (payload.table === 'appointments') {
    await sendEmail(env('ADMIN_EMAIL'), `Consultation request — ${r.name} (${r.preferred_date} ${r.preferred_time})`,
      `<p><b>${esc(r.consultation_type)}</b><br>${esc(r.name)} · ${esc(r.email)} · ${esc(r.phone)}<br>Preferred: ${esc(r.preferred_date)} ${esc(r.preferred_time)} IST (${esc(r.mode)})</p><p>${esc(r.notes)}</p>`, r.email);
  } else if (payload.table === 'contact_messages') {
    await sendEmail(env('ADMIN_EMAIL'), `Website message — ${r.name}`, `<p>${esc(r.name)} · ${esc(r.email)} · ${esc(r.phone)}</p><p><b>${esc(r.subject)}</b></p><p>${esc(r.message)}</p>`, r.email);
  }
  return new Response('ok');
});
