import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.USER_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN
  }
});

// ! verify the connection configuration

transporter.verify((error, success) => {
  if (error) {
    console.error('Error configuring email transporter:', error);
    } else {
    console.log('Email transporter is configured and ready to send messages');
  }
});

export const sendEmail = async (to, subject, text,html) => {
  try {
    const mailOptions = {
      from: `" Banking System " ${process.env.USER_EMAIL}`,
      to,
      subject,
      text,
      html
    };
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

 export const sendRegistrationEmail = async (userEmail , name) => {
    const subject = 'Welcome to Banking System';
    const text = `Dear ${name},\n\nThank you for registering with our banking system. We are excited to have you on board!\n\nBest regards,\nBanking System Team`;
    const html = `<p>Dear ${name},</p><p>Thank you for registering with our banking system. We are excited to have you on board!</p><p>Best regards,<br/>Banking System Team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

export const sendTransactionEmail = async (userEmail , name , amount , toAccount) => {
  const subject = 'Transaction Alert';
  const text = `Dear ${name},\n\nYou have successfully transferred ${amount} to account ${toAccount}. If you did not authorize this transaction, please contact our support immediately.\n\nBest regards,\nBanking System Team`;
  const html = `<p>Dear ${name},</p><p>You have successfully transferred <strong>${amount}</strong> to account <strong>${toAccount}</strong>. If you did not authorize this transaction, please contact our support immediately.</p><p>Best regards,<br/>Banking System Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}

export const sendTransactionFailureEmail = async (userEmail , name , amount , toAccount) => {
  const subject = 'Transaction Failed';
  const text = `Dear ${name},\n\nWe regret to inform you that your transaction of ${amount} to account ${toAccount} has failed. Please check your account balance and try again. If you continue to experience issues, please contact our support team.\n\nBest regards,\nBanking System Team`;
  const html = `<p>Dear ${name},</p><p>We regret to inform you that your transaction of <strong>${amount}</strong> to account <strong>${toAccount}</strong> has failed. Please check your account balance and try again. If you continue to experience issues, please contact our support team.</p><p>Best regards,<br/>Banking System Team</p>`;
  await sendEmail(userEmail, subject, text, html);
}
