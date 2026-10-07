# 01_02 Document path-prefixed error messages in README

## Goal

Update the README's Error Handling section to say that `message` is prefixed with the failing path, and to show the new `items[0].price` path format.

## Files to modify/create

- `README.md`

## Background

- This is betterbe, a dependency-free TypeScript validation library.
- Task 01_01 changed `src/ValidationError.ts`:
  - The constructor now calls `super(formatMessage(options))`. When the full path (`path` plus `key`) is non-empty, the message is `<path>: <constraint text>`. When `context` is `'key'` (record keys), it is `key <path>: <constraint text>`. Root-level errors keep the raw text.
  - `pathString` (via `joinPath`) attaches bracketed array segments without a dot: `items[0].price`, `[0][2]`.
  - Custom `test` messages from `report({ message })` are prefixed too.
- Current README spots:
  - `README.md:337`: `message: A human-readable error message`.
  - `README.md:340`: ``pathString: Full path as a dot-separated string (e.g. `'items.0.price'`)``. This is wrong; it should be `items[0].price`.
  - `README.md:346-400`: an `### Examples` block (heading at 346, closing fence at 400) with `console.log(error.code)` lines for the root, record-key, array-item and object-property cases.
  - `README.md:145` and `:149` quote the root-level `is not a number`. That stays unprefixed, so leave it.
- Release is 5.0.0. Do not edit `package.json`.

## Guides

None (the config has no Skills & guides entries).

## Implementation details

1. `README.md:337`: change the `message` bullet to say it is a human-readable message, prefixed with the failing path when there is one (e.g. `'name: is longer than expected length 10'`, `'items[0].price: is greater than maximum 10'`, `'key 123: does not match pattern'` for record keys). Root-level errors have no prefix.
2. `README.md:340`: change the `pathString` bullet to ``Full path as a string; object keys are dot-separated and array indexes attach directly (e.g. `'items[0].price'`)``.
3. In the `### Examples` block, add one `console.log(error.message) // '...'` line per example, with the exact message:
   - Basic `string({ minLength: 3 })` with `'ab'`: `'is shorter than expected length 3'`.
   - Record key `{ '123': 100 }` with `pattern: /^[a-z]+$/`: get the exact string by running the snippet against the built library. It starts with `key 123: `.
   - Array `[1, -5, 3]` with `number({ min: 0 })`: `'[1]: is less than minimum 0'`. Verify the exact constraint text in `src/number.ts`.
   - Object `name` too long: `'name: is longer than expected length 10'`.
4. Run each example against `dist/` (after `yarn build`) with a throwaway node script in the scratchpad (not in the repo) to confirm every quoted message is exact.

## Gotchas

- Copy the message text from the real output, not from memory. Constraint wording differs between validators (`is less than minimum`, `is shorter than expected length`).
- Keep the root-level `is not a number` quotes at `README.md:145`/`:149` unchanged.
- The README must pass `yarn prettier --check .`.

## Verification

- No test covers the README. Substitute check: run the four Examples snippets against `dist/index.js` and confirm each logged `message` matches the README comment exactly.
- `yarn build`, `yarn lint`, `yarn prettier --check .`, `yarn test`: all clean.
