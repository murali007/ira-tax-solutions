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

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi (NCR)', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Chandigarh', 'Jammu & Kashmir', 'Ladakh', 'Puducherry', 'Other UT'
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
      await api.taxpayer.save(formData, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save to database.');
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

          {/* Row 2: Gender, PAN Number, Date of Birth */}
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
              <label>Permanent Account Number (PAN) *</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <input
                  type="text"
                  name="ssnItin"
                  maxLength={10}
                  value={formData.ssnItin}
                  onChange={(e) => setFormData({ ...formData, ssnItin: e.target.value.toUpperCase() })}
                  placeholder="e.g. ABCDE1234F"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Date of Birth (As per PAN/Aadhaar) *</label>
              <div className="input-with-icon">
                <Calendar size={15} className="field-icon" />
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  placeholder="DD-MM-YYYY"
                  required
                />
              </div>
            </div>
          </div>

          {/* Row 3: Current Employer, Nature of Employment, Residential Status */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Current Employer / Business Entity</label>
              <div className="input-with-icon">
                <User size={15} className="field-icon" />
                <input
                  type="text"
                  name="employer"
                  value={formData.employer}
                  onChange={handleChange}
                  placeholder="Company / Business Name"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Nature of Employment / Profession</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                >
                  <option value="">- Select Category -</option>
                  <option value="Salaried (Private Sector)">Salaried (Private Sector)</option>
                  <option value="Salaried (Central/State Govt)">Salaried (Central/State Govt)</option>
                  <option value="Salaried (PSU)">Salaried (PSU)</option>
                  <option value="Professional (IT / Doctor / CA / Lawyer)">Professional (IT / Doctor / CA / Lawyer)</option>
                  <option value="Business / Proprietary Concern">Business / Proprietary Concern</option>
                  <option value="Freelancer / Consultant (Sec 44ADA)">Freelancer / Consultant (Sec 44ADA)</option>
                  <option value="Pensioner / Senior Citizen">Pensioner / Senior Citizen</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>Residential Status (Section 6)</label>
              <div className="input-with-icon">
                <Info size={15} className="field-icon" />
                <select
                  name="visaType"
                  value={formData.visaType}
                  onChange={handleChange}
                >
                  <option value="">Select Residential Status</option>
                  <option value="Resident &amp; Ordinarily Resident (ROR)">Resident &amp; Ordinarily Resident (ROR)</option>
                  <option value="Resident but Not Ordinarily Resident (RNOR)">Resident but Not Ordinarily Resident (RNOR)</option>
                  <option value="Non-Resident Indian (NRI)">Non-Resident Indian (NRI)</option>
                  <option value="OCI / Foreign Citizen">OCI / Foreign Citizen</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 4: Mobile Number (Aadhaar linked), Alternate Number, Preferred Tax Regime */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Mobile Number (Aadhaar-Linked for OTP) *</label>
              <div className="input-with-icon">
                <Phone size={15} className="field-icon" />
                <input
                  type="tel"
                  name="contactNumber"
                  maxLength={10}
                  value={formData.contactNumber}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Alternate Mobile / WhatsApp</label>
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
              <label>Preferred Tax Regime</label>
              <div className="input-with-icon">
                <Clock size={15} className="field-icon" />
                <select
                  name="timeZone"
                  value={formData.timeZone}
                  onChange={handleChange}
                >
                  <option value="New Regime">New Tax Regime u/s 115BAC (Default)</option>
                  <option value="Old Regime">Old Tax Regime (With Deductions)</option>
                  <option value="CA Evaluate">Let CA Choose Maximum Tax Savings</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 5: Aadhaar Number, Own House Property?, ITR Form */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Aadhaar Number (12 Digits) *</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="citizenship"
                  maxLength={12}
                  value={formData.citizenship}
                  onChange={handleChange}
                  placeholder="12-digit Aadhaar Number"
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Own House Property in India?</label>
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
              <label>ITR Form Type</label>
              <div className="input-with-icon">
                <FileText size={15} className="field-icon" />
                <select
                  name="filingStatus"
                  value={formData.filingStatus}
                  onChange={handleChange}
                >
                  <option value="">- Select ITR Form -</option>
                  <option value="ITR-1 (Sahaj)">ITR-1 (Sahaj - Salaried)</option>
                  <option value="ITR-2 (Capital Gains / RSUs)">ITR-2 (Capital Gains &amp; Stocks)</option>
                  <option value="ITR-3 (Business &amp; Trading)">ITR-3 (Business / F&amp;O Trading)</option>
                  <option value="ITR-4 (Sugam - Presumptive)">ITR-4 (Sugam - Presumptive)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 6: Email, Street Address & Apt No., City */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Email (For Income Tax Dept Notice &amp; OTP)</label>
              <div className="input-with-icon">
                <Mail size={15} className="field-icon" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Official Email Address"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Flat / Door No., Premises &amp; Locality</label>
              <div className="input-with-icon">
                <Edit3 size={15} className="field-icon" />
                <input
                  type="text"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  placeholder="e.g. Flat 402, Royal Residency, Road No 10"
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>City / Town / District</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Hyderabad / Bengaluru"
                />
              </div>
            </div>
          </div>

          {/* Row 7: Country, State, PIN Code */}
          <div className="form-grid-3">
            <div className="input-field-group">
              <label>Country</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="country"
                  value={formData.country || 'India'}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                  <option value="United States">United States (NRI)</option>
                  <option value="United Kingdom">United Kingdom (NRI)</option>
                  <option value="UAE / Middle East">UAE / Middle East (NRI)</option>
                  <option value="Singapore">Singapore (NRI)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>State / Union Territory *</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select State / UT</option>
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="input-field-group">
              <label>PIN Code (6 Digits) *</label>
              <div className="input-with-icon">
                <MapPin size={15} className="field-icon" />
                <input
                  type="text"
                  name="zipCode"
                  maxLength={6}
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="e.g. 500081"
                  required
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
