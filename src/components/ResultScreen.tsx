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
  onRetry: () => void;
  onReset: () => void;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

function estimatePassProbability(
  sessionAccuracy: number,
  categoryAccuracy: number,
  totalAccuracy: number,
  totalAnswered: number,
): number {
  const weighted = sessionAccuracy * 0.55 + categoryAccuracy * 0.3 + totalAccuracy * 0.15;
  const confidenceBoost = clamp(totalAnswered / 200, 0, 1) * 4;
  const adjusted = weighted + confidenceBoost;

  const x = (adjusted - 60) / 7.5;
  const probability = 1 / (1 + Math.exp(-x));
  return clamp(Math.round(probability * 100), 1, 99);
}

function toHeatColor(accuracy: number): string {
  if (accuracy >= 75) return 'bg-emerald-400/25 border-emerald-300/40';
  if (accuracy >= 60) return 'bg-amber-400/20 border-amber-300/40';
  return 'bg-rose-400/20 border-rose-300/40';
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
  onRetry,
  onReset,
}: Props) {
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const totalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const categoryHistory = selectedCategory
    ? history.filter(record => record.category === selectedCategory).slice(0, 6)
    : [];
  const categoryAnswered = categoryHistory.reduce((sum, row) => sum + row.total, 0);
  const categoryCorrect = categoryHistory.reduce((sum, row) => sum + row.correct, 0);
  const categoryAccuracy = categoryAnswered > 0 ? Math.round((categoryCorrect / categoryAnswered) * 100) : accuracy;

  const passProbability = estimatePassProbability(accuracy, categoryAccuracy, totalAccuracy, totalAnswered);
  const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name ?? id;
  const perCategory = categories
    .map(cat => {
      const rows = history.filter(row => row.category === cat.id).slice(0, 6);
      const answered = rows.reduce((sum, row) => sum + row.total, 0);
      const correct = rows.reduce((sum, row) => sum + row.correct, 0);
      const score = answered > 0 ? Math.round((correct / answered) * 100) : null;
      return { id: cat.id, name: cat.name, score, samples: rows.length };
    })
    .filter(item => item.score !== null) as Array<{ id: string; name: string; score: number; samples: number }>;
  const weakTop3 = [...perCategory].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <div className="space-y-7 py-10 max-w-3xl mx-auto animate-fade-in">
      <div className="text-center space-y-2">
        <div className="text-6xl font-black text-teal-200 animate-score-pop">{score} pts</div>
        <h2 className="text-2xl font-bold">セッション完了</h2>
        <p className="text-xs text-slate-400">Pattern {patternId}</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-3">
        {[{ label: '正答', value: `${sessionCorrect}/${sessionTotal}` }, { label: '正答率', value: `${accuracy}%` }, { label: '連続正解', value: `${streak}` }, { label: '合格予想', value: `${passProbability}%` }].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4 text-center">
            <div className="text-xl font-bold text-cyan-200">{stat.value}</div>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-2xl p-5 space-y-2">
        <h3 className="font-bold">合格ライン目安</h3>
        <p className="text-sm text-slate-300">FEは科目A・科目Bともに 600/1000 以上が必要です。</p>
        <p className="text-sm text-slate-300">今回: {accuracy}% / この分野の最近: {categoryAccuracy}% / 累計: {totalAccuracy}%</p>
        <p className="text-sm text-slate-300">判定: {accuracy >= 60 ? '合格ライン相当' : '追加学習推奨'}</p>
      </div>

      <div className="glass-card rounded-2xl p-5">
        <h3 className="font-bold mb-2">累計実績</h3>
        <p className="text-sm text-slate-300">Total Score: {totalScore.toLocaleString()} / Level: {level} / 累計正答率: {totalAccuracy}%</p>
      </div>

      {perCategory.length > 0 && (
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <h3 className="font-bold">分野別ヒートマップ</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {perCategory.map(item => (
              <div key={item.id} className={`rounded-lg border p-3 ${toHeatColor(item.score)}`}>
                <div className="flex items-center justify-between text-sm">
                  <span>{item.name}</span>
                  <span className="font-bold">{item.score}%</span>
                </div>
              </div>
            ))}
          </div>
          {weakTop3.length > 0 && (
            <div className="rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-3">
              <p className="text-sm font-bold mb-1">次にやるべき復習分野</p>
              <p className="text-xs text-slate-300">
                {weakTop3.map((w, i) => `${i + 1}. ${w.name}(${w.score}%)`).join(' / ')}
              </p>
            </div>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <h3 className="font-bold mb-3">直近の学習履歴</h3>
          <div className="space-y-2 text-xs text-slate-300">
            {history.slice(0, 3).map((record, i) => (
              <div key={i} className="flex items-center justify-between border-b border-white/10 pb-2 last:border-0">
                <span>{getCategoryName(record.category)}</span>
                <span>{record.correct}/{record.total}</span>
                <span>{record.score}pt</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card rounded-2xl p-4 text-xs text-slate-300 inline-flex items-start gap-2 w-full">
        <ShieldCheck size={16} className="text-emerald-300 mt-0.5" />
        <span>本サービスは学習支援の非公式コンテンツです。公式試験問題の転載は行わず、合否の保証は行いません。</span>
      </div>

      <div className="space-y-3">
        <button onClick={onRetry} className="w-full rounded-xl py-3.5 font-bold text-slate-950 bg-gradient-to-r from-teal-300 to-cyan-200 hover:from-teal-200 hover:to-cyan-100 transition flex items-center justify-center gap-2">
          <RefreshCw size={16} /> 別パターンで再挑戦
        </button>
        <button onClick={onReset} className="w-full rounded-xl py-3.5 border border-white/20 text-slate-200 hover:bg-white/10 transition flex items-center justify-center gap-2">
          <RotateCcw size={16} /> カテゴリ選択に戻る
        </button>
      </div>
    </div>
  );
}
