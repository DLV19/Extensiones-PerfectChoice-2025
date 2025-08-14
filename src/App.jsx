import { useEffect, useMemo, useRef, useState } from "react";
import Buscador from "./componentes/buscador";
import TablaContactos from "./componentes/TablaContactos";
import FiltroDepartamento from "./componentes/filtrodepartamento";
import { motion } from "framer-motion";
import { Phone } from 'lucide-react';
import './App.css';

/* ───── Utils ───── */
const normalize = (v = "") =>
  v.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function App() {
  const [contactos, setContactos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const debouncedBusqueda = useDebouncedValue(busqueda, 300);

  const [departamento, setDepartamento] = useState("Todos");
  const [horaActual, setHoraActual] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const abortRef = useRef(null);

  /* 🕒 Reloj (1s) */
  useEffect(() => {
    const id = setInterval(() => setHoraActual(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const horaFormateada = useMemo(
    () => new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(horaActual),
    [horaActual]
  );
  const fechaFormateada = useMemo(
    () => new Intl.DateTimeFormat("es-MX", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    }).format(horaActual),
    [horaActual]
  );

  /* 📂 Cargar datos desde /contactos.json */
  useEffect(() => {
    setLoading(true);
    setError("");
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    fetch("/contactos.json", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setContactos(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== "AbortError") setError("No se pudieron cargar los contactos.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  /* 🌗 Modo oscuro: preferencia sistema + persistencia */
  useEffect(() => {
    const saved = localStorage.getItem("modoOscuro");
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const initial = saved === null ? prefersDark : saved === "true";
    setIsDarkMode(initial);
    document.documentElement.classList.toggle("dark-theme", initial);

    // Si el usuario cambia el tema del sistema en vivo:
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const handler = (e) => {
      // Solo aplica si el usuario no ha elegido manualmente aún (saved === null)
      if (localStorage.getItem("modoOscuro") === null) {
        setIsDarkMode(e.matches);
        document.documentElement.classList.toggle("dark-theme", e.matches);
      }
    };
    mq?.addEventListener?.("change", handler);
    return () => mq?.removeEventListener?.("change", handler);
  }, []);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle("dark-theme", next);
    localStorage.setItem("modoOscuro", String(next));
  };

  /* 🧠 Derivar departamentos únicos (opcional pasar a FiltroDepartamento) */
  const departamentosUnicos = useMemo(() => {
    const set = new Set(contactos.map((c) => c.departamento).filter(Boolean));
    return ["Todos", ...Array.from(set).sort((a, b) => a.localeCompare(b, "es"))];
  }, [contactos]);

  /* 🔍 Filtrar (acento-insensible + debounce) */
  const contactosFiltrados = useMemo(() => {
    const q = normalize(debouncedBusqueda);
    return contactos.filter((c) => {
      const texto = normalize(Object.values(c).join(" "));
      const coincideTexto = q === "" || texto.includes(q);
      const coincideDepto = departamento === "Todos" || c.departamento === departamento;
      return coincideTexto && coincideDepto;
    });
  }, [contactos, debouncedBusqueda, departamento]);

  return (
    <motion.div
      className="contenedor"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* 🌓 Switch de tema */}
      <div style={{ textAlign: "right" }}>
        <button
          onClick={toggleTheme}
          aria-pressed={isDarkMode}
          style={{ marginBottom: 20 }}
          title="Cambiar tema"
        >
          {isDarkMode ? "☀️ Modo Claro" : "🌙 Modo Oscuro"}
        </button>
      </div>

      {/* 📋 Encabezado */}
      <nav className="navbar" aria-label="Barra de información">
        <div className="logo-container">
          <img src="/logo-perfectchoice.png" alt="Logo PerfectChoice" />
        </div>

        <div className="center-info" role="group" aria-label="Fecha y hora">
          <p>{fechaFormateada}</p>
          <p>{horaFormateada}</p>
        </div>

        <div className="phone-info" role="contentinfo" aria-label="Contacto">
          <span>Campus Perfect Choice</span><br />
          <strong><Phone size={16} style={{ verticalAlign: "text-bottom" }} /> 33-32-83-15-00</strong>
        </div>
      </nav>

      {/* 🎛️ Filtros */}
      <Buscador busqueda={busqueda} setBusqueda={setBusqueda} />
      <FiltroDepartamento
        departamento={departamento}
        setDepartamento={setDepartamento}
        departamentos={departamentosUnicos} // <- soporta opciones si tu componente lo admite
      />

      {/* 📊 Contenido */}
      {loading ? (
        <p style={{ marginTop: 20 }}>Cargando contactos…</p>
      ) : error ? (
        <p style={{ marginTop: 20, color: "tomato" }}>{error}</p>
      ) : contactosFiltrados.length === 0 ? (
        <p style={{ marginTop: 20 }}>Sin resultados. Válida el nombre o válida el departamento.</p>
      ) : (
        <TablaContactos contactos={contactosFiltrados} />
      )}

      {/* 📈 Contador */}
      {!loading && !error && (
        <p style={{ textAlign: "right", marginTop: 10, fontStyle: "italic" }}>
          Resultados encontrados: {contactosFiltrados.length}
        </p>
      )}

      {/* 🧱 Footer */}
      <footer
        style={{
          textAlign: "center",
          marginTop: 40,
          padding: 20,
          fontSize: 14,
          color: "var(--muted-foreground, #aaa)",
          borderTop: "1px solid var(--border, #333)",
        }}
      >
        PerfectChoice © 2025 - Av. Magallanes No. 1155, Col, 45600 Santa Anita, Jal.<br />
        ¿Tienes problemas? Repórtalos a las extensiones 1712 o 1713.<br />
        Powered by DLV ⚛️⚡
      </footer>
    </motion.div>
  );
}

export default App;
