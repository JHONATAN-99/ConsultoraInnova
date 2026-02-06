import type { Curso } from '../../mockDb'

type CourseListProps = {
  cursos: Curso[]
}

export function CourseList({ cursos }: CourseListProps) {
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
              <th>Precio</th>
              <th>Duración (semanas)</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {cursos.length === 0 ? (
              <tr>
                <td colSpan={4} className="table-empty">
                  No hay cursos para mostrar.
                </td>
              </tr>
            ) : (
              cursos.map((curso) => (
                <tr key={curso.id}>
                  <td>{curso.nombre}</td>
                  <td>{curso.precio.toFixed(2)}</td>
                  <td>{'duracionSemanas' in curso ? (curso as any).duracionSemanas : '-'}</td>
                  <td>{curso.descripcion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

