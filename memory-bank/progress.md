# Progress

## What Works
- Project structure and build tooling
- ESM/TypeScript configuration for both Jest and Cucumber
- Docker Compose setup with `dev-shared` network
- `GET /health` endpoint
- `POST /auth/register` — full implementation with validation, bcrypt, DB insert, token generation
- `POST /auth/login` — full implementation with credential verification and token generation
- `POST /auth/logout` — full implementation with refresh token validation and invalidation
- `generateTokens` — async, writes refresh token to `refresh_tokens` table
- `validateRefreshToken` — JWT verification + DB lookup with expiry filter
- `invalidateRefreshToken` — deletes token from DB
- `src/db/schema.sql` — documents `users` and `refresh_tokens` tables

## Left to Build
- `clearStaleRefreshTokens` service function
- `node-cron` setup in `index.ts` (run at startup + on schedule)
- `POST /auth/refresh` — token rotation
- `GET /auth/me` — return user from access token
- `POST /auth/forgot-password` — generate reset token, enqueue email job
- `POST /auth/reset-password` — validate reset token, update password

## Current Status
- register, login, logout done; refresh, me, forgot-password, reset-password are stubs
- `clearStaleRefreshTokens` + cron wiring deferred to next session
