export type UserAccount = {
    id: number;
    username: string;
    email: string;
};

export type ValidationResponse = {
    valid: boolean;
    error: string
};
export type AuthTokens = {
    accessToken: string;
    refreshToken: string
}

export function isUserAccount(user: any): user is UserAccount {
    return (
        user !== null &&
        typeof user.id === 'number' &&
        typeof user.username === 'string' &&
        typeof user.email === 'string'
    );
}