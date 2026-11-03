import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  Download, 
  Printer, 
  AlertTriangle, 
  Building2, 
  ArrowRight,
  ExternalLink,
  X,
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import './PaymentFee.css';

export default function PaymentFee() {
  const { user, token } = useAuth();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showWiseModal, setShowWiseModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('ach');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [declineError, setDeclineError] = useState('');
  const [receiptTxnId, setReceiptTxnId] = useState('');

  const fetchInvoice = async () => {
    setLoading(true);
    try {
      const res = await api.payment.getInvoice(token);
      if (res && res.data) {
        setInvoice(res.data);
        if (res.data.fee_paid) {
          setPaymentSuccess(true);
          setReceiptTxnId(`WISE-TXN-${user?.id || '83004'}-PAID`);
        }
      }
    } catch (err) {
      console.warn('Error fetching payment invoice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchInvoice();
    }
  }, [token]);

  // Handle Simulating Wise $70 Payment
  const handleSimulateWisePayment = async () => {
    setProcessingPayment(true);
    setDeclineError('');

    try {
      const randomTxn = `WISE-TEST-${Math.floor(100000 + Math.random() * 900000)}`;
      const res = await api.payment.processWisePayment({
        amount: 70.00,
        currency: 'USD',
        method: selectedMethod,
        txnId: randomTxn
      }, token);

      if (res && res.success) {
        setReceiptTxnId(res.txnId || randomTxn);
        setPaymentSuccess(true);
        setShowWiseModal(false);
        fetchInvoice();
      }
    } catch (err) {
      console.error('Test payment failed:', err);
      alert(err.message || 'Payment simulation failed.');
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleSimulateDecline = () => {
    setDeclineError('Wise Test Simulation: The test card/account was declined by issuing bank (Insufficient funds / Test decline rule). Please select ACH or retry.');
  };

  const fileNo = user?.file_no || user?.fileNo || 'IRA-2025-83004';
  const clientName = user?.name || 'Taxpayer';
  const clientEmail = user?.email || 'client@example.com';
  const clientPhone = user?.phone || 'On file';

  const isPaid = paymentSuccess || invoice?.fee_paid;

  if (loading) {
    return (
      <div className="payment-loading-screen">
        <Clock size={28} className="spin-icon" style={{ color: '#0284c7', margin: '0 auto 12px' }} />
        <span>Loading Form 1040 Tax Preparation Invoice...</span>
      </div>
    );
  }

  return (
    <div className="payment-page-container">
      {/* Header */}
      <div className="payment-page-header">
        <div>
          <h2>Tax Preparation Fee &amp; E-Filing Authorization</h2>
          <p>Secure preparation and filing fee payment powered by Wise (USD Domestic ACH &amp; Cards).</p>
        </div>
      </div>

      {/* Main Invoice Card */}
      <div className="payment-invoice-card">
        {/* Invoice Top Ribbon */}
        <div className="invoice-top-bar">
          <div className="invoice-brand">
            <span className="brand-logo-pill">IRA</span>
            <div>
              <h3>IRA Tax Solutions LLC</h3>
              <span className="brand-sub">US Federal &amp; State Income Tax Preparation</span>
            </div>
          </div>

          <div className="invoice-meta-top">
            <span className="invoice-no-badge">Invoice #INV-2025-{fileNo.slice(-5)}</span>
            <span className={`invoice-status-tag ${isPaid ? 'status-paid' : 'status-unpaid'}`}>
              {isPaid ? <CheckCircle2 size={13} /> : <Clock size={13} />}
              {isPaid ? 'Paid & Cleared' : 'Payment Due ($70.00 USD)'}
            </span>
          </div>
        </div>

        {/* Bill To & Bill From Grid */}
        <div className="invoice-entities-grid">
          <div className="entity-col">
            <span className="col-label">Billed To (Taxpayer):</span>
            <strong className="entity-name">{clientName}</strong>
            <span className="entity-detail">File ID: {fileNo}</span>
            <span className="entity-detail">Email: {clientEmail}</span>
            <span className="entity-detail">Phone: {clientPhone}</span>
          </div>

          <div className="entity-col">
            <span className="col-label">Payable To (Preparer):</span>
            <strong className="entity-name">IRA Tax Solutions LLC</strong>
            <span className="entity-detail">IRS Authorized e-File Provider (ERO)</span>
            <span className="entity-detail">EIN: Registered US Tax Firm</span>
            <span className="entity-detail">Wise Multi-Currency USD Account</span>
          </div>

          <div className="entity-col date-col">
            <span className="col-label">Invoice Details:</span>
            <span className="entity-detail">Tax Year: <strong>2025 (Current Filing Season)</strong></span>
            <span className="entity-detail">Terms: <strong>Due Prior to IRS Transmission</strong></span>
            <span className="entity-detail">Currency: <strong>USD ($)</strong></span>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="invoice-table-wrap">
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>Service Description</th>
                <th>Jurisdiction</th>
                <th>Qty</th>
                <th style={{ textAlign: 'right' }}>Amount (USD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>US Federal Form 1040 Tax Preparation &amp; Deductions Check</strong>
                  <p>Comprehensive return drafting, W-2/1099 wage audit, standard/itemized deductions, and child/dependent tax credits calculation.</p>
                </td>
                <td><span className="tag-pill">US Federal / IRS</span></td>
                <td>1</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>$50.00</td>
              </tr>
              <tr>
                <td>
                  <strong>State Income Tax Return E-File &amp; Residency Allocation</strong>
                  <p>Individual state income tax return filing (e.g. CA Form 540, NY IT-201, TX/WA zero-allocation) with secure electronic transmission.</p>
                </td>
                <td><span className="tag-pill">State Tax Dept</span></td>
                <td>1</td>
                <td style={{ textAlign: 'right', fontWeight: 700 }}>$20.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Total Preparation &amp; E-File Fee:</td>
                <td style={{ textAlign: 'right', fontWeight: 800, fontSize: '18px', color: '#0f172a' }}>$70.00 USD</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Status or Wise Checkout Action */}
        {isPaid ? (
          <div className="payment-cleared-banner">
            <div className="cleared-icon-wrap">
              <CheckCircle2 size={32} />
            </div>
            <div className="cleared-content">
              <h4>Fee Successfully Cleared — $70.00 USD via Wise</h4>
              <p>
                Your tax preparation fee has been verified and recorded. Your return has passed all quality review gates and is now queued for direct electronic filing with the IRS and state tax department.
              </p>
              <div className="cleared-txn-details">
                <span>Transaction Ref: <strong>{receiptTxnId}</strong></span>
                <span>Payment Method: <strong>Wise US ACH Direct Debit</strong></span>
                <span>Status: <strong style={{ color: '#16a34a' }}>Cleared &amp; Authorized</strong></span>
              </div>
            </div>

            <div className="cleared-actions">
              <button 
                type="button" 
                onClick={() => window.print()} 
                className="btn-print-receipt"
              >
                <Printer size={15} />
                <span>Print Official Receipt</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-action-box">
            <div className="action-box-left">
              <div className="wise-badge-row">
                <span className="wise-pill">WISE PAY</span>
                <span className="sandbox-indicator">SANDBOX TEST ENVIRONMENT ACTIVE</span>
              </div>
              <h4>Complete $70.00 Fee Payment to Transmit Return</h4>
              <p>
                Pay securely using your US Bank Account (ACH Direct Debit) or Debit/Credit Card via Wise. 
                Zero international wire fees.
              </p>
            </div>

            <div className="action-box-right">
              <button 
                type="button" 
                onClick={() => setShowWiseModal(true)} 
                className="btn-pay-wise"
              >
                <CreditCard size={17} />
                <span>Pay $70.00 with Wise (Test Mode)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="payment-security-footer">
        <div className="security-point">
          <ShieldCheck size={18} style={{ color: '#16a34a' }} />
          <span>IRS Section 7216 Guaranteed Confidentiality</span>
        </div>
        <div className="security-point">
          <Building2 size={18} style={{ color: '#0284c7' }} />
          <span>US Domestic ACH &amp; Real-Time Wise Verification</span>
        </div>
        <div className="security-point">
          <FileText size={18} style={{ color: '#64748b' }} />
          <span>Official Printable Tax Receipt Included</span>
        </div>
      </div>

      {/* ========================================================
          WISE CHECKOUT TEST ENVIRONMENT MODAL
          ======================================================== */}
      {showWiseModal && (
        <div className="wise-modal-backdrop" onClick={() => setShowWiseModal(false)}>
          <div className="wise-modal-card" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="wise-modal-head">
              <div className="wise-brand-wrap">
                <span className="wise-logo-text">Wise</span>
                <span className="wise-sandbox-tag">TEST SIMULATOR</span>
              </div>
              <button 
                type="button" 
                className="wise-close-btn"
                onClick={() => setShowWiseModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="wise-modal-body">
              {declineError && (
                <div className="wise-decline-banner">
                  <AlertTriangle size={16} />
                  <span>{declineError}</span>
                </div>
              )}

              <div className="wise-summary-box">
                <div className="wise-summary-row">
                  <span>Pay to:</span>
                  <strong>IRA Tax Solutions LLC</strong>
                </div>
                <div className="wise-summary-row">
                  <span>Reference ID:</span>
                  <strong className="font-mono">{fileNo}</strong>
                </div>
                <div className="wise-summary-row highlight">
                  <span>Total Due:</span>
                  <strong className="amount-text">$70.00 USD</strong>
                </div>
              </div>

              <div className="wise-method-select">
                <label className="method-label">Choose Test Payment Method:</label>

                <div 
                  className={`method-option-card ${selectedMethod === 'ach' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('ach')}
                >
                  <input 
                    type="radio" 
                    name="wise_method" 
                    checked={selectedMethod === 'ach'} 
                    onChange={() => setSelectedMethod('ach')}
                  />
                  <div>
                    <strong>US Bank ACH Direct Debit (Test)</strong>
                    <span>Chase Checking ending in ...4821 (Instant clearance)</span>
                  </div>
                  <span className="fee-badge">Fee: $0.00</span>
                </div>

                <div 
                  className={`method-option-card ${selectedMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('card')}
                >
                  <input 
                    type="radio" 
                    name="wise_method" 
                    checked={selectedMethod === 'card'} 
                    onChange={() => setSelectedMethod('card')}
                  />
                  <div>
                    <strong>US Debit / Credit Card (Test)</strong>
                    <span>Visa ending in ...4242</span>
                  </div>
                  <span className="fee-badge">Fee: $0.00</span>
                </div>

                <div 
                  className={`method-option-card ${selectedMethod === 'balance' ? 'selected' : ''}`}
                  onClick={() => setSelectedMethod('balance')}
                >
                  <input 
                    type="radio" 
                    name="wise_method" 
                    checked={selectedMethod === 'balance'} 
                    onChange={() => setSelectedMethod('balance')}
                  />
                  <div>
                    <strong>Wise USD Balance (Test)</strong>
                    <span>$1,450.00 USD available</span>
                  </div>
                  <span className="fee-badge">Instant</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="wise-modal-actions">
                <button 
                  type="button" 
                  onClick={handleSimulateWisePayment} 
                  className="btn-wise-confirm"
                  disabled={processingPayment}
                >
                  {processingPayment ? (
                    <>
                      <RefreshCw size={16} className="spin-icon" />
                      <span>Processing Wise ACH Transfer...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Simulate Successful $70.00 Payment</span>
                    </>
                  )}
                </button>

                <button 
                  type="button" 
                  onClick={handleSimulateDecline} 
                  className="btn-wise-decline"
                  disabled={processingPayment}
                >
                  Simulate Bank Decline
                </button>
              </div>

              <div className="wise-modal-footnote">
                <HelpCircle size={13} />
                <span>Test Mode: No real funds will be charged. Updates Supabase database live and marks return as fee cleared.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
