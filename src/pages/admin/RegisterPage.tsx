import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../supabaseClient';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // The check for a single admin has been removed as it cannot be securely performed from the client-side.
    // Supabase will still prevent registration if the email already exists.
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.includes('User already registered')) {
        toast.error('Este email ya está registrado. Por favor, inicia sesión.');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('¡Administrador registrado! Por favor, revisa tu email para confirmar y luego inicia sesión.');
      navigate('/admin/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-quicksand">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-cyan-300">Registrar Administrador</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mt-1 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none"/>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Contraseña</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 mt-1 bg-gray-700 rounded-lg border-2 border-transparent focus:border-cyan-400 focus:outline-none"/>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors disabled:bg-gray-600">
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>
        <p className="text-center text-sm">¿Ya tienes una cuenta? <Link to="/admin/login" className="font-medium text-cyan-400 hover:underline">Inicia Sesión</Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
