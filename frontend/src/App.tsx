import './App.css'
import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import AdminApp from './pages/AdminApp.tsx'
import UserApp from './pages/UserApp.tsx'
import type { Curso, Estudiante, Solicitud } from './mockDb'

export type Role = 'admin' | 'user'

function App() {
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])

  // load initial data from backend
  useEffect(() => {
    fetch('/api/cursos')
      .then((r) => r.json())
      .then(setCursos)
    fetch('/api/estudiantes')
      .then((r) => r.json())
      .then(setEstudiantes)
    fetch('/api/solicitudes')
      .then((r) => r.json())
      .then(setSolicitudes)
  }, [])

  const handleCreateCurso = async (payload: Omit<Curso, 'id'>) => {
    const res = await fetch('/api/cursos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nuevo: Curso = await res.json()
    setCursos((prev) => [...prev, nuevo])
  }

  const handleUpdateCurso = async (id: number, payload: Partial<Curso>) => {
    const res = await fetch(`/api/cursos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const updated: Curso = await res.json()
    setCursos((prev) => prev.map((c) => (c.id === id ? updated : c)))
  }

  const handleCreateEstudiante = async (payload: Omit<Estudiante, 'id'>) => {
    const res = await fetch('/api/estudiantes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nuevo: Estudiante = await res.json()
    setEstudiantes((prev) => [...prev, nuevo])
  }

  const handleUpdateEstudiante = async (id: number, payload: Partial<Estudiante>) => {
    const res = await fetch(`/api/estudiantes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const updated: Estudiante = await res.json()
    setEstudiantes((prev) => prev.map((e) => (e.id === id ? updated : e)))
  }

  const handleCreateSolicitud = async (payload: Omit<Solicitud, 'id'>) => {
    const res = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nueva: Solicitud = await res.json()
    setSolicitudes((prev) => [...prev, nueva])
  }

  const handleUpdateSolicitud = async (id: number, status: string) => {
    const res = await fetch(`/api/solicitudes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const updated: Solicitud = await res.json()
    setSolicitudes((prev) => prev.map((s) => (s.id === id ? updated : s)))

    // if accepted, also create a corresponding estudiante record
    if (status === 'accepted') {
      const solicitud = solicitudes.find((s) => s.id === id)
      if (solicitud) {
        handleCreateEstudiante({
          nombre: solicitud.usuario,
          apellido: '',
          email: solicitud.usuario,
          cursoId: solicitud.cursoId,
          montoInicial: 0,
        })
      }
    }
  }

  if (!userRole) {
    return <LoginPage onLoginSuccess={(role) => setUserRole(role)} />
  }

  const commonProps = {
    cursos,
    estudiantes,
    solicitudes,
    onCreateCurso: handleCreateCurso,
    onUpdateCurso: handleUpdateCurso,
    onCreateEstudiante: handleCreateEstudiante,
    onUpdateEstudiante: handleUpdateEstudiante,
    onCreateSolicitud: handleCreateSolicitud,
    onUpdateSolicitud: handleUpdateSolicitud,
    onLogout: () => setUserRole(null),
    userRole,
  }

  return userRole === 'admin' ? (
    <AdminApp {...commonProps} />
  ) : (
    <UserApp {...commonProps} user={{ username: 'user' }} />
  )
}

export default App
