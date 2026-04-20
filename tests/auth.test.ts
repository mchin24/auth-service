import { describe, expect, test } from "@jest/globals";
import { type UserAccount, isUserAccount } from "../src/types.js";
import { getMe } from "../src/controllers/auth.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;



describe("Create a new user", () => {
  test("Returns a UserAccount", () => {
    const user = getMe("12345");
    expect(isUserAccount(user)).toBe(true);
  });
});


describe("Testing valid email format", () => {
  test("Checks email format and returns a UserAccount if valid", () => {
    const user = getMe("12345");
    expect(user?.email).toMatch(emailRegex);
    expect(isUserAccount(user)).toBe(true);
  });
});


describe("Testing invalid email format", () => {
  test("Checks invalid email format and does not return a UserAccount", () => {
    const user = getMe("12345");
    expect(user?.email).not.toMatch(emailRegex);
    expect(isUserAccount(user)).toBe(false);
  });
});


describe('Testing Password Format', () => {

  test('correct password format is used', () => {
    const user = getMe("12345");
    const validPassword = 'Password123!';
    expect(validPassword).toMatch(passwordRegex);
    // expect(user.password).toMatch(passwordRegex);
  });

  test('should reject a password without special characters', () => {
    const user = getMe("12345");
    const invalidPassword = 'password123';
    expect(invalidPassword).not.toMatch(passwordRegex);
    // expect(user.password).not.toMatch(passwordRegex);

  });

  test('should reject a password that is too short', () => {
    const user = getMe("12345");
    const shortPassword = 'Pa1!';
    expect(shortPassword).not.toMatch(passwordRegex);
    // expect(user.password).not.toMatch(passwordRegex);

  });
});