# Contributing

## Core Principles

- Dependencies: Do not add new dependencies. Pull requests that introduce pnpm install changes or modify pnpm-lock.yaml will be rejected. This is a strict requirement to control the dependency footprint.
- Testing: New or modified state actions or hooks must include corresponding unit tests. Changes without adequate tests will not be merged.
- Localization: All new or modified user-facing strings must be wrapped in the Lingui macro (<Trans>, t``, etc.). This must be explicitly noted in the pull request description.

## Local Development

The project uses pnpm for package management. A pre-commit hook is configured with Husky to run tsc, prettier, and vitest.
While the hook formats code automatically, configuring your IDE to format on save is highly recommended for a better development workflow.

## Reporting Bugs

1. Search Existing Issues: Before submitting a new bug report, search the existing issues to ensure the bug has not already been reported.
2. Reproduce the Issue: Confirm that the bug is reproducible with the latest version of the master branch.
3. Create a New Issue: If the bug is new and reproducible, create a new issue. Provide a concise and descriptive title.
4. Issue Body: In the body of the issue, include the following:
   - A clear, step-by-step description of how to reproduce the bug.
   - A description of the expected behavior.
   - A description of the actual behavior.
   - Any relevant environment details (e.g., browser version, operating system).

## Feature Requests

New feature ideas and proposals should be submitted to [GitHub Discussions](https://github.com/Mezriss/dungeonmix/discussions).

## Pull Request Process

1. Fork and Clone: Fork the repository and create a local clone.
2. Create a Feature Branch: Create a new branch from an up-to-date master branch. Name the branch descriptively (e.g., feat/area-resize-handles or fix/header-layout-bug).
3. Implement Changes: Make your code changes, adhering to the principles outlined above (no new dependencies, add tests, handle localization).
4. Commit Changes: Make atomic commits with clear and concise messages.
5. Push and Open PR: Push your feature branch to your fork and open a pull request against the original repository's master branch.
6. PR Description: The pull request description must be clear and provide context for the changes. It should link to the corresponding issue or discussion it resolves.
7. Review: The pull request will be reviewed. Address any feedback by pushing additional commits to your feature branch. The pull request will update automatically.
