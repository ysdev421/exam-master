import { useMemo, useState } from 'react';
import { questionDatabase } from '../data/questions';
import { useLocalStorage } from './useLocalStorage';
import type { View, SavedData, Question } from '../types';

const STORAGE_KEY = 'examquest-v1';

const INITIAL_DATA: SavedData = {
  totalScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  history: [],
};

const QUESTIONS_PER_SESSION = 6;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makePatternId(categoryId: string): string {
  const now = Date.now().toString(36).toUpperCase();
  const seed = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${categoryId.slice(0, 3).toUpperCase()}-${now}-${seed}`;
}

export function useQuiz() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDiagram, setShowDiagram] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [patternId, setPatternId] = useState('');

  const [savedData, setSavedData] = useLocalStorage<SavedData>(STORAGE_KEY, INITIAL_DATA);

  const level = Math.floor(savedData.totalScore / 50) + 1;

  const currentQuestions = sessionQuestions;
  const currentQuestion = currentQuestions[currentQuestionIndex] ?? null;

  const handleAnswerClick = (index: number) => {
    if (answered || !currentQuestion) return;
    setSelectedAnswer(index);
    setAnswered(true);

    const isCorrect = index === currentQuestion.correct;
    if (isCorrect) {
      const points = 10 + streak * 2;
      setScore(prev => prev + points);
      setStreak(prev => prev + 1);
      setSessionCorrect(prev => prev + 1);
      setSavedData(prev => ({
        ...prev,
        totalScore: prev.totalScore + points,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + 1,
      }));
    } else {
      setStreak(0);
      setSavedData(prev => ({
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
      }));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowDiagram(false);
    } else {
      setSavedData(prev => ({
        ...prev,
        history: [
          {
            date: new Date().toISOString(),
            category: selectedCategory ?? '',
            score,
            correct: sessionCorrect,
            total: currentQuestions.length,
          },
          ...prev.history,
        ].slice(0, 20),
      }));
      setCurrentView('result');
    }
  };

  const startSession = (categoryId: string) => {
    const pool = questionDatabase[categoryId] ?? [];
    const picked = shuffle(pool).slice(0, QUESTIONS_PER_SESSION);

    setSelectedCategory(categoryId);
    setSessionQuestions(picked);
    setPatternId(makePatternId(categoryId));
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCorrect(0);
    setShowDiagram(false);
  };

  const handleStartCategory = (categoryId: string) => {
    startSession(categoryId);
  };

  const handleRetry = () => {
    if (!selectedCategory) return;
    startSession(selectedCategory);
  };

  const handleReset = () => {
    setCurrentView('categories');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCorrect(0);
    setSelectedCategory(null);
    setShowDiagram(false);
    setSessionQuestions([]);
    setPatternId('');
  };

  const sessionAccuracy = useMemo(
    () => (currentQuestions.length > 0 ? Math.round((sessionCorrect / currentQuestions.length) * 100) : 0),
    [currentQuestions.length, sessionCorrect],
  );

  return {
    currentView,
    setCurrentView,
    score,
    streak,
    sessionCorrect,
    sessionAccuracy,
    currentQuestionIndex,
    selectedAnswer,
    answered,
    selectedCategory,
    showDiagram,
    setShowDiagram,
    savedData,
    level,
    currentQuestions,
    currentQuestion,
    patternId,
    handleAnswerClick,
    handleNextQuestion,
    handleStartCategory,
    handleRetry,
    handleReset,
  };
}
