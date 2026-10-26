import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileSignature, AlertTriangle, ArrowLeft, CheckCircle2 } from 'lucide-react';
import './TaxSummary.css';

export default function ServiceAgreement() {
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="summary-page-container">
      <div className="summary-header">
        <div>
          <h2>Tax Filing Client Service Agreement</h2>
          <p>Terms of engagement between the taxpayer and IRA Tax Solutions.</p>
        </div>
        <Link to="/portal" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="summary-disclaimer" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
        <AlertTriangle size={20} className="text-warning" />
        <div>
          <strong>Notice:</strong>
          <p>
            This agreement outlines our professional engagement terms, confidentiality commitments, and 
            responsibilities pursuant to Circular 230 regulations governing practice before the Internal Revenue Service.
          </p>
        </div>
      </div>

      <div className="summary-card">
        <h3>1. Scope of Engagement</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          IRA Tax Solutions agrees to prepare the specified Federal income tax return (Form 1040/1040-NR) and associated 
          state income tax returns based solely upon documentation and representations provided by the taxpayer.
        </p>

        <h3>2. Client Responsibilities</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          The taxpayer confirms that all information disclosed—including income, deductions, foreign financial accounts (FBAR), 
          and dependent status—is true, correct, and substantiated by necessary receipts or documentation.
        </p>

        <h3>3. Confidentiality & Data Protection</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          In accordance with IRC Section 7216, IRA Tax Solutions will not disclose, share, or monetize any taxpayer identity 
          or tax return information with third parties without express written authorization, except as required by federal or state law.
        </p>

        <h3>4. Audit Assistance</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '24px' }}>
          Should the IRS or state taxing authority inquire about any position taken on your return, our team provides year-round 
          consultation to explain how calculations were made and provide supporting documentation.
        </p>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I have read, understood, and accept the Terms of the Tax Preparation Service Agreement.
          </label>
        </div>
      </div>
    </div>
  );
}
