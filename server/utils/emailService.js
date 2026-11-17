import nodemailer from 'nodemailer';

// Reusable transporter — created once, reused across calls
let _transporter = null;
const getTransporter = () => {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    pool: true,
    maxConnections: 3,
  });
  return _transporter;
};

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

  let fromString = `"${fromName}" <${defaultFromEmail}>`;
  if (process.env.SMTP_FROM) {
    fromString = process.env.SMTP_FROM.includes('<')
      ? process.env.SMTP_FROM
      : `"${fromName}" <${process.env.SMTP_FROM}>`;
  }

  // 1. Try SMTP
  if (smtpUser && smtpPassword) {
    try {
      const transporter = getTransporter();
      console.log(`[SMTP] Sending to: ${to}`);
      const info = await transporter.sendMail({ from: fromString, to, subject, text, html });
      console.log(`[SMTP] Sent! Message ID: ${info.messageId}`);
      return info;
    } catch (smtpErr) {
      console.error('[SMTP] Failed:', smtpErr.message);
      // Reset so next call gets a fresh transporter
      _transporter = null;
      if (!apiKey) throw smtpErr;
      console.log('[SMTP] Falling back to Brevo HTTP API...');
    }
  }

  // 2. Brevo HTTP API fallback
  if (apiKey) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: fromName, email: defaultFromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (response.ok) return await response.json();
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Brevo API call failed');
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

export const sendSetupEmail = async ({ to, token, name }) => {
  const setupLink = `${process.env.APP_URL}/set-password?token=${token}&email=${encodeURIComponent(to)}`;
  const subject = 'Action Required: Complete Your Account Setup';
  const text = `Hi ${name},\n\nPlease click the link below to set your password and complete your account setup:\n\n${setupLink}\n\nThis link will expire in 24 hours.`;
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Welcome to Black Panther Batteries</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">Complete Your Account Setup</p>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
        Hi ${name},<br/><br/>
        We're excited to have you join us! Please click the button below to securely set your password and finish creating your account.
      </p>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${setupLink}" style="display: inline-block; background-color: #ea580c; color: #ffffff; font-weight: 700; font-size: 15px; text-decoration: none; padding: 14px 28px; border-radius: 8px;">
          Set My Password
        </a>
      </div>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
        <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
          • This link will expire in <strong>24 hours</strong>.<br />
          • If you did not request this, please ignore this email.
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; pt: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};

export const sendResetPasswordOtpEmail = async ({ to, otp }) => {
  const subject = '🔒 Password Reset: Verification Code';
  const text = `Your Black Panther Password Reset Code is ${otp}. This code is valid for 10 minutes. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 520px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 8px 0;">Password Reset Request</h2>
        <p style="color: #64748b; font-size: 14px; margin: 0;">We received a request to reset your password.</p>
      </div>

      <div style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #166534; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 10px 0;">Your Reset Code</p>
        <div style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #15803d; margin: 0;">${otp}</div>
      </div>

      <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        Enter this 6-digit code on the password reset page to securely change your password.
      </p>

      <div style="background-color: #f8fafc; border-radius: 8px; padding: 12px 16px; margin-bottom: 24px;">
        <p style="color: #64748b; font-size: 12px; margin: 0; line-height: 1.5;">
          • This code will expire in <strong>10 minutes</strong>.<br />
          • If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; pt: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};

export const sendInquiryReplyEmail = async ({ to, recipientName, inquirySubject, replyMessage }) => {
  const subject = `Re: ${inquirySubject || 'Your Inquiry with Black Panther Batteries'}`;
  const text = `Hi ${recipientName || 'Valued Customer'},\n\n${replyMessage}\n\nBest regards,\nBlack Panther Batteries Team`;
  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: left; margin-bottom: 24px; border-bottom: 2px solid #F06123; padding-bottom: 16px;">
        <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0;">Black Panther Batteries</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">Response to your Inquiry / Quote Request</p>
      </div>

      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        Hi ${recipientName || 'Valued Customer'},
      </p>

      <div style="background-color: #f8fafc; border-left: 4px solid #F06123; border-radius: 0 8px 8px 0; padding: 18px; margin-bottom: 24px;">
        <div style="color: #1e293b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${replyMessage.replace(/\n/g, '<br/>')}</div>
      </div>

      <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0;">
        If you have further questions or require additional support, feel free to reply directly to this email or call us at <strong>+61 402 277 723</strong>.
      </p>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. 6/31 Gov Macquarie Dr, Chipping Norton NSW 2170, Australia.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};

export const sendShipmentNotificationEmail = async ({ to, order, trackingNumber, trackingUrl }) => {
  const orderIdStr = order._id.toString().slice(-8).toUpperCase();
  const trackLink = trackingUrl || `${process.env.APP_URL || 'http://localhost:5173'}/track?id=${order._id}`;
  const subject = `🚚 Your Order #${orderIdStr} Has Been Shipped via Australia Post!`;
  const text = `Hi ${order.shippingDetails?.fullName || 'Customer'},\n\nGreat news! Your order #${orderIdStr} has been handed over to Australia Post and is on its way to you.\n\nTracking Number: ${trackingNumber}\nTrack Order: ${trackLink}\n\nThank you for shopping with Black Panther Batteries!`;

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #F06123; padding-bottom: 16px;">
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 4px 0;">Black Panther Batteries</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Australia Post Shipment Notification</p>
      </div>

      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        Hi <strong>${order.shippingDetails?.fullName || 'Customer'}</strong>,<br/><br/>
        Great news! Your order <span style="font-family: monospace; font-weight: 700; color: #ea580c;">#${orderIdStr}</span> has been packed and handed over to <strong>Australia Post</strong> for delivery.
      </p>

      <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
        <p style="color: #9a3412; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 0 0 6px 0;">Australia Post Tracking Number</p>
        <div style="font-family: monospace; font-size: 24px; font-weight: 900; color: #ea580c; margin: 0 0 12px 0;">${trackingNumber}</div>
        <a href="${trackLink}" style="display: inline-block; background-color: #ea580c; color: #ffffff; font-weight: 700; font-size: 14px; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
          Track Shipment Progress →
        </a>
      </div>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #475569;">
        <h4 style="margin: 0 0 8px 0; color: #0f172a; font-size: 13px; font-weight: 700;">Delivery Destination:</h4>
        <p style="margin: 0; line-height: 1.5;">
          ${order.shippingDetails?.address}<br/>
          ${order.shippingDetails?.city}, ${order.shippingDetails?.state} ${order.shippingDetails?.zipCode}<br/>
          <strong>Australia</strong>
        </p>
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};

export const sendOrderConfirmationEmail = async ({ to, order }) => {
  const orderIdStr = order._id.toString().slice(-8).toUpperCase();
  const subject = `🎉 Payment Confirmed! Order #${orderIdStr}`;
  const text = `Hi ${order.shippingDetails?.fullName
    || 'Customer'},\n\nThank you for your purchase! We have received your payment of $${order.totalAmount?.toFixed(2)} AUD for Order #${orderIdStr}.\n\nOur warehouse team is currently preparing and packing your item. Your Australia Post tracking number will be sent in a separate shipment email as soon as your parcel is dispatched.\n\nThank you for shopping with Black Panther Batteries!`;

  const itemsListHtml = (order.items || []).map(item => `
    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px border #f1f5f9; font-size: 13px;">
      <span><strong>${item.quantity}x</strong> ${item.name}</span>
      <span style="font-weight: 700; color: #ea580c;">$${(item.price * item.quantity).toFixed(2)} AUD</span>
    </div>
  `).join('');

  const html = `
    <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
      <div style="text-align: center; margin-bottom: 24px; border-bottom: 2px solid #F06123; padding-bottom: 16px;">
        <h2 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0 0 4px 0;">Black Panther Batteries</h2>
        <p style="color: #64748b; font-size: 13px; margin: 0;">Order Payment Confirmation</p>
      </div>

      <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
        Hi <strong>${order.shippingDetails?.fullName || 'Customer'}</strong>,<br/><br/>
        Thank you for your purchase! We have received your payment for order <span style="font-family: monospace; font-weight: 700; color: #ea580c;">#${orderIdStr}</span>.
      </p>

      <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; font-weight: 700;">Order Summary</h4>
        ${itemsListHtml}
        <div style="display: flex; justify-content: space-between; margin-top: 12px; pt: 12px; border-top: 2px solid #e2e8f0; font-size: 15px; font-weight: 800; color: #0f172a;">
          <span>Total Paid:</span>
          <span style="color: #ea580c;">$${order.totalAmount?.toFixed(2)} AUD</span>
        </div>
      </div>

      <div style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 13px; color: #9a3412;">
        <strong>📌 What's Next?</strong><br/>
        Our warehouse team is packing your physical parcel. As soon as we hand over your package to <strong>Australia Post</strong>, you will receive a <strong>Shipment Email</strong> containing your official tracking number.
      </div>

      <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} Black Panther Batteries. All rights reserved.</p>
      </div>
    </div>
  `;

  return sendQuotationEmail({ to, subject, html, text });
};


