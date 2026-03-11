import { useState } from "react";
import type {
  Estudiante,
  Inscripcion,
  Curso,
  Certificado,
} from "../types/models";

type ConsultaEstudianteProps = {
  onConsulta: (ci: string) => Promise<{
    estudiante: Estudiante | null;
    inscripciones: Inscripcion[];
    cursos: Curso[];
    certificados: Certificado[];
  }>;
};

export default function ConsultaEstudiante({
  onConsulta,
}: ConsultaEstudianteProps) {
  const [ci, setCi] = useState("");
  const [resultado, setResultado] = useState<{
    estudiante: Estudiante | null;
    inscripciones: Inscripcion[];
    cursos: Curso[];
    certificados: Certificado[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuscar = async () => {
    if (!ci.trim()) {
      setError("Por favor ingrese un número de CI");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await onConsulta(ci.trim());
      setResultado(data);
      if (!data.estudiante) {
        setError("No se encontró ningún estudiante con ese CI");
      }
    } catch (err) {
      setError("Error al consultar la información");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  return (
    <div className="consulta-wrapper">
      <div className="consulta-card">
        <header className="consulta-header">
          <h1>Consulta de Estudiante</h1>
          <p className="consulta-subtitle">
            Ingrese su número de carnet de identidad para consultar su
            información académica
          </p>
        </header>

        <div className="consulta-form">
          <div className="form-field">
            <label htmlFor="ci">Carnet de Identidad</label>
            <input
              id="ci"
              type="text"
              value={ci}
              onChange={(e) => setCi(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ej: 12345678"
              required
            />
          </div>

          {error && <p className="consulta-error">{error}</p>}

          <div className="form-actions">
            <button type="button" onClick={handleBuscar} disabled={loading}>
              {loading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </div>

        {resultado?.estudiante && (
          <div className="consulta-resultado">
            <section className="panel">
              <h2>Información Personal</h2>
              <div className="info-grid">
                <div>
                  <strong>CI:</strong> {resultado.estudiante.ci}
                </div>
                <div>
                  <strong>Nombre:</strong> {resultado.estudiante.nombres}{" "}
                  {resultado.estudiante.apellidos}
                </div>
                {resultado.estudiante.prefijo && (
                  <div>
                    <strong>Prefijo:</strong> {resultado.estudiante.prefijo}
                  </div>
                )}
                {resultado.estudiante.profesion && (
                  <div>
                    <strong>Profesión:</strong> {resultado.estudiante.profesion}
                  </div>
                )}
                {resultado.estudiante.telefono && (
                  <div>
                    <strong>Teléfono:</strong> {resultado.estudiante.telefono}
                  </div>
                )}
                {resultado.estudiante.email && (
                  <div>
                    <strong>Email:</strong> {resultado.estudiante.email}
                  </div>
                )}
                {resultado.estudiante.departamento && (
                  <div>
                    <strong>Departamento:</strong>{" "}
                    {resultado.estudiante.departamento}
                  </div>
                )}
              </div>
            </section>

            <section className="panel">
              <h2>Mis Cursos</h2>
              {resultado.inscripciones.length === 0 ? (
                <p>No está inscrito en ningún curso actualmente.</p>
              ) : (
                <div className="table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Curso</th>
                        <th>Modalidad</th>
                        <th>Nota</th>
                        <th>Estado</th>
                        <th>Pago</th>
                        <th>Certificado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resultado.inscripciones.map((inscripcion) => {
                        const curso = resultado.cursos.find(
                          (c) => c.id === inscripcion.cursoId,
                        );

                        const certificado = resultado.certificados.find(
                          (cert) => cert.inscripcionId === inscripcion.id,
                        );

                        const deuda =
                          inscripcion.montoTotal - inscripcion.montoPagado;

                        return (
                          <tr key={inscripcion.id}>
                            <td>{curso?.nombre ?? "N/A"}</td>

                            <td>{inscripcion.modalidad}</td>

                            <td>{inscripcion.nota ?? "-"}</td>

                            <td>
                              {inscripcion.completado
                                ? "Curso finalizado"
                                : "En curso"}
                            </td>

                            <td>{deuda > 0 ? `Debe Bs ${deuda}` : "Pagado"}</td>

                            <td>
                              {inscripcion.completado && deuda === 0
                                ? certificado
                                  ? `Emitido: ${new Date(certificado.fechaEmision).toLocaleDateString()}`
                                  : "Pendiente"
                                : "No disponible"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
