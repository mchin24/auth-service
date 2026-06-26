# Active Context

## Current Work
- Implementing remaining auth endpoints (forgot-password, reset-password)

## Recent Changes
- Implemented `POST /auth/refresh` (validate → generate new access token via `generateTokens(user)`)
- Implemented `GET /auth/me` behind `requireAuth` middleware, returns `{id, username, email, createdAt}`
- Fixed `generateTokens` JWT payload field name (`userId` → `id`) to match `UserAccount` shape
- Implemented `POST /auth/logout` in controller and service layers
- Made `generateTokens` async; now writes refresh token to `refresh_tokens` DB table
- Added `validateRefreshToken` (JWT verify + DB check with expiry filter)
- Added `invalidateRefreshToken` (DELETE from refresh_tokens)
- Added `src/db/schema.sql` with `users` and `refresh_tokens` table definitions

## Next Steps
- Add `clearStaleRefreshTokens` to `src/services/auth.ts`
- Wire up `node-cron` in `src/index.ts`: call `clearStaleRefreshTokens` at startup and on hourly schedule
- Implement `POST /auth/forgot-password` and `POST /auth/reset-password`
