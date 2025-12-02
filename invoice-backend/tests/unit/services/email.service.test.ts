import { describe, it, expect, beforeEach, vi } from "vitest";
import { mockDeep } from "vitest-mock-extended";
import { EmailService } from "@/services/email.service";
import type { Logger } from "@/config/logger.config";
import nodemailer from "nodemailer";

// Mock nodemailer
vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(),
  },
}));

describe("EmailService", () => {
  let emailService: EmailService;
  let mockLogger: ReturnType<typeof mockDeep<Logger>>;
  let mockTransporter: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockLogger = mockDeep<Logger>();

    // Create mock transporter
    mockTransporter = {
      verify: vi.fn().mockResolvedValue(true),
      sendMail: vi.fn().mockResolvedValue({ messageId: "test-message-id" }),
    };

    vi.mocked(nodemailer.createTransport).mockReturnValue(mockTransporter);

    // Set environment variables
    vi.stubEnv("FROM_EMAIL", "noreply@test.com");
    vi.stubEnv("FROM_NAME", "Test App");
    vi.stubEnv("FRONTEND_URL", "http://localhost:3000");
    vi.stubEnv("SMTP_HOST", "smtp.test.com");
    vi.stubEnv("SMTP_PORT", "587");
    vi.stubEnv("SMTP_USER", "test@test.com");
    vi.stubEnv("SMTP_PASSWORD", "test-password");

    emailService = new EmailService(mockLogger);
  });

  describe("constructor", () => {
    it("should initialize with environment variables", () => {
      expect(emailService).toBeDefined();
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: "smtp.test.com",
        port: 587,
        secure: false,
        auth: {
          user: "test@test.com",
          pass: "test-password",
        },
      });
    });

    it("should use default values when env vars are missing", () => {
      vi.unstubAllEnvs();
      new EmailService(mockLogger);

      expect(nodemailer.createTransport).toHaveBeenCalled();
    });

    it("should use secure connection for port 465", () => {
      vi.unstubAllEnvs();
      vi.stubEnv("SMTP_PORT", "465");
      vi.stubEnv("SMTP_HOST", "smtp.test.com");

      new EmailService(mockLogger);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: true,
        }),
      );
    });

    it("should verify SMTP connection on initialization", async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockTransporter.verify).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith("SMTP connection verified successfully");
    });

    it("should log warning if SMTP verification fails", async () => {
      mockTransporter.verify.mockRejectedValue(new Error("Connection failed"));

      new EmailService(mockLogger);

      await new Promise((resolve) => setTimeout(resolve, 10));

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("SMTP connection verification failed"),
      );
      expect(mockLogger.warn).toHaveBeenCalledWith(
        "Email sending will not work until SMTP is properly configured",
      );
    });
  });

  describe("sendEmail", () => {
    it("should send email successfully", async () => {
      await emailService.sendEmail({
        to: "recipient@test.com",
        subject: "Test Subject",
        text: "Test body",
        html: "<p>Test body</p>",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: '"Test App" <noreply@test.com>',
        to: "recipient@test.com",
        subject: "Test Subject",
        text: "Test body",
        html: "<p>Test body</p>",
      });
      expect(mockLogger.info).toHaveBeenCalledWith(
        "Email sent to recipient@test.com: Test Subject",
      );
    });

    it("should send email with only text content", async () => {
      await emailService.sendEmail({
        to: "recipient@test.com",
        subject: "Test Subject",
        text: "Test body",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "recipient@test.com",
          subject: "Test Subject",
          text: "Test body",
          html: undefined,
        }),
      );
    });

    it("should send email with only HTML content", async () => {
      await emailService.sendEmail({
        to: "recipient@test.com",
        subject: "Test Subject",
        html: "<p>Test body</p>",
      });

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "recipient@test.com",
          subject: "Test Subject",
          text: undefined,
          html: "<p>Test body</p>",
        }),
      );
    });

    it("should throw error if sending fails", async () => {
      mockTransporter.sendMail.mockRejectedValue(new Error("SMTP error"));

      await expect(
        emailService.sendEmail({
          to: "recipient@test.com",
          subject: "Test Subject",
          text: "Test body",
        }),
      ).rejects.toThrow("Failed to send email");

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("Failed to send email to recipient@test.com"),
      );
    });

    it("should handle non-Error exceptions", async () => {
      mockTransporter.sendMail.mockRejectedValue("String error");

      await expect(
        emailService.sendEmail({
          to: "recipient@test.com",
          subject: "Test Subject",
          text: "Test body",
        }),
      ).rejects.toThrow("Failed to send email");

      expect(mockLogger.error).toHaveBeenCalledWith(
        expect.stringContaining("String error"),
      );
    });
  });

  describe("sendVerificationEmail", () => {
    it("should send verification email with name", async () => {
      await emailService.sendVerificationEmail(
        "user@test.com",
        "verification-token-123",
        "John Doe",
      );

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@test.com",
          subject: "Verify Your Email Address",
        }),
      );

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Welcome, John Doe");
      expect(call.html).toContain("verification-token-123");
      expect(call.text).toContain("Welcome, John Doe");
    });

    it("should send verification email without name", async () => {
      await emailService.sendVerificationEmail("user@test.com", "verification-token-123");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Welcome!");
      expect(call.html).not.toContain("Welcome,");
    });

    it("should include verification link in email", async () => {
      await emailService.sendVerificationEmail("user@test.com", "token-456");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      const expectedUrl = "http://localhost:3000/verify-email?token=token-456";
      expect(call.html).toContain(expectedUrl);
      expect(call.text).toContain(expectedUrl);
    });

    it("should mention expiry time", async () => {
      await emailService.sendVerificationEmail("user@test.com", "token");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("24 hours");
      expect(call.text).toContain("24 hours");
    });
  });

  describe("sendPasswordResetEmail", () => {
    it("should send password reset email with name", async () => {
      await emailService.sendPasswordResetEmail("user@test.com", "reset-token-123", "Jane Smith");

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@test.com",
          subject: "Password Reset Request",
        }),
      );

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Hello, Jane Smith");
      expect(call.html).toContain("reset-token-123");
    });

    it("should send password reset email without name", async () => {
      await emailService.sendPasswordResetEmail("user@test.com", "reset-token-123");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Hello,");
      expect(call.html).not.toContain("Hello, ");
    });

    it("should include reset link in email", async () => {
      await emailService.sendPasswordResetEmail("user@test.com", "token-789");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      const expectedUrl = "http://localhost:3000/reset-password?token=token-789";
      expect(call.html).toContain(expectedUrl);
      expect(call.text).toContain(expectedUrl);
    });

    it("should mention 1 hour expiry", async () => {
      await emailService.sendPasswordResetEmail("user@test.com", "token");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("1 hour");
      expect(call.text).toContain("1 hour");
    });

    it("should include security notice", async () => {
      await emailService.sendPasswordResetEmail("user@test.com", "token");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("didn't request");
      expect(call.text).toContain("didn't request");
    });
  });

  describe("sendMigrationWelcome", () => {
    it("should send migration welcome email with name", async () => {
      await emailService.sendMigrationWelcome("user@test.com", "Bob Johnson");

      expect(mockTransporter.sendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: "user@test.com",
          subject: "Your Account Has Been Migrated",
        }),
      );

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Hello, Bob Johnson");
    });

    it("should send migration welcome email without name", async () => {
      await emailService.sendMigrationWelcome("user@test.com");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("Hello,");
    });

    it("should list new features", async () => {
      await emailService.sendMigrationWelcome("user@test.com");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("refresh token rotation");
      expect(call.html).toContain("Google, Microsoft, Apple");
      expect(call.html).toContain("session management");
      expect(call.text).toContain("refresh token rotation");
      expect(call.text).toContain("Google, Microsoft, Apple");
    });

    it("should reassure about data preservation", async () => {
      await emailService.sendMigrationWelcome("user@test.com");

      const call = mockTransporter.sendMail.mock.calls[0][0];
      expect(call.html).toContain("data and invoices remain unchanged");
      expect(call.text).toContain("data and invoices remain unchanged");
    });
  });
});
