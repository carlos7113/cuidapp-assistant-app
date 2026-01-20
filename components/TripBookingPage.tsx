
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
  const [step, setStep] = useState<'selection' | 'assistant' | 'confirmation'>('selection');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null);
  const [manualAddress, setManualAddress] = useState('');
  
  const [isMember, setIsMember] = useState(false);
  const [memberPlan, setMemberPlan] = useState('none');
  const [shareFamily, setShareFamily] = useState(false);
  const [familyContact, setFamilyContact] = useState({ name: '', phone: '' });

  // Ayudante de capitalización (Sentence/Title case)
  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  // Estados para lógica de precios dinámica
  const [tripMetrics, setTripMetrics] = useState({
    distance: 0,
    baseCost: 1.50,
    bonoCost: 2.50,
    bonoDiscount: 0,
    trayectoCost: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const registered = localStorage.getItem('cuidapp_is_registered') === 'true';
    const plan = localStorage.getItem('cuidapp_selected_plan') || 'none';
    const memberDataRaw = localStorage.getItem('cuidapp_member_data');
    
    setIsMember(registered);
    setMemberPlan(plan);
    
    if (registered && memberDataRaw) {
      const parsed = JSON.parse(memberDataRaw);
      setShareFamily(true);
      if (parsed.emergencyContact) {
        setFamilyContact({
          name: parsed.emergencyContact.name || '',
          phone: parsed.emergencyContact.phone || ''
        });
      }
    }
  }, []);

  const generateDynamicPrice = () => {
    const dist = parseFloat((Math.random() * (12.0 - 3.5) + 3.5).toFixed(1));
    const base = 1.50;
    let bono = 2.50;
    let discount = 0;

    if (memberPlan === 'plenitude') {
      discount = 2.50;
    } else if (memberPlan === 'wellbeing') {
      discount = 2.50 * 0.25;
    }

    const rate = 0.45;
    const trayecto = dist * rate;
    const total = base + (bono - discount) + trayecto;

    setTripMetrics({
      distance: dist,
      baseCost: base,
      bonoCost: bono,
      bonoDiscount: discount,
      trayectoCost: trayecto,
      totalPrice: total
    });
  };

  const handleSelectDest = (dest: Destination) => {
    setSelectedDest(dest);
    setStep('assistant');
  };

  const handleManualConfirm = () => {
    if (manualAddress.length < 3) return;
    setSelectedDest({ name: manualAddress, address: 'Dirección manual', icon: 'location_on' });
    setStep('assistant');
  };

  const handleSelectAssistant = (ast: Assistant) => {
    setSelectedAssistant(ast);
    generateDynamicPrice();
    setStep('confirmation');
  };

  const handleFinalConfirm = () => {
    if (!selectedAssistant || !selectedDest) return;

    const savedNeeds = JSON.parse(localStorage.getItem('cuidapp_user_needs') || '[]');
    const otherNeed = localStorage.getItem('cuidapp_other_need') || '';

    const activeTrip = {
      status: 'searching',
      destination: selectedDest.name,
      price: tripMetrics.totalPrice,
      distanceSimulated: tripMetrics.distance,
      sharedWithFamily: shareFamily,
      familyContact: shareFamily ? { ...familyContact, name: capitalize(familyContact.name) } : null,
      timestamp: new Date().toISOString(),
      mobilityNeeds: savedNeeds,
      otherNeedText: otherNeed,
      assistant: {
        name: selectedAssistant.name,
        photo: selectedAssistant.img,
        rating: selectedAssistant.rating,
        vehicle: selectedAssistant.car,
        plate: selectedAssistant.plate
      }
    };

    localStorage.setItem('cuidapp_active_trip', JSON.stringify(activeTrip));
    navigate('/searching-assistant');
  };

  return (
    <div className="font-plus h-screen flex flex-col bg-white overflow-y-auto pb-48 text-dark-blue custom-scrollbar">
      <Header 
        title={step === 'selection' ? '¿A dónde vamos?' : step === 'assistant' ? 'Asistentes disponibles' : 'Resumen de viaje'} 
        onBackClick={() => {
          if (step === 'confirmation') setStep('assistant');
          else if (step === 'assistant') setStep('selection');
          else navigate('/home');
        }}
      />
      
      <main className="flex-1 p-6 space-y-8">
        {step === 'selection' && (
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
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary text-white px-5 py-2 rounded-xl font-black text-xs uppercase italic"
              >
                Confirmar
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-2 italic">Recomendados</h3>
              <DestinationButton 
                icon="medical_services" 
                name="Hospital Metropolitano" 
                address="Av. San Gabriel, Quito" 
                onClick={() => handleSelectDest({name: 'Hospital Metropolitano', address: 'Av. San Gabriel, Quito', icon: 'medical_services'})} 
              />
              <DestinationButton 
                icon="park" 
                name="Parque La Carolina" 
                address="Av. Amazonas, Quito" 
                onClick={() => handleSelectDest({name: 'Parque La Carolina', address: 'Av. Amazonas, Quito', icon: 'park'})} 
              />
              <DestinationButton 
                icon="medication" 
                name="Farmacia Fybeca" 
                address="Av. 6 de Diciembre y Portugal, Quito" 
                onClick={() => handleSelectDest({name: 'Farmacia Fybeca', address: 'Av. 6 de Diciembre y Portugal, Quito', icon: 'medication'})} 
              />
            </div>
          </div>
        )}

        {step === 'assistant' && (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
             <div className="px-4 -mt-4 mb-2">
                <p className="text-sm font-bold text-dark-blue/60 italic">Profesionales certificados cerca de tu ubicación</p>
             </div>
             {MOCK_ASSISTANTS.map((ast) => (
               <button 
                 key={ast.id} 
                 onClick={() => handleSelectAssistant(ast)} 
                 className="w-full bg-white p-6 rounded-[2.5rem] shadow-xl border-4 border-transparent hover:border-primary flex items-center gap-6 text-left active:scale-95 transition-all group"
               >
                 <div className="size-24 rounded-full border-4 border-primary/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform">
                   <img src={ast.img} className="w-full h-full object-cover" alt={ast.name} />
                 </div>
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className="text-2xl font-black italic text-secondary leading-none">{ast.name}</h3>
                       <div className="flex items-center gap-1 bg-primary/5 px-2 py-1 rounded-lg">
                          <span className="material-symbols-outlined text-xs text-primary fill-1">star</span>
                          <span className="text-xs font-black text-primary">{ast.rating}</span>
                       </div>
                    </div>
                    <p className="text-sm font-bold text-slate-400 italic">{ast.car} • {ast.trips} viajes</p>
                 </div>
               </button>
             ))}
          </div>
        )}

        {step === 'confirmation' && (
          <div className="space-y-8 animate-in slide-in-from-right duration-300">
            <div className="bg-secondary p-8 rounded-[3rem] text-white shadow-xl italic">
               <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Tu destino</p>
               <h3 className="text-2xl font-black leading-tight truncate">{selectedDest?.name}</h3>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2.5rem] space-y-4 border border-slate-100">
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400 italic">Tarifa base</span>
                  <span className="font-black text-secondary">${tripMetrics.baseCost.toFixed(2)}</span>
               </div>
               <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-400 italic">Bono de asistencia senior</span>
                     <span className={`font-black ${tripMetrics.bonoDiscount >= 2.50 ? 'text-green-500 line-through' : 'text-secondary'}`}>$2.50</span>
                  </div>
                  {tripMetrics.bonoDiscount > 0 && (
                    <div className="flex justify-between items-center text-green-500">
                       <span className="text-[10px] font-black uppercase tracking-widest italic">
                        Descuento Plan {memberPlan === 'plenitude' ? 'Plenitud' : memberPlan === 'wellbeing' ? 'Bienestar' : 'Socio'}
                       </span>
                       <span className="font-black">-${tripMetrics.bonoDiscount.toFixed(2)}</span>
                    </div>
                  )}
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-400 italic">
                    Trayecto ({tripMetrics.distance} km x $0.45)
                  </span>
                  <span className="font-black text-secondary">${tripMetrics.trayectoCost.toFixed(2)}</span>
               </div>
               <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                  <p className="text-xl font-black italic text-secondary tracking-wide">Total final</p>
                  <p className="text-[40px] font-black text-primary tracking-tighter leading-none">
                    ${tripMetrics.totalPrice.toFixed(2)}
                  </p>
               </div>
            </div>

            <div className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] space-y-6 shadow-sm">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <span className="material-symbols-outlined text-primary font-bold">family_restroom</span>
                     <p className="font-black italic text-secondary">Compartir con familiar</p>
                  </div>
                  <label className="ios-switch">
                    <input type="checkbox" checked={shareFamily} onChange={() => setShareFamily(!shareFamily)} />
                    <span className="slider"></span>
                  </label>
               </div>
               
               {shareFamily && (
                 <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-primary ml-2 uppercase tracking-widest italic">Nombre del familiar</label>
                       <input 
                         type="text" 
                         placeholder="Ej: Mariana Pérez" 
                         value={familyContact.name}
                         onChange={(e) => setFamilyContact({...familyContact, name: e.target.value})}
                         className="w-full h-14 px-5 bg-slate-50 border-none rounded-xl font-bold text-lg text-secondary focus:ring-1 focus:ring-primary outline-none"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-primary ml-2 uppercase tracking-widest italic">Teléfono / WhatsApp</label>
                       <input 
                         type="tel" 
                         placeholder="Ej: 0987654321" 
                         value={familyContact.phone}
                         onChange={(e) => setFamilyContact({...familyContact, phone: e.target.value})}
                         className="w-full h-14 px-5 bg-slate-50 border-none rounded-xl font-bold text-lg text-secondary focus:ring-1 focus:ring-primary outline-none"
                       />
                    </div>
                    
                    {familyContact.name.length > 2 && (
                      <div className="pt-2 space-y-1 animate-in slide-in-from-top-2 duration-300">
                         <p className="text-[11px] font-bold text-slate-400 italic leading-tight">
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

            <button 
              onClick={handleFinalConfirm}
              className="w-full bg-primary text-white font-black py-7 px-4 rounded-[2.5rem] shadow-2xl shadow-primary/40 text-xl md:text-2xl italic active:scale-95 transition-all mb-10 leading-tight"
            >
               Confirmar y solicitar ahora en Cuidapp+
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const DestinationButton: React.FC<{ icon: string; name: string; address: string; onClick: () => void }> = ({ icon, name, address, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl shadow-sm text-left group active:bg-slate-50 transition-all">
    <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-2xl">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-secondary text-lg font-black italic truncate leading-none mb-1">{name}</p>
      <p className="text-slate-400 text-xs font-medium truncate italic">{address}</p>
    </div>
  </button>
);

export default TripBookingPage;
