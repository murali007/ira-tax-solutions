import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Info, 
  Clock, 
  Edit3,
  FileText,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import './TaxpayerInfo.css';

const BLANK_STATE = {
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  ssnItin: '',
  dob: '',
  employer: '',
  occupation: '',
  visaType: '',
  contactNumber: '',
  alternateNumber: '',
  timeZone: 'PST',
  citizenship: '',
  ownHome: '',
  filingStatus: '',
  email: '',
  streetAddress: '',
  city: '',
  country: '',
  state: '',
  zipCode: ''
};

export default function TaxpayerInfo() {
  const { token, user } = useAuth();
  const [formData, setFormData] = useState(BLANK_STATE);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxpayer = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/taxpayer', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setFormData({
              firstName: json.data.first_name || '',
              middleName: json.data.middle_name || '',
              lastName: json.data.last_name || '',
              gender: json.data.gender || '',
              ssnItin: json.data.ssn_itin || '',
              dob: json.data.dob || '',
              employer: json.data.employer || '',
              occupation: json.data.occupation || '',
              visaType: json.data.visa_type || '',
              contactNumber: json.data.contact_number || '',
              alternateNumber: json.data.alternate_number || '',
              timeZone: json.data.time_zone || 'PST',
              citizenship: json.data.citizenship || '',
              ownHome: json.data.own_home || '',
              filingStatus: json.data.filing_status || '',
              email: json.data.email || user?.email || '',
              streetAddress: json.data.street_address || '',
              city: json.data.city || '',
              country: json.data.country || '',
              state: json.data.state || '',
              zipCode: json.data.zip_code || ''
            });
          }
        }
      } catch (e) {
        console.error('Failed to load taxpayer record:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchTaxpayer();
  }, [token, user]);

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
      setErrorMessage('Please login to save to database.');
      return;
    }

    try {
      const res = await fetch('/api/taxpayer', {
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
        setErrorMessage(err.error || 'Failed to save to database.');
      }
    } catch {
      setErrorMessage('Network error saving to database.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all fields in this form?')) {
      setFormData(BLANK_STATE);
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
          <h2>Taxpayer Information</h2>
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
          {/* Row 1: First Name, Middle Name, Last Name */}
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

          {/* Row 2: Gender, SSN/ITIN, Date of Birth */}
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
              <label>SSN/ITIN</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <input
                  type="text"
                  name="ssnItin"
                  value={formData.ssnItin}
                  onChange={handleChange}
                  placeholder="SSN/ITIN"
                />
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
          </div>

          {/* Row 3: Current Employer, Occupation in USA, Visa Type */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Current Employer</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="Current Employer"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Occupation in USA</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="Occupation in USA"
                />
              </div>
            </div>

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
                  <option value="H-1B">H-1B</option>
                  <option value="L-1">L-1</option>
                  <option value="F-1">F-1</option>
                  <option value="B-1/B-2">B-1/B-2</option>
                  <option value="Green Card">Green Card</option>
                  <option value="US Citizen">US Citizen</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Contact Number, Alternate Number, Time Zone */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Contact Number</label>
              <div className="input-with-icon">
                <Phone size={15} className="field-icon" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="Contact Number"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Alternate Number</label>
              <div className="input-with-icon">
                <Phone size={15} className="field-icon" />
                <input
                  type="tel"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  placeholder="Alternate Number"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Time Zone</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                >
                  <option value="PST">PST</option>
                  <option value="EST">EST</option>
                  <option value="CST">CST</option>
                  <option value="MST">MST</option>
                  <option value="IST">IST</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 5: Country of Citizenship, Own a Home in USA?, Filing Status */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Country of Citizenship</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Own A Home in USA?</label>
              <div className="radio-group-horizontal">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ownHome"
                    value="YES"
                    checked={formData.ownHome === 'YES'}
                    onChange={handleChange}
                  />
                  YES
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ownHome"
                    value="NO"
                    checked={formData.ownHome === 'NO'}
                    onChange={handleChange}
                  />
                  NO
                </label>
              </div>
            </div>

            <div className="input-field-group">
              <label>Filing Status</label>
              <div className="input-with-icon">
                <FileText size={15} className="field-icon" />
                <select
                  name="filingStatus"
                  value={formData.filingStatus}
                  onChange={handleChange}
                >
                  <option value="">- Select -</option>
                  <option value="Single">Single</option>
                  <option value="Married Filing Jointly">Married Filing Jointly</option>
                  <option value="Married Filing Separately">Married Filing Separately</option>
                  <option value="Head of Household">Head of Household</option>
                  <option value="Qualifying Widow">Qualifying Widow</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 6: Email, Street Address & Apt No., City */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Email</label>
              <div className="input-with-icon">
                <Mail size={15} className="field-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Street Address &amp; Apt No.</label>
              <div className="input-with-icon">
                <Edit3 size={15} className="field-icon" />
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="Address"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>City</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Country, State, ZIP/PIN Code */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Country</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select Country</option>
                  <option value="United States">United States</option>
                  <option value="India">India</option>
                  <option value="Canada">Canada</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>State</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  <option value="CA">California (CA)</option>
                  <option value="GA">Georgia (GA)</option>
                  <option value="TX">Texas (TX)</option>
                  <option value="NY">New York (NY)</option>
                  <option value="WA">Washington (WA)</option>
                  <option value="NJ">New Jersey (NJ)</option>
                  <option value="IL">Illinois (IL)</option>
                  <option value="Other">Other State</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>ZIP/PIN Code</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="Zipcode"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons matching Clip 7 */}
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
