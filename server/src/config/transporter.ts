import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // Should be smtp.gmail.com
  port: parseInt(process.env.SMTP_PORT || '587'), // 587 for TLS
  secure: false, // false for port 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail email address
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
})

export default transporter
