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
    icon: <Users size={22} />,
    title: 'W-2 Employees',
    desc: 'Full-service tax preparation for salaried individuals, including W-2 income, with maximum deductions and credits.',
    image: '/who-w2-employees.jpg',
    imageAlt: 'W-2 salaried professional working on laptop'
  },
  {
    icon: <UserCheck size={22} />,
    title: 'Self-Employed & 1099',
    desc: 'Tax filing for freelancers, consultants, gig workers, and business owners with 1099 income (Schedule C).',
    image: '/who-self-employed.jpg',
    imageAlt: 'Self-employed 1099 professional and freelancer'
  },
  {
    icon: <HomeIcon size={22} />,
    title: 'Families & Dependents',
    desc: 'Tax filing for individuals and families, including dependents, child tax credits, and education benefits.',
    image: '/who-families-dependents.jpg',
    imageAlt: 'Smiling family with child tax deductions'
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'Investors & Crypto',
    desc: 'Tax reporting for investment income, stock transactions (Schedule D), and cryptocurrency gains and losses.',
    image: '/who-investors-crypto.jpg',
    imageAlt: 'Stock market chart and cryptocurrency investment tax reporting'
  },
  {
    icon: <Map size={22} />,
    title: 'Multi-State Filers',
    desc: 'Tax preparation for individuals with income or residency in multiple U.S. states.',
    image: '/who-multistate-filers.jpg',
    imageAlt: 'US map route markers for multi-state tax filing'
  },
  {
    icon: <Globe2 size={22} />,
    title: 'International & Expats',
    desc: 'Tax support for U.S. citizens, Green Card holders, and expats with foreign income, reporting (e.g., FBAR, FATCA, Form 8938).',
    image: '/who-international-expats.jpg',
    imageAlt: 'US passport and globe international expat tax compliance'
  }
];

const whyChooseUs = [
  {
    icon: <UserCheck size={22} />,
    title: 'Dedicated Tax Preparer for Every Client',
    desc: 'Your return is handled by an assigned specialist who takes time to understand your individual situation and multi-state tax needs.',
    image: '/tax-consultation-desk.jpg',
    imageAlt: 'Dedicated US tax preparer and client consultation'
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Separate Reviewer for Quality Assurance',
    desc: 'Each return is thoroughly reviewed by a second senior tax specialist before filing to guarantee accuracy and zero missed deductions.',
    image: '/services-tax-prep.jpg',
    imageAlt: 'Two-tier QA tax review workstation'
  },
  {
    icon: <FileText size={22} />,
    title: 'Focused on Form 1040 & Multi-State',
    desc: 'Comprehensive US individual tax preparation across all 50 states for W-2, 1099, self-employment, stock sales, crypto, and itemized deductions.',
    image: '/us-tax-partner-hero.jpg',
    imageAlt: 'Form 1040 certified US tax return preparation'
  },
  {
    icon: <CheckCircle2 size={22} />,
    title: 'Clear Pricing & Transparent Process',
    desc: 'Know your exact fee and timeline before we start. Upfront itemized quotes with zero hidden surprises or unexpected add-ons.',
    image: '/refund-approved.jpg',
    imageAlt: 'Transparent fee and direct deposit confirmation'
  },
  {
    icon: <Clock size={22} />,
    title: 'Ongoing Support Year-Round',
    desc: 'We are here for your questions anytime—not just during the April tax deadline. Year-round IRS notice and quarterly assistance.',
    image: '/corporate-skyline-bg.jpg',
    imageAlt: 'Year-round client support in corporate office'
  },
  {
    icon: <Lock size={22} />,
    title: 'Secure & Confidential Data Vault',
    desc: 'Bank-grade 256-bit encryption and strict adherence to IRS Section 7216 confidentiality regulations and FTC Safeguards.',
    image: '/security-data-vault.jpg',
    imageAlt: 'Bank-grade 256-bit cyber security data vault'
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
        <div className="home-reference-container">
          <div className="reference-section-header">
            <span className="reference-pill">STRESS LESS. FILE SMARTER!</span>
            <h2 className="reference-heading">Why Choose IRA Tax Solutions for Your Taxes</h2>
            <p className="reference-subtitle">
              Whether you are a W-2 professional, an independent 1099 contractor, or have complex multi-state investments, we handle your return with precision and care.
            </p>
          </div>

          <div className="reference-cards-grid">
            {whyChooseUs.map((item, idx) => (
              <div className="reference-split-card" key={idx}>
                <div className="ref-card-text-col">
                  <div className="ref-card-icon-bubble">
                    {item.icon}
                  </div>
                  <h3 className="ref-card-title">{item.title}</h3>
                  <p className="ref-card-desc">{item.desc}</p>
                </div>
                <div className="ref-card-image-col">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="ref-card-img"
                  />
                  <div className="ref-card-img-fade"></div>
                </div>
              </div>
            ))}
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
      </section>

      {/* 3. Who We Help Section */}
      <section className="who-we-help-section">
        <div className="home-reference-container">
          <div className="reference-section-header">
            <span className="reference-pill">INDIVIDUALS, FAMILIES, AND HOUSEHOLDS</span>
            <h2 className="reference-heading">Who We Help</h2>
            <p className="reference-subtitle">
              Tailored Tax Preparation &amp; Filing for a Wide Range of Taxpayers
            </p>
          </div>

          <div className="reference-cards-grid">
            {whoWeHelp.map((item, idx) => (
              <div className="reference-split-card" key={idx}>
                <div className="ref-card-text-col">
                  <div className="ref-card-icon-bubble">
                    {item.icon}
                  </div>
                  <h3 className="ref-card-title">{item.title}</h3>
                  <p className="ref-card-desc">{item.desc}</p>
                </div>
                <div className="ref-card-image-col">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="ref-card-img"
                  />
                  <div className="ref-card-img-fade"></div>
                </div>
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
