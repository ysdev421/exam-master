export interface ExamConfig {
  slug: string;
  shortName: string;
  fullName: string;
  audience: string;
  seoTitle: string;
  seoDescription: string;
  comingSoon?: boolean;
}

export const exams: ExamConfig[] = [
  {
    slug: 'fe',
    shortName: 'FE',
    fullName: '基本情報技術者試験',
    audience: 'ITエンジニア初級〜中級',
    seoTitle: '基本情報技術者試験の過去問対策 | ExamQuest',
    seoDescription: '基本情報技術者試験の分野別演習・模擬試験・苦手克服ができる学習アプリ。',
  },
  {
    slug: 'ap',
    shortName: 'AP',
    fullName: '応用情報技術者試験',
    audience: 'ITエンジニア中級',
    seoTitle: '応用情報技術者試験対策 | ExamQuest',
    seoDescription: '応用情報技術者試験向けの学習コンテンツを準備中です。',
    comingSoon: true,
  },
];

export const activeExam = exams.find((exam) => !exam.comingSoon) ?? exams[0];
