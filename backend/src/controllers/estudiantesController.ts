import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { Estudiante } from '../models/Estudiante'

export async function getEstudiantes(req: Request, res: Response) {
  const estudiantes = await prisma.estudiante.findMany()
  res.json(estudiantes)
}

export async function createEstudiante(req: Request, res: Response) {
  const payload: Omit<Estudiante, 'id'> = req.body
  const nuevo = await prisma.estudiante.create({ data: payload })
  res.status(201).json(nuevo)
}

export async function updateEstudiante(req: Request, res: Response) {
  const id = Number(req.params.id)
  const payload: Partial<Omit<Estudiante, 'id'>> = req.body
  const updated = await prisma.estudiante.update({
    where: { id },
    data: payload,
  })
  res.json(updated)
}
