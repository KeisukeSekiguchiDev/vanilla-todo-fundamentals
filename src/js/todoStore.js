/**
 * todoStore.js
 * モジュールID: MOD-001
 *
 * 責務: タスクデータの状態管理とビジネスロジック
 * - タスクの追加・削除・更新・フィルタリング
 * - データの真実の単一情報源（Single Source of Truth）
 * - 入力値のバリデーション
 * - storage.jsへのデータ永続化指示
 *
 * 対応要件: FR-001, FR-002, FR-003, FR-004
 */

import { saveToStorage, loadFromStorage } from './storage.js';

/**
 * タスク配列（モジュール内プライベート変数）
 * @type {Array<TodoItem>}
 */
let todos = [];

/**
 * ユニークなタスクIDを生成する
 * @returns {string} "task-{タイムスタンプ}" 形式のID
 */
function generateId() {
  return `task-${Date.now()}`;
}

/**
 * 現在のtodos配列をlocalStorageに保存する
 * @returns {void}
 */
function saveTodosToStorage() {
  saveToStorage(todos);
}

/**
 * 全タスクを取得する
 * @returns {Array<TodoItem>} タスク配列
 */
export function getTodos() {
  return todos;
}

/**
 * localStorageからタスクデータを読み込む
 * @returns {void}
 *
 * @description
 * storage.jsのloadFromStorage()を呼び出し、タスクデータを読み込みます。
 * データが存在しない場合は空配列で初期化します。
 */
export function loadTodos() {
  const loadedTodos = loadFromStorage();
  todos = loadedTodos || [];
}

/**
 * 新しいタスクを追加する
 *
 * @param {string} text - タスク内容
 * @returns {TodoItem | null} 追加されたタスク、または空の場合null
 *
 * @description
 * 入力値をバリデーションし、新しいタスクを追加します。
 * - 前後の空白を除去（trim）
 * - 空文字の場合はnullを返却
 * - 201文字以上の場合は200文字で切り捨て
 * - 追加後にlocalStorageに自動保存
 */
export function addTodo(text) {
  const trimmed = text.trim();

  if (trimmed === '') {
    return null;
  }

  const truncated = trimmed.substring(0, 200);

  const newTodo = {
    id: generateId(),
    text: truncated,
    completed: false,
    createdAt: new Date().toISOString()
  };

  todos.push(newTodo);
  saveTodosToStorage();

  return newTodo;
}

/**
 * 指定IDのタスクを削除する
 *
 * @param {string} id - タスクID
 * @returns {boolean} 削除成功ならtrue、失敗ならfalse
 *
 * @description
 * 指定されたIDのタスクをtodos配列から削除します。
 * 削除後にlocalStorageに自動保存します。
 */
export function deleteTodo(id) {
  const index = todos.findIndex(todo => todo.id === id);

  if (index === -1) {
    return false;
  }

  todos.splice(index, 1);
  saveTodosToStorage();

  return true;
}

/**
 * 指定IDのタスクの完了状態を反転する
 *
 * @param {string} id - タスクID
 * @returns {boolean} 切替成功ならtrue、失敗ならfalse
 *
 * @description
 * 指定されたIDのタスクのcompletedフラグを反転します（true → false、false → true）。
 * 切替後にlocalStorageに自動保存します。
 *
 * @example
 * // 未完了タスクを完了状態にする
 * const success = toggleTodo('task-1234567890');
 * if (success) {
 *   console.log('タスクの状態を切り替えました');
 * }
 */
export function toggleTodo(id) {
  const todo = todos.find(todo => todo.id === id);

  if (!todo) {
    return false;
  }

  todo.completed = !todo.completed;
  saveTodosToStorage();

  return true;
}

/**
 * フィルタ条件に合致するタスクを取得する
 *
 * @param {string} filter - 'all', 'active', 'completed'
 * @returns {Array<TodoItem>} フィルタされたタスク配列
 *
 * @description
 * 指定されたフィルタ条件に合致するタスクを返します。
 * - 'all': 全タスクを返却
 * - 'active': completed === false のタスクのみ
 * - 'completed': completed === true のタスクのみ
 * - その他: 空配列を返却（不正なフィルタ値の場合）
 *
 * @example
 * // 全タスクを取得
 * const allTasks = filterTodos('all');
 *
 * // 未完了タスクのみ取得
 * const activeTasks = filterTodos('active');
 *
 * // 完了タスクのみ取得
 * const completedTasks = filterTodos('completed');
 */
export function filterTodos(filter) {
  switch (filter) {
    case 'all':
      return todos;
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return [];
  }
}
