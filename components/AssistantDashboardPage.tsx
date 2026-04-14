import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

interface MemberData {
  name: string;
  age: string;
  bloodType: string;
  allergies: string;
  medications: string;
  mobilityNeeds: string[];
  doctor?: { name: string; phone: string };
}

interface TripData {
  id?: string;
  status: string;
  passengerName?: string;
  destination?: string;
  serviceLevel?: string;
  paymentMethod?: string;
  price?: number;
  mobilityNeeds?: string[];
  otherNeedText?: string;
  isGuest?: boolean;
  familyContact?: { name: string; phone: string; relationship?: string };
  bono?: string;
  lead_name?: string;
  lead_blood_type?: string;
  lead_allergies?: string;
  lead_medications?: string;
  lead_needs?: string[];
  destination_name?: string;
  created_at?: string;
  timestamp?: string;
}

const BLUE = '#0052CC';
const BLUE_LIGHT = '#E6EEFF';
const BLUE_GHOST = '#0052CC14';
const VIOLET = '#6C5CE7';
const RED = '#E74C3C';
const ACTIVE_STATUSES = ['searching', 'arriving', 'at_origin', 'in_progress', 'destination_reached'];
const TRIP_MAX_AGE_HOURS = 6;

const capitalize = (str: string) => {
  if (!str) return 'Socio Cuidapp+';
  return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
};

const isTripFresh = (trip: TripData): boolean => {
  if (!trip.created_at) return false;
  const age = (Date.now() - new Date(trip.created_at).getTime()) / (1000 * 60 * 60);
  return age < TRIP_MAX_AGE_HOURS;
};

const mobilityLabels: Record<string, string> = {
  wheelchair: 'Uso de silla de ruedas',
  walking_aid: 'Apoyo para caminar',
  visual_aid: 'Asistencia visual',
  hearing_aid: 'Asistencia auditiva',
  other: 'Otras necesidades de apoyo',
};

const AssistantDashboardPage: React.FC = () => {
  const [activeTrip, setActiveTrip] = useState<TripData | null>(null);
  const [pendingTrips, setPendingTrips] = useState<any[]>([]);
  const [assistant, setAssistant] = useState<any>(null);
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [showEarningsToast, setShowEarningsToast] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  const [lastEarnings, setLastEarnings] = useState('$0.00');

  // ── Leer identidad del asistente ──────────────────────────────────────────
  const loadAssistant = () => {
    const saved = localStorage.getItem('cuidapp_assistant_identity');
    if (saved) {
      setAssistant(JSON.parse(saved));
    } else {
      const defaultAssistant = {
        name: 'Elena Martínez',
        photo: 'https://picsum.photos/seed/elena/200',
        role: 'Asistente verificado',
        rating: 5.0,
      };
      setAssistant(defaultAssistant);
      localStorage.setItem('cuidapp_assistant_identity', JSON.stringify(defaultAssistant));
    }
  };

  // ── Sincronización de estado desde localStorage ───────────────────────────
  const syncState = () => {
    const tripRaw = localStorage.getItem('cuidapp_active_trip');
    const memberRaw = localStorage.getItem('cuidapp_member_data');

    if (memberRaw) {
      try { setMemberData(JSON.parse(memberRaw)); } catch { /* ignorar */ }
    }

    if (tripRaw) {
      try {
        const trip: TripData = JSON.parse(tripRaw);
        if (ACTIVE_STATUSES.includes(trip.status) && isTripFresh(trip)) {
          setActiveTrip(trip);
        } else {
          if (!isTripFresh(trip)) {
            localStorage.removeItem('cuidapp_active_trip');
          }
          setActiveTrip(null);
        }
      } catch {
        localStorage.removeItem('cuidapp_active_trip');
        setActiveTrip(null);
      }
    } else {
      setActiveTrip(null);
    }
  };

  const loadPendingTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPendingTrips(data);
    }
  };

  const handleAcceptTrip = async (trip: any) => {
    const assistantId = localStorage.getItem('cuidapp_active_assistant_id');

    const { error } = await supabase
      .from('trips')
      .update({
        status: 'accepted',
        assistant_id: assistantId,
        assistant_name: assistant.name
      })
      .eq('id', trip.id);

    if (error) {
      alert("No se pudo aceptar el viaje: " + error.message);
      return;
    }

    // Actualizar estado local
    const mockTrip: TripData = {
      id: trip.id,
      status: 'arriving',
      passengerName: trip.passenger_name,
      destination: trip.destination,
      serviceLevel: trip.service_level,
      price: trip.price,
      created_at: new Date().toISOString(),
      lead_name: trip.lead_name,
      lead_blood_type: trip.lead_blood_type,
      lead_allergies: trip.lead_allergies,
      lead_medications: trip.lead_medications,
      lead_needs: trip.lead_needs,
      isGuest: !!trip.lead_name
    };

    localStorage.setItem('cuidapp_active_trip', JSON.stringify(mockTrip));
    setActiveTrip(mockTrip);
    setPendingTrips(prev => prev.filter(t => t.id !== trip.id));
  };

  useEffect(() => {
    loadAssistant();
    syncState();
    loadPendingTrips();

    // Supabase Realtime Subscription
    const channel = supabase
      .channel('public:trips')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'trips', filter: 'status=eq.pending' },
        (payload) => {
          console.log('📡 Nuevo viaje detectado:', payload.new);
          setPendingTrips(prev => [payload.new, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'trips' },
        (payload) => {
          // Si el viaje ya no es 'pending' (alguien lo aceptó), lo quitamos de la lista
          if (payload.new.status !== 'pending') {
            setPendingTrips(prev => prev.filter(t => t.id !== payload.new.id));
          }
        }
      )
      .subscribe();

    window.addEventListener('storage', syncState);
    const poll = setInterval(syncState, 5000);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', syncState);
      clearInterval(poll);
    };
  }, []);

  // ── Actualizar estado del viaje ───────────────────────────────────────────
  const handleUpdateStatus = (newStatus: string) => {
    if (!activeTrip) return;

    if (newStatus === 'completed') {
      const price = activeTrip.price || 7.60;
      const net = price * 0.80;
      const earnings = JSON.parse(localStorage.getItem('cuidapp_earnings') || '{"balance":0,"history":[]}');
      const record = {
        user: capitalize(activeTrip.passengerName || 'Socio'),
        date: new Date().toLocaleString(),
        total: `$${net.toFixed(2)}`,
      };
      localStorage.setItem('cuidapp_earnings', JSON.stringify({
        balance: earnings.balance + net,
        history: [record, ...earnings.history],
      }));
      setLastEarnings(`$${net.toFixed(2)}`);

      // Limpiar localStorage del viaje completado
      ['cuidapp_active_trip', 'cuidapp_user_name', 'cuidapp_guest_data',
        'cuidapp_user_needs', 'cuidapp_other_need', 'cuidapp_special_needs',
        'cuidapp_active_trip_destination', 'cuidapp_status'].forEach(k =>
          localStorage.removeItem(k)
        );
      window.dispatchEvent(new Event('storage'));

      setActiveTrip(null);
      setMemberData(null);
      setShowEarningsToast(true);
      setTimeout(() => setShowEarningsToast(false), 4500);
      return;
    }

    const updated = { ...activeTrip, status: newStatus };
    localStorage.setItem('cuidapp_active_trip', JSON.stringify(updated));
    setActiveTrip(updated);
  };

  // ── Checkpoint de progreso del viaje ─────────────────────────────────────
  const getCheckpoint = () => {
    switch (activeTrip?.status) {
      case 'arriving':
        return { label: 'En camino al origen', next: 'at_origin', button: 'Llegada al origen', icon: 'location_on' };
      case 'at_origin':
        return { label: 'En el origen', next: 'in_progress', button: 'Pasajero a bordo', icon: 'person_add' };
      case 'in_progress':
        return { label: 'Viaje en progreso', next: 'destination_reached', button: 'Llegada al destino', icon: 'local_taxi' };
      case 'destination_reached':
        return { label: 'En el destino', next: 'completed', button: 'Entrega confirmada', icon: 'check_circle' };
      default:
        return null;
    }
  };

  const checkpoint = getCheckpoint();
  const isGuest = activeTrip?.isGuest || activeTrip?.lead_name;
  const needs = activeTrip?.lead_needs || (isGuest ? activeTrip?.mobilityNeeds : memberData?.mobilityNeeds);
  const isWheelchair = needs?.includes('wheelchair') ?? false;


  const getMobilityText = () => {
    if (!needs || needs.length === 0) return 'Sin requerimientos especiales';
    if (isGuest && activeTrip?.otherNeedText) return activeTrip.otherNeedText;
    return needs.map((id: string) => mobilityLabels[id] || id).join(', ');
  };

  const passengerName = activeTrip?.passengerName
    || localStorage.getItem('cuidapp_user_name')
    || memberData?.name
    || 'Pasajero Cuidapp+';

  const stepIndex = ['arriving', 'at_origin', 'in_progress', 'destination_reached', 'completed']
    .indexOf(activeTrip?.status || '') + 1;

  if (!assistant) return null;

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: BLUE }}
      className="min-h-screen flex flex-col bg-white overflow-y-auto"
    >

      {/* ── Toast de ganancias ────────────────────────────────────────────── */}
      {showEarningsToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] max-w-[400px]">
          <div
            style={{ backgroundColor: BLUE, border: '3px solid rgba(255,255,255,0.2)' }}
            className="text-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-5"
          >
            <div className="size-14 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
              <span className="material-symbols-outlined text-3xl">payments</span>
            </div>
            <div>
              <p className="text-lg font-black italic leading-tight">¡Viaje finalizado con éxito!</p>
              <p className="text-xs font-bold opacity-80 mt-1">Ganaste {lastEarnings} netos en este servicio.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Header: Logo Cuidapp+ + Nombre + Foto de Elena ───────────────── */}
      <header
        className="px-6 py-6 bg-white flex justify-between items-center sticky top-0 z-50 shrink-0"
        style={{ borderBottom: '1px solid #E6EEFF' }}
      >
        <div className="flex items-center gap-4">
          {/* Logo Cuidapp+ (identidad azul) */}
          <div
            style={{ backgroundColor: BLUE }}
            className="size-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
          >
            <span className="text-white font-black text-lg italic leading-none" style={{ letterSpacing: '-0.03em' }}>C+</span>
          </div>
          <div>
            <h1 style={{ color: BLUE }} className="text-2xl font-black italic leading-none">
              Hola, {assistant.name.split(' ')[0]}
            </h1>
            <p style={{ color: BLUE }} className="text-[11px] font-bold italic opacity-40 mt-1 leading-none">
              Panel Cuidapp+
            </p>
          </div>
        </div>

        {/* Foto de perfil de Elena */}
        <div
          style={{ border: `3px solid ${BLUE_LIGHT}` }}
          className="size-14 rounded-full overflow-hidden shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <img src={assistant.photo} className="w-full h-full object-cover" alt={`Foto de ${assistant.name}`} />
        </div>
      </header>

      {/* ── Barra de estado de conexión ───────────────────────────────────── */}
      <div
        style={{ backgroundColor: BLUE_GHOST, border: `1px solid ${BLUE_LIGHT}` }}
        className="mx-5 mt-4 px-5 py-3 rounded-2xl flex items-center gap-3"
      >
        <span style={{ color: BLUE }} className="material-symbols-outlined text-base font-bold">wifi</span>
        <p style={{ color: BLUE }} className="text-xs font-black italic flex-1">
          Conectado — Esperando solicitudes de Cuidapp+
        </p>
        <div className="size-2 rounded-full bg-green-500 animate-pulse" />
      </div>

      {/* ── Contenido principal ───────────────────────────────────────────── */}
      <main className="flex-1 px-5 pt-6 pb-[160px] space-y-6">

        {activeTrip ? (
          /* ═══════════════════════════════════════════════════
             VIAJE ACTIVO — Panel de gestión
          ═══════════════════════════════════════════════════ */
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Tarjeta principal: Pasajero */}
            <div
              style={{ border: `2px solid ${BLUE_LIGHT}`, backgroundColor: BLUE_GHOST }}
              className="p-6 rounded-[2.5rem] space-y-5"
            >
              {/* Cabecera de pasajero */}
              <div className="flex items-center gap-4">
                <div
                  style={{ border: `3px solid ${BLUE_LIGHT}` }}
                  className="size-20 rounded-full overflow-hidden shrink-0"
                >
                  <img src="https://picsum.photos/seed/passenger88/200" className="w-full h-full object-cover" alt="Pasajero" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold italic text-slate-400 mb-0.5">Nuevo viaje de</p>
                  <h2 style={{ color: BLUE }} className="text-2xl font-black italic leading-none truncate">
                    {passengerName}
                  </h2>
                  <div
                    style={{ backgroundColor: `${VIOLET}12`, border: `1px solid ${VIOLET}30` }}
                    className="mt-2 inline-block px-3 py-1 rounded-lg"
                  >
                    <p style={{ color: VIOLET }} className="text-[10px] font-black italic tracking-wider">
                      Servicio:{' '}
                      {activeTrip.serviceLevel === 'assisted' ? 'Traslado asistido'
                        : activeTrip.serviceLevel === 'premium' ? 'Traslado premium'
                          : 'Traslado básico'}
                      {activeTrip.bono && ` · Bono: ${activeTrip.bono}`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMedicalModal(true)}
                  style={{ backgroundColor: `${RED}18`, color: RED }}
                  className="size-12 rounded-2xl flex items-center justify-center active:scale-90 transition-all shrink-0"
                  aria-label="Ver ficha médica"
                >
                  <span className="material-symbols-outlined font-bold">emergency</span>
                </button>
              </div>

              {/* Requerimiento especial / Silla de ruedas */}
              <button
                onClick={() => setShowMedicalModal(true)}
                className="w-full p-6 rounded-[2rem] flex items-start gap-4 text-left transition-all active:scale-95 shadow-lg"
                style={{ backgroundColor: isWheelchair ? VIOLET : BLUE }}
              >
                <span className="material-symbols-outlined text-white text-3xl shrink-0 font-bold">
                  {isWheelchair ? 'accessible' : 'info'}
                </span>
                <div>
                  <p className="text-white text-[10px] font-black tracking-[0.2em] opacity-75 mb-1">
                    Requerimiento especial
                  </p>
                  <p className={`text-white text-lg leading-tight ${isWheelchair ? 'font-black' : 'font-bold'}`}>
                    {getMobilityText()}
                  </p>
                  {isWheelchair && (
                    <p className="text-white/60 text-[10px] font-bold italic mt-1">
                      Preparar acceso para silla de ruedas
                    </p>
                  )}
                </div>
              </button>

              {/* Familiar responsable */}
              {activeTrip.familyContact?.name && (
                <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black text-slate-300 mb-0.5 italic">Familiar responsable</p>
                      <p style={{ color: BLUE }} className="text-lg font-black italic leading-none">
                        {capitalize(activeTrip.familyContact.name)}
                      </p>
                      <p className="text-xs font-bold text-slate-400 mt-1 italic">
                        {activeTrip.familyContact.relationship || 'Contacto de emergencia'}
                      </p>
                    </div>
                    <div style={{ backgroundColor: BLUE_GHOST, color: BLUE }} className="size-11 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined font-bold">family_restroom</span>
                    </div>
                  </div>
                  <a
                    href={`tel:${activeTrip.familyContact.phone}`}
                    style={{ backgroundColor: BLUE }}
                    className="w-full text-white py-5 rounded-2xl font-black italic text-base shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined font-bold">call</span>
                    Llamar a {capitalize(activeTrip.familyContact.name.split(' ')[0])}
                  </a>
                </div>
              )}

              {/* Método de cobro */}
              <div className="bg-white border border-slate-100 p-5 rounded-[2rem] flex items-center gap-4">
                <div style={{ backgroundColor: BLUE_GHOST, color: BLUE }} className="size-10 rounded-full flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">payments</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-300 leading-none mb-0.5">Método de cobro</p>
                  <p style={{ color: BLUE }} className="font-black text-sm leading-tight">
                    {activeTrip.paymentMethod === 'card'
                      ? 'Pago digital — no solicitar dinero'
                      : `Cobro en efectivo: $${(activeTrip.price || 7.60).toFixed(2)} USD`}
                  </p>
                </div>
              </div>

              {/* Mapa simulado */}
              <div className="w-full h-40 rounded-[2rem] overflow-hidden border border-slate-100 relative">
                <img
                  src="https://picsum.photos/seed/mapblue/800/400"
                  className="w-full h-full object-cover opacity-40 grayscale"
                  alt="Mapa de ruta"
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 20 80 Q 50 30 80 20" fill="transparent" stroke={BLUE} strokeWidth="4" strokeDasharray="6 3" />
                  <circle cx="20" cy="80" r="3.5" fill={VIOLET} />
                  <circle cx="80" cy="20" r="3.5" fill={BLUE} />
                </svg>
                <div style={{ color: BLUE, border: `1px solid ${BLUE_LIGHT}` }} className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black">
                  GPS vivo
                </div>
                <div style={{ color: BLUE }} className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-bold italic">
                  Destino: {activeTrip.destination || 'Hospital Metropolitano'} · ~12 min
                </div>
              </div>

              {/* Barra de progreso + botón de checkpoint */}
              {checkpoint && (
                <div className="space-y-4">
                  {/* Progress bar */}
                  <div className="flex gap-1.5 px-1">
                    {[1, 2, 3, 4].map(s => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= stepIndex ? '' : ''}`}
                        style={{ backgroundColor: s <= stepIndex ? BLUE : '#E2E8F0' }}
                      />
                    ))}
                  </div>
                  <p style={{ color: BLUE }} className="text-[10px] font-black italic text-center tracking-widest opacity-60">
                    {checkpoint.label}
                  </p>
                  <button
                    onClick={() => handleUpdateStatus(checkpoint.next)}
                    style={{ backgroundColor: BLUE }}
                    className="w-full text-white py-7 rounded-[2.5rem] font-black italic text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    <span className="material-symbols-outlined text-2xl">{checkpoint.icon}</span>
                    {checkpoint.button}
                  </button>
                </div>
              )}
            </div>
          </div>

        ) : (
          /* ═══════════════════════════════════════════════════
             SIN VIAJE — Lista de solicitudes pendientes
          ═══════════════════════════════════════════════════ */
          <div className="space-y-6 animate-in fade-in duration-700">
            {pendingTrips.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 style={{ color: BLUE }} className="text-sm font-black italic tracking-widest uppercase opacity-40">
                    Solicitudes en tu zona
                  </h3>
                  <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span style={{ color: BLUE }} className="text-[10px] font-bold italic">En vivo</span>
                  </div>
                </div>

                  {pendingTrips.map((trip) => (
                    <div
                      key={trip.id}
                      style={{ border: `2px solid ${BLUE_LIGHT}`, backgroundColor: 'white' }}
                      className="p-6 rounded-[2.5rem] shadow-xl space-y-5 animate-in slide-in-from-right duration-500"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary shrink-0 border border-slate-100">
                          <span className="material-symbols-outlined text-3xl">person</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-black italic text-slate-300 mb-0.5">Pasajero</p>
                          <h4 style={{ color: BLUE }} className="text-xl font-black italic truncate">
                            {trip.lead_name || trip.passenger_name || 'Usuario no registrado'}
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black italic text-slate-300 mb-0.5">Pago</p>
                          <p style={{ color: BLUE }} className="text-lg font-black italic">${trip.price?.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-300 italic">Destino</p>
                          <p style={{ color: BLUE }} className="text-sm font-bold truncate">{trip.destination_name || trip.destination}</p>
                        </div>
                      </div>

                      {/* FICHA MÉDICA EXPRESS */}
                      {(trip.lead_blood_type || trip.lead_allergies) && (
                        <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl space-y-3">
                           <div className="flex items-center gap-2">
                             <span className="material-symbols-outlined text-sm text-red-500 font-bold">emergency_home</span>
                             <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Ficha Médica Crítica</p>
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              {trip.lead_blood_type && (
                                <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase">Sangre</p>
                                  <p className="text-xs font-black text-[#002D72]">{trip.lead_blood_type}</p>
                                </div>
                              )}
                              {trip.lead_allergies && (
                                <div>
                                  <p className="text-[8px] font-black text-slate-400 uppercase">Alergias</p>
                                  <p className="text-xs font-black text-red-600">{trip.lead_allergies}</p>
                                </div>
                              )}
                           </div>
                           {trip.lead_medications && (
                             <div>
                               <p className="text-[8px] font-black text-slate-400 uppercase">Medicación</p>
                               <p className="text-[10px] font-bold text-[#002D72] leading-tight mt-1">{trip.lead_medications}</p>
                             </div>
                           )}
                        </div>
                      )}

                      <button
                        onClick={() => handleAcceptTrip(trip)}
                        style={{ backgroundColor: BLUE }}
                        className="w-full text-white py-5 rounded-[2rem] font-black italic text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
                      >
                        Aceptar Viaje
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  ))}

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-16 space-y-8">
                {/* Ícono animado de espera */}
                <div className="relative">
                  <div
                    style={{ backgroundColor: BLUE_GHOST }}
                    className="absolute inset-0 rounded-full animate-ping scale-125"
                  />
                  <div
                    style={{ border: `2px solid ${BLUE_LIGHT}` }}
                    className="size-44 bg-white rounded-full flex items-center justify-center shadow-inner relative"
                  >
                    <span style={{ color: `${BLUE}30` }} className="material-symbols-outlined text-7xl">
                      person_search
                    </span>
                  </div>
                </div>

                <div className="text-center space-y-2 px-4">
                  <h3 style={{ color: BLUE }} className="text-2xl font-black italic leading-tight">
                    Esperando solicitudes...
                  </h3>
                  <p className="text-slate-400 font-bold text-sm">
                    Tu zona está activa en Cuidapp+.
                  </p>
                  <p className="text-slate-300 font-bold text-xs italic">
                    Cuando un usuario confirme un viaje, aparecerá aquí automáticamente.
                  </p>
                </div>
              </div>
            )}

            {/* Rating del asistente (siempre visible al final) */}
            <div
              style={{ border: `1px solid ${BLUE_LIGHT}` }}
              className="w-full max-w-xs mx-auto bg-white p-5 rounded-3xl flex items-center gap-4 shadow-sm mt-auto"
            >
              <div
                style={{ backgroundColor: BLUE_GHOST }}
                className="size-12 rounded-2xl flex items-center justify-center shrink-0"
              >
                <span style={{ color: BLUE }} className="material-symbols-outlined font-bold fill-1">star</span>
              </div>
              <div>
                <p style={{ color: BLUE }} className="font-black italic text-lg leading-none">
                  {assistant.rating || 5.0} ⭐ — {assistant.name}
                </p>
                <p className="text-slate-400 text-[10px] font-bold mt-1 italic">Asistente verificado Cuidapp+</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Modal de ficha médica ─────────────────────────────────────────── */}
      {showMedicalModal && activeTrip && (
        <div
          style={{ backgroundColor: `${BLUE}F2` }}
          className="fixed inset-0 z-[1000] backdrop-blur-xl flex items-center justify-center p-8 animate-in fade-in duration-300"
        >
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span style={{ color: RED }} className="material-symbols-outlined font-bold">emergency</span>
                <h3 style={{ color: BLUE }} className="text-sm font-black tracking-[0.15em]">Ficha de emergencia</h3>
              </div>
              <button
                onClick={() => setShowMedicalModal(false)}
                style={{ backgroundColor: BLUE_LIGHT, color: BLUE }}
                className="size-9 rounded-full flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="space-y-4">
              {isGuest ? (
                <>
                  <div style={{ backgroundColor: BLUE_GHOST, border: `1px solid ${BLUE_LIGHT}` }} className="p-5 rounded-2xl space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 mb-1">Requerimientos del viaje</p>
                      <p style={{ color: BLUE }} className="text-lg font-bold leading-tight">{getMobilityText()}</p>
                    </div>

                    {(activeTrip?.lead_blood_type || activeTrip?.lead_allergies || activeTrip?.lead_medications) && (
                      <div className="pt-4 border-t border-blue-100 space-y-4">
                         {activeTrip.lead_blood_type && (
                            <div>
                              <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Tipo de sangre</p>
                              <p style={{ color: BLUE }} className="text-lg font-black">{activeTrip.lead_blood_type}</p>
                            </div>
                         )}
                         {activeTrip.lead_allergies && (
                            <div>
                               <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Alergias críticas</p>
                               <p style={{ color: RED }} className="text-lg font-black leading-tight">{activeTrip.lead_allergies}</p>
                            </div>
                         )}
                         {activeTrip.lead_medications && (
                            <div>
                               <p className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Medicación habitual</p>
                               <p style={{ color: BLUE }} className="text-sm font-bold leading-relaxed">{activeTrip.lead_medications}</p>
                            </div>
                         )}
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 text-center px-4 italic">
                    Modo Lead — Información capturada durante la reserva para tu preparación.
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 mb-1">Alergias críticas</p>
                    <p style={{ color: RED }} className="text-lg font-black leading-tight">
                      {memberData?.allergies || 'Ninguna registrada'}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <p className="text-[9px] font-black text-slate-400 mb-1">Medicación habitual</p>
                    <p style={{ color: BLUE }} className="text-sm font-bold leading-relaxed">
                      {memberData?.medications || 'No especificada'}
                    </p>
                  </div>
                  {memberData?.doctor && (
                    <div style={{ backgroundColor: BLUE_GHOST, border: `1px solid ${BLUE_LIGHT}` }} className="p-5 rounded-2xl">
                      <p style={{ color: BLUE }} className="text-[9px] font-black mb-1">Médico de cabecera</p>
                      <p style={{ color: BLUE }} className="text-lg font-black leading-none">{memberData.doctor.name}</p>
                      <a href={`tel:${memberData.doctor.phone}`} style={{ color: BLUE }} className="text-xs font-bold mt-2 inline-flex items-center gap-1">
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
              style={{ backgroundColor: BLUE }}
              className="w-full text-white py-5 rounded-2xl font-black italic text-lg shadow-xl active:scale-95 transition-all"
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
