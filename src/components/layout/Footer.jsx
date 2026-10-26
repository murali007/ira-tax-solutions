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
          <h4>Services</h4>
          <ul>
            <li><Link to="/services">Individual Tax Filing</Link></li>
            <li><Link to="/services">Joint Tax Filing</Link></li>
            <li><Link to="/services">ITIN Applications</Link></li>
            <li><Link to="/services">Tax Amendments</Link></li>
            <li><Link to="/refer">Refer &amp; Earn</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact Us</h4>
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
                <span>+1 (555) 123-4567</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">☎</span>
                <span>+91 98765 43210</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">📍</span>
                <span>Demo Address, Suite 100<br />City, State 00000</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {currentYear} IRA Tax Solutions. All rights reserved. <span className="demo-badge">DEMO</span></span>
          <div className="footer-bottom-links">
            <Link to="/portal/refund-policy">Refund Policy</Link>
            <Link to="/portal/service-agreement">Service Agreement</Link>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
