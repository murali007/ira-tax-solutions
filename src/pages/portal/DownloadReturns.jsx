import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Download, FileText, Clock, ShieldCheck } from 'lucide-react';
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
        const json = await api.returns.list(token);
        setReturnsList(json.data || []);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={20} style={{ color: '#16a34a' }} />
          <h2 style={{ margin: 0 }}>Download Form 1040 Returns &amp; IRS Receipts</h2>
        </div>
        <p className="subtitle">
          Access and download your finalized US Federal Form 1040, State Tax Returns, detailed computation schedules, and official IRS e-File Submission &amp; Acceptance receipts.
        </p>
      </div>

      <div className="uploaded-list-box">
        <h3>Finalized Returns &amp; Government Receipts</h3>
        {returnsList.length === 0 ? (
          <div className="empty-upload-state" style={{ padding: '60px 24px' }}>
            <Clock size={44} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
            <h4 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: '8px' }}>
              No Returns Available for Download Yet
            </h4>
            <p style={{ color: 'var(--color-text-light)', maxWidth: '520px', margin: '0 auto', fontSize: '14px', lineHeight: '1.6' }}>
              Your tax return is currently being prepared and reviewed. Once our dedicated preparer and separate quality reviewer finalize your draft and you sign Form 8879, your official Form 1040 PDF and IRS e-File acceptance confirmation will be published here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="doc-table">
              <thead>
                <tr>
                  <th>Document / Return Title</th>
                  <th>Jurisdiction</th>
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
                        <strong>{ret.form_title || 'Form 1040 Individual Return'}</strong>
                      </div>
                    </td>
                    <td>{ret.return_type || 'US Federal (IRS)'}</td>
                    <td>{ret.tax_year || 'Tax Year 2024'}</td>
                    <td>
                      <span className="status-pill verified">
                        {ret.status || 'IRS Accepted'}
                      </span>
                    </td>
                    <td>{ret.file_size || '—'}</td>
                    <td>
                      <button
                        onClick={() => alert(`Downloading ${ret.form_title || 'Tax Return PDF'}`)}
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
    </div>
  );
}
