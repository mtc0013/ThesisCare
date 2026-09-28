// Resource Center articles. `body` is HTML; every <h2> becomes a table-of-contents entry.
// Replace `author` / `credentials` with the real reviewer once assigned.

export const categories = [
  'Research Methodology', 'Biostatistics', 'Thesis Guidance', 'Systematic Reviews', 'Medical Writing',
  'Publication', 'Research Ethics', 'SPSS', 'R Statistics', 'Reference Management',
];

const author = 'ThesisCare Editorial Team';
const credentials = 'Research methodology & biostatistics desk';

export const posts = [
  {
    slug: 'choosing-a-research-question-for-md-thesis',
    title: 'How to Choose a Research Question for an MD Thesis',
    category: 'Thesis Guidance',
    date: '2026-09-01',
    excerpt: 'A practical framework for turning a clinical interest into a focused, feasible and defensible thesis question.',
    body: `
<p>Your thesis question shapes the next two to three years of work. A good question is not the most ambitious one — it is the one you can answer well with the patients, time and resources you actually have.</p>
<h2>Start from a genuine clinical uncertainty</h2>
<p>Look at your daily work. Which decisions do consultants in your department make differently? Which outcomes are rarely audited? Questions that come from real practice are easier to justify and more likely to interest examiners and journals.</p>
<h2>Use the FINER criteria</h2>
<ul>
<li><strong>Feasible</strong> — adequate number of eligible patients within your data collection window, and the tests or tools are available.</li>
<li><strong>Interesting</strong> — to you, your guide and your specialty.</li>
<li><strong>Novel</strong> — confirms, extends or refutes earlier findings, or studies them in a different population.</li>
<li><strong>Ethical</strong> — acceptable to your Institutional Ethics Committee.</li>
<li><strong>Relevant</strong> — the answer could influence practice or future research.</li>
</ul>
<h2>Structure it with PICO</h2>
<p>Write the question in terms of <em>Population</em>, <em>Intervention</em> or exposure, <em>Comparison</em> and <em>Outcome</em>. For example: “In adults with community-acquired pneumonia (P), is a CURB-65 score ≥ 3 at admission (I) compared with a score &lt; 3 (C) associated with 30-day mortality (O)?” A PICO-structured question makes the design, sample size and analysis much easier to decide.</p>
<h2>Check the numbers early</h2>
<p>Before committing, check how many eligible patients your unit sees and do a rough sample size estimate. Many theses run into trouble because the required sample cannot be recruited in 12–18 months.</p>
<h2>Search the literature before you finalise</h2>
<p>Spend a few focused hours on PubMed. If your exact question has been answered repeatedly in similar populations, consider a different angle — a different outcome, subgroup or setting.</p>
<h2>Agree it with your guide</h2>
<p>Present two or three options with a one-paragraph justification for each. Your guide’s experience with feasibility and departmental priorities is invaluable.</p>`,
  },
  {
    slug: 'sample-size-calculation-in-clinical-research',
    title: 'Sample Size Calculation in Clinical Research',
    category: 'Biostatistics',
    date: '2026-08-25',
    excerpt: 'What you need before calculating sample size, the common formulas, and how to justify your assumptions.',
    body: `
<p>An adequately sized study is an ethical requirement: too few participants and a real effect may be missed; too many and participants are exposed to research without need.</p>
<h2>What you need before you start</h2>
<ul>
<li>The <strong>primary outcome</strong> and its type (proportion, mean, time-to-event).</li>
<li>The <strong>study design</strong> — cross-sectional, comparative, diagnostic, etc.</li>
<li>An <strong>expected value</strong> from published literature or a pilot study (prevalence, mean and SD, or expected difference).</li>
<li>The <strong>significance level</strong> (usually α = 0.05) and <strong>power</strong> (usually 80% or 90%).</li>
</ul>
<h2>Estimating a single proportion</h2>
<p>For a prevalence study, a common formula is <code>n = Z² × p × (1 − p) / d²</code>, where Z = 1.96 for 95% confidence, p is the expected prevalence and d is the absolute precision. With p = 0.30 and d = 0.05, n ≈ 323.</p>
<h2>Comparing two groups</h2>
<p>For comparing means or proportions between two groups, the calculation depends on the expected difference, variability, α and power. Software such as G*Power, OpenEpi, or R packages (<code>pwr</code>) is typically used, and the parameters should be reported.</p>
<h2>Allow for dropouts</h2>
<p>If you expect 10% loss to follow-up, divide the calculated n by 0.9. State this adjustment explicitly.</p>
<h2>Report it transparently</h2>
<p>Your protocol should state the formula or software, every input value, the source of those values, and the final number. Examiners and ethics committees look for justification, not just a number.</p>`,
  },
  {
    slug: 'cross-sectional-vs-cohort-studies',
    title: 'Cross-sectional vs Cohort Studies',
    category: 'Research Methodology',
    date: '2026-08-18',
    excerpt: 'How the two most common observational designs differ, what each can tell you, and how to choose between them.',
    body: `
<p>Both designs are observational — the researcher does not assign exposures — but they answer different questions.</p>
<h2>Cross-sectional studies</h2>
<p>Exposure and outcome are measured at the same point in time. They are well suited to estimating <strong>prevalence</strong> and exploring associations. They are relatively quick and inexpensive, which makes them common in postgraduate theses.</p>
<p>The key limitation: because exposure and outcome are measured together, you usually cannot establish which came first.</p>
<h2>Cohort studies</h2>
<p>Participants are classified by exposure and followed over time to see who develops the outcome. Cohorts can estimate <strong>incidence</strong>, <strong>relative risk</strong> and time-to-event outcomes, and establish temporal sequence.</p>
<p>Prospective cohorts need follow-up time and effort to minimise loss to follow-up. Retrospective cohorts use existing records and are faster, but depend on the quality of those records.</p>
<h2>Choosing between them</h2>
<ul>
<li>Want to know how common something is? <strong>Cross-sectional.</strong></li>
<li>Want to know whether an exposure predicts a future outcome? <strong>Cohort.</strong></li>
<li>Limited time for follow-up? A cross-sectional or retrospective cohort design may be more realistic.</li>
</ul>
<h2>Reporting guideline</h2>
<p>Both designs are reported using the STROBE statement. Reviewing the STROBE checklist while planning helps you collect everything you will need to report.</p>`,
  },
  {
    slug: 'how-to-structure-a-medical-research-protocol',
    title: 'How to Structure a Medical Research Protocol',
    category: 'Research Methodology',
    date: '2026-08-10',
    excerpt: 'The essential sections of a protocol or synopsis, and what reviewers look for in each.',
    body: `
<p>A protocol is the blueprint of your study. A clear protocol makes ethics review smoother and gives you a reference throughout data collection.</p>
<h2>Title and background</h2>
<p>The title should state the design, population and main variables. The background should briefly explain what is known, what is not, and why your study is needed.</p>
<h2>Research question and objectives</h2>
<p>State one primary objective and a small number of secondary objectives. Each objective should be measurable and linked to a specific analysis.</p>
<h2>Methods</h2>
<ul>
<li>Study design, setting and duration</li>
<li>Study population, inclusion and exclusion criteria</li>
<li>Sample size with justification, and sampling technique</li>
<li>Variables and operational definitions</li>
<li>Data collection procedures and tools (proforma / CRF)</li>
<li>Statistical analysis plan</li>
</ul>
<h2>Ethical considerations</h2>
<p>Describe informed consent, confidentiality, risk to participants and how data will be stored. Refer to applicable national guidelines, such as the ICMR National Ethical Guidelines.</p>
<h2>References and annexures</h2>
<p>Use a consistent reference style (commonly Vancouver). Attach the consent form, participant information sheet and data collection proforma.</p>
<h2>SPIRIT as a checklist</h2>
<p>For trials, the SPIRIT 2013 statement lists recommended protocol items. Many of its items are useful checks for observational protocols too.</p>`,
  },
  {
    slug: 'understanding-p-values-and-confidence-intervals',
    title: 'Understanding p-values and Confidence Intervals',
    category: 'Biostatistics',
    date: '2026-08-02',
    excerpt: 'What p-values and confidence intervals actually mean — and the common misinterpretations to avoid in your thesis.',
    body: `
<p>p-values and confidence intervals appear in almost every results section, yet they are among the most misunderstood concepts in medical research.</p>
<h2>What a p-value is</h2>
<p>The p-value is the probability of observing data at least as extreme as yours <em>if the null hypothesis were true</em>. It is not the probability that the null hypothesis is true, and it does not measure the size or importance of an effect.</p>
<h2>What a confidence interval adds</h2>
<p>A 95% confidence interval gives a range of values compatible with your data for the effect you estimated — a difference in means, an odds ratio, a risk ratio. It shows both the <strong>direction</strong> and the <strong>precision</strong> of the estimate.</p>
<h2>Common mistakes</h2>
<ul>
<li>Treating p = 0.049 and p = 0.051 as fundamentally different results.</li>
<li>Saying “no difference” when p &gt; 0.05 — the study may simply be underpowered.</li>
<li>Reporting only p-values without effect sizes and confidence intervals.</li>
<li>Equating statistical significance with clinical importance.</li>
</ul>
<h2>How to report</h2>
<p>Report the effect estimate, its 95% CI and the exact p-value, e.g. “OR 2.1 (95% CI 1.3–3.4), p = 0.003”. Then interpret the clinical meaning of the estimate, not only whether it crossed 0.05.</p>`,
  },
  {
    slug: 'how-to-search-pubmed-effectively',
    title: 'How to Search PubMed Effectively',
    category: 'Reference Management',
    date: '2026-07-26',
    excerpt: 'Use MeSH terms, Boolean operators, field tags and filters to find relevant papers faster.',
    body: `
<p>A few techniques can turn a frustrating PubMed search into a focused, reproducible one.</p>
<h2>Break your question into concepts</h2>
<p>Use PICO to identify two to four core concepts. You rarely need to search every element — the population and intervention or exposure are often enough to start.</p>
<h2>Combine MeSH and free-text terms</h2>
<p>MeSH (Medical Subject Headings) are controlled vocabulary terms assigned by indexers. Use the MeSH database to find the right heading, then also add free-text synonyms in title/abstract (<code>[tiab]</code>) to capture recent articles not yet indexed.</p>
<h2>Use Boolean operators correctly</h2>
<ul>
<li><strong>OR</strong> within a concept (synonyms) — broadens.</li>
<li><strong>AND</strong> between concepts — narrows.</li>
<li>Use parentheses: <code>("Diabetes Mellitus, Type 2"[Mesh] OR "type 2 diabetes"[tiab]) AND (metformin[tiab])</code></li>
</ul>
<h2>Apply filters thoughtfully</h2>
<p>Filters for article type, species, language and date are useful, but note which ones you apply. For systematic reviews, avoid restrictive filters without justification.</p>
<h2>Save and document</h2>
<p>Create a free NCBI account to save searches and set alerts. Record the exact search string, date and number of results — you will need these for your methods section.</p>`,
  },
  {
    slug: 'prisma-2020-practical-introduction',
    title: 'PRISMA 2020: A Practical Introduction',
    category: 'Systematic Reviews',
    date: '2026-07-18',
    excerpt: 'An overview of the PRISMA 2020 statement, the flow diagram and how to use the checklist while conducting a review.',
    body: `
<p>PRISMA 2020 (Preferred Reporting Items for Systematic reviews and Meta-Analyses) is a reporting guideline. It tells you <em>what to report</em>, not how to conduct a review — but using it from the start helps you collect what you will need.</p>
<h2>The 27-item checklist</h2>
<p>The checklist covers the title, abstract, introduction, methods, results, discussion and other information such as registration and funding. Several items have sub-items, such as reporting the full search strategy for all databases.</p>
<h2>The flow diagram</h2>
<p>The PRISMA flow diagram records records identified, duplicates removed, records screened and excluded, reports assessed for eligibility with reasons for exclusion, and studies included. Keep counts as you go — reconstructing them later is difficult.</p>
<h2>Register a protocol</h2>
<p>Registering on PROSPERO (for health-related reviews) before screening begins improves transparency and reduces duplication.</p>
<h2>Use it as a working tool</h2>
<p>Keep the checklist open during protocol writing, searching, screening and writing up. Completing it at the end often reveals gaps that are hard to fix.</p>
<h2>Related extensions</h2>
<p>Extensions exist for specific review types, such as PRISMA-ScR for scoping reviews and PRISMA-S for reporting literature searches.</p>`,
  },
  {
    slug: 'how-to-choose-a-journal-for-your-medical-manuscript',
    title: 'How to Choose a Journal for Your Medical Manuscript',
    category: 'Publication',
    date: '2026-07-10',
    excerpt: 'Match your manuscript to a journal’s scope, audience and article types — and avoid predatory journals.',
    body: `
<p>The right journal is one whose readers care about your findings and whose editors publish your type of article.</p>
<h2>Check the scope and recent issues</h2>
<p>Read the aims and scope, then browse the last year of published articles. If similar studies appear regularly, the journal is a reasonable fit.</p>
<h2>Confirm the article type</h2>
<p>Journals differ in whether they accept original articles, short communications, case reports or reviews, and in their word and reference limits.</p>
<h2>Verify indexing yourself</h2>
<p>If indexing matters to your institution, verify it directly in the relevant database (e.g. NLM Catalog for MEDLINE, Scopus Sources, Web of Science Master Journal List) rather than relying on the journal’s website.</p>
<h2>Watch for predatory journal warning signs</h2>
<ul>
<li>Unsolicited emails promising rapid publication</li>
<li>Unclear peer review process or unrealistic review timelines</li>
<li>Fees that are unclear or disclosed only after acceptance</li>
<li>Misleading claims about indexing or impact metrics</li>
</ul>
<p>Resources such as Think. Check. Submit. provide useful checklists.</p>
<h2>Consider costs and timelines</h2>
<p>Check article processing charges, typical time to first decision and whether the journal allows preprints.</p>`,
  },
  {
    slug: 'vancouver-referencing-common-mistakes',
    title: 'Vancouver Referencing: Common Mistakes',
    category: 'Medical Writing',
    date: '2026-07-02',
    excerpt: 'The Vancouver errors examiners and reviewers notice most — and how reference managers help you avoid them.',
    body: `
<p>Vancouver is the most widely used referencing style in medical theses and journals. Small inconsistencies add up and suggest a lack of care.</p>
<h2>Numbering out of order</h2>
<p>References are numbered in the order they are first cited in the text. Re-using a source uses its original number.</p>
<h2>Author list errors</h2>
<p>Author names are given as surname followed by initials without full stops (e.g. <em>Sharma RK</em>). Many journals list the first six authors followed by “et al.” — check your journal or university guideline.</p>
<h2>Inconsistent journal abbreviations</h2>
<p>Use NLM journal title abbreviations consistently (e.g. <em>N Engl J Med</em>, <em>Indian J Med Res</em>).</p>
<h2>Missing or wrong details</h2>
<p>Check year, volume, issue and page range. Include DOIs where your guideline requires them.</p>
<h2>Citing what you have not read</h2>
<p>Cite the original source you actually read. Copying a citation from another paper’s reference list can propagate errors.</p>
<h2>Use a reference manager</h2>
<p>Zotero or Mendeley with a Vancouver style file handles numbering and formatting automatically, and makes late edits far less painful.</p>`,
  },
  {
    slug: 'how-to-prepare-for-a-thesis-viva',
    title: 'How to Prepare for a Thesis Viva',
    category: 'Thesis Guidance',
    date: '2026-06-24',
    excerpt: 'A structured approach to preparing your presentation and answering methodology and statistics questions with confidence.',
    body: `
<p>The viva is a conversation about your work. Examiners want to know that you understand what you did, why you did it, and what it means.</p>
<h2>Know your thesis thoroughly</h2>
<p>Re-read your thesis end to end. Note any inconsistencies between chapters, tables and your abstract — examiners often find them.</p>
<h2>Prepare a clear presentation</h2>
<ul>
<li>Keep slides uncluttered: one message per slide.</li>
<li>Show key results as clear tables or graphs.</li>
<li>End with conclusions that match your objectives, limitations and recommendations.</li>
</ul>
<h2>Expect methodology and statistics questions</h2>
<p>Be ready to explain your design choice, sample size calculation, sampling method, why you chose each statistical test, and what your p-values and confidence intervals mean.</p>
<h2>Know your limitations</h2>
<p>Acknowledging limitations honestly — and explaining how they may affect your conclusions — is a sign of understanding, not weakness.</p>
<h2>Practise aloud</h2>
<p>A mock viva with a colleague or mentor helps you practise concise answers and reveals gaps while there is still time to address them.</p>
<h2>On the day</h2>
<p>Listen to the full question, take a moment before answering, and say so if you do not know something rather than guessing.</p>`,
  },
].map((p) => ({ author, credentials, ...p }));
