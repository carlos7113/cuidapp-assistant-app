import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from './Layout';
import { supabase } from '../lib/supabaseClient';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || localStorage.getItem('cuidapp_role') || 'senior';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            localStorage.setItem('cuidapp_status', 'subscriber');
            localStorage.setItem('cuidapp_selected_plan', 'wellbeing');

            // Asignación de identidades Single Source of Truth
            if (role === 'assistant') {
                localStorage.setItem('cuidapp_assistant_identity', JSON.stringify({
                    name: 'Elena Martínez',
                    photo: 'https://picsum.photos/seed/elena/200',
                    role: 'Asistente verificado',
                    rating: 5.0
                }));
            } else {
                localStorage.setItem('cuidapp_user_name', data.user?.email?.split('@')[0] || 'Usuario');
            }

            navigate(role === 'assistant' ? '/assistant-home' : '/home');
        } catch (error: any) {
            alert(error.message || "Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

 const handleGuestMode = () => {
 localStorage.setItem('cuidapp_status', 'guest');
 localStorage.removeItem('cuidapp_selected_plan');
 navigate('/home');
 };

 return (
 <div className="min-h-screen bg-white font-plus flex flex-col overflow-hidden relative text-primary pb-[160px]">
 <Header title="Acceso a Cuidapp+" showBack={true} />

 <main className="flex-1 p-8 space-y-12 overflow-y-auto custom-scrollbar flex flex-col justify-center">
 <div className="space-y-4 text-left">
 <h1 className="text-5xl font-black italic tracking-tighter text-primary leading-none">Bienvenido</h1>
 <p className="text-primary font-bold italic text-xl leading-snug">Tu transporte seguro, a un solo toque.</p>
 </div>

 <form onSubmit={handleLogin} className="space-y-6">
 <div className="space-y-2 text-left">
 <label className="text-[12px] font-bold text-secondary ml-2">Email</label>
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="tu@email.com"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-primary"
 />
 </div>
 <div className="space-y-2 text-left">
 <label className="text-[12px] font-bold text-secondary ml-2">Contraseña</label>
 <input
 type="password"
 required
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 placeholder="••••••••"
 className="w-full h-20 px-6 bg-slate-50 border-2 border-primary/20 rounded-2xl font-bold text-lg focus:border-primary focus:bg-white outline-none transition-all text-primary"
 />
 </div>
 <button
 type="submit"
 className="w-full bg-primary text-white py-7 rounded-[2rem] font-black italic text-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all mt-4"
 >
 Iniciar sesión
 </button>
 </form>

 <div className="relative flex items-center justify-center py-10">
 <div className="w-full border-t border-slate-100"></div>
 <span className="absolute bg-white px-8 text-[13px] font-bold text-slate-300">O</span>
 </div>

 <div className="space-y-6 text-center">
 <button
 onClick={() => {
 localStorage.setItem('cuidapp_status', 'guest');
 navigate('/guest-onboarding');
 }}
 className="w-full bg-white border-4 border-primary text-primary py-7 rounded-[2rem] font-black italic text-2xl active:bg-primary/5 transition-all shadow-xl shadow-primary/5"
 >
 Viaje único
 </button>

 <div className="pt-6 space-y-4">
 <p className="text-sm font-bold text-slate-400">¿No tienes cuenta activa?</p>
 <button
 onClick={() => navigate('/select-plan', { state: { role } })}
 className="text-primary font-black italic text-2xl hover:underline underline-offset-[12px] decoration-4"
 >
 Elige un plan de movilidad
 </button>
 </div>
 </div>
 </main>

 <footer className="p-8 text-center text-[12px] font-bold text-slate-400">
 Independencia segura Cuidapp+
 </footer>
 </div>
 );
};

export default LoginPage;
