import { useState } from 'react';
import { Gift, Users, DollarSign, Send, CheckCircle2, Award, ArrowRight } from 'lucide-react';
import './Refer.css';

export default function Refer() {
  const [formData, setFormData] = useState({
    yourName: '',
    yourEmail: '',
    yourPhone: '',
    friendName: '',
    friendEmail: '',
    friendPhone: '',
    payoutPreference: 'Direct Bank Transfer',
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
        {/* Banner Section - Split Layout with Referral Image on Right */}
        <div className="refer-hero">
          <div className="hero-content">
            <span className="badge">Partner &amp; Referral Program</span>
            <h1>Refer a Colleague &amp; Earn $20</h1>
            <p>
              Share the convenience of professional, accurate US Form 1040 tax preparation with colleagues, friends, and family across all 50 states. 
              Earn <strong>$20</strong> for every colleague who files their US taxes with us!
            </p>
            <div className="refer-hero-benefits">
              <div className="refer-benefit-point">
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                <span>Unlimited referrals — earn $20 for every completed return</span>
              </div>
              <div className="refer-benefit-point">
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                <span>Prompt digital payouts via Direct Bank Transfer or Zelle</span>
              </div>
              <div className="refer-benefit-point">
                <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                <span>Your referred colleagues receive an initial free consultation</span>
              </div>
            </div>
          </div>

          <div className="refer-hero-visual-col">
            <div className="refer-visual-card">
              <img
                src="/referral-friends.jpg"
                alt="Two friendly professional colleagues celebrating referral reward"
                className="refer-colleagues-img"
              />
              <div className="refer-floating-reward-badge">
                <Gift size={24} style={{ color: '#22c55e' }} />
                <div>
                  <div className="reward-badge-amount">$20 Reward</div>
                  <div className="reward-badge-sub">Per Successful Referral</div>
                </div>
              </div>
            </div>
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
            <h4>Collect Your $20 Reward</h4>
            <p>Once your friend's return is finalized and e-filed, your $20 reward is processed promptly to your preferred account.</p>
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
              <p>Thank you for referring your colleague. We will get in touch with them promptly, and your $20 reward will be processed upon completion.</p>
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
                      placeholder="e.g. John Doe"
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
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Phone / WhatsApp Number *</label>
                    <input 
                      type="tel" 
                      name="yourPhone" 
                      required 
                      value={formData.yourPhone} 
                      onChange={handleChange} 
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Reward Payout Preference</label>
                    <select 
                      name="payoutPreference" 
                      value={formData.payoutPreference} 
                      onChange={handleChange}
                    >
                      <option value="Direct Bank Transfer">Direct Bank Transfer</option>
                      <option value="Zelle">Zelle (US Bank Account)</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Amazon e-Gift Card">Amazon e-Gift Card</option>
                    </select>
                  </div>
                </div>

                <div className="split-col">
                  <h4>Colleague / Friend Being Referred</h4>
                  <div className="form-group">
                    <label>Their Full Name *</label>
                    <input 
                      type="text" 
                      name="friendName" 
                      required 
                      value={formData.friendName} 
                      onChange={handleChange} 
                      placeholder="e.g. Jane Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label>Their Email Address *</label>
                    <input 
                      type="email" 
                      name="friendEmail" 
                      required 
                      value={formData.friendEmail} 
                      onChange={handleChange} 
                      placeholder="jane@company.com"
                    />
                  </div>
                  <div className="form-group">
                    <label>Their Phone Number</label>
                    <input 
                      type="tel" 
                      name="friendPhone" 
                      value={formData.friendPhone} 
                      onChange={handleChange} 
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="form-group">
                    <label>Additional Notes / Filing Situation</label>
                    <textarea 
                      name="notes" 
                      rows={3} 
                      value={formData.notes} 
                      onChange={handleChange} 
                      placeholder="e.g. W-2 employee with multi-state moves, tech stock options, or visa status..."
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions" style={{ marginTop: '24px', textAlign: 'center' }}>
                <button type="submit" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '15px', fontWeight: 700, background: '#22c55e', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <Send size={16} /> Submit Referral &amp; Register Reward
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
