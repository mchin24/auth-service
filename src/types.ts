export type UserAccount = {
    id: number;
    username: string;
    email: string;
};

export function isUserAccount(user: any): user is UserAccount {
    return (
        user !== null &&
        typeof user.id === 'number' &&
        typeof user.username === 'string' &&
        typeof user.email === 'string'
    );
}