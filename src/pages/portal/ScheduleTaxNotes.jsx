import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

export default function ScheduleTaxNotes() {
  const { token } = useAuth();
  const [taxYear, setTaxYear] = useState('2025');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM - 12:00 PM EST');
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
        const res = await fetch('/api/schedule', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setTaxYear(json.data.tax_year || '2025');
            setPreferredDate(json.data.preferred_date || '');
            setPreferredTime(json.data.preferred_time || '11:00 AM - 12:00 PM EST');
            setNotes(json.data.notes || '');
          }
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
      setErrorMessage('Please login to save notes.');
      return;
    }

    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ taxYear, preferredDate, preferredTime, notes })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to save schedule notes.');
      }
    } catch {
      setErrorMessage('Network error saving schedule notes.');
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
          <h2>Schedule for Tax Notes</h2>
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
              <label>Tax Year for Filing</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)}>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="Amendment">Prior Year Amendment</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Preferred Review Call Date</label>
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
              <label>Preferred Time Slot</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                  <option value="09:00 AM - 10:00 AM EST">09:00 AM - 10:00 AM EST</option>
                  <option value="11:00 AM - 12:00 PM EST">11:00 AM - 12:00 PM EST</option>
                  <option value="02:00 PM - 03:00 PM EST">02:00 PM - 03:00 PM EST</option>
                  <option value="04:00 PM - 05:00 PM EST">04:00 PM - 05:00 PM EST</option>
                  <option value="07:00 PM - 08:00 PM EST">07:00 PM - 08:00 PM EST</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-field-group" style={{ marginTop: '16px' }}>
            <label>Tax Notes / Client Comments</label>
            <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
              <FileText size={15} className="field-icon" style={{ top: '10px' }} />
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any tax questions, special circumstances, or instructions for your CPA..."
              />
            </div>
          </div>

          <div className="form-actions-bar">
            <button type="submit" className="btn-save-blue">
              Save
            </button>
            <button type="button" onClick={handleReset} className="btn-reset-gray">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
