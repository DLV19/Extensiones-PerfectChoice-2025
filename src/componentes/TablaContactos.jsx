import FilaContactos from "./FilaContactos";
import { User, Phone, Mail, Smartphone, Building } from 'lucide-react'; // 🔥 se importa aquí

function TablaContactos({ contactos }) {
  return (
    <div>
      <table>
        <thead>
          <tr>
          <th><User size={20} style={{ marginRight: "5px" }} /> Nombre</th>
          <th><Phone size={20} style={{ marginRight: "5px" }} /> Extensión</th>
          <th><Mail size={20} style={{ marginRight: "5px" }} /> Correo</th>
          <th><Smartphone size={20} style={{ marginRight: "5px" }} /> Celular</th>
          <th><Building size={20} style={{ marginRight: "5px" }} /> Departamento</th>
          </tr>
        </thead>
        <tbody>
          {contactos.length > 0 ? (
            contactos.map((contacto, index) => (
              <FilaContactos key={index} contacto={contacto} />
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                No se encontraron resultados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TablaContactos;
