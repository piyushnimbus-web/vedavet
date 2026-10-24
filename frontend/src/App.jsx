
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';

import './App.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Main pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import OurTeam from './pages/OurTeam';
import CaseStudies from './pages/CaseStudies';
import CaseStudyDetail from './pages/CaseStudyDetail';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import AppointmentModal from './components/AppointmentModal';

// User account
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';

// Pet Shop
import PetShop from './pages/PetShop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

// Legal pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsConditions from './pages/legal/TermsConditions';
import Disclaimer from './pages/legal/Disclaimer';
import RefundPolicy from './pages/legal/RefundPolicy';
import ShippingReturns from './pages/legal/ShippingReturns';

// Site is served under /beta/node/ (VPS staging path); see webpack publicPath.
const BASENAME = '/beta/node';
const APPOINTMENT_PATH = BASENAME + '/appointment';

function SiteLayout() {
  const [appointmentOpen, setAppointmentOpen] = useState(window.location.pathname === APPOINTMENT_PATH);
  useEffect(() => {
    const open = () => setAppointmentOpen(true);
    const handleClick = (event) => {
      const target = event.target.closest('a[href], button[data-book-appointment]');
      if (target && (target.matches('[data-book-appointment]') || new URL(target.href || APPOINTMENT_PATH, window.location.href).pathname === APPOINTMENT_PATH)) {
        event.preventDefault();
        setAppointmentOpen(true);
      }
    };
    window.addEventListener('vedavet:appointment', open);
    document.addEventListener('click', handleClick);
    return () => {window.removeEventListener('vedavet:appointment', open); document.removeEventListener('click', handleClick);};
  }, []);
  return (
    <div className="website">
      <Header />
      <AppointmentModal open={appointmentOpen} onClose={() => setAppointmentOpen(false)} />

      <Routes>
        {/* Website pages */}
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route
          path="/about"
          element={<Navigate to="/about-us" replace />}
        />

        {/* Veterinary services */}
        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:slug"
          element={<ServiceDetail />}
        />

        {/* Team */}
        <Route path="/our-team" element={<OurTeam />} />

        {/* Case studies */}
        <Route
          path="/case-studies"
          element={<CaseStudies />}
        />
        <Route
          path="/case-studies/:slug"
          element={<CaseStudyDetail />}
        />

        {/* Blogs */}
        <Route path="/blogs" element={<Blogs />} />
        <Route
          path="/blogs/:slug"
          element={<BlogDetail />}
        />

        {/* Contact and appointment */}
        <Route path="/contact-us" element={<Contact />} />
        <Route
          path="/contact"
          element={<Navigate to="/contact-us" replace />}
        />
        <Route path="/appointment" element={<Navigate to="/" replace />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pet Shop */}
        <Route path="/shop" element={<PetShop />} />
        <Route path="/product" element={<Navigate to="/shop" replace />} />
        <Route path="/product-details" element={<ProductDetail />} />
        <Route
          path="/shop/:slug"
          element={<ProductDetail />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* Customer dashboard */}
        <Route
          path="/my-account"
          element={
            <ProtectedRoute>
              <MyAccount />
            </ProtectedRoute>
          }
        />

        {/* Legal pages */}
        <Route
          path="/privacy-policy"
          element={<PrivacyPolicy />}
        />
        <Route
          path="/terms-and-conditions"
          element={<TermsConditions />}
        />
        <Route
          path="/disclaimer"
          element={<Disclaimer />}
        />
        <Route
          path="/refund-policy"
          element={<RefundPolicy />}
        />
        <Route
          path="/shipping-returns"
          element={<ShippingReturns />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <main className="vv-container">
              <h1>Page Not Found</h1>
              <Link to="/">Back Home</Link>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={BASENAME} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SiteLayout />
    </BrowserRouter>
  );
}
