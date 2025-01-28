import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { User } from '../models/User'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import transporter from '../config/transporter'
import authenticate from '../middleware/authMiddleware'
import dotenv from 'dotenv'

const router = express.Router()

dotenv.config()
//process.env.CLIENT_URL

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
    const token = jwt.sign(
      { name: name, email: email },
      process.env.JWT_SECRET || 'your_secret',
      {
        expiresIn: '1h', // Token expires in 1 hour
      }
    )

    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email?token=${token}`
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

    res.status(201).json({ message: 'Verification email sent' })
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' })
    }
    console.error('Error during sign up:', error)
    res.status(500).json({ message: 'Server error' })
  }
})
router.get('/verify-email', async (req, res) => {
  const { token } = req.query

  if (!token) {
    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=error`)
  }

  try {
    const decoded = jwt.verify(
      token as string,
      process.env.JWT_SECRET || 'your_secret'
    )
    const email = (decoded as { email: string }).email

    const user = await User.findOne({ email })
    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/verify-email?status=user-not-found`
      )
    }

    if (user.isVerified) {
      return res.redirect(
        `${process.env.CLIENT_URL}/verify-email?status=already-verified`
      )
    }

    user.isVerified = true
    await user.save()

    return res.redirect(`${process.env.CLIENT_URL}/verify-email?status=success`)
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/verify-email?status=invalid-token`
    )
  }
})

// Sign In Route
router.post('/signin', async (req: Request, res: Response) => {
  const { email, password } = req.body
  console.log(email)

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'your_secret',
      { expiresIn: '1h' }
    )

    res.status(200).json({ token })
  } catch (error) {
    console.error('Error during sign in:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

router.get('/protected', authenticate, (req: Request, res: Response) => {
  res.json({
    message: 'Access granted',
    user: (req as any).user,
  })
})

export default router
