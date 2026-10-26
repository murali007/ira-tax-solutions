import { Link } from 'react-router-dom';
import { ShieldCheck, AlertTriangle, ArrowLeft } from 'lucide-react';
import './TaxSummary.css';

export default function RefundPolicy() {
  return (
    <div className="summary-page-container">
      <div className="summary-header">
        <div>
          <h2>100% CA Professional Fee Refund Policy (India)</h2>
          <p>Transparency, trust, and client satisfaction are the foundation of IRATaxSolutions.</p>
        </div>
        <Link to="/portal" className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="summary-disclaimer" style={{ background: '#fef3c7', borderColor: '#fcd34d' }}>
        <AlertTriangle size={20} className="text-warning" />
        <div>
          <strong>Indian Statutory &amp; Regulatory Notice:</strong>
          <p>
            This policy is compliant with the Consumer Protection Act, 2019, Information Technology Act, 2000, 
            and guidelines issued by the Institute of Chartered Accountants of India (ICAI). All financial transactions are in Indian Rupees (₹).
          </p>
        </div>
      </div>

      <div className="summary-card">
        <h3>1. Scope of 100% Fee Refund Guarantee</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
          We stand firmly behind the precision and thoroughness of our tax advisory services. 
          If, prior to authorizing your Indian Income Tax Return (ITR) for electronic filing on the Income Tax Department portal (eportal.incometax.gov.in), 
          you are dissatisfied with the calculations, deductions identified, or level of CA service provided, 
          you may request a full refund of any professional preparation fee collected.
        </p>

        <h3>2. Conditions &amp; Exceptions</h3>
        <ul style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)', paddingLeft: '20px', marginBottom: '16px' }}>
          <li>
            <strong>Pre-Filing Guarantee:</strong> Fee refunds are eligible anytime before the return is electronically transmitted 
            to the Income Tax Department (CBDT). Once an ITR has been e-filed and an official ITR-V acknowledgement number is generated, 
            the filing service is deemed fully executed.
          </li>
          <li>
            <strong>Statutory Taxes &amp; Interest (Sec 234A/B/C):</strong> Our guarantee applies strictly to our professional CA 
            consulting fee. Taxes owed to the Government of India (Challan 280 / e-Pay Tax) or statutory late filing fees u/s 234F 
            resulting from incomplete taxpayer disclosures are not covered.
          </li>
          <li>
            <strong>Material Accuracy:</strong> The refund policy requires that the taxpayer provides authentic, accurate, 
            and complete Form 16, bank statements, and AIS records during the onboarding process.
          </li>
        </ul>

        <h3>3. Refund Processing Timelines</h3>
        <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--color-charcoal)' }}>
          Approved refund requests are credited back in INR to the original method of payment (UPI / Netbanking / RuPay / Cards) within 5 to 7 business days. 
          To initiate a request, contact our Indian support desk at <strong>support@irataxsolutions.com</strong> or call 
          our direct helpline at <strong>+91 91211 57586 / +91 72070 57471</strong>.
        </p>
      </div>
    </div>
  );
}
