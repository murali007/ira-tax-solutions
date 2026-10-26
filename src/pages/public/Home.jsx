import { Link } from 'react-router-dom';
import { PhoneCall, ThumbsUp, TrendingUp } from 'lucide-react';
import heroTaxForms from '../../assets/hero-tax-forms.png';
import './Home.css';

const features = [
  {
    num: '01',
    icon: <PhoneCall size={26} />,
    title: '24/7 Support',
    desc: 'Committed to providing the highest level of service and support. Teams of skilled tax experts available round the clock during tax season.',
  },
  {
    num: '02',
    icon: <ThumbsUp size={26} />,
    title: '100% Customer Satisfaction',
    desc: 'Customer satisfaction remains our top priority and we are committed to maintain it. Our mission is simple: 100% Customer Satisfaction.',
  },
  {
    num: '03',
    icon: <TrendingUp size={26} />,
    title: 'Unlimited Tax Advice',
    desc: 'Optimize your tax strategies year-round, not just during tax season, get expert tax planning advices year-round at no additional cost.',
  },
];

export default function Home() {
  return (
    <div className="clip-home-root">
      {/* Hero Section matching Clip 1 */}
      <section className="clip-hero-section">
        <div className="clip-hero-inner">
          <div className="clip-hero-text-col">
            <span className="clip-eyebrow">INCOME TAX (ITR), TDS</span>
            <h1 className="clip-heading">&amp; GST Filing in India</h1>
            <p className="clip-subtext">
              Maximum Tax Savings &amp; Guaranteed Accuracy With Expert Chartered Accountant (CA) Assistance At The Most Affordable Fees
            </p>
            <div className="clip-hero-buttons">
              <Link to="/contact" className="clip-btn-green">
                GET IN TOUCH
              </Link>
              <Link to="/services" className="clip-btn-outline">
                LEARN MORE
              </Link>
            </div>
          </div>

          {/* Exact Tax Document Collage matching Reference Image */}
          <div className="clip-hero-graphic-col" aria-hidden="true">
            <img 
              src={heroTaxForms} 
              alt="Tax Return Forms Graphic (Form 1040, Form 1120, Form 1065)" 
              className="exact-hero-tax-img" 
            />
          </div>
        </div>
      </section>

      {/* 3 Numbered Feature Columns matching Clip 1 */}
      <section className="clip-features-section">
        <div className="clip-features-inner">
          {features.map((f) => (
            <div className="clip-feature-item" key={f.num}>
              <div className="clip-feature-badge-col">
                <span className="clip-num-bubble">{f.num}</span>
                <div className="clip-icon-box">
                  {f.icon}
                </div>
              </div>
              <div className="clip-feature-desc-col">
                <h3 className="clip-feature-title">{f.title}</h3>
                <p className="clip-feature-p">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
