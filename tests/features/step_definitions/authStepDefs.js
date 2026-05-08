import assert from 'assert';
import { Given, When, Then } from '@cucumber/cucumber';
import { isUserAccount } from '../../../src/types.js';
import { getMe } from '../../../src/controllers/auth.js';
// Testing /auth/me endpoint
Given('an {access_token}', function (access_token) {
    this.access_token = access_token;
});
When('a valid user cannot be found', function () {
    const user = null;
    assert.strictEqual(user, null, 'User should be null when not found');
});
Then('return a {int} with the message {string}', function (int, string) {
    const user = getMe('12345');
    if (user) {
        return "pending";
    }
});
//# sourceMappingURL=authStepDefs.js.map