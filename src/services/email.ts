import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const baseUrl = process.env.APP_BASE_URL;

if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
if (!baseUrl) throw new Error('APP_BASE_URL is not set');

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    await resend.emails.send({
        from: 'noreply@midnightdevstudio.com',
        to,
        subject: 'Reset your password',
        html: `<p>Click the link below to reset your password. This link expires in 1 hour.</p>
               <p><a href="${resetLink}">${resetLink}</a></p>
               <p>If you didn't request a password reset, you can ignore this email.</p>`,
    });
}
