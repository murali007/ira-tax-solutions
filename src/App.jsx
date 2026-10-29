import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Services from './pages/public/Services';
import Pricing from './pages/public/Pricing';
import RefundStatus from './pages/public/RefundStatus';
import Refer from './pages/public/Refer';
import Contact from './pages/public/Contact';
import SecurityPrivacy from './pages/public/SecurityPrivacy';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Portal Pages
import PortalHome from './pages/portal/PortalHome';
import TaxpayerInfo from './pages/portal/TaxpayerInfo';
import SpouseInfo from './pages/portal/SpouseInfo';
import DependentInfo from './pages/portal/DependentInfo';
import ScheduleTaxNotes from './pages/portal/ScheduleTaxNotes';
import AddressInfo from './pages/portal/AddressInfo';
import UploadDocuments from './pages/portal/UploadDocuments';
import TaxSummary from './pages/portal/TaxSummary';
import DownloadReturns from './pages/portal/DownloadReturns';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/security" element={<SecurityPrivacy />} />
            <Route path="/refund-status" element={<RefundStatus />} />
            <Route path="/refer" element={<Refer />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Authenticated Filing Portal Routes */}
          <Route path="/portal" element={<PortalLayout />}>
            <Route index element={<PortalHome />} />
            <Route path="taxpayer" element={<TaxpayerInfo />} />
            <Route path="spouse" element={<SpouseInfo />} />
            <Route path="dependents" element={<DependentInfo />} />
            <Route path="schedule" element={<ScheduleTaxNotes />} />
            <Route path="address" element={<AddressInfo />} />
            <Route path="upload" element={<UploadDocuments />} />
            <Route path="summary" element={<TaxSummary />} />
            <Route path="download" element={<DownloadReturns />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
