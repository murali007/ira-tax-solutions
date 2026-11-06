import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
import { 
  Megaphone, 
  Users, 
  CheckCircle2, 
  Clock, 
  Search, 
  Download, 
  RefreshCw, 
  DollarSign, 
  MessageSquare,
  Gift,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import './AdminClientList.css';

const REFERRAL_PAID_STORAGE_KEY = 'ira_admin_referral_rewards_paid';

export default function AdminReferrals() {
  const { token } = useAdminAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paidRewards, setPaidRewards] = useState(() => {
    try {
      const saved = localStorage.getItem(REFERRAL_PAID_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleRewardPaid = (clientId) => {
    setPaidRewards(prev => {
      const updated = { ...prev, [clientId]: !prev[clientId] };
      try {
        localStorage.setItem(REFERRAL_PAID_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save referral reward state', e);
      }
      return updated;
    });
  };

  const fetchReferrals = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.admin.listClients(token);
      if (res.success && Array.isArray(res.data)) {
        setClients(res.data);
      } else {
        setClients([]);
      }
    } catch (err) {
      console.error('Fetch clients for referrals error:', err);
      setError('Failed to load client referrals.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [token]);

  // Filter clients that have a referral recorded
  const referralList = clients
    .filter(c => c.refer_name && c.refer_name.trim().length > 0)
    .map(c => ({
      ...c,
      isRewardPaid: Boolean(paidRewards[c.id])
    }));

  // Stats calculation
  const totalReferrals = referralList.length;
  const filedOrReviewed = referralList.filter(c => 
    c.status.includes('Verified') || c.status.includes('Review') || c.status.includes('Filed')
  ).length;
  const totalRewardsValue = totalReferrals * 20;
  const totalPaidOut = referralList.filter(c => c.isRewardPaid).length * 20;

  // Filter by search & status
  const filteredReferrals = referralList.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      (item.refer_name || '').toLowerCase().includes(term) ||
      (item.name || '').toLowerCase().includes(term) ||
      (item.email || '').toLowerCase().includes(term) ||
      (item.file_no || '').toLowerCase().includes(term);

    if (!matchSearch) return false;

    if (statusFilter === 'PAID') return item.isRewardPaid;
    if (statusFilter === 'PENDING_PAYOUT') return !item.isRewardPaid;
    if (statusFilter === 'FILED') {
      return item.status.includes('Verified') || item.status.includes('Review') || item.status.includes('Filed');
    }
    return true;
  });

  const handleExportCSV = () => {
    if (referralList.length === 0) {
      alert('No referral records to export.');
      return;
    }

    const headers = ['Referrer Name', 'Referred Client', 'Client Email', 'Client Phone', 'File Number', 'Filing Status', 'Reward Amount', 'Reward Paid'];
    const rows = referralList.map(r => [
      `"${r.refer_name || ''}"`,
      `"${r.name || ''}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.file_no || ''}"`,
      `"${r.status || ''}"`,
      `"$20.00"`,
      `"${r.isRewardPaid ? 'Yes' : 'No'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IRA_Tax_Referrals_${new Date().toISOString().slice(0, 10)}.csv`);
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
            <Megaphone size={24} style={{ color: '#0284c7' }} />
            Client Referral Program &amp; Rewards
          </h1>
          <p className="admin-page-subtitle">
            Track client-referred taxpayers, reward disbursements ($20 bonus/filing credit), and referrer engagement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button 
            type="button" 
            onClick={fetchReferrals}
            className="admin-btn-refresh" 
            title="Refresh Referrals"
          >
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
          <button 
            type="button" 
            onClick={handleExportCSV} 
            className="admin-btn-refresh"
            style={{ borderColor: '#0284c7', color: '#0284c7' }}
            title="Export Referrals CSV"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Ribbon */}
      <div className="admin-stats-strip">
        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
            <Gift size={20} />
          </div>
          <div>
            <div className="stat-value">{totalReferrals}</div>
            <div className="stat-label">Total Referrals</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#eff6ff', color: '#0284c7' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="stat-value">{filedOrReviewed}</div>
            <div className="stat-label">Active / In Filing</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
            <DollarSign size={20} />
          </div>
          <div>
            <div className="stat-value">${totalRewardsValue}</div>
            <div className="stat-label">Total Rewards Pool</div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-wrap" style={{ background: '#ecfdf5', color: '#059669' }}>
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="stat-value">${totalPaidOut}</div>
            <div className="stat-label">Disbursed / Settled</div>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar">
        <div className="admin-search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by referrer name, client name, email, or file #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="admin-filter-tabs">
          {[
            { id: 'ALL', label: 'All Referrals', count: totalReferrals },
            { id: 'PENDING_PAYOUT', label: 'Pending Payout', count: referralList.filter(r => !r.isRewardPaid).length },
            { id: 'PAID', label: 'Reward Settled', count: referralList.filter(r => r.isRewardPaid).length },
            { id: 'FILED', label: 'In Filing / Verified', count: filedOrReviewed }
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
            Loading referral records from Supabase...
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <Megaphone size={40} style={{ color: '#cbd5e1', margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#334155', margin: '0 0 6px' }}>
              No Referrals Found
            </h3>
            <p style={{ fontSize: '14px', maxWidth: '440px', margin: '0 auto' }}>
              {searchTerm 
                ? 'No referrals match your current search query.' 
                : 'When new taxpayers enter a referrer name during signup or intake, they will appear here with automated $20 reward tracking.'}
            </p>
          </div>
        ) : (
          <table className="admin-queue-table">
            <thead>
              <tr>
                <th>Referrer Name</th>
                <th>Referred Taxpayer</th>
                <th>Contact Details</th>
                <th>Filing Stage</th>
                <th>Reward ($20)</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((item) => {
                const whatsappUrl = item.phone 
                  ? `https://wa.me/${item.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${item.refer_name || 'there'}, thank you for referring ${item.name} to IRA Tax Solutions! We have successfully received their tax dossier.`)}`
                  : null;

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '8px', 
                          background: '#e0f2fe', 
                          color: '#0284c7', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '13px'
                        }}>
                          {item.refer_name.charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <strong style={{ color: '#0f172a', fontSize: '14px' }}>{item.refer_name}</strong>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>Ambassador / Client</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <strong style={{ color: '#0f172a', fontSize: '14px' }}>{item.name}</strong>
                        <div style={{ fontSize: '12px', color: '#0284c7', fontWeight: 600 }}>{item.file_no}</div>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '13px', color: '#334155' }}>{item.email}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>{item.phone || 'No phone'}</div>
                    </td>

                    <td>
                      <span className={`admin-status-badge ${
                        item.status.includes('Verified') ? 'status-verified' :
                        item.status.includes('Action') ? 'status-action' :
                        item.status.includes('Review') ? 'status-review' : 'status-pending'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        onClick={() => toggleRewardPaid(item.id)}
                        style={{
                          border: 'none',
                          cursor: 'pointer',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.15s ease',
                          background: item.isRewardPaid ? '#dcfce7' : '#fef3c7',
                          color: item.isRewardPaid ? '#15803d' : '#b45309'
                        }}
                        title="Click to toggle payout status"
                      >
                        {item.isRewardPaid ? (
                          <>
                            <CheckCircle2 size={13} /> Paid ($20.00)
                          </>
                        ) : (
                          <>
                            <Clock size={13} /> Mark Paid ($20.00)
                          </>
                        )}
                      </button>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px', alignItems: 'center' }}>
                        {whatsappUrl && (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-action-sm"
                            style={{ 
                              color: '#16a34a', 
                              borderColor: '#bbf7d0',
                              padding: '5px 8px',
                              borderRadius: '6px',
                              border: '1px solid #bbf7d0',
                              textDecoration: 'none',
                              fontSize: '12px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Send WhatsApp update to referrer"
                          >
                            <MessageSquare size={13} /> WA Note
                          </a>
                        )}
                        <Link
                          to={`/clients/${item.id}`}
                          className="btn-action-sm"
                          style={{
                            color: '#0284c7',
                            borderColor: '#bae6fd',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            border: '1px solid #bae6fd',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
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
