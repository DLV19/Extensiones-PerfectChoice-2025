function Buscador({ busqueda, setBusqueda }) {
  return (
    <input
      type="text"
      placeholder="Buscar por nombre, correo o departamento..."
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
    />
  );
}

export default Buscador;
