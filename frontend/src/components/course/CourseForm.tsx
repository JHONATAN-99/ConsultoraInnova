import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Area } from "../../types/models";

type CourseFormProps = {
  onSubmit: (payload: {
    id?: number;
    nombre: string;
    precio: number;
    areaId: number;
  }) => void;
  areas: Area[];
  initialData?: {
    id: number;
    nombre: string;
    precio: number;
    areaId: number;
  };
  onCancel?: () => void;
};

export function CourseForm({
  onSubmit,
  initialData,
  onCancel,
  areas,
}: CourseFormProps) {
  const [form, setForm] = useState({
    nombre: initialData?.nombre ?? "",
    precio: initialData?.precio ?? 0,
    areaId: initialData?.areaId ?? areas[0]?.id ?? 0,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "areaId" || name === "precio" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.areaId) {
      return;
    }

    onSubmit({
      id: initialData?.id,
      nombre: form.nombre.trim(),
      precio: form.precio,
      areaId: form.areaId,
    });
  };

  const handleReset = () => {
    setForm({
      nombre: "",
      precio: 0,
      areaId: areas[0]?.id ?? 0,
    });
    if (onCancel) onCancel();
  };

  return (
    <section className="panel">
      <h2>{initialData ? "Editar curso" : "Crear curso"}</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-field">
            <label htmlFor="nombreCurso">Nombre del curso</label>
            <input
              id="nombreCurso"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Ej: Desarrollo Web con React"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="precioCurso">Precio (Bs)</label>
            <input
              id="precioCurso"
              name="precio"
              type="number"
              value={form.precio}
              onChange={handleChange}
              placeholder="Ej: 500"
              min="0"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="area">Área</label>
            <select
              id="area"
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              required
            >
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">{initialData ? "Actualizar" : "Crear"}</button>
          {onCancel && (
            <button type="button" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
