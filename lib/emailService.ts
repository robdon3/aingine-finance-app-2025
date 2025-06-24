// Simple email service for password reset
// In production, you would use a service like SendGrid, Mailgun, or AWS SES

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private static instance: EmailService;
  
  // For development, we'll log emails to console
  // In production, this would send actual emails
  private isDevelopment = process.env.NODE_ENV === 'development';

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      if (this.isDevelopment) {
        // Log email to console in development
        console.log('📧 Email would be sent:');
        console.log('To:', options.to);
        console.log('Subject:', options.subject);
        console.log('HTML:', options.html);
        console.log('Text:', options.text);
        return true;
      } else {
        // In production, implement actual email sending
        // For now, we'll simulate success
        console.log(`Email sent to ${options.to}: ${options.subject}`);
        return true;
      }
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  generatePasswordResetEmail(email: string, resetToken: string, username: string): EmailOptions {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    return {
      to: email,
      subject: 'Aingen - Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Password Reset Request</h2>
          <p>Hello ${username},</p>
          <p>We received a request to reset your password for your Aingen account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1f2937; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>This link will expire in 1 hour for security reasons.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            Engine for the People<br>
            Aingen Team
          </p>
        </div>
      `,
      text: `
Password Reset Request

Hello ${username},

We received a request to reset your password for your Aingen account.

Click the link below to reset your password:
${resetUrl}

If you didn't request this password reset, you can safely ignore this email.

This link will expire in 1 hour for security reasons.

---
Engine for the People
Aingen Team
      `
    };
  }
}

export const emailService = EmailService.getInstance(); 