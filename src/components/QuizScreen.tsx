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
  patternId: string;
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
  patternId,
  onAnswer,
  onNext,
  onToggleDiagram,
}: Props) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6 py-6 max-w-6xl mx-auto animate-fade-in">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-bold text-teal-200">Q{currentQuestionIndex + 1} / {totalQuestions}</span>
          <div className="flex items-center gap-2">
            <span className="chip">{categoryName}</span>
            <span className="chip">Pattern {patternId}</span>
          </div>
        </div>
        <div className="w-full bg-slate-700/40 rounded-full h-2 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-200 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 space-y-5">
          <h2 className="text-xl md:text-2xl font-bold leading-relaxed">{currentQuestion.question}</h2>
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
                  className={`w-full p-4 rounded-xl text-left border-2 transition-all duration-300 ${
                    showCorrect
                      ? 'border-emerald-300 bg-emerald-400/20 animate-correct-burst'
                      : showWrong
                      ? 'border-rose-300 bg-rose-400/20 animate-wrong-shake'
                      : isSelected
                      ? 'border-cyan-300 bg-cyan-400/20'
                      : 'border-white/10 bg-slate-700/30 hover:border-cyan-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full border border-white/30 flex items-center justify-center text-xs font-bold">{String.fromCharCode(65 + idx)}</span>
                    <span className="text-sm">{answer}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="rounded-xl p-4 bg-black/20 border border-white/10">
              <p className="font-bold mb-1">{selectedAnswer === currentQuestion.correct ? '正解' : '不正解'}</p>
              <p className="text-sm text-slate-300">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm">図解</h3>
            <button onClick={onToggleDiagram} className="p-1.5 rounded hover:bg-white/10">
              {showDiagram ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="min-h-40 flex items-center justify-center">
            {showDiagram ? <DiagramViewer diagramType={currentQuestion.diagram ?? 'default'} /> : <p className="text-xs text-slate-400">表示ボタンで図解を確認</p>}
          </div>
        </div>
      </div>

      {answered && (
        <button onClick={onNext} className="w-full rounded-xl py-4 font-bold text-slate-950 bg-gradient-to-r from-teal-300 to-cyan-200 hover:from-teal-200 hover:to-cyan-100 transition flex items-center justify-center gap-2">
          {currentQuestionIndex < totalQuestions - 1 ? <>次の問題へ <ChevronRight size={18} /></> : <>結果を見る <Trophy size={18} /></>}
        </button>
      )}
    </div>
  );
}
