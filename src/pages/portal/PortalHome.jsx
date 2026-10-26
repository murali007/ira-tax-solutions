import { Link } from 'react-router-dom';
import './PortalHome.css';

export default function PortalHome() {
  const stages = [
    {
      num: 1,
      title: 'Fill Basic Information Pages and Upload Relevant Tax Documents',
      link: '/portal/taxpayer',
      className: 'stage-item-orange'
    },
    {
      num: 2,
      title: 'Choose Your Convenient Time and Provide Additional Tax Information',
      link: '/portal/schedule',
      className: 'stage-item-teal'
    },
    {
      num: 3,
      title: 'Get Tax Summary and Pay Preparer Fees',
      link: '/portal/summary',
      className: 'stage-item-purple'
    },
    {
      num: 4,
      title: 'Review Your Tax Returns and Approve it for Filing',
      link: '/portal/download',
      className: 'stage-item-coral'
    },
    {
      num: 5,
      title: 'Tax Returns Are E-Filed/Paper-Filed',
      link: '/refund-status',
      className: 'stage-item-slate'
    }
  ];

  return (
    <div className="portal-welcome-page">
      <div className="welcome-headline-card">
        <h1>Welcome to IRATAXSOLUTIONS.COM</h1>
      </div>

      {/* 5 Stages Infographic matching Clip 5 */}
      <div className="stages-diagram-container">
        <div className="stages-diagram-inner">
          {/* Central Blue Hub */}
          <div className="diagram-hub-col">
            <div className="central-hub-circle">
              <span className="hub-large-num">5</span>
              <span className="hub-label-sub">Stages Of</span>
              <span className="hub-label-main">Tax Filing</span>
            </div>
          </div>

          {/* Connected Steps List */}
          <div className="diagram-steps-col">
            {stages.map((stage) => (
              <div key={stage.num} className="diagram-step-row">
                <div className="connecting-line-segment" />
                <div className="connecting-node-dot" />
                <Link to={stage.link} className={`stage-capsule-card ${stage.className}`}>
                  <div className="stage-circle-badge">
                    <span>{stage.num}</span>
                  </div>
                  <div className="stage-text-label">
                    {stage.title}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
