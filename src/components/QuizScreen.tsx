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
    <div className="space-y-8 py-8 max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card rounded-3xl px-5 py-4 md:px-6 md:py-5">
        <div className="flex flex-wrap justify-between items-center gap-2 text-sm mb-3">
          <span className="font-bold tracking-wide text-teal-200">QUESTION {currentQuestionIndex + 1} / {totalQuestions}</span>
          <div className="flex items-center gap-2">
            <span className="chip">{categoryName}</span>
            <span className="chip">Pattern {patternId}</span>
          </div>
        </div>
        <div className="w-full bg-slate-700/40 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-200 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 space-y-7 border border-cyan-100/10">
        <section className="question-shell rounded-3xl p-6 md:p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">Read Carefully</p>
          <h2 className="text-[1.15rem] md:text-[1.5rem] leading-[2] font-semibold text-slate-50">
            {currentQuestion.question}
          </h2>
        </section>

        <div className="space-y-4 md:space-y-4.5">
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
                className={`option-card w-full p-4 md:p-5 rounded-2xl text-left border transition-all duration-300 min-h-[74px] ${
                  showCorrect
                    ? 'border-emerald-300/70 bg-emerald-400/15 animate-correct-burst'
                    : showWrong
                    ? 'border-rose-300/70 bg-rose-400/15 animate-wrong-shake'
                    : isSelected
                    ? 'border-cyan-300/70 bg-cyan-400/15'
                    : 'border-white/12 bg-slate-700/20 hover:border-cyan-200/60 hover:bg-slate-700/35'
                }`}
              >
                  <div className="flex items-start gap-4">
                    <span className="w-8 h-8 rounded-full border border-white/35 flex items-center justify-center text-xs font-bold text-slate-100 bg-slate-900/30">{String.fromCharCode(65 + idx)}</span>
                    <span className="text-sm md:text-[1rem] leading-7 text-slate-100">{answer}</span>
                  </div>
                </button>
              );
            })}
        </div>

        {answered && (
          <div className="rounded-2xl p-6 bg-black/25 border border-white/10">
            <p className="font-bold mb-2 text-cyan-100">{selectedAnswer === currentQuestion.correct ? '正解' : '不正解'}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{currentQuestion.explanation}</p>
          </div>
        )}

        {!answered && (
          <div className="rounded-2xl p-5 border border-amber-300/30 bg-amber-300/10">
            <button onClick={onToggleHint} className="inline-flex items-center gap-2 text-sm font-bold text-amber-200 hover:text-amber-100 transition">
              <Lightbulb size={16} />
              {showHint ? 'ヒントを隠す' : 'ヒントを見る'}
            </button>
            {showHint && (
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">
                {currentQuestion.hint ?? '問題文のキーワードを先に抽出して、選択肢を消去法で絞り込もう。'}
              </p>
            )}
          </div>
        )}
      </div>

      {answered && (
        <button onClick={onNext} className="w-full rounded-2xl py-4.5 font-bold text-slate-950 bg-gradient-to-r from-teal-300 to-cyan-200 hover:from-teal-200 hover:to-cyan-100 transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
          {currentQuestionIndex < totalQuestions - 1 ? <>次の問題へ <ChevronRight size={18} /></> : <>結果を見る <Trophy size={18} /></>}
        </button>
      )}
    </div>
  );
}
