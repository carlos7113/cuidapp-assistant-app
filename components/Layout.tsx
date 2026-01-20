
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const Header: React.FC<{ 
  title: string; 
  showBack?: boolean; 
  transparent?: boolean;
  onBackClick?: () => void;
}> = ({ title, showBack = true, transparent = false, onBackClick }) => {
  const navigate = useNavigate();
  return (
    <header className={`sticky top-0 z-[100] px-6 py-6 flex items-center justify-between border-b ${transparent ? 'bg-transparent border-transparent' : 'bg-white/95 backdrop-blur-md border-slate-50 shadow-sm'}`}>
      <div className="w-14 h-14 flex items-center">
        {showBack && (
          <button 
            onClick={onBackClick || (() => navigate(-1))} 
            className="size-14 -ml-2 rounded-full flex items-center justify-center text-primary active:bg-slate-50 transition-all"
            aria-label="Volver atrás"
          >
            <span className="material-symbols-outlined text-4xl font-bold">arrow_back</span>
          </button>
        )}
      </div>
      <h2 className="text-2xl font-black italic tracking-tighter text-primary text-center flex-1 truncate px-2">
        {title}
      </h2>
      <div className="w-14 h-14"></div>
    </header>
  );
};

export const SOSButton: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const status = localStorage.getItem('cuidapp_status') || 'guest';
  const tripSaved = localStorage.getItem('cuidapp_active_trip');
  const trip = tripSaved ? JSON.parse(tripSaved) : { status: 'idle' };
  
  const isGuest = status === 'guest';
  const hasActiveTrip = ['searching', 'arriving', 'active', 'in_progress'].includes(trip.status);
  
  if (isGuest && !hasActiveTrip) return null;

  const hideSOS = ['/sos-alert', '/trip-summary', '/emergency-qr'].includes(location.pathname);
  if (hideSOS) return null;

  const handleSOS = () => {
    navigate('/sos-alert');
  };

  return (
    <div className="absolute bottom-[110px] right-[16px] z-[500] pointer-events-none">
      <button 
        onClick={handleSOS}
        className="pointer-events-auto size-20 bg-sos-red text-white rounded-full shadow-[0_15px_40px_rgba(231,76,60,0.4)] active:scale-90 transition-all border-4 border-white flex flex-col items-center justify-center group"
      >
        <span className="material-symbols-outlined text-4xl font-bold fill-1 group-hover:scale-110 transition-transform">emergency_home</span>
        <span className="text-[10px] font-black tracking-tighter mt-[-4px] italic text-white uppercase">SOS</span>
      </button>
    </div>
  );
};

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('cuidapp_role');
  const status = localStorage.getItem('cuidapp_status') || 'guest';
  
  const seniorItems = [
    { id: 'home', icon: 'home', label: 'Inicio', path: '/member-home', premium: false },
    { id: 'health', icon: 'medical_services', label: 'Salud', path: '/medical-record', premium: true },
    { id: 'trips', icon: 'calendar_month', label: 'Agenda', path: '/trip-booking', premium: true },
    { id: 'family', icon: 'family_restroom', label: 'Familia', path: '/family', premium: true },
    { id: 'account', icon: 'person', label: 'Perfil', path: '/account', premium: false },
  ];

  const assistantItems = [
    { id: 'home', icon: 'local_taxi', label: 'Solicitudes', path: '/assistant-home', premium: false },
    { id: 'earnings', icon: 'payments', label: 'Ganancias', path: '/assistant-earnings', premium: false },
    { id: 'account', icon: 'person', label: 'Perfil', path: '/account', premium: false },
  ];

  const navItems = role === 'assistant' ? assistantItems : seniorItems;

  const isActive = (path: string) => {
    if (path === '/home' || path === '/member-home') {
      return location.pathname === '/home' || location.pathname === '/member-home' || location.pathname === '/active-trip' || location.pathname === '/searching-assistant';
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (item: any) => {
    if (status === 'guest' && item.premium) {
      navigate('/account');
    } else {
      navigate(item.path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-slate-100 h-28 px-2 flex justify-around items-center z-[400] shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      {navItems.map((item) => {
        const active = isActive(item.path);
        const isLocked = status === 'guest' && item.premium;
        const colorClass = active ? 'text-primary' : 'text-[#94A3B8]';
        
        return (
          <button 
            key={item.id}
            onClick={() => handleNavClick(item)}
            className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 h-full active:scale-90 relative`}
          >
            <span className={`material-symbols-outlined text-3xl transition-colors ${active ? 'fill-1' : ''} ${colorClass}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold italic transition-colors ${colorClass}`}>
              {item.label}
            </span>
            {isLocked && (
              <span className="material-symbols-outlined absolute top-4 right-4 text-[10px] font-black text-slate-200">lock</span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
