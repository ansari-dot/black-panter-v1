import nodemailer from 'nodemailer';

// Force reload after adding response logging
export const sendQuotationEmail = async ({ to, subject, html, text }) => {
  if (!to || !to.trim()) {
    throw new Error('Recipient email address ("to") is missing or empty.');
  }
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const apiKey = process.env.BREVO_API_KEY;

  const defaultFromEmail = smtpUser || 'noreply@blackpantherbatteries.com.au';
  const fromName = 'Black Panther Batteries';

  // Format sender details robustly
  let fromString = `"${fromName}" <${defaultFromEmail}>`;
  if (process.env.SMTP_FROM) {
    if (process.env.SMTP_FROM.includes('<')) {
      fromString = process.env.SMTP_FROM;
    } else {
      fromString = `"${fromName}" <${process.env.SMTP_FROM}>`;
    }
  }

  // 1. Try SMTP first (Since Brevo API restricts unauthorized IPs)
  if (smtpUser && smtpPassword) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        auth: {
          user: smtpUser,
          pass: smtpPassword
        }
      });

      console.log(`[SMTP] Attempting to send quotation email to: ${to}`);
      const mailOptions = {
        from: fromString,
        to,
        subject,
        text,
        html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log(`[SMTP] Email sent successfully! Message ID: ${info.messageId}`);
      console.log(`[SMTP] SMTP Server Response: ${info.response}`);
      return info;
    } catch (smtpErr) {
      console.error('[SMTP] Email delivery failed:', smtpErr);
      if (!apiKey) {
        throw smtpErr;
      }
      console.log('Attempting HTTP API fallback...');
    }
  }

  // 2. Fall back to Brevo HTTP API
  if (apiKey) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { name: fromName, email: defaultFromEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
        textContent: text
      })
    });

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Brevo API call failed');
    }
  }

  throw new Error('Email credentials not configured. Please supply SMTP_USER/SMTP_PASSWORD or BREVO_API_KEY.');
};

export const sendOtpEmail = async ({ to, otp }) => {
  const subject = '🔒 Security Alert: Admin Login OTP Verification Code';
  const text = `Your Black Panther Admin Login OTP Code is ${otp}. This code is valid for 5 minutes. Do not share this code with anyone.`;
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Black Panther Admin Security</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">2-Step OTP Security Verification Code</p>
      </div>

      <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #9a3412; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px 0;">Verification Code</p>
        <div style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ea580c; margin: 0;">${otp}</div>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        We detected multiple failed login attempts on your registered Admin account. To proceed with your login, please enter the 6-digit security code above into the admin portal.
      </p>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
        <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
          • This code will expire in <strong>5 minutes</strong>.<br />
          • If you did not attempt to sign in, please secure your admin credentials immediately.
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; pt: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};

