# 基本情報技術者試験対策アプリ - プロジェクト引き継ぎドキュメント

## 📋 プロジェクト概要

**プロジェクト名**：`exam-quest`（仮）
**説明**：複数の資格試験に対応した、ゲーム化された Web 学習プラットフォーム

## 🎯 プロジェクトゴール

1. **第一段階**：基本情報技術者試験（午前試験）対策アプリとして完成
2. **第二段階**：他の IT 系試験（応用情報技術者試験など）に対応
3. **将来**：ITパスポート、情報セキュリティマネジメント、各種プログラミング認定試験など複数試験をサポート

## 📁 現在のファイル構成

```
outputs/
├── kihon-joho-advanced.jsx    # メインアプリ（React）- 完成版
├── kihon-joho-app.jsx         # 初期版（参考用）
└── PROJECT_HANDOFF.md         # このファイル
```

## 🏗️ 推奨リポジトリ構成

リポジトリ作成時は、以下の構成を推奨します：

```
exam-quest/
├── README.md                  # プロジェクト概要
├── CONTRIBUTING.md            # 貢献ガイド
├── LICENSE                    # MIT License推奨
├── package.json               # 依存関係管理
├── vite.config.js            # Vite設定（React+TypeScript推奨）
├── tsconfig.json             # TypeScript設定
├── .gitignore
├── .env.example              # 環境変数テンプレート
│
├── src/
│   ├── main.jsx              # エントリーポイント
│   ├── App.jsx               # ルートコンポーネント
│   ├── index.css             # グローバルスタイル
│   │
│   ├── components/
│   │   ├── Home.jsx
│   │   ├── CategorySelect.jsx
│   │   ├── QuizScreen.jsx
│   │   ├── ResultScreen.jsx
│   │   └── Header.jsx
│   │
│   ├── data/
│   │   ├── questions/
│   │   │   ├── kihon.json         # 基本情報（現在実装済み）
│   │   │   ├── ouyou.json         # 応用情報（将来用）
│   │   │   └── itpassport.json    # ITパスポート（将来用）
│   │   │
│   │   └── categories.js          # カテゴリー定義
│   │
│   ├── hooks/
│   │   ├── useQuiz.js
│   │   ├── useScore.js
│   │   └── useLocalStorage.js     # ローカルストレージ管理
│   │
│   ├── utils/
│   │   ├── analytics.js           # スコア・進捗管理
│   │   ├── diagram.js             # 図解コンポーネント管理
│   │   └── constants.js           # 定数定義
│   │
│   └── styles/
│       ├── tailwind.config.js
│       └── globals.css
│
├── public/
│   └── index.html
│
└── docs/
    ├── ARCHITECTURE.md        # アーキテクチャ設計書
    ├── FEATURE_ROADMAP.md     # 機能ロードマップ
    └── EXAM_DATA_SPEC.md      # 問題データフォーマット仕様
```

## 🔧 技術スタック

### 現在の実装
- **React** 18.x
- **Tailwind CSS** - スタイリング
- **Lucide React** - アイコン
- **Recharts** - グラフ表示（将来用）

### 推奨される追加ライブラリ
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "zustand": "^4.x.x",           // 状態管理
    "axios": "^1.x.x",              // API通信（将来のバックエンド対応）
    "date-fns": "^2.x.x",          // 日付管理
    "clsx": "^2.x.x",              // クラス名管理
    "recharts": "^2.x.x"           // チャート表示
  },
  "devDependencies": {
    "typescript": "^5.x.x",
    "vite": "^4.x.x",
    "tailwindcss": "^3.x.x",
    "autoprefixer": "^10.x.x",
    "postcss": "^8.x.x",
    "@vitejs/plugin-react": "^4.x.x"
  }
}
```

## 📊 データ仕様

### 問題データのフォーマット（JSON）
```javascript
{
  "id": 1,
  "category": "アルゴリズム",
  "question": "問題文",
  "answers": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
  "correct": 1,                    // 正解インデックス（0-3）
  "explanation": "解説文",
  "diagram": "merge-sort",         // 図解タイプ（キー）
  "difficulty": 1,                 // 難易度（1-5） ※将来実装
  "tags": ["ソート", "計算量"],    // タグ（検索・フィルタリング用）
  "source": "2023年秋期"          // 出題年度
}
```

## 🎮 実装済み機能

### コアシステム
- ✅ 8分野対応（計97問）
- ✅ 4択問題の出題・採点
- ✅ リアルタイムスコア表示
- ✅ レベルシステム（50点でLv.UP）
- ✅ ストリーク機能（連続正解でボーナス）
- ✅ 分野別カテゴリ選択
- ✅ 進捗バー表示
- ✅ 詳細解説
- ✅ ビジュアル図解（12種類）
- ✅ レスポンシブデザイン
- ✅ ゲーム化UI

## 🚀 実装予定の機能（優先順）

### Phase 1（次フェーズ）
- [ ] **ローカルストレージ対応** - 学習履歴の保存
- [ ] **データベース分離** - 問題データをJSONから外出し
- [ ] **コンポーネント分割** - 単一ファイルを複数ファイルに
- [ ] **TypeScript化** - 型安全性向上
- [ ] **単体テスト** - Jest + React Testing Library
- [ ] **応用情報技術者試験対応** - 問題データ追加（約150問）

### Phase 2
- [ ] **ユーザーアカウント機能** - 学習成績の永続化
- [ ] **弱点分析** - 間違えやすい分野の特定
- [ ] **学習統計ダッシュボード** - 進捗可視化
- [ ] **ランキング機能** - 社内競争・モチベーション向上
- [ ] **模擬試験モード** - 時間制限付き本番形式

### Phase 3
- [ ] **バックエンド構築** - Node.js/Express + MongoDB
- [ ] **マルチデバイス同期** - クラウド同期
- [ ] **他の試験対応** - ITパスポート、セキュリティマネジメント等
- [ ] **ソーシャル機能** - 学習仲間との共有・励まし
- [ ] **AI分析** - 個人に最適な学習プラン提案

## 🎨 デザイン・UX要素

### カラースキーム（分野別）
```javascript
const categoryColors = {
  algorithm: "from-blue-600 to-cyan-600",
  network: "from-purple-600 to-pink-600",
  database: "from-emerald-600 to-teal-600",
  security: "from-red-600 to-orange-600",
  programming: "from-indigo-600 to-blue-600",
  hardware: "from-yellow-600 to-amber-600",
  system: "from-green-600 to-emerald-600",
  theory: "from-violet-600 to-purple-600",
}
```

### UI/UX原則
- ✨ モダンネオンゲーム風
- 📱 スマホファースト設計
- 🎮 ゲーム化（スコア・レベル・ストリーク）
- 🎯 視覚的フィードバック（アニメーション）
- ♿ アクセシビリティ考慮
- ⚡ パフォーマンス重視

## 📱 デプロイ方法

### 推奨: Vercel
```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

### または Netlify
```bash
# ビルド
npm run build

# Netlifyにドラッグ&ドロップ
# または CI/CD自動デプロイ
```

### 環境変数
現在は不要。将来のバックエンド対応時に以下が必要：
```
VITE_API_BASE_URL=https://api.example.com
VITE_ANALYTICS_ID=xxxxx
```

## 📖 開発ガイドライン

### コード品質
- ESLint + Prettier を導入
- Husky で pre-commit フック設定
- GitHub Actions で CI/CD構築

### Git ワークフロー
```
main（本番用）
 └── develop（開発用）
      ├── feature/component-split
      ├── feature/local-storage
      └── feature/ouyou-exam
```

### ブランチ命名規則
- `feature/機能名`
- `fix/バグ名`
- `docs/ドキュメント名`
- `refactor/リファクタリング内容`

## 🔐 セキュリティ考慮事項

- ✅ 学習データは LocalStorage に保存（プライベート）
- 🔜 バックエンド実装時：HTTPS必須
- 🔜 ユーザー認証：JWT推奨
- 🔜 データ暗号化：本番環境で検討

## 📞 参考情報

### 資料
- [基本情報技術者試験 過去問](https://www.ipa.go.jp/shiken/sbk.html)
- [React公式ドキュメント](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

### リンク
- [IPA（情報処理推進機構）](https://www.ipa.go.jp/)
- [基本情報技術者試験要項](https://www.ipa.go.jp/shiken/sbk_gaiyo.html)

## 💭 開発者への引き継ぎメモ

### 重要ポイント
1. **問題データの拡張性** - JSON形式で簡単に追加可能な設計
2. **分野ごとのカラーコーディング** - ユーザビリティ向上
3. **ストリーク機能** - ゲーミング要素の核
4. **図解の重要性** - ビジュアル学習が理解を深める

### 注意点
- 現在は 97問だけで、実際の試験対策には不足
- 問題の難易度分けがまだ
- 連続正解記録などの統計機能が未実装
- 暗記ではなく「理解」に重点を置く問題設計が重要

### 次のステップ（推奨）
1. TypeScript化 + コンポーネント分割
2. LocalStorage 対応 + 進捗保存
3. 応用情報試験の問題データ追加
4. テスト駆動開発の導入

---

**作成日**：2025年2月26日
**バージョン**：v0.1.0
**ステータス**：基本情報技術者試験対応版 完了 → VSCode開発引き継ぎ

