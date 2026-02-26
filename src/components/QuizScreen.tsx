import { ChevronRight, Trophy, Eye, EyeOff } from 'lucide-react';
import DiagramViewer from './DiagramViewer';
import type { Question } from '../types';

interface Props {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  categoryName: string;
  selectedAnswer: number | null;
  answered: boolean;
  showDiagram: boolean;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onToggleDiagram: () => void;
}

export default function QuizScreen({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  categoryName,
  selectedAnswer,
  answered,
  showDiagram,
  onAnswer,
  onNext,
  onToggleDiagram,
}: Props) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6 py-6 max-w-5xl mx-auto">
      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-cyan-300 font-bold">
            問題 {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-purple-300 text-xs bg-purple-950/50 px-3 py-1 rounded-full border border-purple-500/20">
            {categoryName}
          </span>
        </div>
        <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main layout */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Question Card */}
        <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-7 border border-cyan-400/20 backdrop-blur-sm space-y-6">
          <h2 className="text-xl font-bold leading-relaxed text-white">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.answers.map((answer, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = idx === currentQuestion.correct;
              const showCorrect = answered && isCorrect;
              const showWrong = answered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  onClick={() => onAnswer(idx)}
                  disabled={answered}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all duration-300 border-2 ${
                    showCorrect
                      ? 'bg-emerald-600/20 border-emerald-400 shadow-lg shadow-emerald-500/20'
                      : showWrong
                      ? 'bg-red-600/20 border-red-400 shadow-lg shadow-red-500/20'
                      : isSelected && !answered
                      ? 'bg-cyan-600/20 border-cyan-400'
                      : answered && !isSelected
                      ? 'bg-slate-700/30 border-slate-600/50 opacity-50'
                      : 'bg-slate-700/40 border-slate-600 hover:border-cyan-400/60 hover:bg-slate-700/60'
                  } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      showCorrect ? 'bg-emerald-500 border-emerald-300'
                      : showWrong ? 'bg-red-500 border-red-300'
                      : isSelected ? 'bg-cyan-500 border-cyan-300'
                      : 'bg-slate-600 border-slate-500'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="flex-1 text-sm">{answer}</span>
                    {showCorrect && <span className="text-emerald-400 font-bold">✓</span>}
                    {showWrong && <span className="text-red-400 font-bold">✗</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={`rounded-xl p-4 border-l-4 ${
              selectedAnswer === currentQuestion.correct
                ? 'bg-emerald-950/40 border-emerald-500'
                : 'bg-red-950/40 border-red-500'
            }`}>
              <p className="font-bold mb-1">
                {selectedAnswer === currentQuestion.correct ? '✓ 正解！' : '✗ 不正解'}
              </p>
              <p className="text-sm text-gray-300 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        {/* Diagram Sidebar */}
        <div className="bg-slate-800/50 rounded-2xl p-5 border border-purple-400/20 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-purple-300 text-sm">ビジュアル解説</h3>
            <button
              onClick={onToggleDiagram}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition text-gray-400 hover:text-white"
            >
              {showDiagram ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-36">
            {showDiagram
              ? <DiagramViewer diagramType={currentQuestion.diagram ?? 'default'} />
              : <p className="text-xs text-gray-500 text-center">アイコンをクリックして<br />図解を表示</p>
            }
          </div>
        </div>
      </div>

      {/* Next Button */}
      {answered && (
        <button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 group transform hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-cyan-500/20"
        >
          {currentQuestionIndex < totalQuestions - 1 ? (
            <>次の問題へ <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
          ) : (
            <>結果を見る <Trophy size={18} /></>
          )}
        </button>
      )}
    </div>
  );
}
