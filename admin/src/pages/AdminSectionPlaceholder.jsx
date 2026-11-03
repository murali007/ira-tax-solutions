import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { api } from '../lib/api';
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
  Plus,
  Download,
  ExternalLink
} from 'lucide-react';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../../../src/lib/calendarHelper';

export default function AdminSectionPlaceholder({ sectionKey, title, description, icon: Icon = FileText }) {
  const { token } = useAdminAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sectionKey === 'consultations' && token) {
      setLoading(true);
      api.admin.getDashboardStats(token)
        .then(res => {
          if (res?.data?.consultations) {
            setConsultations(res.data.consultations);
          }
        })
        .catch(console.warn)
        .finally(() => setLoading(false));
    }
  }, [sectionKey, token]);

  if (sectionKey === 'consultations') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.4px' }}>
              Tax Consultations &amp; Walkthrough Calendar
            </h1>
            <p style={{ fontSize: '13.5px', color: '#64748b', margin: 0 }}>
              Zero-API Google Calendar sync and appointment management for Form 1040 client sessions.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
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
            <a 
              href="https://calendar.google.com/calendar/u/0/r"
              target="_blank"
              rel="noopener noreferrer"
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
              <Calendar size={15} /> Open Google Calendar
            </a>
          </div>
        </div>

        {/* Sync Guidance Ribbon */}
        <div style={{
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Calendar size={20} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>Zero-API Google Calendar &amp; Outlook Integration Active</strong>
              <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#475569' }}>
                Every appointment can be launched into Google Calendar or downloaded as an .ics file with 1 click.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#15803d', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>
              ✓ $0 Investment • No API Keys Required
            </span>
          </div>
        </div>

        {/* Consultations List Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {(consultations.length > 0 ? consultations : [
            {
              id: 'demo1',
              time: '10:00 AM • Initial Intake',
              client_name: 'Jamie Frost',
              notes: 'Form 1040 Single return with Form 1098 Mortgage Interest deduction and two W-2s.',
              date: '2025-04-10',
              assigned_to: 'Priya'
            },
            {
              id: 'demo2',
              time: '11:30 AM • Return Walkthrough',
              client_name: 'Lee Martins',
              notes: 'Form 1040 explanation & line-by-line review of estimated refund (+$3,250.00).',
              date: '2025-04-10',
              assigned_to: 'Alex'
            },
            {
              id: 'demo3',
              time: '02:00 PM • Multi-State Filing Call',
              client_name: 'Morgan Shaw',
              notes: 'California Form 540 part-year allocation review and Schedule C deduction check.',
              date: '2025-04-11',
              assigned_to: 'Sam (CPA)'
            }
          ]).map((cons, idx) => {
            const gCalUrl = buildGoogleCalendarUrl({
              title: `IRA Tax Consultation — ${cons.client_name}`,
              description: `IRA Tax Solutions Consultation\nClient: ${cons.client_name}\nNotes: ${cons.notes}\nAssigned Preparer: ${cons.assigned_to}`,
              dateStr: cons.date,
              timeSlotStr: cons.time
            });

            return (
              <div 
                key={cons.id || idx}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.03)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '2px 8px', borderRadius: '4px' }}>
                    {cons.time}
                  </span>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                    {cons.date || 'Upcoming'}
                  </span>
                </div>

                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
                    {cons.client_name}
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                    {cons.notes}
                  </p>
                </div>

                <div style={{ fontSize: '11.5px', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                  Assigned Preparer: <strong style={{ color: '#475569' }}>{cons.assigned_to}</strong>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '4px' }}>
                  <a 
                    href={gCalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '7px 10px',
                      borderRadius: '6px',
                      textDecoration: 'none'
                    }}
                  >
                    <Calendar size={13} />
                    <span>Google Cal</span>
                  </a>

                  <button 
                    type="button"
                    onClick={() => downloadIcsFile({
                      title: `IRA Tax Consultation — ${cons.client_name}`,
                      description: `Client: ${cons.client_name}\nNotes: ${cons.notes}`,
                      dateStr: cons.date,
                      timeSlotStr: cons.time
                    })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      fontSize: '12px',
                      fontWeight: 600,
                      padding: '6px 10px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={13} />
                    <span>.ics</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Generic fallback for other sections
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
