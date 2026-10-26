import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Trash2, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
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
      const res = await fetch('/api/documents', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        setUploadedList(json.data || []);
      }
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

    const formData = new FormData();
    readyToUpload.forEach(r => {
      formData.append('files', r.file);
      formData.append('docTypes', r.docType);
    });

    setIsUploading(true);
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const json = await res.json();
      if (res.ok) {
        setUploadMessage('Document(s) successfully uploaded.');
        setDocRows([{ id: 1, docType: '', file: null }]);
        fetchDocuments();
        setTimeout(() => setUploadMessage(null), 4000);
      } else {
        setErrorMessage(json.error || 'Failed to upload document.');
      }
    } catch {
      setErrorMessage('Network error during file upload.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteUploaded = async (id) => {
    if (!window.confirm('Delete this uploaded tax document?')) return;

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUploadedList(uploadedList.filter(d => d.id !== id));
      } else {
        alert('Failed to remove document.');
      }
    } catch {
      alert('Error connecting to database.');
    }
  };

  const handleDownloadFile = (doc) => {
    window.open(`/api/documents/download/${doc.id}?token=${token}`, '_blank');
  };

  return (
    <div className="upload-screen-wrapper">
      <div className="upload-main-card">
        {/* Title matching Clip 6 & 10 */}
        <h2 className="upload-page-title">Upload Documents</h2>

        <p className="upload-subtitle-text">
          Please upload tax related documents which will ensure accurate tax filing.
        </p>

        {uploadMessage && (
          <div className="upload-success-notice">
            <CheckCircle2 size={15} />
            <span>{uploadMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="auth-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Input Row matching Clip 6 & 10 */}
        <form onSubmit={handleUploadSubmit}>
          {docRows.map((row) => (
            <div key={row.id} className="clip-upload-row">
              <div className="clip-col-type">
                <label>Document Type</label>
                <select
                  value={row.docType}
                  onChange={(e) => handleTypeChange(row.id, e.target.value)}
                  required
                >
                  <option value="">Select Document Type</option>
                  <option value="Form W-2">Form W-2</option>
                  <option value="Form 1099-MISC / 1099-NEC">Form 1099-MISC / 1099-NEC</option>
                  <option value="Form 1099-INT">Form 1099-INT</option>
                  <option value="Form 1099-DIV">Form 1099-DIV</option>
                  <option value="Form 1099-B">Form 1099-B</option>
                  <option value="Form 1098">Form 1098</option>
                  <option value="Prior Year Return">Prior Year Tax Return</option>
                  <option value="Passport / Visa Copy">Passport / Visa Copy</option>
                  <option value="FBAR Records">FBAR Records</option>
                  <option value="Other Tax Document">Other Document</option>
                </select>
              </div>

              <div className="clip-col-file">
                <label>Document File</label>
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
                  title="Add Document Slot"
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

          {/* Action Buttons matching Clip 6 & 10 */}
          <div className="clip-upload-actions">
            <button type="submit" className="btn-upload-blue" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload'}
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
              <p>No tax documents uploaded yet.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="clip-doc-table">
                <thead>
                  <tr>
                    <th>Document Type</th>
                    <th>File Name</th>
                    <th>Size</th>
                    <th>Date Uploaded</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {uploadedList.map((doc) => (
                    <tr key={doc.id}>
                      <td><strong>{doc.doc_type}</strong></td>
                      <td>
                        <span className="file-name-cell">
                          <FileText size={14} className="text-muted" />
                          {doc.file_name}
                        </span>
                      </td>
                      <td>{doc.file_size}</td>
                      <td>{(doc.created_at || '').slice(0, 10)}</td>
                      <td>
                        <span className="status-badge-verified">
                          {doc.status}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleDownloadFile(doc)}
                            className="action-icon-btn"
                            title="Download"
                          >
                            <Download size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteUploaded(doc.id)}
                            className="action-icon-btn delete"
                            title="Delete"
                          >
                            <Trash2 size={13} />
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
