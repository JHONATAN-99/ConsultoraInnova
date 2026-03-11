export type Area = {
  id: number
  nombre: string
}

export type Curso = {
  id: number
  nombre: string
  precio: number
  fechaEmisionCert?: string
  areaId: number
}

export type Estudiante = {
  id: number
  ci: string
  nombres: string
  apellidos: string
  prefijo?: string
  profesion?: string
  telefono?: string
  email?: string
  departamento?: string
}

export type Inscripcion = {
  id: number
  estudianteId: number
  cursoId: number

  modalidad: 'certificado' | 'examen'

  nota?: number

  montoTotal: number
  montoPagado: number

  completado: boolean
}

export type Pago = {
  id: number
  inscripcionId: number

  monto: number
  fecha: string

  tipoPago: 'efectivo' | 'transferencia'

  comprobante?: string
  recibo?: string
}

export type Certificado = {
  id: number
  inscripcionId: number
  fechaEmision: string
}