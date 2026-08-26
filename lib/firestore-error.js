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

  const message =
    `${String(err.message || '')} ${String(err.details || '')}`.toUpperCase();
  return (
    message.includes('RESOURCE_EXHAUSTED') || message.includes('QUOTA EXCEEDED')
  );
}

module.exports = { isFirestoreQuotaExceeded };
