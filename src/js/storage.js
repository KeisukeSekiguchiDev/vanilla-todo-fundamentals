/**
 * storage.js
 * モジュールID: MOD-003
 *
 * 責務: localStorageの読み書き操作
 * - タスクデータの永続化
 * - localStorage APIの抽象化
 * - JSON変換エラーの処理
 * - データ破損時の回復
 *
 * 対応要件: FR-005
 */

/**
 * localStorageのキー名
 * @constant {string}
 */
const STORAGE_KEY = 'vanilla-todo-items';

/**
 * タスク配列をlocalStorageに保存する
 *
 * @param {Array<TodoItem>} todos - 保存するタスク配列
 * @returns {void}
 *
 * @description
 * JSON形式でタスク配列をlocalStorageに保存します。
 * エラー発生時はコンソールログに出力します（ユーザーへの通知は行いません）。
 *
 * @example
 * const todos = [
 *   { id: 'task-1', text: '買い物', completed: false, createdAt: '2025-12-13T10:00:00.000Z' }
 * ];
 * saveToStorage(todos);
 */
export function saveToStorage(todos) {
  try {
    const jsonString = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, jsonString);
  } catch (error) {
    // エラーログ出力
    console.error('[vanilla-todo-fundamentals] localStorageへの保存に失敗:', error);
    // 本番環境ではユーザーへのエラー通知を検討
  }
}

/**
 * localStorageからタスク配列を読み込む
 *
 * @returns {Array<TodoItem> | null} タスク配列、またはnull（データなし）
 *
 * @description
 * localStorageからタスク配列を読み込みます。
 * データが存在しない場合はnullを返却します。
 * JSON解析失敗時、または配列でない場合は破損データを削除しnullを返却します。
 *
 * @example
 * const todos = loadFromStorage();
 * if (todos === null) {
 *   console.log('データなし、または破損データを削除');
 * } else {
 *   console.log('タスク数:', todos.length);
 * }
 */
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
