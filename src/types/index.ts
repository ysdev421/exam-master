export type View = 'home' | 'categories' | 'quiz' | 'result';

export interface QuestionSource {
  setId: string;
  label: string;
  year: number;
  questionNo: string;
  url?: string;
}

export interface Question {
  id: number;
  question: string;
  answers: string[];
  correct: number;
  explanation: string;
  hint?: string;
  source?: QuestionSource;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  questions: number;
}

export interface SessionRecord {
  date: string;
  category: string;
  score: number;
  correct: number;
  total: number;
}

export interface SavedData {
  totalScore: number;
  totalAnswered: number;
  totalCorrect: number;
  history: SessionRecord[];
}
