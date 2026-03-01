export type Curso = {
  id: number
  nombre: string
  descripcion: string
  precio: number
  duracionSemanas?: number
}

export type Estudiante = {
  id: number
  nombre: string
  apellido: string
  email: string
  cursoId: number
  montoInicial: number
}

export type Solicitud = {
  id: number
  cursoId: number
  usuario: string
  status: 'pending' | 'accepted' | 'rejected'
}


