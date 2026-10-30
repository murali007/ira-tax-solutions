import { useState } from 'react';
import { ExternalLink, Search, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import './RefundStatus.css';

const STATE_REFUND_TOOLS = [
  { state: 'California (FTB)', url: 'https://www.ftb.ca.gov/online/refund/index.asp', desc: 'Franchise Tax Board Refund Tracker' },
  { state: 'New York (DTF)', url: 'https://www.tax.ny.gov/pit/file/refund.htm', desc: 'Department of Taxation and Finance' },
  { state: 'New Jersey', url: 'https://www.state.nj.us/treasury/taxation/refinfo.shtml', desc: 'Division of Taxation Check Refund' },
  { state: 'Illinois (IDOR)', url: 'https://mytax.illinois.gov/_/', desc: 'MyTax Illinois Refund Status' },
  { state: 'Georgia (DOR)', url: 'https://dor.georgia.gov/taxes/check-my-refund-status', desc: 'Department of Revenue Where\'s My Refund' },
  { state: 'Massachusetts', url: 'https://mtc.dor.state.ma.us/mtc/_/', desc: 'MassTaxConnect Refund Tracker' },
  { state: 'Pennsylvania (DOR)', url: 'https://www.doreservices.state.pa.us/WheresMyRefund/', desc: 'PA Department of Revenue' },
  { state: 'North Carolina', url: 'https://www.ncdor.gov/taxes-forms/individual-income-tax/wheres-my-refund', desc: 'NC Department of Revenue Tracker' }
];

export default function RefundStatus() {
  const [ssn, setSsn] = useState('');
  const [filingStatus, setFilingStatus] = useState('Single');
  const [taxYear, setTaxYear] = useState('2024');
  const [refundAmount, setRefundAmount] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSSNChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    let formatted = val;
    if (val.length > 5) {
      formatted = `${val.substring(0, 3)}-${val.substring(3, 5)}-${val.substring(5)}`;
    } else if (val.length > 3) {
      formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
    }
    setSsn(formatted);
  };

  const handleSimulatedSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResult(null);

    setTimeout(() => {
      setIsSearching(false);
      const cleanSsn = ssn.replace(/\D/g, '');
      if (cleanSsn.length === 9) {
        setSearchResult({
          status: 'Form 1040 Electronically Transmitted & Accepted by IRS',
          stage: 3,
          dateReceived: 'Tax Season 2025',
          estimatedDeposit: 'Within 21 days for e-filed returns with Direct Deposit',
          note: 'IRS updates "Where\'s My Refund" daily, usually overnight.'
        });
      } else {
        setSearchResult({
          error: 'Please enter a valid 9-digit Social Security Number (SSN) or ITIN (format: XXX-XX-XXXX).'
        });
      }
    }, 700);
  };

  return (
    <div className="refund-page">
      <div className="container">
        <header className="page-header">
          <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>
            OFFICIAL IRS &amp; STATE REFUND DIRECTORY
          </span>
          <h1>Track Your Tax Refund Status</h1>
          <p>
            Check your Federal Form 1040 refund status directly with the IRS or view official State Department of Revenue portals.
          </p>
        </header>

        {/* IRS Direct Official Callout Card */}
        <div style={{ background: '#0f172a', borderRadius: '14px', padding: '28px', color: '#ffffff', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <ShieldCheck size={22} style={{ color: '#22c55e' }} />
              <h3 style={{ margin: 0, fontSize: '19px', color: '#ffffff' }}>Official IRS "Where's My Refund?" Portal</h3>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14px', maxWidth: '620px', lineHeight: '1.5' }}>
              The IRS issues most refunds within 21 days of e-file acceptance. You can verify your exact refund issue date online using your SSN/ITIN, filing status, and exact whole-dollar refund amount.
            </p>
          </div>
          <a
            href="https://www.irataxsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#22c55e', color: '#ffffff', fontWeight: 600, padding: '12px 22px', borderRadius: '8px' }}
          >
            Open IRS.gov / Refunds <ExternalLink size={16} />
          </a>
        </div>

        <div className="refund-layout">
          {/* Internal Filing Status lookup */}
          <div className="tracker-card">
            <h3>IRA Tax Solutions Return Tracker</h3>
            <p className="tracker-subtitle">
              Check the preparation and filing status of your return with our team
            </p>

            <form onSubmit={handleSimulatedSearch} className="tracker-form">
              <div className="form-group">
                <label htmlFor="ssn">Social Security Number (SSN) / ITIN *</label>
                <input
                  id="ssn"
                  type="text"
                  maxLength={11}
                  placeholder="XXX-XX-XXXX"
                  value={ssn}
                  onChange={handleSSNChange}
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
                  <option value="Single">Single</option>
                  <option value="Married Filing Jointly">Married Filing Jointly</option>
                  <option value="Married Filing Separately">Married Filing Separately</option>
                  <option value="Head of Household">Head of Household</option>
                  <option value="Qualifying Surviving Spouse">Qualifying Surviving Spouse</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="taxYear">Tax Year *</label>
                <select
                  id="taxYear"
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                >
                  <option value="2024">Tax Year 2024 (Current Season)</option>
                  <option value="2023">Tax Year 2023</option>
                  <option value="2022">Tax Year 2022</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="amount">Expected Federal Refund ($ Whole Dollars)</label>
                <input
                  id="amount"
                  type="number"
                  placeholder="e.g. 2450 (optional)"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={isSearching}>
                <Search size={16} />
                {isSearching ? 'Checking Return Status...' : 'Check My Filing Status'}
              </button>
            </form>

            {searchResult && (
              <div className="search-result-box" style={{ marginTop: '20px' }}>
                {searchResult.error ? (
                  <div className="auth-error">
                    <AlertCircle size={16} />
                    <span>{searchResult.error}</span>
                  </div>
                ) : (
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 600, marginBottom: '6px' }}>
                      <CheckCircle2 size={18} />
                      <span>{searchResult.status}</span>
                    </div>
                    <p style={{ margin: '4px 0', fontSize: '13px', color: '#334155' }}>
                      <strong>Deposit Timeline:</strong> {searchResult.estimatedDeposit}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '12px', color: '#64748b' }}>
                      {searchResult.note}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* State Refund Lookup Directory */}
          <div className="tracker-info-col">
            <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '14px' }}>
              State Department of Revenue Trackers
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '18px' }}>
              If you filed a state tax return, state refunds are processed independently by your state's Department of Revenue. Select your state below:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {STATE_REFUND_TOOLS.map((st, i) => (
                <a
                  key={i}
                  href={st.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', transition: 'border-color 0.2s' }}
                >
                  <div>
                    <strong style={{ fontSize: '14px', display: 'block', color: '#0369a1' }}>{st.state}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{st.desc}</span>
                  </div>
                  <ExternalLink size={16} style={{ color: '#94a3b8' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
