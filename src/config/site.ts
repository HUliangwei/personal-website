export const SITE = {
  name: 'Liangwei Hu',
  description: 'A personal research and engineering portfolio.',
  url: 'https://personal-website.huliangwei020311.workers.dev',
  github: 'https://github.com/HUliangwei/personal-website',
} as const;

export const NAVIGATION = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/cv', label: 'CV' },
] as const;
