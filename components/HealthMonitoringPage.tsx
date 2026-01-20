
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav, SOSButton } from './Layout';
import { HealthStat } from '../types';

const HealthMonitoringPage: React.FC = () => {
  const navigate = useNavigate();
  const [isFallAlertActive, setIsFallAlertActive] = useState(false);
  const [fallCountdown, setFallCountdown] = useState(10);
  const timerRef = useRef<number | null>(null);
  
  const stats: HealthStat[] = [
    { icon: 'favorite', label: 'Frecuencia Cardíaca', value: '72', unit: 'LPM', status: 'Normal', color: 'green' },
    { icon: 'blood_pressure', label: 'Presión Arterial', value: '120/80', unit: 'mmHg', status: 'Estable', color: 'green' },
    { icon: 'air', label: 'Oxígeno en Sangre', value: '98', unit: '%', status: 'Óptimo', color: 'blue' },
  ];

  // Protocolo Crítico de Detección de Caídas
  const startFallProtocol = () => {
    setIsFallAlertActive(true);
    setFallCountdown(10);
    
    // Iniciar cuenta regresiva irreversible a menos que se cancele manualmente
    timerRef.current = window.setInterval(() => {
      setFallCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Navegación automática al completar el protocolo
          navigate('/emergency-detail', { state: { alertSource: 'fall_confirmed' } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelProtocol = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsFallAlertActive(false);
    setFallCountdown(10);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="font-plus pb-64 min-h-screen bg-white relative overflow-x-hidden">
      {/* 1. OVERLAY DE EMERGENCIA (z-index 9999 para prioridad absoluta) */}
      {isFallAlertActive && (
        <div className="fixed inset-0 z-[9999] bg-sos-red flex flex-col items-center justify-center p-8 animate-in fade-in duration-200">
          {/* Fondo parpadeante de alerta */}
          <div className="absolute inset-0 bg-white/10 animate-pulse pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-10 w-full">
            <div className="flex flex-col items-center gap-6">
              <div className="size-32 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.4)] animate-bounce">
                <span className="material-symbols-outlined text-sos-red text-7xl font-black fill-1">emergency_home</span>
              </div>
              <div className="space-y-2">
                <h2 className="text-white text-5xl font-black italic uppercase tracking-tighter leading-none">
                  ¡CAÍDA DETECTADA!
                </h2>
                <p className="text-white/90 text-sm font-black uppercase tracking-[0.3em] bg-black/20 px-4 py-2 rounded-full inline-block">
                  Transfiriendo historial médico...
                </p>
              </div>
            </div>

            {/* Contador de gran formato (80px+) */}
            <div className="text-white text-[12rem] font-black italic leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.3)] tabular-nums">
              {fallCountdown}
            </div>

            <div className="w-full space-y-6">
              <button 
                onClick={cancelProtocol}
                className="w-full bg-white text-sos-red py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl active:scale-95 transition-all border-4 border-white/50 uppercase italic tracking-widest"
              >
                ESTOY BIEN (CANCELAR)
              </button>
              <div className="flex items-center justify-center gap-3 text-white/40">
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Protocolo Cuidapp+ Nivel 1</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Estándar */}
      <header className="sticky top-0 z-[80] bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-6 flex items-center justify-between">
        <button 
          onClick={() => navigate('/home')} 
          className="size-14 flex items-center justify-center rounded-full bg-surface text-primary active:scale-90 transition-all border border-slate-50"
        >
          <span className="material-symbols-outlined text-3xl font-bold">arrow_back</span>
        </button>
        <h1 className="text-xl font-black italic tracking-tight uppercase text-text-main">Mi Salud</h1>
        <div className="size-14"></div>
      </header>

      <main className="p-6 space-y-8">
        {/* Sección de Biometría */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sensores Wearable</h2>
            <div className="flex items-center gap-1 text-green-500 font-black">
              <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest">En Vivo</span>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-50 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={`size-14 rounded-2xl flex items-center justify-center bg-surface text-${stat.color === 'red' ? 'sos-red' : stat.color}-500`}>
                    <span className="material-symbols-outlined text-3xl font-bold">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                    <p className="text-3xl font-black text-text-main italic leading-none">{stat.value}<span className="text-xs font-bold text-slate-300 ml-1 uppercase">{stat.unit}</span></p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[8px] font-black bg-surface text-slate-400 border border-slate-50">
                  {stat.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Gráfico de Tendencia */}
        <section className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Actividad Cardiovascular</p>
           <div className="h-32 flex items-end justify-between gap-1.5 px-2">
              {[30, 45, 60, 40, 55, 75, 50, 65, 80, 45, 60].map((h, i) => (
                <div key={i} className={`flex-1 rounded-t-lg transition-all duration-700 ${i === 8 ? 'bg-primary' : 'bg-primary/20'}`} style={{ height: `${h}%` }}></div>
              ))}
           </div>
        </section>

        {/* 2. BOTÓN DE TEST (Solicitado: Blanco, Borde Rojo 2px, Texto Rojo) */}
        <section className="pt-4">
          <button 
            onClick={startFallProtocol}
            className="w-full bg-white border-2 border-sos-red text-sos-red py-8 rounded-[2rem] flex flex-col items-center justify-center gap-3 shadow-xl active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-3">
               <span className="material-symbols-outlined text-4xl font-black animate-bounce">falling</span>
               <span className="text-2xl font-black italic uppercase tracking-tighter">🧪 TEST: SIMULAR CAÍDA</span>
            </div>
            <p className="text-[10px] font-bold text-sos-red/60 uppercase tracking-[0.3em]">Validación de Sensores de Impacto</p>
          </button>
        </section>
      </main>

      <SOSButton />
      <BottomNav />
    </div>
  );
};

export default HealthMonitoringPage;
