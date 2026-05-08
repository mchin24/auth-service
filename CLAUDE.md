# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Run with hot-reload via tsx watch

# Build
npm run build        # Compile TypeScript to dist/

# Tests
npm test             # Run Jest unit tests
npm run bdd-test     # Run Cucumber BDD tests

# Production
npm start            # Run compiled output from dist/
```

To run a single Jest test file:
```bash
NODE_OPTIONS=--experimental-vm-modules npx jest tests/auth.test.ts
```

## Architecture

This is a Node.js/Express auth microservice written in TypeScript (ESM). The intended API surface is:

- `POST /auth/register` — create new user
- `POST /auth/login` — returns access + refresh tokens
- `POST /auth/logout` — invalidate refresh token
- `POST /auth/refresh` — exchange refresh token for new access token
- `GET /auth/me` — return current user from access token
- `POST /auth/forgot-password` — generates reset token, enqueues email job via Job Queue Service
- `POST /auth/reset-password` — complete password reset with token

**Key files:**
- `src/server.ts` — Express app and route definitions (most routes are stubs)
- `src/controllers/auth.ts` — controller logic (currently only `getMe` is stubbed)
- `src/types.ts` — `UserAccount` type and `isUserAccount` type guard
- `tests/auth.test.ts` — Jest tests for validation logic and auth controller
- `docs/features/` — Cucumber BDD feature files and step definitions

**Database:** PostgreSQL via `pg`. Connection is expected via `DATABASE_URL` env var (see `.env`).

**ESM quirks:** The project uses `"type": "module"`. Imports within `src/` must use `.js` extensions even for `.ts` source files. Jest runs with `NODE_OPTIONS=--experimental-vm-modules` and ts-jest's ESM preset to handle this. BDD tests use `NODE_OPTIONS='--import tsx'` for the same reason.

**Deployment:** Docker Compose connects the service to an external `dev-shared` network, expected to contain a shared PostgreSQL instance.

## Test structure

- Jest tests live in `tests/` and are excluded from `tsc` compilation.
- Cucumber feature files are in `docs/features/*.feature`; step definitions in `docs/features/step_definitions/`.
- `cucumber.json` configures paths and imports for the BDD runner.
- `jest.config.ts` uses `moduleNameMapper` to strip `.js` extensions so Jest can resolve TypeScript files.
