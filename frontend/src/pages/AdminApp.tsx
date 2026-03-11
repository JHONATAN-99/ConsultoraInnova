import { useState } from "react";
import type {
  Curso,
  Estudiante,
  Area,
  Inscripcion,
  Pago,
} from "../types/models";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { CourseForm } from "../components/course/CourseForm";
import { CourseList } from "../components/course/CourseList";
import { AreaForm } from "../components/course/AreaForm";
import { AreaList } from "../components/course/AreaList";
import { StudentForm } from "../components/student/StudentForm";
import { StudentList } from "../components/student/StudentList";
import { EnrollmentForm } from "../components/enrollment/EnrollmentForm";
import { PaymentManager } from "../components/payments/PaymentManager";

type AdminAppProps = {
  cursos: Curso[];
  estudiantes: Estudiante[];
  areas: Area[];
  inscripciones: Inscripcion[];
  pagos: Pago[];
  onCreateCurso: (payload: Omit<Curso, "id">) => void;
  onUpdateCurso: (id: number, payload: Partial<Curso>) => void;
  onDeleteCurso?: (id: number) => void;
  onCreateEstudiante: (payload: Omit<Estudiante, "id">) => void;
  onUpdateEstudiante: (id: number, payload: Partial<Estudiante>) => void;
  onDeleteEstudiante?: (id: number) => void;
  onCreateArea?: (payload: Omit<Area, "id">) => void;
  onDeleteArea?: (id: number) => void;
  onCreateInscripcion: (payload: {
    estudianteId: number;
    cursoId: number;
    modalidad: "certificado" | "examen";
  }) => void;
  onAddNota: (inscripcionId: number, nota: number) => void;
  onManagePago: (
    inscripcionId: number,
    monto: number,
    tipoPago: string,
  ) => void;
  onLogout: () => void;
  userRole: "administrador" | "gerente";
  userEmail?: string;
};

export default function AdminApp({
  cursos,
  estudiantes,
  areas,
  inscripciones,
  pagos,
  onCreateCurso,
  onUpdateCurso,
  onDeleteCurso,
  onCreateEstudiante,
  onUpdateEstudiante,
  onDeleteEstudiante,
  onCreateArea,
  onDeleteArea,
  onCreateInscripcion,
  onAddNota,
  onManagePago,
  onLogout,
  userRole,
  userEmail,
}: AdminAppProps) {
  const isGerente = userRole === "gerente";
  const isAdministrador = userRole === "administrador";

  type Tab =
    | "registro"
    | "inscripcion"
    | "pagos"
    | "concluidos"
    | "estudiantes"
    | "areas"
    | "cursos";

  const [activeTab, setActiveTab] = useState<Tab>(
    isGerente ? "areas" : "registro",
  );

  const [editingCurso, setEditingCurso] = useState<Curso | null>(null);
  const [editingStudent, setEditingStudent] = useState<Estudiante | null>(null);

  const handleCourseSubmit = (data: Omit<Curso, "id"> & { id?: number }) => {
    if (!isGerente) return;

    if (data.id) {
      onUpdateCurso(data.id, data);
      setEditingCurso(null);
    } else {
      onCreateCurso(data);
    }
  };

  const handleStudentSubmit = (
    data: Omit<Estudiante, "id"> & { id?: number },
  ) => {
    if (!isAdministrador) return;

    if (data.id) {
      onUpdateEstudiante(data.id, data);
      setEditingStudent(null);
    } else {
      onCreateEstudiante(data);
    }
  };

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
                { key: "areas", label: "Áreas" },
                { key: "cursos", label: "Cursos" },
                { key: "estudiantes", label: "Estudiantes" },
              ]
            : [
                { key: "registro", label: "Registrar estudiante" },
                { key: "inscripcion", label: "Inscribir estudiante" },
                { key: "pagos", label: "Pagos / Deudas" },
                { key: "concluidos", label: "Estudiantes concluidos" },
                { key: "estudiantes", label: "Lista de estudiantes" },
              ]
        }
        activeKey={activeTab}
        onSelect={(key) => setActiveTab(key as Tab)}
      />

      <main className="main-content">
        {/* ÁREAS */}
        {activeTab === "areas" && isGerente && (
          <section className="panel">
            <h3>Gestión de Áreas</h3>

            {onCreateArea && <AreaForm onSubmit={onCreateArea} />}

            <AreaList areas={areas} cursos={cursos} onDelete={onDeleteArea} />
          </section>
        )}

        {/* CURSOS */}
        {activeTab === "cursos" && isGerente && (
          <>
            <CourseForm
              onSubmit={handleCourseSubmit}
              initialData={editingCurso ?? undefined}
              onCancel={() => setEditingCurso(null)}
              areas={areas}
            />

            {areas.map((area) => (
              <div key={area.id} style={{ marginTop: "1rem" }}>
                <h3>{area.nombre}</h3>

                <CourseList
                  cursos={cursos.filter((c) => c.areaId === area.id)}
                  onEdit={(c) => setEditingCurso(c)}
                  onDelete={onDeleteCurso}
                  areas={areas}
                />
              </div>
            ))}
          </>
        )}

        {/* ESTUDIANTES */}
        {/* REGISTRO ESTUDIANTE */}
        {activeTab === "registro" && isAdministrador && (
          <StudentForm
            onSubmit={handleStudentSubmit}
            initialData={editingStudent ?? undefined}
            onCancel={() => setEditingStudent(null)}
          />
        )}

        {/* LISTA ESTUDIANTES */}
        {activeTab === "estudiantes" && (
          <StudentList
            estudiantes={estudiantes}
            busqueda=""
            onBusquedaChange={() => {}}
            onEdit={isGerente ? (e) => setEditingStudent(e) : undefined}
            onDelete={isGerente ? onDeleteEstudiante : undefined}
          />
        )}

        {/* INSCRIPCIONES */}
        {activeTab === "inscripcion" && isAdministrador && (
          <EnrollmentForm
            estudiantes={estudiantes}
            areas={areas}
            cursos={cursos}
            onCreateInscripcion={(data) =>
              onCreateInscripcion({
                estudianteId: data.estudianteId,
                cursoId: data.cursoId,
                modalidad: "examen",
              })
            }
          />
        )}

        {activeTab === "pagos" && isAdministrador && (
          <PaymentManager
            estudiantes={estudiantes}
            cursos={cursos}
            inscripciones={inscripciones}
            onManagePago={onManagePago}
          />
        )}

        {/* ESTUDIANTES CONCLUIDOS */}
        {activeTab === "concluidos" && isAdministrador && (
          <section className="panel">
            <h2>Estudiantes que concluyeron</h2>

            <table className="table">
              <thead>
                <tr>
                  <th>Estudiante</th>
                  <th>Curso</th>
                  <th>Nota</th>
                </tr>
              </thead>

              <tbody>
                {inscripciones
                  .filter((i) => i.completado)
                  .map((i) => {
                    const est = estudiantes.find(
                      (e) => e.id === i.estudianteId,
                    );
                    const curso = cursos.find((c) => c.id === i.cursoId);

                    return (
                      <tr key={i.id}>
                        <td>
                          {est?.nombres} {est?.apellidos}
                        </td>
                        <td>{curso?.nombre}</td>
                        <td>{i.nota ?? "-"}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </section>
        )}
      </main>
    </div>
  );
}
