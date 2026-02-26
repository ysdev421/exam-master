import { Sparkles } from 'lucide-react';
import type { Category } from '../types';
import { questionDatabase } from '../data/questions';

interface Props {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

function combinations(n: number, r: number) {
  if (r > n || r <= 0) return 0;
  let result = 1;
  const k = Math.min(r, n - r);
  for (let i = 1; i <= k; i += 1) {
    result = (result * (n - k + i)) / i;
  }
  return Math.floor(result);
}

export default function CategorySelect({ categories, onSelectCategory }: Props) {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">分野を選択</h2>
        <p className="text-slate-300 text-sm">毎回6問をランダム抽出。カテゴリごとに多数の出題パターンを生成します。</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const total = (questionDatabase[cat.id] ?? []).length;
          const patterns = combinations(total, Math.min(6, total));
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`group relative bg-gradient-to-br ${cat.color} rounded-2xl p-5 text-left hover:-translate-y-1 transition border border-white/15`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-black/30">{total}問</span>
              </div>
              <h3 className="font-bold mb-1">{cat.name}</h3>
              <p className="text-xs text-white/80 inline-flex items-center gap-1">
                <Sparkles size={12} /> 約{patterns.toLocaleString()}パターン
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
