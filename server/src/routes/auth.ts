import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import User from '../models/User'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import transporter from '../config/transporter'

transporter.sendMail(
  {
    from: '"Your App Name" <your-email@example.com>', // Sender address
    to: 'test-recipient@example.com', // Receiver email
    subject: 'Test Email',
    text: 'This is a test email sent from Nodemailer!',
    html: '<p>This is a test email sent from <strong>Nodemailer</strong>!</p>',
  },
  (error, info) => {
    if (error) {
      console.error('Error sending email:', error)
    } else {
      console.log('Email sent successfully:', info.response)
    }
  }
)

const router = express.Router()

// Example route
router.get('/', (req: Request, res: Response) => {
  res.send('Auth endpoint is working')
})

// Sign Up Route
router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 12)
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
    })
    const token = jwt.sign({ email }, process.env.JWT_SECRET || 'your_secret', {
      expiresIn: '1h', // Token expires in 1 hour
    })

    const verificationUrl = `http://localhost:3000/verify-email?token=${token}`
    const mailOptions = {
      from: 'noreply@yourapp.com',
      to: email,
      subject: 'Verify Your Email Address',
      html: `
          <h1>Email Verification</h1>
          <p>Hello ${name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationUrl}">Verify Email</a>
          <p>This link will expire in 1 hour.</p>
        `,
    }

    await transporter.sendMail(mailOptions)

    await newUser.save()

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error: any) {
    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.error('Error during sign up:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
router.get('/verify-email', async (req: Request, res: Response) => {
  const { token } = req.query

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET || 'your_secret'
    )
    const email = (decoded as { email: string }).email

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.isVerified = true
    await user.save()

    res
      .status(200)
      .json({ message: 'Email verified successfully. You can now log in.' })
  } catch (error: any) {
    console.error('Verification error:', error.message)
    res.status(400).json({ message: 'Invalid or expired verification link.' })
  }
})

// Sign In Route
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({ message: 'User signed in successfully' })
  } catch (error) {
    console.error('Error during sign in:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
