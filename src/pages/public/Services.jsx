import {
  User,
  Briefcase,
  Map,
  TrendingUp,
  Globe,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Services.css';

const services = [
  {
    icon: <User size={28} />,
    title: 'Individual Form 1040 Preparation',
    desc: 'Comprehensive US tax filing for W-2 salaried employees, educators, and families across all 50 states. We maximize standard vs. itemized deductions and ensure full child and dependent tax credits.',
  },
  {
    icon: <Briefcase size={28} />,
    title: 'Self-Employed & 1099 Contractors (Schedule C)',
    desc: 'Tailored tax filing for independent contractors, freelancers, and small business owners. Includes legitimate business expense deductions, home office write-offs, and Section 199A QBI savings.',
  },
  {
    icon: <Map size={28} />,
    title: 'Multi-State Tax Filings & Moves',
    desc: 'Expert apportionment for professionals who lived, relocated, or performed remote work in multiple US states. We file resident and part-year returns to prevent double taxation across state lines.',
  },
  {
    icon: <TrendingUp size={28} />,
    title: 'Stock Options, Crypto & Capital Gains',
    desc: 'Precise Schedule D and Form 8949 reporting for tech employees and investors. Covers ESPP, RSUs, stock sales, dividend reinvestments, wash sales, and cryptocurrency transactions.',
  },
  {
    icon: <Globe size={28} />,
    title: 'International & Expat Taxation (FBAR / FATCA)',
    desc: 'Specialized compliance for visa holders (H-1B, L-1, F-1 OPT) and expats. Includes FinCEN Report 114 (FBAR), Form 8938, Foreign Tax Credit (Form 1116), and tax treaty benefits.',
  },
  {
    icon: <ShieldAlert size={28} />,
    title: 'IRS Notice Resolution & Amended Returns (1040-X)',
    desc: 'Professional assistance responding to IRS CP2000 mismatch notices, state Department of Revenue inquiries, back-tax filings, and preparation of amended federal returns (Form 1040-X).',
  },
];

export default function Services() {
  return (
    <div className="clip-services-page">
      <div className="clip-services-container">
        {/* Split Hero Section with Visual Showcase on the Right */}
        <div className="services-split-hero">
          <div className="services-hero-content">
            <span className="badge" style={{ background: '#e0f2fe', color: '#0369a1', padding: '6px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: 600, display: 'inline-block', marginBottom: '14px' }}>
              YOUR GLOBAL TAX PARTNER
            </span>
            <h1 className="clip-services-title">Our US Tax Preparation Services</h1>
            <p className="clip-services-subtitle">
              Professional, accurate, and personalized Form 1040 tax preparation. Every return is handled by a dedicated preparer and verified by a separate experienced reviewer before transmission to the IRS.
            </p>
            <div className="services-hero-perks">
              <div className="hero-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>Two-Tier Quality Assurance (Preparer + Senior QA)</span>
              </div>
              <div className="hero-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>IRS Authorized e-File Across All 50 US States</span>
              </div>
              <div className="hero-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a', flexShrink: 0 }} />
                <span>100% Accuracy Guarantee &amp; Year-Round Audit Assistance</span>
              </div>
            </div>
            <div className="services-hero-actions">
              <Link to="/contact" className="clip-btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#22c55e', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, fontSize: '14.5px' }}>
                Book Free Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#ffffff', color: '#0f172a', border: '1px solid #cbd5e1', padding: '12px 22px', borderRadius: '8px', fontWeight: 600, fontSize: '14.5px' }}>
                View Transparent Fees
              </Link>
            </div>
          </div>

          <div className="services-hero-image-col">
            <div className="services-image-frame">
              <img
                src="/services-tax-prep.jpg"
                alt="US Tax Preparation Dual-Monitor Workstation with Form 1040"
                className="services-showcase-img"
              />
              <div className="services-image-tag">
                <ShieldCheck size={18} style={{ color: '#22c55e' }} />
                <div>
                  <strong>IRS Authorized e-File Workstation</strong>
                  <span>Form 1040 Certified &amp; Two-Tier QA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3x2 Grid */}
        <div className="clip-services-grid">
          {services.map((item, i) => (
            <div className="clip-service-card" key={i}>
              <div className="clip-service-icon-bubble">
                {item.icon}
              </div>
              <h3 className="clip-service-card-title">{item.title}</h3>
              <p className="clip-service-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Card with Diffused Background */}
        <div className="services-bottom-cta-banner">
          <div className="cta-overlay-content">
            <h2 style={{ fontSize: '26px', marginBottom: '12px', fontWeight: 700, color: '#ffffff', textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
              Ready to File Your Taxes with Confidence?
            </h2>
            <p style={{ color: '#f1f5f9', maxWidth: '620px', margin: '0 auto 24px', fontSize: '15px', lineHeight: '1.6', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>
              Book a free 15-minute consultation with our tax specialists to discuss your situation, required documents, and get a clear upfront quote.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <Link to="/contact" className="clip-btn-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: '#22c55e', color: '#ffffff', padding: '12px 28px', borderRadius: '8px', fontWeight: 600 }}>
                Book Free 15-Min Consultation <ArrowRight size={16} />
              </Link>
              <Link to="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.35)', padding: '12px 28px', borderRadius: '8px', fontWeight: 600, backdropFilter: 'blur(4px)' }}>
                View Transparent Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
