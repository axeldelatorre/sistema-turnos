import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar, Clock, MapPin, Scissors, User } from "lucide-react";
import { Link } from "react-router-dom";
import { ReservaForm } from "../components/ReservaForm";
// import { Servicios } from "./Servicios";
import { servicios } from "../data/servicios";

export function Home() {
    const { hash } = useLocation();
    useEffect(() => {
        if (hash) {
            // Buscamos el elemento por su ID (quitando el #)
            const element = document.getElementById(hash.replace("#", ""));
            if (element) {
                // Hacemos scroll suave hasta el elemento
                element.scrollIntoView({ behavior: "smooth" });
            }
        }
    }, [hash]);
    // const servicios = [
    //     {
    //         id: 1,
    //         titulo: "Corte Clásico",
    //         precio: "$15.000",
    //         img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800",
    //         desc: "Corte tradicional con tijera y máquina.",
    //         incluye: ["Lavado", "Peinado"],
    //     },
    //     {
    //         id: 2,
    //         titulo: "Corte Premium",
    //         precio: "$20.000",
    //         img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&q=80",
    //         desc: "Estilo contemporáneo y a la moda.",
    //         incluye: ["Lavado", "Peinado", "Asesoría de estilo"],
    //     },
    //     {
    //         id: 3,
    //         titulo: "Corte y Barba",
    //         precio: "$20.000",
    //         img: "https://images.unsplash.com/photo-1647140655214-e4a2d914971f?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         desc: "Corte clasico y afeitado tradicional con navaja.",
    //         incluye: ["Toalla caliente", "Aceite de barba"],
    //     },
    //     // ... resto de servicios
    // ];
    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            {/* 1. NAVBAR / HEADER */}
            <nav className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <Scissors className="h-8 w-8 text-blue-600" />
                            <span className="underline-animation font-bold text-xl text-gray-800">
                                <a href="#inicio"
                                    onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("inicio")
                                        .scrollIntoView({ behavior: "smooth" });
                                }}>
                                    Estilo & Corte
                                    </a>
                            </span>
                        </div>
                        <div className="hidden md:flex space-x-2 text-sm font-medium">
                            <a
                                href="#inicio"
                                className=" px-4 py-2 text-gray-500 hover:text-blue-600 transition border border-blue-600 rounded-full"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("inicio")
                                        .scrollIntoView({ behavior: "smooth" });
                                }}
                            >
                                Inicio
                            </a>
                            {/* <a className=" px-4 py-2 text-gray-500 hover:text-blue-600 transition border border-blue-600 rounded-full">
                                <Link to="/servicios">Servicios</Link>
                            </a> */}
                            <a
                                href="#reservar"
                                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("reservar")
                                        .scrollIntoView({ behavior: "smooth" });
                                }}
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
                {/* Grid de Servicios */}
                <div className="grid md:grid-cols-3 gap-8">
                    
                    {servicios.map((servicio) => (
                        <div
                            key={servicio.id}
                            className="group relative rounded-xl overflow-hidden shadow-lg h-80 cursor-pointer"
                        >
                            {/* 1. IMAGEN DE FONDO (Con zoom suave al pasar mouse) */}
                            <img
                                src={servicio.img}
                                alt={servicio.titulo}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* 2. CAPA OSCURA (Para que el texto se lea bien) */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                            {/* 3. CONTENIDO (Título y Precio siempre visibles, Descripción oculta) */}
                            <div className="absolute bottom-0 left-0 w-full p-6 text-white translate-y-[60px] group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                                {/* Encabezado: Título y Precio */}
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-bold">{servicio.titulo}</h3>
                                    <span className="bg-blue-600 px-2 py-1 rounded text-sm font-bold">
                                        {servicio.precio}
                                    </span>
                                </div>

                                {/* 4. LA DESCRIPCIÓN */}
                                {/* opacity-0: invisible por defecto
           group-hover:opacity-100: visible al pasar el mouse
           transition: para que aparezca suavemente
        */}
                                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                    {servicio.desc}
                                    <br />
                                    <span className="block mt-2 text-blue-400 font-medium text-xs uppercase tracking-wide">
                                        Incluye: {servicio.incluye.join(", ")}
                                    </span>
                                </p>

                                {/* Botón de acción (opcional) */}
                                <a href="#reservar"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document
                                        .getElementById("reservar")
                                        .scrollIntoView({ behavior: "smooth" });
                                }}>
                                    <button className="mt-4 w-full bg-white text-black py-2 rounded font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        Reservar ahora
                                    </button>
                                </a>
                            </div>
                        </div>
                    ))}
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
                    <ReservaForm />
                </div>
            </section>

            {/* 5. FOOTER */}
            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
                <p>© 2025 axeldelatorre. Todos los derechos reservados.</p>
                <Link to="/login" className="text-blue-500 hover:underline">
                    Área del Dueño
                </Link>
            </footer>
        </div>
    );
}

export default Home;
