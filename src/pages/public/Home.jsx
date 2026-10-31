import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  Users, 
  Briefcase, 
  Home as HomeIcon, 
  TrendingUp, 
  Map, 
  Globe2, 
  CheckCircle2, 
  Calendar,
  Lock,
  Headphones,
  Check,
  Zap
} from 'lucide-react';
import './Home.css';

const whoWeHelp = [
  {
    icon: <Briefcase size={22} className="text-blue" />,
    title: 'W-2 Employees',
    desc: 'Salaried professionals, tech workers, and corporate employees across all 50 states.'
  },
  {
    icon: <UserCheck size={22} className="text-green" />,
    title: 'Self-Employed & 1099',
    desc: 'Freelancers, consultants, small business owners, and gig economy workers (Schedule C).'
  },
  {
    icon: <HomeIcon size={22} className="text-purple" />,
    title: 'Families & Dependents',
    desc: 'Newly married couples, parents claiming Child Tax Credit ($2,200/child), and changing tax status.'
  },
  {
    icon: <TrendingUp size={22} className="text-amber" />,
    title: 'Investors & Crypto',
    desc: 'Stock options (ESPP/RSU), crypto transactions, dividends, and capital gains (Schedule D / 8949).'
  },
  {
    icon: <Map size={22} className="text-coral" />,
    title: 'Multi-State Filings',
    desc: 'Individuals who moved or worked in multiple states during the tax year (apportionment returns).'
  },
  {
    icon: <Globe2 size={22} className="text-teal" />,
    title: 'International & Expats',
    desc: 'Foreign income, FBAR (FinCEN 114), Form 8938 (FATCA), and H-1B / L-1 visa cross-border tax.'
  }
];

const fiveSteps = [
  {
    num: '1',
    title: 'Share Documents',
    desc: 'Upload through our 256-bit secure portal with a simple custom checklist.'
  },
  {
    num: '2',
    title: 'We Prepare',
    desc: 'Detailed Form 1040 preparation with comprehensive credit & deduction checks.'
  },
  {
    num: '3',
    title: 'Separate Review',
    desc: 'Reviewed by a second experienced tax team member for quality assurance.'
  },
  {
    num: '4',
    title: 'We Explain',
    desc: 'Clear summary of your federal and state tax returns in plain English.'
  },
  {
    num: '5',
    title: 'We File',
    desc: 'E-filed directly to the IRS and state, and you receive confirmation receipts.'
  }
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  return (
    <div className="clip-home-root">
      {/* Live Broadcast / Early Filing Flash Discount Bar with Horizontal Marquee */}
      <div className="home-broadcast-banner">
        <div className="broadcast-container">
          <div className="broadcast-live-tag">
            <span className="live-pulsing-dot"></span>
            <Zap size={14} className="broadcast-zap-icon" />
            <span>EARLY FILE DISCOUNT:</span>
          </div>

          <div className="broadcast-marquee-container" title="Pause on hover">
            <div className="broadcast-marquee-track">
              <div className="marquee-group">
                <span className="marquee-item">
                  Get <strong>Straight Away 10% OFF</strong> on Your Total Bill / Invoice! &nbsp;•&nbsp; Limited early-bird filing slots available for Tax Season 2026.
                </span>
                <span className="marquee-separator">⚡</span>
                <span className="marquee-item">
                  Get <strong>Straight Away 10% OFF</strong> on Your Total Bill / Invoice! &nbsp;•&nbsp; Limited early-bird filing slots available for Tax Season 2026.
                </span>
                <span className="marquee-separator">⚡</span>
              </div>
              <div className="marquee-group" aria-hidden="true">
                <span className="marquee-item">
                  Get <strong>Straight Away 10% OFF</strong> on Your Total Bill / Invoice! &nbsp;•&nbsp; Limited early-bird filing slots available for Tax Season 2026.
                </span>
                <span className="marquee-separator">⚡</span>
                <span className="marquee-item">
                  Get <strong>Straight Away 10% OFF</strong> on Your Total Bill / Invoice! &nbsp;•&nbsp; Limited early-bird filing slots available for Tax Season 2026.
                </span>
                <span className="marquee-separator">⚡</span>
              </div>
            </div>
          </div>

          <div className="broadcast-right">
            <Link to={isAuthenticated ? "/portal" : "/register"} className="broadcast-cta-button">
              <span>Claim 10% Off</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* 1. Hero Section */}
      <section className="clip-hero-section">
        <div className="clip-hero-inner">
          <div className="clip-hero-text-col">
                        <div className="hero-flash-discount-badge">
              <span className="flash-badge-pulse"></span>
              <Zap size={15} className="flash-zap" />
              <span><strong>EARLY FILE DISCOUNT:</strong> Straight Away <strong>10% OFF</strong> on Your Total Bill / Invoice!</span>
            </div>
            <span className="clip-eyebrow">YOUR GLOBAL TAX PARTNER</span>
            <h1 className="clip-heading">Your Taxes, Our Expertise.</h1>
            <p className="clip-subtext">
              Professional &amp; Personalized Form 1040 Tax Preparation. Accurate, reliable, and transparent. We make tax filing simple, accurate, and hassle-free.
            </p>
            <div className="clip-hero-buttons">
              <Link to="/contact" className="clip-btn-green">
                BOOK FREE CONSULTATION
              </Link>
              <Link to="/services" className="clip-btn-outline">
                EXPLORE SERVICES
              </Link>
            </div>
          </div>

          {/* Hero Feature Highlights Card */}
          <div className="hero-features-badge-card">
            <div className="hero-badge-header">
              <div className="badge-shield-icon">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3>Form 1040 Preparation</h3>
                <p>Accurate • Reliable • Transparent</p>
              </div>
            </div>
            <ul className="hero-badge-list">
              <li>
                <Check size={16} className="text-green" />
                <span>Dedicated Tax Preparer for Every Client</span>
              </li>
              <li>
                <Check size={16} className="text-green" />
                <span>Separate Reviewer for Quality Assurance</span>
              </li>
              <li>
                <Check size={16} className="text-green" />
                <span>All 50 US States &amp; Multi-State Returns</span>
              </li>
              <li>
                <Check size={16} className="text-green" />
                <span>256-Bit Bank-Grade Encryption &amp; IRS 7216</span>
              </li>
            </ul>
                        <div className="hero-discount-ribbon">
              <Zap size={15} className="ribbon-icon" />
              <span><strong>10% Early Filing Discount</strong> applied straight to your invoice</span>
            </div>
            <div className="hero-badge-footer">
              <Link to={isAuthenticated ? "/portal" : "/register"} className="hero-portal-link">
                {isAuthenticated ? "Go to Tax Filing Portal →" : "Create Account / Login to File →"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Feature Section: Why Choose IRA Tax Solutions */}
      <section className="home-poster-showcase-section">
        <div className="home-poster-inner single-col-layout">
          <div className="poster1-content-col">
            <div className="section-title-center">
              <span className="section-pill">Stress Less. File Smarter!</span>
              <h2>Why Choose IRA Tax Solutions for Your Taxes</h2>
              <p className="poster1-intro">
                Whether you are a W-2 professional, an independent 1099 contractor, or have complex multi-state investments, we handle your return with precision and care.
              </p>
            </div>

            <div className="poster1-bullet-grid">
              <div className="bullet-row-card">
                <div className="b-icon blue"><UserCheck size={22} /></div>
                <div>
                  <strong>Dedicated Tax Preparer for Every Client</strong>
                  <p>Your return is handled by a dedicated preparer who understands your individual situation.</p>
                </div>
              </div>

              <div className="bullet-row-card">
                <div className="b-icon red"><ShieldCheck size={22} /></div>
                <div>
                  <strong>Separate Reviewer for Quality Assurance</strong>
                  <p>Each return is thoroughly reviewed by a second senior tax specialist before filing.</p>
                </div>
              </div>

              <div className="bullet-row-card">
                <div className="b-icon green"><FileText size={22} /></div>
                <div>
                  <strong>Focused on Individual Taxation (Form 1040)</strong>
                  <p>W-2, 1099, self-employment, stock sales, crypto, itemized deductions, and multi-state returns.</p>
                </div>
              </div>

              <div className="bullet-row-card">
                <div className="b-icon amber"><CheckCircle2 size={22} /></div>
                <div>
                  <strong>Clear Pricing &amp; Transparent Process</strong>
                  <p>Know the fee and timeline before we start. No hidden surprises or unexpected add-ons.</p>
                </div>
              </div>

              <div className="bullet-row-card">
                <div className="b-icon purple"><Clock size={22} /></div>
                <div>
                  <strong>Ongoing Support Year-Round</strong>
                  <p>We are here for your questions anytime—not just during the April tax deadline.</p>
                </div>
              </div>

              <div className="bullet-row-card">
                <div className="b-icon teal"><Lock size={22} /></div>
                <div>
                  <strong>Secure &amp; Confidential Data Vault</strong>
                  <p>Bank-level encryption and strict adherence to IRS Section 7216 privacy standards.</p>
                </div>
              </div>
            </div>

            <div className="poster1-cta-row center-cta">
              <Link to="/contact" className="btn-primary-bold">
                <Calendar size={17} /> Schedule Free 15-Min Call
              </Link>
              <Link to="/security" className="btn-secondary-link">
                Learn About Our Security &amp; Privacy →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Who We Help Section */}
      <section className="who-we-help-section">
        <div className="who-we-help-inner">
          <div className="section-title-center">
            <span className="section-pill">Individuals. Families. Professionals.</span>
            <h2>Who We Help</h2>
            <p>Individual Tax Preparation for Different Life Situations</p>
          </div>

          <div className="who-grid">
            {whoWeHelp.map((item, idx) => (
              <div className="who-card" key={idx}>
                <div className="who-icon-wrapper">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Our 5-Step Process */}
      <section className="process-step-section">
        <div className="process-step-inner">
          <div className="section-title-center">
            <span className="section-pill">A Simple Process. A Smoother Experience.</span>
            <h2>Our 5-Step Filing Process</h2>
            <p>From document upload to filing, we keep you informed at every step.</p>
          </div>

          <div className="steps-row">
            {fiveSteps.map((s) => (
              <div className="step-card" key={s.num}>
                <div className="step-circle">{s.num}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="process-bottom-banner">
            <CheckCircle2 size={24} className="text-green" />
            <span>
              <strong>Transparent communication throughout the process.</strong> No surprises. Just a better tax filing experience.
            </span>
          </div>
        </div>
      </section>

      {/* 5. Confidence CTA Banner */}
      <section className="confidence-cta-section">
        <div className="confidence-inner">
          <div className="confidence-text-col">
            <h2>File Your Taxes with Confidence</h2>
            <p>Experienced Team. Secure Process. Personal Service.</p>
            <div className="confidence-pillars">
              <span>🎯 Accurate Preparation</span>
              <span>🔒 Confidential Handling</span>
              <span>👥 Dedicated Support</span>
              <span>📊 Transparent Pricing</span>
            </div>
          </div>
          <div className="confidence-btn-col">
            <Link to="/contact" className="btn-confidence-green">
              Book Your Free 15-Minute Consultation <ArrowRight size={18} />
            </Link>
            <div className="contact-meta-quick">
              <span>✉ info@irataxsolutions.com</span>
              <a href="tel:+919014532499" style={{ color: 'inherit', textDecoration: 'none' }}><span>☎ +91 90145 32499</span></a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
