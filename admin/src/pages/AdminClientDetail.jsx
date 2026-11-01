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
  X
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

  const fetchDossier = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.getClientDossier(id, token);
      if (res && res.data) {
        setDossier(res.data);
        setCurrentStatus(res.data.client.status || 'New File');
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
    try {
      await api.admin.validateDocument(docId, validationStatus, reason, token);
      if (previewDoc && previewDoc.id === docId) {
        setPreviewDoc(prev => ({
          ...prev,
          validation_status: validationStatus,
          rejection_reason: reason
        }));
      }
      setRejectingDocId(null);
      setRejectionReason('');
      fetchDossier();
    } catch (err) {
      alert(err.message || 'Failed to validate document.');
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

  if (loading) {
    return (
      <div className="admin-detail-loading">
        <div className="admin-detail-spinner"></div>
        <p>Loading 360° Client Tax Dossier...</p>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="admin-detail-error">
        <AlertTriangle size={32} />
        <h2>Client Dossier Error</h2>
        <p>{error || 'Client record not found.'}</p>
        <Link to="/" className="btn-back-queue">
          <ArrowLeft size={16} /> Back to Client Queue
        </Link>
      </div>
    );
  }

  const { client, taxpayer, spouse, dependents, address, schedule, documents, reviewerNotes } = dossier;

  const approvedDocsCount = documents.filter(d => d.validation_status === 'approved').length;
  const pendingDocsCount = documents.filter(d => !d.validation_status || d.validation_status === 'pending').length;
  const rejectedDocsCount = documents.filter(d => d.validation_status === 'rejected').length;

  return (
    <div className="admin-detail-root">
      {/* Top Header Bar */}
      <div className="detail-top-bar">
        <div className="detail-top-left">
          <Link to="/" className="btn-back-link">
            <ArrowLeft size={16} />
            <span>Client Queue</span>
          </Link>
          <div className="detail-title-group">
            <div className="detail-name-row">
              <h2>{client.name}</h2>
              <span className="detail-file-pill">{client.file_no}</span>
            </div>
            <div className="detail-meta-row">
              <span>✉ {client.email}</span>
              {client.phone && <span>☎ {client.phone}</span>}
              <span>Registered: {new Date(client.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="detail-top-right">
          <div className="status-control-box">
            <label className="status-label">Overall Filing Status</label>
            <div className="status-select-wrap">
              <select 
                value={currentStatus} 
                onChange={handleStatusChange} 
                disabled={statusUpdating}
                className="detail-status-select"
              >
                <option value="New File">New File</option>
                <option value="Taxpayer Info Completed">Taxpayer Info Completed</option>
                <option value="Documents Uploaded">Documents Uploaded</option>
                <option value="Documents In Review">Documents In Review</option>
                <option value="Documents Verified">Documents Verified &amp; Cleared</option>
                <option value="Action Required (Docs)">Action Required (Re-upload Docs)</option>
                <option value="Draft 1040 Prepared">Draft 1040 Prepared</option>
                <option value="Ready for Client Review">Ready for Client Review</option>
                <option value="Filed with IRS">Filed with IRS &amp; State</option>
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
              <span>Taxpayer Info</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'spouse' ? 'active' : ''}`}
              onClick={() => setActiveTab('spouse')}
            >
              <Heart size={15} />
              <span>Spouse Info</span>
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
              <span>Residency &amp; State</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar size={15} />
              <span>Schedule Notes</span>
            </button>
            <button 
              type="button" 
              className={`dossier-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <MessageSquare size={15} />
              <span>Internal Audit Log ({reviewerNotes.length})</span>
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
                      <span className="field-label">Full Name</span>
                      <span className="field-value">
                        {taxpayer.first_name} {taxpayer.middle_name} {taxpayer.last_name}
                      </span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">Filing Status</span>
                      <span className="field-value highlight">{taxpayer.filing_status || 'Single'}</span>
                    </div>

                    <div className="audit-field">
                      <span className="field-label">SSN / ITIN</span>
                      <div className="ssn-field-row">
                        <span className="field-value ssn-mono">
                          {showSsn ? (taxpayer.ssn_itin || '—') : (taxpayer.ssn_itin ? `XXX-XX-${taxpayer.ssn_itin.slice(-4)}` : '—')}
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
                    <p>Client selected "No Spouse / Unmarried" on their return intake questionnaire.</p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Dependents Tab */}
            {activeTab === 'dependents' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Declared Dependents ({dependents.length})</h3>
                  <span className="head-badge">Child Tax Credit &amp; Other Dependent Credit</span>
                </div>

                {dependents.length > 0 ? (
                  <div className="dependents-table-wrap">
                    <table className="audit-table">
                      <thead>
                        <tr>
                          <th>Full Name</th>
                          <th>Relationship</th>
                          <th>DOB / Gender</th>
                          <th>Visa / Tax ID</th>
                          <th>Days in US (2025/24/23)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dependents.map((dep, idx) => (
                          <tr key={dep.id || idx}>
                            <td>
                              <strong>{dep.first_name} {dep.middle_name} {dep.last_name}</strong>
                            </td>
                            <td><span className="tag-pill">{dep.relationship || 'Child'}</span></td>
                            <td>{dep.dob || '—'} ({dep.gender || '—'})</td>
                            <td>{dep.tax_id_type || 'SSN'} • {dep.visa_type || 'Citizen/Resident'}</td>
                            <td>{dep.days_2025 || '365'} / {dep.days_2024 || '365'} / {dep.days_2023 || '365'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>No dependents declared on file for this taxpayer.</p>
                  </div>
                )}
              </div>
            )}

            {/* 4. Address & State Residency Tab */}
            {activeTab === 'address' && (
              <div className="dossier-section">
                <div className="dossier-section-head">
                  <h3>Address History &amp; Multi-State Residency</h3>
                  <span className="head-badge">Part-Year / Non-Resident Returns</span>
                </div>

                {address ? (
                  <div className="audit-field-grid">
                    <div className="audit-field full-span">
                      <span className="field-label">Moved Between States During Tax Year?</span>
                      <span className="field-value highlight">
                        {address.moved_during_year === 'yes' ? 'YES - Requires Multi-State Tax Filing' : 'NO - Single State Residency'}
                      </span>
                    </div>

                    <div className="audit-field full-span">
                      <span className="field-label">Primary Residence</span>
                      <span className="field-value">
                        {address.primary_street || '—'}, {address.primary_city} {address.primary_state} {address.primary_zip}
                      </span>
                      <span className="field-sub">
                        Residency Dates: {address.primary_start || '01/01/2025'} to {address.primary_end || '12/31/2025'}
                      </span>
                    </div>

                    {address.moved_during_year === 'yes' && address.second_street && (
                      <div className="audit-field full-span">
                        <span className="field-label">Secondary / Prior State Residence</span>
                        <span className="field-value">
                          {address.second_street}, {address.second_city} {address.second_state} {address.second_zip}
                        </span>
                        <span className="field-sub">
                          Residency Dates: {address.second_start || '—'} to {address.second_end || '—'}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="dossier-empty-tab">
                    <p>Address history has not been submitted yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* 5. Schedule & Notes Tab */}
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
                      <span className="field-value">{schedule.tax_year || '2026'}</span>
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

            {/* 6. Reviewer Internal Notes Tab */}
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
                          <span className="note-author">👤 {n.admin_name}</span>
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
                const valStatus = doc.validation_status || 'pending';
                const isApproved = valStatus === 'approved';
                const isRejected = valStatus === 'rejected';

                return (
                  <div key={doc.id} className={`vault-doc-card ${valStatus}`}>
                    {/* Top Row: Doc Type & Validation Pill */}
                    <div className="doc-card-top">
                      <span className="doc-type-title">{doc.doc_type}</span>
                      <span className={`vault-status-pill ${valStatus}`}>
                        {isApproved && <CheckCircle2 size={13} />}
                        {isRejected && <AlertTriangle size={13} />}
                        {!isApproved && !isRejected && <Clock size={13} />}
                        <span>
                          {isApproved ? 'Verified & Approved' : isRejected ? 'Rejected (Needs Re-upload)' : 'Pending Review'}
                        </span>
                      </span>
                    </div>

                    {/* File Meta */}
                    <div className="doc-card-meta">
                      <span className="meta-filename" title={doc.file_name}>
                        📄 {doc.file_name}
                      </span>
                      <span className="meta-filesize">{doc.file_size || '—'}</span>
                      <span className="meta-date">
                        Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Rejection Banner if Rejected */}
                    {isRejected && doc.rejection_reason && (
                      <div className="doc-card-rejection-alert">
                        <strong>Reason sent to client:</strong> {doc.rejection_reason}
                      </div>
                    )}

                    {/* Verified By Footnote */}
                    {isApproved && doc.verified_by && (
                      <div className="doc-card-approved-foot">
                        ✓ Verified by {doc.verified_by} {doc.verified_at ? `on ${new Date(doc.verified_at).toLocaleDateString()}` : ''}
                      </div>
                    )}

                    {/* Actions Row */}
                    <div className="doc-card-actions">
                      <button 
                        type="button" 
                        onClick={() => setPreviewDoc(doc)} 
                        className="btn-doc-preview"
                      >
                        <Eye size={14} />
                        <span>Preview &amp; Audit</span>
                      </button>

                      <a 
                        href={`${API_BASE}/api/documents/download/${doc.id}`} 
                        download={doc.file_name} 
                        className="btn-doc-download"
                        title="Download file to computer"
                      >
                        <Download size={14} />
                      </a>

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

                <a 
                  href={`${API_BASE}/api/documents/download/${previewDoc.id}`} 
                  download={previewDoc.file_name} 
                  className="btn-preview-download"
                  title="Download copy"
                >
                  <Download size={15} />
                </a>

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
              {previewDoc.file_name?.match(/\.(jpg|jpeg|png)$/i) ? (
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
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
