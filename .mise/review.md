# Review

## Tasks

- 01_01 (a96c990): `ValidationError` gains a read-only `reason` (the message without the path prefix); `formatMessage(reason, options)` builds `message` from it, so `message` is unchanged. `toJSON()` includes `reason` after `message`; `message` option TSDoc updated. New `src/ValidationError.test.ts` (top-level, nested `a.b`, record key `key m.k:`, root-level test, `minLength` with path and at root, `toJSON()`). 65 inline snapshots gained a `"reason"` line. README documents `reason` in the Error Handling list and record-key/object examples. Verify: `yarn smoke`; read `src/ValidationError.ts` and `src/ValidationError.test.ts`.

## Open assumptions

- Changes are in `src/`; `dist/` is build output.
- package.json is not bumped; the publish workflow sets 6.1.0 from the `feat:` PR title.
- README examples keep printing `error.message`; `error.reason` added only where it illustrates the difference.

## Amendments

None.
