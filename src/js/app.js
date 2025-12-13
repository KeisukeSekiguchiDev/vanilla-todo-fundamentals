/**
 * app.js
 * モジュールID: MOD-004
 *
 * 責務: アプリケーション統合とイベントハンドリング
 * - アプリケーション初期化
 * - DOMイベントリスナーの登録
 * - ユーザー操作のハンドリング
 * - 各モジュール（todoStore, todoView, storage）の連携
 *
 * 対応要件: FR-001, FR-002, FR-003, FR-004, FR-005
 */

import { addTodo, deleteTodo, toggleTodo, filterTodos, loadTodos, getTodos } from './todoStore.js';
import { renderTodoList, updateFilterButtons, clearInput } from './todoView.js';

/**
 * 現在のフィルタ状態（モジュールスコープ変数）
 * @type {string}
 */
let currentFilter = 'all';

/**
 * アプリケーション初期化処理
 *
 * @returns {void}
 *
 * @description
 * DOMContentLoadedイベントで呼び出される初期化関数です。
 * - localStorageからデータをロード
 * - イベントリスナーを設定
 * - 初期描画を実行
 */
function init() {
  // localStorageからデータをロード
  loadTodos();

  // イベントリスナーを設定
  setupEventListeners();

  // 初期描画
  render();
}

/**
 * 全てのイベントリスナーを設定する
 *
 * @returns {void}
 *
 * @description
 * DOM要素に対してイベントリスナーを登録します。
 * - 追加ボタン: クリックイベント
 * - 入力欄: Enterキー押下イベント
 * - フィルタボタン: クリックイベント
 * - タスクリスト: クリックイベント（イベント委譲）
 */
function setupEventListeners() {
  // 追加ボタンのクリックイベント
  const addButton = document.getElementById('add-button');
  if (addButton) {
    addButton.addEventListener('click', handleAddTodo);
  }

  // 入力欄のEnterキーイベント
  const inputElement = document.getElementById('todo-input');
  if (inputElement) {
    inputElement.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        handleAddTodo();
      }
    });
  }

  // フィルタボタンのクリックイベント
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      handleFilterChange(filter);
    });
  });

  // タスクリストのクリックイベント（イベント委譲）
  const todoList = document.getElementById('todo-list');
  if (todoList) {
    todoList.addEventListener('click', (event) => {
      const target = event.target;

      // 削除ボタンのクリック
      if (target.classList.contains('todo-item__delete')) {
        const id = target.dataset.id;
        handleDeleteTodo(id);
      }

      // チェックボックスのクリック
      if (target.classList.contains('todo-item__checkbox')) {
        const id = target.dataset.id;
        handleToggleTodo(id);
      }
    });
  }
}

/**
 * タスク追加イベントハンドラ
 *
 * @returns {void}
 *
 * @description
 * 入力欄の値を取得し、タスクを追加します。
 * - 空文字・空白のみの場合は何もしない
 * - 追加成功時に入力欄をクリアし、再描画
 */
function handleAddTodo() {
  const inputElement = document.getElementById('todo-input');
  if (!inputElement) return;

  const text = inputElement.value;

  // addTodo()がnullを返す場合は何もしない（空文字の場合）
  const newTodo = addTodo(text);
  if (newTodo) {
    clearInput();
    render();
  }
}

/**
 * タスク削除イベントハンドラ
 *
 * @param {string} id - 削除するタスクのID
 * @returns {void}
 *
 * @description
 * 指定されたIDのタスクを削除し、再描画します。
 */
function handleDeleteTodo(id) {
  deleteTodo(id);
  render();
}

/**
 * タスク完了切替イベントハンドラ
 *
 * @param {string} id - 完了状態を切り替えるタスクのID
 * @returns {void}
 *
 * @description
 * 指定されたIDのタスクの完了状態を切り替え、再描画します。
 */
function handleToggleTodo(id) {
  toggleTodo(id);
  render();
}

/**
 * フィルタ変更イベントハンドラ
 *
 * @param {string} filter - 'all', 'active', 'completed'
 * @returns {void}
 *
 * @description
 * フィルタ状態を更新し、フィルタボタンのアクティブ状態を更新後、再描画します。
 */
function handleFilterChange(filter) {
  currentFilter = filter;
  updateFilterButtons(currentFilter);
  render();
}

/**
 * 画面全体を再描画する
 *
 * @returns {void}
 *
 * @description
 * 現在のフィルタ状態に基づいてタスクリストを描画します。
 * - filterTodos()で現在のフィルタに合致するタスクを取得
 * - renderTodoList()でDOM更新
 */
function render() {
  const filteredTodos = filterTodos(currentFilter);
  renderTodoList(filteredTodos);
}

// DOMContentLoadedイベントで初期化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // すでにDOMが読み込まれている場合は即座に初期化
  init();
}
