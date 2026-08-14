export const PROJECT_CATEGORIES = [
  'Integrated Circuits',
  'Robotics',
  'Embodied AI',
  'Quantum',
  'Software',
] as const;

export const PROJECT_FILTERS = ['All', ...PROJECT_CATEGORIES] as const;

export const PROJECT_SLUGS = ['spad', 'mobile-robot', 'quantum-hfss', 'lerobot'] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];
