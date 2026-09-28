// Policy pages. {{brand}} is replaced with the brand name at build time.
// Text in [square brackets] must be completed before launch.
// These are starting templates — have them reviewed by a qualified legal professional.

export const legal = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    summary: 'How we collect, use and protect your personal information.',
    body: `
<h2>Who we are</h2>
<p>{{brand}} ("we", "us") is operated by [Legal entity name], [registered address]. For privacy questions, contact us using the details on our Contact page.</p>
<h2>Information we collect</h2>
<ul>
<li><strong>Information you give us</strong> — name, phone/WhatsApp number, email, role, course or specialty, institution, city, and details about your research requirement.</li>
<li><strong>Files you upload</strong> — documents such as protocols, drafts or datasets you choose to share.</li>
<li><strong>Booking and account information</strong> — preferred consultation times, and login details if you create a client account.</li>
<li><strong>Usage information</strong> — if you accept analytics cookies, anonymised information about how the site is used.</li>
</ul>
<h2>How we use your information</h2>
<ul>
<li>To respond to your enquiry and provide a consultation and quote</li>
<li>To deliver the services you engage us for</li>
<li>To send service-related communication (we do not send marketing without your consent)</li>
<li>To improve our website and services</li>
</ul>
<h2>Sharing</h2>
<p>We do not sell your personal information. We share it only with team members working on your project and with service providers who host our website, database and email, under confidentiality obligations. We may disclose information where required by law.</p>
<h2>Retention</h2>
<p>We keep enquiry information for [period] and project files for [period] after project completion unless you ask us to delete them sooner, subject to legal requirements.</p>
<h2>Your choices</h2>
<p>You can ask us to access, correct or delete your personal information, or withdraw consent to be contacted, by writing to us. We will respond within a reasonable time and in line with applicable Indian law, including the Digital Personal Data Protection Act, 2023 as applicable.</p>
<h2>Security</h2>
<p>We use access-controlled, encrypted-in-transit storage and limit access to authorised staff. No online system is completely secure; please avoid uploading directly identifiable patient data.</p>
<h2>Changes</h2>
<p>We will post any changes on this page with an updated date.</p>
<p><em>Last updated: [date]</em></p>`,
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    summary: 'The terms that apply when you use our website and services.',
    body: `
<h2>Nature of services</h2>
<p>{{brand}} provides research guidance, methodology consulting, biostatistics, editing, formatting, publication preparation and related academic support. Our services are intended to support your learning and your own research work.</p>
<h2>Your responsibilities</h2>
<ul>
<li>You are responsible for the originality, integrity and ethical conduct of your research, and for complying with your institution’s rules.</li>
<li>You confirm that data you share was collected with required approvals and consent, and that you have removed direct identifiers.</li>
<li>You will not use our services for any purpose described as unacceptable in our Academic Integrity Policy.</li>
</ul>
<h2>Scope, quotes and timelines</h2>
<p>Each engagement is defined by a written scope listing deliverables, timeline, responsibilities and fees. Work outside the agreed scope may require a revised quote. Timelines depend on timely inputs from you.</p>
<h2>No guaranteed outcomes</h2>
<p>We do not guarantee thesis approval, examination results, journal acceptance, indexing or any particular statistical result. These decisions are made independently by institutions, examiners and journals.</p>
<h2>Payments</h2>
<p>Payment terms are set out in your scope. Refunds are handled under our Refund Policy.</p>
<h2>Confidentiality and intellectual property</h2>
<p>Your research, data and documents remain yours. We keep them confidential and use them only to provide the agreed services.</p>
<h2>Limitation of liability</h2>
<p>To the extent permitted by law, our liability for any claim is limited to the fees paid for the specific service concerned.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of India, and courts at [city] shall have jurisdiction.</p>
<p><em>Last updated: [date]</em></p>`,
  },
  {
    slug: 'refund-policy',
    title: 'Refund Policy',
    summary: 'How cancellations and refunds are handled.',
    body: `
<h2>Free consultation</h2>
<p>The initial consultation is free, so no payment or refund applies.</p>
<h2>Before work begins</h2>
<p>If you cancel after paying but before work on your scope has started, you are eligible for a full refund, less any payment processing charges [confirm].</p>
<h2>After work begins</h2>
<p>For milestone-based projects, fees for milestones already completed and delivered are non-refundable. Fees for milestones not yet started are refundable. For work in progress, a partial refund is calculated in proportion to the work completed.</p>
<h2>Service concerns</h2>
<p>If a deliverable does not match the agreed scope, tell us within [number] days. We will first revise it at no cost; if we cannot resolve the issue, we will discuss a fair partial refund.</p>
<h2>Not grounds for refund</h2>
<p>Because outcomes depend on independent decisions by others, refunds are not linked to thesis approval, examination results or journal acceptance.</p>
<h2>How to request</h2>
<p>Contact us with your project reference. Approved refunds are processed to the original payment method within [number] working days.</p>
<p><em>Last updated: [date]</em></p>`,
  },
  {
    slug: 'data-handling-policy',
    title: 'Data Handling Policy',
    summary: 'How we store, access and dispose of research material you share.',
    body: `
<h2>Our commitment</h2>
<p>Research documents and datasets are often sensitive and unpublished. We handle them with the same care we would expect for our own work.</p>
<h2>Before you upload</h2>
<ul>
<li>Remove or code direct patient identifiers (names, hospital numbers, phone numbers, addresses).</li>
<li>Share only the files needed for the requested service.</li>
<li>Accepted formats: PDF, DOC/DOCX, XLS/XLSX, CSV and PPTX, up to 10 MB each.</li>
</ul>
<h2>Storage and access</h2>
<ul>
<li>Files are stored in private cloud storage. They are not publicly accessible.</li>
<li>Only authorised administrators and the consultants assigned to your project can open them, using time-limited links.</li>
<li>Data is transmitted over encrypted (HTTPS) connections.</li>
</ul>
<h2>Use</h2>
<p>We use your material only to provide the agreed services. We do not reuse, publish or share your data or findings.</p>
<h2>Retention and deletion</h2>
<p>Files are retained for [period] after project completion so we can answer follow-up questions, then deleted. You can request earlier deletion at any time.</p>
<h2>Confidentiality agreements</h2>
<p>We can sign a non-disclosure agreement on request.</p>
<p><em>Last updated: [date]</em></p>`,
  },
  {
    slug: 'cookie-policy',
    title: 'Cookie Policy',
    summary: 'The cookies and similar technologies used on this website.',
    body: `
<h2>Essential storage</h2>
<p>We use your browser’s local storage for essential functions such as remembering your cookie choice and keeping you signed in to the client portal or admin dashboard.</p>
<h2>Analytics and marketing cookies</h2>
<p>If enabled by us and <strong>only if you accept</strong>, we use Google Analytics and/or Meta Pixel to understand how visitors use the site and to measure enquiries. These are not loaded if you decline.</p>
<h2>Managing your choice</h2>
<p>You can change your choice at any time using the “Cookie preferences” link in the footer, or by clearing your browser storage.</p>
<p><em>Last updated: [date]</em></p>`,
  },
];
