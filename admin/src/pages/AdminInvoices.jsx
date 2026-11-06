import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
import { 
  Receipt, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  RefreshCw, 
  DollarSign, 
  MessageSquare,
  Mail,
  ArrowUpRight,
  TrendingUp,
  CreditCard
} from 'lucide-react';
import './AdminClientList.css';

export default function AdminInvoices() {
  const { token } = useAdminAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchInvoices = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.listInvoices(token);
      if (res.success && Array.isArray(res.data)) {
        setInvoices(res.data);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error('Fetch invoices error:', err);
      setError('Failed to load tax invoices.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  const handleMarkPaid = async (invoice) => {
    setActionLoadingId(invoice.id);
    try {
      await api.admin.markInvoicePaid(invoice.id, token);
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? { ...inv, fee_paid: true } : inv));
    } catch (err) {
      console.error('Failed to mark invoice as paid:', err);
      alert('Failed to update invoice payment status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Metrics
  const totalBilled = invoices.reduce((sum, inv) => sum + (inv.fee_amount || 0), 0);
  const totalCollected = invoices.filter(inv => inv.fee_paid).reduce((sum, inv) => sum + (inv.fee_amount || 0), 0);
  const outstandingBalance = totalBilled - totalCollected;
  const paidCount = invoices.filter(inv => inv.fee_paid).length;
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 100;

  // Filter
  const filteredInvoices = invoices.filter(inv => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (inv.client_name || '').toLowerCase().includes(term) ||
      (inv.client_email || '').toLowerCase().includes(term) ||
      (inv.client_phone || '').toLowerCase().includes(term) ||
      (inv.file_no || '').toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (statusFilter === 'PAID') return inv.fee_paid;
    if (statusFilter === 'PENDING') return !inv.fee_paid;
    return true;
  });

  const handleExportCSV = () => {
    if (invoices.length === 0) {
      alert('No invoice records to export.');
      return;
    }

    const headers = ['File Number', 'Client Name', 'Client Email', 'Client Phone', 'Tax Year', 'Filing Status', 'Fee Amount', 'Payment Status'];
    const rows = invoices.map(i => [
      `"${i.file_no || ''}"`,
      `"${i.client_name || ''}"`,
      `"${i.client_email || ''}"`,
      `"${i.client_phone || ''}"`,
      `"${i.tax_year || ''}"`,
      `"${i.filing_status || ''}"`,
      `"${i.fee_amount || 0}"`,
      `"${i.fee_paid ? 'Cleared & Paid' : 'Awaiting Payment'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IRA_Tax_Invoices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="admin-queue-page">
      {/* Header */}
      <div className="admin-queue-header">
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={24} style={{ color: '#0284c7' }} />
            Tax Preparation Billing &amp; Invoices
          </h1>
          <p className="admin-page-subtitle">
            Manage Form 1040 preparation fees, Wise domestic ACH collections, invoice payment reconciliations, and reminders.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={fetchInvoices}
            className="admin-btn-refresh" 
            title="Refresh Invoices"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            onClick={handleExportCSV} 
            className="admin-btn-refresh"
            style={{ borderColor: '#0284c7', color: '#0284c7' }}
            title="Export Invoices CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Metrics Strip */}
      <div className="admin-stats-strip">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0f9ff', color: '#0284c7' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <div className="stat-value">${totalBilled.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-label">Total Invoiced Fees</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-value">${totalCollected.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-label">Cleared via Wise / ACH</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
            <Clock size={20} />
          </div>
          <div>
            <div className="stat-value">${outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="stat-label">Outstanding Balance</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="stat-value">{collectionRate}%</div>
            <div className="stat-label">Settlement Rate ({paidCount}/{invoices.length})</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by client name, email, phone, or file #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          {[
            { id: 'ALL', label: 'All Invoices', count: invoices.length },
            { id: 'PENDING', label: 'Awaiting Payment', count: invoices.filter(i => !i.fee_paid).length },
            { id: 'PAID', label: 'Cleared & Paid', count: paidCount }
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

      {/* Main Invoices Table */}
      <div className="admin-table-container">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={24} className="spin" style={{ margin: '0 auto 12px', color: '#0284c7' }} />
            Loading billing records...
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <Receipt size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
              No Invoices Found
            </h3>
            <p style={{ fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
              {searchTerm || statusFilter !== 'ALL'
                ? 'No invoices match your current filter parameters.'
                : 'Client tax summaries automatically populate invoices upon drafting Form 1040 computation.'}
            </p>
          </div>
        ) : (
          <table className="admin-queue-table">
            <thead>
              <tr>
                <th>Invoice / File #</th>
                <th>Taxpayer Name</th>
                <th>Tax Filing Scope</th>
                <th>Agreed Fee</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => {
                const whatsappUrl = inv.client_phone 
                  ? `https://wa.me/${inv.client_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inv.client_name}, your Form 1040 tax computation is finalized! Please review and finalize your tax preparation fee (${inv.preparer_fee}) to authorize electronic submission: https://www.irataxsolutions.com/portal/payment`)}`
                  : null;

                const emailUrl = inv.client_email 
                  ? `mailto:${inv.client_email}?subject=${encodeURIComponent(`IRA Tax Preparation Invoice (${inv.file_no})`)}&body=${encodeURIComponent(`Hi ${inv.client_name},\n\nYour tax return computation for Tax Year ${inv.tax_year} is prepared.\n\nAgreed Preparation Fee: ${inv.preparer_fee}\nPayment Link: https://www.irataxsolutions.com/portal/payment\n\nOnce settled, our quality reviewer finalizes Form 8879 for your signature.\n\nSincerely,\nIRA Tax Solutions Billing Desk`)}`
                  : null;

                return (
                  <tr key={inv.id}>
                    <td>
                      <div>
                        <strong style={{ color: '#0284c7', fontSize: '13px' }}>{inv.file_no}</strong>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Inv #{inv.id}</div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '14px' }}>{inv.client_name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          {inv.client_email} {inv.client_phone ? `• ${inv.client_phone}` : ''}
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{inv.tax_year}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{inv.filing_status}</div>
                    </td>

                    <td>
                      <strong style={{ fontSize: '15px', color: '#0f172a' }}>
                        {inv.preparer_fee || '$150.00'}
                      </strong>
                    </td>

                    <td>
                      {inv.fee_paid ? (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#dcfce7',
                          color: '#15803d',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          <CheckCircle2 size={13} /> Cleared &amp; Paid
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: '#fef3c7',
                          color: '#b45309',
                          fontSize: '12px',
                          fontWeight: 700
                        }}>
                          <Clock size={13} /> Awaiting Payment
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {/* 1-click Mark as Paid */}
                        {!inv.fee_paid && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(inv)}
                            disabled={actionLoadingId === inv.id}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '6px',
                              border: '1px solid #bbf7d0',
                              background: '#f0fdf4',
                              color: '#16a34a',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: 600,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Acknowledge offline or direct Wise settlement"
                          >
                            <CreditCard size={13} /> {actionLoadingId === inv.id ? 'Marking...' : 'Mark Paid'}
                          </button>
                        )}

                        {/* WhatsApp Reminder */}
                        {!inv.fee_paid && whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #bbf7d0',
                              background: '#ffffff',
                              color: '#16a34a',
                              textDecoration: 'none',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Send WhatsApp payment reminder"
                          >
                            <MessageSquare size={13} /> Remind
                          </a>
                        )}

                        {/* Dossier Link */}
                        <Link
                          to={`/clients/${inv.client_id}`}
                          style={{
                            padding: '5px 8px',
                            borderRadius: '6px',
                            border: '1px solid #bae6fd',
                            background: '#f0f9ff',
                            color: '#0284c7',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                          title="Open Taxpayer Dossier"
                        >
                          Dossier <ArrowUpRight size={13} />
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
    </div>
  );
}
