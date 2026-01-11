import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
// 1. IMPORTACIONES CORREGIDAS (Para date-fns v3/v4)
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// 2. Configuración del idioma (Locales)
const locales = {
    es: es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const messages = {
    allDay: "Todo el día",
    previous: "Anterior",
    next: "Siguiente",
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    agenda: "Agenda",
    date: "Fecha",
    time: "Hora",
    event: "Evento",
    noEventsInRange: "No hay turnos en este rango",
};

export function AdminCalendar({ turnos }) {
    // 3. ESTADOS PARA CONTROLAR LA NAVEGACIÓN (Importante para que los botones funcionen)
    const [view, setView] = useState(Views.WEEK); // Vista inicial: Semana
    const [date, setDate] = useState(new Date()); // Fecha inicial: Hoy

    // 4. Transformación de datos
    const eventos = turnos.map((turno) => {
        const fechaHoraInicio = new Date(`${turno.fecha}T${turno.hora}`);
        const fechaHoraFin = new Date(fechaHoraInicio.getTime() + 30 * 60000);

        return {
            title: `${turno.cliente.nombre} (${turno.recurso.nombre})`,
            start: fechaHoraInicio,
            end: fechaHoraFin,
            estado: turno.estado,
        };
    });

    const eventStyleGetter = (event) => {
        let backgroundColor = "#FFBF00"; // Por defecto: amarillo (pendiente)
        if (event.estado === "confirmado") backgroundColor = "#10b981";
        if (event.estado === "cancelado") backgroundColor = "#ef4444";

        return {
            style: {
                backgroundColor,
                borderRadius: "5px",
                opacity: 0.8,
                color: "white",
                border: "0px",
                display: "block",
            },
        };
    };

    // 5. Configurar Horarios de Inicio/Fin del día (8am a 9pm)
    const minTime = new Date();
    minTime.setHours(8, 0, 0);

    const maxTime = new Date();
    maxTime.setHours(21, 0, 0);

    return (
        <div className="h-[600px] bg-white p-4 rounded-lg shadow">
            <Calendar
                localizer={localizer}
                events={eventos}
                // Control de Vista y Fecha (Para que los botones respondan)
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }} // Usa el 100% del contenedor padre
                messages={messages}
                culture="es"
                eventPropGetter={eventStyleGetter}
                // Configuraciones visuales
                min={minTime}
                max={maxTime}
                views={["month", "week", "day", "agenda"]} // Habilitar explícitamente las vistas
                popup // Para que si hay muchos eventos en el mes, salga un popup al verlos
                selectable
            />
        </div>
    );
}
