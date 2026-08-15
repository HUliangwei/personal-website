import type { Locale } from '../i18n/types';
import type { CourseworkRecord, EducationRecord } from './education';

export const CORE_COURSE_IDS = {
  undergraduate: [
    'mathematical-methods-for-physics', 'computational-physics', 'c-programming',
    'quantum-mechanics', 'calculus', 'linear-algebra', 'electrodynamics',
    'digital-logic-circuits', 'digital-logic-lab', 'probability-and-statistics',
    'circuit-analysis',
  ],
  graduate: [
    'physical-electronics-logic-lab', 'computational-physics',
    'quantum-materials-and-devices', 'quantum-optics',
    'digital-signal-processing-ii', 'semiconductor-device-physics',
  ],
} as const;

export function selectCoreCoursework(record: EducationRecord): CourseworkRecord[] {
  return CORE_COURSE_IDS[record.id].map((courseId) => {
    const matches = record.coursework.filter(({ id }) => id === courseId);
    if (matches.length === 0) throw new Error(`Missing selected coursework ID: ${courseId}`);
    if (matches.length > 1) throw new Error(`Duplicate selected coursework ID: ${courseId}`);
    return matches[0];
  });
}

export interface CvTrack {
  id: 'integrated-circuits' | 'embodied-ai' | 'quantum-computing';
  title: string;
  description: string;
  pdf?: string;
  available: boolean;
}

export interface AcademicProfileCopy {
  eyebrow: string;
  title: string;
  intro: string;
  gpa: string;
  rank: string;
  selectedCoursework: string;
  courseLabel: string;
  gradeLabel: string;
  researchFocus: string;
}

export const academicProfileCopyByLocale: Record<Locale, AcademicProfileCopy> = {
  zh: {
    eyebrow: '学术档案',
    title: '教育与学术基础',
    intro: '本科与研究生阶段的学术背景、GPA、研究方向与核心课程成绩。',
    gpa: 'GPA',
    rank: '专业综合排名',
    selectedCoursework: '精选课程',
    courseLabel: '课程',
    gradeLabel: '成绩',
    researchFocus: '研究方向',
  },
  en: {
    eyebrow: 'Academic Profile',
    title: 'Education and academic foundation',
    intro: 'Academic background, GPA, research focus, and selected core course grades from my undergraduate and graduate studies.',
    gpa: 'GPA',
    rank: 'Comprehensive rank',
    selectedCoursework: 'Selected coursework',
    courseLabel: 'Course',
    gradeLabel: 'Grade',
    researchFocus: 'Research focus',
  },
};

export const cvTracksByLocale: Record<Locale, CvTrack[]> = {
  zh: [
    {
      id: 'integrated-circuits',
      title: '集成电路',
      description: '面向集成电路设计及相关工程工作的简历。',
      pdf: '/cv/liangwei-hu-ic-design.pdf',
      available: true,
    },
    {
      id: 'embodied-ai',
      title: '具身智能',
      description: '面向机器人、具身智能与 AI 系统工作的简历。',
      pdf: '/cv/liangwei-hu-embodied-ai.pdf',
      available: true,
    },
    {
      id: 'quantum-computing',
      title: '量子计算',
      description: '量子计算方向简历准备中。',
      available: false,
    },
  ],
  en: [
    {
      id: 'integrated-circuits',
      title: 'Integrated Circuits',
      description: 'A CV tailored to integrated-circuit design and related engineering work.',
      pdf: '/cv/liangwei-hu-ic-design.pdf',
      available: true,
    },
    {
      id: 'embodied-ai',
      title: 'Embodied AI',
      description: 'A CV tailored to robotics, embodied intelligence, and AI systems work.',
      pdf: '/cv/liangwei-hu-embodied-ai.pdf',
      available: true,
    },
    {
      id: 'quantum-computing',
      title: 'Quantum Computing',
      description: 'Quantum Computing CV in preparation.',
      available: false,
    },
  ],
};
