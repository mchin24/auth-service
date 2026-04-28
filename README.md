# auth-service

## Implementation Checklist

- [ ] `POST /auth/register`
- [ ] `POST /auth/login`
- [ ] `POST /auth/logout`
- [ ] `POST /auth/refresh`
- [ ] `GET  /auth/me`
- [ ] `POST /auth/forgot-password`
- [ ] `POST /auth/reset-password`

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

**Response `201`**
```json
{
  "id": 1,
  "username": "string",
  "email": "user@example.com",
  "accessToken": "string",
  "refreshToken": "string"
}
```

**Errors**
- `400` — missing or invalid fields
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
  "accessToken": "string",
  "refreshToken": "string"
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
  "email": "user@example.com"
}
```

**Errors**
- `401` — missing or invalid token
- `404` — user not found

---

### POST /auth/forgot-password

Generate a password reset token and enqueue a reset email via the Job Queue Service.

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

**Response `200`**
```json
{
  "message": "Password updated successfully"
}
```

**Errors**
- `400` — missing fields or password doesn't meet requirements
- `401` — token expired or invalid

---

## Future Enhancements

- **Per-client auto-login config** — currently all registrations auto-login (tokens returned on `POST /auth/register`). Future: add a `clients` table keyed by API key or `clientId`, with an `autoLogin` flag so each site can opt in or out without a separate deployment.
