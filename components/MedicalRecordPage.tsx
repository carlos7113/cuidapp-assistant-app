
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, SOSButton } from './Layout';

interface MemberData {
  name: string;
  age: string;
  photo: string;
  bloodType: string;
  allergies: string;
  medications: string;
  insuranceName?: string;
  insurancePolicy?: string;
  medicalFileName?: string;
  prescriptionsFileName?: string;
  mobilityNeeds: string[];
  otherNeedDetail?: string;
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

const MedicalRecordPage: React.FC = () => {
  const navigate = useNavigate();
  const [record, setRecord] = useState<MemberData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const savedData = localStorage.getItem('cuidapp_member_data');
      if (savedData) {
        setRecord(JSON.parse(savedData));
      }
      setIsLoading(false);
    };

    loadData();
    // Listener para cambios en tiempo real desde otras pestañas
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <span className="animate-spin material-symbols-outlined text-primary text-5xl">sync</span>
      </div>
    );
  }

  if (!record) {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center p-8 text-center space-y-6">
        <span className="material-symbols-outlined text-primary text-7xl opacity-20">medical_information</span>
        <h2 className="text-2xl font-black italic text-secondary leading-tight">Tu ficha médica está vacía</h2>
        <p className="text-secondary/60 font-bold italic text-base leading-relaxed">Por favor, completa tu registro para activar la protección total de Cuidapp+.</p>
        <button
          onClick={() => navigate('/onboarding-medical')}
          className="bg-primary text-white px-10 py-5 rounded-2xl font-black italic text-lg shadow-xl active:scale-95 transition-all"
        >
          Completar registro médico
        </button>
      </div>
    );
  }

  // Mapeo de IDs de movilidad a texto humano
  const mobilityLabels: Record<string, string> = {
    'wheelchair': 'Uso de silla de ruedas',
    'walking_aid': 'Apoyo para caminar (Andador/Bastón)',
    'visual': 'Discapacidad visual',
    'hearing': 'Discapacidad auditiva',
    'other': 'Otras necesidades de apoyo'
  };

  return (
    <div className="font-plus min-h-screen bg-white flex flex-col overflow-y-auto pb-48 text-secondary custom-scrollbar relative">
      <Header
        title="Safety Profile Cuidapp+"
        onBackClick={() => navigate('/member-home')}
      />


      <main className="flex-1 px-8 py-10 space-y-12 animate-in fade-in duration-500">
        {/* Identificación de Socio */}
        <section className="flex flex-col items-center text-center gap-6">
          <div className="size-36 rounded-full border-4 border-primary/10 overflow-hidden shadow-xl relative bg-slate-50">
            <img src={record.photo} className="w-full h-full object-cover" alt="Perfil del socio" />
            <div className="absolute bottom-0 right-0 size-10 bg-green-500 text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="material-symbols-outlined text-base font-black">verified</span>
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl font-black italic tracking-tighter text-primary leading-tight">
              {record.name}
            </h2>
            <p className="text-secondary font-bold italic text-base">Beneficiario B2B • ID: PAC-77420</p>
            <p className="text-primary/50 font-black text-[10px] tracking-widest uppercase mt-2 italic shadow-sm bg-primary/5 px-3 py-1 rounded-full inline-block">Plan Corporativo Activado</p>
          </div>

        </section>

        {/* Datos Clínicos Críticos */}
        <section className="space-y-6">
          <div className="flex justify-between items-end ml-2">
            <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em]">Módulo clínico</h3>
            <span className="text-[10px] font-black text-primary italic">Cifrado AES-256</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
              <p className="text-[10px] font-black italic text-slate-400 uppercase mb-2">Tipo de sangre</p>
              <p className="text-4xl font-black text-secondary leading-none">{record.bloodType}</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex flex-col items-center text-center">
              <p className="text-[10px] font-black italic text-slate-400 uppercase mb-2">Alergias</p>
              <p className="text-base font-black text-secondary leading-tight uppercase truncate w-full px-2">
                {record.allergies || 'Ninguna'}
              </p>
            </div>
          </div>
        </section>

        {/* Requerimientos de Movilidad (NUEVO BLOQUE PRIORITARIO) */}
        {record.mobilityNeeds && record.mobilityNeeds.length > 0 && (
          <section className="space-y-6">
            <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em] ml-2">Requerimientos de movilidad</h3>
            <div className="flex flex-col gap-3">
              {record.mobilityNeeds.map(needId => (
                <div key={needId} className="bg-primary/5 border-2 border-primary/10 p-5 rounded-[2rem] flex items-center gap-5">
                  <div className="size-12 rounded-xl bg-white flex items-center justify-center text-secondary shadow-sm">
                    <span className="material-symbols-outlined text-2xl font-bold">
                      {needId === 'wheelchair' ? 'accessible' : needId === 'walking_aid' ? 'blind' : needId === 'visual' ? 'visibility_off' : needId === 'hearing' ? 'hearing' : 'info'}
                    </span>
                  </div>
                  <p className="text-lg font-black text-secondary tracking-tight">
                    {mobilityLabels[needId] || needId}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Seguro Médico (VERIFICACIÓN Y ESTILO) */}
        {(record.insuranceName || record.insurancePolicy) && (
          <section className="space-y-6">
            <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em] ml-2">Seguro médico</h3>
            <div className="bg-secondary/5 p-8 rounded-[2.5rem] border-2 border-secondary/10 flex items-center gap-6 shadow-sm">
              <div className="size-16 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
                <span className="material-symbols-outlined text-4xl font-bold">verified_user</span>
              </div>
              <div className="flex-1">
                <p className="text-xl font-black text-secondary leading-none">{record.insuranceName || 'Seguro no especificado'}</p>
                <p className="text-[11px] font-black text-slate-400 mt-2 uppercase tracking-[0.2em] leading-none">Póliza: {record.insurancePolicy || 'S/N'}</p>
              </div>
            </div>
          </section>
        )}

        {/* Medicamentos */}
        <section className="space-y-6">
          <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em] ml-2">Medicamentos habituales</h3>
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner min-h-[120px]">
            <p className="text-lg font-black text-secondary leading-relaxed whitespace-pre-wrap">
              {record.medications || 'No se han registrado medicamentos habituales en el sistema.'}
            </p>
          </div>
        </section>

        {/* Equipo de Apoyo / Círculo de Cuidado (COMPLETADO CON MÉDICO) */}
        <section className="space-y-8">
          <div className="flex flex-col gap-1 ml-2">
            <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em]">Equipo de apoyo activo</h3>
            <p className="text-xs font-medium italic text-slate-400">Contactos de emergencia para transferencia de datos SOS.</p>
          </div>

          <div className="space-y-4">
            {/* Familiar 1 */}
            <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl font-bold">family_restroom</span>
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{record.emergencyContact.relationship}</p>
                  <p className="text-lg font-black text-secondary leading-none">{record.emergencyContact.name}</p>
                </div>
              </div>
              <a href={`tel:${record.emergencyContact.phone}`} className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all">
                <span className="material-symbols-outlined text-xl fill-1">call</span>
              </a>
            </div>

            {/* Familiar 2 */}
            {record.emergencyContact2?.name && (
              <div className="bg-white border-2 border-slate-50 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-2xl bg-primary/5 text-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl font-bold">family_restroom</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">{record.emergencyContact2.relationship}</p>
                    <p className="text-lg font-black text-secondary leading-none">{record.emergencyContact2.name}</p>
                  </div>
                </div>
                <a href={`tel:${record.emergencyContact2.phone}`} className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-md active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-xl fill-1">call</span>
                </a>
              </div>
            )}

            {/* Médico de Cabecera (NUEVA TARJETA) */}
            {record.doctor?.name && (
              <div className="bg-slate-50 border-2 border-secondary/10 p-6 rounded-[2.5rem] shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-5">
                  <div className="size-14 rounded-2xl bg-secondary/5 text-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl font-bold">stethoscope</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase leading-none mb-1">Médico de cabecera</p>
                    <p className="text-lg font-black text-secondary leading-none">{record.doctor.name}</p>
                  </div>
                </div>
                <a href={`tel:${record.doctor.phone}`} className="size-12 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-md active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-xl fill-1">call</span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Documentos Oficiales */}
        <section className="space-y-6">
          <h3 className="text-sm font-black italic text-slate-400 uppercase tracking-[0.3em] ml-2">Historial documentado</h3>

          <div className="space-y-4">
            {record.medicalFileName ? (
              <div className="flex items-center gap-5 p-6 bg-white border-2 border-slate-50 rounded-[2.5rem] shadow-sm">
                <div className="size-16 rounded-2xl bg-secondary/5 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-4xl font-bold">picture_as_pdf</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-secondary leading-tight truncate">Ficha médica certificada</p>
                  <p className="text-[10px] font-bold text-slate-400 truncate">{record.medicalFileName}</p>
                </div>
                <button className="size-12 rounded-xl bg-secondary text-white flex items-center justify-center active:scale-90 transition-all">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-[2.5rem] text-center">
                <p className="text-sm font-bold text-slate-300">No se han adjuntado documentos clínicos aún.</p>
              </div>
            )}
          </div>
        </section>

        <section className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex gap-5">
          <span className="material-symbols-outlined text-primary text-3xl font-bold">shield</span>
          <p className="text-[11px] text-secondary font-bold leading-relaxed">
            Tu historial clínico está cifrado y solo es accesible para personal de emergencia cuando activas el código QR o el botón SOS.
          </p>
        </section>
      </main>

      {/* El botón SOS se mantiene visible y no obstruye el equipo de apoyo gracias al padding inferior */}
      <SOSButton />
    </div>
  );
};

export default MedicalRecordPage;
