import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Estudiante } from "../../types/models";

type StudentFormProps = {
  onSubmit: (data: Omit<Estudiante, "id"> & { id?: number }) => void;
  initialData?: Estudiante;
  onCancel?: () => void;
};

export function StudentForm({
  onSubmit,
  initialData,
  onCancel,
}: StudentFormProps) {
  const [form, setForm] = useState({
    ci: initialData?.ci ?? "",
    nombres: initialData?.nombres ?? "",
    apellidos: initialData?.apellidos ?? "",
    prefijo: initialData?.prefijo ?? "",
    profesion: initialData?.profesion ?? "",
    telefono: initialData?.telefono ?? "",
    email: initialData?.email ?? "",
    departamento: initialData?.departamento ?? "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (
      !form.ci.trim() ||
      !form.nombres.trim() ||
      !form.apellidos.trim() ||
      !form.prefijo.trim() ||
      !form.profesion.trim() ||
      !form.telefono.trim() ||
      !form.email.trim() ||
      !form.departamento.trim()
    ) {
      return;
    }

    onSubmit({
      id: initialData?.id,
      ci: form.ci.trim(),
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      prefijo: form.prefijo.trim(),
      profesion: form.profesion.trim(),
      telefono: form.telefono.trim(),
      email: form.email.trim(),
      departamento: form.departamento.trim(),
    });

    setForm({
      ci: "",
      nombres: "",
      apellidos: "",
      prefijo: "",
      profesion: "",
      telefono: "",
      email: "",
      departamento: "",
    });

    if (onCancel) onCancel();
  };

  return (
    <section className="student-card">
      <h2>{initialData ? "Editar estudiante" : "Registrar estudiante"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Datos personales</h3>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="ci">CI</label>
            <input
              id="ci"
              name="ci"
              type="text"
              value={form.ci}
              onChange={handleChange}
              placeholder="Número de cédula de identidad"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="prefijo">Prefijo</label>
            <input
              id="prefijo"
              name="prefijo"
              type="text"
              value={form.prefijo}
              onChange={handleChange}
              placeholder="Ej: Ing., Lic., Dr."
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nombres">Nombres</label>
            <input
              id="nombres"
              name="nombres"
              type="text"
              value={form.nombres}
              onChange={handleChange}
              placeholder="Nombres del estudiante"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="apellidos">Apellidos</label>
            <input
              id="apellidos"
              name="apellidos"
              type="text"
              value={form.apellidos}
              onChange={handleChange}
              placeholder="Apellidos del estudiante"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="profesion">Profesión</label>
            <input
              id="profesion"
              name="profesion"
              type="text"
              value={form.profesion}
              onChange={handleChange}
              placeholder="Profesión del estudiante"
              required
            />
          </div>
        </div>

        <h3 style={{ marginTop: "1.5rem" }}>Datos de contacto</h3>

        <div className="form-row">
          <div className="form-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              value={form.telefono}
              onChange={handleChange}
              placeholder="Número de teléfono"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="departamento">Departamento</label>
            <select
              id="departamento"
              name="departamento"
              value={form.departamento}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar departamento</option>
              <option value="Cochabamba">Cochabamba</option>
              <option value="La Paz">La Paz</option>
              <option value="Santa Cruz">Santa Cruz</option>
              <option value="Oruro">Oruro</option>
              <option value="Potosí">Potosí</option>
              <option value="Chuquisaca">Chuquisaca</option>
              <option value="Tarija">Tarija</option>
              <option value="Beni">Beni</option>
              <option value="Pando">Pando</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">
            {initialData ? "Actualizar estudiante" : "Guardar estudiante"}
          </button>

          {initialData && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{ marginLeft: "10px" }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
