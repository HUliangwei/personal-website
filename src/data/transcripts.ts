import type { Locale } from '../i18n/types';

export interface TranscriptRecord {
  id: 'undergraduate' | 'graduate';
  title: string;
  status: 'preparing';
  statusLabel: string;
  available: false;
  pdf: null;
}

export const transcriptsByLocale: Record<Locale, TranscriptRecord[]> = {
  zh: [
    {
      id: 'undergraduate',
      title: '本科成绩单',
      status: 'preparing',
      statusLabel: '准备中',
      available: false,
      pdf: null,
    },
    {
      id: 'graduate',
      title: '研究生成绩单',
      status: 'preparing',
      statusLabel: '准备中',
      available: false,
      pdf: null,
    },
  ],
  en: [
    {
      id: 'undergraduate',
      title: 'Undergraduate transcript',
      status: 'preparing',
      statusLabel: 'Preparing',
      available: false,
      pdf: null,
    },
    {
      id: 'graduate',
      title: 'Graduate transcript',
      status: 'preparing',
      statusLabel: 'Preparing',
      available: false,
      pdf: null,
    },
  ],
};
