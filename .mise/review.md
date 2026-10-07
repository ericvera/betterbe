# Review

## Tasks

- 01_01 (569bcb7): `package.json` `engines.node` `>=20` → `>=24`; `@types/node` `^26.6.4` → `^24` via `yarn up` (yarn.lock resolves 24.19.1); `.github/dependabot.yml` ignores `@types/node` semver-major updates. Verify: `yarn why @types/node` shows 24.19.1; `yarn smoke` passes.

## Open assumptions

- CI workflows already on `node-version: 24`; unchanged.
- No docs name a Node version, so no doc edits.
- PR title uses `feat:` (no `type!:`); description ends with a `BREAKING CHANGE:` footer as its last paragraph → 5.0.0 becomes 6.0.0 on merge.

## Amendments

None.
