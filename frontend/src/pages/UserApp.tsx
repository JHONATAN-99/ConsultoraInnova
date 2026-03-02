import { useState } from 'react'
import type { Curso, Solicitud } from '../mockDb'
import { Navbar } from '../components/layout/Navbar'
import { Sidebar } from '../components/layout/Sidebar'

type UserAppProps = {
  cursos: Curso[]
  solicitudes: Solicitud[]
  onCreateSolicitud: (payload: Omit<Solicitud, 'id'>) => void
  onLogout: () => void
  user: { username: string }
  userRole: string
  userEmail?: string
}

export default function UserApp({
  cursos,
  solicitudes,
  onCreateSolicitud,
  onLogout,
  user,
  userRole,
  userEmail,
}: UserAppProps) {
  const [activeTab, setActiveTab] = useState<'cursos' | 'misSolicitudes'>('cursos')

  const myRequests = solicitudes.filter((s) => s.usuario === user.username)

  const handleRequest = (cursoId: number) => {
    // prevent duplicate pending or accepted
    const existing = myRequests.find((r) => r.cursoId === cursoId && r.status === 'pending')
    if (existing) return
    onCreateSolicitud({ cursoId, usuario: user.username, status: 'pending' })
  }

  return (
    <div className="layout">
      <Navbar
        title="Panel de usuario"
        userRole={userRole}
        userEmail={userEmail}
        onLogout={onLogout}
      />
      <Sidebar
        items={[
          { key: 'cursos', label: 'Cursos' },
          { key: 'misSolicitudes', label: 'Mis solicitudes' },
        ]}
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k as any)}
      />
      <main className="main-content">
        {activeTab === 'cursos' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Cursos disponibles</h2>
                <p className="panel-subtitle">Elige uno para inscribirte</p>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Duración</th>
                    <th>Descripción</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cursos.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="table-empty">
                        No hay cursos disponibles.
                      </td>
                    </tr>
                  ) : (
                    cursos.map((curso) => {
                      const myReq = myRequests.find((r) => r.cursoId === curso.id)
                      const disabled = myReq?.status === 'pending' || myReq?.status === 'accepted'
                      return (
                        <tr key={curso.id}>
                          <td>{curso.nombre}</td>
                          <td>{curso.precio.toFixed(2)}</td>
                          <td>{curso.duracionSemanas ?? '-'}</td>
                          <td>{curso.descripcion}</td>
                          <td>
                            <button
                              type="button"
                              disabled={disabled}
                              onClick={() => handleRequest(curso.id)}
                            >
                              {myReq ? (myReq.status === 'pending' ? 'Solicitado' : 'Aceptado') : 'Solicitar'}
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

        {activeTab === 'misSolicitudes' && (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>Mis solicitudes</h2>
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Curso</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="table-empty">
                        No has enviado ninguna solicitud.
                      </td>
                    </tr>
                  ) : (
                    myRequests.map((r) => {
                      const curso = cursos.find((c) => c.id === r.cursoId)
                      return (
                        <tr key={r.id}>
                          <td>{curso?.nombre ?? 'N/A'}</td>
                          <td>{r.status}</td>
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
