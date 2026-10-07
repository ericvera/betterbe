# Review

## Tasks

- 01_01 (d70ee37): `src/ValidationError.ts` adds `joinPath`/`formatMessage`; non-root messages become `<pathString>: <msg>` (`key <pathString>: <msg>` for record-key context); array join is now `items[0].price`; doc comments fixed; snapshots updated; 9 new prefix tests (object, array, record). Verify: `yarn test`, and scan the snapshot diffs in `src/*.test.ts`.
- 01_02 (f0fd55c): README Error Handling: `message` and `pathString` bullets rewritten, each example logs its exact message; root-level `is not a number` quotes unchanged. Verify: read README Error Handling section.

## Open assumptions

- Root-level errors (empty path) keep the raw message.
- Custom `test` messages are prefixed like built-in ones.
- `toJSON()` shows the path in both `message` and `pathString`.
- Release is 5.0.0, driven by the `BREAKING CHANGE:` footer on d70ee37 reaching `main`; publish needs the owner's go-ahead.
- Okven bump and snapshot updates are a separate run in the Okven repo.

## Amendments

None.
