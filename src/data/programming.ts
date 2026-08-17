export interface ProgrammingCollectionCopy {
  eyebrow: string;
  title: string;
  status: string;
  description: string;
  openLabel: string;
  closeLabel: string;
  itemsLabel: string;
  detailLabel: string;
  detail: {
    back: string;
    status: string;
    date: string;
    technologies: string;
    links: string;
    github: string;
  };
}

export const programmingByLocale: Record<'zh' | 'en', ProgrammingCollectionCopy> = {
  zh: {
    eyebrow: '软件 / 编程',
    title: '编程项目合集',
    status: 'GitHub Projects',
    description: '编程项目合集。点击展开查看每个项目的详情与 GitHub 仓库。',
    openLabel: '展开编程合集',
    closeLabel: '收起编程合集',
    itemsLabel: '编程项目',
    detailLabel: '查看详情',
    detail: {
      back: '返回项目页',
      status: '状态',
      date: '时间',
      technologies: '技术栈',
      links: '链接',
      github: 'GitHub',
    },
  },
  en: {
    eyebrow: 'Software / Programming',
    title: 'Programming Collection',
    status: 'GitHub Projects',
    description: 'A collection of programming projects. Expand to view each project\'s details and GitHub repository.',
    openLabel: 'Open programming collection',
    closeLabel: 'Close programming collection',
    itemsLabel: 'Programming projects',
    detailLabel: 'View details',
    detail: {
      back: 'Back to projects',
      status: 'Status',
      date: 'Date',
      technologies: 'Technologies',
      links: 'Links',
      github: 'GitHub',
    },
  },
};
