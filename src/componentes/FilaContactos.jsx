function FilaContactos({ contacto }) {
  return (
    <tr>
      <td>{contacto.nombre}</td>
      <td>{contacto.extension}</td>
      <td>{contacto.correo}</td>
      <td>{contacto.celular}</td>
      <td>{contacto.departamento}</td>
    </tr>
  );
}

export default FilaContactos;
