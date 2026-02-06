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

export const cursosIniciales: Curso[] = [
  {
    id: 1,
    nombre: 'Desarrollo Web con React',
    descripcion: 'Fundamentos de React, hooks y ecosistema moderno.',
    precio: 500,
  },
  {
    id: 2,
    nombre: 'Python para Data Science',
    descripcion: 'Análisis de datos, NumPy, Pandas y visualización.',
    precio: 650,
  },
  {
    id: 3,
    nombre: 'Introducción a Ciberseguridad',
    descripcion: 'Conceptos básicos de seguridad informática y buenas prácticas.',
    precio: 550,
  },
]

