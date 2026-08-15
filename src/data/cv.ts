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
  officialSource: string;
  periodSource: string;
  rank: string;
  selectedCoursework: string;
  courseLabel: string;
  gradeLabel: string;
  researchFocus: string;
  resumeSource: string;
  editorialTranslationNote: string;
}

export const academicProfileCopyByLocale: Record<Locale, AcademicProfileCopy> = {
  zh: {
    eyebrow: '学术档案',
    title: '教育与学术基础',
    intro: '展示经现有材料核实且适合公开的学术信息与精选课程成绩；原始成绩单和身份标识仍不公开。',
    gpa: 'GPA',
    officialSource: '来源：官方成绩单',
    periodSource: '学习时间来源：本人简历',
    rank: '排名',
    selectedCoursework: '精选课程',
    courseLabel: '课程',
    gradeLabel: '成绩',
    researchFocus: '研究方向',
    resumeSource: '来源：本人简历',
    editorialTranslationNote: '',
  },
  en: {
    eyebrow: 'Academic Profile',
    title: 'Education and academic foundation',
    intro: 'Verified, publication-safe academic information and selected course grades are shown; original transcripts and personal identifiers remain private.',
    gpa: 'GPA',
    officialSource: 'Source: official transcript',
    periodSource: 'Study period source: owner-authored resume',
    rank: 'Rank',
    selectedCoursework: 'Selected coursework',
    courseLabel: 'Course',
    gradeLabel: 'Grade',
    researchFocus: 'Research focus',
    resumeSource: 'Source: owner-authored resume',
    editorialTranslationNote: 'Editorial translation: English course names translate the official Chinese transcript labels and are not school-issued English titles.',
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
      description: '量子计算方向简历将在内容得到核实后发布。',
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
      description: 'A dedicated Quantum Computing CV will be published after its contents are verified.',
      available: false,
    },
  ],
};
