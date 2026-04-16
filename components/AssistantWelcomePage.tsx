import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantWelcomePage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="flex-1 bg-white font-plus flex flex-col px-6 py-8 items-center justify-center text-center overflow-hidden relative">
            {/* Background design accents */}
            <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-primary/5 to-transparent"></div>
            
            <div className="mb-14 relative z-10">
                {/* Logo Section */}
                <div className="size-20 bg-primary rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6 transform hover:scale-105 transition-transform duration-500">
                    <span className="material-symbols-outlined text-4xl text-white fill-1">shield_with_heart</span>
                </div>
                <h1 className="text-4xl font-black italic tracking-tighter text-primary mb-2">Cuidapp+</h1>
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
                    className="w-full py-8 rounded-[2.5rem] bg-[#7C3AED] text-white font-black italic text-xl shadow-xl shadow-primary/20 active:scale-[0.97] transition-all"
                >
                    Iniciar Sesión
                </button>

                <button
                    onClick={() => navigate('/signup')}
                    className="w-full py-8 rounded-[2.5rem] bg-[#7C3AED]/10 text-[#7C3AED] font-black italic text-xl shadow-sm active:scale-[0.97] transition-all"
                >
                    Unirse al equipo
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
