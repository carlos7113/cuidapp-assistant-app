
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchingAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [dots, setDots] = useState('');

  useEffect(() => {
    // REGLA DE QA: Si ya hay un asistente, no hay búsqueda
    const currentAssistant = localStorage.getItem('cuidapp_assistant');
    if (currentAssistant) {
      const tripStr = localStorage.getItem('cuidapp_trip');
      if (tripStr) {
        const trip = JSON.parse(tripStr);
        if (trip.status === 'searching') {
          localStorage.setItem('cuidapp_trip', JSON.stringify({...trip, status: 'arriving'}));
        }
      }
      navigate('/active-trip');
      return;
    }

    const interval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '' : prev + '.'));
    }, 600);

    const timer = setTimeout(() => {
      const currentTripStr = localStorage.getItem('cuidapp_trip');
      if (currentTripStr) {
        const currentTrip = JSON.parse(currentTripStr);
        localStorage.setItem('cuidapp_trip', JSON.stringify({
          ...currentTrip,
          status: 'arriving'
        }));
      }
      navigate('/active-trip');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-white font-plus flex flex-col p-8 items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 grayscale">
         <img src="https://picsum.photos/seed/mapbg/800/1200" className="w-full h-full object-cover" alt="Mapa" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">
        <div className="relative size-56 flex items-center justify-center mb-12">
           <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
           <div className="absolute inset-4 bg-primary/10 rounded-full animate-pulse"></div>
           <div className="size-36 bg-primary rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
              <span className="material-symbols-outlined text-7xl text-white animate-bounce">local_taxi</span>
           </div>
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter text-secondary mb-6 leading-tight">
          Buscando asistentes cercanos{dots}
        </h1>
        
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-2 border-slate-50 space-y-8">
           <div className="flex items-center gap-5 text-left">
              <div className="size-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                 <span className="material-symbols-outlined text-2xl font-bold">verified_user</span>
              </div>
              <p className="text-sm font-bold text-slate-500 leading-snug italic">
                Localizando profesionales certificados disponibles ahora.
              </p>
           </div>
           
           <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
              <div className="h-full bg-primary rounded-full animate-[loading_4s_ease-in-out_infinite]" style={{width: '60%'}}></div>
           </div>

           <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] animate-pulse italic leading-none">
             Seguridad de transporte activa
           </p>
        </div>

        <button 
          onClick={() => { 
            const trip = JSON.parse(localStorage.getItem('cuidapp_trip') || '{}');
            localStorage.setItem('cuidapp_trip', JSON.stringify({...trip, status: 'idle'}));
            navigate('/home'); 
          }}
          className="mt-14 text-slate-400 font-black text-xs tracking-[0.3em] hover:text-sos-red transition-colors italic uppercase"
        >
          Cancelar búsqueda
        </button>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SearchingAssistantPage;
