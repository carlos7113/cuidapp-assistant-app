
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantQRPage: React.FC = () => {
 const navigate = useNavigate();
 const [userName, setUserName] = useState('Usuario');
 const [record, setRecord] = useState<any>({
 bloodType: 'O+',
 allergies: 'Desconocidas',
 conditions: [],
 medications: [],
 contacts: []
 });

 useEffect(() => {
 const saved = localStorage.getItem('cuidapp_member_data');
 if (saved) {
 const parsed = JSON.parse(saved);
 setRecord(parsed);
 setUserName(parsed.name || 'Usuario');
 }
 }, []);

 return (
 <div className="font-plus min-h-screen bg-white text-secondary flex flex-col p-6 overflow-y-auto pb-[160px]">
 <header className="flex items-center justify-between mb-8 sticky top-0 bg-white/95 backdrop-blur-md py-2 z-50">
 <button onClick={() => navigate(-1)} className="size-14 rounded-full bg-slate-50 flex items-center justify-center text-primary shadow-sm active:scale-90 transition-all border border-slate-100">
 <span className="material-symbols-outlined text-3xl font-bold">arrow_back</span>
 </button>
 <div className="text-center">
 <h1 className="text-xl font-bold text-sos-red italic font-bold">Pasaporte médico QR</h1>
 <p className="text-[9px] font-black text-slate-400">Escaneo crítico de emergencia</p>
 </div>
 <div className="size-14"></div>
 </header>

 <main className="space-y-10 flex-1">
 {/* Bloque QR de Alto Contraste */}
 <div className="bg-sos-red rounded-[3rem] p-10 flex flex-col items-center shadow-2xl shadow-sos-red/30">
 <div className="bg-white p-6 rounded-[2.5rem] shadow-inner mb-8 border-8 border-white/20">
 <div className="size-64 flex flex-wrap gap-1">
 {Array.from({ length: 400 }).map((_, i) => (
 <div key={i} className={`size-1.5 ${Math.random() > 0.3 ? 'bg-secondary' : 'bg-white'}`}></div>
 ))}
 </div>
 </div>
 <div className="text-center text-white space-y-2">
 <p className="text-2xl font-black tracking-tighter">{userName}</p>
 <div className="bg-white/20 px-6 py-2 rounded-full inline-block border border-white/30">
 <span className="text-[10px] font-black italic">Sangre: {record.bloodType}</span>
 </div>
 </div>
 </div>

 {/* Datos de Supervivencia */}
 <section className="space-y-6">
 <h2 className="text-[10px] font-black italic tracking-[0.4em] text-slate-400 ml-4">Información de supervivencia</h2>

 <div className="grid grid-cols-1 gap-4">
 <div className="bg-slate-50 p-6 rounded-[2rem] border-l-8 border-sos-red">
 <p className="text-[10px] font-black italic mb-2 text-sos-red">Alergias críticas</p>
 <p className="text-2xl font-black text-secondary tracking-tighter">{record.allergies || 'Ninguna'}</p>
 </div>

 <div className="bg-slate-50 p-6 rounded-[2rem] border-l-8 border-primary">
 <p className="text-[10px] font-black italic mb-2 text-primary">Medicación activa</p>
 <p className="font-bold text-secondary text-lg leading-tight">
 {record.medications || 'No registrada'}
 </p>
 </div>

 {record.emergencyContact && (
 <div className="bg-slate-50 p-6 rounded-[2rem] border-l-8 border-secondary">
 <p className="text-[10px] font-black mb-2 text-secondary">Contacto familiar</p>
 <div className="flex justify-between items-center">
 <div>
 <p className="text-xl font-black text-secondary">{record.emergencyContact.name}</p>
 <p className="text-xs font-bold text-slate-500 ">{record.emergencyContact.phone}</p>
 </div>
 <a href={`tel:${record.emergencyContact.phone}`} className="size-12 rounded-xl bg-secondary text-white flex items-center justify-center">
 <span className="material-symbols-outlined fill-1">call</span>
 </a>
 </div>
 </div>
 )}
 </div>
 </section>

 <div className="p-8 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4 text-center">
 <span className="material-symbols-outlined text-sos-red text-4xl animate-pulse">emergency</span>
 <p className="text-[10px] font-black text-slate-500 leading-relaxed pr-4">
 Este código expone datos médicos vitales para socorristas certificados y personal hospitalario.
 </p>
 </div>
 </main>
 </div>
 );
};

export default AssistantQRPage;
