const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
    });

    const mailOptions = {
      from: '"HR Team" <yourgmail@gmail.com>',
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('📨 Email sent:', info.response);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};

module.exports = sendEmail;
