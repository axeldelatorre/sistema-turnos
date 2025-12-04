// src/pages/Login.jsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      // Si el login es correcto, llévame al Dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative">
      
      {/* 3. BOTÓN DE VOLVER (Posicionado arriba a la izquierda) */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition font-medium"
      >
        <ArrowLeft size={20} />
        Volver al Inicio
      </Link>
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Acceso Admin</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-2 border rounded"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="w-full p-2 border rounded"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}