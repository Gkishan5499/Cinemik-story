import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export interface SendPasswordResetEmailParams {
  to: string;
  username: string;
  resetToken: string;
  resetLink: string;
}

export interface MailResult {
  success: boolean;
  message?: string;
  info?: any;
}

/**
 * Creates and returns a configured Nodemailer transporter using SMTP settings from .env
 */
export const createTransporter = () => {
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (!user || !pass) {
    return null;
  }

  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "465", 10);
  const isGmail = host.toLowerCase().includes("gmail");

  // If using Gmail on standard port, nodemailer's built-in gmail service provides optimal settings
  if (isGmail && (!process.env.SMTP_PORT || process.env.SMTP_PORT === "465")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE === "true" || port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Sends a password reset email with both a clickable link and 6-digit verification code.
 */
export const sendPasswordResetEmail = async ({
  to,
  username,
  resetToken,
  resetLink,
}: SendPasswordResetEmailParams): Promise<MailResult> => {
  const transporter = createTransporter();

  if (!transporter) {
    const warning =
      `[EMAIL WARNING] SMTP credentials not set (SMTP_USER / SMTP_PASS in backend/.env).\n` +
      `[DEV FALLBACK] Password reset link for ${to} (${username}):\n` +
      `👉 ${resetLink}\n` +
      `Verification Code: ${resetToken}`;
    console.warn(warning);
    return {
      success: false,
      message: "SMTP credentials (SMTP_USER or SMTP_PASS) not configured in backend/.env",
    };
  }

  const fromEmail = process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Cinemik Story";
  const fromAddress = process.env.SMTP_FROM || `"${fromName}" <${fromEmail}>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Cinemik Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0b0f; color: #f0f0f5;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0b0f; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #121218; border: 1px solid #2a2a38; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.6);">
          
          <!-- Brand Header -->
          <tr>
            <td style="padding: 32px 32px 24px 32px; text-align: center; border-bottom: 1px solid #1e1e2c; background: linear-gradient(180deg, #181822 0%, #121218 100%);">
              <h1 style="margin: 0; font-size: 26px; letter-spacing: 5px; color: #e63946; font-weight: 800; text-transform: uppercase;">CINEMIK</h1>
              <p style="margin: 6px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #888899; text-transform: uppercase;">Anime Stories & Motion Comics</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #ffffff; font-weight: 700; letter-spacing: 0.5px;">Password Reset Request</h2>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #bbbbcc;">
                Hello <strong style="color: #ffffff;">${username}</strong>,
              </p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #bbbbcc;">
                We received a request to reset the password for your Cinemik account. You can click the button below to set a new password:
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${resetLink}" target="_blank" style="background-color: #e63946; color: #ffffff; padding: 14px 32px; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 6px; letter-spacing: 1.5px; display: inline-block; text-transform: uppercase; box-shadow: 0 4px 15px rgba(230, 57, 70, 0.45);">
                  Reset Password Now &rarr;
                </a>
              </div>

              <!-- 6-digit Code Box -->
              <div style="margin: 28px 0; padding: 20px; background-color: #171722; border: 1px dashed #3a3a50; border-radius: 8px; text-align: center;">
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #8888aa; text-transform: uppercase; letter-spacing: 1.5px; font-weight: 600;">
                  Or use this 6-digit verification code:
                </p>
                <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #ffffff; background: #0c0c12; padding: 12px 24px; border-radius: 6px; display: inline-block; border: 1px solid #e63946;">
                  ${resetToken}
                </div>
              </div>

              <p style="margin: 24px 0 0 0; font-size: 12px; line-height: 1.6; color: #777788;">
                If the button above does not work, copy and paste this URL into your browser:<br>
                <a href="${resetLink}" style="color: #e63946; word-break: break-all; font-size: 12px; text-decoration: underline;">${resetLink}</a>
              </p>

              <hr style="border: none; border-top: 1px solid #20202e; margin: 28px 0;">

              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #666677;">
                This link and verification code will expire in <strong style="color: #ffffff;">1 hour</strong>.<br>
                If you did not request a password reset, you can safely disregard this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #0c0c10; text-align: center; border-top: 1px solid #1a1a24;">
              <p style="margin: 0; font-size: 11px; color: #555566; letter-spacing: 1px;">
                &copy; ${new Date().getFullYear()} Cinemik Stories. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const textContent =
    `Hello ${username},\n\n` +
    `We received a request to reset your password for your Cinemik account.\n\n` +
    `Reset Password Link:\n${resetLink}\n\n` +
    `Or enter this 6-digit verification code: ${resetToken}\n\n` +
    `This link and code will expire in 1 hour.\n` +
    `If you did not request this, please ignore this email.`;

  const mailOptions = {
    from: fromAddress,
    to,
    subject: "Reset Your Cinemik Password",
    text: textContent,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`[EMAIL SENT] Password reset email successfully delivered to ${to} (Message ID: ${info.messageId})`);
  return { success: true, info };
};

export interface SendContactEmailParams {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

/**
 * Sends a contact form submission email to the studio admin and an acknowledgment receipt to the sender.
 */
export const sendContactEmail = async ({
  name,
  email,
  phone,
  subject,
  message,
}: SendContactEmailParams): Promise<MailResult> => {
  const transporter = createTransporter();

  const recipientAdmin =
    process.env.CONTACT_RECEIVER_EMAIL?.trim() ||
    process.env.SMTP_USER?.trim() ||
    "cinemiks@gmail.com";
  const fromEmail = process.env.SMTP_USER?.trim() || "cinemiks@gmail.com";
  const fromName = process.env.SMTP_FROM_NAME || "Cinemik Contact Form";
  const fromAddress = process.env.SMTP_FROM || `"${fromName}" <${fromEmail}>`;

  if (!transporter) {
    console.warn(`[CONTACT NOTICE] SMTP not configured. Contact submission from ${name} (${email}):`);
    console.warn(`Subject: ${subject}\nPhone: ${phone || 'N/A'}\nMessage:\n${message}`);
    return {
      success: false,
      message: "SMTP credentials not configured in backend/.env. Message logged to console.",
    };
  }

  // 1. Email notification to the Cinemik Studio Admin / Team
  const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>New Contact Message - ${subject}</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0d12; color: #ffffff; padding: 30px 15px; margin: 0;">
  <div style="max-width: 600px; margin: 0 auto; background: #161620; border: 1px solid #2b2b3c; border-radius: 10px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #2596be 0%, #e63946 100%); padding: 24px; text-align: center;">
      <h2 style="margin: 0; color: #ffffff; font-size: 20px; letter-spacing: 2px; text-transform: uppercase;">New Contact Message Received</h2>
      <p style="margin: 6px 0 0 0; color: rgba(255,255,255,0.85); font-size: 12px; letter-spacing: 1px;">CINEMIK ANIME &amp; STORIES</p>
    </div>
    <div style="padding: 28px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 8px 0; color: #9999aa; font-size: 13px; width: 130px;"><strong>Sender Name:</strong></td>
          <td style="padding: 8px 0; color: #ffffff; font-size: 14px; font-weight: bold;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9999aa; font-size: 13px;"><strong>Sender Email:</strong></td>
          <td style="padding: 8px 0; color: #2596be; font-size: 14px;"><a href="mailto:${email}" style="color: #2596be; text-decoration: underline;">${email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9999aa; font-size: 13px;"><strong>Phone Number:</strong></td>
          <td style="padding: 8px 0; color: #ffffff; font-size: 14px;">${phone || 'Not provided'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #9999aa; font-size: 13px;"><strong>Topic / Subject:</strong></td>
          <td style="padding: 8px 0; color: #ffc857; font-size: 14px; font-weight: bold;">${subject}</td>
        </tr>
      </table>

      <div style="background: #0d0d14; border: 1px solid #222233; border-radius: 8px; padding: 18px; margin-top: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #ffffff; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Message Content:</h4>
        <p style="margin: 0; color: #dddded; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
      </div>

      <div style="margin-top: 24px; text-align: center;">
        <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" style="display: inline-block; background: #2596be; color: #ffffff; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Reply to ${name} &rarr;</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  const adminMailOptions = {
    from: fromAddress,
    to: recipientAdmin,
    replyTo: email,
    subject: `[Contact Form] ${subject} - from ${name}`,
    text: `New contact message from ${name} (${email}):\n\nTopic: ${subject}\nPhone: ${phone || 'Not provided'}\n\nMessage:\n${message}`,
    html: adminHtml,
  };

  const info = await transporter.sendMail(adminMailOptions);
  console.log(`[CONTACT EMAIL DELIVERED] Forwarded message to ${recipientAdmin} (ID: ${info.messageId})`);

  // 2. Automated acknowledgment receipt to the sender
  try {
    const userReceiptHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>We Received Your Message - Cinemik</title></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0b0b0f; color: #ffffff; padding: 30px 15px; margin: 0;">
  <div style="max-width: 580px; margin: 0 auto; background: #121218; border: 1px solid #2a2a38; border-radius: 10px; overflow: hidden;">
    <div style="padding: 28px; text-align: center; border-bottom: 1px solid #1f1f2e; background: #161622;">
      <h1 style="margin: 0; font-size: 24px; letter-spacing: 4px; color: #e63946; font-weight: 800; text-transform: uppercase;">CINEMIK</h1>
      <p style="margin: 5px 0 0 0; font-size: 11px; letter-spacing: 2px; color: #888899; text-transform: uppercase;">Anime Stories &amp; Motion Comics</p>
    </div>
    <div style="padding: 30px;">
      <h2 style="margin: 0 0 14px 0; font-size: 18px; color: #ffffff;">Thank you for reaching out, ${name}!</h2>
      <p style="margin: 0 0 18px 0; font-size: 14px; line-height: 1.6; color: #bbbbcc;">
        We have received your message regarding <strong style="color: #ffc857;">"${subject}"</strong>. Our team in Bengaluru has received your inquiry and will respond within 24 hours.
      </p>
      <div style="background: #181824; border-left: 3px solid #2596be; padding: 14px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 11px; color: #9999aa; text-transform: uppercase; letter-spacing: 1px; font-weight: bold;">Your Message Summary:</p>
        <p style="margin: 0; font-size: 13px; color: #dddddd; line-height: 1.5; white-space: pre-wrap;">${message}</p>
      </div>
      <p style="margin: 20px 0 0 0; font-size: 12px; color: #666677; line-height: 1.5;">
        Best regards,<br>
        <strong style="color: #ffffff;">Cinemik Studio Team</strong><br>
        Bengaluru, Karnataka, India
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: `We received your message: ${subject} - Cinemik`,
      text: `Hello ${name},\n\nThank you for reaching out to Cinemik! We have received your inquiry regarding "${subject}" and our team in Bengaluru will get back to you within 24 hours.\n\nBest regards,\nCinemik Studio Team`,
      html: userReceiptHtml,
    });
    console.log(`[CONTACT RECEIPT SENT] Acknowledgment email delivered to ${email}`);
  } catch (receiptErr: any) {
    console.warn(`[CONTACT RECEIPT WARNING] Could not send receipt to user: ${receiptErr.message}`);
  }

  return { success: true, info };
};
