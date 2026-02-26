import type { Category } from '../types';

export const categories: Category[] = [
  { id: 'algorithm', name: 'アルゴリズム', color: 'from-blue-600 to-cyan-600', icon: '🧠', questions: 12 },
  { id: 'network', name: 'ネットワーク', color: 'from-purple-600 to-pink-600', icon: '🌐', questions: 15 },
  { id: 'database', name: 'データベース', color: 'from-emerald-600 to-teal-600', icon: '🗄️', questions: 12 },
  { id: 'security', name: 'セキュリティ', color: 'from-red-600 to-orange-600', icon: '🔐', questions: 10 },
  { id: 'programming', name: 'プログラミング', color: 'from-indigo-600 to-blue-600', icon: '💻', questions: 14 },
  { id: 'hardware', name: 'ハードウェア', color: 'from-yellow-600 to-amber-600', icon: '🖥️', questions: 8 },
  { id: 'system', name: 'システム開発', color: 'from-green-600 to-emerald-600', icon: '⚙️', questions: 11 },
  { id: 'theory', name: '情報理論', color: 'from-violet-600 to-purple-600', icon: '📘', questions: 9 },
];
