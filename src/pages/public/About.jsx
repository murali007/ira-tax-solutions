import { Link } from 'react-router-dom';
import { Calendar, Users, DollarSign, ExternalLink } from 'lucide-react';
import './About.css';

const whyUs = [
  {
    icon: <Calendar size={28} />,
    title: 'Open 365 Days a Year',
    desc: "Our responsibility doesn't end with just ITR filing. We are available year-round to assist with Income Tax Department intimations, AIS discrepancies, and revised returns.",
  },
  {
    icon: <Users size={28} />,
    title: 'Complimentary Tax Checks',
    desc: 'Get free Form 26AS review, AIS/TIS data check, Old vs New Tax Regime comparisons, and advance tax estimations as part of our client-first advisory model.',
  },
  {
    icon: <DollarSign size={28} />,
    title: 'Transparent Indian Pricing',
    desc: 'Upfront fee structure in Indian Rupees (₹) with no hidden charges. Clear invoices with GST input tax credit for eligible business and consulting clients.',
  },
];

const resources = [
  {
    id: 1,
    title: 'Check Your Income Tax Refund Status (CPC Bangalore)',
    category: 'Govt Refund Tracker',
    link: '/refund-status'
  },
  {
    id: 2,
    title: 'Pay Income Tax & Advance Tax Online (Challan 280 / e-Pay Tax)',
    category: 'Govt e-Pay Tax Portal',
    link: 'https://eportal.incometax.gov.in/iec/foservices/#/e-pay-tax-prelogin/user-details'
  },
  {
    id: 3,
    title: 'View & Download Form 26AS / AIS on TRACES',
    category: 'TRACES TDS Portal',
    link: 'https://contents.tdscpc.gov.in/'
  },
  {
    id: 4,
    title: 'GST Portal & Annual Return Filing (CBIC)',
    category: 'GST Compliance',
    link: 'https://www.gst.gov.in/'
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
                <span className="banner-bold-brand">IRATaxSolutions</span>
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
                IRATaxSolutions is a premier Indian tax advisory firm powered by qualified Chartered Accountants (ICAI members) 
                and authorized E-Return Intermediaries (ERIs). We deliver end-to-end tax compliance for salaried professionals, 
                tech workers with global RSUs, freelancers, and businesses under the Income Tax Act, 1961.
              </p>
              <p>
                With deep specialized domain knowledge in Chapter VI-A deductions, Section 87A tax rebates, Section 115BAC New Tax Regime 
                optimization, capital gains indexation, and DTAA foreign tax credits (Form 67), we ensure every legal tax exemption is claimed accurately.
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
