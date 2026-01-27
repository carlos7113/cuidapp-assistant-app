
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface MemberData {
  name: string;
  age: string;
  bloodType: string;
  allergies: string;
  medications: string;
  mobilityNeeds: string[];
  doctor?: {
    name: string;
    phone: string;
  };
}

const AssistantDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [assistant, setAssistant] = useState<any>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [showEarningsToast, setShowEarningsToast] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [lastEarnings, setLastEarnings] = useState("$7.60");

  const capitalize = (str: string) => {
    if (!str) return 'Socio Cuidapp+';
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const mobilityLabels: Record<string, string> = {
    'wheelchair': 'Uso de silla de ruedas',
    'walking_aid': 'Apoyo para caminar',
    'visual_aid': 'Asistencia visual',
    'hearing_aid': 'Asistencia auditiva',
    'other': 'Otras necesidades de apoyo'
  };

  useEffect(() => {
    const syncState = () => {
      const tripSaved = localStorage.getItem('cuidapp_active_trip');
      const assistantSaved = localStorage.getItem('cuidapp_assistant_identity');
      const memberSaved = localStorage.getItem('cuidapp_member_data');

      if (assistantSaved) {
        setAssistant(JSON.parse(assistantSaved));
      } else {
        const defaultAssistant = {
          name: 'Elena Martínez',
          photo: 'https://picsum.photos/seed/elena/200',
          role: 'Asistente verificado',
          rating: 5.0
        };
        setAssistant(defaultAssistant);
        localStorage.setItem('cuidapp_assistant_identity', JSON.stringify(defaultAssistant));
      }

      if (memberSaved) {
        setMemberData(JSON.parse(memberSaved));
      }

      if (tripSaved) {
        const tripData = JSON.parse(tripSaved);
        if (['searching', 'arriving', 'in_progress'].includes(tripData.status)) {
          setActiveTrip(tripData);
        } else {
          setActiveTrip(null);
        }
      } else {
        setActiveTrip(null);
      }
    };

    syncState();
    window.addEventListener('storage', syncState);
    const interval = setInterval(syncState, 2000);
    return () => {
      window.removeEventListener('storage', syncState);
      clearInterval(interval);
    };
  }, []);

  const handleUpdateStatus = (newStatus: string) => {
    if (activeTrip) {
      if (newStatus === 'completed' || newStatus === 'finished') {
        const tripPrice = activeTrip.price || 7.60;
        const netEarnings = tripPrice * 0.80; // 20% de comisión para Cuidapp+
        const earnings = JSON.parse(localStorage.getItem('cuidapp_earnings') || '{"balance": 0, "history": []}');

        const newService = {
          user: capitalize(memberData?.name || 'Socio'),
          date: new Date().toLocaleString(),
          total: `$${netEarnings.toFixed(2)}`
        };

        localStorage.setItem('cuidapp_earnings', JSON.stringify({
          balance: earnings.balance + netEarnings,
          history: [newService, ...earnings.history]
        }));

        setLastEarnings(`$${netEarnings.toFixed(2)}`);

        // Reset total de privacidad y datos Cuidapp+
        localStorage.removeItem('cuidapp_active_trip');
        localStorage.removeItem('cuidapp_user_name');
        localStorage.removeItem('cuidapp_guest_data');
        localStorage.removeItem('cuidapp_user_needs');
        localStorage.removeItem('cuidapp_other_need');
        localStorage.removeItem('cuidapp_special_needs');
        localStorage.removeItem('cuidapp_active_trip_destination');
        localStorage.removeItem('cuidapp_status');
        localStorage.removeItem('cuidapp_role'); // Opcional, pero previene fugas de identidad

        // Disparar evento de almacenamiento para sincronizar otros componentes
        window.dispatchEvent(new Event('storage'));

        setShowEarningsToast(true);
        setActiveTrip(null);
        setMemberData(null);

        setTimeout(() => setShowEarningsToast(false), 4000);
        return;
      }

      const updatedTrip = { ...activeTrip, status: newStatus };
      localStorage.setItem('cuidapp_active_trip', JSON.stringify(updatedTrip));
      setActiveTrip(updatedTrip);
    }
  };


  const getCheckpointStage = () => {
    switch (activeTrip?.status) {
      case 'arriving': return { label: 'En camino al origen', next: 'at_origin', button: 'Llegada al origen', icon: 'location_on' };
      case 'at_origin': return { label: 'En el origen', next: 'in_progress', button: 'Paciente a bordo', icon: 'person_add' };
      case 'in_progress': return { label: 'Viaje en progreso', next: 'destination_reached', button: 'Llegada al destino', icon: 'local_taxi' };
      case 'destination_reached': return { label: 'En el destino', next: 'completed', button: 'Entrega confirmada', icon: 'check_circle' };
      default: return null;
    }
  };

  const checkpoint = getCheckpointStage();


  const isGuestPassenger = activeTrip?.isGuest;

  const getMobilityText = () => {
    const needs = isGuestPassenger ? activeTrip?.mobilityNeeds : memberData?.mobilityNeeds;
    if (!needs || needs.length === 0) return 'Sin requerimientos';

    let text = needs.map((id: string) => mobilityLabels[id] || id).join(', ');
    if (isGuestPassenger && activeTrip?.otherNeedText) {
      // Si hay requerimiento manual, mostramos SOLO el texto manual para limpieza visual
      text = activeTrip.otherNeedText;
    }
    return text;
  };

  const isWheelchairUser = isGuestPassenger
    ? activeTrip?.mobilityNeeds?.includes('wheelchair')
    : memberData?.mobilityNeeds?.includes('wheelchair');

  if (!assistant) return null;

  return (
    <div className="font-plus h-screen flex flex-col bg-white text-secondary overflow-y-auto pb-[160px] relative custom-scrollbar">
      {/* Earnings Toast */}
      {showEarningsToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[1000] w-[90%] max-w-[400px] animate-in slide-in-from-top duration-500">
          <div className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5 border-4 border-white/20">
            <div className="size-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl font-bold">payments</span>
            </div>
            <div>
              <p className="text-lg font-black leading-tight">¡Viaje finalizado con éxito!</p>
              <p className="text-xs font-bold opacity-80 mt-1">Has ganado {lastEarnings} (Neto para ti).</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Panel Asistente */}
      <header className="px-8 py-10 bg-white border-b border-slate-50 flex justify-between items-center sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-5">
          <div className="size-16 rounded-2xl bg-secondary flex items-center justify-center text-white shadow-2xl shadow-secondary/20">
            <span className="material-symbols-outlined text-4xl font-bold">local_taxi</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-3xl font-black italic text-secondary leading-none truncate max-w-[200px]">Hola, {assistant.name.split(' ')[0]}</h1>
            <p className="text-[11px] font-bold italic text-secondary opacity-40 mt-2 leading-none">Panel Cuidapp+</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/account')}
          className="size-16 rounded-full border-4 border-secondary/10 overflow-hidden shadow-md active:scale-95 transition-all"
        >
          <img src={assistant.photo} className="w-full h-full object-cover" alt="Perfil" />
        </button>
      </header>

      <main className="flex-1 p-8 space-y-10 relative">
        {activeTrip ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <div className="bg-secondary/5 border-2 border-secondary/10 p-8 rounded-[3.5rem] space-y-8 shadow-sm">
              <div className="flex items-center gap-6">
                <div className="size-20 rounded-full border-4 border-primary/10 overflow-hidden shrink-0 relative">
                  <img src="https://picsum.photos/seed/passenger/200" className="w-full h-full object-cover" alt="Pasajero" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold italic text-slate-400 mb-1">Pasajero en viaje</p>
                  <h2 className="text-2xl font-bold italic text-secondary leading-none">
                    {localStorage.getItem('cuidapp_user_name') || 'Carlos Soto'}
                  </h2>
                  <div className="mt-2 inline-block bg-[#6C5CE7]/10 px-3 py-1 rounded-lg border border-[#6C5CE7]/20">
                    <p className="text-[#6C5CE7] text-[10px] font-black italic uppercase tracking-wider">
                      Servicio: {activeTrip.serviceLevel === 'assisted' ? 'Traslado Asistido' : activeTrip.serviceLevel === 'premium' ? 'Traslado Premium' : 'Traslado Básico'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMedicalModal(true)}
                  className="size-12 bg-sos-red/10 text-sos-red rounded-2xl flex items-center justify-center shadow-sm active:scale-90 transition-all"
                >
                  <span className="material-symbols-outlined font-bold">emergency</span>
                </button>
              </div>

              {/* Requerimientos Médicos y de Movilidad */}
              <div className="space-y-4">
                <button
                  onClick={() => setShowMedicalModal(true)}
                  className={`w-full p-6 rounded-[2.5rem] shadow-xl flex items-start gap-4 animate-in zoom-in duration-500 text-left transition-all active:scale-95 ${isWheelchairUser ? 'bg-primary border-4 border-white' : 'bg-secondary'
                    }`}
                >
                  <span className="material-symbols-outlined text-white text-3xl font-bold shrink-0">
                    {isWheelchairUser ? 'accessible' : 'info'}
                  </span>
                  <div>
                    <p className="text-white text-[10px] font-black tracking-[0.2em] opacity-80 mb-1">Requerimiento especial</p>
                    <p className={`text-white text-lg leading-tight ${isWheelchairUser ? 'font-black' : 'font-bold'}`}>
                      {getMobilityText()}
                    </p>
                  </div>
                </button>

                {/* Badges Médicos Suplementarios para Invitados */}
                {isGuestPassenger && (() => {
                  const guestData = JSON.parse(localStorage.getItem('cuidapp_guest_data') || '{}');
                  return (guestData.allergies || guestData.medication) && (
                    <div className="flex flex-wrap gap-3 px-2">
                      {guestData.allergies && (
                        <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm font-bold">warning</span>
                          <span className="text-[11px] font-bold text-secondary">Alergias: {guestData.allergies}</span>
                        </div>
                      )}
                      {guestData.medication && (
                        <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-full flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-sm font-bold">medication</span>
                          <span className="text-[11px] font-bold text-secondary">Medicación: {guestData.medication}</span>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Familiar Responsable */}
              {(() => {
                const family = activeTrip.familyContact;
                if (!family || !family.name) return null;
                const familyFirstName = family.name.split(' ')[0];
                return (
                  <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-50 shadow-md space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-300 mb-1">Familiar responsable</p>
                        <p className="text-xl font-bold text-secondary leading-none">{capitalize(family.name)}</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{family.relationship || 'Contacto de emergencia'}</p>
                      </div>
                      <div className="size-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined font-bold">family_restroom</span>
                      </div>
                    </div>
                    <a
                      href={`tel:${family.phone}`}
                      className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined font-bold">call</span>
                      Llamar a {familyFirstName} {family.name.split(' ').slice(1).join(' ')}
                    </a>
                  </div>
                );
              })()}

              {/* Indicador de Pago */}
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-white rounded-full flex items-center justify-center text-primary shadow-sm">
                    <span className="material-symbols-outlined text-xl">payments</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-300 leading-none mb-1">Método de cobro</p>
                    <p className="text-secondary font-black text-base leading-none tracking-tight">
                      {activeTrip.paymentMethod === 'card' ? 'Pago digital (No solicitar dinero)' : `Cobro en efectivo: $${(activeTrip.price || 7.60).toFixed(2)} USD`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mapa con persistencia de ruta */}
              <div className="w-full h-48 rounded-[2.5rem] overflow-hidden border-2 border-slate-100 shadow-inner relative group">
                <img src="https://picsum.photos/seed/drivermap/800/400" className="w-full h-full object-cover opacity-50 grayscale" alt="Ruta asistente" />
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 80 Q 50 30 80 20" fill="transparent" stroke="#0052CC" strokeWidth="4" />
                  <circle cx="20" cy="80" r="3" fill="#6C5CE7" />
                  <circle cx="80" cy="20" r="3" fill="#0052CC" />
                </svg>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-secondary border border-slate-100">GPS VIVO</div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary font-bold">location_on</span>
                  <p className="text-[13px] font-bold text-secondary">Destino: {activeTrip.destination || 'Hospital Metropolitano'}</p>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-sm font-bold">timer</span>
                  <p className="text-[11px] font-black">Llegada estimada en 12 min</p>
                </div>
              </div>

              {checkpoint && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="flex gap-1 flex-1">
                      {[1, 2, 3, 4].map((step) => {
                        const currentStep = ['arriving', 'at_origin', 'in_progress', 'destination_reached', 'completed'].indexOf(activeTrip.status) + 1;
                        return (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step < currentStep ? 'bg-primary' : step === currentStep ? 'bg-primary animate-pulse' : 'bg-slate-100'}`}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUpdateStatus(checkpoint.next)}
                    className="w-full bg-secondary text-white py-8 rounded-[2.5rem] font-black italic text-2xl shadow-2xl shadow-secondary/20 active:scale-95 transition-all tracking-[0.04em] flex items-center justify-center gap-4"
                  >
                    <span className="material-symbols-outlined text-3xl">{checkpoint.icon}</span>
                    {checkpoint.button}
                  </button>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-8 mt-12 animate-in fade-in duration-700">
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/10 rounded-full animate-ping scale-125"></div>
              <div className="size-48 bg-slate-50 border-2 border-slate-100 rounded-full flex items-center justify-center text-slate-200 shadow-inner">
                <span className="material-symbols-outlined text-7xl animate-spin duration-[3000ms]">refresh</span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-secondary leading-tight tracking-tight">Esperando solicitudes...</h3>
              <p className="text-slate-400 font-bold text-sm">Tu zona está activa en Cuidapp+.</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Ficha Médica para el Asistente */}
      {showMedicalModal && (activeTrip || memberData) && (
        <div className="fixed inset-0 z-[1000] bg-secondary/95 backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] p-10 space-y-8 shadow-2xl border-4 border-white/20">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-sos-red font-bold">emergency</span>
                <h3 className="text-sm font-black text-secondary tracking-[0.2em]">Ficha de Emergencia</h3>
              </div>
              <button onClick={() => setShowMedicalModal(false)} className="size-10 rounded-full bg-slate-50 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-6">
              {isGuestPassenger ? (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-6 rounded-3xl border-2 border-primary/10">
                    <p className="text-[10px] font-black text-slate-400 mb-2">Requerimientos del viaje</p>
                    <p className="text-lg font-bold text-secondary leading-tight">
                      {getMobilityText()}
                    </p>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 text-center px-4">
                    Modo Invitado: Solo se transmiten requerimientos específicos del viaje seleccionado por seguridad.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 mb-1">Alergias críticas</p>
                    <p className="text-lg font-black text-sos-red leading-tight">
                      {memberData?.allergies || 'Ninguna registrada'}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 mb-1">Medicación habitual</p>
                    <p className="text-sm font-bold text-secondary leading-relaxed">
                      {memberData?.medications || 'No especificada'}
                    </p>
                  </div>

                  {memberData?.doctor && (
                    <div className="bg-primary/5 p-5 rounded-2xl border border-primary/10">
                      <p className="text-[9px] font-black text-primary mb-1">Médico de cabecera</p>
                      <p className="text-lg font-black text-secondary leading-none">{memberData.doctor.name}</p>
                      <a href={`tel:${memberData.doctor.phone}`} className="text-xs font-bold text-primary mt-2 inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs">call</span>
                        {memberData.doctor.phone}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={() => setShowMedicalModal(false)}
              className="w-full bg-secondary text-white py-6 rounded-2xl font-black text-lg shadow-xl active:scale-95 transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantDashboardPage;
