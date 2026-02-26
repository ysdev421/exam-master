import { useMemo, useState } from 'react';
import { Sparkles, Library, ExternalLink, Timer, Bookmark } from 'lucide-react';
import type { Category, LearningTag } from '../types';
import { questionDatabase } from '../data/questions';
import type { PastExamSet } from '../data/pastExams';
import { pastExamQuestionDatabase } from '../data/pastExams';

interface Props {
  categories: Category[];
  pastExamSets: PastExamSet[];
  onSelectCategory: (id: string) => void;
  onSelectPastExam: (setId: string) => void;
  onStartMockExam: (count: number) => void;
  onStartWeakDrill: () => void;
  onStartBookmarkDrill: () => void;
  onStartLearningTagDrill: (tag: LearningTag) => void;
  onStartDueReviewDrill: () => void;
  weakQuestionCount: number;
  bookmarkQuestionCount: number;
  learningTagCounts: Record<LearningTag, number>;
  dueReviewCount: number;
  onExportData: () => void;
  onImportData: (file: File) => Promise<{ ok: boolean; message: string }>;
  onResetAllData: () => void;
}

function combination(n: number, r: number): number {
  if (r > n || r < 0) return 0;
  if (r === 0 || r === n) return 1;
  const k = Math.min(r, n - r);
  let result = 1;
  for (let i = 1; i <= k; i += 1) result = (result * (n - k + i)) / i;
  return result;
}

function estimateCategoryPatterns(totalQuestions: number): number {
  const sessionSize = Math.min(6, totalQuestions);
  if (sessionSize <= 0) return 0;
  return Math.round(combination(totalQuestions, sessionSize));
}

function seasonLabel(season: PastExamSet['season']): string {
  return season === 'Spring' ? '春期' : '秋期';
}

function normalizePastExamLabel(set: PastExamSet): string {
  const suffix = set.id.endsWith('_fe_am') ? '午前' : set.id.endsWith('_fe_pm') ? '午後' : '';
  const eraYear = set.year - 2018;
  const era = eraYear > 0 ? `令和${eraYear}年` : `${set.year}年`;
  return `${era} ${seasonLabel(set.season)}${suffix ? ` ${suffix}` : ''} 基本情報`;
}

const LEARNING_TAG_LABELS: Record<LearningTag, string> = {
  unknown: '全く分からない',
  partial: 'なんとなく分かる',
  'knew-but-missed': '分かっていたのにミス',
  careless: 'ケアレスミス',
};

export default function CategorySelect({
  categories,
  pastExamSets,
  onSelectCategory,
  onSelectPastExam,
  onStartMockExam,
  onStartWeakDrill,
  onStartBookmarkDrill,
  onStartLearningTagDrill,
  onStartDueReviewDrill,
  weakQuestionCount,
  bookmarkQuestionCount,
  learningTagCounts,
  dueReviewCount,
  onExportData,
  onImportData,
  onResetAllData,
}: Props) {
  const [showReadyOnly, setShowReadyOnly] = useState(false);
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [dataMessage, setDataMessage] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalSets = pastExamSets.length;
    const readySets = pastExamSets.filter(set => (pastExamQuestionDatabase[set.id] ?? []).length > 0).length;
    return { totalSets, readySets };
  }, [pastExamSets]);

  const years = useMemo(() => [...new Set(pastExamSets.map(s => s.year))].sort((a, b) => b - a), [pastExamSets]);

  const shownSets = useMemo(() => {
    let list = [...pastExamSets];
    if (showReadyOnly) list = list.filter(set => (pastExamQuestionDatabase[set.id] ?? []).length > 0);
    if (yearFilter !== 'all') list = list.filter(set => set.year === yearFilter);
    list.sort((a, b) => {
      const ac = (pastExamQuestionDatabase[a.id] ?? []).length;
      const bc = (pastExamQuestionDatabase[b.id] ?? []).length;
      if ((bc > 0) !== (ac > 0)) return bc > 0 ? 1 : -1;
      if (b.year !== a.year) return b.year - a.year;
      return a.id.localeCompare(b.id);
    });
    return list;
  }, [pastExamSets, showReadyOnly, yearFilter]);

  return (
    <div className="space-y-8 py-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="section-title">学習モードを選択</h2>
        <p className="text-sm text-slate-300">カテゴリ演習か、過去問セット演習を選べます。</p>
      </div>

      <section className="space-y-3">
        <div className="glass-card rounded-2xl p-4 border border-cyan-300/20">
          <h3 className="text-sm font-bold text-cyan-200 mb-2">データ管理</h3>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={onExportData} className="chip hover:border-cyan-300/70 hover:text-cyan-100 transition">学習データを書き出し</button>
            <label className="chip hover:border-cyan-300/70 hover:text-cyan-100 transition cursor-pointer">
              学習データを読み込み
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const result = await onImportData(file);
                  setDataMessage(result.message);
                  e.currentTarget.value = '';
                }}
              />
            </label>
            <button
              onClick={() => {
                const ok = window.confirm('学習データをすべて初期化します。元に戻せません。実行しますか？');
                if (ok) {
                  onResetAllData();
                  setDataMessage('学習データを初期化しました。');
                }
              }}
              className="chip border-rose-300/45 text-rose-200 hover:border-rose-300/80 hover:text-rose-100 transition"
            >
              全学習データを初期化
            </button>
            {dataMessage && <span className="text-xs text-slate-300">{dataMessage}</span>}
          </div>
        </div>

        <div className="w-full glass-card rounded-2xl p-5 text-left border border-emerald-300/35 bg-gradient-to-r from-emerald-400/10 to-cyan-300/10">
          <p className="text-xs text-emerald-200/90 mb-1 inline-flex items-center gap-1"><Timer size={12} /> 模擬試験モード</p>
          <h3 className="font-bold text-lg mb-1">時間制限チャレンジ</h3>
          <p className="text-xs text-slate-300 mb-3">カテゴリ・過去問を横断して出題。時間切れで自動採点します。</p>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 40].map((count) => (
              <button key={count} onClick={() => onStartMockExam(count)} className="chip hover:border-emerald-300/70 hover:text-emerald-100 transition">{count}問</button>
            ))}
          </div>
        </div>

        <button
          onClick={onStartWeakDrill}
          disabled={weakQuestionCount === 0}
          className={`w-full glass-card rounded-2xl p-4 text-left border transition ${
            weakQuestionCount > 0 ? 'border-rose-300/35 bg-rose-400/10 hover:border-rose-300/60' : 'border-slate-600/30 bg-slate-800/30 opacity-60 cursor-not-allowed'
          }`}
        >
          <p className="text-xs text-rose-200/90 mb-1">弱点復習ドリル</p>
          <h3 className="font-bold">ミスした問題だけを演習</h3>
          <p className="text-xs text-slate-300 mt-1">対象件数: {weakQuestionCount}問</p>
        </button>

        <button
          onClick={onStartBookmarkDrill}
          disabled={bookmarkQuestionCount === 0}
          className={`w-full glass-card rounded-2xl p-4 text-left border transition ${
            bookmarkQuestionCount > 0 ? 'border-amber-300/35 bg-amber-400/10 hover:border-amber-300/60' : 'border-slate-600/30 bg-slate-800/30 opacity-60 cursor-not-allowed'
          }`}
        >
          <p className="text-xs text-amber-200/90 mb-1 inline-flex items-center gap-1"><Bookmark size={12} /> ブックマーク演習</p>
          <h3 className="font-bold">保存した問題だけを演習</h3>
          <p className="text-xs text-slate-300 mt-1">保存件数: {bookmarkQuestionCount}問</p>
        </button>

        <div className="glass-card rounded-2xl p-4 text-left border border-cyan-300/30 bg-cyan-400/10 space-y-2">
          <p className="text-xs text-cyan-200/90 mb-1">理解度別ドリル</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(LEARNING_TAG_LABELS).map(([tag, label]) => (
              <button
                key={tag}
                onClick={() => onStartLearningTagDrill(tag as LearningTag)}
                disabled={learningTagCounts[tag as LearningTag] === 0}
                className={`chip ${learningTagCounts[tag as LearningTag] === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:border-cyan-300/70 hover:text-cyan-100 transition'}`}
              >
                {label} ({learningTagCounts[tag as LearningTag]}問)
              </button>
            ))}
          </div>
          <button
            onClick={onStartDueReviewDrill}
            disabled={dueReviewCount === 0}
            className={`chip ${dueReviewCount === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:border-cyan-300/70 hover:text-cyan-100 transition'}`}
          >
            期限到来レビュー ({dueReviewCount}問)
          </button>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-cyan-200 inline-flex items-center gap-2"><Sparkles size={14} /> カテゴリ演習</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const total = (questionDatabase[cat.id] ?? []).length;
            const patterns = estimateCategoryPatterns(total);
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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-amber-200 inline-flex items-center gap-2"><Library size={14} /> 過去問セット演習</h3>
          <div className="text-xs text-slate-300 inline-flex items-center gap-3">
            <span>収録済み {stats.readySets} / 全 {stats.totalSets}</span>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input type="checkbox" checked={showReadyOnly} onChange={(e) => setShowReadyOnly(e.target.checked)} />
              <span>収録済みのみ</span>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button onClick={() => setYearFilter('all')} className={`chip ${yearFilter === 'all' ? 'border-cyan-300/80 text-cyan-200' : ''}`}>全年度</button>
          {years.map((year) => (
            <button key={year} onClick={() => setYearFilter(year)} className={`chip ${yearFilter === year ? 'border-cyan-300/80 text-cyan-200' : ''}`}>{year}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shownSets.map((set) => {
            const count = (pastExamQuestionDatabase[set.id] ?? []).length;
            const isReady = count > 0;
            return (
              <button
                key={set.id}
                onClick={() => {
                  if (isReady) onSelectPastExam(set.id);
                  else window.open(set.questionPdfUrl || set.sourceUrl, '_blank', 'noopener,noreferrer');
                }}
                className={`glass-card rounded-2xl p-5 text-left border transition ${
                  isReady ? 'border-amber-300/20 hover:border-amber-300/45 hover:-translate-y-0.5' : 'border-slate-500/30 hover:border-slate-400/60'
                }`}
              >
                <p className="text-xs text-amber-200/90 mb-1">IPA公開問題ベース</p>
                <h4 className="font-bold mb-1">{normalizePastExamLabel(set)}</h4>
                <p className="text-xs text-slate-300 mb-1">年度: {set.year} / 区分: {seasonLabel(set.season)} / 収録: {count}問</p>
                <p className="text-xs text-slate-400 inline-flex items-center gap-1">
                  <ExternalLink size={11} /> {isReady ? 'このセットで受験可能' : '未収録: 問題PDFを開く'}
                </p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
