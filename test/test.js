import assert from 'assert';
import { withSobaka } from '../src/index.js';

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
  const guarded = withSobaka(function () {
    called = true;
  });
  guarded();
  assert.strictEqual(called, true);
});

test('sync callback error is passed to custom errorHandler', () => {
  let captured;
  const errorHandler = (e) => {
    captured = e;
  };
  const guarded = withSobaka(function () {
    throw new Error('boom');
  }, errorHandler);
  guarded();
  assert.strictEqual(captured.message, 'boom');
});

test('async callback executes successfully', async () => {
  let called = false;
  const guarded = withSobaka(async function () {
    called = true;
  });
  await guarded();
  assert.strictEqual(called, true);
});

test('async callback error is passed to custom errorHandler', async () => {
  let captured;
  const errorHandler = (e) => {
    captured = e;
  };
  const guarded = withSobaka(async function () {
    throw new Error('bad dog');
  }, errorHandler);
  await guarded();
  // Даем промису обработаться
  await new Promise((r) => setTimeout(r, 0));
  assert.strictEqual(captured.message, 'bad dog');
});

test('async callback uses default handleError if errorHandler not provided', async () => {
  // Перехватим console.log
  const originalLog = console.log;
  let logOutput = '';
  console.log = (...args) => {
    logOutput += args.join(' ');
  };

  const guarded = withSobaka(async function () {
    throw new Error('default handler test');
  });
  await guarded();
  await new Promise((r) => setTimeout(r, 0));
  console.log = originalLog;

  assert.ok(logOutput.includes('woof!'));
  assert.ok(logOutput.includes('error captured'));
  assert.ok(logOutput.includes('default handler test'));
});

test('sync callback uses default handleError if errorHandler not provided', () => {
  const originalLog = console.log;
  let logOutput = '';
  console.log = (...args) => {
    logOutput += args.join(' ');
  };

  const guarded = withSobaka(function () {
    throw new Error('sync default error');
  });
  guarded();

  console.log = originalLog;

  assert.ok(logOutput.includes('woof!'));
  assert.ok(logOutput.includes('error captured'));
  assert.ok(logOutput.includes('sync default error'));
});

// --- Summary ---
process.on('exit', () => {
  console.log(`\n${passCount}/${testCount} tests passed`);
});
