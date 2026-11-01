import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api, API_BASE } from '../lib/api';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Clock, 
  AlertTriangle, 
  Eye, 
  Download, 
  User, 
  Users, 
  Heart, 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Send,
  Check,
  X,
  Calculator,
  UploadCloud,
  Globe,
  DollarSign,
  FileCheck
} from 'lucide-react';
import './AdminClientDetail.css';

export default function AdminClientDetail() {
  const { id } = useParams();
  const { token } = useAdminAuth();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('taxpayer');
  
  // Status update state
  const [currentStatus, setCurrentStatus] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);

  // Reviewer note state
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('general');
  const [savingNote, setSavingNote] = useState(false);

  // Document modal preview state
  const [previewDoc, setPreviewDoc] = useState(null);

  // Rejection modal state
  const [rejectingDocId, setRejectingDocId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  // SSN toggle mask
  const [showSsn, setShowSsn] = useState(false);

  // 1. Tax Computation Drafter State
  const [summaryForm, setSummaryForm] = useState({
    tax_year: '2025',
    filing_status: 'Single / Form 1040',
    total_income: '$145,000',
    adjustments: '$3,500',
    agi: '$141,500',
    deductions: '$14,600 Standard Deduction',
    taxable_income: '$126,900',
    federal_tax: '$21,400',
    withheld: '$24,650',
    estimated_refund: '+$3,250.00',
    preparer_fee: '$150.00',
    fee_paid: 0,
    status: 'Ready for Review'
  });
  const [publishingSummary, setPublishingSummary] = useState(false);
  const [summarySavedSuccess, setSummarySavedSuccess] = useState(false);

  // 2. Return Deliverable Upload State
  const [returnForm, setReturnForm] = useState({
    form_title: 'Form 1040 - US Individual Income Tax Return',
    return_type: 'Federal 1040',
    tax_year: '2025',
    status: 'Ready for E-Verification',
    file_url: '',
    file_size: '420 KB'
  });
  const [uploadingReturn, setUploadingReturn] = useState(false);
  const [returnUploadedSuccess, setReturnUploadedSuccess] = useState(false);

  const fetchDossier = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.getClientDossier(id, token);
      if (res && res.data) {
        setDossier(res.data);
        setCurrentStatus(res.data.client.status || 'New File');

        if (res.data.taxSummary) {
          setSummaryForm(prev => ({
            ...prev,
            ...res.data.taxSummary
          }));
        } else if (res.data.taxpayer) {
          setSummaryForm(prev => ({
            ...prev,
            filing_status: res.data.taxpayer.filing_status || 'Single / Form 1040'
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching client dossier:', err);
      setError(err.message || 'Failed to load client dossier.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && id) {
      fetchDossier();
    }
  }, [id, token]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    setStatusUpdating(true);
    setStatusSuccess(false);

    try {
      await api.admin.updateClientStatus(id, newStatus, token);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 3000);
      fetchDossier();
    } catch (err) {
      alert(err.message || 'Failed to update filing status.');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleValidateDoc = async (docId, validationStatus, reason = '') => {
    // 1. Instantly update UI optimistically
    setDossier(prev => {
      if (!prev) return prev;
      const updatedDocs = (prev.documents || []).map(d => 
        d.id === docId 
          ? { 
              ...d, 
              validation_status: validationStatus, 
              rejection_reason: reason, 
              status: validationStatus === 'approved' 
                ? 'Verified & Approved' 
                : validationStatus === 'rejected' 
                  ? 'Action Required / Re-upload Requested' 
                  : 'Uploaded - Ready for Preparer Review',
              verified_by: 'IRA Master Tax Preparer'
            } 
          : d
      );
      const hasRejected = updatedDocs.some(d => d.validation_status === 'rejected');
      const allApproved = updatedDocs.length > 0 && updatedDocs.every(d => d.validation_status === 'approved');
      const newClientStatus = hasRejected 
        ? 'Action Required (Docs)' 
        : allApproved 
          ? 'Documents Verified' 
          : prev.client?.status;

      return {
        ...prev,
        client: {
          ...prev.client,
          status: newClientStatus
        },
        documents: updatedDocs
      };
    });

    if (previewDoc && previewDoc.id === docId) {
      setPreviewDoc(prev => ({
        ...prev,
        validation_status: validationStatus,
        rejection_reason: reason,
        status: validationStatus === 'approved' 
          ? 'Verified & Approved' 
          : 'Action Required / Re-upload Requested'
      }));
    }

    setRejectingDocId(null);
    setRejectionReason('');

    try {
      await api.admin.validateDocument(docId, validationStatus, reason, token);
      fetchDossier();
    } catch (err) {
      console.warn('Backend validation sync notification:', err);
    }
  };

  const handleConfirmReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      alert('Please enter a rejection reason or instruction for the client.');
      return;
    }
    setIsRejecting(true);
    try {
      await handleValidateDoc(rejectingDocId, 'rejected', rejectionReason.trim());
    } finally {
      setIsRejecting(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      await api.admin.addNote(id, newNote.trim(), noteType, token);
      setNewNote('');
      fetchDossier();
    } catch (err) {
      alert(err.message || 'Failed to save reviewer note.');
    } finally {
      setSavingNote(false);
    }
  };

  // 1. Handle Publishing Tax Summary
  const handlePublishSummary = async (e) => {
    e.preventDefault();
    setPublishingSummary(true);
    setSummarySavedSuccess(false);

    try {
      await api.admin.saveTaxSummary(id, summaryForm, token);
      setSummarySavedSuccess(true);
      setCurrentStatus('Ready for Client Review');
      setTimeout(() => setSummarySavedSuccess(false), 4000);
      fetchDossier();
    } catch (err) {
      alert(err.message || 'Failed to publish tax summary.');
    } finally {
      setPublishingSummary(false);
    }
  };

  // 2. Handle Uploading Final Return Deliverable
  const handlePublishReturn = async (e) => {
    e.preventDefault();
    setUploadingReturn(true);
    setReturnUploadedSuccess(false);

    try {
      await api.admin.uploadTaxReturn(id, returnForm, token);
      setReturnUploadedSuccess(true);
      setTimeout(() => setReturnUploadedSuccess(false), 4000);
      setReturnForm({
        form_title: 'Form 1040 - US Individual Income Tax Return',
        return_type: 'Federal 1040',
        tax_year: '2025',
        status: 'Ready for E-Verification',
        file_url: '',
        file_size: '420 KB'
      });
      fetchDossier();
    } catch (err) {
      alert(err.message || 'Failed to publish tax return deliverable.');
    } finally {
      setUploadingReturn(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <Clock size={28} className="spin-icon" style={{ color: '#38bdf8' }} />
        <span>Loading 360° Taxpayer Dossier &amp; Documents...</span>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="admin-error-screen">
        <AlertTriangle size={32} style={{ color: '#ef4444' }} />
        <h2>Dossier Unavailable</h2>
        <p>{error || 'The requested client record could not be loaded.'}</p>
        <Link to="/" className="btn-back-queue">
          <ArrowLeft size={16} /> Return to Queue
        </Link>
      </div>
    );
  }

  const { client, taxpayer, spouse, dependents = [], address, schedule, documents = [], taxSummary, taxReturns = [], reviewerNotes = [] } = dossier;

  const pendingDocsCount = documents.filter(d => !d.validation_status || d.validation_status === 'pending').length;
  const approvedDocsCount = documents.filter(d => d.validation_status === 'approved').length;
  const rejectedDocsCount = documents.filter(d => d.validation_status === 'rejected').length;

  return (
    <div className="admin-detail-page">
      {/* Top Breadcrumb & Action Header */}
      <div className="detail-top-nav">
        <Link to="/" className="btn-detail-back">
          <ArrowLeft size={16} />
          <span>Queue</span>
        </Link>
        <span className="nav-divider">/</span>
        <span className="nav-current-client">{client.name} ({client.file_no})</span>
      </div>

      {/* Client Overview Card */}
      <div className="detail-client-header-card">
        <div className="client-header-left">
          <div className="client-avatar-badge">
            {client.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="client-header-titles">
            <div className="client-name-row">
              <h2>{client.name}</h2>
              <span className="badge-file-no">{client.file_no}</span>
              <span className={`badge-client-status ${(client.status || '').toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                {client.status}
              </span>
            </div>
            <div className="client-contact-row">
              <span>✉ {client.email}</span>
              <span>📞 {client.phone || 'No phone recorded'}</span>
              <span>🏢 {taxpayer?.employer || 'Employer unstated'}</span>
              <span>🛂 Visa: {taxpayer?.visa_type || 'Expat / Resident'}</span>
            </div>
          </div>
        </div>

        {/* Status Workflow Selector */}
        <div className="client-header-right">
          <div className="status-control-box">
            <label>Filing Lifecycle Status:</label>
            <div className="status-select-wrap">
              <select 
                value={currentStatus} 
                onChange={handleStatusChange} 
                disabled={statusUpdating}
                className="detail-status-select"
              >
                <option value="Profile Created">Profile Created</option>
                <option value="Documents Uploaded">Documents Uploaded</option>
                <option value="Documents In Review">Documents In Review</option>
                <option value="Documents Verified">Documents Verified &amp; Cleared</option>
                <option value="Action Required (Docs)">Action Required (Re-upload Docs)</option>
                <option value="Drafting Form 1040">Drafting Form 1040</option>
                <option value="Ready for Client Review">Ready for Client Review</option>
                <option value="Fee Paid / In Queue for E-Filing">Fee Paid / In Queue for E-Filing</option>
                <option value="Filed with IRS &amp; Accepted">Filed with IRS &amp; Accepted</option>
              </select>
              {statusSuccess && (
                <span className="status-saved-pill">
                  <Check size={13} /> Updated
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workstation Layout */}
      <div className="detail-workstation-grid">
        {/* Left Column: Client 360° Form Audit Tabs */}
        <div className="detail-dossier-card">
          <div className="dossier-tabs-nav">
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'taxpayer' ? 'active' : ''}`}
              onClick={() => setActiveTab('taxpayer')}
            >
              <User size={15} />
              <span>Taxpayer</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'spouse' ? 'active' : ''}`}
              onClick={() => setActiveTab('spouse')}
            >
              <Heart size={15} />
              <span>Spouse</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'dependents' ? 'active' : ''}`}
              onClick={() => setActiveTab('dependents')}
            >
              <Users size={15} />
              <span>Dependents ({dependents.length})</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              <MapPin size={15} />
              <span>Residency</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'computation' ? 'active' : ''}`}
              onClick={() => setActiveTab('computation')}
              style={{ color: activeTab === 'computation' ? '#38bdf8' : '#cbd5e1' }}
            >
              <Calculator size={15} />
              <span>Tax Drafter</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'returns' ? 'active' : ''}`}
              onClick={() => setActiveTab('returns')}
              style={{ color: activeTab === 'returns' ? '#4ade80' : '#cbd5e1' }}
            >
              <FileCheck size={15} />
              <span>Deliverables ({taxReturns.length})</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'fbar' ? 'active' : ''}`}
              onClick={() => setActiveTab('fbar')}
            >
              <Globe size={15} />
              <span>FBAR / Assets</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar size={15} />
              <span>Schedule</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <MessageSquare size={15} />
              <span>Audit Log ({reviewerNotes.length})</span>
            </button>
          </div>

          <div className="dossier-tab-content">
            {/* 1. Taxpayer Profile Tab */}
            {activeTab === 'taxpayer' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Primary Taxpayer Declaration</h3>
                  <span className="head-badge">Form 1040 Heading</span>
                </div>

                {taxpayer ? (
                  <div className="audit-field-grid">
                    <div className="audit-field">
                      <span className="field-label">Full Legal Name</span>
                      <span className="field-value font-highlight">
                        {taxpayer.first_name} {taxpayer.middle_name} {taxpayer.last_name}
                      </span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Filing Status</span>
                      <span className="field-value font-highlight">{taxpayer.filing_status || 'Single / Not Specified'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">SSN / ITIN / PAN</span>
                      <div className="ssn-mask-row">
                        <span className="field-value font-mono">
                          {showSsn 
                            ? (taxpayer.ssn_itin || 'Not Provided') 
                            : (taxpayer.ssn_itin ? `•••-••-${taxpayer.ssn_itin.slice(-4)}` : 'Not Provided')}
                        </span>
                        {taxpayer.ssn_itin && (
                          <button 
                            type="button" 
                            className="btn-ssn-reveal"
                            onClick={() => setShowSsn(!showSsn)}
                          >
                            <Eye size={13} /> {showSsn ? 'Hide' : 'Reveal'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Date of Birth</span>
                      <span className="field-value">{taxpayer.dob || '—'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Visa / Immigration Status</span>
                      <span className="field-value">{taxpayer.visa_type || '—'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Citizenship</span>
                      <span className="field-value">{taxpayer.citizenship || '—'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Employer</span>
                      <span className="field-value">{taxpayer.employer || '—'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Occupation</span>
                      <span className="field-value">{taxpayer.occupation || '—'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Home Ownership</span>
                      <span className="field-value">{taxpayer.own_home || 'No'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Time Zone</span>
                      <span className="field-value">{taxpayer.time_zone || '—'}</span>
                    </div>

                    <div className="audit-field full-span">
                      <span className="field-label">Current Mailing Street Address</span>
                      <span className="field-value">
                        {taxpayer.street_address || '—'}, {taxpayer.city || ''} {taxpayer.state || ''} {taxpayer.zip_code || ''} ({taxpayer.country || 'USA'})
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>Client has not filled out the Taxpayer Information form yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Spouse Info Tab */}
            {activeTab === 'spouse' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Spouse Information</h3>
                  <span className="head-badge">Married Filing Jointly / Separately</span>
                </div>

                {spouse && spouse.has_spouse === 'yes' ? (
                  <div className="audit-field-grid">
                    <div className="audit-field">
                      <span className="field-label">Spouse Full Name</span>
                      <span className="field-value">
                        {spouse.first_name} {spouse.middle_name} {spouse.last_name}
                      </span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Gender</span>
                      <span className="field-value">{spouse.gender || '—'}</span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Date of Birth</span>
                      <span className="field-value">{spouse.dob || '—'}</span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Occupation</span>
                      <span className="field-value">{spouse.occupation || '—'}</span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Visa Type</span>
                      <span className="field-value">{spouse.visa_type || '—'}</span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Tax ID Type</span>
                      <span className="field-value">{spouse.tax_id_type || '—'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>Taxpayer indicated Single / Unmarried / No Spouse declared.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Dependents Tab */}
            {activeTab === 'dependents' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Claimed Dependents ({dependents.length})</h3>
                  <span className="head-badge">Child Tax Credit / Other Dependents</span>
                </div>

                {dependents.length === 0 ? (
                  <div className="dossier-empty-tab">
                    <p>No dependents declared by the taxpayer.</p>
                  </div>
                ) : (
                  <div className="dependents-audit-cards">
                    {dependents.map((dep, idx) => (
                      <div key={dep.id || idx} className="dependent-audit-item">
                        <div className="dep-head">
                          <strong>{dep.first_name} {dep.middle_name} {dep.last_name}</strong>
                          <span className="dep-rel">{dep.relationship || 'Dependent'}</span>
                        </div>
                        <div className="dep-details">
                          <span>DOB: {dep.dob || '—'}</span>
                          <span>Gender: {dep.gender || '—'}</span>
                          <span>Visa: {dep.visa_type || 'US Citizen / Resident'}</span>
                          <span>Days in US (2025): {dep.days_2025 || '365'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. Residency & State Tab */}
            {activeTab === 'address' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Residency History &amp; Multi-State Allocation</h3>
                  <span className="head-badge">State Returns (CA / NY / WA / TX)</span>
                </div>

                {address ? (
                  <div className="audit-field-grid">
                    <div className="audit-field">
                      <span className="field-label">Moved Between States During Tax Year?</span>
                      <span className="field-value font-highlight">
                        {address.moved_during_year === 'yes' ? 'YES (Part-Year Resident Return Needed)' : 'NO (Single State Resident)'}
                      </span>
                    </div>
                    <div className="audit-field full-span">
                      <span className="field-label">Primary Residence (Most of Year)</span>
                      <span className="field-value">
                        {address.primary_street}, {address.primary_city}, {address.primary_state} {address.primary_zip}
                      </span>
                      <span className="field-sub">Dates: {address.primary_start || '01-01-2025'} to {address.primary_end || '12-31-2025'}</span>
                    </div>

                    {address.moved_during_year === 'yes' && (
                      <div className="audit-field full-span state-highlight">
                        <span className="field-label">Secondary / Prior State Residence</span>
                        <span className="field-value">
                          {address.second_street || '—'}, {address.second_city || ''}, {address.second_state || ''} {address.second_zip || ''}
                        </span>
                        <span className="field-sub">Dates: {address.second_start} to {address.second_end}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>Client has not entered address and residency history yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. ⭐ TAX COMPUTATION DRAFTER (NEW) */}
            {activeTab === 'computation' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Form 1040 Tax Computation &amp; Drafter</h3>
                  <span className="head-badge">Publish Figures to Client</span>
                </div>

                <form onSubmit={handlePublishSummary} className="tax-drafter-form">
                  <div className="drafter-grid">
                    <div className="drafter-group">
                      <label>Tax Year</label>
                      <input 
                        type="text" 
                        value={summaryForm.tax_year} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, tax_year: e.target.value })}
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Filing Status</label>
                      <select 
                        value={summaryForm.filing_status} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, filing_status: e.target.value })}
                      >
                        <option value="Single / Form 1040">Single / Form 1040</option>
                        <option value="Married Filing Jointly (MFJ)">Married Filing Jointly (MFJ)</option>
                        <option value="Married Filing Separately (MFS)">Married Filing Separately (MFS)</option>
                        <option value="Head of Household (HOH)">Head of Household (HOH)</option>
                        <option value="Form 1040-NR (Nonresident Alien)">Form 1040-NR (Nonresident Alien)</option>
                      </select>
                    </div>

                    <div className="drafter-group">
                      <label>Total Wages &amp; 1099 Income (Line 1z)</label>
                      <input 
                        type="text" 
                        value={summaryForm.total_income} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, total_income: e.target.value })}
                        placeholder="e.g. $145,000"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Adjustments to Income (HSA, Student Loan)</label>
                      <input 
                        type="text" 
                        value={summaryForm.adjustments} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, adjustments: e.target.value })}
                        placeholder="e.g. $3,500"
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Adjusted Gross Income (AGI - Line 11)</label>
                      <input 
                        type="text" 
                        value={summaryForm.agi} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, agi: e.target.value })}
                        placeholder="e.g. $141,500"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Standard / Itemized Deductions</label>
                      <input 
                        type="text" 
                        value={summaryForm.deductions} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, deductions: e.target.value })}
                        placeholder="e.g. $14,600 Standard Deduction"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Taxable Income (Line 15)</label>
                      <input 
                        type="text" 
                        value={summaryForm.taxable_income} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, taxable_income: e.target.value })}
                        placeholder="e.g. $126,900"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Federal Tax Liability (Line 24)</label>
                      <input 
                        type="text" 
                        value={summaryForm.federal_tax} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, federal_tax: e.target.value })}
                        placeholder="e.g. $21,400"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Federal Tax Withheld (W-2 Box 2)</label>
                      <input 
                        type="text" 
                        value={summaryForm.withheld} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, withheld: e.target.value })}
                        placeholder="e.g. $24,650"
                        required
                      />
                    </div>

                    <div className="drafter-group highlight-refund">
                      <label>Net Federal Refund / (Amount Owed) *</label>
                      <input 
                        type="text" 
                        value={summaryForm.estimated_refund} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, estimated_refund: e.target.value })}
                        placeholder="e.g. +$3,250.00 Refund or -$450.00 Owed"
                        style={{ fontWeight: 700, color: summaryForm.estimated_refund?.includes('-') ? '#f87171' : '#4ade80' }}
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>IRA Tax Preparation Fee ($)</label>
                      <input 
                        type="text" 
                        value={summaryForm.preparer_fee} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, preparer_fee: e.target.value })}
                        placeholder="e.g. $150.00"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Fee Payment Status</label>
                      <select 
                        value={summaryForm.fee_paid} 
                        onChange={(e) => setSummaryForm({ ...summaryForm, fee_paid: parseInt(e.target.value, 10) })}
                      >
                        <option value={0}>Unpaid (Awaiting Payment)</option>
                        <option value={1}>Paid (ACH / Credit Card / UPI)</option>
                      </select>
                    </div>
                  </div>

                  <div className="drafter-actions">
                    <button type="submit" className="btn-publish-summary" disabled={publishingSummary}>
                      <DollarSign size={16} />
                      <span>{publishingSummary ? 'Publishing to Client...' : 'Save & Publish Tax Summary to Client Portal'}</span>
                    </button>
                    {summarySavedSuccess && (
                      <span className="summary-success-pill">
                        <Check size={14} /> Published to client screen at /portal/summary!
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* 6. ⭐ DELIVERABLE TAX RETURNS UPLOADER (NEW) */}
            {activeTab === 'returns' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Final Tax Return Deliverables &amp; Form 1040 PDFs</h3>
                  <span className="head-badge">Client Download Area</span>
                </div>

                {/* Upload Return Form */}
                <form onSubmit={handlePublishReturn} className="return-publish-form">
                  <h4>Publish New Tax Return / IRS Receipt</h4>
                  <div className="drafter-grid">
                    <div className="drafter-group">
                      <label>Document / Return Title</label>
                      <select 
                        value={returnForm.form_title} 
                        onChange={(e) => setReturnForm({ ...returnForm, form_title: e.target.value })}
                      >
                        <option value="Form 1040 - US Individual Income Tax Return">Form 1040 - US Individual Income Tax Return</option>
                        <option value="Form 1040-NR - Nonresident Alien Return">Form 1040-NR - Nonresident Alien Return</option>
                        <option value="California Form 540 State Return">California Form 540 State Return</option>
                        <option value="New York State IT-201 Resident Return">New York State IT-201 Resident Return</option>
                        <option value="FBAR FinCEN Form 114 Submission Report">FBAR FinCEN Form 114 Submission Report</option>
                        <option value="Official IRS e-File Submission & Acceptance Receipt">Official IRS e-File Submission &amp; Acceptance Receipt</option>
                      </select>
                    </div>

                    <div className="drafter-group">
                      <label>Jurisdiction</label>
                      <input 
                        type="text" 
                        value={returnForm.return_type} 
                        onChange={(e) => setReturnForm({ ...returnForm, return_type: e.target.value })}
                        placeholder="e.g. US Federal (IRS) or State"
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>Tax Year</label>
                      <input 
                        type="text" 
                        value={returnForm.tax_year} 
                        onChange={(e) => setReturnForm({ ...returnForm, tax_year: e.target.value })}
                        required
                      />
                    </div>

                    <div className="drafter-group">
                      <label>File URL or Storage Link</label>
                      <input 
                        type="text" 
                        value={returnForm.file_url} 
                        onChange={(e) => setReturnForm({ ...returnForm, file_url: e.target.value })}
                        placeholder="https://... or /tax-documents/1040.pdf"
                      />
                    </div>
                  </div>

                  <div className="drafter-actions">
                    <button type="submit" className="btn-publish-return" disabled={uploadingReturn}>
                      <UploadCloud size={16} />
                      <span>{uploadingReturn ? 'Publishing Deliverable...' : 'Publish Return for Client Download'}</span>
                    </button>
                    {returnUploadedSuccess && (
                      <span className="summary-success-pill">
                        <Check size={14} /> Deliverable available at /portal/download!
                      </span>
                    )}
                  </div>
                </form>

                {/* Published Returns List */}
                <div className="published-returns-list">
                  <h4>Published Deliverables for Client ({taxReturns.length})</h4>
                  {taxReturns.length === 0 ? (
                    <div className="dossier-empty-tab">
                      <p>No final returns published yet. Use the form above to attach the prepared Form 1040 or IRS acceptance receipt.</p>
                    </div>
                  ) : (
                    taxReturns.map((ret, idx) => (
                      <div key={ret.id || idx} className="published-return-card">
                        <div className="ret-info">
                          <FileText size={20} style={{ color: '#38bdf8' }} />
                          <div>
                            <strong>{ret.form_title}</strong>
                            <span className="ret-sub">{ret.return_type} • {ret.tax_year} • {ret.file_size || 'PDF'}</span>
                          </div>
                        </div>
                        <span className="badge-stat approved">✓ {ret.status || 'Ready for Download'}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 7. ⭐ FBAR & INDIAN FOREIGN ASSETS TAB (NEW) */}
            {activeTab === 'fbar' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>FBAR (FinCEN 114) &amp; Indian Foreign Asset Compliance</h3>
                  <span className="head-badge">Expat Tax Compliance</span>
                </div>

                <div className="fbar-guidance-card">
                  <h4>US Treasury Department FBAR Filing Rules</h4>
                  <p>
                    Any US tax resident (H-1B, L-1, Green Card, Citizen) with an aggregate balance exceeding <strong>$10,000 USD</strong> in foreign accounts (NRE, NRO, Fixed Deposits, PPF, Indian Mutual Funds) at ANY time during 2025 is legally required to file <strong>FinCEN Form 114</strong> by April 15 (auto-extended to October 15).
                  </p>
                </div>

                <div className="audit-field-grid">
                  <div className="audit-field">
                    <span className="field-label">Indian Bank Accounts Declared</span>
                    <span className="field-value font-highlight">NRE / NRO Savings &amp; Fixed Deposits</span>
                  </div>
                  <div className="audit-field">
                    <span className="field-label">FBAR Threshold Exceeded ($10,000+)</span>
                    <span className="field-value font-highlight" style={{ color: '#facc15' }}>Requires Verification</span>
                  </div>
                  <div className="audit-field full-span">
                    <span className="field-label">Preparer FBAR Action Checklist</span>
                    <div className="fbar-checklist">
                      <label className="checklist-item">
                        <input type="checkbox" defaultChecked />
                        <span>Confirm peak calendar year balances for all SBI, HDFC, ICICI, and Axis accounts</span>
                      </label>
                      <label className="checklist-item">
                        <input type="checkbox" defaultChecked />
                        <span>Verify USD to INR foreign exchange conversion using Treasury 2025 Year-End Rate</span>
                      </label>
                      <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Determine FATCA Form 8938 threshold ($50k Single / $100k MFJ year-end)</span>
                      </label>
                      <label className="checklist-item">
                        <input type="checkbox" />
                        <span>Draft FinCEN Form 114 via BSA E-Filing System</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Schedule Notes Tab */}
            {activeTab === 'schedule' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Schedule &amp; Taxpayer Special Notes</h3>
                  <span className="head-badge">Client Remarks</span>
                </div>

                {schedule ? (
                  <div className="audit-field-grid">
                    <div className="audit-field">
                      <span className="field-label">Filing Tax Year</span>
                      <span className="field-value">{schedule.tax_year || '2025'}</span>
                    </div>
                    <div className="audit-field">
                      <span className="field-label">Preferred Consultation Slot</span>
                      <span className="field-value">
                        {schedule.preferred_date || 'Flexible'} • {schedule.preferred_time || 'Anytime'}
                      </span>
                    </div>
                    <div className="audit-field full-span">
                      <span className="field-label">Client Tax Notes &amp; Specific Queries</span>
                      <div className="client-notes-box">
                        {schedule.notes ? schedule.notes : 'No extra notes provided by client.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>Client has not left specific tax notes.</p>
                  </div>
                )}
              </div>
            )}

            {/* 9. Reviewer Internal Notes Tab */}
            {activeTab === 'notes' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Internal Preparer Notes &amp; Audit Trail</h3>
                  <span className="head-badge">Confidential to Staff</span>
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="add-reviewer-note-form">
                  <div className="note-input-row">
                    <textarea
                      placeholder="Write an internal preparatory note, missing item reminder, or state allocation detail..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      rows={3}
                      required
                    />
                  </div>
                  <div className="note-action-row">
                    <select 
                      value={noteType} 
                      onChange={(e) => setNoteType(e.target.value)}
                      className="note-type-select"
                    >
                      <option value="general">General Note</option>
                      <option value="verification">Verification Check</option>
                      <option value="clarification">Client Clarification Needed</option>
                      <option value="warning">Potential IRS Audit Risk</option>
                    </select>

                    <button 
                      type="submit" 
                      className="btn-add-note" 
                      disabled={savingNote || !newNote.trim()}
                    >
                      <Send size={14} />
                      <span>{savingNote ? 'Saving...' : 'Add Internal Note'}</span>
                    </button>
                  </div>
                </form>

                {/* Notes List */}
                <div className="reviewer-notes-feed">
                  {reviewerNotes.length === 0 ? (
                    <div className="dossier-empty-tab">
                      <p>No internal notes logged yet. Use the box above to add notes for this file.</p>
                    </div>
                  ) : (
                    reviewerNotes.map((n) => (
                      <div key={n.id} className={`reviewer-note-item ${n.note_type}`}>
                        <div className="note-meta-head">
                          <span className="note-author">👤 {n.admin_name || 'Master Tax Admin'}</span>
                          <span className="note-time">{new Date(n.created_at).toLocaleString()}</span>
                          <span className={`note-type-pill ${n.note_type}`}>{n.note_type}</span>
                        </div>
                        <p className="note-body-text">{n.note}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Document Verification Vault & Inspector */}
        <div className="detail-documents-vault">
          <div className="vault-header">
            <div className="vault-title-row">
              <ShieldCheck size={20} style={{ color: '#16a34a' }} />
              <h3>Uploaded Tax Documents ({documents.length})</h3>
            </div>
            <div className="vault-stat-badges">
              <span className="badge-stat approved">✓ {approvedDocsCount} Approved</span>
              <span className="badge-stat pending">⏳ {pendingDocsCount} Pending</span>
              {rejectedDocsCount > 0 && (
                <span className="badge-stat rejected">⚠ {rejectedDocsCount} Needs Re-upload</span>
              )}
            </div>
          </div>

          <div className="vault-documents-list">
            {documents.length === 0 ? (
              <div className="vault-empty-card">
                <FileText size={38} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
                <h4>No Tax Documents Uploaded</h4>
                <p>The client has not yet uploaded Form W-2s or 1099s to their portal.</p>
              </div>
            ) : (
              documents.map((doc) => {
                const isApproved = doc.validation_status === 'approved';
                const isRejected = doc.validation_status === 'rejected';

                return (
                  <div key={doc.id} className={`vault-doc-card ${doc.validation_status}`}>
                    <div className="doc-card-top">
                      <div className="doc-type-icon">
                        <FileText size={18} />
                      </div>
                      <div className="doc-main-info">
                        <h4 className="doc-type-name">{doc.doc_type}</h4>
                        <div className="doc-meta-sub">
                          <span className="doc-file-name">{doc.file_name}</span>
                          <span className="doc-file-size">• {doc.file_size}</span>
                        </div>
                      </div>
                      <div className="doc-status-tag-wrap">
                        <span className={`doc-status-badge ${doc.validation_status}`}>
                          {isApproved && <CheckCircle2 size={12} />}
                          {isRejected && <AlertTriangle size={12} />}
                          {doc.status || 'Pending Review'}
                        </span>
                      </div>
                    </div>

                    {isRejected && doc.rejection_reason && (
                      <div className="doc-rejection-alert">
                        <AlertTriangle size={13} />
                        <span><strong>Rejection Feedback:</strong> {doc.rejection_reason}</span>
                      </div>
                    )}

                    <div className="doc-actions-toolbar">
                      <button 
                        type="button" 
                        onClick={() => setPreviewDoc(doc)} 
                        className="btn-doc-preview"
                      >
                        <Eye size={14} />
                        <span>Preview &amp; Audit</span>
                      </button>

                      {doc.file_url ? (
                        <a 
                          href={doc.file_url} 
                          target="_blank" 
                          rel="noreferrer"
                          download={doc.file_name} 
                          className="btn-doc-download"
                          title="Download file to computer"
                        >
                          <Download size={14} />
                        </a>
                      ) : (
                        <a 
                          href={`${API_BASE}/api/documents/download/${doc.id}`} 
                          download={doc.file_name} 
                          className="btn-doc-download"
                          title="Download file to computer"
                        >
                          <Download size={14} />
                        </a>
                      )}

                      <div className="doc-verify-btn-group">
                        <button 
                          type="button" 
                          onClick={() => handleValidateDoc(doc.id, 'approved')} 
                          className={`btn-action-approve ${isApproved ? 'current' : ''}`}
                          title="Mark Document as Verified & Approved"
                        >
                          <CheckCircle2 size={14} />
                          <span>Approve</span>
                        </button>

                        <button 
                          type="button" 
                          onClick={() => {
                            setRejectingDocId(doc.id);
                            setRejectionReason(doc.rejection_reason || '');
                          }} 
                          className={`btn-action-reject ${isRejected ? 'current' : ''}`}
                          title="Reject document with custom feedback for re-upload"
                        >
                          <XCircle size={14} />
                          <span>Reject / Re-upload</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Rejection Note Modal */}
      {rejectingDocId && (
        <div className="admin-modal-backdrop" onClick={() => setRejectingDocId(null)}>
          <div className="admin-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <AlertTriangle size={20} style={{ color: '#dc2626' }} />
                <h3>Request Document Re-upload</h3>
              </div>
              <button 
                type="button" 
                className="modal-close-btn" 
                onClick={() => setRejectingDocId(null)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="modal-body-form">
              <p className="modal-desc-text">
                Specify why this document is incomplete or unacceptable. The client will see this exact message on their upload dashboard so they can upload a corrected version.
              </p>

              <div className="modal-form-group">
                <label>Common Rejection Reasons:</label>
                <div className="quick-reasons-row">
                  <button 
                    type="button" 
                    className="quick-reason-btn"
                    onClick={() => setRejectionReason('The document scan is blurry or illegible. Please upload a clear photo or high-res PDF.')}
                  >
                    Blurry / Illegible
                  </button>
                  <button 
                    type="button" 
                    className="quick-reason-btn"
                    onClick={() => setRejectionReason('Missing Page 2 / State and Local tax withholding section is cut off.')}
                  >
                    Missing Page
                  </button>
                  <button 
                    type="button" 
                    className="quick-reason-btn"
                    onClick={() => setRejectionReason('This appears to be from a prior tax year. Please upload your current tax year statement.')}
                  >
                    Wrong Tax Year
                  </button>
                  <button 
                    type="button" 
                    className="quick-reason-btn"
                    onClick={() => setRejectionReason('Missing Employer Identification Number (EIN) or Box 1 Wages are cropped out.')}
                  >
                    Missing EIN / Box 1
                  </button>
                </div>
              </div>

              <div className="modal-form-group">
                <label>Feedback Message to Client *</label>
                <textarea 
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Please re-upload Form W-2 showing all 4 boxes clearly without fingers covering the numbers..."
                  required
                />
              </div>

              <div className="modal-footer-actions">
                <button 
                  type="button" 
                  className="btn-modal-cancel" 
                  onClick={() => setRejectingDocId(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-modal-confirm-reject"
                  disabled={isRejecting}
                >
                  {isRejecting ? 'Rejecting...' : 'Confirm Rejection & Notify Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-Browser Document Preview Modal */}
      {previewDoc && (
        <div className="admin-modal-backdrop preview-backdrop" onClick={() => setPreviewDoc(null)}>
          <div className="admin-preview-window" onClick={(e) => e.stopPropagation()}>
            <div className="preview-top-bar">
              <div className="preview-file-info">
                <FileText size={18} style={{ color: '#0284c7' }} />
                <div>
                  <h4>{previewDoc.doc_type}</h4>
                  <span className="preview-sub">{previewDoc.file_name} • {previewDoc.file_size}</span>
                </div>
              </div>

              <div className="preview-action-controls">
                <button 
                  type="button" 
                  onClick={() => handleValidateDoc(previewDoc.id, 'approved')} 
                  className="btn-preview-approve"
                >
                  <CheckCircle2 size={15} />
                  <span>Approve Document</span>
                </button>

                <button 
                  type="button" 
                  onClick={() => {
                    setRejectingDocId(previewDoc.id);
                    setRejectionReason(previewDoc.rejection_reason || '');
                  }} 
                  className="btn-preview-reject"
                >
                  <XCircle size={15} />
                  <span>Reject</span>
                </button>

                {previewDoc.file_url ? (
                  <a 
                    href={previewDoc.file_url} 
                    target="_blank"
                    rel="noreferrer"
                    download={previewDoc.file_name} 
                    className="btn-preview-download"
                    title="Download copy"
                  >
                    <Download size={15} />
                  </a>
                ) : (
                  <a 
                    href={`${API_BASE}/api/documents/download/${previewDoc.id}`} 
                    download={previewDoc.file_name} 
                    className="btn-preview-download"
                    title="Download copy"
                  >
                    <Download size={15} />
                  </a>
                )}

                <button 
                  type="button" 
                  className="btn-preview-close" 
                  onClick={() => setPreviewDoc(null)}
                  title="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="preview-viewer-body">
              {previewDoc.file_url ? (
                previewDoc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? (
                  <div className="preview-image-scroll">
                    <img 
                      src={previewDoc.file_url} 
                      alt={previewDoc.file_name} 
                      className="preview-full-image" 
                    />
                  </div>
                ) : (
                  <iframe 
                    src={previewDoc.file_url} 
                    title={previewDoc.file_name} 
                    className="preview-pdf-iframe" 
                  />
                )
              ) : API_BASE ? (
                previewDoc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? (
                  <div className="preview-image-scroll">
                    <img 
                      src={`${API_BASE}/api/admin/documents/${previewDoc.id}/view`} 
                      alt={previewDoc.file_name} 
                      className="preview-full-image" 
                    />
                  </div>
                ) : (
                  <iframe 
                    src={`${API_BASE}/api/admin/documents/${previewDoc.id}/view`} 
                    title={previewDoc.file_name} 
                    className="preview-pdf-iframe" 
                  />
                )
              ) : (
                <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#cbd5e1' }}>
                  <div style={{ maxWidth: '480px', margin: '0 auto', background: '#0f172a', padding: '2rem', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(2, 132, 199, 0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto' }}>
                      <FileText size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.5rem' }}>{previewDoc.doc_type}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>IRS Filing Document Audit View</p>
                    <div style={{ textAlign: 'left', background: '#1e293b', padding: '1rem', borderRadius: '8px', fontSize: '0.85rem', lineHeight: '1.6', border: '1px solid #334155' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>Original File:</span>
                        <strong style={{ color: '#f8fafc' }}>{previewDoc.file_name}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>File Size:</span>
                        <strong style={{ color: '#f8fafc' }}>{previewDoc.file_size}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#94a3b8' }}>Audit Status:</span>
                        <strong style={{ color: previewDoc.validation_status === 'approved' ? '#4ade80' : previewDoc.validation_status === 'rejected' ? '#f87171' : '#facc15' }}>
                          {previewDoc.status || 'Pending Verification'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#94a3b8' }}>Verified By:</span>
                        <strong style={{ color: '#f8fafc' }}>{previewDoc.verified_by || 'Awaiting Officer Review'}</strong>
                      </div>
                    </div>
                    {previewDoc.rejection_reason && (
                      <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', textAlign: 'left', fontSize: '0.85rem', color: '#fca5a5' }}>
                        <strong>Rejection Reason:</strong> {previewDoc.rejection_reason}
                      </div>
                    )}
                    <p style={{ marginTop: '1.25rem', fontSize: '0.8rem', color: '#64748b' }}>
                      To approve or reject this document, use the action buttons in the top header bar above.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
