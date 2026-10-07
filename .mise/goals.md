Title: [infra] name the failing field in betterbe validation error messages | Description:

A betterbe ValidationError message holds only the constraint text, e.g. "is longer than expected length 40", so a snapshot or a logged callable error never says which field failed. The error already carries path and key (betterbe 4.1.0).

Change betterbe (github.com/ericvera/betterbe) to prefix the joined path, e.g. source: is longer than expected length 40. Then release it, bump it in Okven, and update every ValidationError inline snapshot across the repo, one file at a time.

A wrapper in Okven would only reach the call sites that remember to use it, so the fix belongs in the library.

Source: Delta Review note on eric/attribution-3, packages/valid/src/functions/trackAttributionEventSchema.test.ts.

## Investigation

Not a bug fix; changes what `ValidationError.message` holds.

1. Change point: `src/ValidationError.ts:59` — `super(options.message)` passes raw constraint text; `this.path`/`this.key` set after (:62-63). Prefix must be computed from `options.path`/`options.key` before `super`.
2. Reuse `pathString` (ValidationError.ts:75-80): filters empty segments, joins with '.'. Empty path (root-level error) returns '' → needs a no-prefix branch.
3. Array item keys are `[${index}]` (src/array.ts:111), so pathString yields `[0].[2]` (src/array.test.ts:345), not `items.0.price` as ValidationError.ts:74 and README.md:340 claim. Prefix would read `items.[0].price: ...` unless the join changes (pathString is public API).
4. Record key errors pass the object key as `key` with context 'key' (src/record.ts:96) → prefixes like `123: does not match pattern`.
5. Custom `test` errors go through `report({ message })` (src/string.ts:144, src/array.ts:132, src/object.ts:110, src/record.ts:102) → user messages get prefixed too.
6. `toJSON()` puts `message` next to `pathString` (ValidationError.ts:86-89) → serialized errors show the path twice.
7. Inline snapshots with `"message":` in src/array.test.ts (12), boolean (2), number (8), object (13), record (15), string (15); only non-root ones change. New prefix tests go in object.test.ts, array.test.ts (nested) and record.test.ts (key context).
8. Docs: README.md:337 describes `message`; README.md:145/:149 quote root-level "is not a number" (stays unprefixed); README.md:340 array-path format needs fixing.
9. Hard to undo: public behavior change to `error.message`; package.json is 4.1.0 → arguably 5.0.0. Publish via .github/workflows/publish.yml (`npm publish` :55, release :58); npm publish can't be taken back.
10. Out of scope for this repo: bumping betterbe in Okven and updating its snapshots.

## Open questions

1. Array path format in the prefix/pathString.
2. Version bump: major or minor.
3. Record key-context errors: plain prefix or marked differently.
