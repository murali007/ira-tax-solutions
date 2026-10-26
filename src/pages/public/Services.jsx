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
    title: 'Individual Tax Filing',
    desc: 'Specialized in Planning, Preparation and Filing of Individual Tax Returns for Federal and all States including Gift, FATCA & FBAR(Form 1040/1040-NR)',
  },
  {
    icon: <Building size={28} />,
    title: 'Business Tax Filing',
    desc: 'Planning & Filing of Corporate Tax Returns for Federal and all States: 1065/1120/1120-S',
  },
  {
    icon: <Globe size={28} />,
    title: 'International Tax Filing',
    desc: 'Robust Experience in handling International Taxpayer Returns invoking Tax Treaties',
  },
  {
    icon: <Users size={28} />,
    title: 'Apply for ITIN',
    desc: 'Seamless and Effortless Procedure to get ITIN for Spouse and Dependents through US Tax Filer',
  },
  {
    icon: <ShieldAlert size={28} />,
    title: 'Audit Represenation',
    desc: "Our service & responsibility don't end with tax filing, we are open 365 days to assist in case of queries from tax agencies",
  },
  {
    icon: <FileEdit size={28} />,
    title: 'Amendments',
    desc: "Whether it's correcting errors, claiming overlooked deductions, or updating your filing status, our team of experts will guide you through every step",
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
