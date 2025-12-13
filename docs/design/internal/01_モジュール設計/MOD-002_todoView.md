# モジュール定義書: MOD-002 todoView

## 1. 基本情報

| 項目 | 内容 |
|-----|------|
| モジュールID | MOD-002 |
| モジュール名 | todoView |
| ファイル名 | todoView.js |
| 責務 | DOM生成とUI描画 |
| 対応要件 | FR-001, FR-002, FR-003, FR-004 |
| 対応画面 | SCR-001 |
| 作成日 | 2025-12-13 |
| 更新日 | 2025-12-13 |

---

## 2. 概要

todoViewモジュールは、タスクリストのUIを生成・更新する責務を持つ。状態は持たず、受け取ったデータをもとにDOM要素を生成・更新する純粋な描画モジュールである。

**設計原則:**
- 状態を持たない（ステートレス）
- DOM操作のみを担当
- データの加工はtodoStoreに委譲

---

## 3. 依存関係

| 依存先モジュール | 用途 |
|----------------|------|
| なし | DOM APIのみを使用 |

---

## 4. エクスポート関数一覧

| 関数名 | 引数 | 戻り値 | 概要 |
|-------|------|--------|------|
| renderTodoList(todos) | todos: TodoItem[] | void | タスクリストを描画 |
| updateFilterButtons(activeFilter) | activeFilter: string | void | フィルタボタンの選択状態を更新 |
| clearInput() | - | void | 入力欄をクリア |

---

## 5. 関数詳細

### 5.1 renderTodoList(todos)

| 項目 | 内容 |
|-----|------|
| 概要 | タスク配列を受け取り、DOM要素を生成してリストを描画する |
| 引数 | todos: TodoItem[] - 描画するタスク配列 |
| 戻り値 | void |
| 副作用 | #todo-list要素のinnerHTMLを更新 |

**処理フロー:**
1. タスク配列が空の場合、空メッセージを表示
2. タスク配列が1件以上の場合、各タスクのHTML要素を生成
3. #todo-list要素のinnerHTMLを一括更新

**実装例:**
```javascript
export function renderTodoList(todos) {
  const todoListElement = document.getElementById('todo-list');

  if (todos.length === 0) {
    todoListElement.innerHTML = `
      <p class="empty-message" role="status">タスクがありません</p>
    `;
    return;
  }

  const html = todos.map(todo => createTodoItemHTML(todo)).join('');
  todoListElement.innerHTML = `<ul role="list">${html}</ul>`;
}
```

---

### 5.2 createTodoItemHTML(todo)

| 項目 | 内容 |
|-----|------|
| 概要 | 1つのタスクのHTML文字列を生成する |
| 引数 | todo: TodoItem - タスクオブジェクト |
| 戻り値 | string - HTML文字列 |
| 副作用 | なし |

**HTML構造:**
```html
<li class="todo-item" data-id="task-123">
  <input
    type="checkbox"
    class="todo-checkbox"
    data-id="task-123"
    checked
    aria-label="タスクを完了にする"
  />
  <span class="todo-text completed">買い物に行く</span>
  <button
    class="delete-button"
    data-id="task-123"
    aria-label="タスクを削除"
  >
    削除
  </button>
</li>
```

**実装例:**
```javascript
function createTodoItemHTML(todo) {
  const checkedAttr = todo.completed ? 'checked' : '';
  const completedClass = todo.completed ? 'completed' : '';

  return `
    <li class="todo-item" data-id="${todo.id}" role="listitem">
      <input
        type="checkbox"
        class="todo-checkbox"
        data-id="${todo.id}"
        ${checkedAttr}
        aria-label="タスクを完了にする"
      />
      <span class="todo-text ${completedClass}">${escapeHTML(todo.text)}</span>
      <button
        class="delete-button"
        data-id="${todo.id}"
        aria-label="タスクを削除"
      >
        削除
      </button>
    </li>
  `;
}
```

**XSS対策:**
- タスクテキストは`escapeHTML()`でエスケープ
- `data-id`属性は動的生成されるが、システムが生成したIDのため安全

---

### 5.3 escapeHTML(text)

| 項目 | 内容 |
|-----|------|
| 概要 | HTMLエスケープを行い、XSS攻撃を防ぐ |
| 引数 | text: string - エスケープ対象のテキスト |
| 戻り値 | string - エスケープ済みテキスト |
| 副作用 | なし |

**エスケープ対象文字:**
| 文字 | エスケープ後 |
|-----|------------|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| `'` | `&#x27;` |

**実装例:**
```javascript
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

**代替実装（正規表現版）:**
```javascript
function escapeHTML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
```

---

### 5.4 updateFilterButtons(activeFilter)

| 項目 | 内容 |
|-----|------|
| 概要 | フィルタボタンの選択状態を更新する |
| 引数 | activeFilter: string - 'all', 'active', 'completed' |
| 戻り値 | void |
| 副作用 | フィルタボタンのCSSクラスを更新 |

**処理フロー:**
1. 全フィルタボタンから`active`クラスを削除
2. 選択されたフィルタボタンに`active`クラスを追加

**実装例:**
```javascript
export function updateFilterButtons(activeFilter) {
  const buttons = document.querySelectorAll('.filter-button');

  buttons.forEach(button => {
    const filter = button.dataset.filter;
    if (filter === activeFilter) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}
```

**HTML構造:**
```html
<button class="filter-button active" data-filter="all">すべて</button>
<button class="filter-button" data-filter="active">未完了</button>
<button class="filter-button" data-filter="completed">完了</button>
```

---

### 5.5 clearInput()

| 項目 | 内容 |
|-----|------|
| 概要 | タスク入力欄をクリアする |
| 引数 | なし |
| 戻り値 | void |
| 副作用 | #todo-input要素のvalueを空にする |

**実装例:**
```javascript
export function clearInput() {
  const inputElement = document.getElementById('todo-input');
  inputElement.value = '';
}
```

**使用タイミング:**
- タスク追加成功後

---

## 6. DOM要素の参照

### 6.1 固定DOM要素

| ID | 要素 | 用途 |
|----|------|------|
| #todo-list | `<div>` | タスクリストのコンテナ |
| #todo-input | `<input>` | タスク入力欄 |
| .filter-button | `<button>` | フィルタボタン（複数） |

### 6.2 動的DOM要素

| クラス | 要素 | 生成タイミング |
|-------|------|--------------|
| .todo-item | `<li>` | renderTodoList()実行時 |
| .todo-checkbox | `<input[type="checkbox"]>` | 各タスク生成時 |
| .todo-text | `<span>` | 各タスク生成時 |
| .delete-button | `<button>` | 各タスク生成時 |
| .empty-message | `<p>` | タスク0件時 |

---

## 7. CSSクラス設計

### 7.1 タスクアイテムのクラス

| クラス | 適用条件 | スタイル |
|-------|---------|---------|
| .todo-item | 常に適用 | リストアイテムのベーススタイル |
| .todo-text | 常に適用 | タスクテキストのベーススタイル |
| .todo-text.completed | completed === true | 取り消し線、グレー文字 |

**CSS例:**
```css
.todo-text {
  color: #333333;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #999999;
}
```

### 7.2 フィルタボタンのクラス

| クラス | 適用条件 | スタイル |
|-------|---------|---------|
| .filter-button | 常に適用 | ボタンのベーススタイル |
| .filter-button.active | 選択中 | 背景色: #0066CC、文字色: #FFFFFF |

**CSS例:**
```css
.filter-button {
  background-color: #E0E0E0;
  color: #333333;
  border: 1px solid #CCCCCC;
  padding: 8px 16px;
  cursor: pointer;
}

.filter-button.active {
  background-color: #0066CC;
  color: #FFFFFF;
}
```

---

## 8. アクセシビリティ対応

### 8.1 ARIA属性

| 要素 | ARIA属性 | 値 | 目的 |
|------|---------|-----|------|
| タスクリスト | role | "list" | リストであることを明示 |
| タスクアイテム | role | "listitem" | リスト項目であることを明示 |
| チェックボックス | aria-label | "タスクを完了にする" | 操作の意味を明示 |
| 削除ボタン | aria-label | "タスクを削除" | 操作の意味を明示 |
| 空メッセージ | role | "status" | 状態変化を通知 |

### 8.2 セマンティックHTML

| 要素 | 使用目的 |
|------|---------|
| `<ul>` | タスクリストのコンテナ |
| `<li>` | 各タスクアイテム |
| `<input type="checkbox">` | 完了切替 |
| `<button>` | 削除ボタン |
| `<span>` | タスクテキスト |

---

## 9. パフォーマンス考慮

### 9.1 DOM操作の最適化

| 項目 | 方針 |
|-----|------|
| 再描画方式 | innerHTML一括更新（全体再描画） |
| イベント委譲 | 親要素でイベントを受け取る |
| 差分更新 | 本アプリでは不採用（学習目的のため） |

**innerHTML一括更新の利点:**
- コードがシンプル
- タスク数が少ない場合（〜100件）、パフォーマンス問題なし

**改善の余地:**
- タスク数が1000件を超える場合、仮想DOM等の採用を検討
- 部分更新（個別のli要素のみ更新）

---

## 10. セキュリティ考慮

### 10.1 XSS対策

| 項目 | 対策 |
|-----|------|
| ユーザー入力の表示 | escapeHTML()でエスケープ |
| innerHTML使用 | エスケープ済みテキストのみ使用 |

**脆弱性のあるコード例（NG）:**
```javascript
// ❌ ユーザー入力を直接innerHTML
todoTextElement.innerHTML = todo.text; // XSS脆弱性
```

**安全なコード例（OK）:**
```javascript
// ✅ エスケープしてから使用
const html = `<span>${escapeHTML(todo.text)}</span>`;
```

---

## 11. テストケース

### 11.1 renderTodoList()のテスト

| テストケース | 入力 | 期待結果 |
|------------|------|---------|
| 正常: タスク3件 | 3件の配列 | 3つのli要素が生成される |
| 正常: タスク0件 | 空配列 | "タスクがありません"が表示される |
| 正常: 完了タスク | completed: true | チェックボックスがチェック状態、取り消し線 |
| 正常: 未完了タスク | completed: false | チェックボックスが未チェック、通常表示 |
| セキュリティ: XSS | text: "<script>alert('XSS')</script>" | エスケープされて表示される |

### 11.2 updateFilterButtons()のテスト

| テストケース | 入力 | 期待結果 |
|------------|------|---------|
| 正常: すべて | "all" | "すべて"ボタンにactiveクラス |
| 正常: 未完了 | "active" | "未完了"ボタンにactiveクラス |
| 正常: 完了 | "completed" | "完了"ボタンにactiveクラス |

### 11.3 clearInput()のテスト

| テストケース | 前提条件 | 期待結果 |
|------------|---------|---------|
| 正常: 入力欄クリア | 入力欄に"テスト"と入力済み | 入力欄が空になる |

---

## 12. 関連モジュール

| モジュールID | 関連内容 |
|------------|---------|
| MOD-004 (app.js) | 本モジュールの関数を呼び出す |

---

## 13. 変更履歴

| 日付 | バージョン | 変更内容 | 変更者 |
|-----|-----------|---------|--------|
| 2025-12-13 | 1.0 | 初版作成 | Claude Code |
