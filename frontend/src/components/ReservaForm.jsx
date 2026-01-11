import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { Calendar, User } from "lucide-react"; 
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

export function ReservaForm() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  // Estado para guardar la regla de horario del día seleccionado
  const [configuracionDia, setConfiguracionDia] = useState(null);
  const [localLoading, setLocalLoading] = useState(false); // Para mostrar carga al elegir fecha

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    recursoId: "",
  });

  // 1. Cargar Recursos
  useEffect(() => {
    const fetchRecursos = async () => {
      const { data } = await supabase
        .from("recurso")
        .select("*")
        .eq("activo", true);
      setRecursos(data || []);
    };
    fetchRecursos();
  }, []);

  // 2. Cuando cambia la FECHA, buscamos la configuración de ese día
  useEffect(() => {
    if (formData.fecha) {
      fetchConfiguracionDia(formData.fecha);
    }
  }, [formData.fecha]);

  const fetchConfiguracionDia = async (fechaStr) => {
    setLocalLoading(true);
    setFormData((prev) => ({ ...prev, hora: "" })); // Reseteamos la hora seleccionada

    // Convertimos fecha string a objeto Date para saber el día de la semana (0-6)
    // Agregamos 'T00:00' para evitar problemas de zona horaria al obtener el día
    const dateObj = new Date(fechaStr + "T00:00:00");
    const diaSemana = dateObj.getDay(); // 0 = Domingo, 1 = Lunes...

    const { data, error } = await supabase
      .from("horarios_laborales")
      .select("*")
      .eq("dia_semana", diaSemana)
      .single();

    if (error) {
      console.error("Error buscando horario:", error);
      toast.error("No pudimos verificar el horario de apertura.");
    } else {
      setConfiguracionDia(data);
    }
    setLocalLoading(false);
  };

  // 3. Buscar horarios OCUPADOS (Igual que antes)
  useEffect(() => {
    if (formData.fecha && formData.recursoId) {
      fetchHorariosOcupados();
    } else {
      setHorariosOcupados([]);
    }
  }, [formData.fecha, formData.recursoId]);

  const fetchHorariosOcupados = async () => {
    const { data } = await supabase
      .from("cita")
      .select("hora")
      .eq("fecha", formData.fecha)
      .eq("id_recurso", formData.recursoId)
      .neq("estado", "cancelado");

    if (data) {
      const horas = data.map((cita) => cita.hora.substring(0, 5));
      setHorariosOcupados(horas);
    }
  };

  // 4. NUEVO: Generador Dinámico basado en BD
  const generarHorarios = () => {
    if (!configuracionDia || !configuracionDia.activo) return [];

    const horarios = [];

    // Parseamos hora apertura (ej: "09:00:00" -> 9)
    const [inicioHora, inicioMin] = configuracionDia.apertura
      .split(":")
      .map(Number);
    // Parseamos hora cierre (ej: "20:00:00" -> 20)
    const [finHora, finMin] = configuracionDia.cierre.split(":").map(Number);

    let horaActual = inicioHora;
    let minutoActual = inicioMin;

    // Convertimos todo a minutos para comparar fácil en el loop
    // Ejemplo: 9:00 = 540 minutos
    let minutosActuales = horaActual * 60 + minutoActual;
    const minutosCierre = finHora * 60 + finMin;

    while (minutosActuales < minutosCierre) {
      // Reconvertir minutos a HH:MM
      const h = Math.floor(minutosActuales / 60);
      const m = minutosActuales % 60;

      const horaStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");

      horarios.push(`${horaStr}:${minStr}`);

      // Sumar 30 minutos
      minutosActuales += 30;
    }
    return horarios;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (hora) => {
    setFormData({ ...formData, hora: hora });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hora) return toast.error("Por favor selecciona un horario.");
    setLoading(true);

    try {
      // A. Cliente
      let clienteId;
      const { data: clienteExistente } = await supabase
        .from("cliente")
        .select("id_cliente")
        .eq("telefono", formData.telefono)
        .maybeSingle();

      if (clienteExistente) {
        clienteId = clienteExistente.id_cliente;
      } else {
        const { data: nuevoCliente, error: errCliente } = await supabase
          .from("cliente")
          .insert([
            {
              nombre: formData.nombre,
              apellido: formData.apellido,
              telefono: formData.telefono,
              email: formData.email,
            },
          ])
          .select()
          .single();
        if (errCliente) throw errCliente;
        clienteId = nuevoCliente.id_cliente;
      }

      // B. Cita
      const { error } = await supabase.from("cita").insert([
        {
          fecha: formData.fecha,
          hora: formData.hora,
          duracion: 30,
          id_cliente: clienteId,
          id_recurso: formData.recursoId,
          estado: "pendiente",
        },
      ]);

      if (error) throw error;

      // C. Email
      const recursoEncontrado = recursos.find(
        (r) => r.id_recurso == formData.recursoId
      );
      const nombreDelRecurso = recursoEncontrado
        ? recursoEncontrado.nombre
        : "Profesional";

      const templateParams = {
        nombre_cliente: formData.nombre,
        fecha: formData.fecha,
        hora: formData.hora,
        nombre_recurso: nombreDelRecurso,
        company_name: import.meta.env.VITE_COMPANY_NAME || "Estilo & Corte",
        email_destino: formData.email,
      };

      emailjs
        .send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(
          () => console.log("📧 Email enviado"),
          (err) => console.error("❌ Fallo envío email", err)
        );

      toast.success("¡Turno reservado con éxito!", {
        description: "Te esperamos.",
      });
      setLoading(false);
      setFormData({ ...formData, hora: "" }); // Limpiar hora
      fetchHorariosOcupados();
    } catch (error) {
      console.error(error);
      toast.error("Error al reservar: " + error.message);
      setLoading(false);
    }
  };

  const esHorarioPasado = (horaStr) => {
    const hoy = new Date();
    const fechaSeleccionada = new Date(formData.fecha + "T00:00:00");
    if (fechaSeleccionada.toDateString() !== hoy.toDateString()) return false;
    const [horas, minutos] = horaStr.split(":").map(Number);
    const ahora = new Date();
    const fechaSlot = new Date();
    fechaSlot.setHours(horas, minutos, 0);
    return fechaSlot < ahora;
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Calendar className="text-blue-600" /> Nueva Reserva
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Recurso */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Profesional
          </label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={18} />
            <select
              name="recursoId"
              onChange={handleChange}
              required
              className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Seleccionar --</option>
              {recursos.map((r) => (
                <option key={r.id_recurso} value={r.id_recurso}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cliente */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            onChange={handleChange}
            className="p-2.5 bg-gray-50 border rounded-lg"
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            required
            onChange={handleChange}
            className="p-2.5 bg-gray-50 border rounded-lg"
          />
        </div>
        {/* <input
          type="tel"
          name="telefono"
          placeholder="Teléfono / WhatsApp"
          required
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border rounded-lg"
        /> */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border rounded-lg"
        />

        {/* Fecha */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha del turno
          </label>
          <input
            type="date"
            name="fecha"
            min={new Date().toISOString().split("T")[0]}
            required
            onChange={handleChange}
            className="w-full p-2.5 bg-gray-50 border rounded-lg"
          />
        </div>

        {/* GRILLA INTELIGENTE */}
        {formData.fecha && formData.recursoId && (
          <div className="animate-fade-in">
            {localLoading ? (
              <p className="text-sm text-gray-500">Consultando horarios...</p>
            ) : configuracionDia && !configuracionDia.activo ? (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium">
                ⛔ Lo sentimos, el local está cerrado este día.
              </div>
            ) : (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horarios Disponibles (
                  {configuracionDia?.apertura?.slice(0, 5)} -{" "}
                  {configuracionDia?.cierre?.slice(0, 5)})
                  {formData.hora && (
                    <span className="text-blue-600 font-bold ml-2">
                      Seleccionado: {formData.hora}hs
                    </span>
                  )}
                </label>

                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {generarHorarios().map((hora) => {
                    const ocupado = horariosOcupados.includes(hora);
                    const pasado = esHorarioPasado(hora);
                    const deshabilitado = ocupado || pasado;
                    const seleccionado = formData.hora === hora;

                    return (
                      <button
                        key={hora}
                        type="button"
                        disabled={deshabilitado}
                        onClick={() => handleTimeSelect(hora)}
                        className={`
                          py-2 px-1 text-sm rounded-md transition border
                          ${
                            deshabilitado
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-transparent"
                              : seleccionado
                              ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-200"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"
                          }
                        `}
                      >
                        {hora}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.hora}
          className="w-full bg-blue-600 text-white p-3.5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium shadow-lg"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}
