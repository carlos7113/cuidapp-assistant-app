
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TripSummaryPage: React.FC = () => {
 const navigate = useNavigate();
 const [assistantName, setAssistantName] = useState('Tu asistente');
 const [userName, setUserName] = useState("");
 const [paymentMethod, setPaymentMethod] = useState('Efectivo');
 const [rating, setRating] = useState(0);

 useEffect(() => {
 const savedIdentity = localStorage.getItem('cuidapp_assistant_identity');
 if (savedIdentity) {
 setAssistantName(JSON.parse(savedIdentity).name);
 }

 // Recuperar datos del usuario para el encabezado de impacto
 // Recuperar datos del usuario con Proper Case
 const rawName = localStorage.getItem('cuidapp_user_name') || 'Carlos';
 const properName = rawName.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
 const firstName = properName.split(' ')[0];
 setUserName(firstName); // Solo primer nombre para el encabezado de impacto

 // Recuperar método de pago
 const activeTrip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
 const method = activeTrip.paymentMethod || localStorage.getItem('cuidapp_payment_method') || 'cash';
 setPaymentMethod(method === 'card' ? 'Tarjeta' : 'Efectivo');
 }, []);

 const handleFinalExit = () => {
 // PROTECCIÓN DE CICLO DE VIAJE - MANIFIESTO CUIDAPP+
 // 1. Limpieza Total de Memoria (Hard Reset)
 localStorage.clear();

 // 2. Redirección OBLIGATORIA a la raíz (RoleSelector)
 navigate('/');
 };

 return (
 <div className="h-screen w-full font-plus flex flex-col bg-white overflow-y-auto text-secondary custom-scrollbar pb-[160px]">
 {/* Official Brand Header (Synchronized with RoleSelectorPage) */}
 <div className="mt-[30px] text-center shrink-0 overflow-visible">
 <div className="size-20 bg-primary rounded-[2.2rem] flex items-center justify-center shadow-2xl shadow-primary/20 mx-auto mb-6 animate-in fade-in zoom-in duration-700">
 <span className="material-symbols-outlined text-4xl text-white fill-1">shield_with_heart</span>
 </div>
 <h1 className="text-4xl font-black tracking-tighter text-primary italic font-bold">Cuidapp+</h1>
 </div>

 <header className="pt-8 pb-8 px-12 bg-white text-center space-y-2 relative">
 <h1 className="text-[26px] font-bold italic text-primary tracking-tight">¡Llegaste a salvo, {userName}!</h1>
 <p className="text-secondary font-bold italic text-[13px] opacity-80 mb-6">Protocolo de protección senior completado con éxito</p>

 <div className="size-[60px] bg-primary/10 rounded-full flex items-center justify-center mx-auto border-4 border-white animate-in zoom-in">
 <span className="material-symbols-outlined text-[32px] font-bold text-primary">verified</span>
 </div>
 </header>

 <main className="p-8 space-y-10 flex-1">
 {/* Gráfico Biométrico con bordes y sombras suaves */}
 <section className="bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center space-y-8">
 <div className="space-y-2">
 <h2 className="text-[11px] font-black text-secondary tracking-[0.3em] italic font-bold">Estado biométrico promediado</h2>
 <p className="text-base font-bold text-secondary/60">Tu salud se mantuvo estable durante todo el trayecto</p>
 </div>

 <div className="grid grid-cols-2 gap-6">
 <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,82,204,0.06)] border border-slate-50 flex flex-col items-center">
 <span className="material-symbols-outlined text-primary text-3xl mb-2">favorite</span>
 <p className="text-3xl font-black text-secondary">72<span className="text-[10px] ml-1">bpm</span></p>
 <p className="text-[8px] font-black text-slate-300">Ritmo cardíaco</p>
 </div>
 <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_rgba(0,82,204,0.06)] border border-slate-50 flex flex-col items-center">
 <span className="material-symbols-outlined text-primary text-3xl mb-2">air</span>
 <p className="text-3xl font-black text-secondary">98<span className="text-[10px] ml-1">%</span></p>
 <p className="text-[8px] font-black text-slate-300">Oxigenación</p>
 </div>
 </div>
 </section>

 {/* Reporte Financiero (Urgente) */}
 <section className="bg-primary/5 border border-primary/10 p-8 rounded-[2.5rem] shadow-sm flex flex-col gap-4">
 <div className="flex items-center gap-3">
 <span className="material-symbols-outlined text-primary text-2xl font-bold">payments</span>
 <h3 className="text-lg font-black text-secondary leading-none tracking-wide italic font-bold">Resumen del servicio</h3>
 </div>
 <div className="space-y-3 mt-2">
 <div className="flex justify-between items-center">
 <p className="text-sm font-bold text-secondary">Costo del viaje:</p>
 <p className="text-xl font-black text-primary">$7.60 USD</p>
 </div>
 <div className="flex justify-between items-center border-t border-primary/10 pt-3">
 <p className="text-sm font-bold text-secondary">Método de pago:</p>
 <p className="text-sm font-black text-secondary">{paymentMethod}</p>
 </div>
 </div>
 </section>

 <section className="bg-white border-2 border-slate-50 p-8 rounded-[2.5rem] shadow-xl flex flex-col items-center gap-6">
 <div className="text-center">
 <p className="text-[10px] font-black italic text-slate-300 mb-1">Tu asistente profesional</p>
 <h3 className="text-2xl font-black italic text-secondary">{assistantName}</h3>
 </div>
 <div className="flex gap-2 text-primary">
 {[1, 2, 3, 4, 5].map(s => (
 <button
 key={s}
 onClick={() => setRating(s)}
 className="active:scale-90 transition-all focus:outline-none"
 >
 <span className={`material-symbols-outlined text-4xl ${s <= rating ? 'fill-1' : ''} ${s <= rating ? 'text-primary' : 'text-primary/20'}`}>
 star
 </span>
 </button>
 ))}
 </div>
 <button
 className={`w-full py-6 rounded-[2rem] font-bold text-base border transition-all tracking-[0.04em] ${rating > 0
 ? 'bg-primary text-white border-transparent shadow-lg shadow-primary/20'
 : 'bg-primary/5 text-primary border-primary/10'
 }`}
 >
 Calificar a {assistantName.split(' ')[0]}
 </button>
 </section>

 <div className="space-y-4 pt-4">
 <button
 onClick={() => navigate('/home')}
 className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black italic text-xl shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/20 tracking-[0.04em]"
 >
 Nueva solicitud
 </button>

 <button
 onClick={handleFinalExit}
 className="w-full py-4 text-slate-400 font-bold text-sm tracking-wide active:scale-95 transition-all italic font-bold"
 >
 Finalizar y volver al inicio
 </button>
 </div>
 </main>
 </div>
 );
};

export default TripSummaryPage;
