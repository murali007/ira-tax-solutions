import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle2, Calendar, MessageSquare, Shield, HelpCircle, Users, CheckSquare, ShieldCheck } from 'lucide-react';
import IndiaFlag from '../../components/common/IndiaFlag';
import UsFlag from '../../components/common/UsFlag';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    taxSituation: 'W-2 Employee',
    preferredDate: '',
    timeSlot: 'Morning (9:00 AM - 12:00 PM EST)',
    timeZone: 'EST (Eastern Time)',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="container">
        {/* Split Header with Consultation Desk Visual on the Right */}
        <div className="contact-header-split">
          <div className="contact-header-text">
            <span className="badge">Schedule Free Consultation</span>
            <h1 className="contact-page-title">Let's Make Tax Filing Simple</h1>
            <p className="contact-page-desc">
              Have questions about your US taxes? Schedule a free 15-minute video or phone call with our experienced tax specialists to get your doubts answered.
            </p>
            <div className="contact-header-perks">
              <div className="contact-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                <span>100% Free 15-Minute No-Obligation Consultation</span>
              </div>
              <div className="contact-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                <span>W-2s, 1099s, RSU/ESPP, Multi-State &amp; Expat Guidance</span>
              </div>
              <div className="contact-perk-item">
                <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                <span>Upfront transparent fee estimate before any commitment</span>
              </div>
            </div>
          </div>

          <div className="contact-header-image-col">
            <div className="contact-image-card">
              <img
                src="/tax-consultation-desk.jpg"
                alt="US Tax Consultation Desk with Client and Tax Preparer"
                className="contact-showcase-img"
              />
              <div className="contact-image-tag">
                <ShieldCheck size={18} style={{ color: '#22c55e' }} />
                <div>
                  <strong>1-on-1 Confidential Tax Consultation Desk</strong>
                  <span>Experienced US Tax Preparers &amp; Reviewers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-booking-grid">
          {/* Left Column: Direct Contact & Highlights */}
          <div className="booking-poster-col">
            <div className="booking-highlight-card">
              <div className="booking-card-top-img-wrap">
                <img
                  src="/tax-consultation-desk.jpg"
                  alt="US Tax Consultation Session"
                  className="booking-card-top-img"
                />
              </div>

              <div className="highlight-card-header">
                <span className="highlight-tag">Free 15-Min Call</span>
                <h3>Speak with an Expert</h3>
                <p>Discuss your tax situation, deductions, and get an upfront price estimate.</p>
              </div>
              <ul className="booking-perks-list">
                <li>
                  <CheckSquare size={17} className="text-green" />
                  <div>
                    <strong>Ask Your Questions</strong>
                    <span>Get clarity on your tax situation, required forms, and timeline.</span>
                  </div>
                </li>
                <li>
                  <CheckSquare size={17} className="text-green" />
                  <div>
                    <strong>Understand the Process</strong>
                    <span>Learn how our dedicated preparer and separate reviewer safeguard your return.</span>
                  </div>
                </li>
                <li>
                  <CheckSquare size={17} className="text-green" />
                  <div>
                    <strong>Know Estimated Fee</strong>
                    <span>Clear, transparent quote with zero hidden charges or surprises.</span>
                  </div>
                </li>
                <li>
                  <CheckSquare size={17} className="text-green" />
                  <div>
                    <strong>No Obligation</strong>
                    <span>A free consultation designed to help you make an informed decision.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Direct Contact Block */}
                        <div className="direct-contact-pill-card">
              <h4>Direct Support Channels</h4>
              <div className="direct-item">
                <Phone size={18} className="text-green" />
                <div>
                  <strong>US Support:</strong>
                  <a href="tel:+13863928693"><UsFlag width={18} height={12} /> +1-(386)-392-8693</a>
                </div>
              </div>
              <div className="direct-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.999-.047-.282-.09-.645-.214-1.11-.416-1.938-.838-3.21-2.793-3.308-2.923-.098-.13-1.002-1.332-1.002-2.54 0-1.208.631-1.802.855-2.047.224-.245.489-.306.652-.306.163 0 .326.002.469.009.151.008.354-.057.553.421.204.489.693 1.691.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.107.502.143.245.636 1.05 1.365 1.701.939.837 1.731 1.097 1.976 1.22.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.551-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.592-.083.997z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.436 5.178L2 22l4.981-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.174c-1.637 0-3.17-.468-4.472-1.28l-.321-.2-3.084.866.829-3.029-.211-.336C3.844 14.858 3.326 13.47 3.326 12c0-4.783 3.891-8.674 8.674-8.674 4.783 0 8.674 3.891 8.674 8.674 0 4.783-3.891 8.674-8.674 8.674z"/>
                </svg>
                <div>
                  <strong>US WhatsApp Chat:</strong>
                  <a href="https://wa.me/13863928693" target="_blank" rel="noreferrer"><UsFlag width={18} height={12} /> +1-(386)-392-8693</a>
                </div>
              </div>
              <div className="direct-item">
                <Phone size={18} className="text-green" />
                <div>
                  <strong>India Support:</strong>
                  <a href="tel:+919014532499"><IndiaFlag width={18} height={12} /> +91 90145 32499 (Ext: 102)</a>
                </div>
              </div>
              <div className="direct-item">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="#25D366" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.07-.999-.047-.282-.09-.645-.214-1.11-.416-1.938-.838-3.21-2.793-3.308-2.923-.098-.13-1.002-1.332-1.002-2.54 0-1.208.631-1.802.855-2.047.224-.245.489-.306.652-.306.163 0 .326.002.469.009.151.008.354-.057.553.421.204.489.693 1.691.754 1.814.061.122.102.265.02.428-.082.163-.122.265-.245.408-.122.143-.257.319-.367.428-.122.123-.25.257-.107.502.143.245.636 1.05 1.365 1.701.939.837 1.731 1.097 1.976 1.22.245.122.388.102.531-.061.143-.163.612-.714.775-.959.163-.245.326-.204.551-.122.224.082 1.428.673 1.673.796.245.122.408.184.469.286.061.102.061.592-.083.997z"/>
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.661 1.436 5.178L2 22l4.981-1.399C8.423 21.499 10.155 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.174c-1.637 0-3.17-.468-4.472-1.28l-.321-.2-3.084.866.829-3.029-.211-.336C3.844 14.858 3.326 13.47 3.326 12c0-4.783 3.891-8.674 8.674-8.674 4.783 0 8.674 3.891 8.674 8.674 0 4.783-3.891 8.674-8.674 8.674z"/>
                </svg>
                <div>
                  <strong>India WhatsApp Chat:</strong>
                  <a href="https://wa.me/919014532499" target="_blank" rel="noreferrer"><IndiaFlag width={18} height={12} /> +91 90145 32499</a>
                </div>
              </div>
              <div className="direct-item">
                <Mail size={18} className="text-blue" />
                <div>
                  <strong>Official Email:</strong>
                  <a href="mailto:info@irataxsolutions.com">info@irataxsolutions.com</a>
                </div>
              </div>
              <div className="direct-item">
                <Clock size={18} className="text-amber" />
                <div>
                  <strong>Hours of Operation:</strong>
                  <span>Mon – Sat: 9:00 AM – 8:00 PM EST (24/7 Peak Season)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: 15-Minute Consultation Booking Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="success-box">
                <CheckCircle2 size={54} style={{ color: '#16a34a', margin: '0 auto 16px' }} />
                <h3>Consultation Scheduled!</h3>
                <p>
                  Thank you, <strong>{formData.name}</strong>! Your free 15-minute consultation request has been received for <strong>{formData.preferredDate || 'the upcoming slot'}</strong> ({formData.timeZone}).
                </p>
                <p style={{ fontSize: '13.5px', color: '#64748b', marginTop: '8px' }}>
                  A confirmation invitation has been dispatched to <strong>{formData.email}</strong>. Our tax preparer looks forward to speaking with you!
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      email: '',
                      phone: '',
                      taxSituation: 'W-2 Employee',
                      preferredDate: '',
                      timeSlot: 'Morning (9:00 AM - 12:00 PM EST)',
                      timeZone: 'EST (Eastern Time)',
                      message: ''
                    });
                  }}
                  className="btn btn-outline"
                  style={{ marginTop: '20px' }}
                >
                  Book Another Session
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="booking-form-inner">
                <div className="form-header-title">
                  <h3>Book Your Free 15-Minute Consultation</h3>
                  <p>Get clarity on your tax situation, document requirements, and transparent pricing with no obligation.</p>
                </div>

                <div className="three-value-pills">
                  <span className="pill-badge">💡 Get Doubts Cleared</span>
                  <span className="pill-badge">📋 Understand Process</span>
                  <span className="pill-badge">💲 Know Estimated Fee</span>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (386) 392-8693 or +91 90145 32499"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Primary Tax Situation *</label>
                    <select
                      value={formData.taxSituation}
                      onChange={(e) => setFormData({ ...formData, taxSituation: e.target.value })}
                    >
                      <option value="W-2 Employee">W-2 Salaried Employee</option>
                      <option value="1099 Independent Contractor">1099 Contractor / Freelancer (Schedule C)</option>
                      <option value="W-2 + Stock Options (RSU/ESPP)">W-2 + Stock Options / RSUs / ESPP</option>
                      <option value="Multi-State Moves">Multi-State Returns (Moved during the year)</option>
                      <option value="Small Business Owner">Small Business / LLC (Schedule C / E)</option>
                      <option value="Crypto & Investment Portfolio">Active Crypto / Stock Trader (Schedule D)</option>
                      <option value="Expat / Foreign Assets">Expat / Foreign Bank Accounts (FBAR/FATCA)</option>
                      <option value="Other / Notice Assistance">IRS Notice / Other Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Time Window</label>
                    <select
                      value={formData.timeSlot}
                      onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                    >
                      <option value="Morning (9:00 AM - 12:00 PM EST)">Morning (9:00 AM – 12:00 PM EST)</option>
                      <option value="Afternoon (12:00 PM - 4:00 PM EST)">Afternoon (12:00 PM – 4:00 PM EST)</option>
                      <option value="Evening (4:00 PM - 8:00 PM EST)">Evening (4:00 PM – 8:00 PM EST)</option>
                      <option value="Flexible / Any Time">Flexible / Any Available Slot</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Your US Time Zone</label>
                  <select
                    value={formData.timeZone}
                    onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                  >
                    <option value="EST (Eastern Time)">EST (Eastern Time - US)</option>
                    <option value="CST (Central Time)">CST (Central Time - US)</option>
                    <option value="MST (Mountain Time)">MST (Mountain Time - US)</option>
                    <option value="PST (Pacific Time)">PST (Pacific Time - US)</option>
                    <option value="IST (India Standard Time)">IST (India Standard Time)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Questions or Notes for Your Preparer</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your tax situation (e.g. number of W-2s, states lived in, foreign accounts, or specific questions)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn-submit-booking">
                  Confirm 15-Minute Free Consultation <Send size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
