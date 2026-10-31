import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Upload, 
  UserCheck, 
  Clock, 
  FileText, 
  Download, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Headphones, 
  Calendar, 
  MessageSquare, 
  Phone,
  FileCheck,
  Check
} from 'lucide-react';
import './PortalHome.css';

export default function PortalHome() {
  const { user } = useAuth();
  const userName = user?.name || 'Taxpayer';

  const stages = [
    {
      num: '1',
      title: 'Share Documents',
      desc: 'Upload Form W-2s, 1099s & Tax Questionnaire through our 256-bit secure vault.',
      link: '/portal/upload',
      cta: 'Upload Documents'
    },
    {
      num: '2',
      title: 'We Prepare',
      desc: 'Detailed Form 1040 preparation with comprehensive deduction & credit checks.',
      link: '/portal/taxpayer',
      cta: 'Fill Taxpayer Info'
    },
    {
      num: '3',
      title: 'Separate Review',
      desc: 'In-depth QA review by a second experienced senior tax team member.',
      link: '/portal/schedule',
      cta: 'Add Tax Notes'
    },
    {
      num: '4',
      title: 'We Explain',
      desc: 'Clear walkthrough of your federal and state tax computations in plain English.',
      link: '/portal/summary',
      cta: 'View Tax Summary'
    },
    {
      num: '5',
      title: 'We File',
      desc: 'Official IRS & state e-filing with direct government acceptance confirmation.',
      link: '/portal/download',
      cta: 'Download Returns'
    }
  ];

  const quickActions = [
    {
      icon: <Upload size={22} className="text-blue" />,
      title: 'Secure Document Vault',
      desc: 'Upload Form W-2s, 1099s, 1098s, and bank statements with 256-bit bank encryption.',
      link: '/portal/upload',
      cta: 'Go to Document Vault'
    },
    {
      icon: <UserCheck size={22} className="text-green" />,
      title: 'Taxpayer & Household Profile',
      desc: 'Update your personal, spouse, and dependent records to maximize family deductions.',
      link: '/portal/taxpayer',
      cta: 'Manage Household Profile'
    },
    {
      icon: <Clock size={22} className="text-amber" />,
      title: 'Schedule & Special Tax Notes',
      desc: 'Provide details on itemized deductions, state moves, and schedule a 1-on-1 walkthrough.',
      link: '/portal/schedule',
      cta: 'Add Notes & Schedule'
    },
    {
      icon: <FileText size={22} className="text-purple" />,
      title: 'Tax Summary & Refunds',
      desc: 'Review your computed federal and state refund allocations, deductions, and fee status.',
      link: '/portal/summary',
      cta: 'Inspect Tax Summary'
    }
  ];

  return (
    <div className="portal-home-root">
      {/* 1. Hero Welcome Card matching Public Home Hero */}
      <section className="portal-hero-card">
        <div className="portal-hero-inner">
          <div className="portal-hero-text">
            <span className="portal-eyebrow">YOUR GLOBAL TAX PARTNER • CLIENT DASHBOARD</span>
            <h1 className="portal-hero-heading">Welcome, {userName}.</h1>
            <p className="portal-hero-subtext">
              Professional &amp; personalized Form 1040 tax preparation. Follow the 5 filing stages below to complete your return accurately, maximize eligible deductions, and e-file on time.
            </p>
            <div className="portal-hero-buttons">
              <Link to="/portal/upload" className="portal-btn-green">
                <Upload size={16} /> UPLOAD TAX DOCUMENTS
              </Link>
              <Link to="/portal/schedule" className="portal-btn-outline">
                <Calendar size={16} /> SCHEDULE TAX NOTES
              </Link>
            </div>
          </div>

          <div className="portal-hero-badge-card">
            <div className="portal-badge-header">
              <div className="badge-shield-icon">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h3>Tax Season 2025 Ready</h3>
                <p>Tax Year 2024 Form 1040 Filing</p>
              </div>
            </div>
            <ul className="portal-badge-list">
              <li>
                <CheckCircle2 size={16} className="text-green" />
                <span>IRS Authorized e-File Provider</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-green" />
                <span>Strict Section 7216 Confidentiality</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-green" />
                <span>2-Tier Preparer &amp; QA Review Process</span>
              </li>
              <li>
                <CheckCircle2 size={16} className="text-green" />
                <span>All 50 US States &amp; DC Covered</span>
              </li>
            </ul>
            <div className="portal-badge-footer">
              <a href="tel:+919014532499" className="portal-support-link">
                <Headphones size={14} /> Helpline: +91 90145 32499 Ext: 102
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 5 Stages of US Tax Filing matching Public Home Process */}
      <section className="portal-stages-section">
        <div className="section-title-center">
          <span className="section-eyebrow">FILING WORKFLOW</span>
          <h2>5 Stages of US Tax Filing</h2>
          <p>
            Track your tax return progress through our streamlined 5-step preparation and quality assurance review.
          </p>
        </div>

        <div className="portal-steps-grid">
          {stages.map((stage) => (
            <Link key={stage.num} to={stage.link} className="portal-step-card">
              <div className="portal-step-circle">{stage.num}</div>
              <h4>{stage.title}</h4>
              <p>{stage.desc}</p>
              <div className="portal-step-action">
                <span>{stage.cta}</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Quick Action Hub matching Public Home Who We Help Cards */}
      <section className="portal-actions-section">
        <div className="section-title-center">
          <span className="section-eyebrow">FAST ACCESS</span>
          <h2>Quick Actions &amp; Portals</h2>
          <p>
            Directly access key modules in your client account to manage your filing.
          </p>
        </div>

        <div className="portal-actions-grid">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.link} className="portal-action-card">
              <div className="portal-action-icon-box">
                {action.icon}
              </div>
              <h3>{action.title}</h3>
              <p>{action.desc}</p>
              <div className="portal-action-footer">
                <span>{action.cta}</span>
                <ArrowRight size={15} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Confidence Strip matching Public Home Section */}
      <section className="portal-confidence-strip">
        <div className="confidence-pill-row">
          <span className="conf-stat">50 US States &amp; DC Covered</span>
          <span className="conf-divider">•</span>
          <span className="conf-stat">100% IRS Authorized e-File Standards</span>
          <span className="conf-divider">•</span>
          <span className="conf-stat">2-Tier Preparer &amp; QA Review Process</span>
        </div>
        <div className="confidence-contact-bar">
          <span>Need help with your return?</span>
          <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer" className="conf-whatsapp-btn">
            <MessageSquare size={14} /> WhatsApp Us
          </a>
          <Link to="/contact" className="conf-consult-btn">
            <Calendar size={14} /> Book Free 15-Min Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}
