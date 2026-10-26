import { Link } from 'react-router-dom';
import { PhoneCall, ThumbsUp, TrendingUp } from 'lucide-react';
import './Home.css';

const features = [
  {
    num: '01',
    icon: <PhoneCall size={26} />,
    title: '24/7 Support',
    desc: 'Committed to providing the highest level of service and support. Teams of skilled tax experts available round the clock during tax season.',
  },
  {
    num: '02',
    icon: <ThumbsUp size={26} />,
    title: '100% Customer Satisfaction',
    desc: 'Customer satisfaction remains our top priority and we are committed to maintain it. Our mission is simple: 100% Customer Satisfaction.',
  },
  {
    num: '03',
    icon: <TrendingUp size={26} />,
    title: 'Unlimited Tax Advice',
    desc: 'Optimize your tax strategies year-round, not just during tax season, get expert tax planning advices year-round at no additional cost.',
  },
];

export default function Home() {
  return (
    <div className="clip-home-root">
      {/* Hero Section matching Clip 1 */}
      <section className="clip-hero-section">
        <div className="clip-hero-inner">
          <div className="clip-hero-text-col">
            <span className="clip-eyebrow">INCOME TAX (ITR), TDS</span>
            <h1 className="clip-heading">&amp; GST Filing in India</h1>
            <p className="clip-subtext">
              Maximum Tax Savings &amp; Guaranteed Accuracy With Expert Chartered Accountant (CA) Assistance At The Most Affordable Fees
            </p>
            <div className="clip-hero-buttons">
              <Link to="/contact" className="clip-btn-green">
                GET IN TOUCH
              </Link>
              <Link to="/services" className="clip-btn-outline">
                LEARN MORE
              </Link>
            </div>
          </div>

          {/* Authentic Tax Document Collage matching Image 2 */}
          <div className="clip-hero-graphic-col" aria-hidden="true">
            <div className="tax-collage-canvas">
              {/* Layer 1: Financial Computation Ledger (top background) */}
              <div className="collage-ledger-card">
                <div className="ledger-header-row">
                  <span className="col-desc">Gross Salary / Professional Receipts</span>
                  <span className="col-val">₹ 14,50,000.00</span>
                  <span className="col-pct">76,255</span>
                </div>
                <div className="ledger-header-row">
                  <span className="col-desc">Standard Deduction u/s 16(ia)</span>
                  <span className="col-val">-₹ 75,000.00</span>
                  <span className="col-pct">21%</span>
                </div>
                <div className="ledger-header-row highlight">
                  <span className="col-desc">Net Taxable Income (AY 2025-26)</span>
                  <span className="col-val">₹ 13,75,000.00</span>
                  <span className="col-pct">407,840.50</span>
                </div>
                <div className="ledger-header-row">
                  <span className="col-desc">Advance Tax / TDS Paid (Form 26AS)</span>
                  <span className="col-val">₹ 1,82,450.00</span>
                  <span className="col-pct">TDS Rec</span>
                </div>
                <div className="ledger-header-row refund">
                  <span className="col-desc">Net ITR Refund Receivable</span>
                  <span className="col-val refund-text">₹ 42,850.00</span>
                  <span className="col-pct refund-badge">REFUND</span>
                </div>
              </div>

              {/* Layer 2: Form 1065 equivalent: ITR-4 SUGAM (top-right background) */}
              <div className="collage-itr4-card">
                <div className="form-head-strip">
                  <div className="form-num-col">
                    <span className="form-number-lg">ITR-4</span>
                    <span className="dept-name">Income Tax Department<br />Government of India</span>
                  </div>
                  <div className="form-meta-col">
                    <span className="year-title">Assessment Year 2025-26</span>
                    <span className="portal-link">► eportal.incometax.gov.in</span>
                  </div>
                </div>
                <div className="form-sub-strip">
                  <strong>SUGAM</strong> — Presumptive Business &amp; Freelance Income (Sec 44AD / 44ADA)
                </div>
              </div>

              {/* Layer 3: Form 1120 equivalent: Form 16 / ITR-2 (center-left background) */}
              <div className="collage-form16-card">
                <div className="form-head-strip">
                  <div className="form-num-col">
                    <span className="form-number-xl">Form 16</span>
                    <span className="dept-name">Certificate under section 203 of the Income-tax Act, 1961</span>
                  </div>
                </div>
                <div className="form-checklist-box">
                  <div className="checklist-heading">A. Details of Tax Deducted at Source (TDS) on Salary</div>
                  <div className="check-row">
                    <span className="box-checked">☑</span> 1a. Consolidated TDS Certificate (attach Part A &amp; B)
                  </div>
                  <div className="check-row">
                    <span className="box-checked">☑</span> 1b. Permanent Account Number (PAN): <strong>ABCDE1234F</strong>
                  </div>
                  <div className="check-row">
                    <span className="box-checked">☑</span> 2. Assessment Year: <strong>2025-26 (FY 2024-25)</strong>
                  </div>
                  <div className="check-row">
                    <span className="box-checked">☑</span> 3. Employer TAN: <strong>HYDR01234A</strong>
                  </div>
                </div>
              </div>

              {/* Layer 4: Giant Foreground Form 1040 equivalent: ITR-1 SAHAJ */}
              <div className="collage-itr1-card">
                <div className="itr1-top-row">
                  <div className="itr1-brand">
                    <span className="itr1-number">ITR-1</span>
                    <div className="itr1-auth">
                      <span className="dept-small">Government of India — Income Tax Department</span>
                      <span className="dept-main">Central Board of Direct Taxes (CBDT)</span>
                    </div>
                  </div>
                  <div className="itr1-year-box">
                    <span className="ay-label">Assessment Year</span>
                    <span className="ay-value">2025-26</span>
                    <span className="efile-arrow">► www.incometax.gov.in</span>
                  </div>
                </div>

                <div className="itr1-banner-title">
                  <span className="title-highlight">Indian Individual Income Tax Return</span>
                  <span className="sahaj-badge">SAHAJ</span>
                </div>

                <div className="itr1-section-divider">
                  <span className="sec-label">Filing Status</span>
                  <div className="status-checks">
                    <span><span className="box-checked">☑</span> Salaried Individual</span>
                    <span><span className="box-unchecked">☐</span> One House Property</span>
                    <span><span className="box-unchecked">☐</span> Other Sources</span>
                    <span><span className="box-unchecked">☐</span> Agri &le; ₹5k</span>
                  </div>
                </div>

                <div className="itr1-grid-table">
                  <div className="grid-cell">
                    <label>PAN (Permanent Account Number)</label>
                    <div className="cell-data-mono">ABCDE1234F</div>
                  </div>
                  <div className="grid-cell">
                    <label>Aadhaar Number (12 Digits)</label>
                    <div className="cell-data-mono">XXXX-XXXX-9012</div>
                  </div>
                  <div className="grid-cell wide">
                    <label>Taxpayer First Name and Middle Initial</label>
                    <div className="cell-data">Murali K.</div>
                  </div>
                  <div className="grid-cell">
                    <label>Last Name / Surname</label>
                    <div className="cell-data">Yerram</div>
                  </div>
                  <div className="grid-cell">
                    <label>Tax Regime u/s 115BAC</label>
                    <div className="cell-data bold">New Regime (Default)</div>
                  </div>
                  <div className="grid-cell">
                    <label>Mobile Linked with Aadhaar</label>
                    <div className="cell-data">+91 98765 43210 (Dummy)</div>
                  </div>
                </div>

                <div className="itr1-fine-lines">
                  <div className="fine-line-row">
                    <span className="f-num">1</span>
                    <span className="f-desc">Gross Salary under Section 17(1) of IT Act, 1961</span>
                    <span className="f-val">₹ 14,50,000</span>
                  </div>
                  <div className="fine-line-row">
                    <span className="f-num">2</span>
                    <span className="f-desc">Less: Standard Deduction under Section 16(ia)</span>
                    <span className="f-val">-₹ 75,000</span>
                  </div>
                  <div className="fine-line-row total">
                    <span className="f-num">3</span>
                    <span className="f-desc">Net Total Taxable Income Chargeable to Tax</span>
                    <span className="f-val">₹ 13,75,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Numbered Feature Columns matching Clip 1 */}
      <section className="clip-features-section">
        <div className="clip-features-inner">
          {features.map((f) => (
            <div className="clip-feature-item" key={f.num}>
              <div className="clip-feature-badge-col">
                <span className="clip-num-bubble">{f.num}</span>
                <div className="clip-icon-box">
                  {f.icon}
                </div>
              </div>
              <div className="clip-feature-desc-col">
                <h3 className="clip-feature-title">{f.title}</h3>
                <p className="clip-feature-p">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
