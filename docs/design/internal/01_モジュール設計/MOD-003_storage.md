# モジュール定義書: MOD-003 storage

## 1. 基本情報

| 項目 | 内容 |
|-----|------|
| モジュールID | MOD-003 |
| モジュール名 | storage |
| ファイル名 | storage.js |
| 責務 | localStorageの読み書き操作 |
| 対応要件 | FR-005 |
| 対応画面 | SCR-001 |
| 作成日 | 2025-12-13 |
| 更新日 | 2025-12-13 |

---

## 2. 概要

storageモジュールは、ブラウザのlocalStorageへのデータ保存・読み込みを担当する。JSON形式でのシリアライズ・デシリアライズ、エラーハンドリングを含む。

**責務:**
- タスクデータの永続化
- localStorage APIの抽象化
- JSON変換エラーの処理
- データ破損時の回復

---

## 3. 依存関係

| 依存先モジュール | 用途 |
|----------------|------|
| なし | ブラウザAPI（localStorage）のみを使用 |

---

## 4. エクスポート関数一覧

| 関数名 | 引数 | 戻り値 | 概要 |
|-------|------|--------|------|
| saveToStorage(todos) | todos: TodoItem[] | void | タスク配列をlocalStorageに保存 |
| loadFromStorage() | - | TodoItem[] \| null | localStorageからタスク配列を読み込み |

---

## 5. 定数定義

```javascript
const STORAGE_KEY = 'vanilla-todo-items';
```

| 定数名 | 値 | 説明 |
|-------|-----|------|
| STORAGE_KEY | `'vanilla-todo-items'` | localStorageのキー名 |

---

## 6. 関数詳細

### 6.1 saveToStorage(todos)

| 項目 | 内容 |
|-----|------|
| 概要 | タスク配列をJSON形式でlocalStorageに保存する |
| 引数 | todos: TodoItem[] - 保存するタスク配列 |
| 戻り値 | void |
| 副作用 | localStorageに書き込み |
| 例外 | QuotaExceededError（容量超過）等はcatchしてログ出力 |

**処理フロー:**
1. JSON.stringify()でタスク配列をJSON文字列に変換
2. localStorage.setItem()で保存
3. エラー発生時はコンソールログに出力

**実装例:**
```javascript
export function saveToStorage(todos) {
  try {
    const jsonString = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    console.error('[vanilla-todo-fundamentals] localStorageへの保存に失敗:', error);
    // ユーザーへのエラーメッセージは表示しない（要件定義による）
  }
}
```

**エラーケース:**

| エラー | 発生条件 | 対処 |
|-------|---------|------|
| QuotaExceededError | localStorage容量（5MB）超過 | コンソールログ出力、保存失敗 |
| SecurityError | localStorageが無効化されている | コンソールログ出力、保存失敗 |
| その他 | 予期しないエラー | コンソールログ出力、保存失敗 |

**保存データ例:**
```json
[
  {
    "id": "task-1702468800000",
    "text": "買い物に行く",
    "completed": false,
    "createdAt": "2025-12-13T10:00:00.000Z"
  }
]
```

---

### 6.2 loadFromStorage()

| 項目 | 内容 |
|-----|------|
| 概要 | localStorageからタスク配列を読み込む |
| 引数 | なし |
| 戻り値 | TodoItem[] \| null - タスク配列、またはnull（データなし） |
| 副作用 | データ破損時、localStorageから該当キーを削除 |
| 例外 | なし（内部でcatch） |

**処理フロー:**
1. localStorage.getItem()でJSON文字列を取得
2. データが存在しない場合はnullを返却
3. JSON.parse()でパース
4. パース成功 → データ型検証 → 配列なら返却
5. パース失敗 → 破損データを削除 → nullを返却

**実装例:**
```javascript
export function loadFromStorage() {
  try {
    const jsonString = localStorage.getItem(STORAGE_KEY);

    // データが存在しない（初回アクセス）
    if (jsonString === null) {
      return null;
    }

    const data = JSON.parse(jsonString);

    // データ型検証：配列であることを確認
    if (!Array.isArray(data)) {
      console.warn('[vanilla-todo-fundamentals] localStorageのデータが配列ではありません');
      localStorage.removeItem(STORAGE_KEY); // 不正データを削除
      return null;
    }

    return data;

  } catch (error) {
    // JSONパースエラー
    console.error('[vanilla-todo-fundamentals] localStorageの読込に失敗:', error);
    localStorage.removeItem(STORAGE_KEY); // 破損データを削除
    return null;
  }
}
```

**戻り値のパターン:**

| ケース | 戻り値 | 説明 |
|-------|--------|------|
| 正常: データ存在 | TodoItem[] | パース成功、配列を返却 |
| 正常: データなし | null | 初回アクセス |
| 異常: JSON不正 | null | パース失敗、破損データ削除 |
| 異常: 配列でない | null | 型検証失敗、不正データ削除 |

---

## 7. エラーハンドリング

### 7.1 保存エラー

| エラー種別 | 発生条件 | 対処 |
|-----------|---------|------|
| QuotaExceededError | 5MB容量超過 | コンソールログ出力、保存失敗 |
| SecurityError | localStorageが無効 | コンソールログ出力、保存失敗 |

**エラーログ例:**
```javascript
console.error('[vanilla-todo-fundamentals] localStorageへの保存に失敗:', error);
```

**ユーザーへの通知:**
- 本アプリでは通知しない（学習目的のため）
- 実務アプリでは「保存に失敗しました」等のメッセージ表示を推奨

---

### 7.2 読込エラー

| エラー種別 | 発生条件 | 対処 |
|-----------|---------|------|
| SyntaxError | JSON不正 | コンソールログ出力、破損データ削除、nullを返却 |
| TypeError | データが配列でない | コンソール警告出力、不正データ削除、nullを返却 |

**破損データの例:**
```
// 不正なJSON
localStorage.setItem('vanilla-todo-items', '{invalid json}');

// 配列でないデータ
localStorage.setItem('vanilla-todo-items', '{"key": "value"}');
```

---

## 8. データ検証

### 8.1 検証項目

| 検証項目 | 検証方法 | 不正時の対処 |
|---------|---------|------------|
| JSON形式 | JSON.parse() | 例外キャッチ → nullを返却 |
| 配列型 | Array.isArray() | falseなら → nullを返却 |

### 8.2 詳細検証（オプション）

**本アプリでは実装しない**が、実務では以下の検証も推奨：

| 検証項目 | 検証方法 |
|---------|---------|
| 各要素がオブジェクトか | `typeof item === 'object'` |
| id, text, completed, createdAtが存在するか | `'id' in item` |
| idが文字列か | `typeof item.id === 'string'` |
| completedがbooleanか | `typeof item.completed === 'boolean'` |

**実装例（参考）:**
```javascript
function validateTodoItem(item) {
  return (
    typeof item === 'object' &&
    typeof item.id === 'string' &&
    typeof item.text === 'string' &&
    typeof item.completed === 'boolean' &&
    typeof item.createdAt === 'string'
  );
}

export function loadFromStorage() {
  // ... 前述の実装 ...

  if (!Array.isArray(data)) {
    // ... 不正データ処理 ...
  }

  // 各要素を検証（オプション）
  const validTodos = data.filter(validateTodoItem);

  if (validTodos.length !== data.length) {
    console.warn('[vanilla-todo-fundamentals] 不正な要素を除外しました');
  }

  return validTodos;
}
```

---

## 9. localStorage仕様

### 9.1 基本仕様

| 項目 | 内容 |
|-----|------|
| ストレージ種類 | localStorage（Web Storage API） |
| スコープ | オリジン単位（同一ドメイン + プロトコル + ポート） |
| 容量制限 | 5MB（ブラウザの一般的な制限） |
| データ形式 | 文字列（JSON文字列として保存） |
| 有効期限 | 永続的（ユーザーがクリアするまで） |

### 9.2 ブラウザ互換性

| ブラウザ | localStorage対応 | 備考 |
|---------|-----------------|------|
| Chrome（最新版） | ✅ 対応 | - |
| Firefox（最新版） | ✅ 対応 | - |
| Edge（最新版） | ✅ 対応 | - |
| Safari（最新版） | ✅ 対応 | - |
| Internet Explorer | ❌ 対象外 | NFR-001-05により非対応 |

---

## 10. セキュリティ考慮

### 10.1 データスコープ

| 項目 | 内容 |
|-----|------|
| アクセス権限 | 同一オリジンのみ |
| 他サイトからのアクセス | Same-Origin Policyで不可 |
| サーバーへの送信 | なし（クライアントのみ） |

### 10.2 機密情報の扱い

| 項目 | 方針 |
|-----|------|
| 暗号化 | なし（本アプリは機密情報を扱わない） |
| 保存データ | タスクテキストのみ（平文） |
| 注意事項 | ユーザーに機密情報を入力させない |

**セキュリティ注意:**
- localStorageは暗号化されていない
- 機密情報（パスワード、個人情報）は保存しない
- XSS攻撃を受けた場合、localStorageの内容も漏洩する可能性がある

---

## 11. パフォーマンス考慮

### 11.1 容量管理

| 項目 | 内容 |
|-----|------|
| 最大容量 | 5MB |
| 1タスクあたりのサイズ | 約300バイト |
| 最大タスク数の目安 | 約16,000件 |
| 本アプリの上限 | 1,000件（NFR-003-06） |

**容量計算例:**
```
タスク1件のサイズ:
- id: "task-1702468800000" → 約20バイト
- text: 200文字 × 3バイト（UTF-8） → 600バイト
- completed: true → 5バイト
- createdAt: "2025-12-13T10:00:00.000Z" → 25バイト
- JSON構造のオーバーヘッド → 50バイト
合計: 約700バイト

最大タスク数: 5MB / 700バイト ≒ 7,142件
```

### 11.2 保存頻度

| 操作 | 保存タイミング |
|------|--------------|
| タスク追加 | 追加後、即座に保存 |
| タスク削除 | 削除後、即座に保存 |
| 完了切替 | 切替後、即座に保存 |

**最適化の余地:**
- debounce処理で保存頻度を減らす（連続操作時）
- 本アプリでは実装しない（学習目的のため）

---

## 12. デバッグ方法

### 12.1 Chrome DevToolsでの確認

```
1. F12キーでDevToolsを開く
2. Applicationタブを選択
3. Storage > Local Storage > file://（またはドメイン）
4. "vanilla-todo-items"キーを確認
```

### 12.2 手動でのデータクリア

**コンソールで実行:**
```javascript
// 特定キーのみ削除
localStorage.removeItem('vanilla-todo-items');

// localStorage全体をクリア
localStorage.clear();
```

### 12.3 テストデータの投入

**コンソールで実行:**
```javascript
const testData = [
  {
    id: 'task-1',
    text: 'テストタスク1',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    text: 'テストタスク2',
    completed: true,
    createdAt: new Date().toISOString()
  }
];

localStorage.setItem('vanilla-todo-items', JSON.stringify(testData));
```

---

## 13. テストケース

### 13.1 saveToStorage()のテスト

| テストケース | 入力 | 期待結果 |
|------------|------|---------|
| 正常: 空配列 | [] | localStorageに"[]"が保存される |
| 正常: タスク1件 | [task1] | localStorageにJSON文字列が保存される |
| 正常: タスク複数件 | [task1, task2] | localStorageにJSON文字列が保存される |
| 異常: 容量超過（モック） | 巨大配列 | エラーログ出力、保存失敗 |

### 13.2 loadFromStorage()のテスト

| テストケース | 前提条件 | 期待結果 |
|------------|---------|---------|
| 正常: データ存在 | localStorageに有効なJSON | 配列が返る |
| 正常: データなし | localStorageが空 | nullが返る |
| 異常: JSON不正 | "{invalid json}" | nullが返る、破損データ削除 |
| 異常: 配列でない | '{"key": "value"}' | nullが返る、不正データ削除 |

---

## 14. 関連モジュール

| モジュールID | 関連内容 |
|------------|---------|
| MOD-001 (todoStore.js) | 本モジュールの関数を呼び出す |

---

## 15. 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|-----|-----------|---------|--------|
| 2025-12-13 | 1.0 | 初版作成 | Claude Code |
