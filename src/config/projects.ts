export const PROJECT_CATEGORIES = [
  'Integrated Circuits',
  'Robotics',
  'Embodied AI',
  'Quantum',
  'Software',
] as const;

export const PROJECT_FILTERS = ['All', ...PROJECT_CATEGORIES] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];
