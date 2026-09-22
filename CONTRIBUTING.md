# Contributing

Thanks for considering a contribution.

## Getting started

```bash
git clone https://github.com/unairada/pi-session-profile-selector.git
cd pi-session-profile-selector
npm install --ignore-scripts
npm test
```

## Project layout

```text
src/index.js      Pi extension: session_start handler and first-run setup
src/profiles.js   Config loading, validation, and defaults
src/wizard.js     Helpers used by the TUI setup wizard
test/             Node's built-in test runner
```

## Making changes

- Run `npm test` before and after your change. CI runs the same suite on push and PRs.
- Keep the extension small and dependency-free — it runs inside Pi with full user permissions.
- If you change the config schema, update `README.md` and `CHANGELOG.md` in the same pull request.
- Prefer HTTPS clone/install commands in docs so users without SSH keys can follow them.

## Releasing

1. Update `CHANGELOG.md` with the new version and date.
2. Bump `version` in `package.json`.
3. Tag the release: `git tag vX.Y.Z && git push --tags`.
4. Publish to npm if the name is still available: `npm publish`.
