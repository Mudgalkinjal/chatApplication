import nodemailer from 'nodemailer'
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // Should be smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || '587'), // 587 for TLS
  secure: false, // false for port 587
  auth: {
    user: 'kinjalmudgal89@gmail.com', // Your Gmail email address
    pass: 'dqrzithgwjdzmngm', // Gmail App Password
  },
})

export default transporter
