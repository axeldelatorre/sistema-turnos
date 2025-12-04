// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: La Landing Page */}
        <Route path="/" element={<Home />} />
        
        {/* Ruta de Acceso: El Login */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta Privada: La Agenda */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;