import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <div className="footer-logo-icon">IRA</div>
            IRA Tax Solutions
          </div>
          <p>
            Professional tax filing services for individuals and families.
            Accurate, affordable, and trusted by thousands of taxpayers.
          </p>
          <div className="footer-social">
            {/* Placeholder social icons */}
            <a href="#" aria-label="Facebook" title="Facebook">f</a>
            <a href="#" aria-label="Twitter" title="Twitter">𝕏</a>
            <a href="#" aria-label="LinkedIn" title="LinkedIn">in</a>
            <a href="#" aria-label="Instagram" title="Instagram">◻</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><Link to="/refund-status">Refund Status</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-column">
          <h4>ITR &amp; Tax Services</h4>
          <ul>
            <li><Link to="/services">Salaried ITR-1 Sahaj</Link></li>
            <li><Link to="/services">Capital Gains &amp; Stocks (ITR-2)</Link></li>
            <li><Link to="/services">Freelancer Presumptive (ITR-4)</Link></li>
            <li><Link to="/services">NRI Taxation &amp; DTAA</Link></li>
            <li><Link to="/refer">Refer &amp; Earn ₹500</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Indian Support Offices</h4>
          <ul>
            <li>
              <div className="footer-contact-item">
                <span className="icon">✉</span>
                <span>contact@irataxsolutions.com</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">☎</span>
                <span>+91 98765 43210 <em style={{ fontSize: '11px', opacity: 0.8 }}>(Dummy)</em></span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">☎</span>
                <span>+91 98765 00000 <em style={{ fontSize: '11px', opacity: 0.8 }}>(Dummy)</em></span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">📍</span>
                <span>Cyber Gateway, HITEC City<br />Hyderabad, Telangana 500081</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {currentYear} IRATaxSolutions. All rights reserved. In compliance with the Income Tax Act, 1961 (Govt of India).</span>
          <div className="footer-bottom-links">
            <Link to="/portal/refund-policy">Refund Policy (India)</Link>
            <Link to="/portal/service-agreement">Terms of Service</Link>
            <a href="https://incometax.gov.in" target="_blank" rel="noopener noreferrer">e-Filing Portal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
