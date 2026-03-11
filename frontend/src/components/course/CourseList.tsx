import type { Curso, Area } from '../../types/models'

type CourseListProps = {
  cursos: Curso[]
  areas: Area[]
  onEdit?: (curso: Curso) => void
  onDelete?: (id: number) => void
}

export function CourseList({ cursos, areas, onEdit, onDelete }: CourseListProps) {
  const getAreaName = (areaId: number) => {
    const area = areas.find(a => a.id === areaId)
    return area?.nombre ?? 'Sin área'
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Lista de cursos</h2>
          <p className="panel-subtitle">
            {cursos.length === 0
              ? 'Aún no hay cursos creados.'
              : `Total: ${cursos.length} curso${cursos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Área</th>
              {onEdit && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {cursos.length === 0 ? (
              <tr>
                <td colSpan={onEdit ? 3 : 2} className="table-empty">
                  No hay cursos para mostrar.
                </td>
              </tr>
            ) : (
              cursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.nombre}</td>
                  <td>{getAreaName(curso.areaId)}</td>
                  {onEdit && (
                    <td>
                      <button type="button" onClick={() => onEdit(curso)}>
                        Editar
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(curso.id)}
                          style={{ marginLeft: '0.5rem' }}
                        >
                          Eliminar
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

