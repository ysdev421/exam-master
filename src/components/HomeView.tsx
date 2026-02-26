import { ChevronRight, BookOpen, Target, Lightbulb, Trophy } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function HomeView({ onStart }: Props) {
  return (
    <div className="space-y-12 text-center py-16">
      <div className="space-y-5">
        <div className="inline-block px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-medium mb-2">
          基本情報技術者試験 午前試験対策
        </div>
        <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-blue-300 to-purple-400 bg-clip-text text-transparent leading-tight">
          ExamQuest
        </h1>
        <p className="text-gray-400 max-w-sm mx-auto text-sm leading-relaxed">
          全8分野・97問の練習問題で<br />合格を目指そう
        </p>
      </div>

      <button
        onClick={onStart}
        className="group inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white font-bold py-4 px-10 rounded-xl text-lg transform hover:scale-105 transition-all duration-300 shadow-lg shadow-cyan-500/25"
      >
        学習を開始する
        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          { icon: BookOpen, label: '全分野対応', desc: '午前試験の全8分野', color: 'text-cyan-400', border: 'border-cyan-500/20' },
          { icon: Target, label: '97問収録', desc: '体系的な練習問題', color: 'text-purple-400', border: 'border-purple-500/20' },
          { icon: Lightbulb, label: 'ビジュアル解説', desc: '図解で深く理解', color: 'text-emerald-400', border: 'border-emerald-500/20' },
          { icon: Trophy, label: 'ゲーム化学習', desc: 'スコア・レベル制', color: 'text-pink-400', border: 'border-pink-500/20' },
        ].map(({ icon: Icon, label, desc, color, border }, i) => (
          <div key={i} className={`bg-slate-800/40 rounded-xl p-5 border ${border} backdrop-blur-sm`}>
            <Icon size={28} className={`mx-auto mb-3 ${color}`} />
            <h3 className="font-bold text-sm mb-1">{label}</h3>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 max-w-md mx-auto">
        ※ 掲載問題はオリジナル練習問題です。実際の試験問題とは異なります。
      </p>
    </div>
  );
}
