
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from './Layout';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [tripPrice, setTripPrice] = useState('$0.00');
  const [serviceName, setServiceName] = useState('Transporte protegido');

  // Estados de los campos de pago
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  useEffect(() => {
    // 🔒 LECTURA DE PRECIO BLINDADO (CTO Senior Fix)
    const lockedPrice = localStorage.getItem('cuidapp_final_checkout_price');
    const lockedService = localStorage.getItem('cuidapp_selected_service_name');

    if (lockedPrice) {
      setTripPrice(`$${lockedPrice}`);
    } else {
      // Fallback a active_trip si no hay precio bloqueado
      const savedTrip = localStorage.getItem('cuidapp_active_trip');
      if (savedTrip) {
        const trip = JSON.parse(savedTrip);
        if (trip.price) setTripPrice(`$${trip.price.toFixed(2)}`);
      }
    }

    if (lockedService) {
      setServiceName(lockedService);
    }
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

    // Simulación de procesamiento seguro
    setTimeout(() => {
      const cardData = {
        brand: cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        last4: cardNumber.slice(-4)
      };
      localStorage.setItem('cuidapp_saved_card', JSON.stringify(cardData));

      // Asegurar que el método de pago está marcado como tarjeta
      const trip = JSON.parse(localStorage.getItem('cuidapp_active_trip') || '{}');
      localStorage.setItem('cuidapp_active_trip', JSON.stringify({ ...trip, paymentMethod: 'card' }));

      navigate('/trip-booking');
    }, 2000);
  };

  const getCardType = () => {
    if (cardNumber.startsWith('4')) return 'Visa';
    if (cardNumber.startsWith('5')) return 'Mastercard';
    return null;
  };

  const cardType = getCardType();

  return (
    <div className="min-h-screen bg-white font-plus flex flex-col text-[#0052CC]">
      <Header title="Datos de la tarjeta" showBack={true} onBackClick={() => navigate(-1)} />

      <main className="flex-1 p-8 space-y-10 overflow-y-auto pb-[120px] custom-scrollbar">
        <section className="bg-[#6C5CE7]/5 border-2 border-[#6C5CE7]/10 p-8 rounded-[3.5rem] space-y-4 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-[#6C5CE7] italic">Detalle del viaje</h3>
            <span className="bg-[#6C5CE7] text-white px-4 py-1 rounded-full text-[10px] font-black leading-none">Cuidapp+</span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-black text-[#0052CC] leading-tight italic">{serviceName}</p>
              <p className="text-xs font-bold text-slate-400 italic">Pago por viaje único</p>
            </div>
            <p className="text-4xl font-black text-[#6C5CE7] tracking-tighter">{tripPrice}</p>
          </div>
        </section>

        <form onSubmit={handlePayment} className="space-y-8">
          <div className="space-y-6">
            <h4 className="text-[10px] font-black tracking-[0.4em] text-slate-300 ml-2 uppercase italic">Ingresa los datos de tu tarjeta</h4>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0052CC] ml-2 italic">Número de tarjeta</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="0000 0000 0000 0000"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-[#0052CC] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {cardType === 'Visa' && (
                      <span className="bg-[#1A1F71] text-white px-2 py-1 rounded text-[10px] font-black animate-in fade-in">VISA</span>
                    )}
                    {cardType === 'Mastercard' && (
                      <span className="bg-[#EB001B] text-white px-2 py-1 rounded text-[10px] font-black animate-in fade-in">MASTERCARD</span>
                    )}
                    <span className="material-symbols-outlined text-slate-300">credit_card</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0052CC] ml-2 italic">Vencimiento</label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={handleExpiryChange}
                    placeholder="MM / YY"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-[#0052CC] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#0052CC] ml-2 italic">CVV</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123"
                    className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-[#0052CC] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all placeholder:text-slate-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#0052CC] ml-2 italic">Nombre en la tarjeta</label>
                <input
                  type="text"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full h-16 px-6 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-lg text-[#0052CC] focus:border-[#6C5CE7] focus:bg-white outline-none transition-all placeholder:text-slate-200"
                />
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#6C5CE7]/5 rounded-2xl border border-[#6C5CE7]/10 flex gap-4">
            <span className="material-symbols-outlined text-green-500 font-bold">lock</span>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
              Tus datos están encriptados bajo estándares bancarios. Cuidapp+ no almacena tu código de seguridad CVV por tu privacidad.
            </p>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-[#6C5CE7] text-white py-8 rounded-[2.5rem] font-bold text-2xl shadow-2xl shadow-[#6C5CE7]/30 active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-white/20 tracking-wide"
          >
            {isProcessing ? (
              <span className="animate-spin material-symbols-outlined text-4xl font-bold">sync</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-3xl font-bold">verified_user</span>
                <span className="italic">Guardar tarjeta y continuar</span>
              </>
            )}
          </button>
        </form>
      </main>

      <footer className="p-8 text-center text-[10px] font-bold text-slate-300 tracking-[0.2em] mb-4 italic">
        Protección garantizada por Cuidapp+
      </footer>
    </div>
  );
};

export default CheckoutPage;
