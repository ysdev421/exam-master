import { useState } from 'react';
import { questionDatabase } from '../data/questions';
import { useLocalStorage } from './useLocalStorage';
import type { View, SavedData } from '../types';

const STORAGE_KEY = 'examquest-v1';

const INITIAL_DATA: SavedData = {
  totalScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  history: [],
};

const QUESTIONS_PER_SESSION = 6;

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

  const [savedData, setSavedData] = useLocalStorage<SavedData>(STORAGE_KEY, INITIAL_DATA);

  const level = Math.floor(savedData.totalScore / 50) + 1;

  const currentQuestions = selectedCategory
    ? (questionDatabase[selectedCategory] ?? []).slice(0, QUESTIONS_PER_SESSION)
    : [];

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

  const handleStartCategory = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCorrect(0);
    setShowDiagram(false);
  };

  const handleRetry = () => {
    if (!selectedCategory) return;
    handleStartCategory(selectedCategory);
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
  };

  return {
    currentView,
    setCurrentView,
    score,
    streak,
    sessionCorrect,
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
    handleAnswerClick,
    handleNextQuestion,
    handleStartCategory,
    handleRetry,
    handleReset,
  };
}
