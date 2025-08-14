import React, { useEffect, useMemo } from "react";

const DEFAULTS = [
  "Todos",
  "Recepción",
  "Dirección",
  "Recursos Humanos",
  "IT",
  "Ingeniería y calidad",
  "Distribución",
  "Compras",
  "Servicio a ventas",
  "Servicios De Planta",
  "Nuevos Productos",
  "Vigilancia",
  "Mercadotecnia",
  "Finanzas",
  "CDMX",
  "Ventas",
  "Ventas GDL",
  "Centro De Diseño",
  "Tiendas",
];

function FiltroDepartamento({
  departamento,
  setDepartamento,
  departamentos,         // <- opcional: lista dinámica desde el padre
  disabled = false,
  id = "filtro-departamento",
  className = "",
}) {
  // 1) Fuente de verdad: prop o defaults
  const opciones = useMemo(() => {
    const base =
      Array.isArray(departamentos) && departamentos.length
        ? departamentos
        : DEFAULTS;

    // 2) Deduplicar y ordenar (dejando "Todos" arriba)
    const set = new Set(base.filter(Boolean));
    set.delete("Todos");
    const rest = Array.from(set).sort((a, b) => a.localeCompare(b, "es"));

    return ["Todos", ...rest];
  }, [departamentos]);

  // 3) Si el valor actual no existe (cambió la lista), caer a "Todos"
  useEffect(() => {
    if (!opciones.includes(departamento)) {
      setDepartamento("Todos");
    }
  }, [opciones, departamento, setDepartamento]);

  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        Filtrar por departamento
      </label>
      <select
        id={id}
        value={departamento}
        onChange={(e) => setDepartamento(e.target.value)}
        disabled={disabled}
        aria-label="Filtrar por departamento"
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid var(--border, #ccc)",
          borderRadius: "8px",
          background: "var(--background, #fff)",
          color: "var(--foreground, #111)",
        }}
      >
        {opciones.map((dep) => (
          <option key={dep} value={dep}>
            {dep}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(FiltroDepartamento);
