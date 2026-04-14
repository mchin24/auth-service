import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';

type UserAccount = { email: string, password: string };

function createUserAccount(email: string, password: string): UserAccount {
    return { email: email, password: password}
}

Given('an email address and password', function () {
    this.email = "test@email.com";
    this.password = "test123"
});

When('there is no existing account with a matching email address', function ()     {
    const existingUser = null;
    assert.equal(existingUser, null)
});

Then('create a new user account using the provided email address and password', function () {
    assert.deepEqual(createUserAccount(this.email, this.password), { email: this.email, password: this.password })
});
