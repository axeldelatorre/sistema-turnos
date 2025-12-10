// src/pages/Dashboard.jsx
import {toast} from 'sonner';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.js"; // Asegúrate de la ruta correcta
import { LogOut, Calendar, CheckCircle, XCircle, Trash2 } from "lucide-react";

export function Dashboard() {
  const navigate = useNavigate();
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. VERIFICAR SESIÓN
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login"); // Si no hay sesión, fuera de aquí
      } else {
        fetchTurnos(); // Si hay sesión, carga los datos
      }
    };

    checkSession();
  }, [navigate]);

  // 2. CARGAR TURNOS
  const fetchTurnos = async () => {
    try {
      // Traemos citas y "unimos" (join) con la tabla cliente y recurso para saber nombres
      const { data, error } = await supabase
        .from("cita")
        .select(
          `
          id_cita,
          fecha,
          hora,
          estado,
          cliente ( nombre, apellido, telefono ),
          recurso ( nombre )
        `
        )
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });

      if (error) throw error;
      setTurnos(data);
    } catch (error) {
      alert("Error cargando turnos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. CERRAR SESIÓN
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) return <div className="p-10 text-center">Cargando panel...</div>;

  // FUNCIÓN 1: Actualizar Estado (Confirmar o Cancelar)
  const handleUpdateStatus = async (id, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from("cita")
        .update({ estado: nuevoEstado })
        .eq("id_cita", id);

      if (error) throw error;

      // Actualizamos la lista localmente para que se vea el cambio sin recargar
      setTurnos(
        turnos.map((turno) =>
          turno.id_cita === id ? { ...turno, estado: nuevoEstado } : turno
        )
      );
    } catch (error) {
      alert("Error actualizando: " + error.message);
    }
  };

  // FUNCIÓN 2: Eliminar Cita
  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar este turno?")) return;

    try {
      const { error } = await supabase.from("cita").delete().eq("id_cita", id);

      if (error) throw error;

      // Quitamos el turno de la lista local
      setTurnos(turnos.filter((turno) => turno.id_cita !== id));
      toast.success("Turno eliminado con éxito.");
    } catch (error) {
      toast.error("Error eliminando: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar del Dashboard */}
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl flex items-center gap-2">
          <Calendar className="text-blue-600" /> Panel de Control
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded transition"
        >
          <LogOut size={18} /> Cerrar Sesión
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Próximos Turnos</h2>

        {turnos.length === 0 ? (
          <p className="text-gray-500">No hay turnos registrados.</p>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="p-4">Fecha/Hora</th>
                  <th className="p-4">Cliente</th>
                  <th className="p-4">Recurso</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>{" "}
                  {/* <--- NUEVA COLUMNA */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {turnos.map((turno) => (
                  <tr key={turno.id_cita} className="hover:bg-gray-50">
                    <td className="p-4">
                      <div className="font-medium">{turno.fecha}</div>
                      <div className="text-sm text-gray-500">{turno.hora}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">
                        {turno.cliente.nombre} {turno.cliente.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        {turno.cliente.telefono}
                      </div>
                    </td>
                    <td className="p-4">{turno.recurso.nombre}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          turno.estado === "pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : ""
                        }
                        ${
                          turno.estado === "confirmado"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      `}
                      >
                        {turno.estado}
                      </span>
                      {/* <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ...`}
                      >
                        {turno.estado}
                      </span> */}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        {/* Botón Confirmar (Solo si está pendiente) */}
                        {turno.estado === "pendiente" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(turno.id_cita, "confirmado")
                            }
                            className="text-green-600 hover:text-green-800"
                            title="Confirmar Turno"
                          >
                            <CheckCircle size={20} />
                          </button>
                        )}

                        {/* Botón Cancelar (Si no está cancelado) */}
                        {turno.estado !== "cancelado" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(turno.id_cita, "cancelado")
                            }
                            className="text-yellow-600 hover:text-yellow-800"
                            title="Cancelar Turno"
                          >
                            <XCircle size={20} />
                          </button>
                        )}

                        {/* Botón Eliminar (Siempre visible) */}
                        <button
                          onClick={() => handleDelete(turno.id_cita)}
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar registro"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
