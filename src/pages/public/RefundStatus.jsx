import { ExternalLink, ShieldCheck, MapPin } from 'lucide-react';
import './RefundStatus.css';

const STATE_REFUND_TOOLS = [
  { state: 'California (FTB)', url: 'https://www.ftb.ca.gov/online/refund/index.asp', desc: 'Franchise Tax Board Refund Tracker' },
  { state: 'New York (DTF)', url: 'https://www.tax.ny.gov/pit/file/refund.htm', desc: 'Department of Taxation and Finance' },
  { state: 'New Jersey', url: 'https://www.state.nj.us/treasury/taxation/refinfo.shtml', desc: 'Division of Taxation Check Refund' },
  { state: 'Illinois (IDOR)', url: 'https://mytax.illinois.gov/_/', desc: 'MyTax Illinois Refund Status' },
  { state: 'Georgia (DOR)', url: 'https://dor.georgia.gov/taxes/check-my-refund-status', desc: 'Department of Revenue Where\'s My Refund' },
  { state: 'Massachusetts', url: 'https://mtc.dor.state.ma.us/mtc/_/', desc: 'MassTaxConnect Refund Tracker' },
  { state: 'Pennsylvania (DOR)', url: 'https://www.doreservices.state.pa.us/WheresMyRefund/', desc: 'PA Department of Revenue' },
  { state: 'North Carolina', url: 'https://www.ncdor.gov/taxes-forms/individual-income-tax/wheres-my-refund', desc: 'NC Department of Revenue Tracker' },
  { state: 'Virginia (Tax)', url: 'https://www.tax.virginia.gov/wheres-my-refund', desc: 'Virginia Department of Taxation' },
  { state: 'Ohio (ODT)', url: 'https://tax.ohio.gov/individual/refund-status', desc: 'Ohio Department of Taxation' },
  { state: 'Michigan (Treasury)', url: 'https://www.michigan.gov/taxes/i-refund', desc: 'Michigan Department of Treasury' },
  { state: 'Texas / Florida / Washington', url: 'https://sa.www4.irs.gov/wmr/', desc: 'No State Income Tax (Federal Only)' }
];

export default function RefundStatus() {
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
        <div style={{ background: '#0f172a', borderRadius: '14px', padding: '32px', color: '#ffffff', marginBottom: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <ShieldCheck size={26} style={{ color: '#22c55e' }} />
              <h3 style={{ margin: 0, fontSize: '22px', color: '#ffffff', fontWeight: 700 }}>Official IRS "Where's My Refund?" Portal</h3>
            </div>
            <p style={{ margin: 0, color: '#94a3b8', fontSize: '14.5px', maxWidth: '680px', lineHeight: '1.6' }}>
              The IRS issues most refunds within 21 calendar days of e-file transmission. You can verify your exact refund issue date online through the official IRS system using your SSN/ITIN, filing status, and exact whole-dollar refund amount.
            </p>
          </div>
          <a
            href="https://sa.www4.irs.gov/wmr/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#22c55e', color: '#ffffff', fontWeight: 700, padding: '14px 26px', borderRadius: '8px', fontSize: '14px', boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)' }}
          >
            Open Official IRS Tool <ExternalLink size={16} />
          </a>
        </div>

        {/* State Refund Lookup Directory */}
        <div className="state-directory-card" style={{ background: '#ffffff', border: '1px solid rgba(15, 23, 42, 0.08)', borderRadius: '14px', padding: '32px', boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03), 0 8px 24px -6px rgba(15, 23, 42, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <MapPin size={22} style={{ color: '#0284c7' }} />
            <h3 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 700, margin: 0 }}>
              State Department of Revenue Refund Portals
            </h3>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px', lineHeight: '1.5' }}>
            If you filed a state tax return, state refunds are computed and issued independently by your state's Department of Revenue. Select your state below to track your state refund directly on official government servers:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {STATE_REFUND_TOOLS.map((st, i) => (
              <a
                key={i}
                href={st.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', textDecoration: 'none', color: '#1e293b', transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
                className="state-refund-link"
              >
                <div>
                  <strong style={{ fontSize: '14.5px', display: 'block', color: '#0369a1', marginBottom: '3px' }}>{st.state}</strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{st.desc}</span>
                </div>
                <ExternalLink size={16} style={{ color: '#94a3b8', flexShrink: 0, marginLeft: '8px' }} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
