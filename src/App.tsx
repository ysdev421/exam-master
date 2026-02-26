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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white font-sans overflow-x-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
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

        <div className="max-w-5xl mx-auto px-4 py-6">
          {quiz.currentView === 'home' && (
            <HomeView onStart={() => quiz.setCurrentView('categories')} />
          )}

          {quiz.currentView === 'categories' && (
            <CategorySelect
              categories={categories}
              onSelectCategory={quiz.handleStartCategory}
            />
          )}

          {quiz.currentView === 'quiz' && quiz.currentQuestion && (
            <QuizScreen
              currentQuestion={quiz.currentQuestion}
              currentQuestionIndex={quiz.currentQuestionIndex}
              totalQuestions={quiz.currentQuestions.length}
              categoryName={categories.find(c => c.id === quiz.selectedCategory)?.name ?? ''}
              selectedAnswer={quiz.selectedAnswer}
              answered={quiz.answered}
              showDiagram={quiz.showDiagram}
              onAnswer={quiz.handleAnswerClick}
              onNext={quiz.handleNextQuestion}
              onToggleDiagram={() => quiz.setShowDiagram(!quiz.showDiagram)}
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
              onRetry={quiz.handleRetry}
              onReset={quiz.handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
