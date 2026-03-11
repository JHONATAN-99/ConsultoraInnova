import type { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function getInscripciones(req: Request, res: Response) {
  try {
    const inscripciones = await prisma.inscripcion.findMany({
      include: {
        estudiante: true,
        curso: true,
        pagos: true,
      },
    })
    res.json(inscripciones)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener inscripciones' })
  }
}

export async function createInscripcion(req: Request, res: Response) {
  try {
    const { estudianteId, cursoId, modalidad } = req.body

    if (!estudianteId || !cursoId || !modalidad) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    const curso = await prisma.curso.findUnique({
      where: { id: cursoId },
    })

    if (!curso) {
      return res.status(404).json({ error: 'Curso no encontrado' })
    }

    const nueva = await prisma.inscripcion.create({
      data: {
        estudianteId,
        cursoId,
        modalidad,

        montoTotal: curso.precio,
        montoPagado: 0,

        completado: false,
      },
      include: {
        estudiante: true,
        curso: true,
        pagos: true,
      },
    })

    res.status(201).json(nueva)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear inscripción' })
  }
}

export async function updateInscripcion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const { nota, completado } = req.body

    const updated = await prisma.inscripcion.update({
      where: { id },
      data: {
        ...(nota !== undefined && { nota }),
        ...(completado !== undefined && { completado }),
      },
      include: {
        estudiante: true,
        curso: true,
        pagos: true,
      },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar inscripción' })
  }
}

export async function deleteInscripcion(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    await prisma.inscripcion.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar inscripción' })
  }
}
