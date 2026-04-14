import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Layout';
import { supabase } from '../lib/supabaseClient';

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || localStorage.getItem('cuidapp_role') || 'senior';

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            // 1. Registro en Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("No se pudo crear el usuario");

            // 2. Crear entrada en la tabla 'companies'
            // El usuario pidió lógica dual (empresa + perfil)
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .insert([{ name: `Empresa de ${formData.email}` }])
                .select()
                .single();

            if (companyError) throw companyError;

            // 3. Crear perfil vinculado
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    company_id: companyData.id,
                    full_name: formData.email.split('@')[0], // Placeholder
                    phone: formData.phone
                }]);

            if (profileError) throw profileError;

            // Persistir datos básicos para el onboarding médico (Legacy support)
            const existingMemberData = JSON.parse(localStorage.getItem('cuidapp_member_data') || '{}');
            const newMemberData = {
                ...existingMemberData,
                email: formData.email,
                phone: formData.phone
            };

            localStorage.setItem('cuidapp_member_data', JSON.stringify(newMemberData));
            localStorage.setItem('cuidapp_status', 'subscriber');

            navigate('/onboarding-medical');
        } catch (error: any) {
            alert(error.message || "Error en el registro");
        } finally {
            setLoading(false);
        }
    };

 return (
 <div className="min-h-screen bg-white font-plus flex flex-col overflow-hidden relative text-secondary pb-[160px]">
 <Header title="Registro de socio" showBack={true} onBackClick={() => navigate('/select-plan')} />

 <main className="flex-1 p-8 space-y-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
 <div className="space-y-4 text-left">
 <h1 className="text-4xl font-black italic tracking-tighter text-primary leading-tight">Crea tu cuenta de socio</h1>
 <p className="text-secondary font-bold text-lg leading-snug">Ingresa tus credenciales para activar tu Plan Plenitud.</p>
 </div>

 <form onSubmit={handleSignUp} className="space-y-6">
 <div className="space-y-2 text-left">
 <label className="text-sm font-bold italic text-secondary ml-2">Correo electrónico</label>
 <input
 type="email"
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 placeholder="Ej: nombre@email.com"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-secondary"
 />
 </div>

 <div className="space-y-2 text-left">
 <label className="text-sm font-bold italic text-secondary ml-2">Teléfono móvil</label>
 <input
 type="tel"
 required
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 placeholder="Ej: 0987654321"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-secondary"
 />
 </div>

 <div className="space-y-2 text-left">
 <label className="text-sm font-bold italic text-secondary ml-2">Contraseña</label>
 <input
 type="password"
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 placeholder="••••••••"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-secondary"
 />
 </div>

 <div className="space-y-2 text-left">
 <label className="text-sm font-bold italic text-secondary ml-2">Confirmar contraseña</label>
 <input
 type="password"
 required
 value={formData.confirmPassword}
 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
 placeholder="••••••••"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-secondary"
 />
 </div>

 <button
 type="submit"
 className="w-full bg-primary text-white py-7 rounded-[2rem] font-black italic text-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all mt-4 tracking-[0.04em] border-4 border-white/20"
 >
 Crear cuenta y continuar
 </button>
 </form>

 <div className="pt-6 text-center">
 <button
 onClick={() => navigate('/login')}
 className="text-primary font-black italic text-lg hover:underline underline-offset-8"
 >
 ¿Ya tienes cuenta? Inicia sesión
 </button>
 </div>
 </main>

 <footer className="p-8 text-center text-[10px] font-black text-slate-400 ">
 Suscripción segura Cuidapp+
 </footer>
 </div>
 );
};

export default SignUpPage;
