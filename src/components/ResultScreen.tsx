import { RotateCcw, RefreshCw, ShieldCheck } from 'lucide-react';
import type { SessionRecord } from '../types';
import { categories } from '../data/categories';

interface Props {
  score: number;
  sessionCorrect: number;
  sessionTotal: number;
  streak: number;
  totalScore: number;
  level: number;
  totalAnswered: number;
  totalCorrect: number;
  history: SessionRecord[];
  patternId: string;
  selectedCategory: string | null;
  onStartWeakCategory: (categoryId: string) => void;
  onRetry: () => void;
  onReset: () => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function estimatePassProbability(sessionAccuracy: number, categoryAccuracy: number, totalAccuracy: number, totalAnswered: number): number {
  const weighted = sessionAccuracy * 0.55 + categoryAccuracy * 0.3 + totalAccuracy * 0.15;
  const confidenceBoost = clamp(totalAnswered / 200, 0, 1) * 4;
  const x = (weighted + confidenceBoost - 60) / 7.5;
  return clamp(Math.round((1 / (1 + Math.exp(-x))) * 100), 1, 99);
}

export default function ResultScreen({
  score,
  sessionCorrect,
  sessionTotal,
  streak,
  totalScore,
  level,
  totalAnswered,
  totalCorrect,
  history,
  patternId,
  selectedCategory,
  onStartWeakCategory,
  onRetry,
  onReset,
}: Props) {
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const totalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const categoryHistory = selectedCategory ? history.filter(record => record.category === selectedCategory).slice(0, 6) : [];
  const categoryAnswered = categoryHistory.reduce((sum, row) => sum + row.total, 0);
  const categoryCorrect = categoryHistory.reduce((sum, row) => sum + row.correct, 0);
  const categoryAccuracy = categoryAnswered > 0 ? Math.round((categoryCorrect / categoryAnswered) * 100) : accuracy;
  const passProbability = estimatePassProbability(accuracy, categoryAccuracy, totalAccuracy, totalAnswered);

  const perCategory = categories
    .map(cat => {
      const rows = history.filter(row => row.category === cat.id).slice(0, 6);
      const answered = rows.reduce((sum, row) => sum + row.total, 0);
      const correct = rows.reduce((sum, row) => sum + row.correct, 0);
      const score = answered > 0 ? Math.round((correct / answered) * 100) : null;
      return { id: cat.id, name: cat.name, score };
    })
    .filter(item => item.score !== null) as Array<{ id: string; name: string; score: number }>;

  const weakTop3 = [...perCategory].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="space-y-6 py-8 max-w-4xl mx-auto animate-fade-in">
      <section className="glass-card rounded-3xl p-7 text-center space-y-2">
        <p className="text-xs text-slate-400">Pattern {patternId}</p>
        <div className="text-5xl md:text-6xl font-black text-cyan-200">{score} pts</div>
        <h2 className="text-xl md:text-2xl font-bold">セッション完了</h2>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[{ label: '正答', value: `${sessionCorrect}/${sessionTotal}` }, { label: '正答率', value: `${accuracy}%` }, { label: '連続正解', value: `${streak}` }, { label: '合格予想', value: `${passProbability}%` }].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4 text-center">
            <p className="text-xl font-bold text-cyan-200">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </section>

      <section className="glass-card rounded-2xl p-5 space-y-2">
        <h3 className="font-bold">合格ライン目安</h3>
        <p className="text-sm text-slate-300">科目A・科目Bともに 600/1000 以上が必要</p>
        <p className="text-sm text-slate-300">今回 {accuracy}% / 分野最近 {categoryAccuracy}% / 累計 {totalAccuracy}%</p>
      </section>

      {weakTop3.length > 0 && (
        <section className="glass-card rounded-2xl p-5 space-y-3">
          <h3 className="font-bold">次にやるべき復習分野</h3>
          <p className="text-sm text-slate-300">{weakTop3.map((w, i) => `${i + 1}. ${w.name}(${w.score}%)`).join(' / ')}</p>
          <button onClick={() => onStartWeakCategory(weakTop3[0].id)} className="btn-primary py-3">
            最弱分野を復習する
          </button>
        </section>
      )}

      <section className="glass-card rounded-2xl p-5">
        <p className="text-sm text-slate-300">Total Score: {totalScore.toLocaleString()} / Level: {level}</p>
      </section>

      <section className="glass-card rounded-2xl p-4 text-xs text-slate-300 inline-flex items-start gap-2 w-full">
        <ShieldCheck size={16} className="text-emerald-300 mt-0.5" />
        <span>本サービスは学習支援の非公式コンテンツです。公式試験問題の転載は行わず、合否の保証は行いません。</span>
      </section>

      <div className="space-y-3">
        <button onClick={onRetry} className="btn-primary py-3.5"><RefreshCw size={16} /> 別パターンで再挑戦</button>
        <button onClick={onReset} className="btn-ghost py-3.5 inline-flex items-center justify-center gap-2"><RotateCcw size={16} /> カテゴリ選択に戻る</button>
      </div>
    </div>
  );
}
