import { ChevronRight, ShieldCheck, BookOpenCheck, Sparkles } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function HomeView({ onStart }: Props) {
  return (
    <div className="space-y-8 py-10 animate-fade-in">
      <section className="glass-card rounded-3xl p-8 md:p-10 text-center space-y-5">
        <p className="inline-flex items-center gap-2 rounded-full px-3 py-1 border border-cyan-300/35 bg-cyan-300/10 text-cyan-100 text-xs">
          <Sparkles size={13} /> FE CBT Practice
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">Exam Quest</h1>
        <p className="max-w-2xl mx-auto text-slate-300 text-sm md:text-base leading-relaxed">
          出題は毎回ランダム。短時間で繰り返し解いて、基本情報試験の得点感覚を育てる学習モードです。
        </p>
        <button onClick={onStart} className="btn-primary max-w-sm mx-auto py-3.5">
          学習を開始する <ChevronRight size={18} />
        </button>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <article className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-lg inline-flex items-center gap-2"><BookOpenCheck size={18} /> 合格ライン</h2>
          <ul className="text-sm text-slate-300 space-y-1.5">
            <li>科目A: 1000点中 600点以上</li>
            <li>科目B: 1000点中 600点以上</li>
            <li>両方を満たして合格</li>
          </ul>
          <p className="text-xs text-slate-400">2026-02-26 時点の公開情報に基づく表示</p>
        </article>

        <article className="glass-card rounded-2xl p-6 space-y-3">
          <h2 className="font-bold text-lg inline-flex items-center gap-2"><ShieldCheck size={18} /> 利用上の注意</h2>
          <ul className="text-sm text-slate-300 space-y-1.5">
            <li>本サービスは学習支援の非公式コンテンツ</li>
            <li>公式問題の転載は行わない</li>
            <li>合否を保証するものではない</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
