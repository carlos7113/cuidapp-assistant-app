import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantWelcomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 bg-brand-bg font-sans flex flex-col px-6 pt-12 items-center justify-center text-center overflow-y-auto relative">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-brand-lila/5 to-transparent"></div>
            
            <div className="mb-14 relative z-10">
                {/* Logo Section */}
                <div className="size-20 bg-brand-lila rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-brand-lila/20 mx-auto mb-6 transform hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-outlined text-4xl text-white fill-1">shield_with_heart</span>
                </div>
                <h1 className="text-4xl font-logo text-brand-lila font-bold italic tracking-tighter mb-2">Cuidapp+</h1>
                <p className="text-[10px] tracking-[0.3em] uppercase text-slate-400 font-black italic mt-1 mb-8">Assistant App</p>
            </div>

            <div className="z-10">
                <p className="text-slate-500 font-bold italic text-base leading-tight max-w-[260px] mx-auto mb-12">
                    Gestiona acompañamientos, monitorea salud y genera bienestar en tiempo real.
                </p>
            </div>

            <div className="w-full max-w-sm relative z-10 space-y-4">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-brand-lila text-white p-7 py-8 rounded-button shadow-xl shadow-brand-lila/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
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
                    className="w-full bg-brand-lila/80 text-white p-7 py-8 rounded-button shadow-xl shadow-brand-lila/10 active:scale-[0.97] transition-all group text-left flex items-center gap-5 border-none italic"
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

            <div className="mt-16 pb-12 flex flex-col items-center gap-2 opacity-30">
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Cuidapp+ Partner v1.0 • 2026</p>
                <div className="h-1 w-12 bg-brand-lila/30 rounded-full"></div>
            </div>
        </div>
    );
};

export default AssistantWelcomePage;
