import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const AssistantLoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [assistants, setAssistants] = useState<any[]>([]);

    useEffect(() => {
        fetchAssistants();
    }, []);

    const fetchAssistants = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('role', 'assistant')
                .order('full_name', { ascending: true });

            if (error) throw error;

            if (data) {
                // Adapt Supabase data to our component's expected structure
                const formattedData = data.map(profile => ({
                    id: profile.id,
                    name: profile.full_name || 'Asistente',
                    photo: profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || 'A')}&background=6C5CE7&color=fff`,
                    role: 'Asistente verificado',
                    rating: 5.0, // Default rating if not in DB
                    status: 'Disponible'
                }));
                setAssistants(formattedData);
            }
        } catch (error) {
            console.error('Error fetching assistants:', error);
            // Default empty state or fallback could go here
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAssistant = (assistant: any) => {
        setIsLoading(true);
        // Save identity to localStorage as requested
        localStorage.setItem('cuidapp_assistant_identity', JSON.stringify({
            name: assistant.name,
            photo: assistant.photo,
            role: assistant.role,
            rating: assistant.rating
        }));
        localStorage.setItem('cuidapp_active_assistant_id', assistant.id);
        localStorage.setItem('cuidapp_role', 'assistant');
        localStorage.setItem('cuidapp_status', 'active');
        
        // Brief delay for UX feel
        setTimeout(() => {
            navigate('/assistant-home');
        }, 600);
    };

    return (
        <div className="flex-1 bg-white font-plus flex flex-col p-8 overflow-y-auto relative">
            <div className="mb-12">
                <h1 className="text-4xl font-black italic tracking-tighter text-primary mb-2">Acceso Asistente</h1>
                <p className="text-slate-500 font-bold italic text-sm leading-tight uppercase tracking-[0.2em]">Selecciona tu perfil de la red</p>
            </div>

            {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin size-10 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-xs font-bold text-primary italic uppercase tracking-widest animate-pulse">Sincronizando red...</p>
                </div>
            ) : assistants.length > 0 ? (
                <div className="space-y-6">
                    {assistants.map((assistant) => (
                        <button
                            key={assistant.id}
                            onClick={() => handleSelectAssistant(assistant)}
                            className="w-full bg-slate-50 border-2 border-slate-100 p-6 rounded-[2.5rem] flex items-center gap-5 active:scale-95 transition-all text-left shadow-sm hover:border-primary/30 group"
                        >
                            <div className="relative">
                                <img 
                                    src={assistant.photo} 
                                    alt={assistant.name} 
                                    className="size-16 rounded-[1.5rem] object-cover shadow-lg group-hover:rotate-3 transition-transform"
                                />
                                <div className="absolute -bottom-1 -right-1 size-5 rounded-full border-4 border-white bg-green-500 shadow-sm"></div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black text-xl text-primary leading-none mb-1">{assistant.name}</h3>
                                <div className="flex items-center gap-1.5 opacity-60">
                                    <span className="material-symbols-outlined text-sm text-yellow-500 fill-1">star</span>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{assistant.role}</span>
                                </div>
                            </div>
                            <div className="size-10 bg-white rounded-2xl flex items-center justify-center text-primary/30 group-hover:text-primary transition-colors">
                                <span className="material-symbols-outlined font-bold">arrow_forward</span>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-10 space-y-4">
                    <div className="size-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                        <span className="material-symbols-outlined text-5xl">person_off</span>
                    </div>
                    <p className="text-slate-400 font-bold text-sm italic">No se encontraron asistentes activos en la base de datos.</p>
                </div>
            )}

            <div className="mt-auto pt-16 pb-8 flex flex-col items-center gap-6">
                <div className="bg-primary/5 p-8 rounded-[2.5rem] border border-primary/10 text-center w-full max-w-[320px]">
                    <p className="text-[10px] font-black text-primary/40 mb-3 uppercase tracking-[0.25em]">Portal de Colaboradores</p>
                    <button 
                        className="text-primary font-black italic text-lg hover:underline decoration-2 underline-offset-8"
                        onClick={() => alert("Contacta con la administración central de Cuidapp+ para registro.")}
                    >
                        Solicitar alta en red
                    </button>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-[9px] font-black text-slate-300 tracking-[0.4em] uppercase">Cuidapp+ Cloud v2.1</p>
                    <div className="h-0.5 w-8 bg-slate-100 rounded-full"></div>
                </div>
            </div>
        </div>
    );
};

export default AssistantLoginPage;
