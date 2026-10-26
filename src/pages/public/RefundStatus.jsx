import { useState } from 'react';
import { ExternalLink, Search, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import './RefundStatus.css';

export default function RefundStatus() {
  const [ssn, setSsn] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [refundAmount, setRefundAmount] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSimulatedSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      if (ssn.length >= 4) {
        setSearchResult({
          status: 'Return Received & Processing',
          stage: 2,
          dateReceived: 'October 14, 2026',
          estimatedDeposit: 'Within 21 days from IRS acceptance',
          note: 'This is a demo lookup simulating the IRS "Where\'s My Refund" protocol.'
        });
      } else {
        setSearchResult({
          error: 'Please provide at least the last 4 digits of your SSN/ITIN.'
        });
      }
    }, 700);
  };

  return (
    <div className="refund-page">
      <div className="container">
        <header className="page-header">
          <span className="badge">Track Your Status</span>
          <h1>Check Your Federal & State Refund Status</h1>
          <p>
            Track your refund progression securely. You can check both internal filing status and direct government authorities.
          </p>
        </header>

        <div className="refund-layout">
          {/* Quick tracker form */}
          <div className="tracker-card">
            <h3>Quick Status Lookup</h3>
            <p className="tracker-subtitle">
              Check the status of your filing handled by IRA Tax Solutions
            </p>

            <form onSubmit={handleSimulatedSearch} className="tracker-form">
              <div className="form-group">
                <label htmlFor="ssn">Last 4 Digits of SSN / ITIN *</label>
                <input
                  id="ssn"
                  type="password"
                  maxLength={4}
                  placeholder="e.g. 1234"
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value.replace(/\D/g, ''))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="filingStatus">Filing Status *</label>
                <select
                  id="filingStatus"
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="married_joint">Married Filing Jointly</option>
                  <option value="married_sep">Married Filing Separately</option>
                  <option value="hoh">Head of Household</option>
                  <option value="widow">Qualifying Surviving Spouse</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Expected Refund Amount ($)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="e.g. 1500 (optional)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSearching}>
                <Search size={16} />
                {isSearching ? 'Checking System...' : 'Track My Refund'}
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
                      <div className="timeline-step completed">1. Filed</div>
                      <div className="timeline-step active">2. Processing</div>
                      <div className="timeline-step">3. Refund Sent</div>
                    </div>
                    <p className="result-detail">
                      <strong>Date Received:</strong> {searchResult.dateReceived}
                    </p>
                    <p className="result-detail">
                      <strong>Estimated Deposit:</strong> {searchResult.estimatedDeposit}
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
                <h4>Official Government Trackers</h4>
                <p>
                  You can also directly check the official IRS and State revenue departments once your return is transmitted:
                </p>
              </div>
            </div>

            <div className="links-grid">
              <a
                href="https://www.irs.gov/refunds"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>IRS "Where's My Refund?"</h4>
                  <p>Official Internal Revenue Service federal refund tracking portal.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://www.ftb.ca.gov/online/refund/index.asp"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>California FTB Refund Status</h4>
                  <p>Franchise Tax Board state refund status check.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://www.tax.ny.gov/pit/file/refund.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>New York State Tax Department</h4>
                  <p>Check the status of your NY Personal Income Tax refund online.</p>
                </div>
                <ExternalLink size={18} className="link-icon" />
              </a>

              <a
                href="https://dor.georgia.gov/taxes/check-my-refund-status"
                target="_blank"
                rel="noopener noreferrer"
                className="agency-link-card"
              >
                <div>
                  <h4>Georgia Department of Revenue</h4>
                  <p>Check GA Department of Revenue income tax refund status.</p>
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
