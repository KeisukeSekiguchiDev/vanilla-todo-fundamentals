# プロジェクト開発ガイド

## 1. プロジェクト概要

| 項目 | 内容 |
|------|------|
| プロジェクト名 | vanilla-todo-fundamentals |
| 目的 | フロントエンド基礎技術の強化、素のJavaScriptによる状態管理・DOM操作の学習 |
| 利用形態 | 個人（ポートフォリオ・学習） |
| リポジトリ公開 | 公開（GitHub） |

### 学習目標
- 状態管理の基本概念（ステートとUI同期）
- 配列・オブジェクト操作（map/filter/find/reduce）
- localStorage APIの使い方
- UIとロジックの分離（関心の分離）
- レスポンシブデザインの実装

---

## 2. 技術スタック

| カテゴリ | 技術 |
|---------|------|
| 言語 | HTML5, CSS3, JavaScript (ES6+) |
| フレームワーク | なし（Vanilla JavaScript） |
| データストレージ | localStorage |
| ビルドツール | なし（直接ブラウザで動作） |
| テスト | 手動テスト（将来的にVitest導入検討） |

### 対応ブラウザ
- Chrome/Firefox/Edge（最新版）
- PC・スマートフォン（レスポンシブデザイン）

---

## 3. フォルダ構成

```
vanilla-todo-fundamentals/
├── .claude/
│   └── CLAUDE.md                # このファイル（プロジェクト開発ガイド）
├── docs/
│   ├── hearing/                 # ヒアリング結果
│   │   └── hearing-summary.md
│   ├── requirements/            # 要件定義
│   │   ├── 00_要件定義書.md
│   │   ├── 01_業務要件定義書.md
│   │   ├── 02_機能要件定義書.md
│   │   ├── 03_非機能要件定義書.md
│   │   ├── 04_画面一覧.md
│   │   └── 99_用語集.md
│   ├── design/
│   │   ├── external/            # 外部設計（基本設計）
│   │   │   ├── 00_基本設計書.md
│   │   │   ├── 01_システム構成図.md
│   │   │   ├── 02_画面一覧.md
│   │   │   ├── 03_画面設計書/
│   │   │   ├── 04_画面遷移図.md
│   │   │   └── 06_機能設計書/
│   │   └── internal/            # 内部設計（詳細設計）
│   │       ├── 00_詳細設計書.md
│   │       ├── 01_モジュール設計/
│   │       └── 02_シーケンス図/
│   ├── planning/                # 実装計画
│   │   ├── 00_実装計画書.md
│   │   ├── 01_wbs.md
│   │   └── 02_task-list.md
│   ├── sprints/                 # スプリント管理
│   │   ├── backlog.md
│   │   ├── backlog-details/     # T-001〜T-025
│   │   ├── definition-of-done.md
│   │   ├── velocity.md
│   │   └── sprint-001/
│   │       ├── plan.md
│   │       └── tasks.md
│   ├── progress/                # 進捗管理
│   │   ├── dashboard.md
│   │   ├── kanban-board.md
│   │   └── metrics-history.md
│   └── review/                  # レビュー結果
│       ├── requirements/
│       ├── external/
│       ├── internal/
│       └── planning/
├── src/                         # ★ソースコード
│   ├── index.html               # メインHTML
│   ├── css/
│   │   └── styles.css           # スタイルシート
│   └── js/                      # JavaScript
│       ├── storage.js           # ストレージ層
│       ├── todoStore.js         # 状態管理層
│       ├── todoView.js          # UI層
│       └── app.js               # 統合層
├── tests/                       # テストコード
│   ├── test.html
│   ├── test-storage.html
│   ├── test-toggle.html
│   └── manual-test-todoStore.html
└── README.md
```

---

## 4. 開発フェーズ

| フェーズ | 状態 | 完了日 | 備考 |
|---------|------|--------|------|
| ヒアリング | 完了 | 2025-12-13 | hearing-summary.md作成 |
| 要件定義 | 完了 | 2025-12-13 | 6ドキュメント作成 |
| 外部設計 | 完了 | 2025-12-13 | 画面設計・機能設計完了 |
| 内部設計 | 完了 | 2025-12-13 | モジュール設計・シーケンス図完了 |
| 実装計画 | 完了 | 2025-12-13 | WBS・タスクリスト作成 |
| Sprint-001計画 | 完了 | 2025-12-13 | 11タスク、14SP |
| Sprint-001実装 | 完了 | 2025-12-13 | T-001〜T-011完了、結合テスト100%成功 |
| Sprint-002 | 未着手 | - | T-012〜T-020予定 |

---

## 5. 要件サマリー

| 項目 | 内容 |
|------|------|
| 機能要件数 | 8件（Must: 5件、Nice to Have: 3件） |
| 非機能要件数 | 4件 |
| 主要機能 | ToDo追加、削除、完了切替、フィルタリング、永続化 |
| 対象ユーザー | 個人（学習者本人） |

### Must機能
- FR-001: ToDoアイテムの追加
- FR-002: ToDoアイテムの削除
- FR-003: ToDoアイテムの完了/未完了の切り替え
- FR-004: ToDoリストのフィルタリング
- FR-005: ローカルストレージへのデータ永続化

---

## 6. モジュール構成

| モジュール | ファイル | 責務 |
|-----------|---------|------|
| ストレージ層 | src/js/storage.js | localStorage操作、データ永続化 |
| 状態管理層 | src/js/todoStore.js | ToDoデータの追加・削除・更新・フィルタリング |
| UI層 | src/js/todoView.js | DOM操作、画面描画、HTMLエスケープ |
| 統合層 | src/js/app.js | 初期化、イベントリスナー設定、各層の連携 |

---

## 7. コーディング規約（プロジェクト固有）

### 命名規則
- ファイル名: ケバブケース（storage.js, todo-item.css）
- 変数名: キャメルケース（todoList, currentFilter）
- 関数名: キャメルケース、動詞始まり（addTodo, renderList）
- 定数: スネークケース大文字（STORAGE_KEY, MAX_LENGTH）
- CSSクラス: BEM記法（todo-item, todo-item__title, todo-item--completed）

### コメント規則
- 関数にはJSDoc形式のコメントを記載
- 複雑なロジックには説明コメントを追加
- TODOコメントは必ず解決してからコミット

---

## 8. Git管理方針

### コミット対象
- ソースコード（src/）
- README.md
- docs/requirements/
- docs/design/

### コミット対象外（.gitignore）
- docs/planning/
- docs/sprints/
- docs/progress/
- docs/review/

---

## 9. 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|-----|-----------|---------|--------|
| 2025-12-13 | 1.0 | 初版作成（全フェーズ完了後に遡及作成） | Claude Code |
| 2025-12-13 | 1.1 | Sprint-001完了（T-001〜T-011） | Claude Code |
| 2025-12-13 | 1.2 | ソースコードをsrc/ディレクトリに移動 | Claude Code |
