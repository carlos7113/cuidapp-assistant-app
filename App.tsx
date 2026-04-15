import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import AssistantDashboardPage from './components/AssistantDashboardPage';
import AssistantEarningsPage from './components/AssistantEarningsPage';
import AssistantQRPage from './components/AssistantQRPage';
import LiveAssistant from './components/LiveAssistant';
import ActiveTripPage from './components/ActiveTripPage';

// ─── Punto de entrada exclusivo para la App del Asistente (Elena Martínez) ───
// Esta app SOLO gestiona el panel del asistente. No tiene flujo de usuario/cliente.

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Establecer identidad por defecto del asistente si no existe
    if (!localStorage.getItem('cuidapp_assistant_identity')) {
      localStorage.setItem('cuidapp_assistant_identity', JSON.stringify({
        name: 'Elena Martínez',
        photo: 'https://picsum.photos/seed/elena/200',
        role: 'Asistente verificado',
        rating: 5.0,
      }));
    }
    localStorage.setItem('cuidapp_role', 'assistant');
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin size-12 border-4 border-[#0052CC] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Ruta principal: Panel del Asistente */}
        <Route path="/" element={<AssistantDashboardPage />} />
        <Route path="/earnings" element={<AssistantEarningsPage />} />
        <Route path="/qr" element={<AssistantQRPage />} />
        <Route path="/active-trip" element={<ActiveTripPage />} />
        <Route path="/live-assistant" element={<LiveAssistant />} />
        {/* Redireccionar cualquier ruta desconocida al panel */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
