
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SOSAlertPage: React.FC = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const isFall = location.state?.source === 'fall';
 const [countdown, setCountdown] = useState(3);

 useEffect(() => {
 if (countdown > 0) {
 const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
 return () => clearTimeout(timer);
 }
 }, [countdown]);

 return (
 <div className="h-screen w-full bg-white font-display flex flex-col overflow-hidden relative pb-[160px]">
 <header className="flex items-center p-6 justify-between shrink-0">
 <div className="text-primary flex size-12 items-center justify-center">
 <span className="material-symbols-outlined text-4xl">shield_with_heart</span>
 </div>
 <h2 className="text-sos-red text-xl font-black italic tracking-tight pr-12">
 {isFall ? 'Impacto detectado' : 'Alerta SOS'}
 </h2>
 </header>

 <main className="flex-1 overflow-y-auto px-6 pb-48 text-center">
 <div className="flex justify-center pt-8">
 <div className="relative flex items-center justify-center">
 <div className="absolute w-40 h-40 bg-sos-red/20 rounded-full animate-ping"></div>
 <div className="size-28 bg-sos-red rounded-full flex items-center justify-center text-white shadow-2xl relative z-10 border-4 border-white">
 {countdown > 0 ? (
 <span className="text-5xl font-black">{countdown}</span>
 ) : (
 <span className="material-symbols-outlined text-6xl fill-1">check_circle</span>
 )}
 </div>
 </div>
 </div>

 <h1 className="text-3xl font-black italic pt-8 leading-tight text-primary tracking-tight">
 {countdown > 0 ? (isFall ? 'Iniciando alerta de caída...' : 'Iniciando alerta SOS...') : '¡Ayuda en camino!'}
 </h1>

 {isFall && (
 <p className="text-sos-red font-bold text-sm mt-2 animate-pulse">
 Protocolo de caída grave activado
 </p>
 )}

 <div className="mt-8 space-y-4">
 <button
 onClick={() => navigate('/emergency-qr')}
 className="w-full bg-white border-4 border-sos-red text-sos-red py-5 rounded-2xl flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all"
 >
 <span className="material-symbols-outlined text-4xl fill-1">qr_code_2</span>
 <span className="text-xl font-bold tracking-tight">Ficha médica QR</span>
 </button>
 <p className="text-xs font-bold text-slate-400">Visible para servicios de emergencia</p>
 </div>

 <div className="my-10 space-y-6">
 <div className="w-full h-40 rounded-3xl overflow-hidden relative border-4 border-sos-red/10 shadow-xl">
 <img src="https://picsum.photos/seed/loc/800/400" className="w-full h-full object-cover grayscale opacity-60" alt="Mapa" />
 <div className="absolute bottom-3 right-3 bg-white px-3 py-1.5 rounded-full text-[10px] font-black text-sos-red flex items-center gap-1.5 shadow-lg border border-sos-red/20">
 <span className="size-2 bg-sos-red rounded-full animate-pulse"></span> GPS activo
 </div>
 </div>

 <div className="text-left space-y-4 pb-20">
 <h3 className="text-xs font-bold text-slate-400 ml-2 italic font-bold">Contactos notificados</h3>
 <div className="grid grid-cols-2 gap-4">
 <ContactNotif name="Mamá" img="https://picsum.photos/seed/m/200" />
 <ContactNotif name="Juan P." img="https://picsum.photos/seed/j/200" />
 </div>
 </div>
 </div>
 </main>

 <footer className="absolute bottom-0 inset-x-0 p-8 bg-white/95 backdrop-blur-md border-t border-slate-100 space-y-4 z-[100] shadow-[0_-15px_40px_rgba(0,0,0,0.05)] rounded-t-[2.5rem]">
 <button className="w-full bg-sos-red text-white font-black italic py-5 rounded-2xl flex items-center justify-center gap-3 shadow-2xl shadow-sos-red/30 active:scale-95 transition-all text-xl">
 <span className="material-symbols-outlined text-3xl">call</span>
 Llamar a emergencias
 </button>
 <button
 onClick={() => navigate('/home')}
 className="w-full bg-slate-50 text-slate-400 font-bold py-4 rounded-2xl active:scale-95 transition-all text-sm"
 >
 Cancelar alerta
 </button>
 </footer>
 </div>
 );
};

const ContactNotif: React.FC<{ name: string; img: string }> = ({ name, img }) => (
 <div className="bg-white p-4 rounded-2xl border border-slate-50 shadow-sm flex flex-col items-center">
 <div className="size-16 rounded-full border-2 border-sos-red/20 overflow-hidden mb-3">
 <img src={img} alt={name} className="w-full h-full object-cover" />
 </div>
 <span className="text-sm font-bold text-primary">{name}</span>
 <span className="text-[10px] text-green-500 font-bold flex items-center gap-1 mt-1">
 <span className="material-symbols-outlined text-xs">done_all</span> Avisado
 </span>
 </div>
);

export default SOSAlertPage;
