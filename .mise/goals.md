Feature: add reason to ValidationError

Problem
ValidationError.message always comes as <path>: <reason>. Callers that already show the path on their own can't get the reason by itself. firebase-kit-admin shows its own Value of '<path>' subject and then adds error.message, so the path appears twice:

Value of 'phone' failed custom validation (error: 'phone: invalid phone number').
The only way around it today is to rebuild betterbe's message prefix and cut it off. That ties callers to how the message is formatted inside betterbe.

What exists today (6.0.0)

The ValidationError constructor sets message from formatMessage(options) (dist/ValidationError.js:37). The prefix it adds (lines 6–15) is:
<pathString>: when the context is value
key <pathString>: when the context is key (record keys, validated in record.js:53)
nothing when pathString is empty (root-level errors)
The public fields are path, key, value, context, constraint, code and pathString. None of them holds just the reason. The test constraint is { code: 'test', data? } and carries no message.
Change

Add a public, read-only reason: string to ValidationError. It is the text message has after the prefix: the same string formatMessage builds now, minus the path part.
Every error code gets reason, not only test.
message does not change.
When there is no prefix (root-level error), reason === message.
Ideally formatMessage builds the reason first and adds the prefix to it, so the two can't get out of sync.
Tests
For each case, check that reason has no prefix and message is unchanged:

a top-level value path
a nested path (a.b)
a record-key test failure (key m.k: prefix)
a root-level test failure
at least one built-in constraint, such as minLength, so it's clear reason isn't specific to test
Release
This is additive, so it's a minor version (6.1.0). Use a feat: commit with no BREAKING CHANGE: footer. Update the ValidationError docs in the README.

Downstream
After 6.1.0 is published, firebase-kit-admin will use error.reason in its case 'test' message and raise its betterbe peer floor to ^6.1.0.

## Investigation

This is a new feature, not a bug fix, so there was nothing to reproduce.

1. Core change site: `formatMessage` at src/ValidationError.ts:51-64. It returns `options.message` unchanged when the joined path is empty (:56-58). Otherwise it prefixes `key <joined>` when the context is key, or `<joined>` when it is value (:60-63). The reason is exactly `options.message`, so splitting the function into a reason part and a prefix part fits naturally.
2. The constructor calls `super(formatMessage(options))` at ValidationError.ts:88. The public readonly fields are declared at :71-80 and assigned at :90-95. `reason` belongs alongside them, with a TSDoc comment like each of its neighbours.
3. The description's `dist/ValidationError.js:37` / "lines 6–15" refer to build output. The source of truth is `src/ValidationError.ts` (constructor :88, prefix logic :51-64).
4. The `message` option's TSDoc at ValidationError.ts:23-26 describes the prefix behaviour. It will need to mention `reason`.
5. `toJSON()` at ValidationError.ts:115-126 lists the fields explicitly. Adding `reason` there changes about 65 `toJSON()` inline snapshots (array.test.ts 12, number 8, record 15, string 15, object 13, boolean 2); Vitest can rewrite them with `-u`.
6. `test` failures are built in each validator's `report` closure (e.g. src/string.ts:142-156, constraint `{ code: 'test', data? }` at :151-152). They pass `message` through `ValidationErrorOptions`, so no validator file needs to change.
7. Record keys reach the key context through `keyValidator.validate(objectKey, newPath, objectKey, 'key')` at src/record.ts:96. A key test failure means a `record(string({ test }), ...)` whose test calls `report`.
8. Test pattern: record prefix tests at src/record.test.ts:502-546 assert `message` directly. There is no `ValidationError.test.ts`.
9. README: Error Handling field list at README.md:334-344, `message` at :337. `reason` belongs next to `message`. Examples at :358, :371, :383, :399 print `error.message`.
10. package.json:3 is `6.0.0`; the publish workflow sets the version, so package.json is not bumped by hand. `src/index.ts:8` re-exports with `export *`, so no export change is needed.
11. Hard to undo: the public API addition only. Merging the `feat:` PR to main publishes to npm automatically.

## Open questions

1. Should `toJSON()` include `reason`?
