import { useState } from 'react';
import { Gift, Users, DollarSign, Send, CheckCircle2 } from 'lucide-react';
import './Refer.css';

export default function Refer() {
  const [formData, setFormData] = useState({
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    friendName: '',
    friendEmail: '',
    friendPhone: '',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="refer-page">
      <div className="container">
        {/* Banner Section */}
        <div className="refer-hero">
          <div className="hero-content">
            <span className="badge">Partner &amp; Referral Program</span>
            <h1>Refer a Colleague &amp; Earn ₹500 via UPI</h1>
            <p>
              Share the convenience of CA-assisted ITR filing with colleagues, friends, and family across India. 
              Earn <strong>₹500</strong> credited straight to your UPI account for every successful return filed!
            </p>
          </div>
          <div className="hero-reward-card">
            <div className="reward-icon" style={{ fontSize: '28px', fontWeight: 800 }}>₹</div>
            <div className="reward-amount">₹500</div>
            <div className="reward-label">Per Successful ITR Referral</div>
            <div className="reward-sub">Direct UPI / Bank Transfer</div>
          </div>
        </div>

        {/* 3 Step Process */}
        <div className="refer-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <Users className="step-icon" size={24} />
            <h4>Share Contact Details</h4>
            <p>Fill out the quick referral form below with your UPI ID and your friend's contact information.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <Gift className="step-icon" size={24} />
            <h4>Our CAs Guide &amp; E-File</h4>
            <p>Our expert tax team contacts your friend, reconciles Form 16 &amp; AIS, and prepares their return.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <div className="step-icon" style={{ fontSize: '20px', fontWeight: 700, color: '#38b449' }}>₹</div>
            <h4>Instant Reward Transfer</h4>
            <p>As soon as their ITR-V acknowledgement is generated, ₹500 is sent directly to your UPI ID.</p>
          </div>
        </div>

        {/* Referral Form */}
        <div className="form-wrapper">
          <div className="refer-form-card">
            {submitted ? (
              <div className="success-message">
                <CheckCircle2 size={48} className="text-primary" />
                <h3>Thank You for the Referral!</h3>
                <p>
                  We have recorded your referral for <strong>{formData.friendName}</strong>. 
                  Our client onboarding specialist will contact them shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      yourName: '',
                      yourEmail: '',
                      yourPhone: '',
                      friendName: '',
                      friendEmail: '',
                      friendPhone: '',
                      notes: ''
                    });
                  }}
                  className="btn btn-outline"
                >
                  Refer Another Friend
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3>Submit a Referral</h3>
                <p className="form-subtext">Fields marked with an asterisk (*) are required</p>

                <div className="form-section">
                  <h4>Your Information (Referrer)</h4>
                  <div className="grid-3">
                    <div className="form-group">
                      <label>Your Name *</label>
                      <input
                        type="text"
                        name="yourName"
                        required
                        placeholder="Your full name"
                        value={formData.yourName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Email *</label>
                      <input
                        type="email"
                        name="yourEmail"
                        required
                        placeholder="yourname@example.com"
                        value={formData.yourEmail}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Your Phone Number</label>
                      <input
                        type="tel"
                        name="yourPhone"
                        placeholder="Phone number"
                        value={formData.yourPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Friend's Information (Referred Taxpayer)</h4>
                  <div className="grid-3">
                    <div className="form-group">
                      <label>Friend's Full Name *</label>
                      <input
                        type="text"
                        name="friendName"
                        required
                        placeholder="Friend's full name"
                        value={formData.friendName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Friend's Email *</label>
                      <input
                        type="email"
                        name="friendEmail"
                        required
                        placeholder="friend@example.com"
                        value={formData.friendEmail}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Friend's Phone *</label>
                      <input
                        type="tel"
                        name="friendPhone"
                        required
                        placeholder="Friend's phone number"
                        value={formData.friendPhone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Additional Notes / Specific Tax Concerns (Optional)</label>
                    <textarea
                      rows={3}
                      name="notes"
                      placeholder="e.g. Switched company recently, has Form 16 + capital gains in mutual funds..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  <Send size={16} />
                  Submit Referral
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
