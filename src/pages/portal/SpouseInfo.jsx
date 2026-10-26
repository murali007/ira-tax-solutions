import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, Info, HelpCircle, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

const BLANK_SPOUSE_STATE = {
  hasSpouse: 'yes',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  occupation: '',
  visaType: '',
  taxIdType: ''
};

export default function SpouseInfo() {
  const { token } = useAuth();
  const [formData, setFormData] = useState(BLANK_SPOUSE_STATE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpouse = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/spouse', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setFormData({
              hasSpouse: json.data.has_spouse || 'yes',
              firstName: json.data.first_name || '',
              middleName: json.data.middle_name || '',
              lastName: json.data.last_name || '',
              gender: json.data.gender || '',
              dob: json.data.dob || '',
              occupation: json.data.occupation || '',
              visaType: json.data.visa_type || '',
              taxIdType: json.data.tax_id_type || ''
            });
          }
        }
      } catch (e) {
        console.error('Error fetching spouse:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchSpouse();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setSavedSuccess(false);
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Please login to save spouse details.');
      return;
    }

    try {
      const res = await fetch('/api/spouse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to save spouse data.');
      }
    } catch {
      setErrorMessage('Network error saving spouse data.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all spouse fields?')) {
      setFormData(BLANK_SPOUSE_STATE);
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
          <h2>Spouse Information</h2>
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
          {/* Row 1: First Name, Middle Name, Last Name matching Clip 8 */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>First Name</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Middle Name</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  onChange={handleChange}
                  placeholder="Middle Name"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Last Name</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                />
              </div>
            </div>
          </div>

          {/* Row 2: Gender, Date of Birth, Occupation in USA */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Gender</label>
              <div className="radio-group-horizontal">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleChange}
                  />
                  Female
                </label>
              </div>
            </div>

            <div className="input-field-group">
              <label>Date of Birth</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="MM-DD-YYYY"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Occupation in USA</label>
              <div className="input-with-icon">
                <HelpCircle size={15} className="field-icon" />
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Occupation in USA"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Visa Type, Tax Id Type */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Visa Type</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                >
                  <option value="">Select Visa Type</option>
                  <option value="H-4">H-4</option>
                  <option value="H-1B">H-1B</option>
                  <option value="L-2">L-2</option>
                  <option value="F-2">F-2</option>
                  <option value="Green Card">Green Card</option>
                  <option value="US Citizen">US Citizen</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Tax Id Type</label>
              <div className="input-with-icon">
                <Edit3 size={15} className="field-icon" />
                <select
                  name="taxIdType"
                  value={formData.taxIdType}
                  onChange={handleChange}
                >
                  <option value="">Select Tax id type</option>
                  <option value="SSN">SSN</option>
                  <option value="ITIN">ITIN</option>
                  <option value="Need ITIN">Need to Apply for ITIN</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons matching Clip 8 */}
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
