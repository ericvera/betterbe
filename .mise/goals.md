ensure that we are using node version 24 throughout

## Investigation

- CI already on Node 24: `.github/workflows/publish.yml:26` and `.github/workflows/dependabot.yml:30` set `node-version: 24` (`actions/setup-node@v4`, bare major).
- `package.json:15` `"engines": { "node": ">=20" }` — the only published Node constraint.
- `package.json:31` `"@types/node": "^26.6.4"` (yarn.lock:353-355 at 26.6.4); newer than the Node 24 runtime. `@types/node@24` exists (latest 24.19.1).
- No `.nvmrc`, `.node-version`, `.tool-versions`, `volta` key or root mise toml — nothing pins local dev Node. Local node is v24.18.0.
- `@types/node` is only used by `tsconfig.eslint.json:6` (`"types": ["node"]` for eslint.config.mjs); `src/` uses no Node APIs.
- `.github/dependabot.yml:8-23` has no ignore rule, so Dependabot would propose @types/node majors past 24.
- Hard to undo: raising `engines.node` to `>=24` breaks Node 20/22 consumers (a breaking public change; needs a `BREAKING CHANGE:` footer for a major). A push to main auto-publishes to npm.

## Decisions

1. Raise `package.json` `engines.node` from `>=20` to `>=24`. This is a breaking change: the PR description must end with a `BREAKING CHANGE:` footer (last paragraph) so the merge publishes a major release.
2. Pin `@types/node` to `^24` (update yarn.lock) and add a Dependabot ignore rule for `@types/node` semver-major updates.
3. No version pin file (`.nvmrc` etc.); workflows keep `node-version: 24`.

## Assumptions

- CI workflows already on `node-version: 24` need no change.
- PR title uses `feat` (not the `type!:` shorthand); the major bump comes from the footer.
- README or other docs that mention a supported Node version are updated to 24 if any exist.

## Proposal

Issue: the published `engines` allows Node 20+ and `@types/node` targets 26, so the project is not on Node 24 throughout (CI already is).
Approach: set `engines.node` to `>=24`, pin `@types/node` to `^24` with a Dependabot major-update ignore, and update any docs naming a Node version; the PR gets a `BREAKING CHANGE:` footer.
Skips: none — the engines bump is a breaking public change, so spec and critic run.
