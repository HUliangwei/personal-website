import type { Locale } from '../i18n/types';

export interface ContactRecord {
  id: 'email' | 'phone';
  label: string;
  value: string;
  href: string;
  source: 'User-authorized';
}

export interface SchoolJourneyRecord {
  id: 'primary-school' | 'middle-school' | 'high-school' | 'undergraduate' | 'graduate';
  name: string;
  period?: string;
  periodSource?: 'Verified Resume';
  source: 'User-provided';
}

export interface EducationSummary {
  undergraduate: string;
  graduate: string;
}

export interface PublicProfile {
  name: string;
  educationSummary: EducationSummary;
  contacts: ContactRecord[];
  interests: string[];
  games: string[];
  personalFactsSource: 'User-provided';
  schoolJourney: SchoolJourneyRecord[];
}

const contactValues = {
  email: { value: '3036064607@qq.com', href: 'mailto:3036064607@qq.com' },
  phone: { value: '+86 187 9229 3249', href: 'tel:+8618792293249' },
} as const;

export const profileByLocale: Record<Locale, PublicProfile> = {
  zh: {
    name: '胡良玮',
    educationSummary: {
      undergraduate: '武汉大学物理学本科',
      graduate: '中国科学技术大学量子科学与技术硕士研究生',
    },
    contacts: [
      { id: 'email', label: '邮箱', ...contactValues.email, source: 'User-authorized' },
      { id: 'phone', label: '电话', ...contactValues.phone, source: 'User-authorized' },
    ],
    interests: ['足球', '篮球', '羽毛球', 'KTV', '麻将', '游戏'],
    games: ['骑马与砍杀', '维多利亚', '无畏契约'],
    personalFactsSource: 'User-provided',
    schoolJourney: [
      { id: 'primary-school', name: '宣城市第三小学', source: 'User-provided' },
      { id: 'middle-school', name: '宣城市第十二中学', source: 'User-provided' },
      { id: 'high-school', name: '宣城中学', source: 'User-provided' },
      { id: 'undergraduate', name: '武汉大学', period: '2020.09 - 2024.06', periodSource: 'Verified Resume', source: 'User-provided' },
      { id: 'graduate', name: '中国科学技术大学', period: '2024.09 - 2027.06（预计）', periodSource: 'Verified Resume', source: 'User-provided' },
    ],
  },
  en: {
    name: 'Liangwei Hu',
    educationSummary: {
      undergraduate: 'BSc in Physics at Wuhan University',
      graduate: "Master's student in Quantum Science and Technology at the University of Science and Technology of China",
    },
    contacts: [
      { id: 'email', label: 'Email', ...contactValues.email, source: 'User-authorized' },
      { id: 'phone', label: 'Phone', ...contactValues.phone, source: 'User-authorized' },
    ],
    interests: ['Football', 'Basketball', 'Badminton', 'Karaoke', 'Mahjong', 'Gaming'],
    games: ['Mount & Blade', 'Victoria', 'VALORANT'],
    personalFactsSource: 'User-provided',
    schoolJourney: [
      { id: 'primary-school', name: 'Xuancheng No. 3 Primary School', source: 'User-provided' },
      { id: 'middle-school', name: 'Xuancheng No. 12 Middle School', source: 'User-provided' },
      { id: 'high-school', name: 'Xuancheng High School', source: 'User-provided' },
      { id: 'undergraduate', name: 'Wuhan University', period: 'Sep 2020 - Jun 2024', periodSource: 'Verified Resume', source: 'User-provided' },
      {
        id: 'graduate',
        name: 'University of Science and Technology of China',
        period: 'Sep 2024 - Jun 2027 (expected)',
        periodSource: 'Verified Resume',
        source: 'User-provided',
      },
    ],
  },
};
