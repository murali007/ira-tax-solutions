import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Video, Download } from 'lucide-react';
import { buildGoogleCalendarUrl, downloadIcsFile } from '../../lib/calendarHelper';
import './TaxpayerInfo.css';

export default function ScheduleTaxNotes() {
  const { token } = useAuth();
  const [taxYear, setTaxYear] = useState('Tax Year 2024 (Current Filing)');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 12:00 PM EST');
  const [meetingMode, setMeetingMode] = useState('Google Meet / Screen Share');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const json = await api.schedule.get(token);
        if (json && json.data) {
          setTaxYear(json.data.tax_year || 'Tax Year 2024 (Current Filing)');
          setPreferredDate(json.data.preferred_date || '');
          setPreferredTime(json.data.preferred_time || '11:00 AM - 12:00 PM EST');
          setNotes(json.data.notes || '');
        }
      } catch (e) {
        console.error('Error fetching schedule:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Please login to save tax consultation notes.');
      return;
    }

    try {
      await api.schedule.save({ 
        taxYear, 
        preferredDate, 
        preferredTime: `${preferredTime} [${meetingMode}]`, 
        notes 
      }, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save schedule notes.');
    }
  };

  const handleReset = () => {
    setNotes('');
    setPreferredDate('');
    setSavedSuccess(false);
  };

  if (loading) {
    return <div className="tax-form-wrapper" style={{ padding: '40px', textAlign: 'center' }}>Loading form...</div>;
  }

  return (
    <div className="tax-form-wrapper">
      <div className="tax-form-card">
        <div className="tax-form-title-row">
          <h2>Schedule for Tax Notes &amp; Consultation</h2>
          {savedSuccess && (
            <div className="saved-alert-pill">
              <CheckCircle2 size={15} />
              <span>Saved to Database</span>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="auth-error" style={{ marginBottom: '16px' }}>
            <AlertCircle size={15} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>US Tax Filing Year *</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)}>
                  <option value="Tax Year 2024 (Current Filing)">Tax Year 2024 (Filing Season 2026 - Current)</option>
                  <option value="Tax Year 2023 (Prior Year)">Tax Year 2023 (Prior Year Return)</option>
                  <option value="Tax Year 2022 (Prior Year)">Tax Year 2022 (Prior Year Return)</option>
                  <option value="Form 1040-X (Amended Return)">Form 1040-X (Amended US Return)</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Preferred Consultation Date</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Preferred Time Slot (US Time Zones)</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                  <option value="09:00 AM - 10:00 AM EST">09:00 AM - 10:00 AM EST (Eastern)</option>
                  <option value="11:00 AM - 12:00 PM EST">11:00 AM - 12:00 PM EST (Eastern)</option>
                  <option value="02:00 PM - 03:00 PM EST">02:00 PM - 03:00 PM EST (Eastern)</option>
                  <option value="04:00 PM - 05:00 PM EST">04:00 PM - 05:00 PM EST (Eastern)</option>
                  <option value="10:00 AM - 11:00 AM CST">10:00 AM - 11:00 AM CST (Central)</option>
                  <option value="02:00 PM - 03:00 PM CST">02:00 PM - 03:00 PM CST (Central)</option>
                  <option value="01:00 PM - 02:00 PM PST">01:00 PM - 02:00 PM PST (Pacific)</option>
                  <option value="04:00 PM - 05:00 PM PST">04:00 PM - 05:00 PM PST (Pacific)</option>
                  <option value="06:00 PM - 07:00 PM PST">06:00 PM - 07:00 PM PST (Evening)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-grid-3" style={{ marginTop: '16px' }}>
            <div className="input-field-group">
              <label>Meeting Format</label>
              <div className="input-with-icon">
                <Video size={15} className="field-icon" />
                <select value={meetingMode} onChange={(e) => setMeetingMode(e.target.value)}>
                  <option value="Google Meet / Screen Share">Google Meet / Screen Share</option>
                  <option value="Zoom Meeting">Zoom Video Conference</option>
                  <option value="Phone Call (+1 US Line)">Direct Phone Call (+1 US Line)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-field-group" style={{ marginTop: '20px' }}>
            <label>Specific Tax Questions &amp; Items to Highlight for Your Preparer</label>
            <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
              <FileText size={15} className="field-icon" style={{ marginTop: '10px' }} />
              <textarea
                rows={5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Example: I moved from California to Texas in June 2024, switched jobs with two W-2s, exercised ESPP/RSU shares, and have mortgage interest on Form 1098."
                style={{ width: '100%', padding: '10px 10px 10px 36px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', lineHeight: '1.5' }}
              />
            </div>
          </div>

          <div className="form-actions-bar" style={{ marginTop: '20px' }}>
            <button type="submit" className="btn-save-blue">
              Save Schedule Notes
            </button>
            <button type="button" onClick={handleReset} className="btn-reset-gray">
              Clear Notes
            </button>
          </div>
        </form>

        {/* 📅 Zero-API Google Calendar & iCalendar Action Card */}
        <div style={{
          marginTop: '28px',
          padding: '18px 20px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Calendar size={22} />
            </div>
            <div>
              <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                Sync Appointment to Your Personal Calendar
              </strong>
              <span style={{ fontSize: '12.5px', color: '#475569' }}>
                {preferredDate ? `${preferredDate} • ${preferredTime}` : 'Select your date & time above to generate your 1-click calendar invite'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <a 
              href={buildGoogleCalendarUrl({
                title: 'IRA Tax Consultation & Walkthrough',
                description: `IRA Tax Solutions Consultation\nTax Year: ${taxYear}\nTime: ${preferredTime}\nFormat: ${meetingMode}\nClient Notes: ${notes || 'Form 1040 Preparation'}`,
                dateStr: preferredDate,
                timeSlotStr: preferredTime,
                location: meetingMode
              })}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#0284c7',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '8px 14px',
                borderRadius: '6px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.25)'
              }}
            >
              <Calendar size={14} />
              <span>Add to Google Calendar</span>
            </a>

            <button 
              type="button"
              onClick={() => downloadIcsFile({
                title: 'IRA Tax Consultation & Walkthrough',
                description: `IRA Tax Solutions Consultation\nTax Year: ${taxYear}\nTime: ${preferredTime}\nFormat: ${meetingMode}`,
                dateStr: preferredDate,
                timeSlotStr: preferredTime,
                location: meetingMode
              })}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 600,
                padding: '7px 14px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Download .ics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
