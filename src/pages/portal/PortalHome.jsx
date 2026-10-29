import { Link } from 'react-router-dom';
import './PortalHome.css';

export default function PortalHome() {
  const stages = [
    {
      num: 1,
      title: 'Share Documents: Upload W-2, 1099s & Tax Questionnaire through Our Secure Vault',
      link: '/portal/upload',
      className: 'stage-item-orange'
    },
    {
      num: 2,
      title: 'We Prepare: Detailed Form 1040 Preparation with Quality & Deduction Checks',
      link: '/portal/taxpayer',
      className: 'stage-item-teal'
    },
    {
      num: 3,
      title: 'Separate Review: In-Depth QA Review by a Second Experienced Tax Specialist',
      link: '/portal/schedule',
      className: 'stage-item-purple'
    },
    {
      num: 4,
      title: 'We Explain: Walkthrough of Your Federal & State Computations in Plain English',
      link: '/portal/summary',
      className: 'stage-item-coral'
    },
    {
      num: 5,
      title: 'We File: Official IRS & State E-Filing with Direct Acceptance Confirmation',
      link: '/portal/download',
      className: 'stage-item-slate'
    }
  ];

  return (
    <div className="portal-welcome-page">
      <div className="welcome-headline-card">
        <h1>Welcome to IRATAXSOLUTIONS.COM</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
          Your Global Tax Partner — Professional &amp; Personalized Form 1040 Preparation.
        </p>
      </div>

      {/* 5 Stages Infographic matching Brand Card 5 */}
      <div className="stages-diagram-container">
        <div className="stages-diagram-inner">
          {/* Central Blue Hub */}
          <div className="diagram-hub-col">
            <div className="central-hub-circle">
              <span className="hub-large-num">5</span>
              <span className="hub-label-sub">Stages Of</span>
              <span className="hub-label-main">US Tax Filing</span>
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
