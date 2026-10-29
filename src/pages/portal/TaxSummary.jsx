import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { FileText, Clock, AlertCircle, CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';
import './TaxSummary.css';

export default function TaxSummary() {
  const { token } = useAuth();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [payingFee, setPayingFee] = useState(false);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const json = await api.summary.get(token);
        if (json && json.data) {
          setSummaryData(json.data);
        }
      } catch (e) {
        console.error('Error fetching tax summary:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  const handlePayFee = async () => {
    setPayingFee(true);
    try {
      await api.summary.payFee(token);
      setSummaryData(prev => prev ? { ...prev, fee_paid: 1 } : null);
      alert('Payment confirmed and recorded.');
    } catch {
      alert('Error recording payment.');
    } finally {
      setPayingFee(false);
    }
  };

  if (loading) {
    return <div className="summary-page-container" style={{ padding: '40px', textAlign: 'center' }}>Loading tax records...</div>;
  }

  return (
    <div className="summary-page-container">
      <div className="summary-header">
        <div>
          <h2>Form 1040 Federal &amp; State Tax Computation</h2>
          <p>Review the comprehensive return computation prepared by your dedicated tax preparer and verified by our QA reviewer.</p>
        </div>
      </div>

      {!summaryData ? (
        /* Empty state when return is in progress */
        <div className="summary-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Clock size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Awaiting Document Verification &amp; Return Preparation
          </h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '14px', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            No tax calculation figures have been entered for this account yet. 
            Once you upload your Form W-2s, 1099s, and complete your taxpayer information, 
            your dedicated tax preparer will calculate your deductions, credits, and state apportionments and publish the verified computation summary here.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-charcoal)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffc107', display: 'inline-block' }} />
            Status: <strong>Tax Documents Received / Under Preparer &amp; QA Review</strong>
          </div>
        </div>
      ) : (
        <>
          {/* Highlight banner with estimated refund */}
          <div className="refund-highlight-box">
            <div className="highlight-column">
              <span className="label">Estimated Net Federal Refund / (Owed)</span>
              <span className="value refund-positive">{summaryData.estimated_refund || '$0.00'}</span>
            </div>
            <div className="highlight-column">
              <span className="label">Filing Status</span>
              <span className="value">{summaryData.filing_status || 'Single / Form 1040'}</span>
            </div>
            <div className="highlight-column fee-column">
              <span className="label">Tax Preparation Fee</span>
              <span className="value">{summaryData.preparer_fee || 'Fixed Agreed Fee'}</span>
              {summaryData.fee_paid ? (
                <span className="paid-tag">
                  <CheckCircle2 size={14} /> Paid (Credit Card / ACH)
                </span>
              ) : (
                <button onClick={handlePayFee} className="btn btn-primary btn-sm" disabled={payingFee}>
                  <CreditCard size={14} /> Pay Fee Securely
                </button>
              )}
            </div>
          </div>

          <div className="summary-card">
            <h3>US Federal Tax Computation Breakdown ({summaryData.tax_year || 'Tax Year 2024'})</h3>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>US Return Type</td>
                  <td><strong>Form 1040 (U.S. Individual Income Tax Return)</strong></td>
                </tr>
                <tr>
                  <td>Total Wages, Salaries &amp; 1099 Earnings (Line 1z)</td>
                  <td>{summaryData.total_income || '—'}</td>
                </tr>
                <tr>
                  <td>Adjustments to Income (IRA, Student Loan, HSA)</td>
                  <td>{summaryData.adjustments || '—'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Adjusted Gross Income (AGI - Line 11)</td>
                  <td><strong>{summaryData.agi || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Standard Deduction / Itemized Deductions (Schedule A)</td>
                  <td>{summaryData.deductions || 'Standard Deduction ($14,600 Single / $29,200 MFJ)'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Taxable Income (Line 15)</td>
                  <td><strong>{summaryData.taxable_income || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Total Federal Tax Liability (After Credits)</td>
                  <td>{summaryData.federal_tax || '—'}</td>
                </tr>
                <tr>
                  <td>Federal Income Tax Withheld (W-2 Box 2 &amp; 1099)</td>
                  <td>{summaryData.withheld || '—'}</td>
                </tr>
                <tr className="total-highlight-row">
                  <td>Net Federal Refund / (Amount You Owe)</td>
                  <td className="refund-positive"><strong>{summaryData.estimated_refund || '—'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="summary-disclaimer">
        <ShieldCheck size={18} className="text-warning" style={{ color: '#0284c7' }} />
        <p>
          <strong>IRS Section 7216 Notice:</strong> All tax returns are prepared in strict adherence with Treasury Department Circular 230 and IRS Section 7216 confidentiality rules. Your returns will only be electronically filed with the IRS and state taxing authorities after your written review and Form 8879 authorization.
        </p>
      </div>
    </div>
  );
}
