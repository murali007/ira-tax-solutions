import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, CheckCircle2, Clock, Calendar, ArrowRight, HelpCircle } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const { isAuthenticated } = useAuth();

  const servicesData = [
    {
      service: 'Federal Tax Return',
      fee: '$40',
      description: '$50 if both taxpayer and spouse have taxable income'
    },
    {
      service: 'State/Local Tax Return',
      fee: '$30',
      description: 'Each'
    },
    {
      service: 'ITIN Application',
      fee: '$50',
      description: 'Each'
    },
    {
      service: 'Schedule A (Itemized Deductions)',
      fee: '$70*',
      description: ''
    },
    {
      service: 'Education Credit (Form 8863)',
      fee: '$15',
      description: ''
    },
    {
      service: 'Moving Expenses',
      fee: '$15',
      description: ''
    },
    {
      service: 'Child And Dependent Care Credit (Form 2441)',
      fee: '$20',
      description: ''
    },
    {
      service: 'Foreign Tax Credit (Form 1116)',
      fee: '$15',
      description: ''
    },
    {
      service: 'FATCA',
      fee: '$30',
      description: 'Each'
    },
    {
      service: 'Schedule C/Schedule E',
      fee: 'Starts From $50',
      description: ''
    },
    {
      service: 'Stock Transactions (Schedule D)',
      fee: '$20',
      description: '$40 for ESPP'
    },
    {
      service: 'Partnership/S corp/C corp Tax Filing',
      fee: '$500',
      description: ''
    },
    {
      service: '2553 S Corp Election',
      fee: '$150',
      description: ''
    }
  ];

  return (
    <div className="pricing-page">
      <div className="pricing-container">
        {/* Header Section */}
        <header className="pricing-header">
          <span className="pricing-badge">
            CLEAR PRICING • NO HIDDEN CHARGES
          </span>
          <h1 className="pricing-main-title">
            US Individual &amp; Corporate Tax Filing Services
          </h1>
          <p className="pricing-subtitle">
            Transparent, itemized pricing for Federal, State, and Corporate tax filing. Know your exact fee before we begin with zero surprise add-ons.
          </p>
        </header>

        {/* Pricing Table Card */}
        <div className="pricing-table-card">
          <div className="table-header-bar">
            <h2>US Individual &amp; Corporate Tax Filing Services</h2>
          </div>
          
          <div className="pricing-table-responsive">
            <table className="pricing-data-table">
              <thead>
                <tr>
                  <th className="col-service">Service</th>
                  <th className="col-fee">Fee</th>
                  <th className="col-desc">Description</th>
                </tr>
              </thead>
              <tbody>
                {servicesData.map((row, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'row-alt' : ''}>
                    <td className="cell-service">
                      <strong>{row.service}</strong>
                    </td>
                    <td className="cell-fee">
                      <span className="fee-amount">{row.fee}</span>
                    </td>
                    <td className="cell-desc">
                      {row.description ? (
                        <span className="desc-text">{row.description}</span>
                      ) : (
                        <span className="desc-empty">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pricing-table-footer">
            <p className="footnote-text">
              * Schedule A fee applies when itemized deductions exceed the standard deduction.
            </p>
          </div>
        </div>

        {/* Trust & Guarantee Cards */}
        <div className="pricing-trust-grid">
          <div className="trust-card">
            <ShieldCheck size={26} className="trust-icon" />
            <div>
              <h4>No Surprise Charges</h4>
              <p>We review your tax documents during your initial consultation and confirm your final itemized fee upfront before filing.</p>
            </div>
          </div>

          <div className="trust-card">
            <CheckCircle2 size={26} className="trust-icon" />
            <div>
              <h4>Two-Tier Quality Review</h4>
              <p>Every return is prepared by a dedicated tax professional and independently checked by a second senior specialist.</p>
            </div>
          </div>

          <div className="trust-card">
            <Clock size={26} className="trust-icon" />
            <div>
              <h4>Fast Turnaround &amp; E-Filing</h4>
              <p>Once you approve your computations, your return is e-filed directly with the IRS and relevant state departments.</p>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="pricing-cta-card">
          <div className="cta-content">
            <h3>Ready to File Your US Tax Return?</h3>
            <p>Book a free 15-minute consultation to review your tax documents or create an account to start your filing.</p>
          </div>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-pricing-primary">
              <Calendar size={16} /> Book Free 15-Min Consultation
            </Link>
            <Link to={isAuthenticated ? "/portal" : "/register"} className="btn-pricing-secondary">
              {isAuthenticated ? "Go to Tax Filing Portal →" : "Create Account / Login to File →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
