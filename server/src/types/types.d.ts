import 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: any // Replace `any` with the specific type if available, e.g., `{ userId: string; email: string }`
  }
}
