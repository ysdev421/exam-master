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
    <div className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-cyan-500/20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex gap-3 text-sm">
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-yellow-500/30">
            <Zap size={14} className="text-yellow-400" />
            <span className="font-bold text-yellow-300">Lv.{level}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-cyan-500/30">
            <Trophy size={14} className="text-cyan-400" />
            <span className="font-bold text-cyan-300">{totalScore.toLocaleString()}</span>
          </div>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-800/60 px-3 py-1.5 rounded-full border border-emerald-500/30">
              <TrendingUp size={14} className="text-emerald-400" />
              <span className="font-bold text-emerald-300">{streak}x</span>
            </div>
          )}
        </div>
        {showBack && (
          <button
            onClick={onBack}
            className="text-xs text-gray-400 hover:text-white transition px-3 py-1.5 rounded-full hover:bg-slate-700/50"
          >
            ← 分野に戻る
          </button>
        )}
      </div>
    </div>
  );
}
