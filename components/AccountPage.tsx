
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('cuidapp_role');
  
  const storedUserName = localStorage.getItem('cuidapp_user_name') || 'Usuario';
  const assistantData = JSON.parse(localStorage.getItem('cuidapp_assistant_identity') || '{"name": "Elena Martínez"}');

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const switchRole = () => {
    const newRole = role === 'assistant' ? 'senior' : 'assistant';
    
    // Si cambiamos a senior, verificamos integridad de viaje
    if (newRole === 'senior') {
      const activeTrip = localStorage.getItem('cuidapp_active_trip');
      if (!activeTrip) {
        // Obligatorio: si no hay viaje, vamos a la pantalla de selección de rol inicial
        localStorage.setItem('cuidapp_role', newRole);
        navigate('/');
        return;
      }
    }

    localStorage.setItem('cuidapp_role', newRole);
    navigate(newRole === 'assistant' ? '/assistant-home' : '/home');
  };

  return (
    <div className="font-plus pb-32 h-full overflow-y-auto bg-white text-dark-blue">
      <Header title="Mi perfil" />

      <main className="p-8 space-y-12">
        <div className="flex flex-col items-center">
          <div className="size-32 rounded-full border-8 border-primary/5 overflow-hidden shadow-2xl">
            <img 
              src={role === 'assistant' ? assistantData.photo || 'https://picsum.photos/seed/ast/400' : "https://picsum.photos/seed/user/400"} 
              className="w-full h-full object-cover" 
              alt="Foto de perfil" 
            />
          </div>
          <p className="text-3xl font-black mt-8 italic text-primary tracking-tighter">
            {role === 'assistant' ? assistantData.name : storedUserName}
          </p>
          <p className="text-xs font-bold text-slate-400 mt-2 italic uppercase tracking-widest">
            {role === 'assistant' ? 'Profesional certificado' : 'Nivel: Invitado'}
          </p>
        </div>

        <div className="space-y-6">
           <button onClick={switchRole} className="w-full p-6 flex items-center justify-between bg-slate-50 rounded-3xl border border-slate-100 group active:scale-95 transition-all">
              <div className="flex items-center gap-4">
                 <div className="size-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined font-bold">swap_horiz</span>
                 </div>
                 <span className="font-bold italic">Cambiar a modo {role === 'assistant' ? 'usuario' : 'asistente'}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300">chevron_right</span>
           </button>

           <button onClick={logout} className="w-full py-6 text-sos-red font-black italic flex items-center justify-center gap-3 bg-red-50 rounded-3xl border border-red-100 active:scale-95 transition-all">
              <span className="material-symbols-outlined">logout</span>
              Cerrar sesión
           </button>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
