import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import './TaxSummary.css';

export default function RefundPolicy() {
  return (
    <div className="summary-page-container">
      <div className="summary-header">
        <div>
          <h2>100% Tax Preparation Fee Refund Policy</h2>
          <p>Transparency and client satisfaction are the foundation of IRA Tax Solutions.</p>
        </div>
        <Link to="/portal" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="summary-disclaimer" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
        <AlertTriangle size={20} className="text-warning" />
        <div>
          <strong>Legal Disclaimer Notice:</strong>
          <p>
            The policy terms below represent the operational standard for IRA Tax Solutions. Formal binding legal 
            language is subject to owner confirmation and licensed regulatory review in your jurisdiction.
          </p>
        </div>
      </div>

      <div className="summary-card">
        <h3>1. Scope of 100% Fee Refund Guarantee</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          We stand firmly behind the precision and thoroughness of our tax advisory services. 
          If, prior to authorizing your tax return for electronic transmission (IRS Form 8879 execution), 
          you are dissatisfied with the calculations, deductions identified, or level of service provided, 
          you may request a full refund of any preparer service fee collected.
        </p>

        <h3>2. Conditions & Exceptions</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', paddingLeft: '20px', marginBottom: '16px' }}>
          <li>
            <strong>Pre-Filing Guarantee:</strong> Fee refunds are eligible anytime before the return is transmitted to 
            the IRS or State Departments of Revenue. Once a return is officially e-filed and accepted by tax authorities, 
            the preparation and filing services are deemed fully performed.
          </li>
          <li>
            <strong>Government Tax Liability / Penalties:</strong> Our guarantee applies strictly to our professional 
            preparation fee. Taxes owed to government authorities, statutory penalties, or interest assessed by the IRS 
            due to inaccurate taxpayer disclosures are not covered.
          </li>
          <li>
            <strong>Material Accuracy:</strong> The refund policy requires that the taxpayer provides authentic, accurate, 
            and complete financial documents during the filing process.
          </li>
        </ul>

        <h3>3. Refund Processing Timelines</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)' }}>
          Approved refund requests are credited back to the original method of payment within 5 to 7 business days. 
          To initiate a request, contact our support team at <strong>support@irataxsolutions.com</strong> or call 
          our direct line at <strong>+1 (470) 444-8100 Ext: 102</strong>.
        </p>
      </div>
    </div>
  );
}
