import { useState } from 'react';
import { Mail, Phone, Clock, Send, CheckCircle2, Calendar, MessageSquare, Shield, HelpCircle, Users } from 'lucide-react';
import poster3Img from '../../assets/posters/poster3-booking.jpg';
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
          {/* Left Column: Authentic Poster 3 Feature */}
          <div className="booking-poster-col">
            <div className="poster-frame-card">
              <img 
                src={poster3Img} 
                alt="Poster 3 - Let's Make Tax Filing Simple: Book a Free 15-Minute Consultation" 
                className="poster-img-booking"
              />
            </div>

            {/* Direct Contact Block */}
            <div className="direct-contact-pill-card">
              <h4>Direct Support Channels</h4>
              <div className="direct-item">
                <Phone size={18} className="text-green" />
                <div>
                  <strong>Call &amp; WhatsApp:</strong>
                  <a href="tel:+919014532499">+91 90145 32499</a>
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
                  A confirmation invitation has been dispatched to <strong>{formData.email}</strong>. Our US tax preparer looks forward to speaking with you!
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
                    <label>Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Tax Situation / Needs *</label>
                    <select
                      value={formData.taxSituation}
                      onChange={(e) => setFormData({ ...formData, taxSituation: e.target.value })}
                    >
                      <option value="W-2 Employee">W-2 Salaried Employee</option>
                      <option value="1099 / Self-Employed">1099 Freelancer / Self-Employed (Schedule C)</option>
                      <option value="Family & Dependents">Family &amp; Child Tax Credit Filings</option>
                      <option value="Investments & Crypto">Stocks, Crypto &amp; Capital Gains (Schedule D)</option>
                      <option value="Multi-State Return">Multi-State Tax Filings</option>
                      <option value="FBAR / Expat Tax">International / FBAR (FinCEN 114) &amp; Form 8938</option>
                      <option value="Other / Notice">IRS Notice / General Question</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Consultation Date</label>
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Time Zone *</label>
                    <select
                      value={formData.timeZone}
                      onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                    >
                      <option value="EST (Eastern Time)">EST (Eastern Time - New York/Atlanta)</option>
                      <option value="CST (Central Time)">CST (Central Time - Chicago/Dallas)</option>
                      <option value="MST (Mountain Time)">MST (Mountain Time - Denver/Phoenix)</option>
                      <option value="PST (Pacific Time)">PST (Pacific Time - Los Angeles/Seattle)</option>
                      <option value="Other / International">Other / Expat Time Zone</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Preferred Time Slot</label>
                  <select
                    value={formData.timeSlot}
                    onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                  >
                    <option value="Morning (9:00 AM - 12:00 PM)">Morning (9:00 AM - 12:00 PM)</option>
                    <option value="Afternoon (12:00 PM - 4:00 PM)">Afternoon (12:00 PM - 4:00 PM)</option>
                    <option value="Evening (4:00 PM - 8:00 PM)">Evening (4:00 PM - 8:00 PM)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>What specific questions would you like to discuss?</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your tax questions or documents you have..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full booking-submit-btn">
                  <Calendar size={18} />
                  Book Your Free 15-Minute Consultation
                </button>
                <p className="no-obligation-note">
                  🔒 No obligation. Your information is 100% confidential under IRS rules.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
