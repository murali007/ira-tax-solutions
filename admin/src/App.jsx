import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import AdminLayout from './components/AdminLayout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClientList from './pages/AdminClientList';
import AdminClientDetail from './pages/AdminClientDetail';
import AdminSectionPlaceholder from './pages/AdminSectionPlaceholder';
import { 
  Calendar, 
  FileText, 
  Folder, 
  Users, 
  MessageSquare, 
  Receipt, 
  Tag, 
  Megaphone, 
  BarChart3, 
  ShieldCheck 
} from 'lucide-react';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', color: '#475569' }}>
        Verifying Administrative Credentials...
      </div>
    );
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  const isSubdomain = typeof window !== 'undefined' && window.location.hostname.startsWith('admin.');
  const basename = isSubdomain ? '' : '/admin';

  return (
    <AdminAuthProvider>
      <Router basename={basename}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          
          <Route 
            path="/" 
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            {/* 1. Core Operations Dashboard (Matches Exact Concept Screenshot) */}
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            
            {/* 2. Client Intake Queue & 360° Dossier Review */}
            <Route path="clients" element={<AdminClientList />} />
            <Route path="clients/:id" element={<AdminClientDetail />} />

            {/* 3. Operations Sections */}
            <Route 
              path="consultations" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="consultations" 
                  title="Tax Consultations & Scheduling" 
                  description="Manage taxpayer video meetings, intake interviews, and Form 1040 walkthrough sessions." 
                  icon={Calendar} 
                />
              } 
            />
            <Route 
              path="returns" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="returns" 
                  title="Tax Return Deliverables" 
                  description="Federal Form 1040, Form 1040-NR, and state return submissions ready for client review and IRS filing." 
                  icon={FileText} 
                />
              } 
            />
            <Route 
              path="documents" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="documents" 
                  title="Tax Document Vault" 
                  description="IRS compliance storage for client W-2s, 1099s, bank statements, and tax organizer records." 
                  icon={Folder} 
                />
              } 
            />
            <Route 
              path="team" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="team" 
                  title="Tax Preparer Team & Assignment" 
                  description="Manage preparer workloads, senior reviewer quality checks, and filing permissions." 
                  icon={Users} 
                />
              } 
            />
            <Route 
              path="messages" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="messages" 
                  title="Secure Client Messaging" 
                  description="Encrypted tax communication thread with clients regarding missing documents and filing clarifications." 
                  icon={MessageSquare} 
                />
              } 
            />
            <Route 
              path="invoices" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="invoices" 
                  title="Tax Preparation Invoices" 
                  description="Preparer fees, billing status, and payment acknowledgments for Form 1040 filings." 
                  icon={Receipt} 
                />
              } 
            />

            {/* 4. Website Management */}
            <Route 
              path="services" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="services" 
                  title="Website Pages & Services" 
                  description="Manage live services, Form 1040 packages, FBAR compliance, and expat tax services." 
                  icon={FileText} 
                />
              } 
            />
            <Route 
              path="pricing" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="pricing" 
                  title="Tax Packages & Pricing" 
                  description="Configure transparent pricing tiers, student/expat discounts, and seasonal offers." 
                  icon={Tag} 
                />
              } 
            />
            <Route 
              path="referrals" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="referrals" 
                  title="Client Referral Program" 
                  description="Track client referral bonuses and affiliate payouts for successful tax filings." 
                  icon={Megaphone} 
                />
              } 
            />

            {/* 5. Admin Governance */}
            <Route 
              path="reports" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="reports" 
                  title="Tax Season Analytics & Reports" 
                  description="IRS acceptance rates, filing turnaround velocity, and preparer performance metrics." 
                  icon={BarChart3} 
                />
              } 
            />
            <Route 
              path="audit" 
              element={
                <AdminSectionPlaceholder 
                  sectionKey="audit" 
                  title="Security & IRS Sec. 7216 Access Audit" 
                  description="Immutable audit trail of taxpayer record views, document downloads, and cryptographic actions." 
                  icon={ShieldCheck} 
                />
              } 
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}
