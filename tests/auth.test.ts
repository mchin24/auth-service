import { describe, expect, test } from "@jest/globals";
import { type UserAccount, isUserAccount } from "../src/types.js";
import { getMe } from "../src/controllers/auth.js";

describe("Create a new user", () => {
  test("Returns a UserAccount", () => {
    const user = getMe("12345");
    expect(isUserAccount(user)).toBe(true);
  });
});
