import { useQuiz } from './hooks/useQuiz';
import { categories } from './data/categories';
import { pastExamSets } from './data/pastExams';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CategorySelect from './components/CategorySelect';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const quiz = useQuiz();
  const reportSummary = Object.values(quiz.reportedQuestionReasons).reduce<Record<string, number>>((acc, reason) => {
    acc[reason] = (acc[reason] ?? 0) + 1;
    return acc;
  }, {});
  const quizTitle = quiz.selectedPastExamSetLabel
    ?? (quiz.selectedCategory === 'mock-all'
      ? '模擬試験'
      : quiz.selectedCategory === 'weak-drill'
      ? '苦手問題ドリル'
      : quiz.selectedCategory === 'bookmark-drill'
      ? 'ブックマーク演習'
      : quiz.selectedCategory === 'due-review'
      ? '期限到来レビュー'
      : quiz.selectedCategory?.startsWith('tag-')
      ? '理解度別ドリル'
      : categories.find(c => c.id === quiz.selectedCategory)?.name)
    ?? '';

  return (
    <div className="min-h-screen bg-ink text-slate-100 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="grid-overlay" />
      </div>

      <div className="relative z-10">
        {quiz.currentView !== 'home' && (
          <Header
            totalScore={quiz.savedData.totalScore}
            level={quiz.level}
            streak={quiz.streak}
            showBack={quiz.currentView === 'quiz'}
            onBack={() => quiz.setCurrentView('categories')}
          />
        )}

        <div className="max-w-6xl mx-auto px-4 py-5 md:py-7">
          {quiz.currentView === 'home' && <HomeView onStart={() => quiz.setCurrentView('categories')} />}

          {quiz.currentView === 'categories' && (
            <CategorySelect
              categories={categories}
              pastExamSets={pastExamSets}
              onSelectCategory={quiz.handleStartCategory}
              onSelectPastExam={quiz.handleStartPastExam}
              onStartMockExam={quiz.handleStartMockExam}
              onStartWeakDrill={quiz.handleStartWeakDrill}
              onStartBookmarkDrill={quiz.handleStartBookmarkDrill}
              onStartLearningTagDrill={quiz.handleStartLearningTagDrill}
              onStartDueReviewDrill={quiz.handleStartDueReviewDrill}
              weakQuestionCount={quiz.weakQuestionIds.length}
              bookmarkQuestionCount={quiz.bookmarkQuestionIds.length}
              learningTagCounts={quiz.learningTagCounts}
              dueReviewCount={quiz.dueReviewCount}
              onExportData={quiz.exportLearningData}
              onImportData={quiz.importLearningData}
            />
          )}

          {quiz.currentView === 'quiz' && quiz.currentQuestion && (
            <QuizScreen
              currentQuestion={quiz.currentQuestion}
              currentQuestionIndex={quiz.currentQuestionIndex}
              totalQuestions={quiz.currentQuestions.length}
              categoryName={quizTitle}
              selectedAnswer={quiz.selectedAnswer}
              answered={quiz.answered}
              showHint={quiz.showHint}
              patternId={quiz.patternId}
              sessionMode={quiz.sessionMode}
              timeLeftSec={quiz.timeLeftSec}
              timeLimitSec={quiz.timeLimitSec}
              reportReason={quiz.reportedQuestionReasons[quiz.currentQuestion.id] ?? null}
              learningTag={quiz.currentLearningTag}
              isBookmarked={quiz.isCurrentQuestionBookmarked}
              onToggleBookmark={quiz.toggleBookmarkForCurrentQuestion}
              onAnswer={quiz.handleAnswerClick}
              onNext={quiz.handleNextQuestion}
              onToggleHint={() => quiz.setShowHint(!quiz.showHint)}
              onReport={quiz.setReportReasonForCurrentQuestion}
              onClearReport={quiz.clearReportForCurrentQuestion}
              onSetLearningTag={quiz.setLearningTagForCurrentQuestion}
            />
          )}

          {quiz.currentView === 'result' && (
            <ResultScreen
              score={quiz.score}
              sessionCorrect={quiz.sessionCorrect}
              sessionTotal={quiz.currentQuestions.length}
              streak={quiz.streak}
              totalScore={quiz.savedData.totalScore}
              level={quiz.level}
              totalAnswered={quiz.savedData.totalAnswered}
              totalCorrect={quiz.savedData.totalCorrect}
              history={quiz.savedData.history}
              patternId={quiz.patternId}
              selectedCategory={quiz.selectedCategory}
              sessionMode={quiz.sessionMode}
              isTimeUp={quiz.isTimeUp}
              timeLimitSec={quiz.timeLimitSec}
              timeLeftSec={quiz.timeLeftSec}
              reportedCount={Object.keys(quiz.reportedQuestionReasons).length}
              reportSummary={reportSummary}
              weakQuestionCount={quiz.weakQuestionIds.length}
              learningTagCounts={quiz.learningTagCounts}
              dueReviewCount={quiz.dueReviewCount}
              onStartWeakCategory={quiz.handleStartCategory}
              onStartWeakDrill={quiz.handleStartWeakDrill}
              onRetry={quiz.handleRetry}
              onReset={quiz.handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
