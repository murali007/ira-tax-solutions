import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import './Contact.css';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
          <span className="badge">Get in Touch</span>
          <h1>Contact Our Tax Experts</h1>
          <p>
            Have questions about federal, state, or foreign asset filings? 
            Our dedicated team is ready to assist you.
          </p>
        </header>

        <div className="contact-grid">
          {/* Contact Details Card */}
          <div className="contact-info-card">
            <h3>Office & Support Information</h3>
            <p className="info-intro">
              Reach out directly by phone, email, or schedule an in-depth tax consultation.
            </p>

            <div className="info-items">
              <div className="info-item">
                <Phone className="item-icon" size={20} />
                <div>
                  <strong>Phone Lines</strong>
                  <p>USA Direct: +1 (470) 444-8100 Ext: 102</p>
                  <p>India Office: +91 91211 57586</p>
                  <p>WhatsApp Support: +91 72070 57471</p>
                </div>
              </div>

              <div className="info-item">
                <Mail className="item-icon" size={20} />
                <div>
                  <strong>Email Inquiries</strong>
                  <p>contact@irataxsolutions.com</p>
                  <p>support@irataxsolutions.com</p>
                </div>
              </div>

              <div className="info-item">
                <MapPin className="item-icon" size={20} />
                <div>
                  <strong>Corporate Headquarters</strong>
                  <p>12000 Findley Road, Suite 250</p>
                  <p>Johns Creek, GA 30097, USA</p>
                </div>
              </div>

              <div className="info-item">
                <Clock className="item-icon" size={20} />
                <div>
                  <strong>Business Hours</strong>
                  <p>Tax Season: 24/7 Round-the-Clock Support</p>
                  <p>Off-Season: Mon - Fri, 9:00 AM - 6:00 PM EST</p>
                </div>
              </div>
            </div>

            <div className="map-placeholder">
              <span>Interactive Map Location (Johns Creek, GA Office)</span>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div className="success-box">
                <CheckCircle2 size={48} className="text-primary" />
                <h3>Message Received!</h3>
                <p>
                  Thank you for contacting IRA Tax Solutions, <strong>{formData.name}</strong>.
                  A tax specialist will respond to <strong>{formData.email}</strong> within 1 business day.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                  }}
                  className="btn btn-outline"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Send Us a Message</h3>
                <p className="form-subtext">Fill out this form and we will get back to you promptly.</p>

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Number</label>
                    <input
                      type="tel"
                      placeholder="+1 (470) 444-8100"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject / Tax Year</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025 Tax Filing Inquiry / FBAR Guidance"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Briefly describe your tax inquiry or schedule request..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <Send size={16} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
