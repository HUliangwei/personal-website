export interface ProgrammingLink {
  label: string;
  url: string;
}

export interface ProgrammingProject {
  id: 'personal-website' | 'videoto3d';
  title: string;
  status: string;
  description: string;
  technologies: string[];
  links?: ProgrammingLink[];
}

export interface ProgrammingCollectionCopy {
  eyebrow: string;
  title: string;
  status: string;
  description: string;
  openLabel: string;
  closeLabel: string;
  itemsLabel: string;
  projects: ProgrammingProject[];
}

export const programmingByLocale: Record<'zh' | 'en', ProgrammingCollectionCopy> = {
  zh: {
    eyebrow: '软件 / 编程',
    title: '编程项目合集',
    status: 'GitHub Projects',
    description: '编程项目合集。点击展开查看 GitHub 项目。',
    openLabel: '展开编程合集',
    closeLabel: '收起编程合集',
    itemsLabel: '编程项目',
    projects: [
      {
        id: 'personal-website',
        title: 'Personal Website',
        status: '持续迭代',
        description: '双语静态个人技术作品集，使用 Astro、TypeScript、Tailwind CSS 与 Three.js 构建，并通过 Cloudflare Workers Static Assets 部署。',
        technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GitHub', 'Cloudflare'],
        links: [
          { label: 'GitHub', url: 'https://github.com/HUliangwei/personal-website' },
        ],
      },
      {
        id: 'videoto3d',
        title: 'Videoto3D',
        status: '已完成',
        description: '本地优先的视频到 3D 重建 Studio：从 FFmpeg 抽帧与 SAM2 主体分割出发，经过 COLMAP，相继支持 OpenMVS Mesh / GLB 与 Brush Gaussian Splat / PLY 两条重建路线。',
        technologies: ['Python', 'FFmpeg', 'SAM2', 'COLMAP', 'OpenMVS', 'Brush', 'Blender'],
        links: [
          { label: 'GitHub', url: 'https://github.com/HUliangwei/Videoto3D' },
        ],
      },
    ],
  },
  en: {
    eyebrow: 'Software / Programming',
    title: 'Programming Collection',
    status: 'GitHub Projects',
    description: 'A collection of programming projects. Expand to view the GitHub projects.',
    openLabel: 'Open programming collection',
    closeLabel: 'Close programming collection',
    itemsLabel: 'Programming projects',
    projects: [
      {
        id: 'personal-website',
        title: 'Personal Technical Portfolio',
        status: 'Actively Iterated',
        description: 'A bilingual static technical portfolio built with Astro, TypeScript, Tailwind CSS, and Three.js, deployed with Cloudflare Workers Static Assets.',
        technologies: ['Astro', 'TypeScript', 'Tailwind CSS', 'Three.js', 'GitHub', 'Cloudflare'],
        links: [
          { label: 'GitHub', url: 'https://github.com/HUliangwei/personal-website' },
        ],
      },
      {
        id: 'videoto3d',
        title: 'Videoto3D',
        status: 'Completed',
        description: 'A local-first video-to-3D reconstruction Studio using FFmpeg and SAM2 for input preparation, COLMAP for camera recovery, and dual OpenMVS Mesh / GLB and Brush Gaussian Splat / PLY routes.',
        technologies: ['Python', 'FFmpeg', 'SAM2', 'COLMAP', 'OpenMVS', 'Brush', 'Blender'],
        links: [
          { label: 'GitHub', url: 'https://github.com/HUliangwei/Videoto3D' },
        ],
      },
    ],
  },
};
