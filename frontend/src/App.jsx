// src/App.jsx
import {Toaster} from 'sonner';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
// import { Servicios } from './pages/Servicios';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" richColors />
      <Routes>
        {/* Ruta Pública: La Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta de Acceso: El Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta Privada: La Agenda */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Ruta Privada: Los Servicios */}
        {/* <Route path="/servicios" element={<Servicios />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;