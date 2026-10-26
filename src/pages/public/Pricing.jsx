import { Link } from 'react-router-dom';
import { Check, Shield, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: 'Individual Standard',
      price: '$49',
      period: 'per filing',
      desc: 'Ideal for W-2 wage earners, students, and simple tax situations.',
      features: [
        'Federal Form 1040 Preparation',
        'Single State Tax Return Included',
        'W-2 Income & Standard Deductions',
        'Direct Deposit Setup',
        'Electronic Filing (E-File)',
        'Basic Email & Phone Support'
      ],
      popular: false,
      cta: 'Get Started'
    },
    {
      name: 'Comprehensive / Visa Filers',
      price: '$99',
      period: 'per filing',
      desc: 'Specialized for H-1B, L-1, F-1 visa holders, ITIN applicants, and dual status.',
      features: [
        'Form 1040 / 1040-NR Dual Status',
        'All State Returns Supported',
        'FBAR (FinCEN 114) & FATCA Review',
        'Free ITIN Application Assistance',
        'Stock Options / ESPP / RSUs',
        'Dedicated Senior Tax Preparer'
      ],
      popular: true,
      cta: 'Start Filing'
    },
    {
      name: 'Business & Self-Employed',
      price: '$189',
      period: 'per filing',
      desc: 'For freelancers, independent contractors (1099), LLCs, and small corporations.',
      features: [
        'Schedule C (Business Profit/Loss)',
        'Form 1065 / 1120 / 1120-S',
        'Depreciation & Expense Optimizations',
        'Multi-State Tax Apportionment',
        'Year-Round Audit Representation',
        'Unlimited Tax Strategy Advice'
      ],
      popular: false,
      cta: 'Consult an Expert'
    }
  ];

  return (
    <div className="pricing-page">
      <div className="container">
        <header className="pricing-header">
          <span className="badge">Transparent & Affordable</span>
          <h1>Straightforward Tax Filing Plans</h1>
          <p>
            No hidden fees. Every package includes expert review, error-checking, and comprehensive support.
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
                  <span className="currency">$</span>
                  <span className="amount">{tier.price.replace('$', '')}</span>
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
          <div className="note-card">
            <Shield className="note-icon" size={24} />
            <div>
              <h4>100% Fee Refund Guarantee</h4>
              <p>
                If you are not fully satisfied with our tax review and estimate prior to filing approval,
                our preparer fee is 100% refundable as per our fee refund policy.
              </p>
            </div>
          </div>
          <div className="note-card">
            <HelpCircle className="note-icon" size={24} />
            <div>
              <h4>Custom or Complex Situations?</h4>
              <p>
                Have multiple rental properties, crypto trading, or foreign entity filings? 
                <Link to="/contact"> Contact our team </Link> for a free personalized estimate.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
