
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isRegistered = localStorage.getItem('cuidapp_is_registered') === 'true';
    if (isRegistered) {
      navigate('/member-home');
    }
  }, [navigate]);

  const [userData, setUserData] = useState(() => {
    const savedName = localStorage.getItem('cuidapp_user_name');
    const savedRole = localStorage.getItem('cuidapp_role') || 'senior';
    const savedStatus = localStorage.getItem('cuidapp_status') || 'guest';
    const savedNeeds = JSON.parse(localStorage.getItem('cuidapp_user_needs') || '[]');
    return { 
      name: savedName || '', 
      role: savedRole, 
      status: savedStatus, 
      needs: savedNeeds 
    };
  });

  const [activeTrip, setActiveTrip] = useState<any>(null);
  const [otherNeedText, setOtherNeedText] = useState(localStorage.getItem('cuidapp_other_need') || '');

  useEffect(() => {
    const checkActiveTrip = () => {
      const saved = localStorage.getItem('cuidapp_active_trip');
      if (saved) {
        const tripData = JSON.parse(saved);
        if (['searching', 'arriving', 'active', 'in_progress'].includes(tripData.status)) {
          setActiveTrip(tripData);
        } else {
          setActiveTrip(null);
        }
      } else {
        setActiveTrip(null);
      }
    };
    
    checkActiveTrip();
    const interval = setInterval(checkActiveTrip, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const labels: Record<string, string> = {
      'wheelchair': 'Uso de silla de ruedas',
      'walking_aid': 'Apoyo para caminar',
      'sensory_aid': 'Asistencia visual o auditiva'
    };
    
    let specialNeedsText = userData.needs
      .filter(n => n !== 'other')
      .map(n => labels[n])
      .join(', ');

    if (userData.needs.includes('other') && otherNeedText.trim()) {
      specialNeedsText = specialNeedsText 
        ? `${specialNeedsText}. Otra: ${otherNeedText}` 
        : otherNeedText;
    }

    if (specialNeedsText) {
      localStorage.setItem('cuidapp_special_needs', specialNeedsText);
    } else if (localStorage.getItem('cuidapp_special_needs')) {
      localStorage.setItem('cuidapp_special_needs', 'Sin requerimientos especiales');
    }
  }, [userData.needs, otherNeedText]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserData(prev => ({ ...prev, name: newName }));
    localStorage.setItem('cuidapp_user_name', newName);
  };

  const toggleNeed = (need: string) => {
    setUserData(prev => {
      const isSelected = prev.needs.includes(need);
      const newNeeds = isSelected 
        ? prev.needs.filter((n: string) => n !== need) 
        : [...prev.needs, need];
      localStorage.setItem('cuidapp_user_needs', JSON.stringify(newNeeds));
      return { ...prev, needs: newNeeds };
    });
  };

  const handleStartBooking = () => {
    if (activeTrip) {
      navigate('/active-trip');
      return;
    }
    if (!userData.name.trim()) {
      alert("Por favor, ingresa tu nombre para continuar.");
      return;
    }
    navigate('/trip-booking');
  };

  return (
    <div className="font-plus h-screen bg-white flex flex-col overflow-y-auto pb-[160px] relative text-dark-blue custom-scrollbar">
      <Header 
        title={userData.status === 'guest' ? 'Cuidapp+' : `Hola, ${userData.name.split(' ')[0] || 'usuario'}`} 
        showBack={userData.status === 'guest'}
        onBackClick={() => navigate('/')}
      />

      {activeTrip && (
        <button 
          onClick={() => navigate('/active-trip')}
          className="mx-6 mt-4 p-4 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-between animate-in slide-in-from-top duration-300"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary animate-pulse font-bold">directions_car</span>
            <p className="text-xs font-bold text-primary italic">Tienes un viaje en curso. Toca para ver.</p>
          </div>
          <span className="material-symbols-outlined text-primary text-sm">chevron_right</span>
        </button>
      )}

      <main className="flex-1 px-6 py-8 space-y-10">
        <div className="flex flex-col gap-10 py-4 animate-in fade-in duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-black italic tracking-tighter text-primary leading-tight">¿Listo para salir?</h2>
            <p className="text-secondary font-bold text-lg">Completa tu perfil de viaje para una asistencia personalizada.</p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-50 space-y-8 shadow-xl">
             <div className="space-y-3">
                <label className="text-[13px] font-bold text-primary italic ml-2">¿Cuál es tu nombre?</label>
                <input 
                  type="text" 
                  value={userData.name}
                  onChange={handleNameChange}
                  placeholder="Escribe tu nombre..."
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-secondary outline-none focus:border-primary transition-all placeholder:text-slate-300"
                />
             </div>

             <div className="space-y-4 pt-2">
                <p className="text-[13px] font-bold text-primary italic ml-2">Necesidades de movilidad</p>
                <div className="grid grid-cols-1 gap-3">
                   <RequirementToggle 
                      icon="accessible"
                      label="Uso de silla de ruedas" 
                      active={userData.needs.includes('wheelchair')} 
                      onClick={() => toggleNeed('wheelchair')} 
                   />
                   <RequirementToggle 
                      icon="blind"
                      label="Apoyo para caminar" 
                      active={userData.needs.includes('walking_aid')} 
                      onClick={() => toggleNeed('walking_aid')} 
                   />
                   <RequirementToggle 
                      icon="hearing"
                      label="Asistencia visual o auditiva" 
                      active={userData.needs.includes('sensory_aid')} 
                      onClick={() => toggleNeed('sensory_aid')} 
                   />
                   <RequirementToggle 
                      icon="add_circle"
                      label="Otra necesidad" 
                      active={userData.needs.includes('other')} 
                      onClick={() => toggleNeed('other')} 
                   />
                </div>

                {userData.needs.includes('other') && (
                  <div className="animate-in slide-in-from-top-4 duration-300 mt-2">
                     <input 
                       type="text"
                       value={otherNeedText}
                       onChange={(e) => {
                         const val = e.target.value;
                         setOtherNeedText(val);
                         localStorage.setItem('cuidapp_other_need', val);
                       }}
                       placeholder="Describe cómo podemos ayudarte..."
                       className="w-full h-14 px-5 bg-slate-50 border-2 border-slate-100 rounded-xl font-bold text-sm text-secondary outline-none focus:border-primary transition-all placeholder:text-slate-300"
                     />
                  </div>
                )}
             </div>
          </div>

          <button 
            onClick={handleStartBooking}
            className="w-full bg-primary text-white py-10 rounded-[3rem] shadow-2xl shadow-primary/40 flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group mt-6"
          >
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-5xl font-bold">
                {activeTrip ? 'location_on' : 'local_taxi'}
              </span>
              <span className="text-2xl font-black italic tracking-tight">
                {activeTrip ? 'Ver viaje en curso' : 'Solicitar transporte ahora'}
              </span>
            </div>
            <p className="text-xs font-bold opacity-70 italic">Facturación única para invitados</p>
          </button>
        </div>
      </main>
    </div>
  );
};

const RequirementToggle: React.FC<{ icon: string; label: string; active: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-4 w-full p-5 border-2 rounded-2xl transition-all ${active ? 'bg-primary/5 border-primary shadow-sm' : 'bg-slate-50 border-slate-100'}`}>
    <span className={`material-symbols-outlined text-2xl ${active ? 'text-primary' : 'text-slate-300'}`}>{icon}</span>
    <span className={`flex-1 text-[15px] font-bold italic text-left ${active ? 'text-secondary' : 'text-slate-400'}`}>{label}</span>
    <div className={`size-6 rounded-md border-2 flex items-center justify-center transition-all ${active ? 'bg-primary border-primary' : 'border-slate-200'}`}>
       {active && <span className="material-symbols-outlined text-white text-xs font-bold">check</span>}
    </div>
  </button>
);

export default HomePage;
