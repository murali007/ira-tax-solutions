import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle2, Calendar, MessageSquare, Shield, HelpCircle, Users, CheckSquare } from 'lucide-react';
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
        <header className="page-header">
          <span className="badge">Schedule Free Consultation</span>
          <h1>Let's Make Tax Filing Simple</h1>
          <p>
            Have questions about your taxes? Schedule a free 15-minute call and get your doubts answered by our experienced tax professionals.
          </p>
        </header>

        <div className="contact-booking-grid">
          {/* Left Column: Direct Contact & Highlights */}
          <div className="booking-poster-col">
            <div className="booking-highlight-card">
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
                  <strong>Call &amp; WhatsApp:</strong>
                  <a href="tel:+919014532499"><span role="img" aria-label="India">🇮🇳</span> +91 90145 32499</a>
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
                      placeholder="+91 90145 32499"
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
