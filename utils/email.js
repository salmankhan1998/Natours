const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Definde email options
  const mailOptions = {
    from: 'Salman Khan <skhandilshad1998@gmail.com>',
    to: options.email,
    subject: options.subject,
    html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password: ${options.resetToken}</p>
        <a href=${options.resetUrl}">Reset Password</a>
      `,
  };

  // 3) Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
