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
          <h2>Client Service Agreement (India Tax Laws)</h2>
          <p>Terms of professional engagement between the taxpayer and IRATaxSolutions.</p>
        </div>
        <Link to="/portal" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="summary-disclaimer" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
        <AlertTriangle size={20} className="text-warning" />
        <div>
          <strong>Indian Statutory &amp; Regulatory Framework:</strong>
          <p>
            This agreement outlines professional engagement terms and code of ethics compliant with the 
            Income Tax Act, 1961, Information Technology Act, 2000, and guidelines prescribed by the 
            Central Board of Direct Taxes (CBDT) and the Institute of Chartered Accountants of India (ICAI).
          </p>
        </div>
      </div>

      <div className="summary-card">
        <h3>1. Scope of Professional Engagement</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          IRATaxSolutions (operating through authorized Chartered Accountants and E-Return Intermediaries) agrees 
          to prepare, compute, and e-file the taxpayer's Indian Income Tax Return (ITR-1, ITR-2, ITR-3, or ITR-4) 
          and reconcile discrepancies with Annual Information Statements (AIS) and Form 26AS.
        </p>

        <h3>2. Client Responsibilities &amp; Declarations</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          The client confirms that all income streams—including salary from all employers, rental income, capital gains from mutual funds/equities, 
          crypto/VDAs, foreign assets, and Chapter VI-A investment proofs—are complete, authentic, and accurate.
        </p>

        <h3>3. Confidentiality &amp; Data Security</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          Pursuant to the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011, 
          and Section 138 of the Income Tax Act, 1961, your PAN details, Aadhaar data, and income records are 256-bit encrypted and never sold, 
          monetized, or shared with third parties.
        </p>

        <h3>4. Notice Handling &amp; Rectification Assistance</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          Should the Income Tax Department issue an intimation under Section 143(1), a defective return notice under Section 139(9), 
          or an AIS confirmation query, our qualified team will assist you in preparing a formal response and filing a rectification request.
        </p>

        <h3>5. Governing Law &amp; Jurisdiction</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '24px' }}>
          This agreement is governed by the laws of the Republic of India. Any disputes arising shall be subject 
          to the exclusive jurisdiction of the competent courts in Hyderabad, Telangana, India.
        </p>

        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: 'var(--color-navy)' }}>
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            I have read, understood, and accept the Terms of the Indian Tax Filing Service Agreement.
          </label>
        </div>
      </div>
    </div>
  );
}
