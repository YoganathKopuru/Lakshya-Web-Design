// Delivery stages and headline figures, shared by the homepage hero console
// and the delivery journey section so both always say the same thing.
export const journeyStages = [
  { name: 'Understand', detail: 'Requirements & discovery' },
  { name: 'Plan', detail: 'Strategy & roadmap' },
  { name: 'Design', detail: 'Experience & prototypes' },
  { name: 'Build', detail: 'Engineering & integration' },
  { name: 'Test', detail: 'Quality & assurance' },
  { name: 'Deploy', detail: 'Launch & adoption' },
  { name: 'Support', detail: 'Maintain & improve' },
] as const;

export const companyFigures = [
  ['2015', 'Established'],
  ['10+', 'Years of experience'],
  ['350+', 'Projects worldwide'],
  ['99%', 'Client satisfaction'],
] as const;
