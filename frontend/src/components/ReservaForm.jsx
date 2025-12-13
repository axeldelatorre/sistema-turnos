import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { Calendar, Clock, User, Check } from "lucide-react";
import emailjs from "@emailjs/browser";

export function ReservaForm() {
  const [recursos, setRecursos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horariosOcupados, setHorariosOcupados] = useState([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "", // Estado para el email
    fecha: "",
    hora: "",
    recursoId: "",
  });

  // Cargar Recursos
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

  // Detectar cambios para buscar ocupados
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

  // Generador de Grilla
  const generarHorarios = () => {
    const horarios = [];
    let horaActual = 9;
    let minutoActual = 0;
    const horaCierre = 20;

    while (horaActual < horaCierre) {
      const horaStr = horaActual.toString().padStart(2, "0");
      const minStr = minutoActual.toString().padStart(2, "0");
      horarios.push(`${horaStr}:${minStr}`);

      minutoActual += 30;
      if (minutoActual === 60) {
        minutoActual = 0;
        horaActual += 1;
      }
    }
    return horarios;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (hora) => {
    setFormData({ ...formData, hora: hora });
  };

  // --- SUBMIT DEL FORMULARIO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.hora){ return toast.error("Por favor selecciona un horario.")};
    setLoading(true);

    try {
      // Lógica de Cliente (Buscar o Crear)
      let clienteId;
      const { data: clienteExistente } = await supabase
        .from("cliente")
        .select("id_cliente")
        .eq("telefono", formData.telefono)
        .maybeSingle();

      if (clienteExistente) {
        clienteId = clienteExistente.id_cliente;
      } else {
        // Ahora guardamos el EMAIL también en la base de datos
        const { data: nuevoCliente, error: errCliente } = await supabase
          .from("cliente")
          .insert([
            {
              nombre: formData.nombre,
              apellido: formData.apellido,
              telefono: formData.telefono,
              email: formData.email, // <--- Agregado
            },
          ])
          .select()
          .single();

        if (errCliente) throw errCliente;
        clienteId = nuevoCliente.id_cliente;
      }

      // Insertar Cita
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

      // Enviar Email (Solo si Supabase no falló)
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

        // Usamos el email que escribió el usuario para enviarle la confirmación
        email_destino: formData.email,
      };

      emailjs
        .send(
          "service_44tpq7j", //  ID de EmailJS
          "template_9j22lk8", //  ID de Template
          templateParams,
          "XmOJn_bh2AOTzG25g" //  Public Key
        )
        .then(
          (response) =>
            console.log("Email enviado", response.status, response.text),
          (err) => console.error("Fallo envío de email", err)
        );

      toast.success("✅ ¡Turno reservado con éxito!",{description:"Te hemos enviado un comprobante a tu correo."});

      // Opcional: Limpiar formulario
      setLoading(false);
      fetchHorariosOcupados();
    } catch (error) {
      console.error(error); // Bueno para debug
      toast.error("Ocurrio un error al reservar.",{description: error.message});
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
        {/* RECURSO */}
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
              className="w-full pl-10 p-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
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

        {/*CLIENTE */}
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
        <input
          type="tel"
          name="telefono"
          placeholder="Teléfono / WhatsApp"
          required
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border rounded-lg"
        />

        {/* Input de Email Agregado */}
        <input
          type="email"
          name="email"
          placeholder="Email (para enviarte el turno)"
          required
          onChange={handleChange}
          className="w-full p-2.5 bg-gray-50 border rounded-lg"
        />

        {/*FECHA */}
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

        {/*GRILLA HORARIA */}
        {formData.fecha && formData.recursoId && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Horarios Disponibles{" "}
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
            {horariosOcupados.length > 0 && (
              <p className="text-xs text-gray-400 mt-2">
                * Los horarios en gris ya están reservados.
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !formData.hora}
          className="w-full bg-blue-600 text-white p-3.5 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium shadow-lg shadow-blue-500/30"
        >
          {loading ? "Procesando..." : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}
