
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);

  useEffect(() => {
    const sync = () => {
      const tripSaved = localStorage.getItem('cuidapp_active_trip');
      const memberSaved = localStorage.getItem('cuidapp_member_data');
      
      if (tripSaved) {
        const tripData = JSON.parse(tripSaved);
        setTrip(tripData);
        
        if (tripData.status === 'completed' || tripData.status === 'finished') {
          navigate('/trip-summary');
        }
      } else {
        const fallbackTrip = {
          status: 'arriving',
          destination: localStorage.getItem('cuidapp_active_trip_destination') || 'Hospital Metropolitano',
          assistant: {
            name: 'Elena Martínez',
            photo: 'https://picsum.photos/seed/elena/200',
            vehicle: 'Hyundai Accent',
            plate: 'PBT-5678',
            rating: 5.0
          }
        };
        setTrip(fallbackTrip);
      }
      if (memberSaved) setMemberData(JSON.parse(memberSaved));
    };
    sync();
    window.addEventListener('storage', sync);
    const interval = setInterval(sync, 2000);
    return () => {
      window.removeEventListener('storage', sync);
      clearInterval(interval);
    };
  }, [navigate]);

  const handleStartTrip = () => {
    if (trip) {
      const updatedTrip = { ...trip, status: 'in_progress' };
      localStorage.setItem('cuidapp_active_trip', JSON.stringify(updatedTrip));
      setTrip(updatedTrip);
    }
  };

  if (!trip) return null;

  const assistantFirstName = trip.assistant?.name?.split(' ')[0] || 'Tu asistente';
  const userFirstName = memberData?.name?.split(' ')[0] || 'Socio';
  const isInProgress = trip.status === 'in_progress';
  const isWheelchair = memberData?.mobilityNeeds?.includes('wheelchair');

  return (
    <div className="h-screen w-full font-plus flex flex-col bg-white overflow-hidden text-secondary">
      {/* Encabezado Cuidapp+ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-50 p-6 flex flex-col items-center shrink-0">
        <div className="w-full flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/home')} 
            className="bg-white rounded-full size-12 flex items-center justify-center border border-slate-100 shadow-md active:scale-90 transition-all"
            aria-label="Volver al inicio"
          >
            <span className="material-symbols-outlined text-primary font-bold text-3xl">arrow_back</span>
          </button>
          
          <div className="px-5 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            <h2 className="text-[11px] font-extrabold italic text-primary uppercase tracking-widest">
               {isInProgress ? 'Protección Cuidapp+ activa' : 'Asistente en camino'}
            </h2>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="text-center mt-3 px-4">
          <h1 className="text-[20px] font-black text-secondary leading-tight italic tracking-tighter">
             {isInProgress ? `Viajando con seguridad, ${userFirstName}` : `${assistantFirstName} va por ti`}
          </h1>
          <p className="text-[14px] font-bold text-secondary italic mt-1">
             {isInProgress ? 'Llegada estimada en 12 min' : `Destino: ${trip.destination || 'Hospital Metropolitano'}`}
          </p>
        </div>
      </header>

      {/* Contenido con Scroll y Padding reglamentario */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-[180px]">
         {/* Mapa Simulado con Ruta Humana */}
         <div className="w-full h-64 bg-slate-50 rounded-[20px] border border-slate-100 shadow-sm overflow-hidden relative group">
            <img 
              src="https://picsum.photos/seed/mapactive/800/400" 
              className="w-full h-full object-cover opacity-40 grayscale" 
              alt="Ruta del trayecto" 
            />
            
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M 20 80 Q 40 20 80 30" fill="transparent" stroke="#0052CC" strokeWidth="2" strokeDasharray="2,2" />
               <path d="M 20 80 L 35 55" fill="transparent" stroke="#6C5CE7" strokeWidth="3" />
               <path d="M 35 55 L 80 30" fill="transparent" stroke="#0052CC" strokeWidth="3" />
            </svg>

            <div className="absolute left-[15%] bottom-[15%] flex flex-col items-center">
               <div className="bg-primary text-white size-7 rounded-full flex items-center justify-center font-black shadow-lg text-[10px]">A</div>
            </div>
            <div className="absolute right-[15%] top-[25%] flex flex-col items-center">
               <div className="bg-secondary text-white size-8 rounded-full flex items-center justify-center shadow-xl">
                  <span className="material-symbols-outlined text-sm font-bold">shield_with_heart</span>
               </div>
            </div>
         </div>

         {/* Información del Vehículo */}
         <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl flex items-center gap-5">
            <div className="size-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
               <span className="material-symbols-outlined text-3xl font-bold">directions_car</span>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1 italic">Vehículo certificado</p>
               <p className="text-lg font-black italic text-secondary leading-none">
                 {trip.assistant?.vehicle || 'Hyundai Accent'}
               </p>
               <p className="text-secondary font-black text-xs mt-1 italic tracking-widest uppercase">{trip.assistant?.plate || 'PBT-5678'}</p>
            </div>
         </div>

         {/* Alerta de Movilidad (Consistencia con Panel Asistente) */}
         {isWheelchair && (
           <div className="bg-primary p-6 rounded-[2.5rem] shadow-md flex items-center gap-4 border-2 border-white">
              <span className="material-symbols-outlined text-white text-3xl font-bold">accessible</span>
              <div>
                <p className="text-white text-[10px] font-black uppercase tracking-widest opacity-80 mb-1 italic">Asistencia requerida</p>
                <p className="text-white font-black italic text-base leading-none tracking-tight">El asistente está preparado para silla de ruedas.</p>
              </div>
           </div>
         )}

         <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-slate-50 py-6 rounded-[2rem] shadow-md active:scale-95 transition-all group">
               <span className="material-symbols-outlined text-3xl text-primary group-active:scale-110 transition-transform">call</span>
               <span className="text-[11px] font-black italic text-secondary">Llamar a {assistantFirstName}</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-slate-50 py-6 rounded-[2rem] shadow-md active:scale-95 transition-all group">
               <span className="material-symbols-outlined text-3xl text-primary group-active:scale-110 transition-transform">chat_bubble</span>
               <span className="text-[11px] font-black italic text-secondary">Mensaje rápido</span>
            </button>
         </div>

         {!isInProgress ? (
           <button 
             onClick={handleStartTrip}
             className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-xl italic shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/20"
           >
              Ya subí al vehículo
           </button>
         ) : (
           <div className="p-8 bg-slate-50 rounded-[3rem] text-center border-2 border-primary/10 border-dashed animate-in fade-in duration-700">
              <div className="flex items-center justify-center gap-3 text-primary mb-2">
                 <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">Seguridad activa v2.7</p>
              </div>
              <p className="text-xs font-bold text-slate-400 italic">Tu ubicación y signos vitales se comparten en vivo con tu familiar responsable en Cuidapp+.</p>
           </div>
         )}
      </main>
    </div>
  );
};

export default ActiveTripPage;
