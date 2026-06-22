# Progress

## What Works
- Project structure and build tooling
- ESM/TypeScript configuration for both Jest and Cucumber
- Docker Compose setup with `dev-shared` network
- `GET /health` endpoint
- `POST /auth/register` — full implementation with validation, bcrypt, DB insert, token generation
- `POST /auth/login` — full implementation with credential verification and token generation
- `POST /auth/logout` — full implementation with refresh token validation and invalidation
- `POST /auth/refresh` — full implementation: `validateRefreshToken` returns `UserAccount | false`, controller issues new access token via `generateTokens(user)`
- `GET /auth/me` — full implementation: gated by `requireAuth` middleware, returns `{id, username, email, createdAt}`
- `generateTokens` — async, writes refresh token to `refresh_tokens` table, signs JWT payload as `{id, email, username}`
- `validateRefreshToken` — JWT verification + DB lookup with expiry filter
- `invalidateRefreshToken` — deletes token from DB
- `src/db/schema.sql` — documents `users` and `refresh_tokens` tables

## Left to Build
- `clearStaleRefreshTokens` service function
- `node-cron` setup in `index.ts` (run at startup + on schedule)
- `POST /auth/forgot-password` — generate reset token, enqueue email job
- `POST /auth/reset-password` — validate reset token, update password

## Current Status
- register, login, logout, refresh, me done; forgot-password, reset-password are stubs
- `clearStaleRefreshTokens` + cron wiring deferred to next session
