
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ActiveTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [memberData, setMemberData] = useState<any>(null);
  const [specialNeeds, setSpecialNeeds] = useState<string>('');
  const [userName, setUserName] = useState(localStorage.getItem('cuidapp_user_name') || 'Pasajero');

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
            name: 'Asistente Profesional',
            photo: 'https://picsum.photos/seed/assistant/200',
            vehicle: 'Vehículo Certificado',
            plate: 'ABC-1234',
            rating: 5.0
          }
        };
        setTrip(fallbackTrip);
      }
      setSpecialNeeds(localStorage.getItem('cuidapp_special_needs') || '');

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

  const handleCancelTrip = () => {
    if (window.confirm('¿Seguro que deseas cancelar tu transporte protegido?')) {
      localStorage.removeItem('cuidapp_active_trip');
      navigate('/home');
    }
  };

  if (!trip) return null;

  // Identidad - Fuente de verdad única y capitalización Manifiesto Cuidapp+
  const toProperCase = (name: string) => {
    if (!name) return '';
    return name.trim().split(' ').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formattedUser = toProperCase(userName);
  const firstName = formattedUser.split(' ')[0];
  const formattedAssistant = toProperCase(trip.assistant?.name || 'Asistente');
  const assistantFirst = formattedAssistant.split(' ')[0];

  const isInProgress = trip.status === 'in_progress';

  const pageTitle = isInProgress
    ? `Viajando con seguridad, ${firstName}`
    : `${assistantFirst} está en camino, ${firstName}`;

  const hasHighNeed = specialNeeds.toLowerCase().includes('silla') || specialNeeds.toLowerCase().includes('apoyo');
  const showAssistance = specialNeeds && specialNeeds !== 'Sin requerimientos especiales';

  return (
    <div className="h-screen w-full font-plus flex flex-col bg-white overflow-hidden text-secondary">
      {/* Encabezado Cuidapp+ */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-50 p-6 flex flex-col items-center shrink-0">
        <div className="w-full flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-white rounded-full size-12 flex items-center justify-center border border-slate-100 shadow-md active:scale-90 transition-all"
            aria-label="Volver al inicio"
          >
            <span className="material-symbols-outlined text-primary font-bold text-3xl">arrow_back</span>
          </button>

          <div className="px-5 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
            <span className="size-2 bg-primary rounded-full animate-pulse"></span>
            <h2 className="text-[11px] font-bold text-primary">
              {isInProgress ? 'Protección Cuidapp+ activa' : 'Asistente en camino'}
            </h2>
          </div>
          <div className="w-12"></div>
        </div>

        <div className="text-center mt-3 px-4">
          <h1 className="text-2xl font-bold italic text-[#0052CC]">
            {pageTitle}
          </h1>
          <p className="text-[14px] font-bold text-[#0052CC] mt-2">
            {isInProgress ? 'Llegada estimada a destino en 12 min' : `Destino: ${trip.destination || 'Hospital Metropolitano'}`}
          </p>
        </div>
      </header>

      {/* Contenido con Scroll y Padding reglamentario (180px para evitar solapamiento) */}
      <main className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pb-[180px]">
        {/* Mapa Simulado con Ruta Humana - Crece cuando estamos en el trayecto */}
        <div className={`w-full ${isInProgress ? 'h-[350px]' : 'h-64'} bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden relative group transition-all duration-500`}>
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

        {/* Banner de Asistencia Requerida (Datos Reales según Manifiesto) */}
        {showAssistance && (
          <div className="bg-[#A29BFE]/15 p-6 rounded-[2.5rem] border border-primary/20 flex items-center gap-4 animate-in slide-in-from-left duration-700">
            <div className="size-12 bg-primary rounded-2xl flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-2xl font-bold">
                {hasHighNeed ? 'accessible' : 'info'}
              </span>
            </div>
            <div>
              <p className="text-primary text-[10px] font-black italic opacity-80 mb-1">Atención especial</p>
              <p className="text-[#0052CC] font-black text-base leading-none tracking-tight">
                {specialNeeds}
              </p>
            </div>
          </div>
        )}

        {/* Indicador ETA Resaltado */}
        {!isInProgress && (
          <div className="text-center bg-white py-2">
            <p className="text-lg font-bold text-secondary">
              Llegada estimada: <span className="text-2xl text-primary font-black">6</span> min
            </p>
          </div>
        )}

        {/* Información del Vehículo */}
        <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl flex items-center gap-5">
          <div className="size-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-3xl font-bold">directions_car</span>
          </div>
          <div>
            <p className="text-[10px] font-black italic text-slate-300 leading-none mb-1">Vehículo certificado</p>
            <p className="text-lg font-black italic text-secondary leading-none">
              {trip.assistant?.vehicle || 'Vehículo Certificado'}
            </p>
            <p className="text-secondary font-black text-xs mt-1">{trip.assistant?.plate || 'ABC-1234'}</p>
          </div>
        </div>



        <div className="grid grid-cols-2 gap-4">
          <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-slate-50 py-6 rounded-[2rem] shadow-md active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-3xl text-primary group-active:scale-110 transition-transform">call</span>
            <span className="text-[11px] font-black text-secondary">Llamar a asistente</span>
          </button>
          <button className="flex flex-col items-center justify-center gap-2 bg-white border-2 border-slate-50 py-6 rounded-[2rem] shadow-md active:scale-95 transition-all group">
            <span className="material-symbols-outlined text-3xl text-primary group-active:scale-110 transition-transform">chat_bubble</span>
            <span className="text-[11px] font-black text-secondary">Mensaje rápido</span>
          </button>
        </div>

        {!isInProgress ? (
          <div className="space-y-4">
            <button
              onClick={handleStartTrip}
              className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/20 tracking-[0.04em]"
            >
              Ya subí al vehículo
            </button>
            <button
              onClick={handleCancelTrip}
              className="w-full py-4 text-slate-400 font-bold text-sm active:scale-95 transition-all"
            >
              Cancelar viaje
            </button>
          </div>
        ) : (
          <div className="p-8 bg-slate-50 rounded-[3rem] text-center border-2 border-primary/10 border-dashed animate-in fade-in duration-700">
            <div className="flex items-center justify-center gap-3 text-primary mb-2">
              <span className="material-symbols-outlined text-sm font-bold">verified_user</span>
              <p className="text-[10px] font-black tracking-[0.4em]">Seguridad activa v2.7</p>
            </div>
            <p className="text-xs font-bold text-slate-400 mb-8">Tu ubicación y signos vitales se comparten en vivo con tu familiar responsable en Cuidapp+.</p>

            <button
              onClick={() => {
                const updatedTrip = { ...trip, status: 'completed' };
                localStorage.setItem('cuidapp_active_trip', JSON.stringify(updatedTrip));
                navigate('/trip-summary');
              }}
              className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/20 tracking-[0.04em]"
            >
              Simular llegada segura
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ActiveTripPage;
