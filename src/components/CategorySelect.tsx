import { Star } from 'lucide-react';
import type { Category } from '../types';

interface Props {
  categories: Category[];
  onSelectCategory: (id: string) => void;
}

export default function CategorySelect({ categories, onSelectCategory }: Props) {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">学習分野を選択</h2>
        <p className="text-gray-400 text-sm">得意な分野から始めるもよし、苦手な分野を鍛えるもよし</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`group relative bg-gradient-to-br ${cat.color} rounded-xl p-6 text-left transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 border border-white/10 hover:border-white/30 shadow-lg hover:shadow-xl`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-3xl">{cat.icon}</span>
              <span className="text-xs bg-black/30 px-2 py-1 rounded-full font-bold">{cat.questions}問</span>
            </div>
            <h3 className="text-base font-bold mb-1">{cat.name}</h3>
            <p className="text-xs text-white/60">タップして開始</p>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-xl transition-colors duration-300" />
          </button>
        ))}
      </div>

      <div className="bg-slate-800/40 rounded-xl p-6 border border-white/5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <Star className="text-yellow-400 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <h3 className="font-bold mb-2 text-sm">学習のコツ</h3>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>✨ 毎日5分でも継続することが重要</li>
              <li>🔥 同じ分野を繰り返し学習して定着させよう</li>
              <li>📈 連続正解でボーナス点！ストリークを伸ばそう</li>
              <li>💡 わからない問題は解説をしっかり読もう</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
