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
          <h2>Tax Summary & Fee Computation</h2>
          <p>Review the Federal and State calculations prepared by your dedicated CPA.</p>
        </div>
      </div>

      {!summaryData ? (
        /* Clean empty state when no figures have been uploaded or computed yet */
        <div className="summary-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Clock size={48} style={{ color: 'var(--color-primary)', margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', marginBottom: '8px' }}>
            Awaiting Document Review & Tax Computation
          </h3>
          <p style={{ color: 'var(--color-text-light)', fontSize: '14px', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.6' }}>
            No tax calculation figures have been entered for this account yet. 
            Once you have uploaded your required tax slips (Form W-2, 1099, etc.) and completed your personal information, 
            your assigned tax professional will calculate your return and publish the verified computation breakdown here.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '10px 18px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)', fontSize: '13px', color: 'var(--color-charcoal)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffc107', display: 'inline-block' }} />
            Status: <strong>Documents Pending / In Queue</strong>
          </div>
        </div>
      ) : (
        <>
          {/* Render real data from database when available */}
          <div className="refund-highlight-box">
            <div className="highlight-column">
              <span className="label">Estimated Federal Refund</span>
              <span className="value refund-positive">{summaryData.estimated_refund || '$0.00'}</span>
            </div>
            <div className="highlight-column">
              <span className="label">Tax Filing Status</span>
              <span className="value">{summaryData.status || 'Computed'}</span>
            </div>
            <div className="highlight-column fee-column">
              <span className="label">Preparer Fee</span>
              <span className="value">{summaryData.preparer_fee || '—'}</span>
              {summaryData.fee_paid ? (
                <span className="paid-tag">
                  <CheckCircle2 size={14} /> Paid
                </span>
              ) : (
                <button onClick={handlePayFee} className="btn btn-primary btn-sm" disabled={payingFee}>
                  <CreditCard size={14} /> Pay Fee
                </button>
              )}
            </div>
          </div>

          <div className="summary-card">
            <h3>Federal Form 1040 Breakdown ({summaryData.tax_year})</h3>
            <table className="summary-table">
              <tbody>
                <tr>
                  <td>Filing Status</td>
                  <td><strong>{summaryData.filing_status || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Total Gross Income</td>
                  <td>{summaryData.total_income || '—'}</td>
                </tr>
                <tr>
                  <td>Adjustments to Income</td>
                  <td>{summaryData.adjustments || '—'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Adjusted Gross Income (AGI)</td>
                  <td><strong>{summaryData.agi || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Deductions</td>
                  <td>{summaryData.deductions || '—'}</td>
                </tr>
                <tr className="subtotal-row">
                  <td>Taxable Income</td>
                  <td><strong>{summaryData.taxable_income || '—'}</strong></td>
                </tr>
                <tr>
                  <td>Federal Tax Obligation</td>
                  <td>{summaryData.federal_tax || '—'}</td>
                </tr>
                <tr>
                  <td>Federal Tax Withheld</td>
                  <td>{summaryData.withheld || '—'}</td>
                </tr>
                <tr className="total-highlight-row">
                  <td>Net Estimated Federal Refund</td>
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
          <strong>Notice:</strong> Tax figures are published only after documents are reviewed and calculated by 
          your assigned tax professional.
        </p>
      </div>
    </div>
  );
}
