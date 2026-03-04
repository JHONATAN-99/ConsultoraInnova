import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { Area } from '../models/Area'

export async function getAreas(req: Request, res: Response) {
  const areas = await prisma.area.findMany({ include: { cursos: true } })
  res.json(areas)
}

export async function createArea(req: Request, res: Response) {
  const payload: Omit<Area, 'id'> = req.body
  const nuevo = await prisma.area.create({ data: payload })
  res.status(201).json(nuevo)
}

export async function updateArea(req: Request, res: Response) {
  const id = Number(req.params.id)
  const payload: Partial<Omit<Area, 'id'>> = req.body
  const updated = await prisma.area.update({ where: { id }, data: payload })
  res.json(updated)
}

export async function deleteArea(req: Request, res: Response) {
  const id = Number(req.params.id)
  await prisma.area.delete({ where: { id } })
  res.status(204).send()
}
