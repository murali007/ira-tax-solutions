import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ExternalLink } from 'lucide-react';
import './About.css';

const whyUs = [
  {
    icon: <Calendar size={28} />,
    title: 'Open All The Year',
    desc: "Our responsibility don't end with just tax filing. We are open round the year and always at your service in case of queries from tax agencies",
  },
  {
    icon: <Users size={28} />,
    title: 'Complementary Services',
    desc: 'Offer free services like Extension, W4, FBAR & India Tax Filing as a token of gratitude. This is our way of saying thank you for being a valued part of our success',
  },
  {
    icon: <DollarSign size={28} />,
    title: 'Transparent Pricing',
    desc: 'Competitive pricing without compromising on quality. No Hidden Fees & Clear Cost Breakdown through tax estimates',
  },
];

const resources = [
  {
    id: 1,
    title: 'Check Your Federal and State Refund Status',
    category: 'Refund Tracker',
    link: '/refund-status'
  },
  {
    id: 2,
    title: 'Pay Federal and State Taxes Online',
    category: 'Direct Government Payments',
    link: 'https://www.irs.gov/payments'
  },
  {
    id: 3,
    title: 'Apply ITIN for Yourself, Spouse or Dependents',
    category: 'Form W-7 Guidance',
    link: '/services'
  },
  {
    id: 4,
    title: 'Record Keeping Management',
    category: 'Tax Compliance & Bookkeeping',
    link: '/services'
  },
];

export default function About() {
  return (
    <div className="clip-about-page">
      {/* 1. Why Us Section matching Clip 3 */}
      <section className="clip-why-section">
        <div className="clip-why-container">
          <div className="clip-why-split">
            {/* Left Dark Image Banner */}
            <div className="clip-why-left-banner">
              <div className="clip-why-banner-content">
                <span className="banner-small-why">Why</span>
                <span className="banner-bold-brand">UsTaxFiler</span>
                <p className="banner-subtext">
                  Witness our Masterful Experience on Tax Strategies and Filing of Individual and Business Tax Returns.
                </p>
              </div>
            </div>

            {/* Right 3 Cards matching Clip 3 */}
            <div className="clip-why-cards-col">
              {whyUs.map((item, idx) => (
                <div key={idx} className="clip-why-card">
                  <div className="clip-why-icon-bubble">
                    {item.icon}
                  </div>
                  <h3 className="clip-why-card-title">{item.title}</h3>
                  <div className="title-divider-line" />
                  <p className="clip-why-card-p">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Proven Track Record Section matching Clip 3 */}
      <section className="clip-track-record-section">
        <div className="clip-track-container">
          <h2 className="clip-track-heading">Our Proven Track Record</h2>
          <div className="clip-track-divider" />
          <div className="clip-track-content-row">
            <div className="clip-track-text">
              <p>
                UsTaxFiler is a leading tax consulting firm with a proven track record of delivering exceptional results. 
                Our team of experienced tax professionals has helped numerous clients navigate complex tax regulations 
                and optimize their tax positions for both Federal and All-State jurisdictions.
              </p>
              <p>
                With deep specialized domain knowledge in dual-status returns, foreign income tax treaties, FBAR/FATCA compliance, 
                and multi-state wage allocations, we ensure that every deduction and credit you qualify for is accurately captured.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Resources Section matching Clip 4 */}
      <section className="clip-resources-section">
        <div className="clip-resources-container">
          <h2 className="clip-resources-heading">Resources</h2>
          <div className="clip-resources-grid">
            {resources.map((res) => (
              <div key={res.id} className="clip-resource-box">
                <div className="resource-visual-header">
                  <span className="resource-category-tag">{res.category}</span>
                </div>
                <div className="resource-body">
                  <h4 className="resource-title">{res.title}</h4>
                  {res.link.startsWith('http') ? (
                    <a href={res.link} target="_blank" rel="noopener noreferrer" className="resource-link-btn">
                      Visit Official Portal <ExternalLink size={12} />
                    </a>
                  ) : (
                    <Link to={res.link} className="resource-link-btn">
                      Explore Resource →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
