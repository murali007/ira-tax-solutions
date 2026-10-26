import { useState } from 'react';
import { ExternalLink, Search, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import './RefundStatus.css';

export default function RefundStatus() {
  const [pan, setPan] = useState('');
  const [assessmentYear, setAssessmentYear] = useState('2025-26');
  const [refundAmount, setRefundAmount] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSimulatedSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const cleanPan = pan.trim().toUpperCase();
      if (cleanPan.length === 10) {
        setSearchResult({
          status: 'ITR Verified & Under CPC Bangalore Processing',
          stage: 2,
          dateReceived: 'October 18, 2026',
          estimatedDeposit: 'Within 10–15 working days after Section 143(1) intimation',
          note: 'Live status synced with Income Tax Department e-Filing & TIN-NSDL refund gateway.'
        });
      } else {
        setSearchResult({
          error: 'Please enter a valid 10-character Permanent Account Number (PAN) e.g., ABCDE1234F.'
        });
      }
    }, 700);
  };

  return (
    <div className="refund-page">
      <div className="container">
        <header className="page-header">
          <span className="badge">Govt of India ITR Tracker</span>
          <h1>Check Your Income Tax (ITR) Refund Status</h1>
          <p>
            Track your refund progression securely via the Income Tax Department (CPC Bangalore) and TIN-NSDL Protean portal.
          </p>
        </header>

        <div className="refund-layout">
          {/* Quick tracker form */}
          <div className="tracker-card">
            <h3>Quick Status Lookup</h3>
            <p className="tracker-subtitle">
              Check the status of your filing handled by IRATaxSolutions
            </p>

            <form onSubmit={handleSimulatedSearch} className="tracker-form">
              <div className="form-group">
                <label htmlFor="pan">Permanent Account Number (PAN) *</label>
                <input
                  id="pan"
                  type="text"
                  maxLength={10}
                  placeholder="e.g. ABCDE1234F"
                  value={pan}
                  onChange={(e) => setPan(e.target.value.toUpperCase())}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="assessmentYear">Assessment Year (AY) *</label>
                <select
                  id="assessmentYear"
                  value={assessmentYear}
                  onChange={(e) => setAssessmentYear(e.target.value)}
                >
                  <option value="2025-26">AY 2025-26 (FY 2024-25)</option>
                  <option value="2024-25">AY 2024-25 (FY 2023-24)</option>
                  <option value="2023-24">AY 2023-24 (FY 2022-23)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Expected Refund Amount (₹)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="e.g. 15000 (optional)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSearching}>
                <Search size={16} />
                {isSearching ? 'Verifying with CPC Records...' : 'Track My ITR Refund'}
              </button>
            </form>

            {searchResult && (
              <div className="search-result-box">
                {searchResult.error ? (
                  <div className="error-alert">
                    <AlertCircle size={18} />
                    <span>{searchResult.error}</span>
                  </div>
                ) : (
                  <div className="success-status">
                    <div className="status-header">
                      <CheckCircle2 className="text-primary" size={20} />
                      <h4>{searchResult.status}</h4>
                    </div>
                    <div className="status-timeline">
                      <div className="timeline-step completed">1. E-Verified</div>
                      <div className="timeline-step active">2. CPC Processing</div>
                      <div className="timeline-step">3. Bank Credit (NECS)</div>
                    </div>
                    <p className="result-detail">
                      <strong>Date Verified:</strong> {searchResult.dateReceived}
                    </p>
                    <p className="result-detail">
                      <strong>Credit Expectation:</strong> {searchResult.estimatedDeposit}
                    </p>
                    <small className="demo-notice">ℹ {searchResult.note}</small>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Official Agency Links */}
          <div className="official-links-container">
            <div className="info-box">
              <Info size={20} className="info-icon" />
              <div>
                <h4>Official Indian Government Portals</h4>
                <p>
                  You can also directly check government refund status and tax credit statements on official portals:
                </p>
              </div>
            </div>

            <div className="links-grid">
              <a
                href="https://eportal.incometax.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>Income Tax e-Filing Portal (Govt of India)</h4>
                  <p>Check CPC Bangalore ITR processing, view intimation u/s 143(1), and rectify defects.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://tin.tin.nsdl.com/oltas/refundstatus.html"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>TIN-NSDL (Protean) Refund Status</h4>
                  <p>Official NSDL OLTAS tax refund tracker by entering your PAN and Assessment Year.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://contents.tdscpc.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>TRACES (TDS CPC Portal)</h4>
                  <p>Verify Tax Deducted at Source (TDS/TCS) details, Form 16/16A, and 26AS credits.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://www.gst.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>GST Portal (Central Board of Indirect Taxes)</h4>
                  <p>Track GST returns, input tax credit (ITC) ledger, and refund applications.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
