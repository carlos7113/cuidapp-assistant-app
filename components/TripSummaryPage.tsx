
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TripSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const [assistantName, setAssistantName] = useState('Tu asistente');

  useEffect(() => {
    const savedIdentity = localStorage.getItem('cuidapp_assistant_identity');
    if (savedIdentity) {
      setAssistantName(JSON.parse(savedIdentity).name);
    }
    
    // Limpieza de estado de viaje activo al llegar a esta pantalla
    return () => {
      localStorage.removeItem('cuidapp_active_trip');
    };
  }, []);

  return (
    <div className="h-screen w-full font-plus flex flex-col bg-white overflow-y-auto text-slate-900">
      <header className="p-12 bg-primary text-white rounded-b-[4rem] text-center space-y-4 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
           <span className="material-symbols-outlined text-[12rem]">verified</span>
        </div>
        <div className="size-24 bg-white/20 rounded-full flex items-center justify-center mx-auto border-4 border-white/30 mb-4 scale-110 animate-in zoom-in">
           <span className="material-symbols-outlined text-5xl font-bold">check_circle</span>
        </div>
        <h1 className="text-4xl font-black italic tracking-tighter">¡Llegada segura!</h1>
        <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.4em]">Protocolo de protección senior completado</p>
      </header>

      <main className="p-8 space-y-10 flex-1">
        <section className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 shadow-inner text-center space-y-8">
           <div className="space-y-2">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">Estado biométrico promediado</h2>
              <p className="text-xl font-bold italic text-secondary">Tu ritmo cardíaco se mantuvo estable (72 BPM)</p>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                 <span className="material-symbols-outlined text-primary text-3xl mb-2">favorite</span>
                 <p className="text-3xl font-black italic text-slate-900">72<span className="text-[10px] uppercase ml-1">bpm</span></p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ritmo cardíaco</p>
              </div>
              <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
                 <span className="material-symbols-outlined text-primary text-3xl mb-2">air</span>
                 <p className="text-3xl font-black italic text-slate-900">98<span className="text-[10px] uppercase ml-1">%</span></p>
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Oxigenación</p>
              </div>
           </div>
        </section>

        <section className="bg-white border border-slate-100 p-8 rounded-[3rem] shadow-xl flex flex-col items-center gap-6">
           <div className="text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tu asistente</p>
              <h3 className="text-2xl font-black italic">{assistantName}</h3>
           </div>
           <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} className="material-symbols-outlined text-primary text-3xl fill-1">star</span>
              ))}
           </div>
           <button 
             className="w-full bg-primary/5 text-primary py-4 rounded-2xl font-black italic text-sm border border-primary/10"
           >
              Calificar a {assistantName.split(' ')[0]}
           </button>
        </section>

        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-xl italic shadow-2xl shadow-primary/40 active:scale-95 transition-all mt-4 mb-8"
        >
          Volver al inicio
        </button>
      </main>
    </div>
  );
};

export default TripSummaryPage;
