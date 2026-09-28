// Services — add a new object to this array and a detail page, nav entry,
// search entry, enquiry-form option and sitemap entry are generated automatically.

export const services = [
  {
    slug: 'research-methodology',
    name: 'Research Methodology Consulting',
    short: 'Research Methodology',
    icon: 'compass',
    summary:
      'Study design, research questions, objectives, variables, outcomes and research planning — shaped with you so your study is sound before it starts.',
    problem:
      'Most research difficulties begin long before data collection: a question that is too broad, objectives that do not match the design, or outcomes that cannot be measured reliably. Fixing these late is expensive. A short, structured methodology review early on saves months later.',
    helpWith: [
      'Framing a focused, answerable research question (PICO / PECO)',
      'Choosing an appropriate study design for your question and setting',
      'Writing primary and secondary objectives that match the design',
      'Defining variables, exposures, outcomes and confounders',
      'Operational definitions and measurement tools',
      'Feasibility review — time, sample, resources and ethics',
      'Bias, validity and limitation planning',
    ],
    deliverables: [
      'Methodology review notes with specific recommendations',
      'Refined research question and objectives',
      'Study design rationale you can explain and defend',
      'Variable and outcome definition table',
      'Research plan with milestones',
    ],
    whoFor: ['MBBS students starting a first project', 'MD/MS and DNB residents planning a thesis', 'Faculty designing departmental studies', 'Hospital research teams'],
    outputs: ['Variable definition table', 'Study design flow diagram', 'Annotated objectives with feedback'],
    faqs: [
      { q: 'Can you help if my topic is already approved?', a: 'Yes. We work within your approved topic and help you strengthen the design, objectives and measurement plan without changing what your institution has approved.' },
      { q: 'Will you choose the topic for me?', a: 'We help you evaluate and refine options based on your interest, specialty, feasibility and your guide’s input. The final choice remains yours and your guide’s.' },
    ],
    tags: ['study design', 'PICO', 'objectives', 'variables', 'research question'],
  },
  {
    slug: 'thesis-guidance',
    name: 'Thesis / Dissertation Guidance',
    short: 'Thesis Guidance',
    icon: 'book',
    summary:
      'Structured, milestone-based guidance through planning, literature review, methodology, analysis, interpretation, formatting and presentation — you stay the author.',
    problem:
      'A postgraduate thesis runs alongside clinical duties, exams and rotations. Many residents know their clinical subject well but have had little formal training in research methods, statistics or academic writing. Guidance at the right moments keeps the work on track and helps you understand every part of it.',
    helpWith: [
      'Breaking the thesis into realistic milestones and timelines',
      'Structuring the literature review and identifying key sources',
      'Reviewing methodology and data collection plans',
      'Statistical analysis and interpretation of results',
      'Feedback on your drafts — clarity, structure and scientific language',
      'Formatting to your university’s guidelines',
      'Preparing for submission and viva',
    ],
    deliverables: [
      'Personalised thesis roadmap with milestones',
      'Chapter-by-chapter review feedback on your drafts',
      'Statistical analysis output with plain-language explanation',
      'Formatting and reference consistency check',
      'Viva preparation session',
    ],
    whoFor: ['MD/MS students', 'DNB residents', 'MSc Nursing students', 'PhD scholars', 'Allied health postgraduates'],
    outputs: ['Thesis roadmap', 'Annotated draft with tracked feedback', 'Results tables with interpretation notes'],
    faqs: [
      { q: 'Do you write the thesis for me?', a: 'No. Our role is guidance, review, statistical support and editing. You remain the author of your thesis, and we help you understand and improve your own work. Please see our Academic Integrity Policy.' },
      { q: 'Can you work with my guide’s feedback?', a: 'Yes — we encourage it. Your guide’s and department’s requirements take priority, and we help you address their comments.' },
    ],
    tags: ['thesis', 'dissertation', 'MD thesis', 'MS thesis', 'DNB thesis', 'formatting'],
  },
  {
    slug: 'biostatistics',
    name: 'Biostatistics & Data Analysis',
    short: 'Biostatistics',
    icon: 'chart',
    summary:
      'Sample size, descriptive and inferential statistics, regression, survival and diagnostic test analysis in SPSS, R, STATA or Python — with interpretation you can explain.',
    problem:
      'Statistics is where many good studies stumble: the wrong test for the data type, unchecked assumptions, or results that are reported but not understood. Reviewers and examiners notice. Professional analysis — explained clearly — lets you present your findings with confidence.',
    helpWith: [
      'Sample size and power calculation',
      'Data cleaning, coding and variable preparation',
      'Descriptive statistics and baseline tables',
      'Inferential statistics — t-tests, ANOVA, chi-square, non-parametric tests',
      'Correlation and regression — linear, logistic, Poisson, Cox',
      'Survival analysis — Kaplan–Meier curves and log-rank tests',
      'Diagnostic test analysis — sensitivity, specificity, ROC/AUC',
      'Agreement and reliability — kappa, ICC, Bland–Altman',
      'Publication-quality tables and figures',
      'Interpretation of statistical results in plain language',
    ],
    deliverables: [
      'Statistical analysis plan (SAP) for your objectives',
      'Clean, documented analysis output (SPSS / R / STATA / Python)',
      'Formatted results tables and figures',
      'Interpretation notes for each analysis',
      'Explanation session so you can defend the analysis',
    ],
    whoFor: ['Residents analysing thesis data', 'Faculty preparing manuscripts', 'Researchers needing a second opinion on analysis', 'Clinical research teams'],
    outputs: ['Baseline characteristics table', 'Kaplan–Meier curve', 'ROC curve with AUC', 'Regression table with odds ratios and 95% CI'],
    tools: ['SPSS', 'R', 'STATA', 'Python'],
    faqs: [
      { q: 'Which software do you use?', a: 'SPSS, R, STATA and Python. If your institution or journal prefers a particular package, we use that one and can share the syntax or code.' },
      { q: 'Will you change my data to get significant results?', a: 'Never. We analyse the data you collect exactly as it is. Non-significant results are valid results, and we help you report and interpret them properly.' },
      { q: 'Can you calculate sample size before I start?', a: 'Yes. We need your primary outcome, expected effect size or prevalence from the literature, and your study design. We explain every assumption used.' },
    ],
    tags: ['SPSS', 'R', 'STATA', 'Python', 'sample size', 'regression', 'survival analysis', 'ROC', 'statistics'],
  },
  {
    slug: 'research-protocol',
    name: 'Research Protocol & Synopsis Support',
    short: 'Protocol & Synopsis',
    icon: 'clipboard',
    summary:
      'Research question, objectives, design, eligibility criteria, sample size, data collection and statistical analysis plans — structured for institutional and ethics committee review.',
    problem:
      'A synopsis or protocol is often the first formal document reviewed by your department and Institutional Ethics Committee (IEC). Unclear eligibility criteria, an unjustified sample size or a missing analysis plan are common reasons for revisions and delays.',
    helpWith: [
      'Research question and justification',
      'Aims and objectives',
      'Study design and setting',
      'Inclusion and exclusion criteria',
      'Sample size justification',
      'Data collection plan and case record form (CRF) structure',
      'Statistical analysis plan',
      'Ethics considerations and consent process outline',
      'References and protocol formatting',
    ],
    deliverables: [
      'Structured feedback on your protocol draft',
      'Sample size calculation with stated assumptions',
      'Statistical analysis plan section',
      'CRF / proforma structure review',
      'Formatting and reference check to your institution’s template',
    ],
    whoFor: ['First-year MD/MS and DNB residents', 'PhD scholars preparing a proposal', 'Faculty submitting to an IEC', 'Nursing and allied health postgraduates'],
    outputs: ['Protocol checklist review', 'Sample size calculation sheet', 'Draft CRF structure'],
    faqs: [
      { q: 'Do you help with ethics committee submissions?', a: 'We help you prepare a clear, complete protocol and review the documents your IEC asks for. Submission and approval remain with you and your institution.' },
    ],
    tags: ['synopsis', 'protocol', 'IEC', 'ethics', 'CRF', 'sample size'],
  },
  {
    slug: 'systematic-review',
    name: 'Systematic Review & Meta-analysis Support',
    short: 'Systematic Reviews',
    icon: 'layers',
    summary:
      'Question development, search strategy, PRISMA workflow, screening, data extraction, risk-of-bias assessment, meta-analysis and forest plots.',
    problem:
      'Systematic reviews look simple but are methodologically demanding. Reproducible searches, dual screening, transparent risk-of-bias assessment and appropriate pooling all need to be planned and documented. We help your team follow a recognised process and report it transparently.',
    helpWith: [
      'Research question development (PICO) and protocol planning',
      'Search strategy guidance across databases',
      'PRISMA 2020 workflow and flow diagram',
      'Screening methodology and tools (e.g. Rayyan)',
      'Data extraction framework',
      'Risk-of-bias assessment guidance (e.g. RoB 2, ROBINS-I, NOS)',
      'Meta-analysis — fixed / random effects, heterogeneity, subgroup analysis',
      'Forest and funnel plots',
      'Manuscript preparation support',
    ],
    deliverables: [
      'Review protocol outline (PROSPERO-ready structure)',
      'Documented search strategy',
      'Data extraction template',
      'Meta-analysis output with forest plots',
      'PRISMA flow diagram and reporting checklist review',
    ],
    whoFor: ['Faculty and research teams', 'Residents doing a review-based dissertation', 'PhD scholars', 'Independent researchers'],
    outputs: ['PRISMA flow diagram', 'Forest plot', 'Risk-of-bias summary figure'],
    faqs: [
      { q: 'Will my review be PRISMA-compliant?', a: 'We guide you through the PRISMA 2020 reporting items and review your manuscript against the checklist. Compliance depends on how the review is conducted and documented by the team, so we cannot certify it automatically.' },
    ],
    tags: ['systematic review', 'meta-analysis', 'PRISMA', 'forest plot', 'risk of bias'],
  },
  {
    slug: 'manuscript-support',
    name: 'Medical Manuscript Support',
    short: 'Manuscript Support',
    icon: 'file',
    summary:
      'Manuscript structure, academic language editing, scientific clarity, tables and figures, journal formatting, cover letters and response-to-reviewers support.',
    problem:
      'Good research can be rejected for avoidable reasons — unclear structure, inconsistent numbers between text and tables, or a discussion that overstates the findings. Careful manuscript support helps your work be read and judged on its science.',
    helpWith: [
      'Manuscript structure (IMRaD) and flow',
      'Academic language and scientific clarity',
      'Consistency between abstract, text, tables and figures',
      'Tables and figures to journal standards',
      'Reference formatting',
      'Journal-specific formatting',
      'Cover letter assistance',
      'Response-to-reviewers support',
    ],
    deliverables: [
      'Edited manuscript with tracked changes and comments',
      'Formatted tables and figures',
      'Journal formatting check',
      'Cover letter draft for your review',
      'Point-by-point response structure for reviewer comments',
    ],
    whoFor: ['Residents converting a thesis into a paper', 'Faculty and consultants', 'Researchers preparing a submission'],
    outputs: ['Tracked-changes manuscript', 'Reviewer response table'],
    faqs: [
      { q: 'Can you convert my thesis into a journal article?', a: 'Yes. We help you condense and restructure your own thesis into a manuscript that fits a target journal’s word limits and format.' },
    ],
    tags: ['manuscript', 'editing', 'IMRaD', 'cover letter', 'reviewers'],
  },
  {
    slug: 'publication-support',
    name: 'Journal Publication Support',
    short: 'Publication Support',
    icon: 'send',
    summary:
      'Journal selection, scope checking, formatting, submission preparation, cover letters, reviewer responses and revision support. We never guarantee acceptance.',
    problem:
      'Choosing an unsuitable journal wastes months, and predatory journals are a real risk. Understanding scope, indexing, article types and author guidelines before submission improves your chances of a fair review.',
    helpWith: [
      'Journal selection based on scope, article type and indexing',
      'Identifying predatory or questionable journals',
      'Author guideline and formatting check',
      'Submission file preparation',
      'Cover letter',
      'Reviewer response guidance',
      'Revision support',
    ],
    deliverables: [
      'Shortlist of suitable journals with rationale',
      'Submission-ready file checklist',
      'Cover letter draft',
      'Revision and response support',
    ],
    whoFor: ['Faculty', 'Residents and fellows', 'Independent researchers'],
    outputs: ['Journal shortlist comparison', 'Submission checklist'],
    faqs: [
      { q: 'Do you guarantee publication?', a: 'No. Acceptance decisions are made independently by journal editors and peer reviewers. No ethical service can guarantee publication. We help you prepare a strong, well-targeted submission.' },
      { q: 'Do you submit on my behalf?', a: 'Submission is done by the corresponding author. We help you prepare every file and understand each step of the submission system.' },
    ],
    tags: ['journal selection', 'publication', 'submission', 'predatory journals', 'revision'],
  },
  {
    slug: 'academic-editing',
    name: 'Academic Editing & Proofreading',
    short: 'Academic Editing',
    icon: 'edit',
    summary:
      'English language editing, grammar, scientific language, Vancouver / AMA / APA referencing, reference consistency and formatting.',
    problem:
      'Language issues distract examiners and reviewers from your science. Consistent terminology, correct abbreviations and accurate references signal careful work.',
    helpWith: [
      'English language and grammar',
      'Scientific and medical terminology',
      'Clarity, concision and flow',
      'Vancouver, AMA and APA referencing styles',
      'Reference and citation consistency',
      'Abbreviation and unit consistency',
      'Document formatting',
    ],
    deliverables: [
      'Edited document with tracked changes',
      'Comment notes on points needing your decision',
      'Reference style correction',
    ],
    whoFor: ['Anyone preparing a thesis, synopsis, manuscript or grant document'],
    outputs: ['Tracked-changes document', 'Reference list in target style'],
    faqs: [
      { q: 'Will editing change my meaning?', a: 'We edit for language and clarity, not content. Where a sentence is ambiguous we leave a comment for you to decide rather than guessing.' },
    ],
    tags: ['proofreading', 'editing', 'Vancouver', 'AMA', 'APA', 'grammar'],
  },
  {
    slug: 'viva-presentation',
    name: 'Research Presentation & Viva Support',
    short: 'Viva & Presentation',
    icon: 'present',
    summary:
      'Thesis and research presentations, poster preparation, viva preparation, mock viva, question banks and presentation design.',
    problem:
      'Presenting your research clearly — and answering questions about methods and statistics under pressure — is a skill. Practice with feedback makes a large difference.',
    helpWith: [
      'Thesis presentation structure',
      'Conference and departmental presentations',
      'Poster preparation',
      'Viva preparation and likely question areas',
      'Mock viva with feedback',
      'Methodology and statistics question bank',
      'Clean, professional slide design',
    ],
    deliverables: [
      'Presentation review and design feedback',
      'Personalised question bank for your study',
      'Mock viva session with feedback notes',
    ],
    whoFor: ['Postgraduates approaching their viva', 'Presenters at conferences', 'Faculty presenting departmental research'],
    outputs: ['Slide design review', 'Question bank', 'Scientific poster layout'],
    faqs: [
      { q: 'How long before my viva should I start?', a: 'Two to four weeks is usually comfortable, giving time for a presentation review and at least one mock viva.' },
    ],
    tags: ['viva', 'presentation', 'poster', 'mock viva', 'slides'],
  },
  {
    slug: 'literature-search',
    name: 'Literature Search & Reference Management',
    short: 'Literature Search',
    icon: 'search',
    summary:
      'PubMed, Google Scholar, Scopus, Web of Science and Embase (where available) searching, plus Zotero and Mendeley reference organisation.',
    problem:
      'A literature review is only as good as its search. Keyword-only searching misses relevant studies, and unmanaged references lead to citation errors that are tedious to fix at the end.',
    helpWith: [
      'PubMed searching with MeSH terms and filters',
      'Google Scholar, Scopus and Web of Science',
      'Embase where institutional access is available',
      'Building and documenting search strings',
      'Zotero and Mendeley setup and training',
      'Reference organisation and de-duplication',
    ],
    deliverables: [
      'Documented search strategy',
      'Organised reference library (Zotero / Mendeley)',
      'Short training session on managing references',
    ],
    whoFor: ['Anyone starting a literature review', 'Residents writing a review of literature chapter', 'Systematic review teams'],
    outputs: ['Search strategy table', 'Shared Zotero library'],
    faqs: [
      { q: 'Do you provide full-text articles?', a: 'We guide you to legitimate sources — open access, your institutional library and author requests. We do not distribute copyrighted papers.' },
    ],
    tags: ['PubMed', 'MeSH', 'Scopus', 'Zotero', 'Mendeley', 'literature review', 'references'],
  },
];

// Shared five-step process used on every service page.
export const process = [
  { title: 'Submit your requirement', text: 'Tell us about your study, topic, institution and current stage. Upload documents if you have them.' },
  { title: 'Free research consultation', text: 'A research coordinator reviews your requirement and discusses it with you.' },
  { title: 'Scope & research plan', text: 'We define the exact deliverables, timeline and responsibilities — in writing, before any work begins.' },
  { title: 'Expert support', text: 'Work progresses through structured milestones, with your review at each stage.' },
  { title: 'Final review', text: 'Deliverables are reviewed, explained and finalised with you.' },
];
