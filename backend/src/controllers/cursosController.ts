import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { Curso } from '../models/Curso'

export async function getCursos(req: Request, res: Response) {
  const cursos = await prisma.curso.findMany()
  res.json(cursos)
}

export async function createCurso(req: Request, res: Response) {
  const payload: Omit<Curso, 'id'> = req.body
  const nuevo = await prisma.curso.create({ data: payload })
  res.status(201).json(nuevo)
}
