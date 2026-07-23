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
