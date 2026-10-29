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
    payoutPreference: 'Zelle / Direct Deposit',
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
            <h1>Refer a Colleague &amp; Earn $50</h1>
            <p>
              Share the convenience of professional, accurate US Form 1040 tax preparation with friends, colleagues, and family across all 50 states. 
              Earn <strong>$50</strong> credited via Zelle, PayPal, or Amazon Gift Card for every colleague who files their US taxes with us!
            </p>
          </div>
          <div className="hero-reward-card">
            <div className="reward-icon" style={{ fontSize: '32px', fontWeight: 800 }}>$</div>
            <div className="reward-amount">$50</div>
            <div className="reward-label">Per Successful US Tax Return</div>
            <div className="reward-sub">Zelle / PayPal / Gift Card</div>
          </div>
        </div>

        {/* 3 Step Process */}
        <div className="refer-steps">
          <div className="step-card">
            <div className="step-num">01</div>
            <Users className="step-icon" size={24} />
            <h4>Share Referral Details</h4>
            <p>Fill out the quick referral form below with your details and your colleague or friend's contact information.</p>
          </div>
          <div className="step-card">
            <div className="step-num">02</div>
            <Gift className="step-icon" size={24} />
            <h4>Our Tax Experts Guide &amp; Prepare</h4>
            <p>Our experienced tax team provides your colleague with a free 15-minute consultation, collects their documents, and prepares their return.</p>
          </div>
          <div className="step-card">
            <div className="step-num">03</div>
            <DollarSign className="step-icon" size={24} />
            <h4>Collect Your $50 Reward</h4>
            <p>Once your friend's return is finalized and e-filed, your $50 bonus is transferred immediately to your preferred payout account.</p>
          </div>
        </div>

        {/* Referral Form */}
        <div className="refer-form-card">
          <div className="card-header">
            <h3>Submit a US Tax Referral</h3>
            <p>Enter your details and the person you're referring. We'll reach out respectfully without spam.</p>
          </div>

          {submitted ? (
            <div className="refer-success" style={{ textAlign: 'center', padding: '40px 20px' }}>
              <CheckCircle2 size={48} className="text-primary" style={{ margin: '0 auto 16px', color: '#16a34a' }} />
              <h3>Referral Received!</h3>
              <p>Thank you for referring your colleague. We will get in touch with them promptly, and your $50 reward will be processed upon completion.</p>
              <button 
                className="btn btn-outline" 
                style={{ marginTop: '20px' }}
                onClick={() => setSubmitted(false)}
              >
                Refer Another Colleague
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="referral-form">
              <div className="form-split">
                <div className="split-col">
                  <h4>Your Information (For Reward Payout)</h4>
                  <div className="form-group">
                    <label>Your Full Legal Name *</label>
                    <input 
                      type="text" 
                      name="yourName" 
                      required 
                      value={formData.yourName} 
                      onChange={handleChange}
                      placeholder="e.g. Murali Krishna" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email Address *</label>
                    <input 
                      type="email" 
                      name="yourEmail" 
                      required 
                      value={formData.yourEmail} 
                      onChange={handleChange}
                      placeholder="e.g. yourname@example.com" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Your US Phone Number *</label>
                    <input 
                      type="tel" 
                      name="yourPhone" 
                      required 
                      value={formData.yourPhone} 
                      onChange={handleChange}
                      placeholder="e.g. +1 (901) 453-2499" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Preferred Reward Payout Method</label>
                    <select
                      name="payoutPreference"
                      value={formData.payoutPreference}
                      onChange={handleChange}
                    >
                      <option value="Zelle / Direct Deposit">Zelle (US Mobile / Email)</option>
                      <option value="PayPal Transfer">PayPal Account</option>
                      <option value="Amazon e-Gift Card">Amazon e-Gift Card</option>
                    </select>
                  </div>
                </div>

                <div className="split-col">
                  <h4>Colleague / Friend Being Referred</h4>
                  <div className="form-group">
                    <label>Friend's Full Name *</label>
                    <input 
                      type="text" 
                      name="friendName" 
                      required 
                      value={formData.friendName} 
                      onChange={handleChange}
                      placeholder="e.g. Alex Johnson" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Friend's Email Address *</label>
                    <input 
                      type="email" 
                      name="friendEmail" 
                      required 
                      value={formData.friendEmail} 
                      onChange={handleChange}
                      placeholder="e.g. alex@company.com" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Friend's Phone Number</label>
                    <input 
                      type="tel" 
                      name="friendPhone" 
                      value={formData.friendPhone} 
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 123-4567" 
                    />
                  </div>
                  <div className="form-group">
                    <label>Tax Situation Notes (Optional)</label>
                    <textarea 
                      name="notes" 
                      rows={3} 
                      value={formData.notes} 
                      onChange={handleChange}
                      placeholder="e.g. Relocated from CA to TX, has W-2 and stock options..." 
                    />
                  </div>
                </div>
              </div>

              <div className="form-footer">
                <button type="submit" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={18} /> Submit Referral &amp; Claim $50 Bonus
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
