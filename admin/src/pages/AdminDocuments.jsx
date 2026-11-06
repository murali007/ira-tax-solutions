import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
import { 
  Folder, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Download, 
  RefreshCw, 
  Eye, 
  X,
  MessageSquare,
  Mail,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import './AdminClientList.css';

export default function AdminDocuments() {
  const { token } = useAdminAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  // Preview & Rejection Modals
  const [previewDoc, setPreviewDoc] = useState(null);
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDocuments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.listAllDocuments(token);
      if (res.success && Array.isArray(res.data)) {
        setDocuments(res.data);
      } else {
        setDocuments([]);
      }
    } catch (err) {
      console.error('Fetch all documents error:', err);
      setError('Failed to load documents vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  // Handle Quick Approve
  const handleApprove = async (doc) => {
    try {
      await api.admin.validateDocument(doc.id, 'approved', '', token);
      setDocuments(prev => prev.map(d => d.id === doc.id ? { ...d, validation_status: 'approved', rejection_reason: '' } : d));
    } catch (err) {
      console.error('Document approval failed:', err);
      alert('Failed to update document status.');
    }
  };

  // Handle Rejection Submit
  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingDoc) return;
    setActionLoading(true);
    try {
      const reason = rejectionReason.trim() || 'Missing pages or unreadable scan. Please upload a clear official PDF.';
      await api.admin.validateDocument(rejectingDoc.id, 'rejected', reason, token);
      setDocuments(prev => prev.map(d => d.id === rejectingDoc.id ? { ...d, validation_status: 'rejected', rejection_reason: reason } : d));
      setRejectingDoc(null);
      setRejectionReason('');
    } catch (err) {
      console.error('Document rejection failed:', err);
      alert('Failed to update document status.');
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const totalDocs = documents.length;
  const pendingDocs = documents.filter(d => !d.validation_status || d.validation_status === 'pending').length;
  const approvedDocs = documents.filter(d => d.validation_status === 'approved').length;
  const rejectedDocs = documents.filter(d => d.validation_status === 'rejected').length;

  // Filter
  const filteredDocs = documents.filter(doc => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (doc.original_name || '').toLowerCase().includes(term) ||
      (doc.doc_type || '').toLowerCase().includes(term) ||
      (doc.client_name || '').toLowerCase().includes(term) ||
      (doc.client_email || '').toLowerCase().includes(term) ||
      (doc.file_no || '').toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (statusFilter === 'PENDING') {
      if (doc.validation_status && doc.validation_status !== 'pending') return false;
    } else if (statusFilter === 'APPROVED') {
      if (doc.validation_status !== 'approved') return false;
    } else if (statusFilter === 'REJECTED') {
      if (doc.validation_status !== 'rejected') return false;
    }

    if (typeFilter !== 'ALL') {
      if ((doc.doc_type || '').toLowerCase() !== typeFilter.toLowerCase()) return false;
    }

    return true;
  });

  // Extract distinct document types
  const distinctTypes = Array.from(new Set(documents.map(d => d.doc_type).filter(Boolean)));

  return (
    <div className="admin-queue-page">
      {/* Header */}
      <div className="admin-queue-header">
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Folder size={24} style={{ color: '#0284c7' }} />
            Master Tax Document Vault
          </h1>
          <p className="admin-page-subtitle">
            IRS Sec. 7216 compliant central repository for taxpayer W-2s, 1099s, bank statements, and tax organizer records.
          </p>
        </div>
        <button 
          type="button" 
          onClick={fetchDocuments}
          className="admin-btn-refresh" 
          title="Refresh Vault"
        >
          <RefreshCw size={15} className={loading ? 'spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Ribbon */}
      <div className="admin-stats-strip">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f8fafc', color: '#475569' }}>
            <FileText size={20} />
          </div>
          <div>
            <div className="stat-value">{totalDocs}</div>
            <div className="stat-label">Total Vault Documents</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value">{pendingDocs}</div>
            <div className="stat-label">Pending Verification</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-value">{approvedDocs}</div>
            <div className="stat-label">IRS Approved Docs</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="stat-value">{rejectedDocs}</div>
            <div className="stat-label">Action Required (Docs)</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div className="admin-search-box" style={{ flex: '1 1 280px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by doc name, form type, taxpayer name, or file #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter size={15} style={{ color: '#64748b' }} />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{
              padding: '7px 12px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              color: '#334155',
              background: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Document Types</option>
            {distinctTypes.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div className="admin-filter-tabs">
          {[
            { id: 'ALL', label: 'All', count: totalDocs },
            { id: 'PENDING', label: 'Pending', count: pendingDocs },
            { id: 'APPROVED', label: 'Approved', count: approvedDocs },
            { id: 'REJECTED', label: 'Rejected', count: rejectedDocs }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              className={`filter-tab ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', color: '#0284c7' }} />
            Loading centralized document records...
          </div>
        ) : filteredDocs.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <FileText size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
              No Documents in this View
            </h3>
            <p style={{ fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
              {searchTerm || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'No documents match your active filters.'
                : 'Taxpayer uploads will automatically synchronize and populate into this compliant document vault.'}
            </p>
          </div>
        ) : (
          <table className="admin-queue-table">
            <thead>
              <tr>
                <th>Document Details</th>
                <th>Category</th>
                <th>Taxpayer / Dossier</th>
                <th>Upload Date</th>
                <th>IRS Validation</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.map((doc) => {
                const isApproved = doc.validation_status === 'approved';
                const isRejected = doc.validation_status === 'rejected';
                const isPending = !doc.validation_status || doc.validation_status === 'pending';

                return (
                  <tr key={doc.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '8px',
                          background: '#f1f5f9',
                          color: '#0284c7',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <FileText size={18} />
                        </div>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '14px' }}>
                            {doc.original_name}
                          </strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>
                            Doc #{doc.id} • {doc.file_size || '350 KB'}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '12px',
                        fontWeight: 600
                      }}>
                        {doc.doc_type}
                      </span>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '13px' }}>{doc.client_name}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          <Link to={`/clients/${doc.user_id}`} style={{ color: '#0284c7', textDecoration: 'none' }}>
                            {doc.file_no}
                          </Link>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', color: '#475569' }}>
                        {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {new Date(doc.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>

                    <td>
                      <span className={`admin-status-badge ${
                        isApproved ? 'status-verified' :
                        isRejected ? 'status-action' : 'status-pending'
                      }`}>
                        {isApproved ? 'Approved ✓' : isRejected ? 'Rejected' : 'Pending Review'}
                      </span>
                      {isRejected && doc.rejection_reason && (
                        <div style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px', maxWidth: '180px' }}>
                          {doc.rejection_reason}
                        </div>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                        {/* Preview */}
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '12px'
                          }}
                          title="Preview in browser"
                        >
                          <Eye size={13} />
                        </button>

                        {/* Quick Approve */}
                        {!isApproved && (
                          <button
                            type="button"
                            onClick={() => handleApprove(doc)}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #bbf7d0',
                              background: '#f0fdf4',
                              color: '#16a34a',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                            title="Verify & Approve"
                          >
                            <CheckCircle2 size={13} /> Approve
                          </button>
                        )}

                        {/* Quick Reject */}
                        {!isRejected && (
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingDoc(doc);
                              setRejectionReason('');
                            }}
                            style={{
                              padding: '5px 9px',
                              borderRadius: '6px',
                              border: '1px solid #fecaca',
                              background: '#fef2f2',
                              color: '#dc2626',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                            title="Flag / Reject Document"
                          >
                            <X size={13} /> Reject
                          </button>
                        )}

                        {/* Link to Dossier */}
                        <Link
                          to={`/clients/${doc.user_id}`}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid #bae6fd',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            textDecoration: 'none',
                            fontSize: '12px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Open Client Dossier"
                        >
                          <ArrowUpRight size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* In-Browser Document Preview Modal */}
      {previewDoc && (
        <div 
          onClick={() => setPreviewDoc(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#0f172a' }}>{previewDoc.original_name}</strong>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  {previewDoc.doc_type} • {previewDoc.client_name} ({previewDoc.file_no})
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {previewDoc.file_url ? (
                previewDoc.file_url.match(/\.(jpg|jpeg|png)$/i) ? (
                  <img src={previewDoc.file_url} alt="Tax Document" style={{ maxWidth: '100%', maxHeight: '70vh', borderRadius: '8px' }} />
                ) : (
                  <iframe src={previewDoc.file_url} title="Tax Document PDF" style={{ width: '100%', height: '65vh', border: 'none' }} />
                )
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b' }}>
                  <FileText size={48} style={{ color: '#0284c7', margin: '0 auto 12px' }} />
                  <p>Encrypted document stored in compliance with IRS Publication 1075.</p>
                  <a 
                    href={previewDoc.file_url || '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="admin-btn-refresh"
                    style={{ marginTop: '10px', textDecoration: 'none' }}
                  >
                    <Download size={14} /> Download File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal with 1-Click WhatsApp / Email Notification */}
      {rejectingDoc && (
        <div 
          onClick={() => setRejectingDoc(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden'
            }}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #fee2e2', background: '#fef2f2', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: 700 }}>
                <AlertTriangle size={18} /> Flag / Reject Tax Document
              </div>
              <button 
                type="button"
                onClick={() => setRejectingDoc(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} style={{ padding: '20px' }}>
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#475569' }}>
                Flagging <strong>{rejectingDoc.original_name}</strong> for taxpayer <strong>{rejectingDoc.client_name}</strong>. Enter the precise reason below so they can re-upload:
              </p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Page 2 of Form W-2 is blurry, or Box 1 Wages are illegible. Please provide a direct PDF copy."
                rows={3}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  marginBottom: '16px'
                }}
                required
              />

              {/* 1-Click Outreach Helpers */}
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  1-Click Taxpayer Notification
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {rejectingDoc.client_phone && (
                    <a
                      href={`https://wa.me/${rejectingDoc.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${rejectingDoc.client_name}, your uploaded tax document (${rejectingDoc.original_name}) requires attention: ${rejectionReason || 'Please re-upload a clear copy'}. Please check your IRA Tax Solutions portal.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: '#dcfce7',
                        color: '#15803d',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <MessageSquare size={13} /> Open WhatsApp
                    </a>
                  )}
                  {rejectingDoc.client_email && (
                    <a
                      href={`mailto:${rejectingDoc.client_email}?subject=${encodeURIComponent(`Action Required: Tax Document ${rejectingDoc.original_name}`)}&body=${encodeURIComponent(`Hi ${rejectingDoc.client_name},\n\nDuring review of your tax dossier (${rejectingDoc.file_no}), the following document was flagged for replacement:\n\nDocument: ${rejectingDoc.original_name}\nReason: ${rejectionReason || 'Please re-upload a clear copy.'}\n\nPlease sign in to your secure portal at https://www.irataxsolutions.com/portal/upload to submit a replacement.\n\nWarm regards,\nIRA Tax Solutions Preparer Team`)}`}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Mail size={13} /> Compose Email
                    </a>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setRejectingDoc(null)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: 'none',
                    background: '#dc2626',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {actionLoading ? 'Saving...' : 'Confirm Document Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
