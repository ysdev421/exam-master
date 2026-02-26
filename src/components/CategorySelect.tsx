import { Sparkles, Library, ExternalLink } from 'lucide-react';
import type { Category } from '../types';
import { questionDatabase } from '../data/questions';
import type { PastExamSet } from '../data/pastExams';
import { pastExamQuestionDatabase } from '../data/pastExams';

interface Props {
  categories: Category[];
  pastExamSets: PastExamSet[];
  onSelectCategory: (id: string) => void;
  onSelectPastExam: (setId: string) => void;
}

function combinations(n: number, r: number) {
  if (r > n || r <= 0) return 0;
  let result = 1;
  const k = Math.min(r, n - r);
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return Math.floor(result);
}

export default function CategorySelect({ categories, pastExamSets, onSelectCategory, onSelectPastExam }: Props) {
  return (
    <div className="space-y-8 py-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="section-title">学習モードを選択</h2>
        <p className="text-sm text-slate-300">カテゴリ演習か、過去問セット演習を選べます。</p>
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-cyan-200 inline-flex items-center gap-2"><Sparkles size={14} /> カテゴリ演習</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const total = (questionDatabase[cat.id] ?? []).length;
            const patterns = combinations(total, Math.min(6, total));
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`glass-card rounded-2xl p-5 text-left bg-gradient-to-br ${cat.color} border-white/15 hover:-translate-y-1 transition`}
              >
                <div className="flex justify-between mb-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <span className="chip">{total}問</span>
                </div>
                <h3 className="font-bold mb-1">{cat.name}</h3>
                <p className="text-xs text-white/85">約{patterns.toLocaleString()}パターン</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-amber-200 inline-flex items-center gap-2"><Library size={14} /> 過去問セット演習</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastExamSets.map((set) => {
            const count = (pastExamQuestionDatabase[set.id] ?? []).length;
            const isReady = count > 0;
            return (
              <button
                key={set.id}
                onClick={() => {
                  if (isReady) {
                    onSelectPastExam(set.id);
                    return;
                  }
                  window.open(set.sourceUrl, '_blank', 'noopener,noreferrer');
                }}
                className={`glass-card rounded-2xl p-5 text-left border transition ${
                  isReady
                    ? 'border-amber-300/20 hover:border-amber-300/45 hover:-translate-y-0.5'
                    : 'border-slate-500/30 hover:border-slate-400/60'
                }`}
              >
                <p className="text-xs text-amber-200/90 mb-1">IPA公開問題ベース</p>
                <h4 className="font-bold mb-1">{set.label}</h4>
                <p className="text-xs text-slate-300 mb-1">年度: {set.year} / 区分: {set.season} / 収録: {count}問</p>
                <p className="text-xs text-slate-400 inline-flex items-center gap-1">
                  <ExternalLink size={11} /> {isReady ? 'このセットで受験可能' : '未収録: 出典ページを開く'}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
