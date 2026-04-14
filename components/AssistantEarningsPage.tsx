
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AssistantEarningsPage: React.FC = () => {
 const navigate = useNavigate();
 const [earnings, setEarnings] = useState({ balance: 0, history: [] });

 useEffect(() => {
 const data = JSON.parse(localStorage.getItem('cuidapp_earnings') || '{"balance": 0, "history": []}');
 setEarnings(data);
 }, []);

 return (
 <div className="font-plus bg-white min-h-screen pb-[160px]">
 <header className="px-6 py-8 bg-white border-b border-slate-50 flex justify-between items-center sticky top-0 z-50">
 <div className="flex items-center gap-4">
 <div className="size-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
 <span className="material-symbols-outlined text-3xl font-bold">payments</span>
 </div>
 <div>
 <h1 className="text-2xl font-black text-secondary leading-none italic font-bold">Ganancias</h1>
 <p className="text-[10px] font-bold text-slate-400 mt-1">Resumen de pagos</p>
 </div>
 </div>
 <button onClick={() => navigate('/account')} className="size-14 rounded-full border-2 border-secondary/10 overflow-hidden shadow-sm">
 <img src="https://picsum.photos/seed/driver1/200" className="w-full h-full object-cover" alt="Perfil" />
 </button>
 </header>

 <main className="p-6 space-y-8">
 <section className="bg-secondary p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
 <div className="relative z-10">
 <p className="text-white/60 text-[10px] font-black tracking-[0.4em] mb-2">Total acumulado hoy</p>
 <h3 className="text-5xl font-black tracking-tighter italic font-bold">${earnings.balance.toFixed(2)}</h3>
 
 <div className="flex gap-4 mt-8">
 <div className="bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black ">{earnings.history.length} servicios</div>
 <div className="bg-white/10 px-4 py-2 rounded-xl text-[9px] font-black ">Protección senior activa</div>
 </div>
 </div>
 <span className="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[10rem] opacity-10">paid</span>
 </section>

 <section className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
 <p className="text-[10px] font-black text-slate-400 mb-6">Actividad semanal</p>
 <div className="h-32 flex items-end justify-between gap-3 px-2">
 {[40, 25, 60, 30, 45, 80, 50].map((h, i) => (
 <div key={i} className={`flex-1 rounded-t-xl transition-all duration-700 ${i === 5 ? 'bg-secondary shadow-lg' : 'bg-secondary/20'}`} style={{ height: `${h}%` }}></div>
 ))}
 </div>
 <div className="flex justify-between mt-4 px-2">
 {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => <span key={d} className="text-[10px] font-bold text-slate-300">{d}</span>)}
 </div>
 </section>

 <section className="space-y-6">
 <h3 className="text-[11px] font-bold text-slate-400 ml-4 italic font-bold">Historial de servicios</h3>
 <div className="space-y-4">
 {earnings.history.length === 0 ? (
 <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
 <p className="text-xs font-bold text-slate-400">No hay servicios completados aún</p>
 </div>
 ) : (
 earnings.history.map((item: any, idx) => (
 <div key={idx} className="bg-white border border-slate-50 p-6 rounded-[20px] shadow-sm flex items-center justify-between group active:scale-95 transition-all">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300">
 <span className="material-symbols-outlined text-2xl">history</span>
 </div>
 <div>
 <h4 className="font-black text-secondary leading-tight">{item.user}</h4>
 <p className="text-[9px] font-bold text-slate-400 mt-0.5">{item.date}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-xl font-black text-primary leading-none">${parseFloat(item.total.toString().replace('$', '')).toFixed(2)}</p>
 <div className="flex items-center gap-1 justify-end text-green-500 mt-1">
 <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
 <p className="text-[8px] font-black tracking-tighter">Bono asistido incluido</p>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 </section>

 <button className="w-full py-5 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-300 font-bold text-[11px] hover:border-secondary hover:text-secondary transition-all italic font-bold">
 <span className="material-symbols-outlined">download</span>
 Descargar resumen de facturación (PDF)
 </button>
 </main>
 </div>
 );
};

export default AssistantEarningsPage;
