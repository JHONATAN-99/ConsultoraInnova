import { useEffect, useState } from "react";
import type {
  Estudiante,
  Inscripcion,
  Curso,
  Certificado,
} from "../types/models";

type Props = {
  onConsulta: (ci: string) => Promise<{
    estudiante: Estudiante | null;
    inscripciones: Inscripcion[];
    cursos: Curso[];
    certificados: Certificado[];
  }>;
};

export default function Estudiante({ onConsulta }: Props) {
  const ci = window.location.pathname.split("/")[2];

  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const data = await onConsulta(ci);
      setResultado(data);
      setLoading(false);
    }

    cargar();
  }, [ci]);

  if (loading) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <p>Buscando información...</p>
        </div>
      </div>
    );
  }

  if (!resultado?.estudiante) {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <h2>No se encontró el estudiante</h2>
        </div>
      </div>
    );
  }

  const estudiante = resultado.estudiante;

  return (
    <div className="main-content">
      <section className="panel">
        <h2>Información personal</h2>

        <div className="info-grid">
          <div><strong>CI:</strong> {estudiante.ci}</div>
          <div><strong>Nombre:</strong> {estudiante.nombres} {estudiante.apellidos}</div>
          <div><strong>Profesión:</strong> {estudiante.profesion}</div>
          <div><strong>Email:</strong> {estudiante.email}</div>
          <div><strong>Teléfono:</strong> {estudiante.telefono}</div>
          <div><strong>Departamento:</strong> {estudiante.departamento}</div>
        </div>
      </section>

      <section className="panel">
        <h2>Mis cursos</h2>

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
              {resultado.inscripciones.map((i: Inscripcion) => {
                const curso = resultado.cursos.find((c: Curso) => c.id === i.cursoId);

                const cert = resultado.certificados.find(
                  (c: Certificado) => c.inscripcionId === i.id
                );

                const deuda = i.montoTotal - i.montoPagado;

                return (
                  <tr key={i.id}>
                    <td>{curso?.nombre}</td>
                    <td>{i.modalidad}</td>
                    <td>{i.nota ?? "-"}</td>
                    <td>{i.completado ? "Finalizado" : "En curso"}</td>
                    <td>{deuda > 0 ? `Debe Bs ${deuda}` : "Pagado"}</td>
                    <td>
                      {i.completado && deuda === 0
                        ? cert
                          ? "Certificado emitido"
                          : "Pendiente"
                        : "No disponible"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
