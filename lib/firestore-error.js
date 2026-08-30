'use strict';

// A Firestore quota exhaustion is not a bug in the cron and a re-run cannot
// fix it: the projects are on the Spark plan, so the daily quota is small and
// shared between the app, every cron and the rules-test emulator. Failing the
// run for one teaches everyone to ignore a red cron, which is the state a real
// failure then hides in.
//
// Matched two ways because firebase-admin surfaces it differently depending on
// the transport: the gRPC status code, or the text when only a message
// survives.
function isFirestoreQuotaExceeded(err) {
  if (!err || typeof err !== 'object') return false;
  if (err.code === 8) return true;

  // Firebase Admin surfaces quota exhaustion as a namespaced string code on
  // `err.code` (e.g. 'firestore/resource-exhausted'), not the numeric gRPC
  // code. A numeric-only check missed that path and let a quota error look
  // like a real failure. Match the code string too so the helper stays true
  // to its job of hiding quota exhaustion from the red-run noise.
  if (typeof err.code === 'string' && /resource-exhausted/i.test(err.code)) {
    return true;
  }

  const message =
    `${String(err.message || '')} ${String(err.details || '')}`.toUpperCase();
  return (
    message.includes('RESOURCE_EXHAUSTED') || message.includes('QUOTA EXCEEDED')
  );
}

module.exports = { isFirestoreQuotaExceeded };
