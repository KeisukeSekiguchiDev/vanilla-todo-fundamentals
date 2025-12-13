# Vanilla ToDo App

フレームワークを使わずに実装したシンプルなToDoアプリケーションです。
フロントエンド基礎技術（状態管理、DOM操作、データ永続化）の学習を目的としています。

## Demo

**Live Demo**: [https://keisukesekiguchidev.github.io/vanilla-todo-fundamentals/](https://keisukesekiguchidev.github.io/vanilla-todo-fundamentals/)

## Features

- **ToDoの追加**: テキスト入力でタスクを追加
- **ToDoの削除**: 不要なタスクを削除
- **完了/未完了の切り替え**: チェックボックスで状態を切り替え
- **フィルタリング**: 「すべて」「未完了」「完了」で絞り込み
- **データ永続化**: localStorageで保存（ブラウザを閉じてもデータが残る）
- **XSS対策**: HTMLエスケープによるセキュリティ対策済み
- **アクセシビリティ**: ARIA属性によるスクリーンリーダー対応

## Tech Stack

| カテゴリ | 技術 |
|---------|------|
| 言語 | HTML5, CSS3, JavaScript (ES6+) |
| フレームワーク | なし（Vanilla JavaScript） |
| データストレージ | localStorage |
| ビルドツール | 不要（直接ブラウザで動作） |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │
│                  (エントリーポイント)                   │
└──────────────────────┬──────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────┐
│                     app.js                           │
│              (統合層・イベント制御)                     │
└──────┬────────────────┬────────────────┬────────────┘
       │                │                │
┌──────▼─────┐  ┌───────▼───────┐  ┌─────▼─────────┐
│ todoStore.js│  │  todoView.js  │  │  storage.js   │
│ (状態管理)   │  │   (UI描画)    │  │ (永続化)      │
└─────────────┘  └───────────────┘  └───────────────┘
```

### モジュール構成

| モジュール | 責務 |
|-----------|------|
| `storage.js` | localStorageへの読み書き、エラーハンドリング |
| `todoStore.js` | ToDo配列の管理（追加・削除・更新・フィルタリング） |
| `todoView.js` | DOM操作、HTMLエスケープ、UI更新 |
| `app.js` | 初期化、イベントリスナー、各モジュールの連携 |

## Getting Started

### 必要環境

- モダンブラウザ（Chrome, Firefox, Edge 最新版）
- Node.js（ローカルサーバー用、オプション）

### 起動方法

#### 方法1: ローカルサーバーで起動（推奨）

```bash
# リポジトリをクローン
git clone https://github.com/KeisukeSekiguchiDev/vanilla-todo-fundamentals.git
cd vanilla-todo-fundamentals

# ローカルサーバーを起動
npm run serve
```

ブラウザが自動で開きます。

#### 方法2: 直接開く

`src/index.html` をブラウザで直接開く
（※ ES Modulesを使用しているため、一部ブラウザでは動作しない場合があります）

### npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run serve` | アプリを起動 |
| `npm run test:integration` | 結合テストを実行 |
| `npm run test:view` | UIテストを実行 |

## Project Structure

```
vanilla-todo-fundamentals/
├── src/                    # ソースコード
│   ├── index.html          # メインHTML
│   ├── css/
│   │   └── styles.css      # スタイルシート
│   └── js/
│       ├── storage.js      # ストレージ層
│       ├── todoStore.js    # 状態管理層
│       ├── todoView.js     # UI層
│       └── app.js          # 統合層
├── tests/                  # テストコード
├── docs/                   # ドキュメント
│   ├── requirements/       # 要件定義書
│   └── design/             # 設計書
└── README.md
```

## Documentation

このプロジェクトは要件定義から設計まで体系的にドキュメント化しています。

- [要件定義書](docs/requirements/00_要件定義書.md)
- [機能要件定義書](docs/requirements/02_機能要件定義書.md)
- [基本設計書](docs/design/external/00_基本設計書.md)
- [詳細設計書](docs/design/internal/00_詳細設計書.md)

## Learning Objectives

このプロジェクトで学習した内容：

- **状態管理**: データとUIの同期、単一方向データフロー
- **モジュール分離**: 関心の分離（MVC的な設計）
- **DOM操作**: createElement, addEventListener, クエリセレクタ
- **ES Modules**: import/exportによるモジュール化
- **localStorage API**: JSONによるデータ永続化
- **セキュリティ**: XSS対策（HTMLエスケープ）
- **アクセシビリティ**: ARIA属性、セマンティックHTML

## Testing

テストはブラウザベースで実行します。

```bash
# 結合テストを実行
npm run test:integration
```

### テスト結果

| テスト種別 | 件数 | 成功率 |
|-----------|------|--------|
| 単体テスト | 13件 | 100% |
| 結合テスト | 22件 | 100% |
| 機能テスト | 26件 | 100% |
| **合計** | **61件** | **100%** |

## Future Improvements

- [ ] レスポンシブデザイン対応
- [ ] TypeScript移行
- [ ] Playwright E2Eテスト自動化
- [ ] PWA対応（オフライン動作）
- [ ] ドラッグ&ドロップによる並び替え

## License

MIT License

## Author

**Keisuke Sekiguchi** ([@KeisukeSekiguchiDev](https://github.com/KeisukeSekiguchiDev))

- GitHub: [KeisukeSekiguchiDev](https://github.com/KeisukeSekiguchiDev)

---

> このプロジェクトはフロントエンド基礎技術の学習用に作成されました。
