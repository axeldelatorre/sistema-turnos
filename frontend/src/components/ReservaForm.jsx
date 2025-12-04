import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function ReservaForm() {
  const [recursos, setRecursos] = useState([]); // Lista de barberos/canchas
  const [loading, setLoading] = useState(false);


  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    fecha: '',
    hora: '',
    recursoId: '' // Aca guardaremos el ID del recurso seleccionado
  });

  // Aca cargaremos los recursos al iniciar
  useEffect(() => {
    fetchRecursos();
  }, []);
  async function fetchRecursos() {
    const { data, error } = await supabase
      .from('recurso')
      .select('*')
      .eq('activo', true);

    if (error) {
      console.error('Error cargando recursos:', error);
    } else {
      setRecursos(data); // Guardamos los datos en el estado
    }
  }

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Lógica de envío
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //  BUSCAR O CREAR CLIENTE
      let clienteId;
      
      // Buscamos si ya existe por teléfono
      const { data: clienteExistente } = await supabase
        .from('cliente')
        .select('id_cliente')
        .eq('telefono', formData.telefono)
        .maybeSingle(); // maybeSingle devuelve null si no encuentra nada, en vez de error

      if (clienteExistente) {
        clienteId = clienteExistente.id_cliente;
      } else {
        // Si no existe, lo creamos
        const { data: nuevoCliente, error: errorCliente } = await supabase
          .from('cliente')
          .insert([{ 
            nombre: formData.nombre, 
            apellido: formData.apellido, 
            telefono: formData.telefono 
          }])
          .select()
          .single();

        if (errorCliente) throw errorCliente;
        clienteId = nuevoCliente.id_cliente;
      }

      // VALIDAR DISPONIBILIDAD (Evitar doble turno)
      const { data: turnoOcupado } = await supabase
        .from('cita')
        .select('id_cita')
        .eq('fecha', formData.fecha)
        .eq('hora', formData.hora + ':00') // Aseguramos formato HH:MM:00
        .eq('id_recurso', formData.recursoId)
        .maybeSingle();

      if (turnoOcupado) {
        alert("Ese horario ya está reservado. Por favor elige otro.");
        setLoading(false);
        return; // Detenemos la función aca
      }

      // CREAR LA CITA
      const { error: errorCita } = await supabase
        .from('cita')
        .insert([{
          fecha: formData.fecha,
          hora: formData.hora,
          duracion: 30, // Duración fija por ahora (30 min)
          id_cliente: clienteId,
          id_recurso: formData.recursoId,
          estado: 'pendiente'
        }]);

      if (errorCita) throw errorCita;

      alert("✅ ¡Turno reservado con éxito!");
      
      // Opcional: Limpiar formulario aca
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl items-center text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Reservar Turno</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white-700">Selecciona el Profesional/Cancha</label>
          <select
            name="recursoId" 
            onChange={handleChange} 
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-white-700"
          >
            <option value="" className='text-zinc-50'>-- Seleccionar --</option>
            {recursos.map((recurso) => (
              <option key={recurso.id_recurso} value={recurso.id_recurso} className="bg-gray-800 text-white-700">
                {recurso.nombre} ({recurso.tipo})
              </option>
            ))}
          </select>
        </div>

        {/* Datos del Cliente */}
        <input 
          type="text" name="nombre" placeholder="Tu Nombre" required onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-white-700"
        />
        <input 
          type="text" name="apellido" placeholder="Tu Apellido" required onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
        <input 
          type="tel" name="telefono" placeholder="WhatsApp (Ej: 2974912345)" required onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md text-white-700"
        />

        {/* Fecha y Hora */}
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl items-center text-center place-items-center flex gap-4">
          <div className="w-1/2">
            <label className="block text-sm">Fecha</label>
            <input type="date" name="fecha" required onChange={handleChange} className="w-full p-2 border rounded-md place-items-center"/>
          </div>
          <div className="w-1/2" items-center>
            <label className="block text-sm">Hora</label>
            <input type="time" name="hora" required onChange={handleChange} className="w-full p-2 border rounded-md place-items-center"/>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition center"
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </button>
      </form>
    </div>
  );
}