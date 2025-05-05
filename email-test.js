const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 587,
  auth: {
    user: '3f97bac1e89650',
    pass: '91d54debc7f509',
  },
});

const mailOptions = {
  from: '"Test App" <test@app.com>',
  to: 'test@example.com',
  subject: 'Test Email from Mailtrap',
  text: 'This is a test email sent using Mailtrap.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Error occurred:', error.message);
  }
  console.log('Email sent successfully:', info.response);
});
