import { RotateCcw, RefreshCw } from 'lucide-react';
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
  onRetry: () => void;
  onReset: () => void;
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
  onRetry,
  onReset,
}: Props) {
  const accuracy = sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0;
  const totalAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  const getCategoryName = (id: string) =>
    categories.find(c => c.id === id)?.name ?? id;

  return (
    <div className="space-y-8 py-12 max-w-2xl mx-auto">
      {/* Score Header */}
      <div className="text-center space-y-3">
        <div className="text-7xl font-black text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text">
          {score} pts
        </div>
        <h2 className="text-2xl font-bold">セッション完了！</h2>
        <div className="h-1 w-24 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto rounded-full" />
      </div>

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '回答数', value: `${sessionCorrect}/${sessionTotal}` },
          { label: '正答率', value: `${accuracy}%` },
          { label: 'ストリーク', value: `${streak}x` },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-800/50 rounded-xl p-4 border border-white/5 text-center">
            <div className="text-2xl font-bold text-cyan-300 mb-1">{stat.value}</div>
            <p className="text-xs text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Cumulative Stats */}
      <div className="bg-slate-800/40 rounded-xl p-5 border border-cyan-500/10">
        <h3 className="text-sm font-bold text-gray-300 mb-3">累計実績</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '累計スコア', value: totalScore.toLocaleString() },
            { label: 'レベル', value: `Lv.${level}` },
            { label: '全体正答率', value: `${totalAccuracy}%` },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-lg font-bold text-purple-300">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent History */}
      {history.length > 0 && (
        <div className="bg-slate-800/40 rounded-xl p-5 border border-white/5">
          <h3 className="text-sm font-bold text-gray-300 mb-3">最近の学習履歴</h3>
          <div className="space-y-2">
            {history.slice(0, 3).map((record, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-gray-400 py-1.5 border-b border-white/5 last:border-0">
                <span>{getCategoryName(record.category)}</span>
                <span className="font-mono">{record.correct}/{record.total} 正解</span>
                <span className="text-cyan-400 font-bold">{record.score}pt</span>
                <span className="text-gray-600">{new Date(record.date).toLocaleDateString('ja-JP')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRetry}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl transform hover:scale-[1.02] transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          同じ分野をもう一度
        </button>
        <button
          onClick={onReset}
          className="w-full border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <RotateCcw size={16} />
          分野選択に戻る
        </button>
      </div>
    </div>
  );
}
