import {
  User,
  Building,
  Globe,
  Users,
  ShieldAlert,
  FileEdit
} from 'lucide-react';
import './Services.css';

const services = [
  {
    icon: <User size={28} />,
    title: 'Salaried ITR Filing (ITR-1 Sahaj)',
    desc: 'Comprehensive filing for salaried employees with single or multiple Form 16s, house property income, interest earnings, and automated AIS/26AS reconciliation.',
  },
  {
    icon: <Building size={28} />,
    title: 'Capital Gains & Trading (ITR-2)',
    desc: 'Expert taxation for mutual funds, direct equities (STCG/LTCG), intraday & crypto/VDA assets, foreign stocks (RSU/ESOPs), and multiple house properties.',
  },
  {
    icon: <FileEdit size={28} />,
    title: 'Freelancers & Presumptive Tax (ITR-4)',
    desc: 'Simplified presumptive taxation under Section 44ADA & 44AD for software consultants, doctors, lawyers, creative designers, and small business owners.',
  },
  {
    icon: <Globe size={28} />,
    title: 'NRI Taxation & DTAA Relief',
    desc: 'Specialized NRI filing covering NRE/NRO accounts, Double Taxation Avoidance Agreement (DTAA u/s 90/91), Foreign Tax Credit (Form 67), and 15CA/CB certs.',
  },
  {
    icon: <ShieldAlert size={28} />,
    title: 'Notice Assistance & Defective ITR',
    desc: 'Dedicated CA support for resolving Section 143(1) intimations, Section 139(9) defective return notices, outstanding demand disputes, and AIS mismatches.',
  },
  {
    icon: <Users size={28} />,
    title: 'GST & Corporate Tax Compliance',
    desc: 'GST registration, monthly GSTR-1 & 3B returns, annual GSTR-9 audits, TDS return filing (24Q/26Q), and MCA compliance for private limited & LLP firms.',
  },
];

export default function Services() {
  return (
    <div className="clip-services-page">
      <div className="clip-services-container">
        {/* Header matching Clip 2 */}
        <header className="clip-services-header">
          <h1 className="clip-services-title">Our Core Services</h1>
          <p className="clip-services-subtitle">
            Having more than 20 Years of Professional Experience, We provide expert tax and advisory services to individuals and small businesses
          </p>
        </header>

        {/* 3x2 Grid matching Clip 2 */}
        <div className="clip-services-grid">
          {services.map((item, i) => (
            <div className="clip-service-card" key={i}>
              <div className="clip-service-icon-bubble">
                {item.icon}
              </div>
              <h3 className="clip-service-card-title">{item.title}</h3>
              <p className="clip-service-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
