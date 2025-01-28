import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret')
    ;(req as any).user = decoded
    next()
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' })
  }
}

export default authenticate
