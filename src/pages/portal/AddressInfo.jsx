import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { US_STATES } from './TaxpayerInfo';
import './TaxpayerInfo.css';

const BLANK_ADDRESS = {
  primaryStreet: '',
  primaryCity: '',
  primaryState: '',
  primaryZip: '',
  primaryStartDate: '',
  primaryEndDate: '',
  secondStreet: '',
  secondCity: '',
  secondState: '',
  secondZip: '',
  secondStartDate: '',
  secondEndDate: ''
};

export default function AddressInfo() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [movedDuringYear, setMovedDuringYear] = useState('no');
  const [addressData, setAddressData] = useState(BLANK_ADDRESS);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const json = await api.address.get(token);
        if (json && json.data) {
          setMovedDuringYear(json.data.moved_during_year || 'no');
          setAddressData({
            primaryStreet: json.data.primary_street || '',
            primaryCity: json.data.primary_city || '',
            primaryState: json.data.primary_state || '',
            primaryZip: json.data.primary_zip || '',
            primaryStartDate: json.data.primary_start || '',
            primaryEndDate: json.data.primary_end || '',
            secondStreet: json.data.second_street || '',
            secondCity: json.data.second_city || '',
            secondState: json.data.second_state || '',
            secondZip: json.data.second_zip || '',
            secondStartDate: json.data.second_start || '',
            secondEndDate: json.data.second_end || ''
          });
        }
      } catch (e) {
        console.error('Error fetching address:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchAddress();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Please login to save address.');
      return false;
    }

    try {
      await api.address.save({ addressData, movedDuringYear }, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      return true;
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save address.');
      return false;
    }
  };

  const handleSaveAndNext = async (e) => {
    e.preventDefault();
    const ok = await handleSave();
    if (ok) {
      navigate('/portal/upload');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all address fields?')) {
      setAddressData(BLANK_ADDRESS);
      setMovedDuringYear('no');
      setSavedSuccess(false);
      setErrorMessage('');
    }
  };

  if (loading) {
    return <div className="tax-form-wrapper" style={{ padding: '40px', textAlign: 'center' }}>Loading form...</div>;
  }

  return (
    <div className="tax-form-wrapper">
      <div className="tax-form-card">
        <div className="tax-form-title-row">
          <h2>Address Information &amp; Multi-State Residency</h2>
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

        <form onSubmit={handleSaveAndNext}>
          {/* Toggle: Did you live or work in multiple states? */}
          <div className="toggle-section-bar">
            <label className="toggle-lead-label">
              Did you live, work, or move across different US states during tax year 2024?
            </label>
            <div className="radio-group-horizontal">
              <label className="radio-label">
                <input
                  type="radio"
                  name="movedDuringYear"
                  value="yes"
                  checked={movedDuringYear === 'yes'}
                  onChange={() => setMovedDuringYear('yes')}
                />
                YES (Multi-State / Part-Year Resident Returns)
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="movedDuringYear"
                  value="no"
                  checked={movedDuringYear === 'no'}
                  onChange={() => setMovedDuringYear('no')}
                />
                NO (Lived in Single State all year)
              </label>
            </div>
          </div>

          {/* Section 1: Primary US Address */}
          <div className="address-block" style={{ marginTop: '20px' }}>
            <h3 style={{ fontSize: '15px', color: '#1e3a8a', fontWeight: 600, marginBottom: '14px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
              {movedDuringYear === 'yes' ? '1. Primary / Current US Residence' : 'Current US Residential Address'}
            </h3>

            <div className="form-grid-3">
              <div className="input-field-group">
                <label>Street Address (Include Apt / Suite #) *</label>
                <div className="input-with-icon">
                  <MapPin size={15} className="field-icon" />
                  <input
                    type="text"
                    name="primaryStreet"
                    value={addressData.primaryStreet}
                    onChange={handleChange}
                    placeholder="e.g. 742 Evergreen Terrace, Apt 4B"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>City *</label>
                <div className="input-with-icon">
                  <MapPin size={15} className="field-icon" />
                  <input
                    type="text"
                    name="primaryCity"
                    value={addressData.primaryCity}
                    onChange={handleChange}
                    placeholder="e.g. Memphis"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>State *</label>
                <div className="input-with-icon">
                  <MapPin size={15} className="field-icon" />
                  <select
                    name="primaryState"
                    value={addressData.primaryState}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select US State</option>
                    {US_STATES.map((st) => (
                      <option key={st.code} value={st.code}>{st.name} ({st.code})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-grid-3" style={{ marginTop: '14px' }}>
              <div className="input-field-group">
                <label>5-Digit ZIP Code *</label>
                <div className="input-with-icon">
                  <MapPin size={15} className="field-icon" />
                  <input
                    type="text"
                    name="primaryZip"
                    maxLength={10}
                    value={addressData.primaryZip}
                    onChange={handleChange}
                    placeholder="e.g. 38103"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Resided From Date</label>
                <div className="input-with-icon">
                  <Calendar size={15} className="field-icon" />
                  <input
                    type="date"
                    name="primaryStartDate"
                    value={addressData.primaryStartDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Resided To Date</label>
                <div className="input-with-icon">
                  <Calendar size={15} className="field-icon" />
                  <input
                    type="date"
                    name="primaryEndDate"
                    value={addressData.primaryEndDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Previous State Residence (Only if movedDuringYear === 'yes') */}
          {movedDuringYear === 'yes' && (
            <div className="address-block" style={{ marginTop: '28px', background: '#f8fafc', padding: '18px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '15px', color: '#b45309', fontWeight: 600, marginBottom: '14px', borderBottom: '1px solid #fde68a', paddingBottom: '6px' }}>
                2. Previous US Residence (For Part-Year State Apportionment)
              </h3>

              <div className="form-grid-3">
                <div className="input-field-group">
                  <label>Previous Street Address *</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondStreet"
                      value={addressData.secondStreet}
                      onChange={handleChange}
                      placeholder="e.g. 100 California St, Unit 12"
                      required={movedDuringYear === 'yes'}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Previous City *</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondCity"
                      value={addressData.secondCity}
                      onChange={handleChange}
                      placeholder="e.g. San Francisco"
                      required={movedDuringYear === 'yes'}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Previous State *</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <select
                      name="secondState"
                      value={addressData.secondState}
                      onChange={handleChange}
                      required={movedDuringYear === 'yes'}
                    >
                      <option value="">Select Previous State</option>
                      {US_STATES.map((st) => (
                        <option key={st.code} value={st.code}>{st.name} ({st.code})</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-grid-3" style={{ marginTop: '14px' }}>
                <div className="input-field-group">
                  <label>Previous ZIP Code *</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondZip"
                      maxLength={10}
                      value={addressData.secondZip}
                      onChange={handleChange}
                      placeholder="e.g. 94111"
                      required={movedDuringYear === 'yes'}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Moved In Date</label>
                  <div className="input-with-icon">
                    <Calendar size={15} className="field-icon" />
                    <input
                      type="date"
                      name="secondStartDate"
                      value={addressData.secondStartDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Move Out Date</label>
                  <div className="input-with-icon">
                    <Calendar size={15} className="field-icon" />
                    <input
                      type="date"
                      name="secondEndDate"
                      value={addressData.secondEndDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions-bar" style={{ marginTop: '24px' }}>
            <button type="submit" className="btn-save-blue">
              Save &amp; Continue to Upload Documents
            </button>
            <button type="button" onClick={handleSave} className="btn-reset-gray">
              Save Draft
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
