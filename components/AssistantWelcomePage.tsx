import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantWelcomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 bg-white font-plus flex flex-col p-8 items-center justify-center text-center overflow-hidden relative">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>
            
            <div className="mb-14 relative z-10">
                {/* Logo Section */}
                <div className="size-20 bg-primary rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6 transform hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-outlined text-4xl text-white fill-1">shield_with_heart</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter text-primary mb-2">Cuidapp+</h1>
                <p className="text-secondary font-bold italic text-lg leading-tight uppercase tracking-[0.15em] opacity-60">Assistant App</p>
            </div>

            <div className="space-y-6 max-w-[300px] z-10">
                <p className="text-slate-500 font-bold italic text-base leading-tight max-w-[260px] mx-auto">
                    Gestiona acompañamientos, monitorea salud y genera bienestar en tiempo real.
                </p>
            </div>

            <div className="mt-16 w-full max-w-sm relative z-10 space-y-4 px-6 md:px-0">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-[#6C5CE7] text-white p-7 rounded-[2.5rem] shadow-xl shadow-primary/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
                >
                    <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">login</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[20px] font-black italic leading-none tracking-tight mb-1">Iniciar Sesión</p>
                        <p className="text-[13px] font-medium text-white/90 leading-tight">Acceso a red de asistentes.</p>
                    </div>
                </button>

                <button
                    onClick={() => navigate('/signup')}
                    className="w-full bg-[#A29BFE] text-white p-7 rounded-[2.5rem] shadow-xl shadow-indigo-500/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
                >
                    <div className="size-14 bg-white/20 rounded-2xl flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl font-bold">person_add</span>
                    </div>
                    <div className="flex flex-col justify-center">
                        <p className="text-[20px] font-black italic leading-none tracking-tight mb-1">Unirse al equipo</p>
                        <p className="text-[13px] font-medium text-white/90 leading-tight">Postularme como nuevo asistente.</p>
                    </div>
                </button>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30">
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Cuidapp+ Partner v1.0 • 2026</p>
                <div className="h-1 w-12 bg-primary/30 rounded-full"></div>
            </div>
        </div>
    );
};

export default AssistantWelcomePage;
