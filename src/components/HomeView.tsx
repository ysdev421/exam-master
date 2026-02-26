import { ChevronRight, ShieldCheck, Sparkles, BookOpenCheck } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export default function HomeView({ onStart }: Props) {
  return (
    <div className="space-y-10 py-12 animate-fade-in">
      <section className="text-center space-y-5">
        <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 text-sm">
          <Sparkles size={14} /> FE CBTトレーニング
        </p>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-balance">
          EXAM QUEST
        </h1>
        <p className="text-slate-300 max-w-xl mx-auto text-sm md:text-base">
          1セッション6問の高速演習。毎回ランダムな出題パターンで、実戦に近い判断力を鍛える。
        </p>
        <button
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-xl px-8 py-4 font-bold text-slate-950 bg-gradient-to-r from-teal-300 to-cyan-200 hover:from-teal-200 hover:to-cyan-100 transition"
        >
          学習を開始する
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <article className="glass-card rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-lg inline-flex items-center gap-2"><BookOpenCheck size={18} /> 基本情報試験の合格ライン</h2>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>科目A: 1,000点満点中 600点以上</li>
            <li>科目B: 1,000点満点中 600点以上</li>
            <li>どちらか一方でも600点未満なら不合格</li>
          </ul>
          <p className="text-xs text-slate-400">出典: IPA 試験要綱 / CBT-S FE案内（2026年2月26日確認）</p>
        </article>

        <article className="glass-card rounded-2xl p-5 space-y-3">
          <h2 className="font-bold text-lg inline-flex items-center gap-2"><ShieldCheck size={18} /> 法務・コンプライアンス方針</h2>
          <ul className="text-sm text-slate-300 space-y-2">
            <li>問題は学習用のオリジナル再構成であり、公式問題の転載を行わない</li>
            <li>本サービスは非公式。合否結果を保証しない</li>
            <li>商標・著作権に配慮し、権利侵害が疑われる素材は除外する</li>
          </ul>
        </article>
      </section>
    </div>
  );
}
