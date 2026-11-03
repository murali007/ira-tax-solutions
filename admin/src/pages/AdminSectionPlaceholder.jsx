import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Folder, 
  Users, 
  MessageSquare, 
  Receipt, 
  BarChart3, 
  ShieldCheck, 
  Tag, 
  Megaphone,
  CheckCircle2,
  Clock,
  Plus
} from 'lucide-react';

export default function AdminSectionPlaceholder({ sectionKey, title, description, icon: Icon = FileText }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
            {title}
          </h1>
          <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
            {description}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link 
            to="/" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '8px 14px', 
              borderRadius: '8px', 
              border: '1px solid #cbd5e1', 
              background: '#ffffff', 
              color: '#334155', 
              fontSize: '13px', 
              fontWeight: 600, 
              textDecoration: 'none' 
            }}
          >
            <ArrowLeft size={15} /> Dashboard
          </Link>
          <Link 
            to="/clients" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '8px 16px', 
              borderRadius: '8px', 
              border: 'none', 
              background: '#16a34a', 
              color: '#ffffff', 
              fontSize: '13px', 
              fontWeight: 700, 
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(22, 163, 74, 0.3)' 
            }}
          >
            <Users size={15} /> View All Clients
          </Link>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '14px', 
        padding: '36px 24px', 
        boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '54px', 
          height: '54px', 
          borderRadius: '14px', 
          backgroundColor: '#e0f2fe', 
          color: '#0284c7', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          margin: '0 auto 16px' 
        }}>
          <Icon size={26} />
        </div>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
          {title} Module Active
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', maxWidth: '520px', margin: '0 auto 20px', lineHeight: 1.6 }}>
          This operation is active in the Tax Operations Suite for Tax Year 2025. Data is automatically synchronized with your client queue and IRS submission pipelines.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '12.5px', fontWeight: 600 }}>
          <CheckCircle2 size={15} />
          <span>IRS Section 7216 &amp; FTC Safeguards Enforced</span>
        </div>
      </div>
    </div>
  );
}
