# VSCode Claude 拡張 - 開発引き継ぎ要点

## 🎯 プロジェクト概要（1分版）

**プロジェクト**: exam-quest - ゲーム化学習プラットフォーム
**現状**: 基本情報技術者試験対応版 完成（React、97問）
**次ステップ**: リポジトリ化 → TypeScript化 → 応用情報試験対応

## 📦 現在のファイル

```
outputs/
├── kihon-joho-advanced.jsx     ← メインアプリ（これが本体）
├── PROJECT_HANDOFF.md          ← 詳細設計書
├── package.json.template       ← npm設定
├── vite.config.js.template     ← ビルド設定
├── tailwind.config.js.template ← CSS設定
├── README.md.template          ← プロジェクト説明
└── questions.json.template     ← 問題データ形式
```

## 🚀 すぐやることリスト（優先順）

### 1️⃣ リポジトリ初期化（1時間）
```bash
mkdir exam-quest && cd exam-quest
git init
npm init -y  # package.jsonテンプレートをコピー
npm install
```

### 2️⃣ プロジェクト構造化（2時間）
```
src/
├── App.jsx          ← kihon-joho-advanced.jsx をコピー・改名
├── components/
│   ├── Home.jsx
│   ├── CategorySelect.jsx
│   ├── QuizScreen.jsx
│   └── ResultScreen.jsx
├── data/
│   ├── questions.json   ← 問題データを別ファイルに
│   └── categories.js
└── main.jsx
```

### 3️⃣ TypeScript化（2時間）
- App.jsx → App.tsx に変更
- 型定義ファイル作成（`types/quiz.d.ts`）
- tsconfig.json セットアップ

### 4️⃣ LocalStorage対応（1時間）
- 学習履歴を保存する hook 作成
- セッション終了後の復帰機能

### 5️⃣ テスト環境構築（1時間）
- Jest + React Testing Library セットアップ
- コンポーネントテスト例作成

## 🎨 アプリの全体像

```
ホーム画面
    ↓
分野選択（8種類）
    ↓
クイズ画面
    ├─ 問題表示
    ├─ 4択回答
    ├─ 図解表示（右パネル）
    └─ 解説表示
    ↓
結果画面
    ├─ スコア表示
    ├─ 統計情報
    └─ 再試験 or 分野選択
```

## 🎮 ゲーム化の核

- **スコア**: 10点 + (ストリーク × 2)
- **レベル**: 50点ごとに +1
- **ストリーク**: 連続正解で加算、間違うと0
- **進捗**: 分野内の何問目かを可視化

## 📊 データ構造（重要）

```javascript
// 問題1つ = このオブジェクト
{
  id: 1,
  category: "アルゴリズム",
  question: "問題文",
  answers: ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  correct: 1,              // 正解のインデックス
  explanation: "なぜこれが正解か？",
  diagram: "merge-sort"    // 図解タイプ
}
```

## 🔧 開発時の注意点

### 分野別カラー（Tailwindクラス）
```javascript
algorithm: "from-blue-600 to-cyan-600"
network: "from-purple-600 to-pink-600"
database: "from-emerald-600 to-teal-600"
security: "from-red-600 to-orange-600"
programming: "from-indigo-600 to-blue-600"
hardware: "from-yellow-600 to-amber-600"
system: "from-green-600 to-emerald-600"
theory: "from-violet-600 to-purple-600"
```

### アニメーション活用
- `.animate-pulse` - 脈動（ボタン、スコア）
- `.transform.hover:scale-105` - ホバー時拡大
- `.transition-all.duration-300` - スムーズな遷移

## 🚀 次フェーズの機能（Phase 2）

### LocalStorage
```javascript
// 保存するデータ
{
  totalScore: 1500,
  level: 3,
  lastPlayDate: "2025-02-26",
  categoryStats: {
    algorithm: { attempted: 12, correct: 10 },
    network: { attempted: 15, correct: 13 },
    // ...
  }
}
```

### ダッシュボード表示
- 学習時間グラフ
- 分野ごとの正答率
- 得意・苦手分野の特定

## 📱 レスポンシブ対応

```javascript
// Tailwind ブレークポイント
md:grid-cols-2    // タブレット以上で2列
lg:grid-cols-3    // PC以上で3列
lg:col-span-2     // PCで2列分占有
```

## 🔗 重要なリンク

- [React公式](https://react.dev)
- [Vite公式](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [IPA試験情報](https://www.ipa.go.jp/)

## 💡 開発TIP

1. **問題データ追加**は JSON を編集するだけで OK
2. **新しい図解**は `getDiagramComponent()` に追加
3. **新試験対応**は `categoryColors` と `questionDatabase` を拡張

## 🎯 Phase 1 完了後のマイルストーン

- ✅ リポジトリ化
- ✅ TypeScript化
- ✅ LocalStorage対応
- ✅ テスト環境
- ✅ GitHub Actions CI/CD

これらが終わったら、応用情報試験のデータ（150問）を追加して Phase 2 へ

---

**質問がある場合**: PROJECT_HANDOFF.md を参照してください！
