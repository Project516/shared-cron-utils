'use strict';

const assert = require('node:assert');
const { test } = require('node:test');

const { isFirestoreQuotaExceeded } = require('..');

test('a gRPC RESOURCE_EXHAUSTED code counts as quota exhaustion', () => {
  assert.strictEqual(isFirestoreQuotaExceeded({ code: 8 }), true);
});

test('the message text counts when only a message survives', () => {
  assert.strictEqual(
    isFirestoreQuotaExceeded({ message: '8 RESOURCE_EXHAUSTED: Quota exceeded.' }),
    true,
  );
  assert.strictEqual(
    isFirestoreQuotaExceeded({ details: 'QUOTA EXCEEDED for project' }),
    true,
  );
});

test('an unrelated Firestore error is not quota exhaustion', () => {
  assert.strictEqual(
    isFirestoreQuotaExceeded({ code: 5, message: 'not found' }),
    false,
  );
  assert.strictEqual(isFirestoreQuotaExceeded({ code: 7, message: 'denied' }), false);
});

test('a non-object is not quota exhaustion', () => {
  assert.strictEqual(isFirestoreQuotaExceeded(null), false);
  assert.strictEqual(isFirestoreQuotaExceeded('RESOURCE_EXHAUSTED'), false);
});
