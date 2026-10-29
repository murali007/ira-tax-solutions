import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Plus, Trash2, FileText, CheckCircle2, AlertCircle, Download, ShieldCheck } from 'lucide-react';
import './UploadDocuments.css';

export default function UploadDocuments() {
  const { token } = useAuth();
  const [docRows, setDocRows] = useState([
    { id: 1, docType: '', file: null }
  ]);
  const [uploadedList, setUploadedList] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.documents.list(token);
      setUploadedList(res.data || []);
    } catch (e) {
      console.error('Error fetching documents:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const handleAddSlot = () => {
    const newId = docRows.length > 0 ? Math.max(...docRows.map(r => r.id)) + 1 : 1;
    setDocRows([...docRows, { id: newId, docType: '', file: null }]);
  };

  const handleRemoveSlot = (id) => {
    if (docRows.length === 1) return;
    setDocRows(docRows.filter(r => r.id !== id));
  };

  const handleTypeChange = (id, val) => {
    setDocRows(docRows.map(r => r.id === id ? { ...r, docType: val } : r));
  };

  const handleFileChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocRows(docRows.map(r => r.id === id ? { ...r, file } : r));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setUploadMessage(null);

    if (!token) {
      setErrorMessage('Please login to upload documents.');
      return;
    }

    const readyToUpload = docRows.filter(r => r.file && r.docType);
    if (readyToUpload.length === 0) {
      setErrorMessage('Please select a Document Type and choose a file to upload.');
      return;
    }

    setIsUploading(true);
    try {
      await api.documents.upload(readyToUpload, token);
      setUploadMessage('Document(s) successfully encrypted and uploaded.');
      setDocRows([{ id: 1, docType: '', file: null }]);
      fetchDocuments();
      setTimeout(() => setUploadMessage(null), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to upload document.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploaded = async (id) => {
    if (!window.confirm('Delete this uploaded tax document?')) return;

    try {
      await api.documents.delete(id, token);
      setUploadedList(uploadedList.filter(d => d.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to remove document.');
    }
  };

  const handleDownloadFile = (doc) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank');
    } else {
      alert(`Downloading ${doc.filename || doc.document_type}`);
    }
  };

  return (
    <div className="upload-page-wrapper">
      <div className="upload-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <ShieldCheck size={20} style={{ color: '#16a34a' }} />
          <h2 style={{ margin: 0 }}>Secure US Tax Document Vault</h2>
        </div>
        <p className="subtitle">
          Upload your Form W-2s, 1099s, 1098s, and tax statements. All files are encrypted with 256-bit bank-level encryption and handled under IRS Section 7216 confidentiality rules.
        </p>
      </div>

      <div className="upload-interactive-card">
        {uploadMessage && (
          <div className="upload-success-toast">
            <CheckCircle2 size={16} />
            <span>{uploadMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="auth-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Row */}
        <form onSubmit={handleUploadSubmit}>
          {docRows.map((row) => (
            <div key={row.id} className="clip-upload-row">
              <div className="clip-col-type">
                <label>US Tax Document Type</label>
                <select
                  value={row.docType}
                  onChange={(e) => handleTypeChange(row.id, e.target.value)}
                  required
                >
                  <option value="">Select Document Type</option>
                  <option value="Form W-2 (Wage and Tax Statement)">Form W-2 (Wage &amp; Tax Statement - Employer)</option>
                  <option value="Form 1099-NEC / 1099-MISC">Form 1099-NEC / 1099-MISC (Freelance / 1099 Contracting)</option>
                  <option value="Form 1099-INT / 1099-DIV">Form 1099-INT / 1099-DIV (Interest &amp; Dividends)</option>
                  <option value="Form 1099-B / Consolidated 1099">Form 1099-B / Consolidated (Stocks, ESPP, RSUs &amp; Crypto)</option>
                  <option value="Form 1098 (Mortgage Interest & Property Tax)">Form 1098 (Mortgage Interest &amp; Real Estate Property Tax)</option>
                  <option value="Form 1098-E / 1098-T (Student Loans & Tuition)">Form 1098-E / 1098-T (Student Loans &amp; College Tuition)</option>
                  <option value="Form 1095-A (Health Insurance Marketplace)">Form 1095-A (Health Insurance Marketplace / ACA 1095-C)</option>
                  <option value="Schedule K-1 (Partnership / S-Corp / Estate)">Schedule K-1 (Form 1065 / 1120-S Partnership &amp; S-Corp)</option>
                  <option value="Form 1099-R (IRA / 401k / Pension Distribution)">Form 1099-R (IRA / 401(k) / Pension Distributions)</option>
                  <option value="Foreign Bank Accounts (FBAR FinCEN 114)">Foreign Bank Accounts &amp; Assets (FBAR FinCEN 114 / FATCA)</option>
                  <option value="Driver's License / State ID Copy">Driver's License / State ID Copy (IRS e-File Security Check)</option>
                  <option value="Prior Year Form 1040 Tax Return">Prior Year Form 1040 Federal &amp; State Returns</option>
                  <option value="Other Tax Document / Receipts">Other Tax Document / Business Expense Receipts</option>
                </select>
              </div>

              <div className="clip-col-file">
                <label>Document File (PDF, PNG, JPG, DOCX)</label>
                <div className="clip-file-input-box">
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(row.id, e)}
                    required
                  />
                </div>
              </div>

              <div className="clip-col-btn">
                <button
                  type="button"
                  onClick={handleAddSlot}
                  className="clip-blue-plus-btn"
                  title="Add Another Document Slot"
                >
                  <Plus size={18} />
                </button>
                {docRows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(row.id)}
                    className="clip-remove-slot-btn"
                    title="Remove Slot"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="clip-upload-actions">
            <button type="submit" className="btn-upload-blue" disabled={isUploading}>
              {isUploading ? 'Encrypting & Uploading...' : 'Upload & Encrypt'}
            </button>
            <button 
              type="button" 
              onClick={() => setDocRows([{ id: 1, docType: '', file: null }])} 
              className="btn-cancel-gray"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Uploaded Documents List */}
        <div className="clip-uploaded-section">
          <h3 className="section-title">Uploaded Documents ({uploadedList.length})</h3>
          {loading ? (
            <div style={{ padding: '20px 0', color: '#78909c', fontSize: '13px' }}>
              Loading documents from database...
            </div>
          ) : uploadedList.length === 0 ? (
            <div className="clip-empty-docs">
              <FileText size={32} style={{ color: '#b0bec5', margin: '0 auto 8px' }} />
              <p>No US tax documents uploaded yet.</p>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Upload your W-2 or 1099 above to begin preparation.</span>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedList.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <strong>{doc.document_type}</strong>
                      </td>
                      <td>
                        <span className="file-name-cell">{doc.filename || 'tax-document.pdf'}</span>
                      </td>
                      <td>{doc.created_at ? new Date(doc.created_at).toLocaleDateString() : 'Today'}</td>
                      <td>{doc.file_size || '—'}</td>
                      <td>
                        <span className="status-pill verified">
                          {doc.status || 'Received / In Review'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(doc)}
                            className="btn-link-action"
                            title="Download document"
                          >
                            <Download size={14} /> View
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteUploaded(doc.id)}
                            className="btn-link-action delete-color"
                            title="Delete file"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
