
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmergencyDetailView: React.FC = () => {
 const navigate = useNavigate();
 const [showConfirmClose, setShowConfirmClose] = useState(false);
 const [record, setRecord] = useState<any>(null);
 const [isInitializing, setIsInitializing] = useState(true);

 useEffect(() => {
 const loadData = () => {
 const saved = localStorage.getItem('cuidapp_member_data');
 if (saved) {
 setRecord(JSON.parse(saved));
 }
 setIsInitializing(false);
 };
 loadData();
 }, []);

 const handleNotifyFamily = () => {
 alert("Protocolo crítico: Notificación enviada a familiares con ubicación GPS exacta y estado de emergencia.");
 };

 const closeAlert = () => {
 navigate(-1);
 };

 if (isInitializing) {
 return (
 <div className="fixed inset-0 bg-sos-red flex items-center justify-center z-[2000] animate-pulse">
 <div className="text-center text-white">
 <span className="material-symbols-outlined text-8xl fill-1 mb-4">emergency</span>
 <p className="font-black text-xl">Iniciando protocolo...</p>
 </div>
 </div>
 );
 }

 if (!record) return null;

 return (
 <div className="min-h-screen bg-white font-plus flex flex-col text-secondary relative animate-in fade-in duration-500 pb-[160px]">
 <header className="bg-sos-red text-white p-6 pt-12 pb-8 rounded-b-[3rem] shadow-xl flex flex-col items-center sticky top-0 z-[110]">
 <div className="flex w-full justify-between items-center mb-6">
 <button
 onClick={() => setShowConfirmClose(true)}
 className="size-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md active:scale-90 transition-all border border-white/20"
 >
 <span className="material-symbols-outlined text-3xl font-bold">close</span>
 </button>
 <div className="flex items-center gap-2">
 <span className="material-symbols-outlined text-2xl fill-1 animate-pulse">emergency</span>
 <h1 className="text-[10px] font-black tracking-[0.4em] italic font-bold">Respuesta médica nivel 1</h1>
 </div>
 <div className="size-12"></div>
 </div>

 <div className="flex flex-col items-center text-center">
 <div className="size-28 rounded-full border-4 border-white/50 overflow-hidden mb-4 shadow-2xl bg-white/10">
 <img src={record.photo || "https://picsum.photos/seed/user/400"} className="w-full h-full object-cover" alt="Socio" />
 </div>
 <h2 className="text-3xl font-black italic tracking-tighter leading-tight">{record.name}</h2>
 <p className="text-white/80 text-xs font-black mt-1">{record.age} años • Socio verificado</p>
 </div>
 </header>

 <main className="flex-1 p-6 space-y-10 pb-48">
 <div className="grid grid-cols-2 gap-5">
 <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 flex flex-col items-center text-center shadow-md">
 <p className="text-[10px] font-black text-slate-400 mb-2">Grupo sanguíneo</p>
 <p className="text-6xl font-black text-sos-red tracking-tighter leading-none">{record.bloodType}</p>
 </div>
 <div className="bg-sos-red/5 p-6 rounded-[2.5rem] border-2 border-sos-red/20 flex flex-col items-center text-center shadow-md">
 <p className="text-lg font-black text-sos-red leading-tight tracking-tighter">
 {record.allergies || 'Ninguna'}
 </p>
 </div>
 </div>

 {/* Seguro Médico en Vista de Emergencia */}
 {(record.insuranceName || record.insurancePolicy) && (
 <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-primary/10 flex items-center gap-5 shadow-sm">
 <div className="size-14 rounded-2xl bg-white flex items-center justify-center text-primary border border-primary/5">
 <span className="material-symbols-outlined text-3xl font-bold">verified_user</span>
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 mb-1">Seguro médico activo</p>
 <p className="text-lg font-black text-secondary leading-none">{record.insuranceName}</p>
 <p className="text-[10px] font-bold text-slate-400 mt-2">Póliza: {record.insurancePolicy}</p>
 </div>
 </div>
 )}

 <section className="space-y-6">
 <div className="space-y-4">
 <div className="flex items-center gap-3 ml-2">
 <span className="material-symbols-outlined text-sos-red font-bold">medical_services</span>
 <h3 className="text-[10px] font-black tracking-[0.4em] text-slate-400 italic font-bold">Expediente de transferencia</h3>
 </div>

 <div className="bg-white rounded-[2.5rem] border-2 border-slate-100 p-8 space-y-8 shadow-sm">
 <div>
 <p className="text-[10px] font-black text-slate-400 mb-3 flex items-center gap-2">
 <span className="size-2 bg-sos-red rounded-full"></span>
 Medicación actual
 </p>
 <p className="font-bold text-secondary leading-relaxed text-lg">
 {record.medications || 'No registrada'}
 </p>
 </div>

 {record.mobilityNeeds && record.mobilityNeeds.length > 0 && (
 <div>
 <p className="text-[10px] font-black text-slate-400 mb-3 flex items-center gap-2">
 <span className="size-2 bg-primary rounded-full"></span>
 Movilidad y apoyo
 </p>
 <div className="flex flex-wrap gap-2">
 {record.mobilityNeeds.map((n: string) => (
 <span key={n} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black border border-primary/20">
 {n}
 </span>
 ))}
 </div>
 </div>
 )}
 </div>
 </div>
 </section>

 {/* QR de Transferencia */}
 <section className="flex flex-col items-center text-center space-y-8 bg-slate-50 py-12 rounded-[3.5rem] border border-slate-100 shadow-inner">
 <div className="bg-white p-8 rounded-[3rem] shadow-2xl border-4 border-slate-200 scale-110 relative group">
 <div className="size-60 flex flex-wrap gap-1 p-2 bg-white">
 {Array.from({ length: 400 }).map((_, i) => (
 <div key={i} className={`size-1.5 ${Math.random() > 0.4 ? 'bg-secondary' : 'bg-white'}`}></div>
 ))}
 </div>
 </div>
 <div className="max-w-xs px-6">
 <h4 className="text-xl font-bold italic tracking-tighter text-secondary">Pasaporte médico QR</h4>
 <p className="text-[11px] font-bold text-slate-400 mt-3 leading-relaxed">
 Muestre este código al paramédico para sincronizar el historial clínico completo con la ambulancia.
 </p>
 </div>
 </section>

 {/* Familiar Responsable */}
 {record.emergencyContact && (
 <section className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 flex items-center justify-between shadow-md">
 <div className="flex items-center gap-5">
 <div className="size-16 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
 <span className="material-symbols-outlined text-4xl font-bold">family_restroom</span>
 </div>
 <div>
 <p className="text-[10px] font-black text-slate-400 leading-none mb-1">Contacto familiar</p>
 <p className="text-2xl font-black italic text-secondary">
 {record.emergencyContact.name}
 </p>
 </div>
 </div>
 <a
 href={`tel:${record.emergencyContact.phone}`}
 className="size-16 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-xl active:scale-90 transition-all shadow-secondary/20"
 >
 <span className="material-symbols-outlined fill-1 text-3xl">call</span>
 </a>
 </section>
 )}
 </main>

 <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-8 bg-white/95 backdrop-blur-xl border-t border-slate-100 grid grid-cols-2 gap-4 z-[120] rounded-t-[3rem] shadow-[0_-25px_60px_rgba(0,0,0,0.15)]">
 <button
 onClick={handleNotifyFamily}
 className="bg-secondary text-white py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-secondary/20 italic font-bold"
 >
 <span className="material-symbols-outlined font-bold">notifications_active</span>
 Avisar familia
 </button>
 <a
 href="tel:911"
 className="bg-sos-red text-white py-6 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-2xl shadow-sos-red/40 active:scale-95 transition-all animate-pulse"
 >
 <span className="material-symbols-outlined fill-1 text-3xl">emergency</span>
 Llamar 911
 </a>
 </footer>

 {showConfirmClose && (
 <div className="fixed inset-0 z-[2000] bg-secondary/90 backdrop-blur-md flex items-center justify-center p-8 animate-in fade-in duration-300">
 <div className="bg-white w-full rounded-[3.5rem] p-12 text-center space-y-8 animate-in zoom-in duration-300 shadow-2xl">
 <div className="size-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto border-4 border-slate-100">
 <span className="material-symbols-outlined text-6xl">report_off</span>
 </div>
 <div className="space-y-4">
 <h3 className="text-3xl font-black tracking-tighter text-secondary italic font-bold">¿Finalizar alerta?</h3>
 <p className="text-slate-500 text-sm font-bold leading-relaxed px-4">
 Confirme que el socio ha sido atendido por personal médico antes de cerrar el protocolo de emergencia.
 </p>
 </div>
 <div className="flex flex-col gap-4">
 <button
 onClick={closeAlert}
 className="w-full bg-secondary text-white py-6 rounded-2xl font-black active:scale-95 transition-all text-lg shadow-xl italic font-bold"
 >
 Sí, cerrar alerta
 </button>
 <button
 onClick={() => setShowConfirmClose(false)}
 className="w-full py-2 text-slate-400 font-black text-[10px] tracking-[0.4em]"
 >
 Mantener ficha abierta
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
};

export default EmergencyDetailView;
