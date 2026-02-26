import { useCallback, useEffect, useMemo, useState } from 'react';
import { questionDatabase } from '../data/questions';
import { pastExamQuestionDatabase, pastExamSets } from '../data/pastExams';
import { useLocalStorage } from './useLocalStorage';
import type { View, SavedData, Question, SessionMode, LearningTag } from '../types';

const STORAGE_KEY = 'examquest-v1';
const PATTERN_STORAGE_KEY = 'examquest-patterns-v1';
const FIRST_QUESTION_STORAGE_KEY = 'examquest-first-question-v1';
const RECENT_QUESTION_STORAGE_KEY = 'examquest-recent-questions-v1';
const REPORTED_QUESTION_STORAGE_KEY = 'examquest-reported-question-reasons-v1';
const WEAK_QUESTION_STORAGE_KEY = 'examquest-weak-questions-v1';
const BOOKMARK_QUESTION_STORAGE_KEY = 'examquest-bookmark-questions-v1';
const LEARNING_TAG_STORAGE_KEY = 'examquest-learning-tags-v1';
const REVIEW_PLAN_STORAGE_KEY = 'examquest-review-plan-v1';

const INITIAL_DATA: SavedData = {
  totalScore: 0,
  totalAnswered: 0,
  totalCorrect: 0,
  history: [],
};

const QUESTIONS_PER_SESSION = 6;
const DEFAULT_MOCK_QUESTIONS = 20;
const MAX_RECENT_PATTERNS = 8;
const MAX_RECENT_QUESTION_IDS = 50;
const BACKUP_VERSION = 1;
const LEARNING_TAGS: LearningTag[] = ['unknown', 'partial', 'knew-but-missed', 'careless'];

type ReviewPlan = Record<number, { nextReviewAt: string; intervalDays: number }>;

function nextReviewDays(tag: LearningTag): number {
  if (tag === 'unknown') return 1;
  if (tag === 'partial') return 3;
  if (tag === 'knew-but-missed') return 2;
  return 7;
}

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makePatternId(scopeId: string): string {
  const now = Date.now().toString(36).toUpperCase();
  const seed = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${scopeId.slice(0, 3).toUpperCase()}-${now}-${seed}`;
}

function shuffleAnswers(question: Question): Question {
  const indexed = question.answers.map((text, index) => ({ text, index }));
  const shuffled = shuffle(indexed);
  const nextCorrect = shuffled.findIndex(item => item.index === question.correct);
  return { ...question, answers: shuffled.map(item => item.text), correct: nextCorrect };
}

function getPatternSignature(questions: Question[]): string {
  const ids = questions.map(q => q.id).sort((a, b) => a - b);
  return ids.join('|');
}

function seasonLabel(season: 'Spring' | 'Autumn'): string {
  return season === 'Spring' ? '春期' : '秋期';
}

function normalizePastExamLabel(setId: string): string {
  const set = pastExamSets.find(s => s.id === setId);
  if (!set) return setId;
  const suffix = set.id.endsWith('_fe_am') ? '午前' : set.id.endsWith('_fe_pm') ? '午後' : '';
  const eraYear = set.year - 2018;
  const era = eraYear > 0 ? `令和${eraYear}年` : `${set.year}年`;
  return `${era} ${seasonLabel(set.season)}${suffix ? ` ${suffix}` : ''} 基本情報`;
}

function uniqueRecentIds(prev: number[], next: number[]): number[] {
  const merged = [...prev, ...next];
  const deduped = merged.filter((id, index) => merged.indexOf(id) === index);
  return deduped.slice(-MAX_RECENT_QUESTION_IDS);
}

export function useQuiz() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPastExamSet, setSelectedPastExamSet] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [patternId, setPatternId] = useState('');
  const [sessionMode, setSessionMode] = useState<SessionMode>('practice');
  const [timeLimitSec, setTimeLimitSec] = useState<number | null>(null);
  const [timeLeftSec, setTimeLeftSec] = useState<number | null>(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSessionFinalized, setIsSessionFinalized] = useState(false);
  const [mockQuestionCount, setMockQuestionCount] = useState(DEFAULT_MOCK_QUESTIONS);
  const [recentPatternsByCategory, setRecentPatternsByCategory] = useLocalStorage<Record<string, string[]>>(PATTERN_STORAGE_KEY, {});
  const [recentFirstQuestionByCategory, setRecentFirstQuestionByCategory] = useLocalStorage<Record<string, number>>(FIRST_QUESTION_STORAGE_KEY, {});
  const [recentQuestionIdsByScope, setRecentQuestionIdsByScope] = useLocalStorage<Record<string, number[]>>(RECENT_QUESTION_STORAGE_KEY, {});
  const [reportedQuestionReasons, setReportedQuestionReasons] = useLocalStorage<Record<number, string>>(REPORTED_QUESTION_STORAGE_KEY, {});
  const [weakQuestionIds, setWeakQuestionIds] = useLocalStorage<number[]>(WEAK_QUESTION_STORAGE_KEY, []);
  const [bookmarkQuestionIds, setBookmarkQuestionIds] = useLocalStorage<number[]>(BOOKMARK_QUESTION_STORAGE_KEY, []);
  const [learningTagByQuestionId, setLearningTagByQuestionId] = useLocalStorage<Record<number, LearningTag>>(LEARNING_TAG_STORAGE_KEY, {});
  const [reviewPlanByQuestionId, setReviewPlanByQuestionId] = useLocalStorage<ReviewPlan>(REVIEW_PLAN_STORAGE_KEY, {});
  const [savedData, setSavedData] = useLocalStorage<SavedData>(STORAGE_KEY, INITIAL_DATA);

  const exportLearningData = () => {
    const payload = {
      version: BACKUP_VERSION,
      exportedAt: new Date().toISOString(),
      data: {
        savedData,
        recentPatternsByCategory,
        recentFirstQuestionByCategory,
        recentQuestionIdsByScope,
        reportedQuestionReasons,
        weakQuestionIds,
        bookmarkQuestionIds,
        learningTagByQuestionId,
        reviewPlanByQuestionId,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `examquest-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  const importLearningData = async (file: File): Promise<{ ok: boolean; message: string }> => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as {
        version?: number;
        data?: {
          savedData?: SavedData;
          recentPatternsByCategory?: Record<string, string[]>;
          recentFirstQuestionByCategory?: Record<string, number>;
          recentQuestionIdsByScope?: Record<string, number[]>;
          reportedQuestionReasons?: Record<number, string>;
          weakQuestionIds?: number[];
          bookmarkQuestionIds?: number[];
          learningTagByQuestionId?: Record<number, LearningTag>;
          reviewPlanByQuestionId?: ReviewPlan;
        };
      };

      if (parsed.version !== BACKUP_VERSION || !parsed.data) {
        return { ok: false, message: 'バックアップ形式が不正です。' };
      }

      if (parsed.data.savedData) setSavedData(parsed.data.savedData);
      setRecentPatternsByCategory(parsed.data.recentPatternsByCategory ?? {});
      setRecentFirstQuestionByCategory(parsed.data.recentFirstQuestionByCategory ?? {});
      setRecentQuestionIdsByScope(parsed.data.recentQuestionIdsByScope ?? {});
      setReportedQuestionReasons(parsed.data.reportedQuestionReasons ?? {});
      setWeakQuestionIds(parsed.data.weakQuestionIds ?? []);
      setBookmarkQuestionIds(parsed.data.bookmarkQuestionIds ?? []);
      setLearningTagByQuestionId(parsed.data.learningTagByQuestionId ?? {});
      setReviewPlanByQuestionId(parsed.data.reviewPlanByQuestionId ?? {});
      return { ok: true, message: '学習データを復元しました。' };
    } catch {
      return { ok: false, message: 'JSONの読み込みに失敗しました。' };
    }
  };

  const resetAllLearningData = () => {
    setSavedData(INITIAL_DATA);
    setRecentPatternsByCategory({});
    setRecentFirstQuestionByCategory({});
    setRecentQuestionIdsByScope({});
    setReportedQuestionReasons({});
    setWeakQuestionIds([]);
    setBookmarkQuestionIds([]);
    setLearningTagByQuestionId({});
    setReviewPlanByQuestionId({});
    setCurrentView('categories');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCorrect(0);
    setSelectedCategory(null);
    setSelectedPastExamSet(null);
    setShowHint(false);
    setSessionQuestions([]);
    setPatternId('');
    setSessionMode('practice');
    setTimeLimitSec(null);
    setTimeLeftSec(null);
    setIsTimeUp(false);
    setIsSessionFinalized(false);
  };

  const level = Math.floor(savedData.totalScore / 50) + 1;
  const currentQuestions = sessionQuestions;
  const currentQuestion = currentQuestions[currentQuestionIndex] ?? null;
  const selectedPastExamSetLabel = selectedPastExamSet ? normalizePastExamLabel(selectedPastExamSet) : null;

  const finalizeSession = useCallback(() => {
    if (isSessionFinalized) return;
    setSavedData(prev => ({
      ...prev,
      history: [
        {
          date: new Date().toISOString(),
          category: selectedPastExamSet ? `past:${selectedPastExamSet}` : (selectedCategory ?? ''),
          score,
          correct: sessionCorrect,
          total: currentQuestions.length,
          streak,
        },
        ...prev.history,
      ].slice(0, 20),
    }));
    setIsSessionFinalized(true);
    setCurrentView('result');
  }, [isSessionFinalized, selectedPastExamSet, selectedCategory, score, sessionCorrect, currentQuestions.length, streak, setSavedData]);

  useEffect(() => {
    if (currentView !== 'quiz' || sessionMode !== 'mock' || timeLeftSec === null || timeLeftSec <= 0) return undefined;
    const timer = setInterval(() => {
      setTimeLeftSec(prev => {
        if (prev === null) return prev;
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentView, sessionMode, timeLeftSec, finalizeSession]);

  useEffect(() => {
    if (currentView === 'quiz' && sessionMode === 'mock' && timeLeftSec === 0) {
      finalizeSession();
    }
  }, [currentView, sessionMode, timeLeftSec, finalizeSession]);

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
      setSavedData(prev => ({ ...prev, totalScore: prev.totalScore + points, totalAnswered: prev.totalAnswered + 1, totalCorrect: prev.totalCorrect + 1 }));
      setWeakQuestionIds(prev => prev.filter(id => id !== currentQuestion.id));
    } else {
      setStreak(0);
      setSavedData(prev => ({ ...prev, totalAnswered: prev.totalAnswered + 1 }));
      setWeakQuestionIds(prev => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]));
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowHint(false);
    } else {
      finalizeSession();
    }
  };

  const startWithPool = (
    scopeId: string,
    pool: Question[],
    isPastExam: boolean,
    mode: SessionMode = 'practice',
    questionCount = QUESTIONS_PER_SESSION,
    sessionTimeLimitSec: number | null = null,
  ) => {
    if (pool.length === 0) return;

    const recent = recentPatternsByCategory[scopeId] ?? [];
    const previousFirstId = recentFirstQuestionByCategory[scopeId] ?? null;
    const recentQuestionIds = recentQuestionIdsByScope[scopeId] ?? [];
    let picked: Question[] = [];
    let signature = '';
    let attempts = 0;

    do {
      const targetCount = Math.min(questionCount, pool.length);
      const preferredPool = pool.filter(q => !recentQuestionIds.includes(q.id));
      const candidatePool = preferredPool.length >= targetCount ? preferredPool : pool;
      picked = shuffle(candidatePool).slice(0, targetCount).map(shuffleAnswers);
      signature = getPatternSignature(picked);
      attempts += 1;
    } while (attempts < 40 && (recent.includes(signature) || (previousFirstId !== null && picked[0]?.id === previousFirstId)));

    setSelectedPastExamSet(isPastExam ? scopeId : null);
    setSelectedCategory(isPastExam ? null : scopeId);
    setSessionQuestions(picked);
    setPatternId(makePatternId(scopeId));
    setSessionMode(mode);
    setTimeLimitSec(sessionTimeLimitSec);
    setTimeLeftSec(sessionTimeLimitSec);
    setIsTimeUp(false);
    setIsSessionFinalized(false);
    setRecentPatternsByCategory(prev => ({ ...prev, [scopeId]: [signature, ...(prev[scopeId] ?? []).filter(item => item !== signature)].slice(0, MAX_RECENT_PATTERNS) }));
    if (picked[0]) setRecentFirstQuestionByCategory(prev => ({ ...prev, [scopeId]: picked[0].id }));
    setRecentQuestionIdsByScope(prev => ({ ...prev, [scopeId]: uniqueRecentIds(prev[scopeId] ?? [], picked.map(q => q.id)) }));

    setCurrentView('quiz');
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setStreak(0);
    setSessionCorrect(0);
    setShowHint(false);
  };

  const handleStartCategory = (categoryId: string) => {
    startWithPool(categoryId, questionDatabase[categoryId] ?? [], false);
  };

  const handleStartPastExam = (setId: string) => {
    startWithPool(setId, pastExamQuestionDatabase[setId] ?? [], true);
  };

  const handleStartMockExam = (count = DEFAULT_MOCK_QUESTIONS) => {
    const categoryPool = Object.values(questionDatabase).flat();
    const pastPool = Object.values(pastExamQuestionDatabase).flat();
    const mergedPool = [...categoryPool, ...pastPool];
    const questionCount = Math.max(5, Math.min(count, mergedPool.length));
    const timeLimit = questionCount * 90;
    setMockQuestionCount(questionCount);
    startWithPool('mock-all', mergedPool, false, 'mock', questionCount, timeLimit);
  };

  const handleStartWeakDrill = () => {
    const pool = [...Object.values(questionDatabase).flat(), ...Object.values(pastExamQuestionDatabase).flat()];
    const weakSet = new Set(weakQuestionIds);
    const weakPool = pool.filter(q => weakSet.has(q.id));
    if (weakPool.length === 0) return;
    startWithPool('weak-drill', weakPool, false, 'practice', Math.min(QUESTIONS_PER_SESSION, weakPool.length), null);
  };

  const handleStartBookmarkDrill = () => {
    const pool = [...Object.values(questionDatabase).flat(), ...Object.values(pastExamQuestionDatabase).flat()];
    const bookmarkSet = new Set(bookmarkQuestionIds);
    const bookmarkedPool = pool.filter(q => bookmarkSet.has(q.id));
    if (bookmarkedPool.length === 0) return;
    startWithPool('bookmark-drill', bookmarkedPool, false, 'practice', Math.min(QUESTIONS_PER_SESSION, bookmarkedPool.length), null);
  };

  const handleRetry = () => {
    if (sessionMode === 'mock') {
      handleStartMockExam(mockQuestionCount);
      return;
    }
    if (selectedCategory === 'due-review') {
      handleStartDueReviewDrill();
      return;
    }
    if (selectedCategory?.startsWith('tag-')) {
      const tag = selectedCategory.slice(4) as LearningTag;
      if (LEARNING_TAGS.includes(tag)) handleStartLearningTagDrill(tag);
      return;
    }
    if (selectedPastExamSet) {
      handleStartPastExam(selectedPastExamSet);
      return;
    }
    if (selectedCategory) handleStartCategory(selectedCategory);
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
    setSelectedPastExamSet(null);
    setShowHint(false);
    setSessionQuestions([]);
    setPatternId('');
    setSessionMode('practice');
    setTimeLimitSec(null);
    setTimeLeftSec(null);
    setIsTimeUp(false);
    setIsSessionFinalized(false);
  };

  const setReportReasonForCurrentQuestion = (reason: string) => {
    if (!currentQuestion) return;
    setReportedQuestionReasons(prev => ({ ...prev, [currentQuestion.id]: reason }));
  };

  const clearReportForCurrentQuestion = () => {
    if (!currentQuestion) return;
    setReportedQuestionReasons(prev => {
      const next = { ...prev };
      delete next[currentQuestion.id];
      return next;
    });
  };

  const toggleBookmarkForCurrentQuestion = () => {
    if (!currentQuestion) return;
    setBookmarkQuestionIds(prev => (prev.includes(currentQuestion.id) ? prev.filter(id => id !== currentQuestion.id) : [...prev, currentQuestion.id]));
  };

  const setLearningTagForCurrentQuestion = (tag: LearningTag) => {
    if (!currentQuestion) return;
    const intervalDays = nextReviewDays(tag);
    const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();
    setLearningTagByQuestionId(prev => ({ ...prev, [currentQuestion.id]: tag }));
    setReviewPlanByQuestionId(prev => ({ ...prev, [currentQuestion.id]: { nextReviewAt, intervalDays } }));
    if (tag === 'unknown' || tag === 'partial' || tag === 'knew-but-missed') {
      setWeakQuestionIds(prev => (prev.includes(currentQuestion.id) ? prev : [...prev, currentQuestion.id]));
    }
    if (tag === 'careless') {
      setWeakQuestionIds(prev => prev.filter(id => id !== currentQuestion.id));
    }
  };

  const handleStartLearningTagDrill = (tag: LearningTag) => {
    const pool = [...Object.values(questionDatabase).flat(), ...Object.values(pastExamQuestionDatabase).flat()];
    const drillPool = pool.filter(q => learningTagByQuestionId[q.id] === tag);
    if (drillPool.length === 0) return;
    startWithPool(`tag-${tag}`, drillPool, false, 'practice', Math.min(QUESTIONS_PER_SESSION, drillPool.length), null);
  };

  const handleStartDueReviewDrill = () => {
    const now = Date.now();
    const dueIds = Object.entries(reviewPlanByQuestionId)
      .filter(([, item]) => new Date(item.nextReviewAt).getTime() <= now)
      .map(([id]) => Number(id));
    if (dueIds.length === 0) return;
    const dueSet = new Set(dueIds);
    const pool = [...Object.values(questionDatabase).flat(), ...Object.values(pastExamQuestionDatabase).flat()];
    const drillPool = pool.filter(q => dueSet.has(q.id));
    if (drillPool.length === 0) return;
    startWithPool('due-review', drillPool, false, 'practice', Math.min(QUESTIONS_PER_SESSION, drillPool.length), null);
  };

  const isCurrentQuestionBookmarked = currentQuestion ? bookmarkQuestionIds.includes(currentQuestion.id) : false;
  const currentLearningTag = currentQuestion ? learningTagByQuestionId[currentQuestion.id] ?? null : null;
  const learningTagCounts = LEARNING_TAGS.reduce<Record<LearningTag, number>>(
    (acc, tag) => ({ ...acc, [tag]: Object.values(learningTagByQuestionId).filter(item => item === tag).length }),
    { unknown: 0, partial: 0, 'knew-but-missed': 0, careless: 0 },
  );
  const dueReviewCount = Object.values(reviewPlanByQuestionId).filter(item => new Date(item.nextReviewAt).getTime() <= Date.now()).length;

  const sessionAccuracy = useMemo(() => (currentQuestions.length > 0 ? Math.round((sessionCorrect / currentQuestions.length) * 100) : 0), [currentQuestions.length, sessionCorrect]);

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
    selectedPastExamSet,
    selectedPastExamSetLabel,
    showHint,
    setShowHint,
    savedData,
    level,
    currentQuestions,
    currentQuestion,
    patternId,
    sessionMode,
    timeLimitSec,
    timeLeftSec,
    isTimeUp,
    reportedQuestionReasons,
    weakQuestionIds,
    bookmarkQuestionIds,
    learningTagCounts,
    dueReviewCount,
    isCurrentQuestionBookmarked,
    currentLearningTag,
    handleAnswerClick,
    handleNextQuestion,
    handleStartCategory,
    handleStartPastExam,
    handleStartMockExam,
    handleStartWeakDrill,
    handleStartBookmarkDrill,
    handleStartLearningTagDrill,
    handleStartDueReviewDrill,
    handleRetry,
    handleReset,
    setReportReasonForCurrentQuestion,
    clearReportForCurrentQuestion,
    toggleBookmarkForCurrentQuestion,
    setLearningTagForCurrentQuestion,
    exportLearningData,
    importLearningData,
    resetAllLearningData,
  };
}
