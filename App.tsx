import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import HomePage from './components/HomePage';
import HealthMonitoringPage from './components/HealthMonitoringPage';
import FamilyDashboardPage from './components/FamilyDashboardPage';
import TripBookingPage from './components/TripBookingPage';
import ActiveTripPage from './components/ActiveTripPage';
import SOSAlertPage from './components/SOSAlertPage';
import AssistantConfigPage from './components/AssistantConfigPage';
import AccountPage from './components/AccountPage';
import LiveAssistant from './components/LiveAssistant';
import HealthAdvice from './components/HealthAdvice';
import MedicalRecordPage from './components/MedicalRecordPage';
import RoleSelectorPage from './components/RoleSelectorPage';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import PlanSelectionPage from './components/PlanSelectionPage';
import OnboardingMedical from './components/OnboardingMedical';
import MemberHomePage from './components/MemberHomePage';
import TripSummaryPage from './components/TripSummaryPage';
import CheckoutPage from './components/CheckoutPage';

import { BottomNav, SOSButton } from './components/Layout';

const MainLayout: React.FC<{ children: React.ReactNode, session: any }> = ({ children, session }) => {
    const location = useLocation();
    const role = localStorage.getItem('cuidapp_role');
    const status = localStorage.getItem('cuidapp_status');

    const hideChrome = [
        '/',
        '/login',
        '/signup',
        '/plan-selection',
        '/onboarding-medical',
        '/checkout',
        '/sos-alert',
        '/live-chat',
        '/emergency-qr',
        '/emergency-detail',
        '/trip-summary'
    ].includes(location.pathname);

    // GUARDA DE RUTA (Route Guard) - MANIFIESTO CUIDAPP+
    const exemptPaths = ['/', '/login', '/signup', '/plan-selection', '/guest-home', '/sos-alert', '/live-chat'];

    // 1. Si hay un viaje activo, forzar redirección
    if (role && session) {
        const rawTrip = localStorage.getItem('cuidapp_active_trip');
        if (rawTrip) {
            try {
                const trip = JSON.parse(rawTrip);
                const activeStatuses = ['arriving', 'in_progress', 'at_origin', 'destination_reached'];
                if (
                    activeStatuses.includes(trip.status) &&
                    location.pathname !== '/active-trip' &&
                    !exemptPaths.includes(location.pathname)
                ) {
                    return <Navigate to="/active-trip" replace />;
                }
            } catch {
                localStorage.removeItem('cuidapp_active_trip');
            }
        }
    }

    // 2. Protección de rutas: Si no hay sesión y no es invitado, ir a login
    const isGuest = status === 'guest';
    const isPublic = exemptPaths.includes(location.pathname);

    if (!session && !isGuest && !isPublic) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-white max-w-[480px] mx-auto relative shadow-2xl overflow-hidden flex flex-col border-x border-slate-100 text-dark-blue pb-[160px]">
            <div className="flex-1 overflow-y-auto relative">
                {children}
                {!hideChrome && role === 'senior' && <SOSButton />}
            </div>
            {!hideChrome && <BottomNav />}
        </div>
    );
};

const App: React.FC = () => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        // Escuchar cambios
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white font-plus italic font-black text-primary">
                Cargando Cuidapp+...
            </div>
        );
    }

    return (
        <Router>
            <MainLayout session={session}>
                <Routes>
                    <Route path="/" element={<RoleSelectorPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/guest-onboarding" element={<HomePage />} />
                    <Route path="/select-plan" element={<Navigate to="/plan-selection" replace />} />
                    <Route path="/plan-selection" element={<PlanSelectionPage />} />
                    <Route path="/onboarding-medical" element={<OnboardingMedical />} />
                    <Route path="/checkout" element={<CheckoutPage />} />

                    <Route path="/guest-home" element={<Navigate to="/guest-onboarding" replace />} />
                    <Route path="/home" element={<MemberHomePage />} />
                    <Route path="/member-home" element={<Navigate to="/home" replace />} />

                    <Route path="/health" element={<HealthMonitoringPage />} />
                    <Route path="/medical-record" element={<MedicalRecordPage />} />
                    <Route path="/family" element={<FamilyDashboardPage />} />
                    <Route path="/trip-booking" element={<TripBookingPage />} />
                    <Route path="/active-trip" element={<ActiveTripPage />} />
                    <Route path="/trip-summary" element={<TripSummaryPage />} />
                    <Route path="/sos-alert" element={<SOSAlertPage />} />
                    <Route path="/assistant-config" element={<AssistantConfigPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/live-chat" element={<LiveAssistant />} />
                    <Route path="/health-advice" element={<HealthAdvice />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </MainLayout>
        </Router>
    );
};

export default App;
