/**
 * todoStore.test.js
 * todoStore.jsの手動テストスクリプト
 */

import { getTodos, loadTodos, addTodo, deleteTodo, toggleTodo, filterTodos } from './todoStore.js';

/**
 * テスト結果を記録
 */
const testResults = [];

/**
 * アサーション関数
 */
function assert(condition, message) {
  if (condition) {
    testResults.push({ status: 'PASS', message });
    console.log(`✅ PASS: ${message}`);
  } else {
    testResults.push({ status: 'FAIL', message });
    console.error(`❌ FAIL: ${message}`);
  }
}

/**
 * 配列が等しいかチェック（簡易版）
 */
function assertArrayLength(actual, expected, message) {
  assert(actual.length === expected, `${message} (expected ${expected}, got ${actual.length})`);
}

/**
 * テストのセットアップ
 */
function setup() {
  // localStorageをクリア
  localStorage.clear();
  // todos配列を初期化
  loadTodos();
}

/**
 * テストケース: filterTodos() - 'all'
 */
function testFilterTodosAll() {
  console.log('\n--- Test: filterTodos("all") ---');
  setup();

  // 準備: 未完了2件、完了1件を追加
  addTodo('タスク1');
  addTodo('タスク2');
  const task3 = addTodo('タスク3');
  toggleTodo(task3.id); // タスク3を完了状態にする

  // 実行
  const result = filterTodos('all');

  // 検証
  assertArrayLength(result, 3, 'all フィルタは全タスクを返す');
}

/**
 * テストケース: filterTodos() - 'active'
 */
function testFilterTodosActive() {
  console.log('\n--- Test: filterTodos("active") ---');
  setup();

  // 準備: 未完了2件、完了1件を追加
  addTodo('タスク1');
  addTodo('タスク2');
  const task3 = addTodo('タスク3');
  toggleTodo(task3.id); // タスク3を完了状態にする

  // 実行
  const result = filterTodos('active');

  // 検証
  assertArrayLength(result, 2, 'active フィルタは未完了タスクのみ返す');
  assert(result.every(t => !t.completed), 'active フィルタの全要素がcompleted=false');
}

/**
 * テストケース: filterTodos() - 'completed'
 */
function testFilterTodosCompleted() {
  console.log('\n--- Test: filterTodos("completed") ---');
  setup();

  // 準備: 未完了2件、完了1件を追加
  addTodo('タスク1');
  addTodo('タスク2');
  const task3 = addTodo('タスク3');
  toggleTodo(task3.id); // タスク3を完了状態にする

  // 実行
  const result = filterTodos('completed');

  // 検証
  assertArrayLength(result, 1, 'completed フィルタは完了タスクのみ返す');
  assert(result.every(t => t.completed), 'completed フィルタの全要素がcompleted=true');
}

/**
 * テストケース: filterTodos() - 不正なフィルタ
 */
function testFilterTodosInvalid() {
  console.log('\n--- Test: filterTodos("invalid") ---');
  setup();

  // 準備: タスクを追加
  addTodo('タスク1');

  // 実行
  const result = filterTodos('invalid');

  // 検証
  assertArrayLength(result, 0, '不正なフィルタは空配列を返す');
}

/**
 * テストケース: filterTodos() - タスクが0件の場合
 */
function testFilterTodosEmpty() {
  console.log('\n--- Test: filterTodos() with empty todos ---');
  setup();

  // 実行（タスク0件）
  const allResult = filterTodos('all');
  const activeResult = filterTodos('active');
  const completedResult = filterTodos('completed');

  // 検証
  assertArrayLength(allResult, 0, 'all フィルタ（タスク0件）');
  assertArrayLength(activeResult, 0, 'active フィルタ（タスク0件）');
  assertArrayLength(completedResult, 0, 'completed フィルタ（タスク0件）');
}

/**
 * 全テストを実行
 */
function runAllTests() {
  console.log('=== todoStore.test.js: filterTodos() テスト ===\n');

  testFilterTodosAll();
  testFilterTodosActive();
  testFilterTodosCompleted();
  testFilterTodosInvalid();
  testFilterTodosEmpty();

  // テスト結果サマリー
  console.log('\n=== テスト結果サマリー ===');
  const passCount = testResults.filter(r => r.status === 'PASS').length;
  const failCount = testResults.filter(r => r.status === 'FAIL').length;
  console.log(`✅ PASS: ${passCount}件`);
  console.log(`❌ FAIL: ${failCount}件`);
  console.log(`合計: ${testResults.length}件`);

  if (failCount === 0) {
    console.log('\n🎉 全テストがパスしました！');
  } else {
    console.log('\n⚠️ 失敗したテストがあります。');
  }
}

// テスト実行
runAllTests();
