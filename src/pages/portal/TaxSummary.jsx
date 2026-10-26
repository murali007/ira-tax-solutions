import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Clock, AlertCircle, CreditCard, CheckCircle2 } from 'lucide-react';
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
        const res = await fetch('/api/tax-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
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
      const res = await fetch('/api/tax-summary/pay-fee', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setSummaryData(prev => prev ? { ...prev, fee_paid: 1 } : null);
        alert('Payment confirmed and recorded in database.');
      }
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
          <h2>Income Tax Computation &amp; CA Filing Fees</h2>
          <p>Review the verified computation prepared by your assigned Chartered Accountant under the Income Tax Act, 1961.</p>
        </div>
      </div>

      {!summaryData ? (
        /* Clean empty state when no figures have been uploaded or computed yet */
        <div className="summary-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Clock size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Awaiting Document Verification &amp; Tax Computation
          </h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '14px', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            No tax calculation figures have been entered for this account yet. 
            Once you upload your Form 16, Annual Information Statement (AIS), and complete your PAN profile, 
            your assigned Chartered Accountant will calculate your deductions under the New and Old Tax Regimes and publish the verified computation sheet here.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-charcoal)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffc107', display: 'inline-block' }} />
            Status: <strong>Tax Documents Pending / Under CA Review</strong>
          </div>
        </div>
      ) : (
        <>
          {/* Render real data from database when available */}
          <div className="refund-highlight-box">
            <div className="highlight-column">
              <span className="label">Estimated ITR Refund / (Payable)</span>
              <span className="value refund-positive">{summaryData.estimated_refund || '₹0.00'}</span>
            </div>
            <div className="highlight-column">
              <span className="label">Applicable Tax Regime</span>
              <span className="value">{summaryData.status || 'New Regime u/s 115BAC'}</span>
            </div>
            <div className="highlight-column fee-column">
              <span className="label">CA Professional Fee</span>
              <span className="value">{summaryData.preparer_fee || '₹499 + GST'}</span>
              {summaryData.fee_paid ? (
                <span className="paid-tag">
                  <CheckCircle2 size={14} /> Paid (UPI)
                </span>
              ) : (
                <button onClick={handlePayFee} className="btn btn-primary btn-sm" disabled={payingFee}>
                  <CreditCard size={14} /> Pay Fee (UPI/Cards)
                </button>
              )}
            </div>
          </div>

          <div className="summary-card">
            <h3>Indian Income Tax Computation Breakdown ({summaryData.tax_year || 'AY 2025-26'})</h3>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>ITR Form Type</td>
                  <td><strong>{summaryData.filing_status || 'ITR-1 (Sahaj)'}</strong></td>
                </tr>
                <tr>
                  <td>Gross Total Income (Salary &amp; Other Sources)</td>
                  <td>{summaryData.total_income || '—'}</td>
                </tr>
                <tr>
                  <td>Standard Deduction u/s 16(ia)</td>
                  <td>{summaryData.adjustments || '—'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Gross Taxable Income</td>
                  <td><strong>{summaryData.agi || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Chapter VI-A Deductions (80C, 80D, 80CCD)</td>
                  <td>{summaryData.deductions || '—'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Net Taxable Income</td>
                  <td><strong>{summaryData.taxable_income || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Tax on Net Income &amp; Cess (4%)</td>
                  <td>{summaryData.federal_tax || '—'}</td>
                </tr>
                <tr>
                  <td>TDS / TCS / Advance Tax Credit (Form 26AS)</td>
                  <td>{summaryData.withheld || '—'}</td>
                </tr>
                <tr className="total-highlight-row">
                  <td>Net Income Tax Refund Due</td>
                  <td className="refund-positive"><strong>{summaryData.estimated_refund || '—'}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="summary-disclaimer">
        <AlertCircle size={18} className="text-warning" />
        <p>
          <strong>Notice:</strong> Tax computations are prepared in compliance with the Income Tax Act, 1961, and verified against your AIS and 26AS data prior to e-filing with the Income Tax Department (CBDT).
        </p>
      </div>
    </div>
  );
}
