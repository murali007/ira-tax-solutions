import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Users, EyeOff, Server, CheckCircle2, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import './SecurityPrivacy.css';

export default function SecurityPrivacy() {
  return (
    <div className="security-page-root">
      {/* Header Banner - Split Hero with Bank-Grade Cyber Vault Graphic on the Right */}
      <section className="security-hero-banner">
        <div className="security-hero-inner-split">
          <div className="security-hero-text-col">
            <div className="security-hero-badge">
              <Shield size={16} /> 256-Bit Bank-Grade Security &amp; IRS Section 7216 Compliance
            </div>
            <h1 className="security-heading">Your Tax Information Deserves Complete Protection</h1>
            <p className="security-subtext">
              Secure. Confidential. Trusted. We follow industry best practices and federal statutory mandates to protect your personal identity and financial documents at every step of your US tax preparation.
            </p>
            <div className="security-hero-points">
              <div className="sec-point-item">
                <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
                <span>256-Bit SSL/TLS 1.3 In-Transit &amp; AES-256 At-Rest Encryption</span>
              </div>
              <div className="sec-point-item">
                <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
                <span>IRS Internal Revenue Code Section 7216 Statutory Privacy</span>
              </div>
              <div className="sec-point-item">
                <ShieldCheck size={18} style={{ color: '#38bdf8' }} />
                <span>Zero Third-Party Data Sharing or Advertiser Access</span>
              </div>
            </div>
          </div>

          <div className="security-hero-visual-col">
            <div className="security-vault-card">
              <img
                src="/security-data-vault.jpg"
                alt="256-Bit Bank-Grade Holographic Security Cyber Shield and Vault"
                className="security-vault-img"
              />
              <div className="security-vault-tag">
                <Lock size={18} style={{ color: '#38bdf8' }} />
                <div>
                  <strong>IRS Section 7216 Compliant Vault</strong>
                  <span>256-Bit Bank-Grade Encrypted Cloud Storage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="security-content-section">
        <div className="security-content-inner single-col">
          {/* Detailed Security Pillars matching Brand Card 2 */}
          <div className="security-details-col">
            <div className="sec-pill-group grid-layout">
              <div className="sec-feature-box">
                <div className="sec-icon-box green">
                  <Lock size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Secure Document Portal</h3>
                  <p>
                    Upload your W-2s, 1099s, and tax documents through our 256-bit end-to-end encrypted portal with access-controlled cloud storage.
                  </p>
                </div>
              </div>

              <div className="sec-feature-box">
                <div className="sec-icon-box blue">
                  <Users size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Limited &amp; Authorized Access</h3>
                  <p>
                    Only authorized team members assigned to your return have permission to view your documents, governed by strict role-based access controls.
                  </p>
                </div>
              </div>

              <div className="sec-feature-box">
                <div className="sec-icon-box purple">
                  <EyeOff size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Confidentiality &amp; Data Protection</h3>
                  <p>
                    We strictly adhere to Internal Revenue Code (IRC) Section 7216 confidentiality regulations and Federal Trade Commission (FTC) Safeguards Rules.
                  </p>
                </div>
              </div>

              <div className="sec-feature-box">
                <div className="sec-icon-box amber">
                  <FileCheck size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Dedicated Preparer &amp; Separate Reviewer</h3>
                  <p>
                    Each return is prepared by a dedicated tax preparer and independently reviewed by an experienced senior reviewer before transmission to the IRS.
                  </p>
                </div>
              </div>

              <div className="sec-feature-box">
                <div className="sec-icon-box coral">
                  <Server size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Safe Record Handling</h3>
                  <p>
                    Your documents are retained strictly in compliance with IRS statutory requirements and never shared, sold, or exposed to third-party advertisers.
                  </p>
                </div>
              </div>

              <div className="sec-feature-box">
                <div className="sec-icon-box teal">
                  <CheckCircle2 size={22} />
                </div>
                <div className="sec-feature-text">
                  <h3>Trusted Process</h3>
                  <p>
                    Clear communication, transparent workflow, and professional handling from initial document upload through to final IRS e-file acceptance.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Action CTA */}
            <div className="sec-action-banner" style={{ marginTop: '48px', background: '#0f172a', borderRadius: '16px', padding: '36px', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <div>
                <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#ffffff' }}>Have Questions About Our Privacy Standards?</h3>
                <p style={{ margin: 0, color: '#94a3b8', fontSize: '14.5px', maxWidth: '600px' }}>
                  Our team is happy to walk you through our data protection measures, client non-disclosure protocols, and filing security.
                </p>
              </div>
              <Link to="/contact" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#22c55e', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', fontSize: '14.5px' }}>
                Contact Security Officer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
