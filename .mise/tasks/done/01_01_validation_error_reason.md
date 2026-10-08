# 01_01 Add `reason` to ValidationError

## Goal

Add a public, read-only `reason: string` to `ValidationError` in the betterbe validation library. `reason` is the error text without the path prefix that `message` carries. `message` stays exactly as it is today. `toJSON()` includes `reason`. Tests cover the new field and the README documents it.

## Files to modify/create

- `src/ValidationError.ts`
- `README.md`
- `src/ValidationError.test.ts` (new test file)
- `src/array.test.ts`, `src/number.test.ts`, `src/record.test.ts`, `src/string.test.ts`, `src/object.test.ts`, `src/boolean.test.ts` (inline snapshots only, regenerated)

## Background

- No prior tasks. This is the only task.
- `src/ValidationError.ts`:
  - `ValidationErrorOptions.message` (:23-27) is the raw text. Its TSDoc describes the prefix behaviour.
  - `formatMessage` (:51-64) builds `message`: returns `options.message` when the joined path is empty (:56-58); otherwise prefixes `key <joined>` when `context` is `'key'`, or `<joined>` when it is `'value'` (default), followed by `: ` (:60-63).
  - Public readonly fields with TSDoc comments are declared at :71-80 and assigned at :90-95. The constructor calls `super(formatMessage(options))` at :88.
  - `toJSON()` (:115-126) lists fields explicitly.
- Validators (e.g. `src/string.ts:142-156`, the `report` closure for `test` failures) pass the bare text as `options.message`. No validator file changes.
- Record keys are validated in the `'key'` context at `src/record.ts:96`, so a `record(string({ test }), ...)` key failure produces `key <path>: <text>`.
- Test style: `src/record.test.ts:502-546` (try/`expect.fail('Should have thrown')`/catch, cast `error as ValidationError`). Imports come from `./index.js` (see `src/string.test.ts:1-2`). Vitest; no semicolons, single quotes, 2-space indent.
- `test` option signature: `test(value, report, path?, key?)`; call `report({ message, data? })` to fail.
- Design decisions:
  - Build `reason` first, then add the prefix to it to form `message`, so the two cannot drift. `reason` is `options.message` as passed.
  - At root level (empty joined path), `reason === message`.
  - Every error code gets `reason`, not only `test`.
  - `toJSON()` places `reason` right after `message`.
  - Field name is `reason` (decided by the owner; do not rename).
  - `src/index.ts` uses `export *`; no export change. package.json is not bumped (the publish workflow sets 6.1.0 from the `feat:` PR title).

## Guides

None. The mise config has no Skills & guides entries.

## Implementation details

1. In `src/ValidationError.ts`:
   - Change `formatMessage` so it takes the reason and the path info, e.g. `const formatMessage = (reason: string, options: ValidationErrorOptions): string`, returning `reason` when the joined path is empty and `` `${prefix}: ${reason}` `` otherwise. Keep the prefix logic identical.
   - Add `public readonly reason: string` among the fields, with a TSDoc comment such as: `/** The failure text without the path prefix (e.g. \`'invalid phone number'\`). Equals \`message\` for root-level errors. */`. Place it right after the class's existing field list or near the top; keep comment style consistent.
   - Constructor: `const reason = options.message`, then `super(formatMessage(reason, options))`, then `this.reason = reason`. (`super` must be called before `this` is used; compute `reason` into a local first.)
   - `toJSON()`: add `reason: this.reason,` directly after `message: this.message,`.
   - Update the `message` option TSDoc (:23-26) to say: the text is stored unchanged as `ValidationError.reason`; `Error.message` is the same text prefixed with the path when the path is non-empty (and with `key ` when context is `'key'`).
2. Regenerate inline snapshots: `yarn vitest run -u`. Then `git diff src/*.test.ts` and confirm the only changes are added `"reason": "..."` lines inside `toJSON()` snapshots (about 65), each equal to the `"message"` value minus its prefix.
3. Create `src/ValidationError.test.ts` with these cases; each asserts both `reason` (no prefix) and `message` (unchanged):
   - Top-level value path: `object({ phone: string({ test: (_v, report) => report({ message: 'invalid phone number' }) }) }).validate({ phone: 'x' })` gives `message` `'phone: invalid phone number'`, `reason` `'invalid phone number'`.
   - Nested path: `object({ a: object({ b: string({ test: ... }) }) })` on `{ a: { b: 'x' } }` gives `message` `'a.b: <text>'`, `reason` `'<text>'`.
   - Record-key test failure: `object({ m: record(string({ test: (_v, report) => report({ message: 'bad key' }) }), number()) }).validate({ m: { k: 1 } })` gives `message` `'key m.k: bad key'`, `reason` `'bad key'`, `context` `'key'`.
   - Root-level test failure: `string({ test: ... }).validate('x')` gives `reason === message` and both equal the text.
   - Built-in constraint: `object({ name: string({ minLength: 3 }) }).validate({ name: 'ab' })` gives `code` `'minLength'`, `message` `'name: is shorter than expected length 3'`, `reason` `'is shorter than expected length 3'`. Optionally also a root-level built-in (`string({ minLength: 3 }).validate('ab')`) where `reason === message`.
   - `toJSON()` includes `reason` equal to `error.reason`.
     Confirm exact built-in message text by running the test, not by guessing.
4. README.md Error Handling field list (~:334-344): add a bullet right after `message`, e.g. ``- `reason`: The message without the path prefix (e.g. `'is longer than expected length 10'`). Equals `message` for root-level errors. Use it when you display the path yourself`` and update the `toJSON()` bullet only if needed. In the examples (~:358-399), optionally add `console.log(error.reason)` lines next to the prefixed `error.message` lines (record key and object property examples), with correct values. Keep existing lines.

## Gotchas

- Do not change `message` output in any case; existing tests asserting `message` must pass untouched.
- Do not edit `dist/` (build output).
- After `-u`, review the snapshot diff; reject any change other than added `"reason"` lines.
- Snapshot keys are sorted alphabetically by Vitest, so `"reason"` appears between `"path"`/`"pathString"` and `"value"`; that is expected and unrelated to the `toJSON()` key order.
- `yarn prettier --check .` covers README.md and the new test file; run `yarn prettier --write` on touched files.
- ESLint is strict and type-aware: the `test` callbacks must type-check (unused params prefixed `_` or omitted; `report` returns `never`).

## Verification

- Run `yarn build`, `yarn lint`, `yarn prettier --check .`, and `yarn test`; all green.
- Tests this task writes: `src/ValidationError.test.ts` (top-level value path, nested `a.b`, record key `key m.k:`, root-level test failure, built-in `minLength`, `toJSON()` includes `reason`).
- Tests this task updates: the `toJSON()` inline snapshots in `src/{array,number,record,string,object,boolean}.test.ts` (regenerated, `"reason"` lines added only).
- README change has no test; verify by reading the rendered field list and checking any example values against the test outputs.
