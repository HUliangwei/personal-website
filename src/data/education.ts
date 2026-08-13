import type { Locale } from '../i18n/types';

export type SourceClassification =
  | 'Official'
  | 'Verified Resume'
  | 'Verified Project'
  | 'Calculated'
  | 'TODO';

export interface GpaRecord {
  value: string;
  scale: string;
  source: 'Official';
  context: string;
}

export interface RankRecord {
  value: number;
  state: 'self-reported';
  source: 'Verified Resume';
  official: false;
  context: string;
}

export interface CourseworkRecord {
  id: string;
  label: string;
  grade: string;
  evidenceSource: 'Official';
  labelSource: 'Official Chinese' | 'Editorial Translation';
}

export interface ResearchFocusRecord {
  label: string;
  source: 'Verified Resume';
}

export interface EducationRecord {
  id: 'undergraduate' | 'graduate';
  institution: string;
  program: string;
  period: string;
  periodSource: 'Verified Resume';
  gpa: GpaRecord;
  rank: RankRecord | null;
  coursework: CourseworkRecord[];
  researchFocus?: ResearchFocusRecord;
}

const undergraduateCoursework = {
  zh: [
    ['mathematical-methods-for-physics', '数学物理方法', '96'],
    ['computational-physics', '计算物理', '96'],
    ['c-programming', 'C语言程序设计', '95'],
    ['quantum-mechanics', '量子力学', '95'],
    ['calculus', '微积分（上、下）', '94 / 84'],
    ['linear-algebra', '线性代数B', '94'],
    ['electrodynamics', '电动力学', '94'],
    ['digital-logic-circuits', '数字逻辑电路', '92'],
    ['digital-logic-lab', '数字逻辑电路实验', '91'],
    ['probability-and-statistics', '概率论与数理统计B', '92'],
    ['circuit-analysis', '电路分析', '90'],
  ],
  en: [
    ['mathematical-methods-for-physics', 'Mathematical Methods for Physics', '96'],
    ['computational-physics', 'Computational Physics', '96'],
    ['c-programming', 'C Programming', '95'],
    ['quantum-mechanics', 'Quantum Mechanics', '95'],
    ['calculus', 'Calculus I and II', '94 / 84'],
    ['linear-algebra', 'Linear Algebra B', '94'],
    ['electrodynamics', 'Electrodynamics', '94'],
    ['digital-logic-circuits', 'Digital Logic Circuits', '92'],
    ['digital-logic-lab', 'Digital Logic Circuits Laboratory', '91'],
    ['probability-and-statistics', 'Probability and Mathematical Statistics B', '92'],
    ['circuit-analysis', 'Circuit Analysis', '90'],
  ],
} as const;

const graduateCoursework = {
  zh: [
    ['programmable-logic-devices', '可编程逻辑器件原理及应用', '79'],
    ['physical-electronics-logic-lab', '物理电子学逻辑设计与仿真实验', '95'],
    ['computational-physics', '计算物理', '92'],
    ['digital-signal-processing-ii', '数字信号处理 II', '83'],
    ['semiconductor-device-physics', '半导体器件原理', '80'],
    ['quantum-materials-and-devices', '量子材料与器件', '88'],
    ['quantum-optics', '量子光学', '88'],
  ],
  en: [
    ['programmable-logic-devices', 'Principles and Applications of Programmable Logic Devices', '79'],
    ['physical-electronics-logic-lab', 'Physical Electronics Logic Design and Simulation Laboratory', '95'],
    ['computational-physics', 'Computational Physics', '92'],
    ['digital-signal-processing-ii', 'Digital Signal Processing II', '83'],
    ['semiconductor-device-physics', 'Principles of Semiconductor Devices', '80'],
    ['quantum-materials-and-devices', 'Quantum Materials and Devices', '88'],
    ['quantum-optics', 'Quantum Optics', '88'],
  ],
} as const;

const courses = (
  records: ReadonlyArray<readonly [string, string, string]>,
  labelSource: CourseworkRecord['labelSource'],
): CourseworkRecord[] =>
  records.map(([id, label, grade]) => ({ id, label, grade, evidenceSource: 'Official', labelSource }));

const rankByLocale: Record<Locale, RankRecord> = {
  zh: {
    value: 4,
    state: 'self-reported',
    source: 'Verified Resume',
    official: false,
    context: '排名 4 仅来自本人简历自述，官方成绩单未列排名。',
  },
  en: {
    value: 4,
    state: 'self-reported',
    source: 'Verified Resume',
    official: false,
    context: 'Rank 4 is self-reported in the resume; the official transcript does not list a rank.',
  },
};

export const educationByLocale: Record<Locale, EducationRecord[]> = {
  zh: [
    {
      id: 'graduate',
      institution: '中国科学技术大学',
      program: '量子科学与技术 硕士',
      period: '2024.09 - 2027.06（预计）',
      periodSource: 'Verified Resume',
      gpa: {
        value: '3.55',
        scale: '4.30',
        source: 'Official',
        context: '官方研究生成绩单所列全部课程 GPA。',
      },
      rank: null,
      coursework: courses(graduateCoursework.zh, 'Official Chinese'),
      researchFocus: {
        label: '半导体单光子探测器及读出电路',
        source: 'Verified Resume',
      },
    },
    {
      id: 'undergraduate',
      institution: '武汉大学',
      program: '物理学 本科',
      period: '2020.09 - 2024.06',
      periodSource: 'Verified Resume',
      gpa: {
        value: '3.86',
        scale: '4.00',
        source: 'Official',
        context: '官方成绩单打印于 2023-12-12；该值是打印时点 GPA，不应表述为最终毕业 GPA。',
      },
      rank: rankByLocale.zh,
      coursework: courses(undergraduateCoursework.zh, 'Official Chinese'),
    },
  ],
  en: [
    {
      id: 'graduate',
      institution: 'University of Science and Technology of China',
      program: "Master's in Quantum Science and Technology",
      period: 'Sep 2024 - Jun 2027 (expected)',
      periodSource: 'Verified Resume',
      gpa: {
        value: '3.55',
        scale: '4.30',
        source: 'Official',
        context: 'GPA for all courses shown on the official graduate transcript.',
      },
      rank: null,
      coursework: courses(graduateCoursework.en, 'Editorial Translation'),
      researchFocus: {
        label: 'Semiconductor single-photon detectors and readout circuits',
        source: 'Verified Resume',
      },
    },
    {
      id: 'undergraduate',
      institution: 'Wuhan University',
      program: 'BSc in Physics',
      period: 'Sep 2020 - Jun 2024',
      periodSource: 'Verified Resume',
      gpa: {
        value: '3.86',
        scale: '4.00',
        source: 'Official',
        context: 'Official transcript printed 2023-12-12; this is the GPA at print time, not necessarily the final graduation GPA.',
      },
      rank: rankByLocale.en,
      coursework: courses(undergraduateCoursework.en, 'Editorial Translation'),
    },
  ],
};
