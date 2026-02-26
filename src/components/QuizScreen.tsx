import { ChevronRight, Trophy, Lightbulb } from 'lucide-react';
import type { Question } from '../types';

interface Props {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  categoryName: string;
  selectedAnswer: number | null;
  answered: boolean;
  showHint: boolean;
  patternId: string;
  onAnswer: (index: number) => void;
  onNext: () => void;
  onToggleHint: () => void;
}

export default function QuizScreen({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  categoryName,
  selectedAnswer,
  answered,
  showHint,
  patternId,
  onAnswer,
  onNext,
  onToggleHint,
}: Props) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="space-y-6 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card rounded-2xl p-5">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-3 text-sm">
          <span className="font-bold text-cyan-200">Q{currentQuestionIndex + 1} / {totalQuestions}</span>
          <div className="flex gap-2">
            <span className="chip">{categoryName}</span>
            <span className="chip">Pattern {patternId}</span>
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-slate-700/45 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-300 to-cyan-200 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-6">
        <section className="rounded-2xl border border-cyan-300/25 bg-cyan-300/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/85 mb-3">Question</p>
          <h2 className="text-lg md:text-2xl leading-relaxed font-bold">{currentQuestion.question}</h2>
          {currentQuestion.source && (
            <p className="mt-3 text-xs text-slate-300">
              出典: {currentQuestion.source.label} {currentQuestion.source.questionNo}
            </p>
          )}
        </section>

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
                className={`w-full rounded-2xl border p-4 md:p-5 text-left transition ${
                  showCorrect
                    ? 'border-emerald-300/70 bg-emerald-400/15 animate-correct-burst'
                    : showWrong
                    ? 'border-rose-300/70 bg-rose-400/15 animate-wrong-shake'
                    : isSelected
                    ? 'border-cyan-300/70 bg-cyan-400/10'
                    : 'border-slate-500/40 bg-slate-800/30 hover:border-cyan-200/60'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <span className="w-8 h-8 rounded-full border border-slate-400/50 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm md:text-base leading-relaxed">{answer}</span>
                </div>
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="rounded-2xl border border-slate-500/35 bg-slate-900/45 p-5">
            <p className="font-bold mb-1">{selectedAnswer === currentQuestion.correct ? '正解' : '不正解'}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {!answered && (
          <div className="rounded-2xl border border-amber-300/35 bg-amber-300/10 p-4">
            <button onClick={onToggleHint} className="inline-flex items-center gap-2 text-sm font-bold text-amber-100">
              <Lightbulb size={16} /> {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
            </button>
            {showHint && (
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {currentQuestion.hint ?? '問題文のキーワードを先に拾って、選択肢を消去法で絞ると安定します。'}
              </p>
            )}
          </div>
        )}
      </div>

      {answered && (
        <button onClick={onNext} className="btn-primary py-4 shadow-lg shadow-cyan-500/20">
          {currentQuestionIndex < totalQuestions - 1 ? <>次の問題へ <ChevronRight size={18} /></> : <>結果を見る <Trophy size={18} /></>}
        </button>
      )}
    </div>
  );
}
