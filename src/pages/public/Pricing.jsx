import { Link } from 'react-router-dom';
import { Check, ShieldCheck, Info, ArrowRight } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Basic',
      badge: 'For Simple W-2 Returns',
      price: '$XX',
      period: 'starting from',
      desc: 'Ideal for single or married professionals with standard W-2 income and standard deductions.',
      features: [
        'W-2 wage and salary income reporting',
        'Standard deduction optimization ($14,600 / $29,200)',
        'Basic tax credits (EITC, Standard Child Credit)',
        'Direct IRS & Single State electronic e-filing',
        'Dedicated preparer & separate QA review',
        'Year-round support for IRS inquiries'
      ],
      popular: false,
      cta: 'Book Consultation & File'
    },
    {
      name: 'Standard',
      badge: 'For Most Individuals',
      price: '$XX',
      period: 'starting from',
      desc: 'Comprehensive filing for salaried employees with 1099 income, deductions, and common credits.',
      features: [
        'W-2 + Form 1099 income (Interest, Dividends, Misc)',
        'Itemized vs. standard deduction comparison',
        'Child Tax Credit, Dependent Care & Education Credits',
        'Single State Tax Return filing included',
        'Dedicated preparer & separate QA review',
        'Plain-English video/call draft walkthrough'
      ],
      popular: true,
      cta: 'Book Consultation & File'
    },
    {
      name: 'Complex',
      badge: 'For Investors & Self-Employed',
      price: 'Custom Quote',
      period: 'tailored to return',
      desc: 'Tailored for independent consultants, small business owners, active investors, and multi-state movers.',
      features: [
        'Schedule C / Schedule E (Sole prop / Rental properties)',
        'Stock sales, ESPP, RSUs & Crypto (Schedule D / 8949)',
        'Multi-state returns for relocations & remote work',
        'International accounts (FBAR FinCEN 114 & Form 8938)',
        'Quarterly estimated tax payment calculations',
        'Priority Senior Reviewer & CPA consultation'
      ],
      popular: false,
      cta: 'Get a Custom Quote'
    }
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <header className="pricing-header">
          <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, display: 'inline-block', marginBottom: '12px' }}>
            CLEAR PRICING. NO SURPRISES.
          </span>
          <h1>Simple &amp; Transparent US Tax Pricing</h1>
          <p>
            Know the fee before we start. The exact fee depends on the complexity of your return — we'll discuss the pricing transparently during your free consultation.
          </p>
        </header>

        <div className="pricing-grid">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <span className="popular-badge">Most Popular</span>}
              <div className="card-top">
                <h3>{tier.name}</h3>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', display: 'block', marginBottom: '8px' }}>
                  {tier.badge}
                </span>
                <p className="card-desc">{tier.desc}</p>
                <div className="price-tag">
                  <span className="amount">{tier.price}</span>
                  <span className="period" style={{ marginLeft: '6px' }}>/ {tier.period}</span>
                </div>
              </div>

              <ul className="features-list">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <Check className="check-icon" size={16} />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <div className="card-bottom">
                <Link to="/contact" className={`btn ${tier.popular ? 'btn-primary' : 'btn-outline'}`} style={{ width: '100%', textAlign: 'center' }}>
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing notice callout matching Brand Card 6 */}
        <div style={{ marginTop: '40px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Info size={24} style={{ color: '#0284c7', flexShrink: 0 }} />
          <div>
            <strong style={{ color: '#1e293b', fontSize: '15px' }}>Transparent Fee Guarantee:</strong>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0', lineHeight: '1.5' }}>
              The exact fee depends on the complexity of your return (e.g. number of W-2s, states, stock trades, or rental units). We will review your documents and provide a confirmed, fixed price during your free 15-minute consultation before any filing work begins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
