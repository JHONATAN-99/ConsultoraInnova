import './App.css'
import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import AdminApp from './pages/AdminApp.tsx'
import UserApp from './pages/UserApp.tsx'
import type { Curso, Estudiante, Solicitud, Area } from './mockDb'

export type Role = 'admin' | 'user' | 'gerente'

function App() {
  const [userRole, setUserRole] = useState<Role | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }
  const [cursos, setCursos] = useState<Curso[]>([])
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [areas, setAreas] = useState<Area[]>([])

  // load initial data from backend and check auth cookie
  // on mount determine if there's a cookie with role/email
  useEffect(() => {
    const savedRole = getCookie('role') as Role | null
    const savedEmail = getCookie('email')
    if (savedRole === 'admin' || savedRole === 'user' || savedRole === 'gerente') {
      setUserRole(savedRole)
      setUserEmail(savedEmail)
    }
  }, [])

  // whenever role changes (including initial login), fetch only the
  // resources that particular role needs
  useEffect(() => {
    // everyone needs list of cursos
    fetch('/api/cursos')
      .then((r) => r.json())
      .then(setCursos)

    if (userRole === 'admin' || userRole === 'gerente') {
      fetch('/api/estudiantes')
        .then((r) => r.ok ? r.json() : [])
        .then(setEstudiantes)
      fetch('/api/solicitudes')
        .then((r) => r.ok ? r.json() : [])
        .then(setSolicitudes)
      fetch('/api/areas')
        .then((r) => r.ok ? r.json() : [])
        .then(setAreas)
    } else if (userRole === 'user') {
      // only solicitudes for the individual user are required, but
      // backend doesn't support filtering by email so we'll fetch all
      // and filter client‑side in UserApp
      fetch('/api/solicitudes')
        .then((r) => r.ok ? r.json() : [])
        .then(setSolicitudes)
    }
  }, [userRole])

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

  const handleDeleteCurso = async (id: number) => {
    await fetch(`/api/cursos/${id}`, { method: 'DELETE' })
    setCursos((prev) => prev.filter((c) => c.id !== id))
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

  const handleDeleteEstudiante = async (id: number) => {
    await fetch(`/api/estudiantes/${id}`, { method: 'DELETE' })
    setEstudiantes((prev) => prev.filter((e) => e.id !== id))
  }

  const handleCreateArea = async (payload: Omit<Area, 'id'>) => {
    const res = await fetch('/api/areas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const nuevo: Area = await res.json()
    setAreas((prev) => [...prev, nuevo])
  }

  const handleDeleteArea = async (id: number) => {
    await fetch(`/api/areas/${id}`, { method: 'DELETE' })
    setAreas((prev) => prev.filter((a) => a.id !== id))
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
    return (
      <LoginPage
        onLoginSuccess={(role, email) => {
          setUserRole(role)
          setUserEmail(email)
        }}
      />
    )
  }

  const adminProps = {
    cursos,
    estudiantes,
    solicitudes,
    areas,
    onCreateCurso: handleCreateCurso,
    onUpdateCurso: handleUpdateCurso,
    onDeleteCurso: handleDeleteCurso,
    onCreateEstudiante: handleCreateEstudiante,
    onUpdateEstudiante: handleUpdateEstudiante,
    onDeleteEstudiante: handleDeleteEstudiante,
    onCreateSolicitud: handleCreateSolicitud,
    onUpdateSolicitud: handleUpdateSolicitud,
    onCreateArea: handleCreateArea,
    onDeleteArea: handleDeleteArea,
    onLogout: () => {
      document.cookie = 'role=; Max-Age=0; path=/';
      document.cookie = 'email=; Max-Age=0; path=/';
      setUserRole(null)
      setUserEmail(null)
    },
    userRole,
    userEmail,
  }

  const userProps = {
    cursos,
    solicitudes,
    onCreateSolicitud: handleCreateSolicitud,
    onLogout: () => {
      document.cookie = 'role=; Max-Age=0; path=/';
      document.cookie = 'email=; Max-Age=0; path=/';
      setUserRole(null)
      setUserEmail(null)
    },
    userRole,
    userEmail,
  }

  // gerente sees the same dashboard as admin but with full rights
  if (userRole === 'admin' || userRole === 'gerente') {
    return <AdminApp {...adminProps} userEmail={userEmail ?? undefined} />
  }

  return (
    <UserApp
      {...userProps}
      user={{ username: userEmail ?? 'user' }}
      userEmail={userEmail ?? undefined}
    />
  )
}

export default App
