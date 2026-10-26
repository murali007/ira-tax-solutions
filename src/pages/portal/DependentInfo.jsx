import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Calendar, Users, Info, Edit3, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

const BLANK_DEPENDENT = {
  id: 1,
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  relationship: '',
  visaType: '',
  taxIdType: '',
  days2025: '',
  days2024: '',
  days2023: ''
};

export default function DependentInfo() {
  const { token } = useAuth();
  const [dependents, setDependents] = useState([]);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDependents = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/dependents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json.data) && json.data.length > 0) {
            setDependents(
              json.data.map(d => ({
                id: d.id,
                firstName: d.first_name || '',
                middleName: d.middle_name || '',
                lastName: d.last_name || '',
                gender: d.gender || '',
                dob: d.dob || '',
                relationship: d.relationship || '',
                visaType: d.visa_type || '',
                taxIdType: d.tax_id_type || '',
                days2025: d.days_2025 || '',
                days2024: d.days_2024 || '',
                days2023: d.days_2023 || ''
              }))
            );
          }
        }
      } catch (e) {
        console.error('Error fetching dependents:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchDependents();
  }, [token]);

  const handleFieldChange = (id, field, value) => {
    setDependents(prev =>
      prev.map(dep => dep.id === id ? { ...dep, [field]: value } : dep)
    );
    setSavedSuccess(false);
    setErrorMessage('');
  };

  const handleAddDependent = () => {
    const newId = dependents.length > 0 ? Math.max(...dependents.map(d => d.id)) + 1 : 1;
    setDependents(prev => [...prev, { ...BLANK_DEPENDENT, id: newId }]);
  };

  const handleRemoveDependent = (id) => {
    setDependents(prev => prev.filter(dep => dep.id !== id));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Please login to save dependent records.');
      return;
    }

    try {
      const res = await fetch('/api/dependents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ dependents })
      });

      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      } else {
        const err = await res.json();
        setErrorMessage(err.error || 'Failed to save dependents.');
      }
    } catch {
      setErrorMessage('Network error saving dependents.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Clear all dependent fields?')) {
      setDependents([]);
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
          <h2>Dependent Information</h2>
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

        {dependents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px' }}>
            <Users size={38} style={{ color: '#90a4ae', margin: '0 auto 12px' }} />
            <h4 style={{ fontSize: '16px', color: '#37474f', marginBottom: '6px' }}>
              No Dependents Added
            </h4>
            <p style={{ color: '#78909c', fontSize: '13px', maxWidth: '420px', margin: '0 auto 20px' }}>
              Click the button below to add details for your spouse/children or qualifying dependents.
            </p>
            <button
              type="button"
              onClick={handleAddDependent}
              className="btn-save-blue"
            >
              <Plus size={15} /> Add Dependent
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {dependents.map((dep, index) => (
              <div key={dep.id} style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #eef2f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <strong style={{ fontSize: '14px', color: '#37474f' }}>
                    Dependent #{index + 1}
                  </strong>
                  <button
                    type="button"
                    onClick={() => handleRemoveDependent(dep.id)}
                    style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                {/* Row 1: First Name, Middle Name, Last Name matching Clip 9 */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>First Name</label>
                    <div className="input-with-icon">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        value={dep.firstName}
                        onChange={(e) => handleFieldChange(dep.id, 'firstName', e.target.value)}
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
                        value={dep.middleName}
                        onChange={(e) => handleFieldChange(dep.id, 'middleName', e.target.value)}
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
                        value={dep.lastName}
                        onChange={(e) => handleFieldChange(dep.id, 'lastName', e.target.value)}
                        placeholder="Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 2: Gender, Date of Birth, Relationship */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>Gender</label>
                    <div className="radio-group-horizontal">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`gender_${dep.id}`}
                          value="Male"
                          checked={dep.gender === 'Male'}
                          onChange={(e) => handleFieldChange(dep.id, 'gender', e.target.value)}
                        />
                        Male
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`gender_${dep.id}`}
                          value="Female"
                          checked={dep.gender === 'Female'}
                          onChange={(e) => handleFieldChange(dep.id, 'gender', e.target.value)}
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
                        value={dep.dob}
                        onChange={(e) => handleFieldChange(dep.id, 'dob', e.target.value)}
                        placeholder="DD-MM-YYYY"
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Relationship</label>
                    <div className="input-with-icon">
                      <Users size={15} className="field-icon" />
                      <select
                        value={dep.relationship}
                        onChange={(e) => handleFieldChange(dep.id, 'relationship', e.target.value)}
                      >
                        <option value="">Select Relationship</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Father">Father (Senior Citizen)</option>
                        <option value="Mother">Mother (Senior Citizen)</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Other">Other Dependent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 3: Tax Deduction Category, PAN, Aadhaar */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>Tax Benefit Category</label>
                    <div className="input-with-icon">
                      <Info size={15} className="field-icon" />
                      <select
                        value={dep.visaType}
                        onChange={(e) => handleFieldChange(dep.id, 'visaType', e.target.value)}
                      >
                        <option value="">Select Deduction Type</option>
                        <option value="Sec 80C Child Tuition">Child Tuition Fees (Sec 80C)</option>
                        <option value="Sec 80D Parents Medical">Parents Medical Insurance (Sec 80D up to ₹50k)</option>
                        <option value="Sec 80DD Disability">Differently Abled Dependent (Sec 80DD)</option>
                        <option value="General Dependent">General Dependent</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>PAN (Optional if Minor)</label>
                    <div className="input-with-icon">
                      <Edit3 size={15} className="field-icon" />
                      <input
                        type="text"
                        maxLength={10}
                        value={dep.taxIdType}
                        onChange={(e) => handleFieldChange(dep.id, 'taxIdType', e.target.value.toUpperCase())}
                        placeholder="e.g. ABCDE1234F"
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Aadhaar Number (12 Digits)</label>
                    <div className="input-with-icon">
                      <Edit3 size={15} className="field-icon" />
                      <input
                        type="text"
                        maxLength={12}
                        value={dep.days2025}
                        onChange={(e) => handleFieldChange(dep.id, 'days2025', e.target.value)}
                        placeholder="12-digit Aadhaar Number"
                      />
                    </div>
                  </div>
                </div>

                {/* Row 4: Annual Expenditure / Deduction amounts in INR */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>Annual Medical Insurance Premium Paid (₹)</label>
                    <div className="input-with-icon">
                      <Info size={15} className="field-icon" />
                      <input
                        type="number"
                        value={dep.days2024}
                        onChange={(e) => handleFieldChange(dep.id, 'days2024', e.target.value)}
                        placeholder="e.g. 25000"
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>School/College Tuition Fees Paid (₹ - Sec 80C)</label>
                    <div className="input-with-icon">
                      <Info size={15} className="field-icon" />
                      <input
                        type="number"
                        value={dep.days2023}
                        onChange={(e) => handleFieldChange(dep.id, 'days2023', e.target.value)}
                        placeholder="e.g. 60000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div style={{ marginBottom: '20px' }}>
              <button
                type="button"
                onClick={handleAddDependent}
                className="btn-reset-gray"
              >
                <Plus size={14} /> Add Another Dependent
              </button>
            </div>

            {/* Action Buttons matching Clip 9 */}
            <div className="form-actions-bar">
              <button type="submit" className="btn-save-blue">
                Save
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
