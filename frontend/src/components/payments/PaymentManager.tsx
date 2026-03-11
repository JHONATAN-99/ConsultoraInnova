import { useState } from "react";
import type { Estudiante, Curso, Inscripcion } from "../../types/models";

type Props = {
  estudiantes: Estudiante[];
  cursos: Curso[];
  inscripciones: Inscripcion[];
  onManagePago: (
    inscripcionId: number,
    monto: number,
    tipoPago: string,
    comprobante?: string,
  ) => void;
};

export function PaymentManager({
  estudiantes,
  cursos,
  inscripciones,
  onManagePago,
}: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [inscripcionSeleccionada, setInscripcionSeleccionada] =
    useState<Inscripcion | null>(null);

  const [montoCurso, setMontoCurso] = useState<number | "">("");
  const [montoPago, setMontoPago] = useState<number | "">("");
  const [comprobante, setComprobante] = useState("");
  const [tipoPago, setTipoPago] = useState("efectivo");

  const estudiantesFiltrados = estudiantes.filter((e) => {
    const t = busqueda.toLowerCase();
    return (
      e.ci.toLowerCase().includes(t) ||
      e.nombres.toLowerCase().includes(t) ||
      e.apellidos.toLowerCase().includes(t)
    );
  });

  const saldo =
    typeof montoCurso === "number" && typeof montoPago === "number"
      ? montoCurso - montoPago
      : "";

  return (
    <section className="panel">
      <h2>Pagos y deudas</h2>

      {/* BUSCADOR */}

      <div className="form-field">
        <label>Buscar estudiante 🔍</label>
        <input
          placeholder="CI o nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* RESULTADOS */}

      <div className="table-wrapper">
        <table className="table">
          <tbody>
            {estudiantesFiltrados.flatMap((e) => {
              const inscripcionesEstudiante = inscripciones.filter(
                (i) => i.estudianteId === e.id,
              );

              return inscripcionesEstudiante.map((ins) => {
                const curso = cursos.find((c) => c.id === ins.cursoId);

                return (
                  <tr key={ins.id}>
                    <td>{e.ci}</td>

                    <td>
                      {e.nombres} {e.apellidos}
                    </td>

                    <td>{curso?.nombre}</td>

                    <td>
                      <button
                        onClick={() => {
                          setInscripcionSeleccionada(ins);
                        }}
                      >
                        Registrar pago
                      </button>
                    </td>
                  </tr>
                );
              });
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL */}

      {inscripcionSeleccionada && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Registrar pago</h3>

            <div className="form-field">
              <label>Monto del curso</label>

              <input
                type="number"
                placeholder="0"
                value={montoCurso}
                onChange={(e) =>
                  setMontoCurso(
                    e.target.value === "" ? "" : Number(e.target.value),
                  )
                }
              />
            </div>

            <div className="form-field">
              <label>Monto que paga</label>

              <input
                type="number"
                value={montoPago}
                onChange={(e) => setMontoPago(Number(e.target.value))}
              />
            </div>

            <div className="form-field">
              <label>Saldo</label>

              <input value={saldo} readOnly />
            </div>

            <div className="form-field">
              <label>Tipo de pago</label>

              <select onChange={(e) => setTipoPago(e.target.value)}>
                <option value="efectivo">Efectivo</option>
                <option value="transaccion">Transferencia</option>
              </select>
            </div>

            <div className="form-field">
              <label>N° comprobante / recibo</label>

              <input
                value={comprobante}
                onChange={(e) => setComprobante(e.target.value)}
              />
            </div>

            <div className="modal-actions">
              <button
                onClick={() => {
                  onManagePago(
                    inscripcionSeleccionada.id,
                    Number(montoPago),
                    tipoPago,
                    comprobante,
                  );

                  setInscripcionSeleccionada(null);
                }}
              >
                Registrar pago
              </button>

              <button onClick={() => setInscripcionSeleccionada(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
