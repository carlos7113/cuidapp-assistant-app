
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [planPrice, setPlanPrice] = useState('$19.99');
  
  // Estados de los campos de pago
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    const plan = localStorage.getItem('cuidapp_selected_plan');
    if (plan === 'basic') setPlanPrice('$4.99');
    else if (plan === 'wellbeing') setPlanPrice('$9.99');
    else setPlanPrice('$19.99');
  }, []);

  // Lógica de formateo de tarjeta (4-4-4-4)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limitedVal = rawVal.substring(0, 16);
    const formatted = limitedVal.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
  };

  // Lógica de formateo de vencimiento (MM / YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    let formatted = rawVal;
    
    if (rawVal.length >= 2) {
      const month = rawVal.substring(0, 2);
      // Validación de mes
      if (parseInt(month) > 12) return;
      const year = rawVal.substring(2, 4);
      formatted = `${month} / ${year}`;
    }
    
    if (formatted.length <= 7) {
      setExpiry(formatted);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulación de pasarela de pago bancaria
    setTimeout(() => {
      localStorage.setItem('cuidapp_is_registered', 'true');
      localStorage.setItem('cuidapp_status', 'subscriber');
      navigate('/member-home');
    }, 2500);
  };

  // Detección de marca de tarjeta
  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return null;
  };

  const cardType = getCardType();

  return (
    <div className="min-h-screen bg-white font-plus flex flex-col text-secondary">
      <Header title="Finalizar suscripción" showBack={true} />

      <main className="flex-1 p-8 space-y-10 overflow-y-auto pb-40 custom-scrollbar">
        <section className="bg-primary/5 border-2 border-primary/10 p-8 rounded-[2.5rem] space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black italic text-primary">Resumen del plan</h3>
            <span className="bg-primary text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Activo</span>
          </div>
          <div className="flex justify-between items-end">
             <div>
                <p className="text-2xl font-black italic text-secondary leading-tight">Plan plenitud</p>
                <p className="text-xs font-bold text-slate-400 italic">Protección senior integral</p>
             </div>
             <p className="text-3xl font-black italic text-primary">{planPrice}<span className="text-xs">/mes</span></p>
          </div>
        </section>

        <form onSubmit={handlePayment} className="space-y-8">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 ml-2">Datos de pago seguros</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary ml-2 italic">Número de tarjeta</label>
                <div className="relative">
                  <input 
                    type="text" 
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {cardType === 'Visa' && (
                      <span className="bg-[#1A1F71] text-white px-2 py-1 rounded text-[10px] font-black italic animate-in fade-in">VISA</span>
                    )}
                    {cardType === 'Mastercard' && (
                      <span className="bg-[#EB001B] text-white px-2 py-1 rounded text-[10px] font-black italic animate-in fade-in">MASTERCARD</span>
                    )}
                    <span className="material-symbols-outlined text-slate-300">credit_card</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 italic">Vencimiento</label>
                  <input 
                    type="text" 
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary ml-2 italic">CVV</label>
                  <input 
                    type="text" 
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary ml-2 italic">Nombre en la tarjeta</label>
                <input 
                  type="text" 
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-lg text-secondary focus:border-primary focus:bg-white outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
            <span className="material-symbols-outlined text-green-500 font-bold">lock</span>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed uppercase tracking-wider italic">
              Tus datos están encriptados bajo estándares bancarios PCI-DSS. Cuidapp+ no almacena tu CVV.
            </p>
          </div>

          <button 
            type="submit"
            disabled={isProcessing}
            className="w-full bg-primary text-white py-8 rounded-[2.5rem] font-black text-2xl italic shadow-2xl shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/20 tracking-wide"
          >
            {isProcessing ? (
              <span className="animate-spin material-symbols-outlined text-4xl font-black">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl font-bold">verified_user</span>
                <span>Pagar y activar protección</span>
              </>
            )}
          </button>
        </form>
      </main>
      
      <footer className="p-8 text-center text-[10px] font-black text-slate-400 italic uppercase tracking-[0.2em] mb-4">
        Protección garantizada por Cuidapp+
      </footer>
    </div>
  );
};

export default CheckoutPage;
