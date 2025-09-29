import assert from 'assert';
import { budka } from '../src/index.js';

let testCount = 0;
let passCount = 0;

function test(name, fn) {
  testCount++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(err);
  }
}

// --- TESTS ---

test('sync callback executes normally', () => {
  let called = false;
  const withSobaka = budka();
  const guarded = withSobaka(function () {
    called = true;
  });
  guarded();
  assert.strictEqual(called, true);
});

test('sync callback error is passed to logger', () => {
  let captured;
  const logger = (e) => {
    captured = e;
  };
  const withSobaka = budka(logger);
  const guarded = withSobaka(function () {
    throw new Error('boom');
  });
  guarded();
  assert.strictEqual(captured.message, 'boom');
});

test('async callback executes successfully', async () => {
  let called = false;
  const withSobaka = budka();
  const guarded = withSobaka(async function () {
    called = true;
  });
  await guarded();
  assert.strictEqual(called, true);
});

test('async callback error is passed to logger', async () => {
  let captured;
  const logger = (e) => {
    captured = e;
  };
  const withSobaka = budka(logger);
  const guarded = withSobaka(async function () {
    throw new Error('bad dog');
  });
  await guarded();
  // allow promise rejection to settle
  await new Promise((r) => setTimeout(r, 0));
  assert.strictEqual(captured.message, 'bad dog');
});

// --- Summary ---
process.on('exit', () => {
  console.log(`\n${passCount}/${testCount} tests passed`);
});
