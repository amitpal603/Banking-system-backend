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
