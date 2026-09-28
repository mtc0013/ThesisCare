// LOCAL SEO — location pages are generated ONLY for entries with `published: true`.
// Fill in real information before publishing. Never list institutions you do not
// actually work with. Leave fields empty rather than guessing.

export const locations = [
  'Hyderabad', 'Bangalore', 'Delhi', 'Mumbai', 'Pune', 'Chennai', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Chandigarh', 'Kochi', 'Bhopal', 'Indore', 'Nagpur', 'Bhubaneswar',
].map((city) => ({
  city,
  slug: city.toLowerCase(),
  published: false,
  intro: '',          // Real, specific description of how you serve this city
  officeAddress: '',  // Only if you actually have an office here
  meetingOptions: 'Online consultations by video call, phone and WhatsApp.',
  notes: [],          // Real, verifiable points only
}));
