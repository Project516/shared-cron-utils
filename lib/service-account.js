'use strict';

// The service-account secret is stored either as raw JSON or base64-encoded,
// following the same convention as the repos' GOOGLE_SERVICES_JSON secret. A
// leading brace decides which, so both forms work without a second secret to
// say which one was used.
function parseServiceAccount(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('{')) {
    return JSON.parse(trimmed);
  }
  return JSON.parse(Buffer.from(trimmed, 'base64').toString('utf8'));
}

module.exports = { parseServiceAccount };
