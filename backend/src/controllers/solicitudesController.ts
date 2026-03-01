import type { Request, Response } from 'express'
import prisma from '../prismaClient'
import type { Solicitud } from '../models/Solicitud.ts'

export async function getSolicitudes(req: Request, res: Response) {
  const solicitudes = await prisma.solicitud.findMany()
  res.json(solicitudes)
}

export async function createSolicitud(req: Request, res: Response) {
  const payload: Omit<Solicitud, 'id'> = req.body
  const nueva = await prisma.solicitud.create({ data: payload })
  res.status(201).json(nueva)
}

export async function updateSolicitud(req: Request, res: Response) {
  const id = Number(req.params.id)
  const payload: Partial<Omit<Solicitud, 'id'>> = req.body
  const updated = await prisma.solicitud.update({
    where: { id },
    data: payload,
  })
  res.json(updated)
}
