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
            Your Global Tax Partner. Professional &amp; personalized US Form 1040 tax preparation for individuals, families, and professionals across all 50 states.
          </p>
          <div className="footer-social">
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
            <li><Link to="/security">Security &amp; Privacy</Link></li>
            <li><Link to="/refund-status">IRS Refund Status</Link></li>
            <li><Link to="/contact">Book Consultation</Link></li>
          </ul>
        </div>

        {/* US Tax Services */}
        <div className="footer-column">
          <h4>US Tax Services</h4>
          <ul>
            <li><Link to="/services">Individual Form 1040 (W-2)</Link></li>
            <li><Link to="/services">Self-Employed &amp; 1099 (Schedule C)</Link></li>
            <li><Link to="/services">Stocks &amp; Crypto (Schedule D)</Link></li>
            <li><Link to="/services">Multi-State Tax Filings</Link></li>
            <li><Link to="/services">FBAR &amp; FATCA Form 8938</Link></li>
            <li><Link to="/refer">Refer a Friend &amp; Earn $50</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-column">
          <h4>Contact &amp; Support</h4>
          <ul>
            <li>
              <div className="footer-contact-item">
                <span className="icon">✉</span>
                <span>info@irataxsolutions.com</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">☎</span>
                <span>+1 (901) 453-2499</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">💬</span>
                <span>WhatsApp: +1 90145 32499</span>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <span className="icon">📍</span>
                <span>United States &bull; Global Tax Advisory Services</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <span>© {currentYear} IRATaxSolutions. All rights reserved. Registered US Tax Preparation Firm adhering to IRS Circular 230 standards.</span>
          <div className="footer-bottom-links">
            <Link to="/security">Privacy &amp; Security Policy</Link>
            <Link to="/about">About Our Firm</Link>
            <a href="https://www.irs.gov/refunds" target="_blank" rel="noopener noreferrer">IRS Where's My Refund</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
