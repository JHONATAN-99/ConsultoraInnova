import type { Estudiante } from "../../types/models";

type StudentListProps = {
  estudiantes: Estudiante[];
  busqueda: string;
  onBusquedaChange: (value: string) => void;
  onEdit?: (estudiante: Estudiante) => void;
  onDelete?: (id: number) => void;
};

export function StudentList({
  estudiantes,
  busqueda,
  onBusquedaChange,
  onEdit,
  onDelete,
}: StudentListProps) {
  const estudiantesFiltrados = estudiantes.filter((e) => {
    if (!busqueda.trim()) return true;
    const texto = busqueda.toLowerCase();
    return (
      e.ci.toLowerCase().includes(texto) ||
      e.nombres.toLowerCase().includes(texto) ||
      e.apellidos.toLowerCase().includes(texto) ||
      (e.prefijo ?? "").toLowerCase().includes(texto) ||
      (e.profesion ?? "").toLowerCase().includes(texto) ||
      (e.email ?? "").toLowerCase().includes(texto) ||
      (e.departamento ?? "").toLowerCase().includes(texto)
    );
  });

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Lista de estudiantes</h2>
          <p className="panel-subtitle">
            {estudiantes.length === 0
              ? "Aún no hay estudiantes registrados."
              : `Total: ${estudiantes.length} estudiante${estudiantes.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="panel-search">
          <label className="sr-only" htmlFor="busqueda">
            Buscar estudiante
          </label>
          <input
            id="busqueda"
            type="text"
            placeholder="Buscar por CI, nombres, apellidos, profesión, email..."
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>CI</th>
              <th>Prefijo</th>
              <th>Nombres</th>
              <th>Apellidos</th>
              <th>Profesión</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Departamento</th>
              {onEdit && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {estudiantesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={onEdit ? 9 : 8} className="table-empty">
                  No hay estudiantes para mostrar.
                </td>
              </tr>
            ) : (
              estudiantesFiltrados.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.ci}</td>
                  <td>{estudiante.prefijo}</td>
                  <td>{estudiante.nombres}</td>
                  <td>{estudiante.apellidos}</td>
                  <td>{estudiante.profesion}</td>
                  <td>{estudiante.telefono}</td>
                  <td>{estudiante.email}</td>
                  <td>{estudiante.departamento}</td>
                  {onEdit && (
                    <td>
                      <button type="button" onClick={() => onEdit(estudiante)}>
                        Editar
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(estudiante.id)}
                          style={{ marginLeft: "0.5rem" }}
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
  );
}
