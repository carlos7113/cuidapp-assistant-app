
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

interface MemberData {
  name: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  emergencyContact2?: {
    name: string;
    phone: string;
    relationship: string;
  };
  doctor?: {
    name: string;
    phone: string;
  };
}

const FamilyDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [record, setRecord] = useState<MemberData | null>(null);
  const [userName, setUserName] = useState('Usuario');

  useEffect(() => {
    const data = localStorage.getItem('cuidapp_member_data');
    if (data) {
      const parsed = JSON.parse(data);
      setRecord(parsed);
      setUserName(parsed.name || 'Usuario');
    }
  }, []);

  return (
    <div className="font-plus min-h-screen bg-white pb-40 text-secondary">
      <Header
        title="Círculo de cuidado"
        onBackClick={() => navigate('/member-home')}
      />

      <main className="p-8 space-y-12 animate-in fade-in duration-500 overflow-y-auto">
        {/* Cabecera del Usuario */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="size-28 rounded-full border-4 border-primary/10 p-1 overflow-hidden shadow-xl aspect-square bg-slate-50">
            <img src="https://picsum.photos/seed/user/200" className="w-full h-full object-cover rounded-full" alt="Usuario" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary leading-none tracking-tighter">
              {userName}
            </h1>
            <p className="text-secondary font-bold text-sm">Socio Cuidapp+ Protegido</p>
          </div>
        </section>

        {/* Sección Familiares */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1 ml-2">
            <h3 className="text-sm font-black text-primary tracking-wider">Familiares responsables</h3>
            <p className="text-xs font-medium text-secondary/60">Personas que reciben tus alertas de seguridad.</p>
          </div>

          <div className="space-y-4">
            {/* Familiar 1 - CONTACTO PRINCIPAL */}
            {record?.emergencyContact && record.emergencyContact.name && (
              <div className="bg-white border-4 border-primary/20 p-6 rounded-[2.5rem] shadow-xl flex items-center justify-between relative">
                <div className="absolute -top-3 left-8 bg-primary text-white text-[8px] font-black px-4 py-1 rounded-full">
                  Contacto principal
                </div>
                <div className="flex items-center gap-5 pt-2">
                  <div className="size-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl font-bold">family_restroom</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 leading-none mb-1">
                      {record.emergencyContact.relationship}
                    </p>
                    <p className="text-xl font-black text-secondary leading-none">{record.emergencyContact.name}</p>
                    <p className="text-secondary font-black text-xs mt-2">{record.emergencyContact.phone}</p>
                  </div>
                </div>
                <a href={`tel:${record.emergencyContact.phone}`} className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-2xl fill-1">call</span>
                </a>
              </div>
            )}

            {/* Familiar 2 */}
            {record?.emergencyContact2 && record.emergencyContact2.name && (
              <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="size-16 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl font-bold">family_restroom</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 leading-none mb-1">
                      {record.emergencyContact2.relationship}
                    </p>
                    <p className="text-xl font-black text-secondary leading-none">{record.emergencyContact2.name}</p>
                    <p className="text-secondary font-black text-xs mt-2">{record.emergencyContact2.phone}</p>
                  </div>
                </div>
                <a href={`tel:${record.emergencyContact2.phone}`} className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-2xl fill-1">call</span>
                </a>
              </div>
            )}

            {(!record?.emergencyContact2?.name) && (
              <button
                onClick={() => navigate('/onboarding-medical')}
                className="w-full py-6 border-2 border-dashed border-primary/20 rounded-[2rem] flex items-center justify-center gap-3 text-primary font-black text-sm active:bg-primary/5 transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Añadir segundo contacto
              </button>
            )}
          </div>
        </section>

        {/* Sección Médica */}
        <section className="space-y-6">
          <div className="flex flex-col gap-1 ml-2">
            <h3 className="text-sm font-black text-primary tracking-wider">Apoyo médico</h3>
            <p className="text-xs font-medium text-secondary/60">Profesionales de salud vinculados a tu perfil.</p>
          </div>

          {record?.doctor && record.doctor.name ? (
            <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2.5rem] flex items-center justify-between shadow-md">
              <div className="flex items-center gap-5">
                <div className="size-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-slate-100">
                  <span className="material-symbols-outlined text-4xl font-bold">medical_services</span>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 leading-none mb-1">Médico de cabecera</p>
                  <p className="text-xl font-black text-secondary leading-none">{record.doctor.name}</p>
                  <p className="text-secondary font-black text-xs mt-2">{record.doctor.phone}</p>
                </div>
              </div>
              <a href={`tel:${record.doctor.phone}`} className="size-14 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg active:scale-90 transition-all">
                <span className="material-symbols-outlined text-2xl fill-1">call</span>
              </a>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-slate-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center gap-4">
              <div className="size-16 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                <span className="material-symbols-outlined text-4xl font-bold">medical_services</span>
              </div>
              <div>
                <p className="text-lg font-black text-secondary">Doctor de cabecera</p>
                <p className="text-xs font-bold text-slate-400 mt-1 leading-relaxed">Asigna a tu médico para transferir tu ficha en emergencias.</p>
              </div>
              <button
                onClick={() => navigate('/onboarding-medical')}
                className="bg-primary text-white px-8 py-3 rounded-2xl font-black text-sm shadow-md active:scale-95 transition-all mt-2"
              >
                Asignar médico ahora
              </button>
            </div>
          )}
        </section>

        {/* Info Privacidad */}
        <section className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex gap-5 mb-12">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">lock_person</span>
          <p className="text-xs text-secondary font-bold leading-relaxed">
            Información protegida. Solo tus contactos autorizados pueden acceder a tus datos médicos en caso de SOS activo.
          </p>
        </section>
      </main>
    </div>
  );
};

export default FamilyDashboardPage;
