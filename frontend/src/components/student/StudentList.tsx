import type { Curso, Estudiante } from '../../mockDb'

type StudentListProps = {
  estudiantes: Estudiante[]
  cursos: Curso[]
  busqueda: string
  onBusquedaChange: (value: string) => void
  onEdit?: (estudiante: Estudiante) => void
  onDelete?: (estudiante: Estudiante) => void
}

export function StudentList({ estudiantes, cursos, busqueda, onBusquedaChange, onEdit }: StudentListProps) {
  const estudiantesFiltrados = estudiantes.filter((e) => {
    if (!busqueda.trim()) return true
    const texto = busqueda.toLowerCase()
    const curso = cursos.find((c) => c.id === e.cursoId)
    return (
      e.nombre.toLowerCase().includes(texto) ||
      e.apellido.toLowerCase().includes(texto) ||
      e.email.toLowerCase().includes(texto) ||
      curso?.nombre.toLowerCase().includes(texto)
    )
  })

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Lista de estudiantes</h2>
          <p className="panel-subtitle">
            {estudiantes.length === 0
              ? 'Aún no hay estudiantes registrados.'
              : `Total: ${estudiantes.length} estudiante${estudiantes.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="panel-search">
          <label className="sr-only" htmlFor="busqueda">
            Buscar estudiante o curso
          </label>
          <input
            id="busqueda"
            type="text"
            placeholder="Buscar por nombre, apellido, email o curso..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Curso</th>
              <th>Precio curso</th>
              <th>Monto inicial</th>
              <th>Restante</th>
              {onEdit && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {estudiantesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={onEdit ? 8 : 7} className="table-empty">
                  No hay estudiantes para mostrar.
                </td>
              </tr>
            ) : (
              estudiantesFiltrados.map((estudiante) => {
                const curso = cursos.find((c) => c.id === estudiante.cursoId)
                const precio = curso?.precio ?? 0
                const restante = Math.max(precio - estudiante.montoInicial, 0)
                return (
                  <tr key={estudiante.id}>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.apellido}</td>
                    <td>{estudiante.email}</td>
                    <td>{curso?.nombre ?? 'Sin curso'}</td>
                    <td>{precio.toFixed(2)}</td>
                    <td>{estudiante.montoInicial.toFixed(2)}</td>
                    <td>{restante.toFixed(2)}</td>
                    {onEdit && (
                      <td>
                        <button type="button" onClick={() => onEdit(estudiante)}>
                          Editar
                        </button>
                        {onDelete && (
                          <button
                            type="button"
                            style={{ marginLeft: '0.5rem' }}
                            onClick={() => onDelete(estudiante)}
                          >
                            Eliminar
                          </button>
                        )}
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
  )
}

