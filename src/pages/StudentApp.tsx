import { useState } from 'react'
import { StudentForm } from '../components/student/StudentForm'
import { StudentList } from '../components/student/StudentList'
import { CourseForm } from '../components/course/CourseForm'
import { CourseList } from '../components/course/CourseList'
import type { Curso, Estudiante } from '../mockDb'
import { cursosIniciales } from '../mockDb'

type StudentAppProps = {
  onLogout?: () => void
}

export default function StudentApp({ onLogout }: StudentAppProps) {
  const [cursos, setCursos] = useState<Curso[]>(cursosIniciales)
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [activeTab, setActiveTab] = useState<'estudiantes' | 'cursos'>('estudiantes')

  const currentTabTitle =
    activeTab === 'estudiantes' ? 'Gestión de estudiantes' : 'Gestión de cursos'
  const currentTabInfo =
    activeTab === 'estudiantes'
      ? 'Registra estudiantes, asigna cursos y controla sus pagos.'
      : 'Crea y administra los cursos que ofrece la institución.'

  const handleCreateStudent = (payload: {
    nombre: string
    apellido: string
    email: string
    cursoId: number
    montoInicial: number
  }) => {
    const nuevo: Estudiante = {
      id: Date.now(),
      ...payload,
    }
    setEstudiantes((prev) => [...prev, nuevo])
  }

  const handleCreateCourse = (payload: {
    nombre: string
    descripcion: string
    precio: number
    duracionSemanas: number
  }) => {
    const nuevo: Curso = {
      id: Date.now(),
      ...payload,
    }
    setCursos((prev) => [...prev, nuevo])
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>Control de Estudiantes</h1>
          <p className="app-subtitle">Registro de estudiantes en los cursos que ofrece la institución</p>
          <div className="nav-context">
            <span className="nav-context-title">{currentTabTitle}</span>
            <span className="nav-context-info">{currentTabInfo}</span>
          </div>
        </div>
        {onLogout && (
          <button className="logout-button" type="button" onClick={onLogout}>
            Cerrar sesión
          </button>
        )}
      </header>

      <main className="app-main">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="sidebar-title">Módulos</span>
            <span className="sidebar-subtitle">Elige qué quieres gestionar</span>
          </div>
          <nav className="sidebar-nav">
            <button
              type="button"
              className={`sidebar-button ${
                activeTab === 'estudiantes' ? 'sidebar-button--active' : ''
              }`}
              onClick={() => setActiveTab('estudiantes')}
            >
              Estudiantes
            </button>
            <button
              type="button"
              className={`sidebar-button ${
                activeTab === 'cursos' ? 'sidebar-button--active' : ''
              }`}
              onClick={() => setActiveTab('cursos')}
            >
              Cursos
            </button>
          </nav>
        </aside>

        <section className="app-content">
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
        </section>
      </main>
    </div>
  )
}

