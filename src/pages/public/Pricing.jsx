import { Link } from 'react-router-dom';
import { Check, Shield, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Salaried Basic (ITR-1 Sahaj)',
      price: '₹499',
      period: 'per filing',
      desc: 'Ideal for salaried employees, pensioners, and single-employer income earners.',
      features: [
        'Single Form 16 & Salary Income Filing',
        'Standard Deduction (₹75,000 New Regime)',
        'One House Property & Other Sources (Interest)',
        'Form 26AS & AIS / TIS Data Reconciliation',
        'Instant E-Filing & Official ITR-V Generation',
        'Email & Phone Assistance by Tax Experts'
      ],
      popular: false,
      cta: 'File ITR-1 Now'
    },
    {
      name: 'Capital Gains & Tech Filers (ITR-2)',
      price: '₹1,499',
      period: 'per filing',
      desc: 'Specialized for techies with RSUs/ESOPs, stock market investors, crypto, and multi-state earners.',
      features: [
        'Multiple Form 16s from Job Switches',
        'Mutual Funds & Equity P&L (Zerodha, Groww, CAMS)',
        'Foreign Assets & US Stocks Schedule (FA) for RSUs',
        'Crypto / VDA Taxation & Loss Carry-Forward',
        'Multiple House Properties & Home Loan Interest',
        'Dedicated Chartered Accountant (CA) Review'
      ],
      popular: true,
      cta: 'File ITR-2 with CA'
    },
    {
      name: 'Freelancers & Business (ITR-4 / 3)',
      price: '₹2,999',
      period: 'per filing',
      desc: 'For software consultants, doctors, lawyers, creative freelancers, and F&O traders.',
      features: [
        'Presumptive Taxation u/s 44ADA (50% Profit Declared)',
        'Small Business & Trading u/s 44AD / 44AE',
        'F&O / Intraday Trading Turnover & P&L Statements',
        'Advance Tax Calculation & Challan 280 Support',
        'Notice Assistance for Sec 143(1) & 139(9) Defective Returns',
        'Year-Round Direct Consultation with Senior CA'
      ],
      popular: false,
      cta: 'Consult a CA'
    }
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <header className="pricing-header">
          <span className="badge">Transparent &amp; Regulated Indian Pricing</span>
          <h1>Affordable ITR Filing Packages for India</h1>
          <p>
            Zero hidden fees. Complete reconciliation with Income Tax Department AIS, TIS, and Form 26AS data.
          </p>
        </header>

        <div className="pricing-grid">
          {tiers.map((tier, idx) => (
            <div key={idx} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <span className="popular-badge">Most Popular</span>}
              <div className="card-top">
                <h3>{tier.name}</h3>
                <p className="card-desc">{tier.desc}</p>
                <div className="price-tag">
                  <span className="currency">₹</span>
                  <span className="amount">{tier.price.replace('₹', '')}</span>
                  <span className="period">/{tier.period}</span>
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
                <Link to="/register" className={`btn ${tier.popular ? 'btn-primary' : 'btn-outline'}`}>
                  {tier.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="pricing-notes">
          <div className="notes-box">
            <Shield className="notes-icon" size={24} />
            <div>
              <h4>Government Authorized &amp; 100% Secure</h4>
              <p>
                All tax returns are validated according to the Income Tax Act, 1961, and e-filed directly with the Income Tax Department of India (CBDT). Prices are in INR (₹). Secure payments supported via UPI, RuPay, Netbanking, and Cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
