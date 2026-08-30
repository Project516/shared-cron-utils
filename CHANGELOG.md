# Changelog

## 0.1.1

- `isFirestoreQuotaExceeded` now matches the namespaced string code Firebase
  Admin emits (`firestore/resource-exhausted`), not just the numeric gRPC
  code `8`. A quota error that arrived as a string code was previously missed
  and turned into a false red run.

## 0.1.0

- `isFirestoreQuotaExceeded(err)`, previously copied into every cron in both
  repos.
- `parseServiceAccount(raw)`, previously defined privately inside every cron's
  `index.js`.
