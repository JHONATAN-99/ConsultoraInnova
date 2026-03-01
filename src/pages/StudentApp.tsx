import { useState, useEffect } from 'react'
import { StudentForm } from '../components/student/StudentForm'
import { StudentList } from '../components/student/StudentList'
import { CourseForm } from '../components/course/CourseForm'
import { CourseList } from '../components/course/CourseList'
import type { Curso, Estudiante } from '../mockDb'

type StudentAppProps = {
  onLogout?: () => void
}

export default function StudentApp({ onLogout }: StudentAppProps) {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [activeTab, setActiveTab] = useState<'estudiantes' | 'cursos'>('estudiantes')

  const handleCreateStudent = async (payload: {
    nombre: string
    apellido: string
    email: string
    cursoId: number
    montoInicial: number
  }) => {
    const res = await fetch('/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nuevo: Estudiante = await res.json()
    setEstudiantes((prev) => [...prev, nuevo])
  }

  const handleCreateCourse = async (payload: {
    nombre: string
    descripcion: string
    precio: number
    duracionSemanas: number
  }) => {
    const res = await fetch('/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nuevo: Curso = await res.json()
    setCursos((prev) => [...prev, nuevo])
  }

  useEffect(() => {
    // load initial data from backend
    fetch('/api/cursos')
      .then((r) => r.json())
      .then(setCursos)
    fetch('/api/estudiantes')
      .then((r) => r.json())
      .then(setEstudiantes)
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Control de Estudiantes</h1>
          <p className="app-subtitle">Registro de estudiantes en los cursos que ofrece la institución</p>
        </div>
        {onLogout && (
          <button className="logout-button" type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </header>

      <main className="app-main">
        <div className="tabs-nav">
          <button
            type="button"
            className={`tab-button ${activeTab === 'estudiantes' ? 'tab-button--active' : ''}`}
            onClick={() => setActiveTab('estudiantes')}
          >
            Estudiantes
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'cursos' ? 'tab-button--active' : ''}`}
            onClick={() => setActiveTab('cursos')}
          >
            Cursos
          </button>
        </div>

        {activeTab === 'estudiantes' ? (
          <>
            <StudentForm cursos={cursos} onCreate={handleCreateStudent} />
            <StudentList
              cursos={cursos}
              estudiantes={estudiantes}
              busqueda={busqueda}
              onBusquedaChange={setBusqueda}
            />
          </>
        ) : (
          <>
            <CourseForm onCreate={handleCreateCourse} />
            <CourseList cursos={cursos} />
          </>
        )}
      </main>
    </div>
  )
}

