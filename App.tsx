import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import AssistantDashboardPage from './components/AssistantDashboardPage';
import AssistantEarningsPage from './components/AssistantEarningsPage';
import AssistantQRPage from './components/AssistantQRPage';
import LiveAssistant from './components/LiveAssistant';
import ActiveTripPage from './components/ActiveTripPage';
import LoginPage from './components/LoginPage';
import RoleSelectorPage from './components/RoleSelectorPage';
import AssistantLoginPage from './components/AssistantLoginPage';
import AssistantWelcomePage from './components/AssistantWelcomePage';
import SignUpPage from './components/SignUpPage';

// ─── Punto de entrada exclusivo para la App del Asistente (Elena Martínez) ───
// Esta app SOLO gestiona el panel del asistente. No tiene flujo de usuario/cliente.

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <div className="min-h-screen bg-white max-w-[480px] mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      <Router>
        <Routes>
          {/* Ruta principal: Bienvenida */}
          <Route path="/" element={<AssistantWelcomePage />} />
          <Route path="/login" element={<AssistantLoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/role-select" element={<RoleSelectorPage />} />
          <Route path="/legacy-login" element={<LoginPage />} />
          
          {/* Dashboard y Panel del Asistente */}
          <Route 
            path="/assistant-home" 
            element={
              localStorage.getItem('cuidapp_assistant_identity') 
                ? <AssistantDashboardPage /> 
                : <Navigate to="/login" replace />
            } 
          />
          <Route path="/earnings" element={<AssistantEarningsPage />} />
          <Route path="/qr" element={<AssistantQRPage />} />
          <Route path="/active-trip" element={<ActiveTripPage />} />
          <Route path="/live-assistant" element={<LiveAssistant />} />
          
          {/* Redireccionar cualquier ruta desconocida */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
