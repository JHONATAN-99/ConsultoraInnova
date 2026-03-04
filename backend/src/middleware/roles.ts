import { Request, Response, NextFunction } from 'express'

// simple helpers that read the role from cookie
export function requireRole(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.cookies?.role as string | undefined
    if (!role || !allowed.includes(role)) {
      return res.status(403).json({ error: 'forbidden' })
    }
    next()
  }
}
