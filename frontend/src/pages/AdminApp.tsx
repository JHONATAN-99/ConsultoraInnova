import { useState } from 'react'
import type { Curso, Estudiante, Solicitud, Area } from '../mockDb'
import { Navbar } from '../components/layout/Navbar'
import { Sidebar } from '../components/layout/Sidebar'
import { CourseForm } from '../components/course/CourseForm'
import { CourseList } from '../components/course/CourseList'
import { AreaForm } from '../components/course/AreaForm'
import { AreaList } from '../components/course/AreaList'
import { StudentForm } from '../components/student/StudentForm'
import { StudentList } from '../components/student/StudentList'

type AdminAppProps = {
  cursos: Curso[]
  estudiantes: Estudiante[]
  solicitudes: Solicitud[]
  areas: Area[]
  onCreateCurso: (payload: Omit<Curso, 'id'>) => void
  onUpdateCurso: (id: number, payload: Partial<Curso>) => void
  onDeleteCurso?: (id: number) => void
  onCreateEstudiante: (payload: Omit<Estudiante, 'id'>) => void
  onUpdateEstudiante: (id: number, payload: Partial<Estudiante>) => void
  onDeleteEstudiante?: (id: number) => void
  onCreateSolicitud: (payload: Omit<Solicitud, 'id'>) => void
  onUpdateSolicitud: (id: number, status: string) => void
  onCreateArea?: (payload: Omit<Area, 'id'>) => void
  onDeleteArea?: (id: number) => void
  onLogout: () => void
  userRole: string
  userEmail?: string
}

export default function AdminApp({
  cursos,
  estudiantes,
  solicitudes,
  areas,
  onCreateCurso,
  onUpdateCurso,
  onDeleteCurso,
  onCreateEstudiante,
  onUpdateEstudiante,
  onDeleteEstudiante,
  onCreateSolicitud,
  onUpdateSolicitud,
  onCreateArea,
  onDeleteArea,
  onLogout,
  userRole,
  userEmail,
}: AdminAppProps) {
  const isGerente = userRole === 'gerente'
  const isAdmin = userRole === 'admin'

  const [activeTab, setActiveTab] = useState<'cursos' | 'estudiantes' | 'solicitudes'>(
    isGerente ? 'cursos' : 'estudiantes'
  )
  const [editingCurso, setEditingCurso] = useState<Curso | null>(null)
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null)

  const handleCourseSubmit = (data: Omit<Curso, 'id'> & { id?: number }) => {
    if (!isGerente) return // admins may not submit
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
    // both admin and gerente can create; only gerente can update
    if (data.id != null) {
      if (!isGerente) return
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
        items={
          isGerente
            ? [
                { key: 'cursos', label: 'Cursos' },
                { key: 'estudiantes', label: 'Estudiantes' },
                { key: 'solicitudes', label: 'Solicitudes' },
              ]
            : [
                { key: 'cursos', label: 'Cursos' },
                { key: 'estudiantes', label: 'Estudiantes' },
              ]
        }
        activeKey={activeTab}
        onSelect={(key: string) => setActiveTab(key as any)}
      />

      <main className="main-content">
        {activeTab === 'cursos' && (
          <>
            {isGerente ? (
              <>
                <section className="panel">
                  <h3>Áreas</h3>
                  <AreaForm onSubmit={onCreateArea!} />
                  <AreaList
                    areas={areas}
                    cursos={cursos}
                    onDelete={onDeleteArea}
                  />
                </section>

                <CourseForm
                  onSubmit={handleCourseSubmit}
                  initialData={editingCurso ?? undefined}
                  onCancel={() => setEditingCurso(null)}
                  areas={areas}
                />
                {areas.length > 0 ? (
                  <>
                    {areas.map((area) => (
                      <div key={area.id} style={{ marginTop: '1rem' }}>
                        <h3>{area.nombre}</h3>
                        <CourseList
                          cursos={cursos.filter((c) => c.areaId === area.id)}
                          onEdit={(c) => setEditingCurso(c)}
                          onDelete={onDeleteCurso}
                          areas={areas}
                        />
                      </div>
                    ))}
                    {/* unassigned courses */}
                    {cursos.some((c) => c.areaId == null) && (
                      <div style={{ marginTop: '1rem' }}>
                        <h3>Sin área</h3>
                        <CourseList
                          cursos={cursos.filter((c) => c.areaId == null)}
                          onEdit={(c) => setEditingCurso(c)}
                          onDelete={onDeleteCurso}
                          areas={areas}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <CourseList
                    cursos={cursos}
                    onEdit={(c) => setEditingCurso(c)}
                    onDelete={onDeleteCurso}
                    areas={areas}
                  />
                )}
              </>
            ) : (
              <>
                {/* admin: read-only course list */}
                <h2>Cursos disponibles</h2>
                <CourseList
                  cursos={cursos}
                  areas={areas}
                  /* no edit/delete */
                />
              </>
            )}
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
              onEdit={isGerente ? (e) => setEditingStudent(e) : undefined}
              onDelete={isGerente ? onDeleteEstudiante : undefined}
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
                    {isGerente && <th>Acciones</th>}
                  </tr>
                </thead>
                <tbody>
                  {pendingSolicitudes.length === 0 ? (
                    <tr>
                      <td colSpan={isGerente ? 4 : 3} className="table-empty">
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
                          {isGerente && (
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
                          )}
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
