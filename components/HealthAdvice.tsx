
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gemini } from '../geminiService';

const HealthAdvice: React.FC = () => {
 const navigate = useNavigate();
 const [query, setQuery] = useState('');
 const [response, setResponse] = useState<string | null>(null);
 const [isLoading, setIsLoading] = useState(false);

 const getAdvice = async () => {
 if (!query.trim()) return;
 setIsLoading(true);
 try {
 const res = await gemini.complexHealthReasoning(query);
 setResponse(res);
 } catch (err) {
 console.error(err);
 setResponse("Hubo un error analizando tu consulta. Inténtalo de nuevo.");
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-background-light dark:bg-background-dark font-plus pb-[160px]">
 <header className="sticky top-0 z-[80] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-slate-800">
 <button 
 onClick={() => navigate('/')} 
 className="size-14 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-primary active:scale-90 transition-all shadow-sm"
 aria-label="Volver al inicio"
 >
 <span className="material-symbols-outlined text-3xl font-bold">arrow_back_ios_new</span>
 </button>
 <h1 className="text-xl font-black tracking-tight text-primary dark:text-white italic font-bold">Consejo de Salud</h1>
 <div className="size-14"></div>
 </header>

 <main className="p-6 space-y-6">
 <div className="bg-primary/5 dark:bg-primary/10 rounded-[2.5rem] p-8 border border-primary/20 shadow-inner">
 <div className="flex items-center gap-3 mb-6">
 <span className="material-symbols-outlined text-primary text-4xl fill-1">psychiatry</span>
 <h2 className="text-xl font-black text-primary tracking-wider italic font-bold">Cuida Inteligente</h2>
 </div>
 <p className="text-base text-slate-600 dark:text-slate-400 mb-8 font-medium leading-relaxed">
 Escribe tus dudas de salud. Te daré una orientación basada en razonamiento avanzado.
 </p>
 <textarea 
 className="w-full bg-white dark:bg-slate-800 border-4 border-slate-100 dark:border-slate-700 rounded-3xl p-6 text-lg font-bold focus:border-primary outline-none transition-all h-48 shadow-sm"
 placeholder="Ej: ¿Es normal sentir fatiga al subir escaleras?"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 />
 <button 
 onClick={getAdvice}
 disabled={isLoading}
 className="w-full mt-6 bg-primary text-white py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 active:scale-95 transition-all italic font-bold"
 >
 {isLoading ? <span className="animate-spin material-symbols-outlined text-3xl">sync</span> : (
 <>
 <span className="material-symbols-outlined">analytics</span>
 <span>Analizar Consulta</span>
 </>
 )}
 </button>
 </div>

 {response && (
 <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-50 dark:border-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
 <div className="prose prose-lg dark:prose-invert max-w-none">
 <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-200 leading-relaxed font-medium">{response}</p>
 </div>
 
 <div className="mt-10 p-5 bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-red-100 dark:border-red-900/20 flex gap-4">
 <span className="material-symbols-outlined text-red-500 shrink-0 text-3xl">emergency</span>
 <p className="text-xs text-red-700 dark:text-red-400 font-black tracking-tight">
 IMPORTANTE: ESTA INFORMACIÓN ES ORIENTATIVA. SI SIENTE DOLOR FUERTE O MALESTAR AGUDO, PULSE SOS O LLAME A EMERGENCIAS.
 </p>
 </div>

 <button 
 onClick={() => navigate('/')}
 className="w-full mt-10 bg-primary-light text-white py-6 rounded-2xl font-black text-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all "
 >
 <span className="material-symbols-outlined">check_circle</span>
 <span>Entendido, volver al inicio</span>
 </button>
 </div>
 )}
 </main>
 </div>
 );
};

export default HealthAdvice;
