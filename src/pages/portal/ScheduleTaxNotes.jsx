import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle, Video } from 'lucide-react';
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
                placeholder="Example: I moved from California to Texas in June 2024, switched jobs with two W-2s, exercised ESPP/RSU shares, and have a high-yield savings account (1099-INT) plus an Indian bank account for FBAR reporting."
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
      </div>
    </div>
  );
}
