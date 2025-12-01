import { injectable } from "inversify";
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { Logger } from "@/config/logger.config";

const logger = container.get<Logger>(TYPES.Logger);

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

@injectable()
export class EmailService {
  private transporter: Transporter;
  private fromEmail: string;
  private fromName: string;
  private frontendUrl: string;

  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || "noreply@localhost";
    this.fromName = process.env.FROM_NAME || "Invoice App";
    this.frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Create transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify connection configuration
    this.verifyConnection();
  }

  /**
   * Verify SMTP connection
   */
  private async verifyConnection() {
    try {
      await this.transporter.verify();
      logger.info("SMTP connection verified successfully");
    } catch (error) {
      logger.error(`SMTP connection verification failed: ${error}`);
      logger.warn("Email sending will not work until SMTP is properly configured");
    }
  }

  /**
   * Send an email
   */
  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info(`Email sent to ${options.to}: ${options.subject}`);
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}: ${error}`);
      throw new Error("Failed to send email");
    }
  }

  /**
   * Send email verification email
   */
  async sendVerificationEmail(
    email: string,
    token: string,
    name?: string
  ): Promise<void> {
    const verifyUrl = `${this.frontendUrl}/verify-email?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome${name ? `, ${name}` : ""}!</h1>
            <p>Thank you for registering with ${this.fromName}.</p>
            <p>Please verify your email address by clicking the button below:</p>
            <a href="${verifyUrl}" class="button">Verify Email Address</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${verifyUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <div class="footer">
              <p>If you didn't create this account, please ignore this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Welcome${name ? `, ${name}` : ""}!

Thank you for registering with ${this.fromName}.

Please verify your email address by visiting this link:
${verifyUrl}

This link will expire in 24 hours.

If you didn't create this account, please ignore this email.
    `;

    await this.sendEmail({
      to: email,
      subject: "Verify Your Email Address",
      html,
      text,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    token: string,
    name?: string
  ): Promise<void> {
    const resetUrl = `${this.frontendUrl}/reset-password?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #DC2626;
              color: white;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Reset Request</h1>
            <p>Hello${name ? `, ${name}` : ""},</p>
            <p>We received a request to reset your password for your ${this.fromName} account.</p>
            <p>Click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>Or copy and paste this link into your browser:</p>
            <p>${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <div class="footer">
              <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Password Reset Request

Hello${name ? `, ${name}` : ""},

We received a request to reset your password for your ${this.fromName} account.

Visit this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    `;

    await this.sendEmail({
      to: email,
      subject: "Password Reset Request",
      html,
      text,
    });
  }

  /**
   * Send welcome email (after migration)
   */
  async sendMigrationWelcome(email: string, name?: string): Promise<void> {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Account Migration Complete!</h1>
            <p>Hello${name ? `, ${name}` : ""},</p>
            <p>Your ${this.fromName} account has been successfully migrated to our new authentication system.</p>
            <p><strong>What's new:</strong></p>
            <ul>
              <li>Enhanced security with refresh token rotation</li>
              <li>Multiple login options (Google, Microsoft, Apple)</li>
              <li>Better session management</li>
            </ul>
            <p>You can continue using the app as usual. Your data and invoices remain unchanged.</p>
            <div class="footer">
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const text = `
Account Migration Complete!

Hello${name ? `, ${name}` : ""},

Your ${this.fromName} account has been successfully migrated to our new authentication system.

What's new:
- Enhanced security with refresh token rotation
- Multiple login options (Google, Microsoft, Apple)
- Better session management

You can continue using the app as usual. Your data and invoices remain unchanged.

If you have any questions, please contact our support team.
    `;

    await this.sendEmail({
      to: email,
      subject: "Your Account Has Been Migrated",
      html,
      text,
    });
  }
}
