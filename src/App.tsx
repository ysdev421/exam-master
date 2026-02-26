import { useQuiz } from './hooks/useQuiz';
import { categories } from './data/categories';
import Header from './components/Header';
import HomeView from './components/HomeView';
import CategorySelect from './components/CategorySelect';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';

export default function App() {
  const quiz = useQuiz();

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
            <CategorySelect categories={categories} onSelectCategory={quiz.handleStartCategory} />
          )}

          {quiz.currentView === 'quiz' && quiz.currentQuestion && (
            <QuizScreen
              currentQuestion={quiz.currentQuestion}
              currentQuestionIndex={quiz.currentQuestionIndex}
              totalQuestions={quiz.currentQuestions.length}
              categoryName={categories.find(c => c.id === quiz.selectedCategory)?.name ?? ''}
              selectedAnswer={quiz.selectedAnswer}
              answered={quiz.answered}
              showHint={quiz.showHint}
              patternId={quiz.patternId}
              onAnswer={quiz.handleAnswerClick}
              onNext={quiz.handleNextQuestion}
              onToggleHint={() => quiz.setShowHint(!quiz.showHint)}
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
              onStartWeakCategory={quiz.handleStartCategory}
              onRetry={quiz.handleRetry}
              onReset={quiz.handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
