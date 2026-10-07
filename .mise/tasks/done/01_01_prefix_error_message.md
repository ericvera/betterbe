# 01_01 Prefix ValidationError messages with the failing path

## Goal

Make `ValidationError.message` start with the failing field's path, as in `source: is longer than expected length 40`. Make `pathString` attach array segments without a dot (`items[0].price`). Update every inline snapshot that changes and add tests for the new prefix.

## Files to modify/create

- `src/ValidationError.ts`
- Tests (not counted): `src/array.test.ts`, `src/object.test.ts`, `src/record.test.ts`, `src/string.test.ts`, `src/number.test.ts`, `src/boolean.test.ts`

## Background

- This is betterbe, a dependency-free TypeScript validation library (ESM, `.js` import suffixes, Prettier: no semicolons, single quotes, 2 spaces, `@tsconfig/strictest`).
- No prior tasks.
- `src/ValidationError.ts:58-67`: the constructor calls `super(options.message)`, then sets `path`, `key`, `value`, `context` and `constraint`.
- `src/ValidationError.ts:74-80`: the `pathString` getter builds `[...path, key]` (or just `path` when `key` is undefined) and returns `segments.filter(Boolean).join('.')`.
- Validators pass the parent path as `path` and the current segment as `key`. Array items use the key `` `[${index}]` `` (`src/array.ts:111`, `:125`). So today `pathString` yields `[0].[2]` (`src/array.test.ts:345`).
- Record key errors use `context: 'key'`, with the object key as `key` (`src/record.ts:96`).
- Custom `test` failures go through `report({ message })`, which constructs a `ValidationError` (`src/string.ts:144`, `src/array.ts:132`, `src/object.ts:110`, `src/record.ts:102`). They get the prefix automatically.
- Design decisions (owner-approved):
  - Array segments attach without a dot, for both the message prefix and the public `pathString`.
  - Record key-context errors get a `key ` marker before the full path: `key 123: ...`, `key user2.invalidfield: ...`.
  - An empty full path (root-level error) keeps the raw message.
  - The format is `<path>: <constraint text>`.
  - `toJSON()` stays as is. The path appears in both `message` and `pathString`.
- The release is 5.0.0 through a `BREAKING CHANGE:` commit footer. Do NOT edit `package.json`. The publish workflow bumps the version from commit messages.

## Guides

None (the config has no Skills & guides entries).

## Implementation details

1. In `src/ValidationError.ts`, add a module-private (not exported) function:
   ```ts
   const joinPath = (segments: string[]): string =>
     segments
       .filter(Boolean)
       .reduce(
         (acc, segment) =>
           acc === '' || segment.startsWith('[')
             ? acc + segment
             : `${acc}.${segment}`,
         '',
       )
   ```
   An equivalent loop is fine. Required results: `['items','[0]','price']` gives `items[0].price`, `['[0]','[2]']` gives `[0][2]`, `['user2','score']` gives `user2.score`, `['', 'a']` gives `a`, `[]` gives `''`.
2. Add a module-private `formatMessage(options: ValidationErrorOptions): string`:
   - `segments = options.key !== undefined ? [...(options.path ?? []), options.key] : (options.path ?? [])`
   - `joined = joinPath(segments)`. If `joined === ''`, return `options.message`.
   - Set `prefix = (options.context ?? 'value') === 'key' ? `key ${joined}` : joined`, then return `` `${prefix}: ${options.message}` ``.
3. In the constructor, replace `super(options.message)` with `super(formatMessage(options))`.
4. Change `pathString` to `return joinPath(segments)`. Update its doc comment to ``/** Full path as a string; object keys are dot-separated and array indexes attach directly (e.g. `'items[0].price'`). */``.
5. Update the `message` doc comment in `ValidationErrorOptions` to say it is the raw constraint text. The stored `Error.message` is prefixed with the path when the path is non-empty (and with `key ` when context is `'key'`).
   Also fix the stale examples in the other `ValidationErrorOptions` doc comments, since array keys are `` `[${index}]` `` (`src/array.ts:111`): the `path` comment (`src/ValidationError.ts:27`) becomes ``/** Parent path segments (e.g. `['items', '[0]']`). Defaults to `[]`. */``, and the `key` comment (`src/ValidationError.ts:29`) becomes ``/** Current segment (e.g. `'price'` or `'[0]'`). Omitted at root level. */``.
6. Update inline snapshots. Run `yarn vitest run -u` to rewrite them, then review the diff of every `src/*.test.ts`:
   - Only snapshots whose `pathString` is non-empty may have changed `message`.
   - Every changed `message` must equal `<pathString>: <old text>`, or `key <pathString>: <old text>` when `"context": "key"`.
   - `pathString` values may change only where a `[` segment follows another segment (for example `"[0].[2]"` becomes `"[0][2]"`).
   - Root-level snapshots (`"pathString": ""`) must be unchanged.
7. Add explicit tests (plain `expect(...).toBe(...)` on `error.message` and `error.pathString`, using the existing `try { ...; expect.fail('Should have thrown') } catch (error) { ... }` style):
   - `src/object.test.ts`: object property error gives `name: is longer than expected length 10`. Nested object gives `user.age: ...`. A custom `test` on a nested property calls `report({ message: 'custom' })` and gives `<prop>: custom`. A root-level object type error stays unprefixed.
   - `src/array.test.ts`: `object({ items: array(object({ price: number({ max: 10 }) })) })` with `{ items: [{ price: 11 }] }` gives message `items[0].price: is greater than maximum 10` and `pathString` `items[0].price`. A nested array gives `[0][2]: is greater than maximum 10`.
   - `src/record.test.ts`: `record(string({ pattern: /^[a-z]+$/ }), number())` with `{ '123': 1 }` gives a message starting `key 123: ` with `context` `'key'`. A nested key error gives `key user2.invalidfield: is not one of the allowed values`. A record value error gives `user2.score: is not number` (no `key` marker).

## Gotchas

- Compute the prefix before `super(...)`. `this` is not usable before `super`, so `formatMessage` must work on `options`, not on instance fields.
- Keep `filter(Boolean)` semantics. An empty-string key (`record` with key `''`) is dropped, so a root-level key `''` yields no prefix.
- `context` defaults to `'value'` when omitted. Only an explicit `'key'` gets the marker.
- Do not touch `package.json` or any validator file (`src/string.ts` etc.). No validator changes are needed.
- `toThrow('text')` substring assertions still pass with a prefix. Do not loosen any assertion to make tests pass. Investigate every unexpected failure.
- Vitest `-u` also deletes obsolete snapshots. Review the full diff so nothing unrelated changed.

## Verification

- `yarn test`: all pass, including the new tests listed in step 7.
- `yarn build`, `yarn lint`, `yarn prettier --check .`: all clean.
- In `git diff src/*.test.ts`, every changed snapshot follows the rules in step 6, and no snapshot with `"pathString": ""` changed.
