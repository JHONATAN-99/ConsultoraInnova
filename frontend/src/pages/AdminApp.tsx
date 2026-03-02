import { useState } from 'react'
import type { Curso, Estudiante, Solicitud } from '../mockDb'
import { Navbar } from '../components/layout/Navbar'
import { Sidebar } from '../components/layout/Sidebar'
import { CourseForm } from '../components/course/CourseForm'
import { CourseList } from '../components/course/CourseList'
import { StudentForm } from '../components/student/StudentForm'
import { StudentList } from '../components/student/StudentList'

type AdminAppProps = {
  cursos: Curso[]
  estudiantes: Estudiante[]
  solicitudes: Solicitud[]
  onCreateCurso: (payload: Omit<Curso, 'id'>) => void
  onUpdateCurso: (id: number, payload: Partial<Curso>) => void
  onCreateEstudiante: (payload: Omit<Estudiante, 'id'>) => void
  onUpdateEstudiante: (id: number, payload: Partial<Estudiante>) => void
  onCreateSolicitud: (payload: Omit<Solicitud, 'id'>) => void
  onUpdateSolicitud: (id: number, status: string) => void
  onLogout: () => void
  userRole: string
  userEmail?: string
}

export default function AdminApp({
  cursos,
  estudiantes,
  solicitudes,
  onCreateCurso,
  onUpdateCurso,
  onCreateEstudiante,
  onUpdateEstudiante,
  onUpdateSolicitud,
  onLogout,
  userRole,
  userEmail,
}: AdminAppProps) {
  const [activeTab, setActiveTab] = useState<'cursos' | 'estudiantes' | 'solicitudes'>('cursos')
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null)

  const handleCourseSubmit = (data: Omit<Curso, 'id'> & { id?: number }) => {
    if (data.id != null) {
      onUpdateCurso(data.id, data)
      setEditingCurso(null)
    } else {
      onCreateCurso(data)
    }
  }

  const handleStudentSubmit = (
    data: Omit<Estudiante, 'id'> & { id?: number },
  ) => {
    if (data.id != null) {
      onUpdateEstudiante(data.id, data)
      setEditingStudent(null)
    } else {
      onCreateEstudiante(data)
    }
  }

  const pendingSolicitudes = solicitudes.filter((s) => s.status === 'pending')

  return (
    <div className="layout">
      <Navbar
        title="Panel de administración"
        userRole={userRole}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <Sidebar
        items={[
          { key: 'cursos', label: 'Cursos' },
          { key: 'estudiantes', label: 'Estudiantes' },
          { key: 'solicitudes', label: 'Solicitudes' },
        ]}
        activeKey={activeTab}
        onSelect={(key: string) => setActiveTab(key as any)}
      />

      <main className="main-content">
        {activeTab === 'cursos' && (
          <>
            <CourseForm
              onSubmit={handleCourseSubmit}
              initialData={editingCurso ?? undefined}
              onCancel={() => setEditingCurso(null)}
            />
            <CourseList
              cursos={cursos}
              onEdit={(c) => setEditingCurso(c)}
            />
          </>
        )}

        {activeTab === 'estudiantes' && (
          <>
            <StudentForm
              cursos={cursos}
              onSubmit={handleStudentSubmit}
              initialData={editingStudent ?? undefined}
              onCancel={() => setEditingStudent(null)}
            />
            <StudentList
              cursos={cursos}
              estudiantes={estudiantes}
              busqueda=""
              onBusquedaChange={() => {}}
              onEdit={(e) => setEditingStudent(e)}
            />
          </>
        )}

        {activeTab === 'solicitudes' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Solicitudes de inscripción</h2>
                <p className="panel-subtitle">
                  {pendingSolicitudes.length === 0
                    ? 'No hay solicitudes pendientes.'
                    : `Total: ${pendingSolicitudes.length} pendientes`}
                </p>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Curso</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSolicitudes.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="table-empty">
                        No hay solicitudes para mostrar.
                      </td>
                    </tr>
                  ) : (
                    pendingSolicitudes.map((sol) => {
                      const curso = cursos.find((c) => c.id === sol.cursoId)
                      return (
                        <tr key={sol.id}>
                          <td>{sol.usuario}</td>
                          <td>{curso?.nombre ?? 'N/A'}</td>
                          <td>{sol.status}</td>
                          <td>
                            <button
                              type="button"
                              onClick={() => onUpdateSolicitud(sol.id, 'accepted')}
                            >
                              Aceptar
                            </button>
                            <button
                              type="button"
                              onClick={() => onUpdateSolicitud(sol.id, 'rejected')}
                            >
                              Rechazar
                            </button>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
