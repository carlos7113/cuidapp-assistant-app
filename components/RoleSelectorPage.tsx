
import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectorPage: React.FC = () => {
  const navigate = useNavigate();

  const selectRole = (role: 'senior' | 'assistant' | 'family') => {
    localStorage.setItem('cuidapp_role', role);
    if (role === 'assistant') {
      navigate('/assistant-home');
    } else if (role === 'senior' || role === 'family') {
      navigate('/login');
    }

  };

  return (
    <div className="h-screen w-full bg-white font-plus flex flex-col p-8 items-center justify-center text-center overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>

      <div className="mb-14 relative z-10">
        <div className="size-20 bg-primary rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6 animate-in fade-in zoom-in duration-700">
          <span className="material-symbols-outlined text-4xl text-white fill-1">shield_with_heart</span>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter text-primary mb-2">Cuidapp+</h1>
        <p className="text-slate-500 font-bold italic text-base leading-tight max-w-[260px] mx-auto">
          Independencia para ellos, tranquilidad para ti.
        </p>
      </div>

      <div className="w-full space-y-4 max-w-sm relative z-10">
        <button
          onClick={() => selectRole('senior')}
          className="w-full bg-[#6C5CE7] text-white p-7 rounded-[2.5rem] shadow-xl shadow-primary/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
        >
          <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-bold">elderly</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[20px] font-black italic leading-none tracking-tight mb-1">Usuario</p>
            <p className="text-[13px] font-medium text-white/90 leading-tight">Viaje seguro.</p>
          </div>
        </button>

        <button
          onClick={() => selectRole('family')}
          className="w-full bg-[#A29BFE] text-white p-7 rounded-[2.5rem] shadow-xl shadow-indigo-500/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
        >
          <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-bold">family_restroom</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[20px] font-black italic leading-none tracking-tight mb-1">Familiar responsable</p>
            <p className="text-[13px] font-medium text-white/90 leading-tight">Monitoreo y gestión.</p>
          </div>
        </button>

        <button
          onClick={() => selectRole('assistant')}
          className="w-full bg-[#0052CC] text-white p-7 rounded-[2.5rem] shadow-xl shadow-secondary/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
        >
          <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-3xl font-bold">local_taxi</span>
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[20px] font-black italic leading-none tracking-tight mb-1">Asistente de movilidad</p>
            <p className="text-[13px] font-medium text-white/90 leading-tight">Servicios y ganancias.</p>
          </div>
        </button>
      </div>

      <div className="mt-16 space-y-1 opacity-25">
        <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">Cuidapp+ v2.7 • 2026</p>
        <div className="h-1 w-12 bg-primary/30 mx-auto rounded-full mt-3"></div>
      </div>
    </div>
  );
};

export default RoleSelectorPage;
