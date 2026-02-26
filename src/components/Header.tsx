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
    <div className="sticky top-0 z-50 backdrop-blur-md bg-black/35 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-2 text-sm">
          <div className="pill"><Zap size={14} className="text-amber-300" />Lv.{level}</div>
          <div className="pill"><Trophy size={14} className="text-cyan-300" />{totalScore.toLocaleString()} pt</div>
          {streak > 0 && <div className="pill"><TrendingUp size={14} className="text-emerald-300" />{streak} streak</div>}
        </div>
        {showBack && (
          <button onClick={onBack} className="text-xs text-slate-300 hover:text-white transition">
            カテゴリに戻る
          </button>
        )}
      </div>
    </div>
  );
}
