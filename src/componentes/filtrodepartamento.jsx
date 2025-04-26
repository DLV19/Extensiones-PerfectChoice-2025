function FiltroDepartamento({ departamento, setDepartamento }) {
    const opciones = [
      "Todos",
      "Recepción",
      "Dirección",
      "Recursos Humanos",
      "IT",
      "Ingeniería y calidad",
      "Distribución",
      "Compras",
      "Servicio a ventas",
      "Vigilancia",
      "Mercadotecnia",
      "Finanzas",
      "CDMX",
      "Ventas",
      "Ventas GDL",
      "Centro De Diseño",
      "Tiendas"
    ];
  
    return (
      <select
        value={departamento}
        onChange={(e) => setDepartamento(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px"
        }}
      >
        {opciones.map((dep, index) => (
          <option key={index} value={dep}>
            {dep}
          </option>
        ))}
      </select>
    );
  }
  
  export default FiltroDepartamento;
  