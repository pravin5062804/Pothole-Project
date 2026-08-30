import { Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import AuthModal from './components/auth/AuthModal';

import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import TrackIssuePage from './pages/TrackIssuePage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import WorkerPage from './pages/WorkerPage';

export default function App() {
  const location = useLocation();
  const isPortalRoute = location.pathname.startsWith('/admin') || location.pathname.startsWith('/worker');

  return (
    <div className="font-body text-gray-800 bg-white antialiased min-h-screen flex flex-col">
      <ScrollToTop />
      {!isPortalRoute && <Navbar />}
      <AuthModal />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/report" element={<ReportIssuePage />} />
          <Route path="/track" element={<TrackIssuePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/worker" element={<WorkerPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      {!isPortalRoute && <Footer />}
    </div>
  );
}
