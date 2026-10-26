import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
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
        const res = await fetch('/api/address', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
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
      const res = await fetch('/api/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ addressData, movedDuringYear })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
        return true;
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to save address.');
        return false;
      }
    } catch {
      setErrorMessage('Network error saving address.');
      return false;
    }
  };

  const handleReset = () => {
    setAddressData(BLANK_ADDRESS);
    setMovedDuringYear('no');
    setSavedSuccess(false);
  };

  if (loading) {
    return <div className="tax-form-wrapper" style={{ padding: '40px', textAlign: 'center' }}>Loading address history...</div>;
  }

  return (
    <div className="tax-form-wrapper">
      <div className="tax-form-card">
        <div className="tax-form-title-row">
          <h2>Address of Living in Tax Year</h2>
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
          <h4 style={{ fontSize: '14px', color: '#37474f', marginBottom: '12px' }}>
            Primary / Initial Living Address
          </h4>

          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Street Address &amp; Apt</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="primaryStreet"
                  value={addressData.primaryStreet}
                  onChange={handleChange}
                  placeholder="Street Address"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>City</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="primaryCity"
                  value={addressData.primaryCity}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>State</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="primaryState"
                  value={addressData.primaryState}
                  onChange={handleChange}
                  placeholder="State"
                />
              </div>
            </div>
          </div>

          <div className="form-grid-3">
            <div className="input-field-group">
              <label>ZIP Code</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="primaryZip"
                  value={addressData.primaryZip}
                  onChange={handleChange}
                  placeholder="Zipcode"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Resided From</label>
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
              <label>Resided Until</label>
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

          <div style={{ margin: '16px 0', padding: '14px', background: '#f8fafc', borderRadius: '4px', border: '1px solid #eef2f6' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#37474f', display: 'block', marginBottom: '8px' }}>
              Did you live in another state during this tax year?
            </label>
            <div className="radio-group-horizontal" style={{ height: 'auto' }}>
              <label className="radio-label">
                <input
                  type="radio"
                  name="movedDuringYear"
                  value="no"
                  checked={movedDuringYear === 'no'}
                  onChange={() => setMovedDuringYear('no')}
                />
                No, single state resident all year
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="movedDuringYear"
                  value="yes"
                  checked={movedDuringYear === 'yes'}
                  onChange={() => setMovedDuringYear('yes')}
                />
                Yes, moved across states
              </label>
            </div>
          </div>

          {movedDuringYear === 'yes' && (
            <>
              <h4 style={{ fontSize: '14px', color: '#37474f', marginBottom: '12px', marginTop: '16px' }}>
                Secondary / Relocated Living Address
              </h4>

              <div className="form-grid-3">
                <div className="input-field-group">
                  <label>Street Address &amp; Apt</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondStreet"
                      value={addressData.secondStreet}
                      onChange={handleChange}
                      placeholder="Street Address"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>City</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondCity"
                      value={addressData.secondCity}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>State</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondState"
                      value={addressData.secondState}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                </div>
              </div>

              <div className="form-grid-3">
                <div className="input-field-group">
                  <label>ZIP Code</label>
                  <div className="input-with-icon">
                    <MapPin size={15} className="field-icon" />
                    <input
                      type="text"
                      name="secondZip"
                      value={addressData.secondZip}
                      onChange={handleChange}
                      placeholder="Zipcode"
                    />
                  </div>
                </div>

                <div className="input-field-group">
                  <label>Resided From</label>
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
                  <label>Resided Until</label>
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
            </>
          )}

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
