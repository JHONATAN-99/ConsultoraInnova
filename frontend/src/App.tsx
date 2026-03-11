import "./App.css";
import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import AdminApp from "./pages/AdminApp.tsx";
import ConsultaEstudiante from "./pages/ConsultaEstudiante.tsx";
import type {
  Curso,
  Estudiante,
  Inscripcion,
  Pago,
  Area,
  Certificado,
} from "./types/models";

export type Role = "administrador" | "gerente";

function App() {
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)"),
    );
    return match ? match[2] : null;
  };
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [certificados, setCertificados] = useState<Certificado[]>([]);

  // load initial data from backend and check auth cookie
  useEffect(() => {
    const savedRole = getCookie("role") as Role | null;
    const savedEmail = getCookie("email");
    if (savedRole === "administrador" || savedRole === "gerente") {
      setUserRole(savedRole);
      setUserEmail(savedEmail);
    }
  }, []);

  // whenever role changes (including initial login), fetch resources
  useEffect(() => {
    // everyone needs list of cursos
    fetch("/api/cursos")
      .then((r) => r.json())
      .then(setCursos)
      .catch(() => setCursos([]));

    if (userRole === "administrador" || userRole === "gerente") {
      fetch("/api/estudiantes")
        .then((r) => (r.ok ? r.json() : []))
        .then(setEstudiantes)
        .catch(() => setEstudiantes([]));

      fetch("/api/inscripciones")
        .then((r) => (r.ok ? r.json() : []))
        .then(setInscripciones)
        .catch(() => setInscripciones([]));

      fetch("/api/pagos")
        .then((r) => (r.ok ? r.json() : []))
        .then(setPagos)
        .catch(() => setPagos([]));

      fetch("/api/areas")
        .then((r) => (r.ok ? r.json() : []))
        .then(setAreas)
        .catch(() => setAreas([]));
    }
  }, [userRole]);

  const handleCreateCurso = async (payload: Omit<Curso, "id">) => {
    const res = await fetch("/api/cursos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const nuevo: Curso = await res.json();
    setCursos((prev) => [...prev, nuevo]);
  };

  const handleUpdateCurso = async (id: number, payload: Partial<Curso>) => {
    const res = await fetch(`/api/cursos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const updated: Curso = await res.json();
    setCursos((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const handleDeleteCurso = async (id: number) => {
    await fetch(`/api/cursos/${id}`, { method: "DELETE" });
    setCursos((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreateEstudiante = async (payload: Omit<Estudiante, "id">) => {
    const res = await fetch("/api/estudiantes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const nuevo: Estudiante = await res.json();
    setEstudiantes((prev) => [...prev, nuevo]);
  };

  const handleUpdateEstudiante = async (
    id: number,
    payload: Partial<Estudiante>,
  ) => {
    const res = await fetch(`/api/estudiantes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const updated: Estudiante = await res.json();
    setEstudiantes((prev) => prev.map((e) => (e.id === id ? updated : e)));
  };

  const handleDeleteEstudiante = async (id: number) => {
    await fetch(`/api/estudiantes/${id}`, { method: "DELETE" });
    setEstudiantes((prev) => prev.filter((e) => e.id !== id));
  };

  const handleCreateArea = async (payload: Omit<Area, "id">) => {
    const res = await fetch("/api/areas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return;
    const nuevo: Area = await res.json();
    setAreas((prev) => [...prev, nuevo]);
  };

  const handleDeleteArea = async (id: number) => {
    await fetch(`/api/areas/${id}`, { method: "DELETE" });
    setAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const handleCreateInscripcion = async (payload: {
    estudianteId: number;
    cursoId: number;
    modalidad: "certificado" | "examen";
  }) => {
    const curso = cursos.find((c) => c.id === payload.cursoId);

    const res = await fetch("/api/inscripciones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        montoTotal: curso?.precio ?? 0,
        montoPagado: 0,
        completado: false,
      }),
    });

    if (!res.ok) return;

    const nueva: Inscripcion = await res.json();

    setInscripciones((prev) => [...prev, nueva]);
  };

  const handleAddNota = async (inscripcionId: number, nota: number) => {
    const res = await fetch(`/api/inscripciones/${inscripcionId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nota }),
    });
    if (!res.ok) return;
    const updated: Inscripcion = await res.json();
    setInscripciones((prev) =>
      prev.map((i) => (i.id === inscripcionId ? updated : i)),
    );
  };

  const handleManagePago = async (
    inscripcionId: number,
    monto: number,
    tipoPago: string,
  ) => {
    const res = await fetch("/api/pagos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inscripcionId,
        monto,
        tipoPago,
        fecha: new Date().toISOString(),
      }),
    });

    if (!res.ok) return;

    const nuevoPago: Pago = await res.json();

    setPagos((prev) => [...prev, nuevoPago]);

    // actualizar inscripción
    setInscripciones((prev) =>
      prev.map((i) => {
        if (i.id !== inscripcionId) return i;

        const nuevoMontoPagado = i.montoPagado + monto;

        return {
          ...i,
          montoPagado: nuevoMontoPagado,
          completado: nuevoMontoPagado >= i.montoTotal,
        };
      }),
    );
  };

  const handleConsultaEstudiante = async (ci: string) => {
    try {
      const res = await fetch(`/api/estudiantes/ci/${ci}`);

      if (!res.ok) {
        throw new Error("Estudiante no encontrado");
      }

      const data = await res.json();

      return {
        estudiante: data.estudiante,
        inscripciones: data.inscripciones,
        cursos: data.cursos,
        certificados: data.certificados,
      };
    } catch {
      throw new Error("No se pudo consultar el estudiante");
    }
  };

  if (!userRole) {
    return (
      <LoginPage
        onLoginSuccess={(role, email) => {
          setUserRole(role);
          setUserEmail(email);
        }}
      />
    );
  }

  const adminProps = {
    cursos,
    estudiantes,
    areas,
    inscripciones,
    pagos,
    onCreateCurso: handleCreateCurso,
    onUpdateCurso: handleUpdateCurso,
    onDeleteCurso: handleDeleteCurso,
    onCreateEstudiante: handleCreateEstudiante,
    onUpdateEstudiante: handleUpdateEstudiante,
    onDeleteEstudiante: handleDeleteEstudiante,
    onCreateArea: handleCreateArea,
    onDeleteArea: handleDeleteArea,
    onCreateInscripcion: handleCreateInscripcion,
    onAddNota: handleAddNota,
    onManagePago: handleManagePago,
    onLogout: () => {
      document.cookie = "role=; Max-Age=0; path=/";
      document.cookie = "email=; Max-Age=0; path=/";
      setUserRole(null);
      setUserEmail(null);
    },
    userRole,
    userEmail,
  };

  // Both administrador and gerente see the same dashboard but with different permissions
  if (userRole === "administrador" || userRole === "gerente") {
    return <AdminApp {...adminProps} userEmail={userEmail ?? undefined} />;
  }

  // Public consultation page for students
  return <ConsultaEstudiante onConsulta={handleConsultaEstudiante} />;
}

export default App;
