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
            <li><Link to="/refer">Refer a Friend &amp; Earn $20</Link></li>
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
                <span className="icon">🇮🇳</span>
                <a href="tel:+919014532499" style={{ color: 'inherit', textDecoration: 'none' }}>+91 90145 32499</a>
              </div>
            </li>
            <li>
              <div className="footer-contact-item">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="#25D366" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.999-.047-.282-.09-.645-.214-1.11-.416-1.938-.838-3.21-2.793-3.308-2.923-.098-.13-1.002-1.332-1.002-2.54 0-1.208.631-1.802.855-2.047.224-.245.489-.306.652-.306.163 0 .326.002.469.009.151.008.354-.057.553.421.204.489.693 1.691.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.107.502.143.245.636 1.05 1.365 1.701.939.837 1.731 1.097 1.976 1.22.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.551-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.592-.083.997z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.436 5.178L2 22l4.981-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.174c-1.637 0-3.17-.468-4.472-1.28l-.321-.2-3.084.866.829-3.029-.211-.336C3.844 14.858 3.326 13.47 3.326 12c0-4.783 3.891-8.674 8.674-8.674 4.783 0 8.674 3.891 8.674 8.674 0 4.783-3.891 8.674-8.674 8.674z"/>
                </svg>
                <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>WhatsApp: +91 90145 32499</a>
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
            <a href="https://sa.www4.irs.gov/wmr/" target="_blank" rel="noopener noreferrer">IRS Where's My Refund</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
