import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { User } from '../models/User.ts'
import bcrypt from 'bcrypt'

export async function register(req: Request, res: Response) {
  // Registration is disabled - users must be created by administrators
  return res.status(403).json({ error: 'register operation not allowed' })
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as {
    email: string
    password: string
  }
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  let valid = await bcrypt.compare(password, user.password)
  // support existing plain-text passwords by migrating them
  if (!valid && user.password === password) {
    valid = true
    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { id: user.id }, data: { password: hashed } })
  }

  if (!valid) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  res.cookie('role', user.role, { httpOnly: false, path: '/' })
  res.cookie('email', user.email, { httpOnly: false, path: '/' })
  res.json({ id: user.id, email: user.email, role: user.role })
}
