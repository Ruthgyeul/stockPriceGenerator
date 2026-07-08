# Contributing

Thanks for considering a contribution! This document covers the conventions this
repository actually follows so you don't have to reverse-engineer them from history.

## Workflow

1. Open (or find) an issue describing the change.
2. Branch off `main` using the naming convention below.
3. Commit using [Conventional Commits](#commit-messages) — this is enforced by CI.
4. Open a pull request against `main`. CI (build, tests, CodeQL, commitlint) must pass.
5. Once merged, [release-please](.github/workflows/release-please.yaml) opens or updates
   a release PR that bumps the version and updates `CHANGELOG.md` based on the commits
   since the last release. Merging that release PR tags the release and publishes to npm.

## Branch naming

```
<type>#<issue-number>/<short-description>
```

Examples: `fix#25/input-validation`, `feat#29/algorithm-expansion`, `docs#33/contributing`.

`<type>` matches the [commit type](#commit-messages) of the work the branch contains, and
`<issue-number>` is the GitHub issue the branch resolves.

## Commit messages

This repository follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>: <description>
```

Commonly used types here: `feat`, `fix`, `chore`, `docs`, `test`, `ci`, `refactor`, `perf`.
Commit messages are linted on every pull request by the `commitlint` GitHub Action
(config in `commitlint.config.js`); non-conforming commits will fail CI. You can check
locally before pushing:

```bash
npm run commitlint
```

`feat` and `fix` commits are what drive the automatic version bump — see
[Version management automation](#workflow) above.

## Before opening a pull request

```bash
npm run build
npm test
```
