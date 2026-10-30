import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ExternalLink, ShieldCheck, UserCheck, CheckCircle2 } from 'lucide-react';
import './About.css';

const whyUs = [
  {
    icon: <UserCheck size={28} />,
    title: 'Dedicated Tax Preparer for Every Client',
    desc: 'Your return is handled by an assigned specialist who takes time to understand your individual career, multi-state moves, and family tax deductions.',
  },
  {
    icon: <ShieldCheck size={28} />,
    title: 'Separate Reviewer for Quality Assurance',
    desc: 'Unlike self-service software or solo shops, every single return is reviewed by a second senior tax professional to catch missed deductions before e-filing.',
  },
  {
    icon: <Calendar size={28} />,
    title: 'Year-Round Support Beyond April 15',
    desc: 'Our relationship does not end with filing. We provide year-round assistance for IRS correspondence, CP2000 inquiries, state tax notices, and quarterly planning.',
  },
];

const resources = [
  {
    id: 1,
    title: 'Official IRS "Where\'s My Refund?" Portal',
    category: 'IRS Federal Refund Tracker',
    link: 'https://www.irs.gov/refunds'
  },
  {
    id: 2,
    title: 'IRS Direct Pay (Federal Tax Payments Without Login)',
    category: 'IRS Tax Payments',
    link: 'https://www.irs.gov/payments/direct-pay'
  },
  {
    id: 3,
    title: 'Get Your Official IRS Tax Transcript Online',
    category: 'IRS Records & Transcripts',
    link: 'https://www.irs.gov/individuals/get-transcript'
  },
  {
    id: 4,
    title: 'FinCEN BSA E-Filing System (FBAR Form 114)',
    category: 'Foreign Bank Account Reporting',
    link: 'https://bsaefiling.fincen.treas.gov/'
  },
];

export default function About() {
  return (
    <div className="clip-about-page">
      {/* 1. Why Us Section */}
      <section className="clip-why-section">
        <div className="clip-why-container">
          <div className="clip-why-split">
            {/* Left Dark Image Banner */}
            <div className="clip-why-left-banner">
              <div className="clip-why-banner-content">
                <span className="banner-small-why">Why</span>
                <span className="banner-bold-brand">IRATaxSolutions</span>
                <p className="banner-subtext">
                  Your Global Tax Partner. Stress Less. File Smarter! Witness our masterful experience in US federal and multi-state tax filing.
                </p>
              </div>
            </div>

            {/* Right 3 Cards */}
            <div className="clip-why-cards-col">
              {whyUs.map((item, idx) => (
                <div key={idx} className="clip-why-card">
                  <div className="clip-why-icon-bubble">
                    {item.icon}
                  </div>
                  <h3 className="clip-why-card-title">{item.title}</h3>
                  <div className="title-divider-line" />
                  <p className="clip-why-card-p">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Proven Track Record Section */}
      <section className="clip-track-record-section">
        <div className="clip-track-container">
          <h2 className="clip-track-heading">Our Proven Track Record</h2>
          <div className="clip-track-divider" />
          <div className="clip-track-text">
            <p>
              IRA Tax Solutions provides end-to-end US Individual Tax Preparation (Form 1040) for salaried professionals, tech employees with equity compensation (RSU/ESPP), freelancers, small business owners (Schedule C), and international visa holders across all 50 US states.
            </p>
            <p>
              Our rigorous <strong>two-tier preparation and review model</strong> pairs every taxpayer with a dedicated preparer, followed by an independent senior quality review before transmission to the IRS. This process prevents filing errors, eliminates notice exposure, and ensures all eligible federal and state tax credits are claimed legally and accurately.
            </p>
            <p>
              Operating under strict Treasury Circular 230 guidelines and IRS Section 7216 data protection protocols, we safeguard your sensitive financial records with 256-bit encryption and restricted access controls.
            </p>
          </div>

          <div className="clip-track-stat-bar-single-line">
            <div className="stat-item-inline">
              <span className="stat-num-badge">50</span>
              <span className="stat-txt">US States &amp; DC Covered</span>
            </div>
            <span className="stat-pipe">|</span>
            <div className="stat-item-inline">
              <span className="stat-num-badge">100%</span>
              <span className="stat-txt">IRS Authorized e-File Standards</span>
            </div>
            <span className="stat-pipe">|</span>
            <div className="stat-item-inline">
              <span className="stat-num-badge">2-Tier</span>
              <span className="stat-txt">Preparer &amp; QA Review Process</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Official Tax Resources Section */}
      <section className="clip-resources-section" style={{ background: '#f8fafc', padding: '60px 0' }}>
        <div className="clip-track-container">
          <h2 className="clip-track-heading">Helpful US Tax Resources &amp; Government Portals</h2>
          <div className="clip-track-divider" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginTop: '30px' }}>
            {resources.map((res) => (
              <a
                key={res.id}
                href={res.link}
                target={res.link.startsWith('http') ? '_blank' : '_self'}
                rel="noopener noreferrer"
                style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', textDecoration: 'none', color: '#1e293b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'box-shadow 0.2s' }}
              >
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0284c7', display: 'block', marginBottom: '8px' }}>
                    {res.category}
                  </span>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px', color: '#0f172a' }}>
                    {res.title}
                  </h4>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16a34a', fontWeight: 600 }}>
                  <span>Open Resource</span>
                  <ExternalLink size={14} />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
