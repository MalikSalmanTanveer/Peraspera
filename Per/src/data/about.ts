export const ABOUT_MISSION = {
  title: 'Design and development should live in the same room.',
  paragraphs: [
    'Most teams we meet have the same headache: one vendor for the brand, another for the site, someone else for the product build. Timelines slip because nothing was planned together.',
    'Peraspera exists to cut that friction. We handle brand, UI/UX, websites, SaaS, and AI automation as one studio — so what you launch actually matches what you sold.',
  ],
} as const;

export const ABOUT_WHO_WE_WORK_WITH = [
  'Founders shipping a new product or full rebrand',
  'Agencies that need a dependable design + dev partner',
  'Operations teams replacing manual work with automation',
  'Marketing leads who need sites and assets turned around quickly',
] as const;

export const ABOUT_APPROACH = [
  {
    step: '01',
    title: 'Listen first',
    description:
      'We start with your goals, audience, and constraints — not a template deck. Scope and priorities get clear before pixels or code.',
  },
  {
    step: '02',
    title: 'Set direction',
    description:
      'Structure, visual language, and milestones are agreed upfront. Everyone knows what ships when.',
  },
  {
    step: '03',
    title: 'Design & build',
    description:
      'Brand, UI, web, product, and automation move in parallel where it makes sense. Feedback loops stay short.',
  },
  {
    step: '04',
    title: 'Hand off clean',
    description:
      'You get live builds, export-ready files, and documentation. Support stays available when you need to iterate.',
  },
] as const;

export const ABOUT_BELIEFS = [
  {
    title: 'One thread, not five vendors',
    description:
      'When brand, product, and ops work share the same team, decisions are faster and the output stays coherent.',
  },
  {
    title: 'You own the files',
    description:
      'Source files, editable assets, and deployment access are part of the deal — not held behind a retainer wall.',
  },
  {
    title: 'Fast, but not sloppy',
    description:
      'We move quickly on first delivery because scope is tight and communication is direct — not because corners get cut.',
  },
] as const;

/** @deprecated Use ABOUT_BELIEFS */
export const ABOUT_VALUES = ABOUT_BELIEFS;
