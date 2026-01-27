
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const OnboardingMedical: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isUploadingMedical, setIsUploadingMedical] = useState(false);
  const [isUploadingPrescriptions, setIsUploadingPrescriptions] = useState(false);

  const fileInputMedical = useRef<HTMLInputElement>(null);
  const fileInputPrescriptions = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState(() => {
    const existing = localStorage.getItem('cuidapp_member_data');
    const data = existing ? JSON.parse(existing) : {};
    return {
      name: data.name || localStorage.getItem('cuidapp_user_name') || '',
      age: data.age || '',
      photo: data.photo || 'https://picsum.photos/seed/user/400',
      bloodType: data.bloodType || 'O+',
      allergies: data.allergies || '',
      medications: data.medications || '',
      insuranceName: data.insuranceName || '',
      insurancePolicy: data.insurancePolicy || '',
      medicalFileName: data.medicalFileName || '',
      prescriptionsFileName: data.prescriptionsFileName || '',
      mobilityNeeds: data.mobilityNeeds || [] as string[],
      otherNeedDetail: data.otherNeedDetail || '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: 'Hijo/a'
      },
      emergencyContact2: {
        name: '',
        phone: '',
        relationship: 'Hijo/a'
      },
      doctor: {
        name: '',
        phone: ''
      }
    };
  });

  const handleFileSelect = (type: 'medical' | 'prescriptions', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'medical') {
      setIsUploadingMedical(true);
      setTimeout(() => {
        setIsUploadingMedical(false);
        setFormData({ ...formData, medicalFileName: file.name });
      }, 1000);
    } else {
      setIsUploadingPrescriptions(true);
      setTimeout(() => {
        setIsUploadingPrescriptions(false);
        setFormData({ ...formData, prescriptionsFileName: file.name });
      }, 1000);
    }
  };

  const mobilityOptions = [
    { id: 'wheelchair', label: 'Uso de silla de ruedas', icon: 'accessible' },
    { id: 'walking_aid', label: 'Apoyo para caminar (Andador/Bastón)', icon: 'blind' },
    { id: 'visual', label: 'Discapacidad visual', icon: 'visibility_off' },
    { id: 'hearing', label: 'Discapacidad auditiva', icon: 'hearing' },
    { id: 'other', label: 'Otra necesidad', icon: 'add_circle' },
  ];

  const toggleMobilityNeed = (id: string) => {
    setFormData(prev => {
      const isSelected = prev.mobilityNeeds.includes(id);
      return {
        ...prev,
        mobilityNeeds: isSelected
          ? prev.mobilityNeeds.filter(item => item !== id)
          : [...prev.mobilityNeeds, id]
      };
    });
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else {
      localStorage.setItem('cuidapp_member_data', JSON.stringify(formData));
      localStorage.setItem('cuidapp_user_name', formData.name);
      navigate('/checkout');
    }
  };

  return (
    <div className="font-plus h-screen bg-white flex flex-col overflow-y-auto pb-32 text-secondary custom-scrollbar">
      <Header
        title={`Paso ${step} de 3`}
        onBackClick={() => step > 1 ? setStep(step - 1) : navigate('/signup')}
      />

      <main className="flex-1 px-8 py-10 space-y-12 animate-in fade-in duration-500">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-black italic tracking-tighter text-primary leading-tight">
            {step === 1 && 'Ficha médica'}
            {step === 2 && 'Documentación médica'}
            {step === 3 && 'Círculo de confianza'}
          </h2>
          <p className="text-secondary font-bold italic text-base leading-relaxed">
            {step === 1 && 'Información fundamental para tu asistencia personalizada.'}
            {step === 2 && 'Historial oficial para decisiones médicas críticas.'}
            {step === 3 && 'Personas que cuidarán de ti y recibirán alertas de seguridad.'}
          </p>
        </div>

        {step === 1 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <div className="flex flex-col items-center gap-6">
              <div className="size-36 rounded-full border-4 border-primary/10 overflow-hidden shadow-xl relative bg-slate-50">
                <img src={formData.photo} className="w-full h-full object-cover" alt="Perfil" />
                <button className="absolute bottom-1 right-1 size-12 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg active:scale-90 transition-all">
                  <span className="material-symbols-outlined text-2xl">photo_camera</span>
                </button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-sm font-bold text-secondary ml-2">Nombre completo</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-20 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-secondary ml-2">Edad</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="w-full h-20 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  placeholder="Ej: 72"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <div className="flex flex-col gap-1 ml-2">
                <h3 className="text-sm font-black italic text-secondary tracking-wider">Necesidades de movilidad</h3>
                <p className="text-xs font-medium text-secondary/60">Selecciona las que apliquen para tu asistencia.</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {mobilityOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => toggleMobilityNeed(option.id)}
                    className={`flex items-center gap-4 w-full p-6 border-2 rounded-[2rem] transition-all ${formData.mobilityNeeds.includes(option.id)
                      ? 'bg-primary/5 border-primary shadow-sm'
                      : 'bg-slate-50 border-slate-100'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-3xl ${formData.mobilityNeeds.includes(option.id) ? 'text-primary' : 'text-slate-300'
                      }`}>{option.icon}</span>
                    <span className={`flex-1 text-lg font-bold text-left ${formData.mobilityNeeds.includes(option.id) ? 'text-secondary' : 'text-slate-400'
                      }`}>{option.label}</span>
                    <div className={`size-8 rounded-full border-2 flex items-center justify-center transition-all ${formData.mobilityNeeds.includes(option.id) ? 'bg-primary border-primary' : 'border-slate-200'
                      }`}>
                      {formData.mobilityNeeds.includes(option.id) && <span className="material-symbols-outlined text-white text-base font-black">check</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10 animate-in slide-in-from-right duration-300">
            <section className="space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-secondary ml-2">Tipo de sangre</label>
                  <div className="relative">
                    <select
                      value={formData.bloodType}
                      onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
                      className="w-full h-20 px-6 bg-white border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary outline-none transition-all appearance-none"
                    >
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-6 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-secondary ml-2">Seguro médico</label>
                  <input
                    type="text"
                    value={formData.insuranceName}
                    onChange={(e) => setFormData({ ...formData, insuranceName: e.target.value })}
                    className="w-full h-20 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-base text-secondary focus:border-primary outline-none transition-all placeholder:text-slate-300"
                    placeholder="Ej: IESS, Humana..."
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-secondary ml-2">Número de póliza o carnet</label>
                <input
                  type="text"
                  value={formData.insurancePolicy}
                  onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
                  className="w-full h-20 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary outline-none transition-all placeholder:text-slate-300"
                  placeholder="Número de identificación"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-secondary ml-2">Alergias críticas</label>
                <input
                  type="text"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="w-full h-20 px-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary outline-none transition-all placeholder:text-slate-300"
                  placeholder="Ej: Penicilina, látex..."
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-bold text-secondary ml-2">Medicamentos habituales</label>
                <textarea
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                  className="w-full h-40 px-6 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl font-black text-xl text-secondary focus:border-primary outline-none transition-all placeholder:text-slate-300"
                  placeholder="Ej: Enalapril 10mg, Metformina..."
                />
              </div>
            </section>

            <section className="space-y-6 pt-6">
              <div className="flex flex-col gap-1 ml-2">
                <h3 className="text-sm font-black italic text-secondary tracking-wider">Documentos de respaldo</h3>
                <p className="text-xs font-medium text-secondary/60">Sube tus archivos oficiales para una mejor atención.</p>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 space-y-4">
                  <input type="file" hidden ref={fileInputMedical} onChange={(e) => handleFileSelect('medical', e)} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-3xl text-secondary">medical_information</span>
                      <p className="font-bold text-secondary text-base">Subir ficha médica (PDF/Imagen)</p>
                    </div>
                    <button onClick={() => fileInputMedical.current?.click()} className="size-14 bg-white border-2 border-secondary/10 rounded-2xl flex items-center justify-center text-secondary shadow-sm active:scale-90 transition-all">
                      <span className={`material-symbols-outlined text-2xl ${isUploadingMedical ? 'animate-spin' : ''}`}>{isUploadingMedical ? 'sync' : 'attach_file'}</span>
                    </button>
                  </div>
                  {formData.medicalFileName && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/10 animate-in fade-in duration-300">
                      <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                      <p className="text-xs font-black text-secondary truncate">{formData.medicalFileName}</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] border-2 border-slate-100 space-y-4">
                  <input type="file" hidden ref={fileInputPrescriptions} onChange={(e) => handleFileSelect('prescriptions', e)} />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-3xl text-secondary">description</span>
                      <p className="font-bold text-secondary text-base">Subir recetas actuales (PDF/Imagen)</p>
                    </div>
                    <button onClick={() => fileInputPrescriptions.current?.click()} className="size-14 bg-white border-2 border-secondary/10 rounded-2xl flex items-center justify-center text-secondary shadow-sm active:scale-90 transition-all">
                      <span className={`material-symbols-outlined text-2xl ${isUploadingPrescriptions ? 'animate-spin' : ''}`}>{isUploadingPrescriptions ? 'sync' : 'attach_file'}</span>
                    </button>
                  </div>
                  {formData.prescriptionsFileName && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-secondary/5 rounded-xl border border-secondary/10 animate-in fade-in duration-300">
                      <span className="material-symbols-outlined text-sm text-secondary">check_circle</span>
                      <p className="text-xs font-black text-secondary truncate">{formData.prescriptionsFileName}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-12 animate-in slide-in-from-right duration-300 pb-20">
            <section className="space-y-6">
              <h3 className="text-xl font-black italic text-primary leading-none ml-2">Primer contacto de confianza</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Nombre del familiar</label>
                  <input
                    type="text"
                    value={formData.emergencyContact.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, name: e.target.value } })}
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary outline-none"
                    placeholder="Ej: Mariana Pérez"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Parentesco</label>
                    <div className="relative">
                      <select
                        value={formData.emergencyContact.relationship}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, relationship: e.target.value } })}
                        className="w-full h-16 px-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-base text-secondary focus:border-primary outline-none appearance-none"
                      >
                        {['Hijo/a', 'Esposo/a', 'Hermano/a', 'Cuidador', 'Otro'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Teléfono móvil</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact, phone: e.target.value } })}
                      className="w-full h-16 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-base text-secondary focus:border-primary outline-none"
                      placeholder="Ej: 0987654321"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black italic text-primary leading-none ml-2">Segundo contacto (Opcional)</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Nombre del familiar</label>
                  <input
                    type="text"
                    value={formData.emergencyContact2.name}
                    onChange={(e) => setFormData({ ...formData, emergencyContact2: { ...formData.emergencyContact2, name: e.target.value } })}
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary outline-none"
                    placeholder="Nombre del segundo contacto"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Parentesco</label>
                    <div className="relative">
                      <select
                        value={formData.emergencyContact2.relationship}
                        onChange={(e) => setFormData({ ...formData, emergencyContact2: { ...formData.emergencyContact2, relationship: e.target.value } })}
                        className="w-full h-16 px-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-base text-secondary focus:border-primary outline-none appearance-none"
                      >
                        {['Hijo/a', 'Esposo/a', 'Hermano/a', 'Cuidador', 'Otro'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary pointer-events-none">expand_more</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Teléfono móvil</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact2.phone}
                      onChange={(e) => setFormData({ ...formData, emergencyContact2: { ...formData.emergencyContact2, phone: e.target.value } })}
                      className="w-full h-16 px-4 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-base text-secondary focus:border-primary outline-none"
                      placeholder="Ej: 0981234567"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-xl font-black italic text-primary leading-none ml-2">Médico de cabecera</h3>
              <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/10 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Nombre del doctor</label>
                  <input
                    type="text"
                    value={formData.doctor.name}
                    onChange={(e) => setFormData({ ...formData, doctor: { ...formData.doctor, name: e.target.value } })}
                    className="w-full h-16 px-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary outline-none"
                    placeholder="Dr. Apellido..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 tracking-wider">Teléfono de clínica o celular</label>
                  <input
                    type="tel"
                    value={formData.doctor.phone}
                    onChange={(e) => setFormData({ ...formData, doctor: { ...formData.doctor, phone: e.target.value } })}
                    className="w-full h-16 px-6 bg-white border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary outline-none"
                    placeholder="Teléfono profesional"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        <div className="pt-4">
          <button onClick={handleNext} className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black italic text-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all border-4 border-white/20 tracking-wide">
            {step === 3 ? 'Finalizar registro socio Cuidapp+' : 'Siguiente paso'}
          </button>
        </div>
      </main>
    </div>
  );
};

export default OnboardingMedical;
