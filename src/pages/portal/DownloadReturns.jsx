import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Download, FileText, Clock, AlertCircle } from 'lucide-react';
import './UploadDocuments.css';

export default function DownloadReturns() {
  const { token } = useAuth();
  const [returnsList, setReturnsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReturns = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/tax-returns', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          setReturnsList(json.data || []);
        }
      } catch (e) {
        console.error('Error fetching tax returns:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [token]);

  if (loading) {
    return <div className="upload-page-wrapper" style={{ padding: '40px', textAlign: 'center' }}>Loading records...</div>;
  }

  return (
    <div className="upload-page-wrapper">
      <div className="upload-header-card">
        <h2>Download Tax Returns</h2>
        <p className="subtitle">
          Access and download your finalized Federal and State tax returns, schedules, and IRS Form 8879 authorizations.
        </p>
      </div>

      <div className="uploaded-list-box">
        <h3>Finalized Returns & Transcripts</h3>
        {returnsList.length === 0 ? (
          <div className="empty-upload-state" style={{ padding: '60px 24px' }}>
            <Clock size={44} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: '8px' }}>
              No Returns Available for Download Yet
            </h4>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '520px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
              Your tax return is currently in the preparation queue. Once your tax professional prepares and finalizes 
              your Form 1040 and state returns, the downloadable PDF packages will be published directly to this page.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Document / Form Title</th>
                  <th>Type</th>
                  <th>Tax Year</th>
                  <th>Status</th>
                  <th>File Size</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {returnsList.map((ret) => (
                  <tr key={ret.id}>
                    <td>
                      <div className="file-cell">
                        <FileText size={16} className="text-primary" />
                        <strong>{ret.form_title}</strong>
                      </div>
                    </td>
                    <td>{ret.return_type}</td>
                    <td>{ret.tax_year}</td>
                    <td>
                      <span className="status-pill verified">
                        {ret.status}
                      </span>
                    </td>
                    <td>{ret.file_size || '—'}</td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading ${ret.form_title}`)}
                        className="btn btn-outline btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Download size={14} /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="security-notice-card">
        <AlertCircle size={20} className="text-warning" />
        <div>
          <h4>IRS E-File Status Notification</h4>
          <p>
            Tax returns are uploaded here immediately following preparation. You will receive an automated email 
            notification once Form 1040 and state schedules are ready for your signature.
          </p>
        </div>
      </div>
    </div>
  );
}
