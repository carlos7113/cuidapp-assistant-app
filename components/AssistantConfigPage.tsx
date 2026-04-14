
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantConfigPage: React.FC = () => {
 const navigate = useNavigate();
 return (
 <div className="font-display h-screen overflow-y-auto pb-[160px]">
 <header className="sticky top-0 z-[80] bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
 <button onClick={() => navigate('/')} className="size-14 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 text-primary shadow-sm active:scale-90 transition-all">
 <span className="material-symbols-outlined text-3xl font-bold">arrow_back_ios_new</span>
 </button>
 <h2 className="text-xl font-black italic tracking-tight">Finalizar Plan</h2>
 <div className="size-14"></div>
 </header>

 <main className="p-6 space-y-8">
 <div className="relative h-64 rounded-[3rem] overflow-hidden group shadow-2xl border-4 border-white dark:border-slate-800">
 <img src="https://picsum.photos/seed/config/800/600" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Banner" />
 <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
 <div className="absolute bottom-8 left-8 right-8">
 <p className="text-white text-4xl font-black italic leading-tight tracking-tighter">Plan Verificado</p>
 <p className="text-white/80 text-xs font-black italic tracking-[0.3em] mt-2">Protección activada</p>
 </div>
 </div>

 <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border-4 border-primary overflow-hidden animate-pulse">
 <div className="bg-primary py-8 flex items-center justify-center text-white">
 <span className="text-6xl font-black tracking-tighter">$5.00 OFF</span>
 </div>
 <div className="p-10 text-center">
 <div className="flex items-center justify-center gap-2 mb-3 text-primary">
 <span className="material-symbols-outlined text-xl fill-1">stars</span>
 <p className="text-[10px] font-black tracking-[0.4em]">Beneficio Senior Gold</p>
 </div>
 <p className="text-3xl font-black leading-tight mb-4">¡Bono Aplicado!</p>
 <p className="text-slate-500 text-base font-bold leading-relaxed">Se ha descontado automáticamente de tu plan de movilidad protegida.</p>
 <div className="flex justify-center items-center mt-8 gap-4">
 <span className="bg-primary/10 text-primary px-6 py-2 rounded-xl text-lg font-black border-2 border-primary/20 font-mono">CUIDA5</span>
 <div className="bg-green-100 text-green-600 px-6 py-2 rounded-full text-xs font-black ">LISTO</div>
 </div>
 </div>
 </div>

 <div className="space-y-6">
 <h3 className="text-xs font-black tracking-[0.3em] text-slate-400 ml-4 italic font-bold">Garantías Incluidas</h3>
 <div className="space-y-4">
 <ServiceRow icon="emergency" label="Ficha Médica" desc="Información vital en vivo" color="red" />
 <ServiceRow icon="support_agent" label="Asistente Senior" desc="Certificado por Cuidapp+" color="primary" />
 </div>
 </div>

 <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] flex gap-5 border border-slate-100 dark:border-slate-800">
 <span className="material-symbols-outlined text-primary text-3xl">info</span>
 <p className="text-xs text-slate-500 font-black leading-relaxed tracking-tight">
 Al confirmar, autorizas el acceso temporal a tu historial de salud para los servicios de asistencia coordinados.
 </p>
 </div>
 </main>

 <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] p-8 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 pb-12 z-[100]">
 <button onClick={() => navigate('/')} className="w-full h-20 bg-primary text-white font-black italic rounded-2xl shadow-2xl shadow-primary/40 active:scale-95 transition-all text-xl ">
 CONFIRMAR Y ACTIVAR
 </button>
 </footer>
 </div>
 );
};

const ServiceRow: React.FC<{ icon: string; label: string; desc: string; color: string }> = ({ icon, label, desc, color }) => (
 <button className="w-full flex items-center gap-6 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm active:scale-95 transition-all text-left group italic font-bold">
 <div className={`size-16 rounded-2xl flex items-center justify-center ${color === 'red' ? 'bg-sos-red/10 text-sos-red' : 'bg-primary/10 text-primary'} group-hover:scale-110 transition-transform`}>
 <span className="material-symbols-outlined text-4xl font-bold">{icon}</span>
 </div>
 <div className="flex-1">
 <p className="font-black text-xl leading-tight">{label}</p>
 <p className="text-slate-400 text-[10px] font-black mt-1">{desc}</p>
 </div>
 <span className="material-symbols-outlined text-slate-200 group-hover:text-primary transition-colors text-3xl">chevron_right</span>
 </button>
);

export default AssistantConfigPage;
