import { useEffect, useState } from "react";
import Buscador from "./componentes/buscador";
import TablaContactos from "./componentes/TablaContactos";
import FiltroDepartamento from "./componentes/filtrodepartamento";
import { motion } from "framer-motion";
import { User, Phone, Mail, Smartphone, Building } from 'lucide-react';
import './App.css';

function App() {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [departamento, setDepartamento] = useState("Todos");
  const [horaActual, setHoraActual] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false); // 🔥 Estado del tema

  // 🕒 Actualizar hora cada segundo
  useEffect(() => {
    const intervalo = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(intervalo);
  }, []);

  const horaFormateada = horaActual.toLocaleTimeString();
  const fechaFormateada = horaActual.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // 📂 Cargar datos desde contactos.json
  useEffect(() => {
    fetch("/contactos.json")
      .then((response) => response.json())
      .then((data) => setContactos(data))
      .catch((error) => console.error("Error cargando contactos:", error));
  }, []);

  // 🌗 Recuperar modo oscuro si estaba activado
  useEffect(() => {
    const modoGuardado = localStorage.getItem("modoOscuro") === "true";
    setIsDarkMode(modoGuardado);
    if (modoGuardado) {
      document.body.classList.add("dark-theme");
    }
  }, []);

  // 🌓 Toggle de tema
  const toggleTheme = () => {
    const nuevoModo = !isDarkMode;
    setIsDarkMode(nuevoModo);
    if (nuevoModo) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("modoOscuro", nuevoModo);
  };

  // 🔍 Filtrar contactos según búsqueda y departamento
  const contactosFiltrados = contactos.filter((contacto) => {
    const coincideTexto = Object.values(contacto)
      .join(" ")
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideDepartamento =
      departamento === "Todos" || contacto.departamento === departamento;

    return coincideTexto && coincideDepartamento;
  });

  return (
    <motion.div 
      className="contenedor"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 🌓 Botón para cambiar tema */}
      <div style={{ textAlign: "right" }}>
        <button onClick={toggleTheme} style={{ marginBottom: "20px" }}>
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
      </div>

      
      {/* 📋 Encabezado */}
      <nav className="navbar">
  <div className="logo-container">
    <img src="/logo-perfectchoice.png" alt="Logo PerfectChoice" />
  </div>

  <div className="center-info">
    <p>{fechaFormateada}</p>
    <p>{horaFormateada}</p>
  </div>

  <div className="phone-info">
    <span>CAMPUS ☎️</span><br />
    <strong>33-32-83-15-00</strong>
  </div>
</nav>



      {/* 🎛️ Filtros */}
      <FiltroDepartamento
        departamento={departamento}
        setDepartamento={setDepartamento}
      />
      <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />

      {/* 📊 Tabla de resultados */}
      <TablaContactos contactos={contactosFiltrados} />

      {/* 📈 Contador de resultados */}
      <p
        style={{
          textAlign: "right",
          marginTop: "10px",
          fontStyle: "italic",
        }}
      >
        Resultados encontrados: {contactosFiltrados.length}
      </p>

      {/* 🧱 Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: "40px",
          padding: "20px",
          fontSize: "14px",
          color: "#aaa",
          borderTop: "1px solid #333",
        }}
      >
        PerfectChoice © 2025 - Todos los derechos reservados<br /> 
        ¿Tienes problemas, repórtalos a las extensiones 1712 o 1713?<br/>
        Powered by DLV ⚛️⚡
      </footer>
    </motion.div>
  );
}

export default App;
