'use strict';

const assert = require('node:assert');
const { test } = require('node:test');

const { parseServiceAccount } = require('..');

const account = { project_id: 'frcspectrumstrategy', client_email: 'cron@example.com' };

test('raw JSON parses as itself', () => {
  assert.deepStrictEqual(parseServiceAccount(JSON.stringify(account)), account);
});

test('leading and trailing whitespace does not decide the form', () => {
  assert.deepStrictEqual(
    parseServiceAccount(`\n  ${JSON.stringify(account)}  \n`),
    account,
  );
});

test('base64 is decoded before parsing', () => {
  const encoded = Buffer.from(JSON.stringify(account), 'utf8').toString('base64');
  assert.deepStrictEqual(parseServiceAccount(encoded), account);
});

test('a secret that is neither JSON nor base64 JSON throws', () => {
  assert.throws(() => parseServiceAccount('not-a-secret'), SyntaxError);
});
