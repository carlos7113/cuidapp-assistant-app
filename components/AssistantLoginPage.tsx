import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const assistants = [
        {
            id: 'asistente_001',
            name: 'Elena Martínez',
            photo: 'https://picsum.photos/seed/elena/200',
            role: 'Asistente verificado',
            rating: 5.0,
            status: 'Disponible'
        },
        {
            id: 'asistente_002',
            name: 'Ricardo Gómez',
            photo: 'https://picsum.photos/seed/ricardo/200',
            role: 'Asistente verificado',
            rating: 4.8,
            status: 'En servicio'
        }
    ];

    const handleSelectAssistant = (assistant: any) => {
        setIsLoading(true);
        // Simular login y guardado de identidad
        setTimeout(() => {
            localStorage.setItem('cuidapp_assistant_identity', JSON.stringify({
                name: assistant.name,
                photo: assistant.photo,
                role: assistant.role,
                rating: assistant.rating
            }));
            localStorage.setItem('cuidapp_active_assistant_id', assistant.id);
            localStorage.setItem('cuidapp_role', 'assistant');
            localStorage.setItem('cuidapp_status', 'active');
            
            navigate('/assistant-home');
        }, 800);
    };

    return (
        <div className="flex-1 bg-white font-plus flex flex-col p-8 overflow-y-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter text-primary mb-2">Acceso Asistente</h1>
                <p className="text-slate-500 font-bold italic text-lg leading-tight uppercase tracking-widest">Selecciona tu perfil</p>
            </div>

            <div className="space-y-6">
                {assistants.map((assistant) => (
                    <button
                        key={assistant.id}
                        onClick={() => handleSelectAssistant(assistant)}
                        disabled={isLoading}
                        className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[2rem] flex items-center gap-5 active:scale-95 transition-all text-left shadow-sm hover:border-primary/30"
                    >
                        <div className="relative">
                            <img 
                                src={assistant.photo} 
                                alt={assistant.name} 
                                className="size-16 rounded-2xl object-cover"
                            />
                            <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ${assistant.status === 'Disponible' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black text-xl text-primary leading-none mb-1">{assistant.name}</h3>
                            <div className="flex items-center gap-1 mb-1">
                                <span className="material-symbols-outlined text-sm text-yellow-500 fill-1">star</span>
                                <span className="text-xs font-bold text-slate-400">{assistant.rating} • {assistant.role}</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                    </button>
                ))}
            </div>

            <div className="mt-auto py-12 flex flex-col items-center gap-4">
                <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
                    <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-widest">¿Nuevo asistente?</p>
                    <button 
                        className="text-primary font-black italic text-lg hover:underline"
                        onClick={() => alert("Contacta con soporte para registrarte como asistente.")}
                    >
                        Postularme al equipo
                    </button>
                </div>
                <p className="text-[10px] font-bold text-slate-300 tracking-[0.2em] uppercase">Cuidapp+ Corporate v2.7</p>
            </div>

            {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-center items-center justify-center">
                    <div className="animate-spin size-12 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            )}
        </div>
    );
};

export default AssistantLoginPage;
