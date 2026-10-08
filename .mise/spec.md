# Spec: add `reason` to ValidationError

## What

`ValidationError` gains a public, read-only `reason: string`: the error text without the path prefix that `message` carries.

- Every error code gets `reason` (built-in constraints such as `minLength`, and `test` failures alike).
- `message` does not change: `<path>: <reason>` for value errors, `key <path>: <reason>` for record-key errors, and plain `<reason>` at root level.
- At root level (empty path), `reason === message`.
- `toJSON()` includes `reason`, next to `message`.
- README documents `reason` in the Error Handling field list.
- Ships as a `feat:` change (minor, 6.1.0) with no `BREAKING CHANGE:` footer. package.json is not bumped by hand.

## Design

All code changes are in `src/ValidationError.ts`.

- `formatMessage(options)` (src/ValidationError.ts:51-64) becomes `formatMessage(reason: string, options)` or equivalent: the constructor first takes `reason = options.message`, then builds `message` by adding the prefix to that `reason`. The prefix is computed exactly as today (joined path; `key ` before it when context is `'key'`; none when the joined path is empty). Building `message` from `reason` keeps the two in sync.
- New field, declared with the other public readonly fields (:71-80) with a TSDoc comment: `public readonly reason: string`, assigned in the constructor.
- `toJSON()` (:115-126) adds `reason: this.reason` right after `message`. About 65 `toJSON()` inline snapshots in `src/*.test.ts` gain a `"reason"` line; regenerate with `yarn vitest run -u` and review the diff (only `"reason"` lines may be added).
- The `message` option's TSDoc (:23-26) is updated to say the option's text is stored unchanged as `reason`, and `message` is that text with the path prefix added.
- No validator file changes: validators already pass the bare text as `options.message`.
- New test file `src/ValidationError.test.ts` exercises errors through public validators.
- Nothing is removed.

## Hard-to-undo

- Public API addition: new `ValidationError.reason` field and a new `reason` key in `toJSON()` output. Once the `feat:` PR merges to `main`, the publish workflow releases 6.1.0 to npm automatically, and a publish cannot be undone.

## Task index

| Task file                          | What it does                                                                                     | Files touched                                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `01_01_validation_error_reason.md` | Add `reason` to `ValidationError` and `toJSON()`, regenerate snapshots, add tests, update README | `src/ValidationError.ts`, `README.md`, `src/ValidationError.test.ts` (new), `src/*.test.ts` snapshots |
