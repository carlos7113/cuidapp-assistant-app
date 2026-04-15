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
                <h2 className="text-2xl font-black text-slate-800 leading-tight italic">
                    Independencia para ellos, tranquilidad para ti.
                </h2>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">
                    Gestiona acompañamientos, monitorea salud y genera bienestar en tiempo real.
                </p>
            </div>

            <div className="mt-16 w-full max-w-[280px] z-10">
                <button
                    onClick={() => navigate('/login')}
                    className="w-full bg-primary text-white py-6 rounded-[2rem] font-black italic text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all group overflow-hidden relative"
                >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        Iniciar Sesión
                        <span className="material-symbols-outlined font-bold group-hover:translate-x-2 transition-transform">arrow_forward_ios</span>
                    </span>
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </button>
            </div>

            <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-30">
                <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase">Red de Acompañamiento</p>
                <div className="h-1 w-12 bg-primary/30 rounded-full"></div>
            </div>
        </div>
    );
};

export default AssistantWelcomePage;
