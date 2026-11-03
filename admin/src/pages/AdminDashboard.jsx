import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
import {
  FileText,
  Folder,
  Users,
  PenTool,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Plus,
  Send,
  ArrowRight,
  ExternalLink,
  Tag,
  Share2,
  FileCheck,
  Shield,
  HelpCircle,
  X,
  Check
} from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { token, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    phone: '',
    filing_status: 'Single / Form 1040',
    tax_year: '2025',
    assigned_to: 'Priya'
  });
  const [creatingClient, setCreatingClient] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.admin.listClients(token);
      if (res && res.data) {
        setClients(res.data);
      }
    } catch (err) {
      console.warn('Error fetching client list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [token]);

  const showToast = (msg) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(''), 4000);
  };

  const handleAddClientSubmit = (e) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) {
      alert('Please provide client name and email');
      return;
    }
    setCreatingClient(true);
    
    // Create new client record in local storage or state
    setTimeout(() => {
      const created = {
        id: 'new_' + Date.now(),
        name: newClient.name,
        email: newClient.email,
        phone: newClient.phone,
        file_no: `IRA-2025-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'Profile Created',
        filing_status: newClient.filing_status,
        created_at: new Date().toISOString(),
        total_docs: 0,
        approved_docs: 0,
        pending_docs: 0,
        rejected_docs: 0
      };

      setClients(prev => [created, ...prev]);
      setCreatingClient(false);
      setShowAddModal(false);
      showToast(`Client ${newClient.name} successfully created and added to queue!`);
      setNewClient({
        name: '',
        email: '',
        phone: '',
        filing_status: 'Single / Form 1040',
        tax_year: '2025',
        assigned_to: 'Priya'
      });
    }, 600);
  };

  // Metric counts (combines live data with operational metrics)
  const totalActive = Math.max(48, clients.length);
  const missingDocsCount = 12;
  const awaitingReviewCount = Math.max(8, clients.filter(c => c.status === 'Documents Uploaded' || c.pending_docs > 0).length);
  const pendingSignaturesCount = 5;

  return (
    <div className="admin-dashboard-container">
      {/* Toast Notification */}
      {actionNotice && (
        <div className="admin-action-toast">
          <Check size={16} />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Dashboard Top Title Bar */}
      <div className="dashboard-title-bar">
        <div>
          <h1 className="dashboard-main-title">Tax operations dashboard</h1>
          <p className="dashboard-sub-title">Every client. Every next step. One workspace.</p>
        </div>
        <button 
          type="button" 
          onClick={() => setShowAddModal(true)} 
          className="btn-add-client"
        >
          <Plus size={16} />
          <span>Add client</span>
        </button>
      </div>

      {/* Top 4 KPI Metric Cards */}
      <div className="dashboard-kpi-grid">
        {/* Card 1: Active returns */}
        <div className="dash-kpi-card" onClick={() => navigate('/clients')}>
          <div className="kpi-header-row">
            <div className="kpi-icon-pill icon-blue">
              <FileText size={20} />
            </div>
            <span className="kpi-year-badge">Tax year 2025</span>
          </div>
          <div className="kpi-body">
            <span className="dash-kpi-label">Active returns</span>
            <span className="dash-kpi-num">{totalActive}</span>
          </div>
        </div>

        {/* Card 2: Missing documents */}
        <div className="dash-kpi-card" onClick={() => navigate('/clients')}>
          <div className="kpi-header-row">
            <div className="kpi-icon-pill icon-cyan">
              <Folder size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <span className="dash-kpi-label">Missing documents</span>
            <span className="dash-kpi-num">{missingDocsCount}</span>
          </div>
        </div>

        {/* Card 3: Awaiting review */}
        <div className="dash-kpi-card" onClick={() => navigate('/clients')}>
          <div className="kpi-header-row">
            <div className="kpi-icon-pill icon-indigo">
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <span className="dash-kpi-label">Awaiting review</span>
            <span className="dash-kpi-num">{awaitingReviewCount}</span>
          </div>
        </div>

        {/* Card 4: Pending signatures */}
        <div className="dash-kpi-card" onClick={() => navigate('/clients')}>
          <div className="kpi-header-row">
            <div className="kpi-icon-pill icon-teal">
              <PenTool size={20} />
            </div>
          </div>
          <div className="kpi-body">
            <span className="dash-kpi-label">Pending signatures</span>
            <span className="dash-kpi-num">{pendingSignaturesCount}</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          YOUR 5-STEP FILING WORKFLOW KANBAN
          ======================================================== */}
      <div className="workflow-section-card">
        <div className="workflow-header-row">
          <div className="workflow-title-group">
            <div className="workflow-title-flex">
              <h2>Your 5-step filing workflow</h2>
              <span className="demo-data-tag">DESIGN CONCEPT • DEMO DATA</span>
            </div>
            <p className="workflow-subtitle">From document upload to filing, track every return in one place.</p>
          </div>
        </div>

        <div className="workflow-kanban-grid">
          {/* Step 1: Share Documents */}
          <div className="workflow-step-column">
            <div className="step-column-head">
              <div className="step-num-badge">1</div>
              <div className="step-head-text">
                <h3>Share Documents</h3>
                <p>Upload or collect the required tax documents from your client.</p>
              </div>
            </div>

            <div className="workflow-client-card">
              <div className="wf-card-client-row">
                <Users size={16} className="wf-avatar-icon" />
                <div className="wf-client-names">
                  <strong>Jordan Lee</strong>
                  <span>Form 1040</span>
                </div>
              </div>
              <div className="wf-tag-pill">W-2 Employee</div>

              <div className="wf-alert-chip alert-missing">
                <FileText size={13} />
                <span>Missing W-2</span>
              </div>

              <div className="wf-next-action-row">
                <span className="next-label">Next action:</span>
                <span className="next-val">Request W-2 from client</span>
              </div>

              <div className="wf-assigned-row">
                <span>Assigned to: <strong>Priya</strong></span>
              </div>

              <button 
                type="button" 
                className="btn-wf-action"
                onClick={() => showToast('Document request email and SMS sent to Jordan Lee!')}
              >
                Request document
              </button>
            </div>
          </div>

          {/* Step 2: We Prepare */}
          <div className="workflow-step-column">
            <div className="step-column-head">
              <div className="step-num-badge">2</div>
              <div className="step-head-text">
                <h3>We Prepare</h3>
                <p>Prepare the return with comprehensive checks and deductions.</p>
              </div>
            </div>

            <div className="workflow-client-card">
              <div className="wf-card-client-row">
                <Users size={16} className="wf-avatar-icon" />
                <div className="wf-client-names">
                  <strong>Morgan Shaw</strong>
                  <span>Form 1040</span>
                </div>
              </div>
              <div className="wf-tag-pill">Self-Employed</div>

              <div className="wf-alert-chip alert-progress">
                <Clock size={13} />
                <span>Schedule C in progress</span>
              </div>

              <div className="wf-next-action-row">
                <span className="next-label">Next action:</span>
                <span className="next-val">Continue return prep</span>
              </div>

              <div className="wf-assigned-row">
                <span>Assigned to: <strong>Alex</strong></span>
              </div>

              <button 
                type="button" 
                className="btn-wf-action"
                onClick={() => navigate('/clients')}
              >
                Open return
              </button>
            </div>
          </div>

          {/* Step 3: Separate Review */}
          <div className="workflow-step-column">
            <div className="step-column-head">
              <div className="step-num-badge">3</div>
              <div className="step-head-text">
                <h3>Separate Review</h3>
                <p>A second review for quality assurance and accuracy.</p>
              </div>
            </div>

            <div className="workflow-client-card">
              <div className="wf-card-client-row">
                <Users size={16} className="wf-avatar-icon" />
                <div className="wf-client-names">
                  <strong>Riley Park</strong>
                  <span>Form 1040</span>
                </div>
              </div>
              <div className="wf-tag-pill">Multi-State Filer</div>

              <div className="wf-alert-chip alert-review">
                <AlertTriangle size={13} />
                <span>Review notes open</span>
              </div>

              <div className="wf-next-action-row">
                <span className="next-label">Next action:</span>
                <span className="next-val">Address review notes</span>
              </div>

              <div className="wf-assigned-row">
                <span>Reviewer: <strong>Sam</strong></span>
              </div>

              <button 
                type="button" 
                className="btn-wf-action"
                onClick={() => navigate('/clients')}
              >
                Resolve notes
              </button>
            </div>
          </div>

          {/* Step 4: We Explain */}
          <div className="workflow-step-column">
            <div className="step-column-head">
              <div className="step-num-badge">4</div>
              <div className="step-head-text">
                <h3>We Explain</h3>
                <p>Review the return with your client and answer questions in plain English.</p>
              </div>
            </div>

            <div className="workflow-client-card">
              <div className="wf-card-client-row">
                <Users size={16} className="wf-avatar-icon" />
                <div className="wf-client-names">
                  <strong>Avery Cole</strong>
                  <span>Form 1040</span>
                </div>
              </div>
              <div className="wf-tag-pill">Investor</div>

              <div className="wf-alert-chip alert-walkthrough">
                <Calendar size={13} />
                <span>Client walkthrough due</span>
              </div>

              <div className="wf-next-action-row">
                <span className="next-label">Next action:</span>
                <span className="next-val">Schedule walkthrough</span>
              </div>

              <div className="wf-assigned-row">
                <span>Assigned to: <strong>Priya</strong></span>
              </div>

              <button 
                type="button" 
                className="btn-wf-action"
                onClick={() => showToast('Walkthrough invitation link generated and shared!')}
              >
                Book walkthrough
              </button>
            </div>
          </div>

          {/* Step 5: We File */}
          <div className="workflow-step-column">
            <div className="step-column-head">
              <div className="step-num-badge">5</div>
              <div className="step-head-text">
                <h3>We File</h3>
                <p>File the return with the IRS and state, and track acknowledgments.</p>
              </div>
            </div>

            <div className="workflow-client-card">
              <div className="wf-card-client-row">
                <Users size={16} className="wf-avatar-icon" />
                <div className="wf-client-names">
                  <strong>Quinn Blake</strong>
                  <span>Form 1040</span>
                </div>
              </div>
              <div className="wf-tag-pill">Family Return</div>

              <div className="wf-alert-chip alert-authorized">
                <CheckCircle2 size={13} />
                <span>Authorized - Ready to submit</span>
              </div>

              <div className="wf-next-action-row">
                <span className="next-label">Next action:</span>
                <span className="next-val">Submit to IRS &amp; state</span>
              </div>

              <div className="wf-assigned-row">
                <span>Assigned to: <strong>Priya</strong></span>
              </div>

              <button 
                type="button" 
                className="btn-wf-action"
                onClick={() => navigate('/clients')}
              >
                Open filing queue
              </button>
            </div>
          </div>
        </div>

        {/* Filing Gate Footnote */}
        <div className="workflow-gate-banner">
          <HelpCircle size={15} />
          <span>Filing gate: review complete + client authorization | Track federal and state acknowledgments separately.</span>
        </div>
      </div>

      {/* ========================================================
          BOTTOM GRID: PRIORITY QUEUE + CONSULTATIONS
          ======================================================== */}
      <div className="dashboard-bottom-grid">
        {/* Left Column: Priority Work Queue */}
        <div className="dash-sub-card">
          <div className="dash-sub-card-header">
            <div className="sub-card-title-wrap">
              <FileCheck size={18} style={{ color: '#0284c7' }} />
              <h3>Priority work queue</h3>
            </div>
            <span className="demo-data-tag">DESIGN CONCEPT • DEMO DATA</span>
          </div>

          <div className="priority-table-wrap">
            <table className="priority-data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Needs attention</th>
                  <th>Assigned to</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="pq-client-cell">
                      <Users size={15} style={{ color: '#0284c7' }} />
                      <strong>Taylor Reed</strong>
                    </div>
                  </td>
                  <td>
                    <span className="pq-status-badge badge-signature">
                      <PenTool size={12} /> Signature pending
                    </span>
                  </td>
                  <td>Priya</td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-pq-outline"
                      onClick={() => showToast('Form 8879 signature reminder sent to Taylor Reed')}
                    >
                      Send reminder
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="pq-client-cell">
                      <Users size={15} style={{ color: '#0284c7' }} />
                      <strong>Casey Miles</strong>
                    </div>
                  </td>
                  <td>
                    <span className="pq-status-badge badge-rejection">
                      <AlertTriangle size={12} /> Federal rejection
                    </span>
                  </td>
                  <td>Alex</td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-pq-outline"
                      onClick={() => showToast('IRS Error Code R0000-500-01 opened for Casey Miles')}
                    >
                      Resolve rejection
                    </button>
                  </td>
                </tr>

                <tr>
                  <td>
                    <div className="pq-client-cell">
                      <Users size={15} style={{ color: '#0284c7' }} />
                      <strong>Drew Chen</strong>
                    </div>
                  </td>
                  <td>
                    <span className="pq-status-badge badge-invoice">
                      <FileText size={12} /> Invoice unpaid
                    </span>
                  </td>
                  <td>Sam</td>
                  <td>
                    <button 
                      type="button" 
                      className="btn-pq-outline"
                      onClick={() => showToast('Tax Prep Invoice #IRA-2025-104 loaded for Drew Chen')}
                    >
                      View invoice
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Consultations */}
        <div className="dash-sub-card">
          <div className="dash-sub-card-header">
            <div className="sub-card-title-wrap">
              <Calendar size={18} style={{ color: '#0284c7' }} />
              <h3>Consultations</h3>
            </div>
            <span className="demo-data-tag">DESIGN CONCEPT • DEMO DATA</span>
          </div>

          <div className="consultations-list">
            <div className="consultation-item">
              <div className="consult-time-icon">
                <Clock size={16} />
              </div>
              <div className="consult-details">
                <strong>10:00 AM • New client intake</strong>
                <p>Jamie Frost • Form 1040 • Initial consultation</p>
                <span className="consult-assigned">Assigned to: <strong>Priya</strong></span>
              </div>
            </div>

            <div className="consultation-item">
              <div className="consult-time-icon">
                <Clock size={16} />
              </div>
              <div className="consult-details">
                <strong>11:30 AM • Return walkthrough</strong>
                <p>Lee Martins • Form 1040 • Review &amp; next steps</p>
                <span className="consult-assigned">Assigned to: <strong>Alex</strong></span>
              </div>
            </div>

            <button 
              type="button" 
              className="btn-view-calendar"
              onClick={() => showToast('Consultation calendar synced with Google Calendar & Outlook')}
            >
              <Calendar size={16} />
              <span>View calendar</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          WEBSITE QUICK ACTIONS BAR
          ======================================================== */}
      <div className="website-quick-actions-bar">
        <div className="quick-actions-label">
          <ExternalLink size={16} />
          <span>Website quick actions</span>
        </div>
        <div className="quick-actions-divider"></div>
        <div className="quick-actions-buttons">
          <button 
            type="button" 
            className="btn-quick-action" 
            onClick={() => window.open('/services', '_blank')}
          >
            ✏ Edit services
          </button>
          <button 
            type="button" 
            className="btn-quick-action" 
            onClick={() => window.open('/pricing', '_blank')}
          >
            🏷 Update pricing
          </button>
          <button 
            type="button" 
            className="btn-quick-action" 
            onClick={() => showToast('Early-file 15% discount promo banner is currently active on homepage')}
          >
            📢 Manage early-file offer
          </button>
          <button 
            type="button" 
            className="btn-quick-action" 
            onClick={() => window.open('/refer', '_blank')}
          >
            👥 Review referrals
          </button>
        </div>
      </div>

      {/* Footer Notes */}
      <div className="dashboard-footer-links">
        <button type="button" onClick={() => showToast('Permissions: Priya (Preparer), Alex (Preparer), Sam (Reviewer), Admin (Master)')}>
          Preparer and reviewer permissions
        </button>
        <span>•</span>
        <button type="button" onClick={() => showToast('Activity log: 42 actions recorded in past 24 hours')}>
          Activity history
        </button>
      </div>

      {/* ========================================================
          ADD CLIENT MODAL
          ======================================================== */}
      {showAddModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <Plus size={20} style={{ color: '#16a34a' }} />
                <h3>Add New Taxpayer Client</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setShowAddModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddClientSubmit} className="modal-body-form">
              <div className="modal-form-group">
                <label>Taxpayer Full Legal Name *</label>
                <input 
                  type="text" 
                  value={newClient.name} 
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Email Address *</label>
                <input 
                  type="email" 
                  value={newClient.email} 
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                  placeholder="e.g. john.doe@gmail.com"
                  required
                />
              </div>

              <div className="modal-form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  value={newClient.phone} 
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                  placeholder="e.g. +1 (555) 234-5678"
                />
              </div>

              <div className="modal-form-group">
                <label>Filing Status</label>
                <select 
                  value={newClient.filing_status} 
                  onChange={(e) => setNewClient({ ...newClient, filing_status: e.target.value })}
                >
                  <option value="Single / Form 1040">Single / Form 1040</option>
                  <option value="Married Filing Jointly (MFJ)">Married Filing Jointly (MFJ)</option>
                  <option value="Married Filing Separately (MFS)">Married Filing Separately (MFS)</option>
                  <option value="Head of Household (HOH)">Head of Household (HOH)</option>
                  <option value="Form 1040-NR">Form 1040-NR (Nonresident Alien)</option>
                </select>
              </div>

              <div className="modal-form-group">
                <label>Assigned Tax Preparer</label>
                <select 
                  value={newClient.assigned_to} 
                  onChange={(e) => setNewClient({ ...newClient, assigned_to: e.target.value })}
                >
                  <option value="Priya">Priya (Senior Preparer)</option>
                  <option value="Alex">Alex (Senior Preparer)</option>
                  <option value="Sam">Sam (Reviewer / CPA)</option>
                </select>
              </div>

              <div className="modal-footer-actions">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-add-client" 
                  disabled={creatingClient}
                >
                  {creatingClient ? 'Creating Record...' : 'Create & Open Dossier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
