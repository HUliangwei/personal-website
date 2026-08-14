import type { ProjectSlug } from '../config/projects';

export const HOME_PROJECT_SLUGS = ['spad', 'mobile-robot', 'quantum-hfss', 'lerobot'] as const satisfies readonly ProjectSlug[];

interface HomeProjectCandidate {
  data: {
    slug: string;
    featured: boolean;
  };
}

export function selectHomeProjects<Project extends HomeProjectCandidate>(projects: readonly Project[]): Project[] {
  return projects
    .filter((project) => project.data.featured && HOME_PROJECT_SLUGS.includes(project.data.slug as ProjectSlug))
    .sort((left, right) =>
      HOME_PROJECT_SLUGS.indexOf(left.data.slug as ProjectSlug) - HOME_PROJECT_SLUGS.indexOf(right.data.slug as ProjectSlug));
}
