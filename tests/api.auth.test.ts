import { describe, expect, test } from "@jest/globals";
import { type UserAccount, isUserAccount } from "../src/types.js";
import { getMe } from "../src/controllers/auth.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

import request from 'supertest';
import app from '../src/server.js';



// account registration tests

describe('Testing Register API Response - 201 response', () => {
  test('successful account registration on /auth/register should return 201', async () => {
    const newUser = {
      "email": "user@example.com",
      "password": "test12345!"
    }
    
    const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
    expect(response.status).toBe(201);
    expect(response.id).not.toBe(null);
    expect(response.username).not.toBe(null);
    expect(response.email).not.toBe(null);
    expect(response.accessToken).not.toBe(null);
    expect(response.refreshToken).not.toBe(null);
  });
});


describe('Testing Register API Response - 4xx responses', () => {
  test('account registration on /auth/register with null password should return 400', async () => {
    const newUser = {
      "email": "user@example.com",
      "password": ""
    }
    
    const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('account registration on /auth/register with password too short should return 400', async () => {
    const newUser = {
      "email": "user@example.com",
      "password": "test"
    }
    
    const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

    test('account registration on /auth/register with invalide password format should return 400', async () => {
    const newUser = {
      "email": "user@example.com",
      "password": "test12345"
    }
    
    const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });
  
  test('account registration on /auth/register with duplicate email should return 409', async () => {
    const newUser = {
      "email": "user@example.com",
      "password": "test12345!"
    }
    
    const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
    expect(response.status).toBe(409);
  });

});


// login tests
// POST /auth/login
// - validate all required inputs are present
// -- if not all required are present, return 400 response
// - isValidEmail(email)
// - isValidPassword(password)
// -- if !isValidEmail || !isValidPassword, return 400 response
// - getUserByEmail(email)
// - if not found, return 401
// - verifyPassword(plaintext, hash)
// - if no match, return 401
// - generateTokens(user)
// - return 200 + user + tokens


describe('Testing Login API Response - 200 response', () => {
  test('successful account login on /auth/login should return 200', async () => {
    const user = {
      "email": "user@example.com",
      "password": "test12345!"
    }
    
    const response = await request(app).post('/auth/login').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.accessToken).not.toBe(null);
    expect(response.refreshToken).not.toBe(null);
    expect(verifyPassword(user.password, response.user.password)).toBe(true);


    // - verifyPassword(plaintext: string, hash: string): Promise<boolean>

  });
});


describe('Testing Login API Response - 4xx response', () => {
  test('missing email on account login on /auth/login should return 400', async () => {
    const user = {
      "email": "",
      "password": "test12345!"
    }
    
    const response = await request(app).post('/auth/login').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('missing password on account login on /auth/login should return 400', async () => {
    const user = {
      "email": "user@example.com",
      "password": ""
    }
    
    const response = await request(app).post('/auth/login').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('invalid credentials on account login on /auth/login should return 401', async () => {
    const user = {
      "email": "user@example.com",
      "password": "wrongPassword!"
    }
    
    const response = await request(app).post('/auth/login').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(401);
    expect(verifyPassword(user.password, response.user.password)).not.toBe(true);

  });  
});


// logout tests

describe('Testing Logout API Response - 204 response', () => {
  test('successful account login on /auth/logout should return 204', async () => {
    const refreshToken = {
      "refreshToken": "valid-refresh-token123!!"
    }
    
    const response = await request(app).post('/auth/logout').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(204);
  });
});


describe('Testing Logout API Response - 4xx response', () => {
  test('missing token on /auth/logout should return 400', async () => {
    const refreshToken = {
      "refreshToken": null
    }
    
    const response = await request(app).post('/auth/logout').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('invalid token on /auth/logout should return 401', async () => {
    const refreshToken = {
      "refreshToken": "invalid-refresh-token123!!"
    }
    
    const response = await request(app).post('/auth/logout').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(401);
  });

});


// refresh token exchange for new access token tests

describe('Testing refresh token exchange for new access token API Response - 200 response', () => {
  test('successful refresh token exchange for new access token on /auth/refresh should return 200', async () => {
    const refreshToken = {
      "refreshToken": "valid-refresh-token123!!"
    }
    
    const response = await request(app).post('/auth/refresh').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.accessToken).not.toBe(null);
  });
});


describe('Testing refresh token exchange for new access token API Response - 4xx response', () => {
  test('missing token on /auth/refresh should return 400', async () => {
    const refreshToken = {
      "refreshToken": null
    }
    
    const response = await request(app).post('/auth/refresh').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('invalid token on /auth/refresh should return 401', async () => {
    const refreshToken = {
      "refreshToken": "invalid-refresh-token123!!"
    }
    
    const response = await request(app).post('/auth/refresh').send(refreshToken).set('Accept', 'application/json');
    
    expect(response.status).toBe(401);
  });

});

// testing current user retrieval based on access token

describe('Testing user returned from access token API Response - 200 response', () => {
  test('successful current user retrieval based on access token on /auth/me should return 200', async () => {
    const bearerToken = {
      "bearerToken": "valid-bearer-token123!!"
    }
    
    const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${bearerToken.bearerToken}`).set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    expect(response.id).not.toBe(null);
    expect(response.email).not.toBe(null);
    expect(response.username).not.toBe(null);

  });
});


describe('Testing user NOT returned from access token API Response - 4xx response', () => {
  test('missing token on /auth/me should return 401', async () => {
    const bearerToken = {
      "bearerToken": null
    }
    
    const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${bearerToken.bearerToken}`).set('Accept', 'application/json');
    
    expect(response.status).toBe(401);
  });

  test('valid token but user not found on /auth/me should return 404', async () => {
    const bearerToken = {
      "bearerToken": "valid-bearer-token123!!"
    }
    
    const response = await request(app).get('/auth/me').set('Authorization', `Bearer ${bearerToken.bearerToken}`).set('Accept', 'application/json');
    
    expect(response.status).toBe(404);
  });

});






// tests for /auth/forgot-password 

describe('Testing user forgot password functionality Response - 202 response', () => {
  test('Generating a password reset token and enqueue a reset email via the Job Queue Service on /auth/forgot-password should return 200', async () => {
    const user = {
      "email": "user@example.com",
    }
    
    const response = await request(app).post('/auth/forgot-password').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(202);
    //add check for reset email job being enqueued

  });
});


describe('Testing user forgot password functionality Response - 4xx response', () => {
  test('Generating a password reset token without a valid email on /auth/forgot-password should return 400', async () => {
    const user = {
      "email": "user@example,com",
    }
    
    const response = await request(app).post('/auth/forgot-password').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('Generating a password reset token without an email on /auth/forgot-password should return 400', async () => {
    const user = {
      "email": null,
    }
    
    const response = await request(app).post('/auth/forgot-password').send(user).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

});

// tests for /auth/reset-password 

describe('Testing functionality for password reset using token from reset email - 200 response', () => {
  test('Complete a password reset using the token from the reset email on /auth/reset-password should return 200', async () => {
    const password = {
        "token": "myNewToken123",
        "newPassword": "test12345"
        }
    
    const response = await request(app).post('/auth/reset-password').send(password).set('Accept', 'application/json');
    
    expect(response.status).toBe(200);
    //add check for reset email job being enqueued

  });
});


describe('Testing functionality for password reset using token from reset email - 4xx response', () => {
  test('Complete a password reset using the token from the reset email WITHOUT a password on /auth/reset-password should return 400', async () => {
    const password = {
        "token": "myNewToken123",
        "newPassword": null
        }
    
    const response = await request(app).post('/auth/reset-password').send(password).set('Accept', 'application/json');
    
    expect(response.status).toBe(400);
  });

  test('Complete a password reset using the token from the reset email with an expired token on /auth/reset-password should return 401', async () => {
    const password = {
        "token": "myExpiredNewToken123",
        "newPassword": "test12345"
        }
    
    const response = await request(app).post('/auth/reset-password').send(password).set('Accept', 'application/json');
    
    expect(response.status).toBe(401);
  });

});


