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

export async function deleteEstudiante(req: Request, res: Response) {
  const id = Number(req.params.id)
  await prisma.estudiante.delete({
    where: { id },
  })
  res.status(204).send()
}

export async function getEstudianteByCI(req: Request, res: Response) {
  try {
    const { ci } = req.params
    const estudiante = await prisma.estudiante.findUnique({
      where: { ci },
      include: {
        inscripciones: {
          include: {
            curso: true,
            pagos: true,
            certificado: true,
          },
        },
      },
    })

    if (!estudiante) {
      return res.status(404).json({ error: 'Estudiante no encontrado' })
    }

    // Extraer cursos únicos de las inscripciones
    const cursosMap = new Map()
    estudiante.inscripciones.forEach(inscripcion => {
      if (!cursosMap.has(inscripcion.curso.id)) {
        cursosMap.set(inscripcion.curso.id, inscripcion.curso)
      }
    })
    const cursos = Array.from(cursosMap.values())

    // Extraer certificados
    const certificados = estudiante.inscripciones
      .filter(inscripcion => inscripcion.certificado)
      .map(inscripcion => inscripcion.certificado!)

    res.json({
      estudiante: {
        id: estudiante.id,
        ci: estudiante.ci,
        nombres: estudiante.nombres,
        apellidos: estudiante.apellidos,
        prefijo: estudiante.prefijo,
        profesion: estudiante.profesion,
        telefono: estudiante.telefono,
        email: estudiante.email,
        departamento: estudiante.departamento,
      },
      inscripciones: estudiante.inscripciones.map(i => ({
        id: i.id,
        estudianteId: i.estudianteId,
        cursoId: i.cursoId,
        modalidad: i.modalidad,
        nota: i.nota,
        completado: i.completado,
      })),
      cursos,
      certificados,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar estudiante' })
  }
}
