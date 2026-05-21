import { describe, expect, test } from "@jest/globals";
import { type UserAccount, isUserAccount } from "../src/types.js";
import { getMeHandler } from "../src/services/auth.js";
import { isValidEmail } from "../src/controllers/auth.js";
import { isValidPassword } from "../src/controllers/auth.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

import request from 'supertest';
import app from '../src/server.js'; // Your Express app



let user: UserAccount = {
  id: 1,
  username: "testuser",
  email: "test@example.com"
};



describe("Getting user information", () => {
  test("Returns a UserAccount", async () => {
    const user = await getMeHandler("12345") as UserAccount;
    expect(isUserAccount(user)).toBe(true);
    expect(user?.email).not.toBe(null);

  });
});


// testing isValidEmail function
describe("Testing valid email format", () => {
  test("Checks email format and returns a UserAccount if valid", () => {
    // const user = getMe("12345");
    const valid_user_email = "valid@email.com";

    expect(valid_user_email).toMatch(emailRegex);
    // expect(isUserAccount(user)).toBe(true);
    expect(isValidEmail(valid_user_email)).not.toBe(false);
  });
});


describe("Testing invalid email format", () => {
  test("Checks invalid email format and does not return a UserAccount", () => {

    const invalid_user_email = "invalid_email.com";

    expect(invalid_user_email).not.toMatch(emailRegex);
    expect(isValidEmail(invalid_user_email)).toBe(false);
  });
});


// testing isValidPassword function
describe('Testing Password Format', () => {

  test('correct password format is used', () => {
    const validPassword = 'Password123!';
    expect(validPassword).toMatch(passwordRegex);
    expect(isValidPassword(validPassword)).not.toBe(false);
    // expect(user.password).toMatch(passwordRegex);
  });
});


describe('Testing Invalid Password Format', () => {
  test('should reject a password without special characters', () => {
    const invalidPassword = 'password123';
    expect(invalidPassword).not.toMatch(passwordRegex);
    expect(isValidPassword(invalidPassword)).not.toBe(false);
    // expect(user.password).not.toMatch(passwordRegex);

  });

  test('should reject a password that is too short', () => {
    const shortPassword = 'Pa1!';
    expect(shortPassword).not.toMatch(passwordRegex);
    expect(isValidPassword(shortPassword)).not.toBe(false);
    // expect(user.password).not.toMatch(passwordRegex);

  });
});

// testing createUser function
describe("Create New User", () => {
  test("Returns a UserAccount", () => {
    // UserAccount user = createUser("test@example.com", "Password123!");
    const newUser: UserAccount = createUser("test@example.com", "Password123!");  // creatUser will create type UserAccount and return it, so we can assign it to user variable of type UserAccount

    newUser.token = "12345";
// - createUser(email: string, password: string): Promise<UserAccount>
// - generateTokens(user: UserAccount): AuthTokens


    // const user_account = getMe(user.token);
    expect(isUserAccount(newUser)).toBe(true);
    expect(newUser?.token).not.toBe(null);
    expect(newUser?.email).not.toBe(null);
    expect(newUser?.password).not.toBe(null);

  });
});


// testing getUserByEmail function
describe("Getting user by email", () => {
  test("Returns a UserAccount", () => {
    user = getUserByEmail("test@example.com");
    // const user = getUserByEmail("test@example.com");
    // - getUserByEmail(email: string): Promise<UserAccount | null>

    // const user_account = getMe(user.token);
    expect(isUserAccount(user)).toBe(true);
    expect(user?.id).not.toBe(null);
    expect(user?.username).not.toBe(null);
    expect(user?.email).not.toBe(null);

  });
});


describe("Getting user by invalid email", () => {
  test("Returns an error", () => {
    user = getUserByEmail("testInvalidEmail.com");
    // const user = getUserByEmail("test@example.com");
// - getUserByEmail(email: string): Promise<UserAccount | null>

    // const user_account = getMe(user.token);
    expect(isUserAccount(user)).toBe(false);
    expect(user?.id).toBe(null);
    expect(user?.username).toBe(null);
    expect(user?.email).toBe(null);

  });
});


// verifying verifyPassword function
describe("Verifying password on login", () => {
  test("Returns a boolean", () => {
    // verifying verifyPassword function.  covering in api.auth.text.ts

    
  });
});




//testing generateTokens function
describe("Testing token creation", () => {
  test("Returns an AuthTokens object", () => {
    // UserAccount user = createUser("test@example.com", "Password123!");
    const newUser: UserAccount = {
      id: 1,
      username: "testuser",
      email: "test@example.com"
    }
    
    const authTokens: AuthTokens = generateTokens(newUser);

// - createUser(email: string, password: string): Promise<UserAccount>
// - generateTokens(user: UserAccount): AuthTokens


    expect(authTokens.accessToken).not.toBe(null);
    expect(authTokens.refreshToken).not.toBe(null);


  });
});




// testing getUserFromAccessToken function
describe("Getting user from access token", () => {
  test("Returns a UserAccount object", () => {
    const authToken: AuthTokens = "validAuthTokens123"; // Assume this is a valid AuthTokens object with an accessToken property

    const user: UserAccount = getUserFromAccessToken(authToken);
    // - createUser(email: string, password: string): Promise<UserAccount>
    // - generateTokens(user: UserAccount): AuthTokens
     
    expect(user).not.toBe(null);
    expect(user.id).not.toBe(null);
    expect(user.username).not.toBe(null);
    expect(user.email).not.toBe(null);
  });
});


describe("Trying to get user from invalid access token", () => {
  test("should not return a UserAccount object", () => {
    const authToken: AuthTokens = "invalidAuthTokens123"; // Assume this is an invalid AuthTokens object

    const user: UserAccount = getUserFromAccessToken(authToken);
    // - createUser(email: string, password: string): Promise<UserAccount>
    // - generateTokens(user: UserAccount): AuthTokens
     
    expect(user).toBe(null);
    expect(user.id).toBe(null);
    expect(user.username).toBe(null);
    expect(user.email).toBe(null);
  });
});




// testing generatePasswordResetToken function
describe("Generating password reset token", () => {
  test("should return passwordResetToken", () => {
    const userId: number = 1; // Assume this is a valid user ID

    // const passwordResetToken: string = generatePasswordResetToken(userId);

    expect(generatePasswordResetToken(userId)).not.toBe(null);
    // TODO expect event trigger for email queue with password reset token

  });
});



describe("Attempt to generate password reset token with invalid/null User ID", () => {
  test("should not return a UserAccount object", () => {
    let userId: number | null = null; // Assume this is an invalid user ID

    // const passwordResetToken: string = generatePasswordResetToken(userId);

    expect(generatePasswordResetToken(userId)).toBe(null);
    // TODO expect event trigger for email queue with password reset token

  });

  test("should not return a UserAccount object", () => {
    const userId: number = 9999999999; // this should never exist

    // const passwordResetToken: string = generatePasswordResetToken(userId);

    expect(generatePasswordResetToken(userId)).toBe(null);
    // TODO expect event trigger for email queue with password reset token

  });

});



// testing validatePasswordResetToken function
describe("Simulating validatePasswordResetToken when reset password is called", () => {
  test("Returns a UserAccount object", () => {
    const authToken: AuthTokens = "validAuthTokens123"; // Assume this is a valid AuthTokens object with an accessToken property

    const user: UserAccount = validatePasswordResetToken(authToken);

    expect(user).not.toBe(null);
    expect(user.id).not.toBe(null);
    expect(user.username).not.toBe(null);
    expect(user.email).not.toBe(null);
  });
});



describe("Simulating an invalid token being sent to validatePasswordResetToken when reset password is called", () => {
  test("should not return a UserAccount object", () => {
    const authToken: AuthTokens = "inValidToken"; // Assume this is a valid AuthTokens object with an accessToken property

    const user: UserAccount = validatePasswordResetToken(authToken);

    expect(user).toBe(null);
    expect(user.id).toBe(null);
    expect(user.username).toBe(null);
    expect(user.email).toBe(null);
  });

  test("should not return a UserAccount object", () => {
    const authToken: AuthTokens | null = null; // Assume this is a valid AuthTokens object with an accessToken property

    const user: UserAccount = validatePasswordResetToken(authToken);

    expect(user).toBe(null);
    expect(user.id).toBe(null);
    expect(user.username).toBe(null);
    expect(user.email).toBe(null);
  });
  
});



// TODO test for updatePassword function
describe("updatePassword test", () => {
  test("verifying password update functionality", () => {

    // const user: UserAccount = validatePasswordResetToken(authToken);

    updatePassword(1, "NewPassword123!");

    // TODO  add expectation to verify that the password was updated, possibly by attempting to log in with the new password or by checking the database directly for the updated password hash.

  });
});


// covering in api.auth.test.ts
// describe('Testing Register API Response - 201 response', () => {
//   test('successful account registration on /auth/register should return 201', async () => {
//     const newUser = {
//       "email": "user@example.com",
//       "password": "test12345!"
//     }
    
//     const response = await request(app).post('/auth/register').send(newUser).set('Accept', 'application/json');
    
//     expect(response.status).toBe(201);
  
//   });
// });






// auth functions
// - type ValidationResponse { valid: boolean, error: string }
// - type AuthTokens { accessToken: string, refreshToken: string }
// - isValidEmail(email: string): ValidationResponse DONE
// - isValidPassword(password: string): ValidationResponse  DONE
// - createUser(email: string, password: string): Promise<UserAccount>  DONE
// - getUserByEmail(email: string): Promise<UserAccount | null>  DONE
// - verifyPassword(plaintext: string, hash: string): Promise<boolean>  DONE in api.auth.test.ts
// - generateTokens(user: UserAccount): AuthTokens  DONE
// - validateRefreshToken(token: string): Promise<boolean>
// - invalidateRefreshToken(token: string): Promise<void>
// - getUserFromAccessToken(accessToken: string): Promise<UserAccount | null>   DONE
// - generatePasswordResetToken(userId: number): Promise<string>   DONE
// - validatePasswordResetToken(token: string): Promise<UserAccount | null>  DONE
// - updatePassword(userId: number, newPassword: string): Promise<void>
// - invalidatePasswordResetToken(token: string): Promise<void>
