import { Routes, Route, Navigate, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Expos from './components/Expos';
import Exhibitors from './components/Exhibitors';
import Schedules from './components/Schedules';
import Analytics from './components/Analytics';
import ScheduleManagement from './components/ScheduleManagement';
import Profile from './components/Profile';
import Booths from './components/Booths';
import ExhibitorRegister from './components/ExhibitorRegister';
import AdminDashboard from './components/AdminDashboard';
import MyBooths from './components/MyBooths';
import Events from './components/Events';
import CreateEvent from './components/CreateEvent';
import MySessions from './components/MySessions';
import Messages from './components/Messages';
import FloorPlan from './components/FloorPlan';
import ExhibitorSearch from './components/ExhibitorSearch';
import ScheduleViewer from './components/ScheduleViewer';
import Feedback from './components/Feedback';
import About from './components/About';
import Contact from './components/Contact';
import Services from './components/Services';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import FAQ from './components/FAQ';

import './App.css';

function App() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <>
      {!(user && user.role === 'admin') && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expos"
          element={
            <ProtectedRoute>
              <Expos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exhibitors"
          element={
            <ProtectedRoute>
              <Exhibitors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedules"
          element={
            <ProtectedRoute>
              <Schedules />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Analytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule-management"
          element={
            <ProtectedRoute>
              <ScheduleManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/exhibitor-register"
          element={
            <ProtectedRoute>
              <ExhibitorRegister />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/booths"
          element={
            <ProtectedRoute>
              <Booths />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-booths"
          element={
            <ProtectedRoute>
              <MyBooths />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-sessions"
          element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exhibitor-search"
          element={
            <ProtectedRoute>
              <ExhibitorSearch />
            </ProtectedRoute>
          }
        />
        <Route
          path="/schedule/:expoId"
          element={
            <ProtectedRoute>
              <ScheduleViewer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <Feedback />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* Hide Footer on auth pages and for admin users */}
      { !['/login','/signup','/forgot-password'].includes(location.pathname) && !location.pathname.startsWith('/reset-password') && !(user && user.role === 'admin') && <Footer /> }
    </>
  );
}

export default App;
