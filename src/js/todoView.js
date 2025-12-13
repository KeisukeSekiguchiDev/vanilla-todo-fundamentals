/**
 * todoView.js
 * モジュールID: MOD-002
 *
 * 責務: DOM生成とUI描画
 * - タスクリストのHTML生成
 * - DOM要素の更新
 * - XSS対策(HTMLエスケープ)
 * - フィルタボタンの状態更新
 * - 状態を持たない（ステートレス）
 *
 * 対応要件: FR-001, FR-002, FR-003, FR-004
 */

/**
 * HTMLエスケープを行い、XSS攻撃を防ぐ
 *
 * @param {string} text - エスケープ対象のテキスト
 * @returns {string} エスケープ済みテキスト
 *
 * @description
 * ユーザー入力をinnerHTMLで表示する前に、特殊文字をHTMLエンティティに変換します。
 * textContentプロパティを使用することで、ブラウザの組み込みエスケープ機能を利用します。
 *
 * @example
 * escapeHTML('<script>alert("XSS")</script>')
 * // => '&lt;script&gt;alert("XSS")&lt;/script&gt;'
 */
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * 1つのタスクのHTML文字列を生成する
 *
 * @param {TodoItem} todo - タスクオブジェクト
 * @returns {string} HTML文字列
 *
 * @description
 * 単一のタスクアイテムのHTMLを生成します。
 * - チェックボックス: completedプロパティに基づいてchecked属性を設定
 * - タスクテキスト: completedの場合はcompletedクラスを追加（取り消し線表示）
 * - 削除ボタン: data-id属性にタスクIDを設定
 * - XSS対策: タスクテキストはescapeHTML()でエスケープ
 *
 * @example
 * const todo = { id: 'task-123', text: '買い物', completed: true };
 * createTodoItemHTML(todo)
 * // => '<li class="todo-item" data-id="task-123" role="listitem">...'
 */
function createTodoItemHTML(todo) {
  const checkedAttr = todo.completed ? 'checked' : '';
  const completedClass = todo.completed ? 'todo-item--completed' : '';

  return `
    <li class="todo-item ${completedClass}" data-id="${todo.id}" role="listitem">
      <input
        type="checkbox"
        class="todo-item__checkbox"
        data-id="${todo.id}"
        ${checkedAttr}
        aria-label="タスクを完了にする"
      />
      <span class="todo-item__text">${escapeHTML(todo.text)}</span>
      <button
        class="todo-item__delete"
        data-id="${todo.id}"
        aria-label="タスクを削除"
      >
        削除
      </button>
    </li>
  `;
}

/**
 * タスクリストをDOMに描画する
 *
 * @param {Array<TodoItem>} todos - 描画するタスク配列
 * @returns {void}
 *
 * @description
 * タスク配列を受け取り、DOM要素を生成してリストを描画します。
 * - タスクが0件の場合: 空メッセージを表示
 * - タスクが1件以上の場合: 各タスクのHTML要素を生成し、一括でinnerHTMLを更新
 * - パフォーマンス: innerHTML一括更新により、リフロー・リペイントを最小化
 *
 * @example
 * const todos = [
 *   { id: 'task-1', text: 'タスク1', completed: false },
 *   { id: 'task-2', text: 'タスク2', completed: true }
 * ];
 * renderTodoList(todos);
 */
export function renderTodoList(todos) {
  const todoListElement = document.getElementById('todo-list');

  if (todos.length === 0) {
    todoListElement.innerHTML = `
      <p class="empty-message" role="status">タスクがありません</p>
    `;
    return;
  }

  const html = todos.map(todo => createTodoItemHTML(todo)).join('');
  todoListElement.innerHTML = html;
}

/**
 * フィルタボタンの選択状態を更新する
 *
 * @param {string} activeFilter - 'all', 'active', 'completed'
 * @returns {void}
 *
 * @description
 * フィルタボタンのactiveクラスを更新します。
 * - 全フィルタボタンから一度activeクラスを削除
 * - 選択されたフィルタボタンにactiveクラスを追加
 * - CSSでactive状態のスタイルを適用（背景色変更等）
 *
 * @example
 * updateFilterButtons('active');
 * // => "未完了"ボタンにactiveクラスが付与される
 */
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

/**
 * タスク入力欄をクリアする
 *
 * @returns {void}
 *
 * @description
 * #todo-input要素のvalueを空にします。
 * - タスク追加成功後に呼び出されることを想定
 *
 * @example
 * clearInput();
 * // => 入力欄が空になる
 */
export function clearInput() {
  const inputElement = document.getElementById('todo-input');
  inputElement.value = '';
}
