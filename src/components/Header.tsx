import { Zap, Trophy, TrendingUp } from 'lucide-react';

interface Props {
  totalScore: number;
  level: number;
  streak: number;
  showBack?: boolean;
  onBack?: () => void;
}

export default function Header({ totalScore, level, streak, showBack, onBack }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-700/50 bg-slate-950/55 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="pill"><Zap size={14} className="text-amber-300" /> Lv.{level}</div>
          <div className="pill"><Trophy size={14} className="text-cyan-300" /> {totalScore.toLocaleString()} pt</div>
          {streak > 0 && <div className="pill"><TrendingUp size={14} className="text-emerald-300" /> {streak} streak</div>}
        </div>
        {showBack && (
          <button onClick={onBack} className="text-xs text-slate-300 hover:text-white transition">
            カテゴリに戻る
          </button>
        )}
      </div>
    </header>
  );
}
