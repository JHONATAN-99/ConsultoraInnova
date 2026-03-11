import type { Request, Response } from 'express'
import prisma from '../prismaClient'

export async function getPagos(req: Request, res: Response) {
  try {
    const pagos = await prisma.pago.findMany({
      include: {
        inscripcion: {
          include: {
            estudiante: true,
            curso: true,
          },
        },
      },
    })
    res.json(pagos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos' })
  }
}

export async function getPagosByInscripcion(req: Request, res: Response) {
  try {
    const inscripcionId = Number(req.params.inscripcionId)
    const pagos = await prisma.pago.findMany({
      where: { inscripcionId },
      include: {
        inscripcion: {
          include: {
            estudiante: true,
            curso: true,
          },
        },
      },
    })
    res.json(pagos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener pagos' })
  }
}

export async function createPago(req: Request, res: Response) {
  try {
    const { inscripcionId, monto, tipoPago, comprobante, recibo } = req.body

    if (!inscripcionId || !monto || !tipoPago) {
      return res.status(400).json({ error: 'Faltan campos requeridos' })
    }

    const inscripcion = await prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
    })

    if (!inscripcion) {
      return res.status(404).json({ error: 'Inscripción no encontrada' })
    }

    const nuevoPago = await prisma.pago.create({
      data: {
        inscripcionId,
        monto,
        tipoPago,
        comprobante,
        recibo,
        fecha: new Date(),
      },
    })

    const nuevoMontoPagado = inscripcion.montoPagado + monto

    await prisma.inscripcion.update({
      where: { id: inscripcionId },
      data: {
        montoPagado: nuevoMontoPagado,
        completado: nuevoMontoPagado >= inscripcion.montoTotal,
      },
    })

    const pagoConRelaciones = await prisma.pago.findUnique({
      where: { id: nuevoPago.id },
      include: {
        inscripcion: {
          include: {
            estudiante: true,
            curso: true,
          },
        },
      },
    })

    res.status(201).json(pagoConRelaciones)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear pago' })
  }
}

export async function updatePago(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    const { monto, tipoPago, comprobante, recibo } = req.body

    const updated = await prisma.pago.update({
      where: { id },
      data: {
        ...(monto !== undefined && { monto }),
        ...(tipoPago !== undefined && { tipoPago }),
        ...(comprobante !== undefined && { comprobante }),
        ...(recibo !== undefined && { recibo }),
      },
      include: {
        inscripcion: {
          include: {
            estudiante: true,
            curso: true,
          },
        },
      },
    })
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar pago' })
  }
}

export async function deletePago(req: Request, res: Response) {
  try {
    const id = Number(req.params.id)
    await prisma.pago.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar pago' })
  }
}
