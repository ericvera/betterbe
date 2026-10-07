ensure that we are using node version 24 throughout

## Investigation

- CI already on Node 24: `.github/workflows/publish.yml:26` and `.github/workflows/dependabot.yml:30` set `node-version: 24` (`actions/setup-node@v4`, bare major).
- `package.json:15` `"engines": { "node": ">=20" }` — the only published Node constraint.
- `package.json:31` `"@types/node": "^26.6.4"` (yarn.lock:353-355 at 26.6.4); newer than the Node 24 runtime. `@types/node@24` exists (latest 24.19.1).
- No `.nvmrc`, `.node-version`, `.tool-versions`, `volta` key or root mise toml — nothing pins local dev Node. Local node is v24.18.0.
- `@types/node` is only used by `tsconfig.eslint.json:6` (`"types": ["node"]` for eslint.config.mjs); `src/` uses no Node APIs.
- `.github/dependabot.yml:8-23` has no ignore rule, so Dependabot would propose @types/node majors past 24.
- Hard to undo: raising `engines.node` to `>=24` breaks Node 20/22 consumers (a breaking public change; needs a `BREAKING CHANGE:` footer for a major). A push to main auto-publishes to npm.

## Open questions

1. Does "throughout" include `engines.node` (consumer-facing, breaking → major release) or only the dev/CI toolchain?
2. Pin `@types/node` to 24 and add a Dependabot ignore for its majors?
3. Add a `.nvmrc` pin file and switch workflows to `node-version-file`?
