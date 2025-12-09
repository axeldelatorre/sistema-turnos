// src/pages/Servicios.jsx
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Scissors, User, Calendar } from 'lucide-react';

export function Servicios() {
  const servicios = [
    {
      id: 1,
      titulo: "Corte Clásico",
      precio: "$15.000",
      duracion: "30 min",
      img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&q=80", // Foto real de Unsplash
      desc: "El corte tradicional que nunca falla. Incluye lavado, corte con tijera/máquina y peinado final con productos premium.",
      incluye: ["Lavado capilar", "Corte a medida", "Peinado"]
    },
    {
      id: 2,
      titulo: "Barba & Perfilado",
      precio: "$10.000",
      duracion: "30 min",
      img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
      desc: "Ritual completo de barba. Toalla caliente para abrir poros, afeitado tradicional con navaja y aceites esenciales para hidratar.",
      incluye: ["Toalla caliente", "Perfilado con navaja", "Aceites esenciales"]
    },
    {
      id: 3,
      titulo: "Pack Completo",
      precio: "$22.000",
      duracion: "60 min",
      img: "https://images.unsplash.com/photo-1503951914875-befbb7470d6e?w=800&q=80",
      desc: "La experiencia definitiva. Combina nuestro corte clásico con el ritual de barba. Saldrás renovado.",
      incluye: ["Todo lo del Corte", "Todo lo de la Barba", "Bebida de cortesía"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simple */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition">
            <ArrowLeft />
          </Link>
          <h1 className="font-bold text-xl">Nuestros Servicios</h1>
        </div>
      </nav>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto p-6 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicios.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 group">
              
              {/* Imagen con efecto Zoom al pasar mouse */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.titulo} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{item.titulo}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    {item.precio}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {item.desc}
                </p>

                {/* Lista de características */}
                <ul className="space-y-2 mb-6">
                  {item.incluye.map((feat, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                      <Check size={16} className="text-green-500" /> {feat}
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/#reservar" 
                  className="block w-full text-center bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Reservar este servicio
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}