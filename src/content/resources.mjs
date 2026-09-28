// Downloadable checklists (lead magnets). Each is generated as a printable page
// at /resources/checklists/<slug>/ — visitors can print or "Save as PDF".

export const checklists = [
  {
    slug: 'thesis-planning-checklist',
    title: 'Medical Thesis Planning Checklist',
    blurb: 'Plan your postgraduate thesis from topic to submission.',
    sections: [
      ['Topic & question', ['Topic agreed with guide', 'Research question written in PICO format', 'Literature search completed for novelty', 'Feasibility checked — patient numbers and time']],
      ['Protocol & approvals', ['Objectives are measurable', 'Sample size calculated and justified', 'Protocol submitted to department', 'IEC approval obtained', 'CTRI registration (if applicable)']],
      ['Data collection', ['Proforma / CRF finalised and piloted', 'Consent forms in required languages', 'Data entry template created', 'Regular data backups scheduled']],
      ['Analysis & writing', ['Statistical analysis plan agreed', 'Data cleaned and coded', 'Results tables drafted', 'Chapters reviewed by guide', 'University formatting applied']],
      ['Submission', ['Plagiarism check completed', 'Certificates and declarations signed', 'Copies printed and bound as required', 'Viva preparation started']],
    ],
  },
  {
    slug: 'research-proposal-checklist',
    title: 'Research Proposal Checklist',
    blurb: 'Make sure your synopsis or proposal is complete before review.',
    sections: [
      ['Front matter', ['Informative title (design, population, variables)', 'Investigator and guide details']],
      ['Introduction', ['Background with recent references', 'Clear gap in knowledge', 'Rationale for the study']],
      ['Objectives', ['One primary objective', 'Secondary objectives linked to analyses', 'Hypothesis stated where relevant']],
      ['Methods', ['Design and setting', 'Inclusion and exclusion criteria', 'Sample size with assumptions', 'Sampling technique', 'Operational definitions', 'Data collection procedure', 'Statistical analysis plan']],
      ['Ethics & annexures', ['Consent process described', 'Confidentiality measures', 'Participant information sheet', 'Data collection proforma', 'References in required style']],
    ],
  },
  {
    slug: 'statistical-analysis-planning-checklist',
    title: 'Statistical Analysis Planning Checklist',
    blurb: 'Plan your analysis before collecting data.',
    sections: [
      ['Variables', ['Primary outcome identified', 'Each variable’s type defined (continuous, categorical, ordinal, time-to-event)', 'Units and coding decided']],
      ['Descriptive analysis', ['Summary measures chosen (mean/SD or median/IQR)', 'Baseline table layout drafted']],
      ['Inferential analysis', ['Test chosen for each objective', 'Assumptions to check listed (normality, independence)', 'Plan for missing data', 'Confounders to adjust for identified']],
      ['Reporting', ['Effect sizes with 95% CI planned', 'Significance level stated', 'Software and version recorded', 'Table and figure shells drafted']],
    ],
  },
  {
    slug: 'manuscript-submission-checklist',
    title: 'Medical Manuscript Submission Checklist',
    blurb: 'Final checks before you press submit.',
    sections: [
      ['Journal fit', ['Scope and article type confirmed', 'Indexing verified in the database itself', 'Fees and policies reviewed']],
      ['Manuscript', ['Author guidelines followed (word limits, headings)', 'Numbers consistent across abstract, text and tables', 'Relevant reporting guideline checklist completed (CONSORT, STROBE, PRISMA…)', 'References formatted in journal style']],
      ['Files & declarations', ['Title page with all authors and affiliations', 'Blinded manuscript (if required)', 'Tables and figures in required formats', 'Ethics approval and consent statements', 'Conflict of interest and funding statements', 'Author contributions', 'Cover letter']],
    ],
  },
  {
    slug: 'pubmed-search-strategy-guide',
    title: 'PubMed Search Strategy Guide',
    blurb: 'A step-by-step worksheet for building a reproducible search.',
    sections: [
      ['Plan', ['Question written in PICO', 'Two to four key concepts selected']],
      ['Terms', ['MeSH headings identified for each concept', 'Free-text synonyms listed ([tiab])', 'Spelling variants and abbreviations included']],
      ['Build', ['Synonyms combined with OR', 'Concepts combined with AND', 'Parentheses checked', 'Filters chosen and justified']],
      ['Document', ['Final search string saved', 'Date of search recorded', 'Number of results recorded', 'Results exported to reference manager']],
    ],
  },
  {
    slug: 'thesis-viva-preparation-checklist',
    title: 'Thesis Viva Preparation Checklist',
    blurb: 'Prepare your presentation and answers with confidence.',
    sections: [
      ['Presentation', ['Slides follow a clear structure', 'Key results as clear tables/graphs', 'Timed within the allotted duration', 'Backup copy on a pen drive and email']],
      ['Content mastery', ['Thesis re-read end to end', 'Rationale for design explained', 'Sample size calculation explained', 'Reason for each statistical test', 'Interpretation of p-values and CIs', 'Limitations and future scope']],
      ['Practice', ['At least one mock viva', 'Answers to likely questions practised aloud', 'Feedback incorporated']],
    ],
  },
];
