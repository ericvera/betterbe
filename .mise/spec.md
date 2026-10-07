# Spec: path-prefixed ValidationError messages

## What

`ValidationError.message` names the failing field. Any error whose full path is non-empty has its message prefixed with that path:

- Object property: `source: is longer than expected length 40`
- Nested object: `user.age: is not number`
- Array item: `items[0].price: is greater than maximum 10`. Bracketed segments attach without a dot.
- Record key (context `'key'`): `key 123: does not match pattern ...`, `key user2.invalidfield: is not one of the allowed values`
- Root-level error (empty path): raw message, no prefix (`is not a number`).
- Custom `test` messages passed to `report({ message })` get the same prefix.

The public `pathString` getter uses the same join, so `[0].[2]` becomes `[0][2]` and `items.[0].price` becomes `items[0].price`.

Released as betterbe 5.0.0 (breaking change). Bumping betterbe in Okven is out of scope for this repo.

## Design

All changes are in `src/ValidationError.ts`. No validator file changes.

- A module-private helper `joinPath(segments: string[]): string` drops empty segments (as `filter(Boolean)` does today). It then concatenates them, adding a `.` before each segment except the first and except any segment that starts with `[`. Examples: `['items', '[0]', 'price']` gives `items[0].price`, `['[0]', '[2]']` gives `[0][2]`, `['user2', 'score']` gives `user2.score`, `[]` gives `''`.
- A module-private helper `formatMessage(options: ValidationErrorOptions): string` builds the full path from `options.path ?? []` plus `options.key` when it is not `undefined`, and joins it with `joinPath`. If the result is `''` it returns `options.message` unchanged. Otherwise it returns `` `${prefix}: ${options.message}` ``, where `prefix` is `` `key ${joined}` `` when `(options.context ?? 'value') === 'key'` and `joined` otherwise.
- The constructor calls `super(formatMessage(options))`. The rest of the constructor is unchanged.
- The `pathString` getter returns `joinPath(segments)`, with `segments` built the same way as today. Its doc comment becomes `(e.g. 'items[0].price')`.
- `toJSON()` is unchanged. Serialized errors show the path in both `message` and `pathString`. This is accepted.
- `ValidationErrorOptions.message` stays the raw constraint text. Only the stored `Error.message` is prefixed. The `message` doc comment on the class or options should say so.
- Anyone constructing `ValidationError` directly also gets the prefix. This is intended.
- Release: `package.json` is NOT edited. `.github/workflows/publish.yml` runs `TriPSs/conventional-changelog-action`, which bumps the version from commit messages on push to `main`. The merge commit, or a commit on the branch, must carry a `BREAKING CHANGE:` footer (repo precedent: `1b9eb48`, `80e0982`) so that the action bumps 4.1.0 to 5.0.0. A manual bump to 5.0.0 would make the action produce 6.0.0. Merging to `main` and publishing happen only with the owner's go-ahead after review. No task performs them.

Nothing is removed. The old `items.0.price` doc claim is corrected.

## Hard-to-undo

- Public API behavior change: `ValidationError.message` gains a path prefix, and `ValidationError.pathString` changes its array-segment join (`[0].[2]` becomes `[0][2]`). Released as major 5.0.0.
- npm publish of 5.0.0 through `.github/workflows/publish.yml` (`npm publish --provenance`, GitHub release) on push to `main`. It is triggered by the `BREAKING CHANGE:` commit footer and cannot be taken back. No task runs it. It needs the owner's go-ahead after review.

## Task index

| Task file                       | What it does                                                                                                                                      | Files                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `01_01_prefix_error_message.md` | Adds `joinPath` and `formatMessage` to ValidationError, prefixes messages, changes `pathString` join, updates inline snapshots, adds prefix tests | `src/ValidationError.ts` (+ `src/*.test.ts`) |
| `01_02_readme_error_docs.md`    | Updates the README Error Handling docs for the prefixed `message` and the `items[0].price` path format                                            | `README.md`                                  |
