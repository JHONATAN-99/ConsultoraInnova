import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { Curso } from '../models/Curso'

export async function getCursos(req: Request, res: Response) {
  const { areaId } = req.query
  const where: any = {}
  if (areaId) {
    where.areaId = Number(areaId)
  }
  const cursos = await prisma.curso.findMany({ where })
  res.json(cursos)
}

export async function createCurso(req: Request, res: Response) {
  const payload: Omit<Curso, 'id'> = req.body
  const nuevo = await prisma.curso.create({ data: payload })
  res.status(201).json(nuevo)
}

export async function updateCurso(req: Request, res: Response) {
  const id = Number(req.params.id)
  const payload: Partial<Omit<Curso, 'id'>> = req.body
  const updated = await prisma.curso.update({
    where: { id },
    data: payload,
  })
  res.json(updated)
}

export async function deleteCurso(req: Request, res: Response) {
  const id = Number(req.params.id)
  await prisma.curso.delete({ where: { id } })
  res.status(204).send()
}
