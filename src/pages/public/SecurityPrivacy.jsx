import { Link } from 'react-router-dom';
import { Shield, Lock, FileCheck, Users, EyeOff, Server, CheckCircle2, ArrowRight } from 'lucide-react';
import './SecurityPrivacy.css';

export default function SecurityPrivacy() {
  return (
    <div className="security-page-root">
      {/* Header Banner */}
      <section className="security-hero-banner">
        <div className="security-hero-inner">
          <div className="security-hero-badge">
            <Shield size={16} /> 256-Bit Bank-Grade Security &amp; IRS Section 7216 Compliance
          </div>
          <h1 className="security-heading">Your Tax Information Deserves Care</h1>
          <p className="security-subtext">
            Secure. Confidential. Trusted. We follow industry best practices to protect your personal and financial information at every step of your tax preparation.
          </p>
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
            <div className="security-cta-banner">
              <div>
                <h4>Ready to File Your Taxes Securely?</h4>
                <p>Schedule your free 15-minute consultation or access your encrypted client portal.</p>
              </div>
              <div className="cta-action-btns">
                <Link to="/contact" className="btn-sec-green">
                  Book Free Consultation <ArrowRight size={16} />
                </Link>
                <Link to="/portal" className="btn-sec-outline">
                  Client Portal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
