# Active Context

## Current Work
- Planning health check endpoint implementation

## Recent Changes
- Initialized Memory Bank
- Fixed syntax error in `index.ts` (invalid named arrow function)
- Created `tests/` directory and moved `auth.test.ts` there to separate tests from production code
- Updated `tsconfig.json` to include only `src/` and exclude `tests/` from the build process
- Updated `jest.config.ts` to use `ts-jest` ESM preset and handle ESM compatibility
- Configured `NODE_OPTIONS=--experimental-vm-modules` in `package.json` and `docker-compose.yml` to support ESM Jest in WSL and Docker
- Updated `docs/api-implementation.txt` with full pseudocode for all endpoints and complete auth functions list

## Next Steps
- Implement `GET /health` endpoint with DB connectivity check (see Health Check Plan below)
- Implement auth endpoints per `docs/api-implementation.txt`

## Health Check Plan
Two endpoints: `GET /health/live` (liveness, no DB) and `GET /health/ready` (readiness, pings DB with `SELECT 1`).

**Files to change:**
- `src/controllers/auth.ts` — add `checkDatabaseConnection(): Promise<boolean>` using pg Client
- `src/server.ts` — add `GET /health/live` (always `200 { status: "ok" }`) and `GET /health/ready` (`200 { status: "ok", db: "ok" }` or `503 { status: "error", db: "error" }`)
- `docker-compose.yml` — add healthcheck directive pointing to `/health/ready`: interval 30s, timeout 5s, retries 3, start_period 10s
- `README.md` — add both endpoints to checklist and add Operations section
