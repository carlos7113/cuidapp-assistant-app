
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const MemberHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState<any>(null);
  const [plan, setPlan] = useState('wellbeing');

  // Estados para simulación de signos vitales
  const [bpm, setBpm] = useState(72);
  const [oxygen, setOxygen] = useState(98);

  useEffect(() => {
    const data = localStorage.getItem('cuidapp_member_data');
    const savedPlan = localStorage.getItem('cuidapp_selected_plan') || 'wellbeing';
    if (data) {
      setMember(JSON.parse(data));
      setPlan(savedPlan);
    } else {
      navigate('/onboarding-medical');
    }

    // Simulación de telemetría médica en vivo
    const interval = setInterval(() => {
      setBpm(Math.floor(Math.random() * (75 - 70 + 1)) + 70);
      setOxygen(Math.floor(Math.random() * (99 - 97 + 1)) + 97);
    }, 5000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (!member) return null;

  return (
    <div className="font-plus h-screen bg-white flex flex-col overflow-y-auto pb-[160px] text-dark-blue">
      <header className="px-8 py-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-primary leading-tight tracking-tighter">Hola, {member.name.split(' ')[0]}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-bold text-secondary">Protección Cuidapp+ activa</p>
          </div>
        </div>
        <button onClick={() => navigate('/account')} className="size-16 rounded-full border-4 border-primary/10 overflow-hidden shadow-md active:scale-90 transition-all">
          <img src={member.photo} className="w-full h-full object-cover" alt="Perfil" />
        </button>
      </header>

      <main className="px-8 space-y-10">
        <section className="bg-primary p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-black tracking-[0.4em] opacity-60">Tu suscripción actual</p>
            <div className="flex items-center gap-3">
              <h3 className="text-4xl font-black leading-none">
                {plan === 'basic' && 'Plan básico'}
                {plan === 'wellbeing' && 'Plan bienestar'}
                {plan === 'plenitude' && 'Plan plenitud'}
              </h3>
              <span className="material-symbols-outlined text-white/50 text-2xl">verified</span>
            </div>
            <p className="text-sm font-medium opacity-80 leading-relaxed max-w-[200px]">
              {plan === 'plenitude' ? 'Bono de movilidad 100% cubierto. Viajes ilimitados.' : 'Beneficios de asistencia senior aplicados automáticamente.'}
            </p>
          </div>
          <span className="material-symbols-outlined absolute right-[-30px] bottom-[-30px] text-[12rem] opacity-10">stars</span>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <QuickAction
            icon="medical_information"
            label="Mi ficha médica"
            onClick={() => navigate('/medical-record')}
          />
          <QuickAction
            icon="family_restroom"
            label="Mi familia"
            onClick={() => navigate('/family')}
          />
        </section>

        <section className="pt-4">
          <button
            onClick={() => navigate('/trip-booking')}
            className="w-full bg-secondary text-white py-12 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center gap-2 active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-5">
              <span className="material-symbols-outlined text-5xl font-black group-hover:scale-110 transition-transform">local_taxi</span>
              <span className="text-2xl font-black tracking-tighter">Solicitar transporte asistido</span>
            </div>
            <p className="text-[10px] font-bold opacity-70">Servicio socio Cuidapp+</p>
          </button>
        </section>

        <section className="space-y-4 pt-4 pb-12">
          <div className="flex items-center gap-3 ml-2">
            <span className="material-symbols-outlined text-primary text-xl font-bold">health_and_safety</span>
            <h4 className="text-[10px] font-black text-slate-400">Signos vitales recientes</h4>
          </div>
          <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center">
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 mb-1">Pulso</p>
              <p className="text-2xl font-black text-secondary">{bpm} <span className="text-[10px]">BPM</span></p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 mb-1">Oxígeno</p>
              <p className="text-2xl font-black text-secondary">{oxygen} <span className="text-[10px]">%</span></p>
            </div>
            <div className="w-px h-10 bg-slate-200"></div>
            <div className="text-center">
              <p className="text-[9px] font-black text-slate-400 mb-1">Presión</p>
              <p className="text-2xl font-black text-secondary">120/80</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

const QuickAction: React.FC<{ icon: string; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] flex flex-col items-center gap-4 shadow-sm active:bg-slate-50 transition-all">
    <div className="size-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
      <span className="material-symbols-outlined text-3xl font-bold">{icon}</span>
    </div>
    <span className="text-[13px] font-black text-secondary tracking-tight">{label}</span>
  </button>
);

export default MemberHomePage;
