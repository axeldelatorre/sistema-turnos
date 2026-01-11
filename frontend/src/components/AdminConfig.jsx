import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { toast } from "sonner";
import { Save, Clock } from "lucide-react";

export function AdminConfig() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);

  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  useEffect(() => {
    fetchHorarios();
  }, []);

  const fetchHorarios = async () => {
    const { data, error } = await supabase
      .from("horarios_laborales")
      .select("*")
      .order("dia_semana");

    if (error) toast.error("Error cargando horarios");
    else setHorarios(data);
  };

  const handleChange = (index, field, value) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index][field] = value;
    setHorarios(nuevosHorarios);
  };

  const handleSave = async (horario) => {
    setLoading(true);
    const { error } = await supabase
      .from("horarios_laborales")
      .update({
        apertura: horario.apertura,
        cierre: horario.cierre,
        activo: horario.activo,
      })
      .eq("id", horario.id);

    if (error) {
      toast.error("Error al guardar");
    } else {
      toast.success(`Horario de ${diasSemana[horario.dia_semana]} actualizado`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Clock className="text-blue-600" /> Configuración de Horarios
      </h2>

      <div className="space-y-4">
        {horarios.map((dia, index) => (
          <div
            key={dia.id}
            className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
          >
            {/* Nombre del Día y Switch Activo */}
            <div className="w-32 font-bold flex items-center gap-2">
              <input
                type="checkbox"
                checked={dia.activo}
                onChange={(e) =>
                  handleChange(index, "activo", e.target.checked)
                }
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className={!dia.activo ? "text-gray-400 line-through" : ""}>
                {diasSemana[dia.dia_semana]}
              </span>
            </div>

            {/* Inputs de Hora */}
            <div className="flex items-center gap-2">
              <input
                type="time"
                value={dia.apertura}
                disabled={!dia.activo}
                onChange={(e) =>
                  handleChange(index, "apertura", e.target.value)
                }
                className="p-2 border rounded disabled:bg-gray-100"
              />
              <span className="text-gray-500">-</span>
              <input
                type="time"
                value={dia.cierre}
                disabled={!dia.activo}
                onChange={(e) => handleChange(index, "cierre", e.target.value)}
                className="p-2 border rounded disabled:bg-gray-100"
              />
            </div>

            {/* Botón Guardar Individual */}
            <button
              onClick={() => handleSave(dia)}
              disabled={loading}
              className="ml-auto p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
              title="Guardar cambios de este día"
            >
              <Save size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
