
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PlanSelectionPage: React.FC = () => {
 const navigate = useNavigate();
 const location = useLocation();
 const userRole = location.state?.role || localStorage.getItem('cuidapp_role') || 'senior';

 const [selectedPlan, setSelectedPlan] = useState('wellbeing');

 const plans = [
 {
 id: 'basic',
 name: 'Plan básico',
 price: '$4.99',
 description: 'Seguridad digital.',
 benefits: [
 { text: 'Botón SOS activo 24/7', icon: 'emergency' },
 { text: 'Ficha médica QR digital', icon: 'qr_code_2' },
 { text: 'Seguimiento GPS (1 familiar)', icon: 'location_on' }
 ],
 recommended: false
 },
 {
 id: 'wellbeing',
 name: 'Plan bienestar',
 price: '$9.99',
 description: 'Cuidado familiar.',
 recommended: true,
 label: 'Mejor valor',
 benefits: [
 { text: 'Todo lo del plan básico', icon: 'done_all' },
 { text: 'Seguimiento familiar GPS ilimitado', icon: 'groups' },
 { text: 'Notificaciones de llegada', icon: 'notifications_active' },
 { text: '10% desc. en cada viaje', icon: 'savings', highlight: true }
 ],
 },
 {
 id: 'plenitude',
 name: 'Plan plenitud',
 price: '$19.99',
 description: 'Asistencia total.',
 benefits: [
 { text: 'Todo lo del plan bienestar', icon: 'done_all' },
 { text: 'Elección de asistente de confianza', icon: 'stars', special: true },
 { text: 'Agendamiento de terapias', icon: 'calendar_month' },
 { text: '20% desc. en cada viaje', icon: 'verified', highlight: true },
 { text: '1er viaje básico GRATIS al mes', icon: 'card_giftcard', highlight: true }
 ],
 }
 ];


 const handleConfirm = () => {
 localStorage.setItem('cuidapp_status', 'subscriber');
 localStorage.setItem('cuidapp_selected_plan', selectedPlan);

 // Persistencia estratégica en objeto de datos del miembro
 const memberData = {
 planId: selectedPlan,
 status: 'subscriber',
 updatedAt: new Date().toISOString()
 };
 localStorage.setItem('cuidapp_member_data', JSON.stringify(memberData));

 navigate('/onboarding-medical', { state: { role: userRole } });
 };



 return (
 <div className="min-h-screen bg-white font-plus flex flex-col overflow-y-auto custom-scrollbar pb-[160px]">
 <header className="p-8 pb-4">
 <button
 onClick={() => navigate(-1)}
 className="size-14 rounded-full bg-slate-50 text-primary flex items-center justify-center mb-8 active:scale-90 transition-all border border-slate-100"
 >
 <span className="material-symbols-outlined font-bold text-3xl">arrow_back</span>
 </button>
 <h1 className="text-4xl font-black tracking-tighter text-secondary leading-tight italic font-bold">
 Elige tu plan de movilidad en Cuidapp+
 </h1>
 <p className="text-secondary/60 font-bold text-lg mt-3 leading-snug">
 Selecciona el paquete que mejor se adapte a tus necesidades de transporte y cuidado.
 </p>
 </header>

 <main className="p-6 space-y-8">
 {plans.map((plan) => (
 <button
 key={plan.id}
 onClick={() => setSelectedPlan(plan.id)}
 className={`w-full text-left relative bg-white rounded-[3rem] p-8 border-4 transition-all duration-300 shadow-md ${selectedPlan === plan.id ? 'border-primary ring-8 ring-primary/5' : 'border-slate-50'
 }`}
 >
 {plan.recommended && (
 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-black px-8 py-2.5 rounded-full tracking-[0.2em] shadow-lg">
 {plan.label}
 </div>
 )}

 <div className="flex justify-between items-start mb-6">
 <div className="flex-1">
 <div className="flex items-center gap-2">
 <h3 className="text-2xl font-black text-primary leading-none italic font-bold">{plan.name}</h3>
 {plan.id === 'plenitude' && <span className="material-symbols-outlined text-primary fill-1 text-2xl">workspace_premium</span>}
 </div>
 <p className="text-secondary/40 font-bold text-xs mt-2">{plan.description}</p>
 </div>
 <div className="text-right">
 <p className="text-4xl font-black text-secondary tracking-tighter leading-none">{plan.price}</p>
 <p className="text-[10px] font-black text-secondary/30 mt-1">usd / mes</p>
 </div>
 </div>

 <div className="space-y-4 mt-6 pt-6 border-t border-slate-50">
 {plan.benefits.map((benefit, idx) => (
 <div key={idx} className="flex items-start gap-4">
 <span className={`material-symbols-outlined text-2xl shrink-0 ${benefit.special || benefit.highlight || selectedPlan === plan.id ? 'text-primary' : 'text-slate-200'} ${benefit.highlight ? 'fill-1' : ''}`}>
 {benefit.icon}
 </span>
 <p className={`font-bold text-base leading-tight italic ${benefit.highlight ? 'text-primary font-black' : 'text-secondary/70'}`}>
 {benefit.text}
 </p>
 </div>
 ))}
 </div>

 </button>
 ))}
 </main>

 <footer className="fixed bottom-0 left-0 right-0 p-8 bg-white/95 backdrop-blur-md border-t border-slate-100 z-[150] flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
 <div className="w-full max-w-[480px]">
 <button
 onClick={handleConfirm}
 className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black italic text-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-5 border-4 border-white/20 tracking-wide"
 >
 <span className="tracking-wide">Confirmar y registrar perfil médico</span>
 <span className="material-symbols-outlined font-black text-3xl">arrow_forward</span>
 </button>

 </div>
 </footer>
 </div>
 );
};

export default PlanSelectionPage;
