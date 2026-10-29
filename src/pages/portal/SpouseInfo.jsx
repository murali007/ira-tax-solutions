import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { User, Calendar, Info, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

const BLANK_SPOUSE_STATE = {
  hasSpouse: 'yes',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  occupation: '',
  visaType: '', // used for Spouse SSN/ITIN
  taxIdType: '' // used for Spouse Visa/Residency Status
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
        const json = await api.spouse.get(token);
        if (json && json.data) {
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

  const handleSSNChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    let formatted = val;
    if (val.length > 5) {
      formatted = `${val.substring(0, 3)}-${val.substring(3, 5)}-${val.substring(5)}`;
    } else if (val.length > 3) {
      formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
    }
    setFormData(prev => ({ ...prev, visaType: formatted }));
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
      await api.spouse.save(formData, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save spouse data.');
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
          <h2>Spouse Information (Form 1040 Joint Filer)</h2>
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

        {/* Radio toggle: Has Spouse */}
        <div className="toggle-section-bar">
          <label className="toggle-lead-label">Are you married or filing jointly?</label>
          <div className="radio-group-horizontal">
            <label className="radio-label">
              <input
                type="radio"
                name="hasSpouse"
                value="yes"
                checked={formData.hasSpouse === 'yes'}
                onChange={handleChange}
              />
              YES (Married Filing Jointly / Separately)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="hasSpouse"
                value="no"
                checked={formData.hasSpouse === 'no'}
                onChange={handleChange}
              />
              NO (Single / Head of Household)
            </label>
          </div>
        </div>

        {formData.hasSpouse === 'no' ? (
          <div className="empty-dependent-note" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <p style={{ color: '#64748b', fontSize: '15px' }}>
              You indicated Single or Head of Household status. Spouse details are not required for your Form 1040 return.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="taxpayer-form-grid" style={{ marginTop: '20px' }}>
            {/* Row 1: First Name, Middle Initial, Last Name */}
            <div className="form-grid-3">
              <div className="input-field-group">
                <label>Spouse First Name (As on SSN / ITIN Card) *</label>
                <div className="input-with-icon">
                  <User size={15} className="field-icon" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Spouse First Name"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Spouse Middle Initial / Name</label>
                <div className="input-with-icon">
                  <User size={15} className="field-icon" />
                  <input
                    type="text"
                    name="middleName"
                    value={formData.middleName}
                    onChange={handleChange}
                    placeholder="Middle Initial / Name"
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Spouse Last Name (Surname) *</label>
                <div className="input-with-icon">
                  <User size={15} className="field-icon" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Spouse Last Name"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Gender, Date of Birth, Occupation */}
            <div className="form-grid-3">
              <div className="input-field-group">
                <label>Gender</label>
                <div className="radio-group-horizontal">
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
                </div>
              </div>

              <div className="input-field-group">
                <label>Date of Birth (MM/DD/YYYY) *</label>
                <div className="input-with-icon">
                  <Calendar size={15} className="field-icon" />
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Spouse Occupation / Employment Status</label>
                <div className="input-with-icon">
                  <HelpCircle size={15} className="field-icon" />
                  <select
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                  >
                    <option value="">- Select Occupation -</option>
                    <option value="Salaried Employee (W-2)">Salaried Employee (W-2)</option>
                    <option value="Self-Employed / Freelancer (1099)">Self-Employed / Freelancer (1099)</option>
                    <option value="Small Business Owner">Small Business Owner</option>
                    <option value="Homemaker">Homemaker</option>
                    <option value="Student">Student</option>
                    <option value="Retired">Retired</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Spouse SSN/ITIN, Spouse Residency/Visa Status */}
            <div className="form-grid-3">
              <div className="input-field-group">
                <label>Spouse Social Security Number (SSN) / ITIN *</label>
                <div className="input-with-icon">
                  <Info size={15} className="field-icon" />
                  <input
                    type="text"
                    name="visaType"
                    maxLength={11}
                    value={formData.visaType}
                    onChange={handleSSNChange}
                    placeholder="XXX-XX-XXXX"
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Spouse US Residency / Visa Status</label>
                <div className="input-with-icon">
                  <Info size={15} className="field-icon" />
                  <select
                    name="taxIdType"
                    value={formData.taxIdType}
                    onChange={handleChange}
                  >
                    <option value="">Select Immigration Status</option>
                    <option value="U.S. Citizen">U.S. Citizen</option>
                    <option value="Permanent Resident (Green Card)">Permanent Resident (Green Card)</option>
                    <option value="H-1B Worker">H-1B Worker</option>
                    <option value="H-4 / H-4 EAD Dependent">H-4 / H-4 EAD Dependent</option>
                    <option value="L-1 / L-2 Transferee/Dependent">L-1 / L-2 Transferee/Dependent</option>
                    <option value="F-1 / F-2 Student/Dependent">F-1 / F-2 Student/Dependent</option>
                    <option value="ITIN Holder (Non-Resident/Dependent)">ITIN Holder (Non-Resident/Dependent)</option>
                    <option value="Applying for ITIN (Form W-7)">Applying for ITIN (Form W-7)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="form-actions-bar">
              <button type="submit" className="btn-save-blue">
                Save Spouse Details
              </button>
              <button type="button" onClick={handleReset} className="btn-reset-gray">
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
