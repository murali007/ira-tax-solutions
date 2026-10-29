import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
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
  timeZone: 'EST',
  citizenship: '',
  ownHome: '',
  filingStatus: '',
  email: '',
  streetAddress: '',
  city: '',
  country: 'United States',
  state: '',
  zipCode: ''
};

export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'DC', name: 'District of Columbia' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' }, { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' }, { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' }, { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' }, { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' }, { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'PR', name: 'Puerto Rico' }, { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' }, { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' }, { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' }
];

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
        const json = await api.taxpayer.get(token);
        if (json && json.data) {
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
            timeZone: json.data.time_zone || 'EST',
            citizenship: json.data.citizenship || '',
            ownHome: json.data.own_home || '',
            filingStatus: json.data.filing_status || '',
            email: json.data.email || user?.email || '',
            streetAddress: json.data.street_address || '',
            city: json.data.city || '',
            country: json.data.country || 'United States',
            state: json.data.state || '',
            zipCode: json.data.zip_code || ''
          });
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

  // SSN / ITIN format helper XXX-XX-XXXX
  const handleSSNChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    let formatted = val;
    if (val.length > 5) {
      formatted = `${val.substring(0, 3)}-${val.substring(3, 5)}-${val.substring(5)}`;
    } else if (val.length > 3) {
      formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
    }
    setFormData(prev => ({ ...prev, ssnItin: formatted }));
    setSavedSuccess(false);
    setErrorMessage('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Please login to save your taxpayer profile.');
      return;
    }

    try {
      await api.taxpayer.save(formData, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save taxpayer profile.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear this form?')) {
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
        {/* Title Header with saved indicator */}
        <div className="tax-form-title-row">
          <h2>Taxpayer Information (Form 1040 Primary Filer)</h2>
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

        <form onSubmit={handleSave} className="taxpayer-form-grid">
          {/* Row 1: First Name, Middle Name, Last Name */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>First Name (As on SSN / ITIN Card) *</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Middle Initial / Name</label>
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
              <label>Last Name (Surname) *</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 2: Gender, Social Security Number / ITIN, Date of Birth */}
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
              <label>Social Security Number (SSN) / ITIN *</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <input
                  type="text"
                  name="ssnItin"
                  maxLength={11}
                  value={formData.ssnItin}
                  onChange={handleSSNChange}
                  placeholder="XXX-XX-XXXX"
                  required
                />
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
          </div>

          {/* Row 3: Current Employer, Occupation, Residency / Visa Status */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Current Employer / Company Name</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="Employer / Company Name"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Occupation / Profession</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                >
                  <option value="">- Select Occupation -</option>
                  <option value="Software Engineer / IT Professional">Software Engineer / IT Professional</option>
                  <option value="Manager / Corporate Executive">Manager / Corporate Executive</option>
                  <option value="Healthcare / Physician / Nurse">Healthcare / Physician / Nurse</option>
                  <option value="Finance / Accounting / Banking">Finance / Accounting / Banking</option>
                  <option value="1099 Independent Contractor / Consultant">1099 Independent Contractor / Consultant</option>
                  <option value="Small Business Owner (Schedule C)">Small Business Owner (Schedule C)</option>
                  <option value="Scientist / Researcher / Academic">Scientist / Researcher / Academic</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>US Residency / Visa Status</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                >
                  <option value="">Select Immigration Status</option>
                  <option value="U.S. Citizen">U.S. Citizen</option>
                  <option value="Permanent Resident (Green Card)">Permanent Resident (Green Card)</option>
                  <option value="H-1B Specialty Occupation">H-1B Specialty Occupation</option>
                  <option value="L-1 Intracompany Transferee">L-1 Intracompany Transferee</option>
                  <option value="F-1 / OPT / STEM OPT Student">F-1 / OPT / STEM OPT Student</option>
                  <option value="TN NAFTA Professional">TN NAFTA Professional</option>
                  <option value="O-1 Extraordinary Ability">O-1 Extraordinary Ability</option>
                  <option value="E-2 / E-3 Treaty Investor/Worker">E-2 / E-3 Treaty Investor/Worker</option>
                  <option value="Non-Resident Alien (Form 1040-NR)">Non-Resident Alien (Form 1040-NR)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: US Phone, Alternate Phone, Time Zone */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Phone Number (US Mobile) *</label>
              <div className="input-with-icon">
                <Phone size={15} className="field-icon" />
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="(XXX) XXX-XXXX"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Alternate Phone / WhatsApp</label>
              <div className="input-with-icon">
                <Phone size={15} className="field-icon" />
                <input
                  type="tel"
                  name="alternateNumber"
                  value={formData.alternateNumber}
                  onChange={handleChange}
                  placeholder="Alternate Contact Number"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>US Time Zone for Consultations</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                >
                  <option value="EST">Eastern Time (EST / EDT)</option>
                  <option value="CST">Central Time (CST / CDT)</option>
                  <option value="MST">Mountain Time (MST / MDT)</option>
                  <option value="PST">Pacific Time (PST / PDT)</option>
                  <option value="AKST">Alaska Time (AKST)</option>
                  <option value="HST">Hawaii Time (HST)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 5: US Filing Status, Own Home in US, Return Scope */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>US Tax Filing Status *</label>
              <div className="input-with-icon">
                <FileText size={15} className="field-icon" />
                <select
                  name="filingStatus"
                  value={formData.filingStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">- Select Filing Status -</option>
                  <option value="Single">Single</option>
                  <option value="Married Filing Jointly (MFJ)">Married Filing Jointly (MFJ)</option>
                  <option value="Married Filing Separately (MFS)">Married Filing Separately (MFS)</option>
                  <option value="Head of Household (HOH)">Head of Household (HOH)</option>
                  <option value="Qualifying Surviving Spouse (QSS)">Qualifying Surviving Spouse (QSS)</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Did You Own a Home in the US in 2024?</label>
              <div className="radio-group-horizontal">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ownHome"
                    value="YES"
                    checked={formData.ownHome === 'YES'}
                    onChange={handleChange}
                  />
                  YES (1098 Mortgage / Property Tax)
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="ownHome"
                    value="NO"
                    checked={formData.ownHome === 'NO'}
                    onChange={handleChange}
                  />
                  NO (Rented)
                </label>
              </div>
            </div>

            <div className="input-field-group">
              <label>Return Scope / Tax Situation</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="citizenship"
                  value={formData.citizenship}
                  onChange={handleChange}
                >
                  <option value="">- Select Return Scope -</option>
                  <option value="Standard W-2 Salaried">Standard W-2 Salaried Return</option>
                  <option value="W-2 + Stock / Crypto Investments">W-2 + Stock Options (RSU/ESPP) &amp; Crypto</option>
                  <option value="Self-Employed / 1099 (Schedule C)">Self-Employed / 1099 Contractor (Schedule C)</option>
                  <option value="Multi-State Moves &amp; Returns">Multi-State Tax Returns (Lived/Worked in 2+ States)</option>
                  <option value="Expat / Foreign Accounts (FBAR/FATCA)">Foreign Assets &amp; Bank Accounts (FBAR / Form 8938)</option>
                  <option value="Rental Real Estate (Schedule E)">Rental Real Estate Properties (Schedule E)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 6: Email, Street Address & Apt No., City */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Email (For IRS e-File Notifications) *</label>
              <div className="input-with-icon">
                <Mail size={15} className="field-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Primary Email Address"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>US Street Address (Including Apt / Suite) *</label>
              <div className="input-with-icon">
                <Edit3 size={15} className="field-icon" />
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. 1234 Main St, Apt 204"
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
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Memphis, San Jose, Dallas"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 7: Country, State, ZIP Code */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Country</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="country"
                  value={formData.country || 'United States'}
                  readOnly
                  style={{ background: '#f8fafc', color: '#475569' }}
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>State *</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="state"
                  value={formData.state}
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

            <div className="input-field-group">
              <label>5-Digit ZIP Code *</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="zipCode"
                  maxLength={10}
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="e.g. 38103 or 95112"
                  required
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions-bar">
            <button type="submit" className="btn-save-blue">
              Save Primary Filer Info
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
