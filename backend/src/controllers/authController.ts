import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { User } from '../models/User.ts'
import bcrypt from 'bcrypt'

export async function register(req: Request, res: Response) {
  const { email, password, role } = req.body as {
    email: string
    password: string
    role: 'admin' | 'user' | 'gerente'
  }

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'email, password and role required' })
  }

  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) {
    return res.status(409).json({ error: 'user already exists' })
  }

  // hash password before storing
  const hashed = await bcrypt.hash(password, 10)

  const nuevo = await prisma.user.create({
    data: { email, password: hashed, role },
  })

  // set role and email cookies immediately
  res.cookie('role', nuevo.role, { httpOnly: false, path: '/' })
  res.cookie('email', nuevo.email, { httpOnly: false, path: '/' })
  res.status(201).json({ id: nuevo.id, email: nuevo.email, role: nuevo.role })
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
