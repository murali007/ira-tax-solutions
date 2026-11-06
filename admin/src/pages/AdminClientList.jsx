import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  FolderOpen,
  Download
} from 'lucide-react';
import './AdminClientList.css';

export default function AdminClientList() {
  const { token } = useAdminAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchClients = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.listClients(token);
      setClients(res.data || []);
    } catch (err) {
      console.error('Error fetching client queue:', err);
      setError(err.message || 'Failed to load client queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [token]);

  // Calculations for KPI metric cards
  const totalClients = clients.length;
  const pendingReview = clients.filter(c => (c.pending_docs > 0) || c.status === 'Documents Uploaded').length;
  const verifiedClients = clients.filter(c => c.status === 'Documents Verified' || (c.total_docs > 0 && c.approved_docs === c.total_docs)).length;
  const actionRequired = clients.filter(c => c.rejected_docs > 0 || c.status?.includes('Action Required')).length;

  // Filter clients based on search query and status filter
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.file_no && client.file_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.phone && client.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.refer_name && client.refer_name.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'PENDING') return (client.pending_docs > 0) || client.status === 'Documents Uploaded';
    if (statusFilter === 'VERIFIED') return client.status === 'Documents Verified';
    if (statusFilter === 'ACTION_REQ') return client.rejected_docs > 0 || client.status?.includes('Action Required');
    if (statusFilter === 'NO_DOCS') return client.total_docs === 0;

    return client.status === statusFilter;
  });

  // Export client queue as CSV
  const handleExportCSV = () => {
    if (!clients || clients.length === 0) {
      alert('No clients available to export.');
      return;
    }

    const headers = ['File No', 'Full Name', 'Email', 'Phone', 'Referral Name', 'Filing Status', 'Documents Total', 'Verified Docs', 'Lifecycle Status', 'Registration Date'];
    const rows = filteredClients.map(c => [
      `"${c.file_no || ''}"`,
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.refer_name || ''}"`,
      `"${c.filing_status || 'Single / 1040'}"`,
      c.total_docs || 0,
      c.approved_docs || 0,
      `"${c.status || 'Profile Created'}"`,
      `"${c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IRA_Tax_Clients_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-queue-page">
      {/* Page Title & Refresh */}
      <div className="admin-queue-header">
        <div>
          <h1 className="admin-page-title">Taxpayer Review Desk &amp; Intake Queue</h1>
          <p className="admin-page-subtitle">
            Inspect, audit, and validate uploaded Form W-2s, 1099s, taxpayer schedules, and dependent declarations.
          </p>
        </div>
        <button 
          type="button" 
          onClick={fetchClients} 
          className="admin-btn-refresh" 
          disabled={loading}
          title="Reload latest submissions"
        >
          <RefreshCw size={15} className={loading ? 'spin-icon' : ''} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {error && (
        <div className="admin-error-banner">
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metrics Ribbon */}
      <div className="admin-kpi-grid">
        <div className="kpi-card total">
          <div className="kpi-icon-wrap total">
            <Users size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Total Assigned Clients</span>
            <span className="kpi-value">{totalClients}</span>
            <span className="kpi-subtext">Active tax profiles</span>
          </div>
        </div>

        <div className="kpi-card pending">
          <div className="kpi-icon-wrap pending">
            <Clock size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Pending Document Audit</span>
            <span className="kpi-value">{pendingReview}</span>
            <span className="kpi-subtext">Requires preparer validation</span>
          </div>
        </div>

        <div className="kpi-card verified">
          <div className="kpi-icon-wrap verified">
            <CheckCircle2 size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Documents Verified</span>
            <span className="kpi-value">{verifiedClients}</span>
            <span className="kpi-subtext">Cleared for return preparation</span>
          </div>
        </div>

        <div className="kpi-card action">
          <div className="kpi-icon-wrap action">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-content">
            <span className="kpi-label">Action / Re-upload Req.</span>
            <span className="kpi-value">{actionRequired}</span>
            <span className="kpi-subtext">Rejected scans / Missing pages</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="admin-toolbar-card">
        <div className="admin-search-box">
          <Search size={17} className="search-icon" />
          <input
            type="text"
            placeholder="Search by client name, email, phone number, File ID, or referral..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              type="button" 
              className="clear-search-btn" 
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>

        <div className="admin-filter-group">
          <Filter size={15} className="filter-icon" />
          <span className="filter-label">Filter:</span>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select-filter"
          >
            <option value="ALL">All Clients ({totalClients})</option>
            <option value="PENDING">Pending Review ({pendingReview})</option>
            <option value="VERIFIED">Documents Verified ({verifiedClients})</option>
            <option value="ACTION_REQ">Action Required ({actionRequired})</option>
            <option value="NO_DOCS">Awaiting Uploads</option>
          </select>

          <button 
            type="button"
            onClick={handleExportCSV}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
              marginLeft: '8px'
            }}
            title="Download client records as CSV spreadsheet"
          >
            <Download size={14} style={{ color: '#16a34a' }} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Client Table Card */}
      <div className="admin-table-container">
        {loading ? (
          <div className="admin-loading-box">
            <RefreshCw size={28} className="spin-icon" style={{ color: '#0284c7', margin: '0 auto 12px' }} />
            <p>Loading client submissions from database...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="admin-empty-box">
            <FolderOpen size={42} style={{ color: '#94a3b8', margin: '0 auto 14px' }} />
            <h3>No Clients Matching Criteria</h3>
            <p>Try modifying your search query or switching your status filter.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Client Name &amp; Contact</th>
                  <th>File Number</th>
                  <th>Filing Type</th>
                  <th>Uploaded Documents</th>
                  <th>Filing Status</th>
                  <th>Registration Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => {
                  return (
                    <tr key={client.id} className="admin-table-row">
                      {/* Name & Contact */}
                      <td>
                        <div className="client-identity-cell">
                          <span className="client-name">{client.name}</span>
                          <span className="client-email">{client.email}</span>
                          {client.phone && <span className="client-phone">{client.phone}</span>}
                          {client.refer_name && (
                            <span className="client-referral-tag" style={{ display: 'inline-block', fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '2px 6px', borderRadius: '4px', marginTop: '2px', fontWeight: 500 }}>
                              Ref: {client.refer_name}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* File Number */}
                      <td>
                        <span className="file-number-tag">{client.file_no}</span>
                      </td>

                      {/* Filing Type */}
                      <td>
                        <div className="filing-type-cell">
                          <span className="type-badge">{client.filing_status || 'Single / 1040'}</span>
                          {client.employer && <span className="employer-hint">{client.employer}</span>}
                        </div>
                      </td>

                      {/* Uploaded Documents */}
                      <td>
                        <div className="docs-summary-cell">
                          <div className="docs-count-row">
                            <FileText size={15} style={{ color: '#64748b' }} />
                            <strong>{client.total_docs} Total</strong>
                          </div>
                          <div className="doc-mini-pills">
                            {client.approved_docs > 0 && (
                              <span className="mini-pill approved" title="Verified docs">
                                ✓ {client.approved_docs}
                              </span>
                            )}
                            {client.pending_docs > 0 && (
                              <span className="mini-pill pending" title="Pending review">
                                ⏳ {client.pending_docs}
                              </span>
                            )}
                            {client.rejected_docs > 0 && (
                              <span className="mini-pill rejected" title="Needs re-upload">
                                ⚠ {client.rejected_docs}
                              </span>
                            )}
                            {client.total_docs === 0 && (
                              <span className="mini-pill none">None</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Filing Status */}
                      <td>
                        <span className={`client-status-badge ${
                          client.status === 'Documents Verified' ? 'verified' :
                          client.status?.includes('Action Required') ? 'action' :
                          client.status === 'Documents Uploaded' ? 'uploaded' : 'default'
                        }`}>
                          {client.status || 'Profile Created'}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <span className="date-cell">
                          {client.created_at ? new Date(client.created_at).toLocaleDateString() : '—'}
                        </span>
                      </td>

                      {/* Action */}
                      <td>
                        <Link 
                          to={`/clients/${client.id}`} 
                          className="btn-review-client"
                        >
                          <span>Review Desk</span>
                          <ArrowRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
