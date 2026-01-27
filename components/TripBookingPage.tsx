
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

interface Destination {
  name: string;
  address: string;
  icon: string;
}

interface Assistant {
  id: string;
  name: string;
  img: string;
  rating: number;
  trips: number;
  car: string;
  plate: string;
}

const MOCK_ASSISTANTS: Assistant[] = [
  { id: 'ast_1', name: 'Elena Martínez', img: 'https://picsum.photos/seed/elena/200', rating: 5.0, trips: 850, car: 'Hyundai Accent', plate: 'PBT-5678' },
  { id: 'ast_2', name: 'Carlos Rodríguez', img: 'https://picsum.photos/seed/carlos/200', rating: 4.9, trips: 1240, car: 'Toyota Corolla', plate: 'PBX-1234' }
];

const TripBookingPage: React.FC = () => {
  const navigate = useNavigate();
  // STRICT STATE MACHINE: idle -> service_selection -> searching -> assistant_selection
  const [step, setStep] = useState<'idle' | 'service_selection' | 'searching' | 'assistant_selection'>('idle');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [manualAddress, setManualAddress] = useState('');

  const [isMember, setIsMember] = useState(false);
  const [memberPlan, setMemberPlan] = useState('none');
  const [shareFamily, setShareFamily] = useState(false);
  const [familyContact, setFamilyContact] = useState({ name: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [bookingType, setBookingType] = useState<'single' | 'recurrent'>('single');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [serviceLevel, setServiceLevel] = useState<'basic' | 'assisted' | 'premium'>('basic');
  const [serviceConfirmed, setServiceConfirmed] = useState(false);

  // Ayudante de capitalización (Sentence/Title case)
  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Estados para lógica de precios dinámica
  const [tripMetrics, setTripMetrics] = useState({
    distance: 0,
    baseCost: 1.50,
    distanceCost: 0,
    assistanceBonus: 0,
    bonoDiscount: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const registered = localStorage.getItem('cuidapp_is_registered') === 'true';
    const plan = localStorage.getItem('cuidapp_selected_plan') || 'none';

    setIsMember(registered);
    setMemberPlan(plan);

    // 🔒 SEGUNDA CAPA DE SEGURIDAD: Limpieza de datos de familiares para invitados
    if (!registered) {
      // Forzar inicialización vacía para invitados
      setFamilyContact({ name: '', phone: '' });
      setShareFamily(false);

      // Eliminar cualquier dato residual de familiares
      localStorage.removeItem('cuidapp_familiar_name');
      localStorage.removeItem('cuidapp_familiar_phone');
      localStorage.removeItem('cuidapp_familiar_share');

      console.log('🔒 TripBookingPage: Datos de familiares limpiados para invitado');
    } else {
      // Solo recuperar datos si es usuario registrado
      const savedFamName = localStorage.getItem('cuidapp_familiar_name');
      const savedFamPhone = localStorage.getItem('cuidapp_familiar_phone');
      const savedShare = localStorage.getItem('cuidapp_familiar_share') === 'true';

      if (savedFamName || savedFamPhone) {
        setFamilyContact({ name: savedFamName || '', phone: savedFamPhone || '' });
      }
      setShareFamily(savedShare);
    }

    // Recuperar método de pago (permitido para todos)
    const savedPay = localStorage.getItem('cuidapp_payment_method');
    if (savedPay) setPaymentMethod(savedPay as 'cash' | 'card');

    // Recuperar estado de viaje activo si existe
    const savedTrip = localStorage.getItem('cuidapp_active_trip');
    if (savedTrip) {
      const trip = JSON.parse(savedTrip);

      // If we are recovering a trip, check status to restore step
      if (trip.destination) {
        setSelectedDest({ name: trip.destination, address: '', icon: 'location_on' });
        // If price is set, we might be in service_selection or later
        if (trip.price) {
          setTripMetrics(prev => ({
            ...prev,
            totalPrice: trip.price,
            distance: trip.distanceSimulated
          }));
        }

        if (trip.status === 'confirmation' && !trip.assistant) {
          // Intermediate state recovery
          setStep('service_selection');
        } else if (trip.status === 'confirmation' && trip.assistant) {
          // Logic says if assistant fits, it should be active trip, but if lingering:
          setStep('assistant_selection');
        }
      }
    }
  }, []);

  const generateDynamicPrice = (level: 'basic' | 'assisted' | 'premium' = serviceLevel) => {
    // Definición de Bonos de Asistencia
    const assistanceBonuses = {
      basic: 2.50,
      assisted: 5.00,
      premium: 15.00
    };

    const baseTariff = 1.50;
    const pricePerKm = 0.45;
    const distanceCost = tripMetrics.distance * pricePerKm;
    const bonus = assistanceBonuses[level];

    let subtotal = baseTariff + distanceCost + bonus;
    let discount = 0;

    // Lógica de descuento por plan de suscripción
    if (memberPlan === 'plenitude') {
      discount = subtotal * 0.20; // 20% descuento Plenitud
    } else if (memberPlan === 'wellbeing') {
      discount = subtotal * 0.10; // 10% descuento Bienestar
    }

    const finalPrice = subtotal - discount;

    const newMetrics = {
      distance: tripMetrics.distance,
      baseCost: baseTariff,
      distanceCost: distanceCost,
      assistanceBonus: bonus,
      bonoDiscount: discount,
      totalPrice: bookingType === 'recurrent' ? finalPrice * 12 : finalPrice
    };
    setTripMetrics(newMetrics);
    return newMetrics;
  };

  // Helper para calcular precio visual en tarjetas sin actualizar estado global
  const calculateCardPrice = (level: 'basic' | 'assisted' | 'premium') => {
    const base = 1.50;
    const perKm = 0.45;
    const distCost = tripMetrics.distance * perKm;
    const bonos = { basic: 2.50, assisted: 5.00, premium: 15.00 };
    const sub = base + distCost + bonos[level];
    // Aplicar descuento actual para visualización precisa
    let disc = 0;
    if (memberPlan === 'plenitude') disc = sub * 0.20;
    else if (memberPlan === 'wellbeing') disc = sub * 0.10;
    return (sub - disc).toFixed(2);
  };

  // TRANSITION: IDLE -> SERVICE_SELECTION
  const handleSelectDest = (dest: Destination) => {
    setSelectedDest(dest);

    // 1. Simulate Distance IMMEDIATELY
    const randomDistance = Math.floor(Math.random() * (120 - 30 + 1) + 30) / 10;
    setTripMetrics(prev => ({ ...prev, distance: randomDistance }));

    // 2. Persist Destination immediately
    const currentTrip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
    localStorage.setItem('cuidapp_active_trip', JSON.stringify({
      ...currentTrip,
      destination: dest.name,
      distanceSimulated: randomDistance,
      status: 'confirmation' // Marker for in-progress
    }));

    // 3. Change Step
    setStep('service_selection');
  };

  const handleManualConfirm = () => {
    if (manualAddress.length < 3) return;
    const dest = { name: manualAddress, address: 'Dirección manual', icon: 'location_on' };
    handleSelectDest(dest);
  };

  // TRANSITION: SERVICE_SELECTION -> ASSISTANT_SELECTION
  const handleConfirmService = () => {
    // 1. Calculate Final Price
    const metrics = generateDynamicPrice(serviceLevel);

    // 2. Persist Price & Service Level
    const currentTrip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
    const updatedTrip = {
      ...currentTrip,
      price: metrics.totalPrice,
      serviceLevel: serviceLevel,
      paymentMethod: paymentMethod,
      bookingType: bookingType,
      recurrenceDays: selectedDays,
      sharedWithFamily: shareFamily,
      familyContact: shareFamily ? { ...familyContact, name: capitalize(familyContact.name) } : null,
    };
    localStorage.setItem('cuidapp_active_trip', JSON.stringify(updatedTrip));

    // 3. Change Step to SEARCHING (Interim)
    setStep('searching');

    // 4. Timeout to transition to ASSISTANT_SELECTION
    setTimeout(() => {
      setStep('assistant_selection');
    }, 2500);
  };

  const handleSelectAssistant = (ast: Assistant) => {
    // Final step: choose assistant and go
    setSelectedAssistant(ast);
    handleFinalConfirm(ast);
  };

  const handleFinalConfirm = (ast: Assistant) => {
    if (!ast || !selectedDest) return;

    const currentTrip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
    const guestData = JSON.parse(localStorage.getItem('cuidapp_guest_data') || '{}');
    const isGuest = !localStorage.getItem('cuidapp_is_registered') || localStorage.getItem('cuidapp_is_registered') === 'false';

    const activeTrip = {
      ...currentTrip,
      status: 'arriving',
      assistant: { // Saving assistant info
        name: ast.name,
        photo: ast.img,
        rating: ast.rating,
        vehicle: ast.car,
        plate: ast.plate
      },
      timestamp: new Date().toISOString(),
      mobilityNeeds: isGuest ? guestData.needs : [],
      otherNeedText: isGuest ? guestData.otherNeed : '',
      isGuest: isGuest,
      passengerName: isGuest ? (guestData.name || 'Invitado') : null
    };

    localStorage.setItem('cuidapp_active_trip', JSON.stringify(activeTrip));
    navigate('/active-trip');
  };


  return (
    <div className="font-plus h-screen flex flex-col bg-white overflow-y-auto pb-[180px] text-[#002D72] custom-scrollbar selection:bg-primary/10">

      <Header
        title={step === 'idle' ? '¿A dónde vamos?' : step === 'service_selection' ? 'Elige tu servicio' : step === 'searching' ? 'Buscando asistente...' : 'Elige tu asistente'}
        onBackClick={() => {
          if (step === 'assistant_selection') {
            setStep('service_selection');
          } else if (step === 'searching') {
            // If they back out of searching, go back to service
            setStep('service_selection');
          } else if (step === 'service_selection') {
            setStep('idle');
            // Limpiar selección al volver
            setSelectedDest(null);
          } else {
            navigate(-1);
          }
        }}

      />

      <main className="flex-1 p-6 space-y-8">
        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 relative">
          <button
            onClick={() => {
              setBookingType('single');
            }}
            className={`flex-1 py-3 rounded-xl font-black italic text-sm transition-all ${bookingType === 'single' ? 'bg-primary text-white shadow-md' : 'text-primary/70 bg-[#F3F0FF]/50'}`}
          >
            Viaje único
          </button>
          <button
            onClick={() => {
              if (!isMember) {
                setShowPremiumModal(true);
              } else {
                setBookingType('recurrent');
              }
            }}
            className={`flex-1 py-3 rounded-xl font-black italic text-sm transition-all flex items-center justify-center gap-2 ${bookingType === 'recurrent' ? 'bg-primary text-white shadow-md' : 'bg-[#F3F0FF] text-[#0052CC]'}`}
          >
            {!isMember && <span className="material-symbols-outlined text-xs">lock</span>}
            <span className="italic">Plan de terapias</span>
            {!isMember && (
              <span className="bg-[#0052CC] text-white text-[8px] px-1.5 py-0.5 rounded-full uppercase not-italic font-black tracking-tighter">Premium</span>
            )}
          </button>

        </div>

        {bookingType === 'recurrent' && step === 'idle' && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            {isMember ? (
              <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10">
                <h3 className="text-secondary font-black italic mb-4 uppercase text-[10px] tracking-widest">Días de terapia (Recurrencia)</h3>
                <div className="flex justify-between gap-2">
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'].map((day) => (
                    <button
                      key={day}
                      onClick={() => {
                        setSelectedDays(prev =>
                          prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                        );
                      }}
                      className={`size-10 rounded-full font-black text-[10px] transition-all border-2 ${selectedDays.includes(day) ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-primary/60 font-bold mt-4 italic">* Las terapias incluyen asistencia certificada en cada trayecto.</p>
              </div>
            ) : (
              /* En lugar de la tarjeta fija, mostramos un aviso sutil de que se requiere ser socio */
              <div className="bg-[#F3F0FF] p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary font-bold">lock</span>
                  <p className="text-xs font-black italic text-primary">Disponible para Socios Cuidapp+</p>
                </div>
                <button
                  onClick={() => setShowPremiumModal(true)}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-black italic text-[10px] uppercase"
                >
                  Saber más
                </button>
              </div>
            )}
          </div>
        )}



        {step === 'idle' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="relative">
              <input
                type="text"
                placeholder="Escribe tu destino..."
                value={manualAddress}
                onChange={(e) => setManualAddress(e.target.value)}
                className="w-full h-18 pl-14 pr-32 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg outline-none focus:border-primary transition-all text-secondary"
              />
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary">search</span>
              <button
                onClick={handleManualConfirm}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-xl font-black text-xs"
              >
                Confirmar
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-300 ml-2">Recomendados</h3>
              <DestinationButton
                icon="medical_services"
                name="Hospital Metropolitano"
                address="Av. San Gabriel, Quito"
                onClick={() => handleSelectDest({ name: 'Hospital Metropolitano', address: 'Av. San Gabriel, Quito', icon: 'medical_services' })}
              />
              <DestinationButton
                icon="park"
                name="Parque La Carolina"
                address="Av. Amazonas, Quito"
                onClick={() => handleSelectDest({ name: 'Parque La Carolina', address: 'Av. Amazonas, Quito', icon: 'park' })}
              />
              <DestinationButton
                icon="medication"
                name="Farmacia Fybeca"
                address="Av. 6 de Diciembre y Portugal, Quito"
                onClick={() => handleSelectDest({ name: 'Farmacia Fybeca', address: 'Av. 6 de Diciembre y Portugal, Quito', icon: 'medication' })}
              />
            </div>
          </div>
        )}

        {step === 'service_selection' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">

            {/* DESTINATION SUMMARY (Non-editable here) */}
            <div className="bg-secondary p-6 rounded-[2rem] text-white shadow-xl flex items-center gap-4">
              <div className="size-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest">Destino</p>
                <h3 className="text-lg font-black italic leading-tight truncate max-w-[200px]">{selectedDest?.name}</h3>
              </div>
            </div>

            {/* 1. Selección de Nivel de Servicio (Main Focus) */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black italic tracking-[0.3em] text-slate-300 ml-2 uppercase">Selecciona tu nivel de servicio</h3>
              <div className="grid gap-4">
                <ServiceLevelButton
                  active={serviceLevel === 'basic'}
                  icon="directions_car"
                  title="Traslado Básico"
                  desc="Punto A a Punto B + Bono $2.50"
                  price={`$${calculateCardPrice('basic')}`}
                  onClick={() => { setServiceLevel('basic'); }}
                />
                <ServiceLevelButton
                  active={serviceLevel === 'assisted'}
                  icon="volunteer_activism"
                  title="Traslado Asistido"
                  desc="Asistencia puerta a puerta + Bono $5.00"
                  price={`$${calculateCardPrice('assisted')}`}
                  onClick={() => { setServiceLevel('assisted'); }}
                />
                <ServiceLevelButton
                  active={serviceLevel === 'premium'}
                  icon="clinical_notes"
                  title="Traslado Premium"
                  desc="Cita médica completa + Bono $15.00"
                  price={`$${calculateCardPrice('premium')}`}
                  onClick={() => { setServiceLevel('premium'); }}
                />
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-4 border border-slate-100">
              {/* Simplified Total View - Breakdown removed as requested */}
              <div className="flex justify-between items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-[#F3F0FF] text-primary rounded-xl flex items-center justify-center">
                    <span className="material-symbols-outlined">route</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Distancia estimada</p>
                    <p className="text-lg font-black italic text-secondary">{tripMetrics.distance} km</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Precio total</p>
                  <p className="text-3xl font-black text-[#6C5CE7] tracking-tight">
                    ${calculateCardPrice(serviceLevel)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary font-bold">family_restroom</span>
                  <p className="font-black text-secondary italic">Compartir con familiar</p>
                </div>
                <label className="ios-switch">
                  <input type="checkbox" checked={shareFamily} onChange={() => {
                    const newVal = !shareFamily;
                    setShareFamily(newVal);
                    localStorage.setItem('cuidapp_familiar_share', String(newVal));
                  }} />
                  <span className="slider"></span>
                </label>
              </div>

              {shareFamily && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary ml-2">Nombre del familiar</label>
                    <input
                      type="text"
                      placeholder="Ej: Mariana Pérez"
                      value={familyContact.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFamilyContact({ ...familyContact, name: val });
                        localStorage.setItem('cuidapp_familiar_name', val);
                      }}
                      className="w-full h-14 px-5 bg-slate-50 border-2 border-secondary/20 rounded-xl font-bold text-lg text-secondary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary ml-2">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="Ej: 0987654321"
                      value={familyContact.phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFamilyContact({ ...familyContact, phone: val });
                        localStorage.setItem('cuidapp_familiar_phone', val);
                      }}
                      className="w-full h-14 px-5 bg-slate-50 border-2 border-secondary/20 rounded-xl font-bold text-lg text-secondary focus:ring-2 focus:ring-secondary focus:border-secondary outline-none"
                    />
                  </div>

                  {familyContact.name.length > 2 && (
                    <div className="pt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                      <p className="text-[11px] font-bold text-slate-400 leading-tight">
                        Se enviará un enlace de seguimiento automático a {capitalize(familyContact.name)}.
                      </p>
                      <p className="text-[11px] font-black text-secondary tracking-tight">
                        cuidapp.link/seguimiento-{familyContact.name.toLowerCase().split(' ')[0]}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-4 px-4">
              <h3 className="text-[10px] font-black italic tracking-[0.3em] text-slate-300 ml-2 uppercase">Método de pago</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setPaymentMethod('cash');
                    localStorage.setItem('cuidapp_payment_method', 'cash');
                    const trip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
                    localStorage.setItem('cuidapp_active_trip', JSON.stringify({ ...trip, paymentMethod: 'cash' }));
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}
                >
                  <span className="material-symbols-outlined text-3xl text-primary">payments</span>
                  <span className={`text-[11px] font-black italic ${paymentMethod === 'cash' ? 'text-primary' : 'text-secondary'}`}>Efectivo</span>
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('card');
                    localStorage.setItem('cuidapp_payment_method', 'card');
                    const trip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
                    localStorage.setItem('cuidapp_active_trip', JSON.stringify({ ...trip, paymentMethod: 'card' }));
                    if (!localStorage.getItem('cuidapp_saved_card')) {
                      navigate('/checkout');
                    }
                  }}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-primary bg-primary/5 shadow-md' : 'border-slate-100 bg-white opacity-60'}`}
                >
                  <span className="material-symbols-outlined text-3xl text-primary">credit_card</span>
                  <span className={`text-[11px] font-black italic ${paymentMethod === 'card' ? 'text-primary' : 'text-secondary'}`}>Tarjeta</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full py-4 border-2 border-dashed border-primary/30 rounded-2xl flex items-center justify-center gap-2 text-primary active:scale-95 transition-all animate-in fade-in slide-in-from-top-2"
                >
                  <span className="material-symbols-outlined text-xl">
                    {localStorage.getItem('cuidapp_saved_card') ? 'edit' : 'add'}
                  </span>
                  <span className="text-xs font-black italic">
                    {localStorage.getItem('cuidapp_saved_card')
                      ? `Tarjeta: ${JSON.parse(localStorage.getItem('cuidapp_saved_card')!).brand} **** ${JSON.parse(localStorage.getItem('cuidapp_saved_card')!).last4}`
                      : 'Agregar tarjeta para este viaje'}
                  </span>
                </button>
              )}
            </div>

            <button
              onClick={handleConfirmService}
              disabled={paymentMethod === 'card' && !localStorage.getItem('cuidapp_saved_card')}
              className={`w-full font-black italic py-7 px-4 rounded-[2.5rem] shadow-2xl text-xl md:text-2xl active:scale-95 transition-all mb-10 leading-tight ${paymentMethod === 'card' && !localStorage.getItem('cuidapp_saved_card')
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-primary text-white shadow-primary/40'
                }`}
            >
              {paymentMethod === 'card' && !localStorage.getItem('cuidapp_saved_card')
                ? 'Por favor, agrega una tarjeta'
                : 'Confirmar y buscar asistente'}
            </button>
          </div>
        )}


        {step === 'searching' && (
          <div className="flex flex-col items-center justify-center h-[60vh] animate-in fade-in duration-500">
            <div className="relative size-32 mb-8">
              <div className="absolute inset-0 border-8 border-slate-100 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary animate-pulse">person_search</span>
              </div>
            </div>
            <h3 className="text-2xl font-black italic text-primary animate-pulse">Buscando asistente...</h3>
            <p className="text-slate-400 font-bold mt-2 animate-in slide-in-from-bottom-2">Contactando profesionales certificados</p>
          </div>
        )}

        {step === 'assistant_selection' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            {/* 1. Selección de Asistente (CLEANED UP - No Tabs, No Price Banner) */}
            <div className="space-y-4">
              <div className="ml-2">
                <h3 className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase animate-in slide-in-from-left">Elige tu asistente</h3>
                <p className="text-sm font-black italic text-[#0052CC] mt-1 leading-tight">Estos son los profesionales certificados disponibles ahora</p>
              </div>

              <div className="space-y-3 pt-2">
                {MOCK_ASSISTANTS.map(ast => (
                  <button
                    key={ast.id}
                    onClick={() => handleSelectAssistant(ast)}
                    className={`w-full flex items-center gap-4 p-4 bg-white border-2 rounded-3xl shadow-sm transition-all active:scale-95 hover:scale-[1.02] text-left group
                        ${selectedAssistant?.id === ast.id ? 'border-primary ring-4 ring-primary/10' : 'border-slate-100 hover:border-primary/30'}
                      `}
                  >
                    <img src={ast.img} className="size-16 rounded-2xl object-cover shadow-md group-hover:shadow-lg transition-shadow" alt={ast.name} />
                    <div className="flex-1">
                      <p className="text-secondary font-black italic text-lg leading-none group-hover:text-primary transition-colors">{ast.name}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex bg-yellow-400/20 px-1.5 py-0.5 rounded-md items-center gap-1">
                          <span className="material-symbols-outlined text-[10px] text-yellow-600 font-bold">star</span>
                          <span className="text-[10px] font-black text-yellow-700">{ast.rating}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 italic">{ast.trips} viajes realizados</span>
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-slate-300">
                        <span className="material-symbols-outlined text-[10px]">directions_car</span>
                        <span className="text-[10px] font-bold italic">{ast.car}</span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">arrow_forward_ios</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Motor de Ventas: Premium Sales Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-secondary/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[24px] shadow-[0_22px_70px_8px_rgba(108,92,231,0.15)] relative overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Cabecera del Modal */}
            <div className="p-8 pb-4 flex justify-between items-start">
              <div className="size-14 bg-[#F3F0FF] rounded-2xl flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-3xl font-bold">verified_user</span>
              </div>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="size-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 active:scale-90 transition-all font-bold"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="px-8 pb-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-black italic text-primary leading-tight">Lleva tu cuidado al siguiente nivel</h2>
                  <div className="inline-block bg-[#F3F0FF] px-3 py-1 rounded-lg">
                    <p className="text-[#0052CC] text-xs font-black italic">💡 Ahorra un 25% en cada viaje</p>
                  </div>
                </div>
                <p className="text-[#0052CC] text-sm font-bold italic leading-relaxed">
                  Optimiza tus rutinas de salud. Con una suscripción mensual, eliminas el costo del Bono de Movilidad y aseguras tu ahorro familiar.
                </p>
              </div>

              <div className="space-y-4 py-2">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-600">
                    <span className="material-symbols-outlined font-black">stars</span>
                  </div>
                  <p className="text-sm font-black italic text-secondary">Asistente de confianza fijo (siempre la misma persona).</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined font-black">event_repeat</span>
                  </div>
                  <p className="text-sm font-black italic text-secondary">Agendamiento mensual automático de citas médicas.</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-green-400/10 flex items-center justify-center text-green-600">
                    <span className="material-symbols-outlined font-black">redeem</span>
                  </div>
                  <p className="text-sm font-black italic text-secondary">Bono de movilidad 100% cubierto (ahorro inmediato).</p>
                </div>
              </div>

              <button
                onClick={() => navigate('/plan-selection')}
                className="w-full bg-primary text-white py-6 rounded-2xl font-black italic text-lg shadow-xl shadow-primary/30 active:scale-95 transition-all tracking-tight"
              >
                Ver planes y ahorrar ahora
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ServiceLevelButton: React.FC<{ active: boolean; icon: string; title: string; desc: string; price: string; onClick: () => void }> = ({ active, icon, title, desc, price, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all text-left group ${active ? 'border-[#6C5CE7] bg-white shadow-xl shadow-primary/5' : 'border-slate-100 bg-white opacity-60'}`}
  >
    <div className={`size-12 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-[#6C5CE7] text-white' : 'bg-slate-100 text-slate-400'}`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div className="flex-1">
      <p className={`text-base font-black italic leading-none transition-colors ${active ? 'text-[#6C5CE7]' : 'text-[#002D72]'}`}>{title}</p>
      <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{desc}</p>
    </div>
    <div className="text-right">
      <p className={`text-xl font-bold text-[#0052CC] ${active ? 'scale-105' : ''} transition-transform`}>{price}</p>
    </div>
  </button>
);


const DestinationButton: React.FC<{ icon: string; name: string; address: string; onClick: () => void }> = ({ icon, name, address, onClick }) => (

  <button onClick={onClick} className="w-full flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm text-left group active:bg-slate-50 transition-all">
    <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-secondary text-lg font-black truncate leading-none mb-1">{name}</p>
      <p className="text-slate-400 text-xs font-medium truncate">{address}</p>
    </div>
  </button>
);

export default TripBookingPage;
