import { Calendar, Clock, MapPin, Scissors, User } from "lucide-react";
import { Link } from 'react-router-dom';
import { ReservaForm } from "../components/ReservaForm";
export function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* 1. NAVBAR / HEADER */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Scissors className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl tracking-tight">
                Estilo & Corte
              </span>
            </div>
            <div className="flex gap-4 ">
               {/* Usamos Link en lugar de a href para no recargar la web */}
               <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition ">
                 Soy el Dueño (Login)
               </Link>
             </div>
            <div className="hidden md:flex space-x-8 text-sm font-medium">
              <a
                href="#inicio"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-gray-500 hover:text-blue-600 transition"
              >
                Servicios
              </a>
              <a
                href="#reservar"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
              >
                Reservar Ahora
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION (La portada) */}
      <header
        id="inicio"
        className="bg-gray-900 text-white py-20 px-4 text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Tu estilo, tu turno,
            <br /> <span className="text-blue-500">sin esperas.</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Reserva tu cita con los mejores profesionales de la ciudad en
            cuestión de segundos. Sin llamadas, sin complicaciones.
          </p>
          <div className="flex justify-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} /> Abierto 9am - 8pm
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} /> Centro de la Ciudad
            </div>
          </div>
        </div>
      </header>

      {/* 3. SECCIÓN DE SERVICIOS (Visual) */}
      <section id="servicios" className="py-16 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Nuestros Servicios
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Tarjeta 1 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <Scissors size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Corte Clásico</h3>
            <p className="text-gray-600">
              Estilo tradicional con tijera y máquina, acabado con navaja.
            </p>
          </div>
          {/* Tarjeta 2 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <User size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Barba & Perfilado</h3>
            <p className="text-gray-600">
              Tratamiento con toalla caliente y aceites esenciales.
            </p>
          </div>
          {/* Tarjeta 3 */}
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4 text-blue-600">
              <Calendar size={24} />
            </div>
            <h3 className="font-bold text-xl mb-2">Pack Completo</h3>
            <p className="text-gray-600">
              Corte + Barba + Masaje capilar. La experiencia total.
            </p>
          </div>
        </div>
      </section>

      {/* 4. ZONA DE RESERVA (Donde insertamos el formulario) */}
      <section id="reservar" className="bg-blue-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Agenda tu Cita</h2>
            <p className="text-gray-600 mt-2">
              Selecciona el profesional y el horario que prefieras.
            </p>
          </div>

          {/* AQUÍ RENDERIZAMOS TU FORMULARIO */}
          <ReservaForm />
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>© 2025 axeldelatorre. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}

export default Home;
