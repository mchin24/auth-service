# auth-service

## Implementation Checklist

- [x] `POST /auth/register`
- [x] `POST /auth/login`
- [x] `POST /auth/logout`
- [x] `POST /auth/refresh`
- [x] `GET  /auth/me`
- [x] `POST /auth/forgot-password`
- [x] `POST /auth/reset-password`

---

## Local Development

`docker-compose.yml` is for local development only — it overrides the Dockerfile's `CMD` with `npm run dev` (tsx watch, hot-reload) and bind-mounts the source tree. Production deployments build and run the `Dockerfile` directly (`npm run build` + `npm run start` against compiled `dist/` output); the compose file is not part of that pipeline.

---

## Endpoints

### POST /auth/register

Create a new user account.

**Request**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

> **Password requirements:** min 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character (`!@#$%^&*`).

**Response `201`**
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "user@example.com"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Errors**
- `400` — missing or invalid fields (including password requirements not met)
- `409` — email already in use

---

### POST /auth/login

Authenticate and receive tokens.

**Request**
```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response `200`**
```json
{
  "user": {
    "id": 1,
    "username": "string",
    "email": "user@example.com"
  },
  "tokens": {
    "accessToken": "string",
    "refreshToken": "string"
  }
}
```

**Errors**
- `400` — missing fields
- `401` — invalid credentials

---

### POST /auth/logout

Invalidate a refresh token.

**Request**
```json
{
  "refreshToken": "string"
}
```

**Response `204`** *(no body)*

**Errors**
- `400` — missing token
- `401` — token not recognized

---

### POST /auth/refresh

Exchange a refresh token for a new access token.

**Request**
```json
{
  "refreshToken": "string"
}
```

**Response `200`**
```json
{
  "accessToken": "string"
}
```

**Errors**
- `400` — missing token
- `401` — token expired or invalid

---

### GET /auth/me

Return the current user from an access token.

**Request headers**
```
Authorization: Bearer <accessToken>
```

**Response `200`**
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors**
- `401` — missing or invalid token
- `404` — user not found

---

### POST /auth/forgot-password

Generate a password reset token and send a reset email via Resend.

**Request**
```json
{
  "email": "user@example.com"
}
```

**Response `202`** *(no body — always succeeds to avoid email enumeration)*

**Errors**
- `400` — missing or invalid email

---

### POST /auth/reset-password

Complete a password reset using the token from the reset email.

**Request**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Response `200`** *(no body)*

**Errors**
- `400` — missing fields or password doesn't meet requirements
- `401` — token expired or invalid

---

## Future Enhancements

- **Per-client auto-login config** — currently all registrations auto-login (tokens returned on `POST /auth/register`). Future: add a `clients` table keyed by API key or `clientId`, with an `autoLogin` flag so each site can opt in or out without a separate deployment.
