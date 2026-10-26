import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { Calendar, Clock, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

export default function ScheduleTaxNotes() {
  const { token } = useAuth();
  const [taxYear, setTaxYear] = useState('AY 2025-26');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:30 AM - 12:30 PM IST');
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
          setTaxYear(json.data.tax_year || 'AY 2025-26');
          setPreferredDate(json.data.preferred_date || '');
          setPreferredTime(json.data.preferred_time || '11:30 AM - 12:30 PM IST');
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
      setErrorMessage('Please login to save notes.');
      return;
    }

    try {
      await api.schedule.save({ taxYear, preferredDate, preferredTime, notes }, token);
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
              <label>Assessment Year (AY) for Filing</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <select value={taxYear} onChange={(e) => setTaxYear(e.target.value)}>
                  <option value="AY 2025-26">AY 2025-26 (FY 2024-25 - Current)</option>
                  <option value="AY 2024-25">AY 2024-25 (FY 2023-24)</option>
                  <option value="AY 2023-24">AY 2023-24 (FY 2022-23)</option>
                  <option value="ITR-U 139(8A)">Updated Return u/s 139(8A) [ITR-U]</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Preferred CA Call Date</label>
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
              <label>Preferred Time Slot (IST)</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}>
                  <option value="10:00 AM - 11:00 AM IST">10:00 AM - 11:00 AM IST</option>
                  <option value="11:30 AM - 12:30 PM IST">11:30 AM - 12:30 PM IST</option>
                  <option value="02:30 PM - 03:30 PM IST">02:30 PM - 03:30 PM IST</option>
                  <option value="04:30 PM - 05:30 PM IST">04:30 PM - 05:30 PM IST</option>
                  <option value="07:00 PM - 08:00 PM IST">07:00 PM - 08:00 PM IST (Evening)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="input-field-group" style={{ marginTop: '16px' }}>
            <label>Tax Notes / Queries for Chartered Accountant (CA)</label>
            <div className="input-with-icon" style={{ alignItems: 'flex-start' }}>
              <FileText size={15} className="field-icon" style={{ top: '10px' }} />
              <textarea
                rows={6}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any queries regarding New vs Old Tax Regime, Form 10E for salary arrears, 80C/80D investments, mutual funds capital gains, or specific instructions for your Chartered Accountant..."
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
