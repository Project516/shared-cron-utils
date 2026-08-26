# shared-cron-utils

Small helpers the Spectrum cron scripts all need. No dependencies, CommonJS,
Node 24.

Consumers pin a git tag rather than a version range, so nothing moves until a
pull request moves it:

```json
"dependencies": {
  "shared-cron-utils": "github:Project516/shared-cron-utils#v0.1.0"
}
```

```js
const { isFirestoreQuotaExceeded, parseServiceAccount } = require('shared-cron-utils');
```

## What is in here

`isFirestoreQuotaExceeded(err)` -- true when a Firestore error is the daily
quota running out rather than a bug in the caller. The projects run on the
Spark plan, where that quota is shared between the app, every cron and the
rules-test emulator, so a cron that fails on it teaches everyone to ignore a
red run. Matches both the gRPC status code and the text form, because
firebase-admin surfaces it differently depending on the transport.

`parseServiceAccount(raw)` -- reads a service-account secret stored either as
raw JSON or base64-encoded. A leading brace decides which, so both forms work
without a second secret saying which one was used.

## Adding to it

A helper belongs here when more than one cron needs it and it has no
dependencies of its own. Anything that reaches for `firebase-admin`, a
transport, or an app's own data shape stays in the cron that owns it.

Releases are cut by hand: bump `version` in `package.json`, move the
`## Unreleased` heading in `CHANGELOG.md` to the new number, merge that
through a pull request, then tag the merge commit and publish a GitHub
release for it. Consumers pin tags, so an untagged merge reaches nobody.
