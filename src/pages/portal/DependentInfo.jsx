import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { User, Calendar, Users, Info, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import './TaxpayerInfo.css';

const BLANK_DEPENDENT = {
  id: 1,
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dob: '',
  relationship: '',
  visaType: '', // US Tax Credit Category (CTC $2,000 / ODC $500 / Daycare / Tuition)
  taxIdType: '', // Dependent SSN / ITIN
  days2025: '', // Months lived in US with taxpayer (0-12)
  days2024: '', // Full-time student (YES / NO)
  days2023: ''  // Provided >50% support (YES / NO)
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
        const json = await api.dependents.get(token);
        if (json && Array.isArray(json.data) && json.data.length > 0) {
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

  const handleSSNChange = (id, rawVal) => {
    let val = rawVal.replace(/\D/g, '');
    if (val.length > 9) val = val.substring(0, 9);
    let formatted = val;
    if (val.length > 5) {
      formatted = `${val.substring(0, 3)}-${val.substring(3, 5)}-${val.substring(5)}`;
    } else if (val.length > 3) {
      formatted = `${val.substring(0, 3)}-${val.substring(3)}`;
    }
    handleFieldChange(id, 'taxIdType', formatted);
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
      await api.dependents.save(dependents, token);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save dependents.');
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
          <h2>Dependent Information (US Child Tax Credit &amp; Other Dependents)</h2>
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
          <div className="empty-dependent-note" style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Users size={40} style={{ color: '#94a3b8', margin: '0 auto 12px' }} />
            <h4 style={{ color: '#334155', marginBottom: '8px' }}>No Dependents Claimed Yet</h4>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '520px', margin: '0 auto 20px', lineHeight: '1.5' }}>
              Add qualifying children under 17 for the <strong>$2,000 Child Tax Credit (CTC)</strong>, 
              college students for the <strong>American Opportunity Tax Credit</strong>, or elderly relatives for the <strong>$500 Credit for Other Dependents (ODC)</strong>.
            </p>
            <button
              type="button"
              onClick={handleAddDependent}
              className="btn-save-blue"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={16} /> Add First Dependent
            </button>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {dependents.map((dep, index) => (
              <div key={dep.id} className="dependent-block" style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', color: '#1e293b', fontWeight: 600 }}>
                    Dependent #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveDependent(dep.id)}
                    className="btn-remove-slot"
                    style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', padding: '4px 10px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>

                {/* Row 1: First Name, Middle Initial, Last Name */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>Dependent First Name *</label>
                    <div className="input-with-icon">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        value={dep.firstName}
                        onChange={(e) => handleFieldChange(dep.id, 'firstName', e.target.value)}
                        placeholder="First Name"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Middle Initial</label>
                    <div className="input-with-icon">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        value={dep.middleName}
                        onChange={(e) => handleFieldChange(dep.id, 'middleName', e.target.value)}
                        placeholder="Middle Initial"
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Dependent Last Name *</label>
                    <div className="input-with-icon">
                      <User size={15} className="field-icon" />
                      <input
                        type="text"
                        value={dep.lastName}
                        onChange={(e) => handleFieldChange(dep.id, 'lastName', e.target.value)}
                        placeholder="Last Name"
                        required
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
                    <label>Date of Birth (MM/DD/YYYY) *</label>
                    <div className="input-with-icon">
                      <Calendar size={15} className="field-icon" />
                      <input
                        type="text"
                        value={dep.dob}
                        onChange={(e) => handleFieldChange(dep.id, 'dob', e.target.value)}
                        placeholder="MM/DD/YYYY"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Relationship to Taxpayer *</label>
                    <div className="input-with-icon">
                      <Users size={15} className="field-icon" />
                      <select
                        value={dep.relationship}
                        onChange={(e) => handleFieldChange(dep.id, 'relationship', e.target.value)}
                        required
                      >
                        <option value="">Select Relationship</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Stepchild">Stepchild</option>
                        <option value="Foster Child">Foster Child</option>
                        <option value="Grandchild">Grandchild</option>
                        <option value="Brother / Sister">Brother / Sister</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Other Relative">Other Qualifying Relative</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 3: US Tax Credit Eligibility, SSN/ITIN, Months Lived in US */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>US Tax Credit Classification</label>
                    <div className="input-with-icon">
                      <Info size={15} className="field-icon" />
                      <select
                        value={dep.visaType}
                        onChange={(e) => handleFieldChange(dep.id, 'visaType', e.target.value)}
                      >
                        <option value="">Select Credit Category</option>
                        <option value="Child Tax Credit ($2,000)">Child Tax Credit (Under 17 - $2,000)</option>
                        <option value="Credit for Other Dependents ($500)">Credit for Other Dependents (17+ or Parent - $500)</option>
                        <option value="Child & Dependent Care Credit">Child &amp; Dependent Care Credit (Form 2441 Daycare)</option>
                        <option value="College Student (1098-T AOTC)">College Student (Form 1098-T Education Credit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Social Security Number (SSN) / ITIN *</label>
                    <div className="input-with-icon">
                      <Info size={15} className="field-icon" />
                      <input
                        type="text"
                        maxLength={11}
                        value={dep.taxIdType}
                        onChange={(e) => handleSSNChange(dep.id, e.target.value)}
                        placeholder="XXX-XX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Months Lived in US with You (2024)</label>
                    <div className="input-with-icon">
                      <Calendar size={15} className="field-icon" />
                      <select
                        value={dep.days2025}
                        onChange={(e) => handleFieldChange(dep.id, 'days2025', e.target.value)}
                      >
                        <option value="">Months (0-12)</option>
                        <option value="12">12 Months (Entire Year)</option>
                        <option value="11">11 Months</option>
                        <option value="10">10 Months</option>
                        <option value="9">9 Months</option>
                        <option value="8">8 Months</option>
                        <option value="7">7 Months (&gt; Half Year)</option>
                        <option value="6">6 Months</option>
                        <option value="5">5 Months</option>
                        <option value="Born in 2024">Born in 2024</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Row 4: Student status & Financial Support */}
                <div className="form-grid-3">
                  <div className="input-field-group">
                    <label>Was Dependent a Full-Time Student in 2024?</label>
                    <div className="radio-group-horizontal">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`student_${dep.id}`}
                          value="YES"
                          checked={dep.days2024 === 'YES'}
                          onChange={(e) => handleFieldChange(dep.id, 'days2024', e.target.value)}
                        />
                        YES (Under 24)
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`student_${dep.id}`}
                          value="NO"
                          checked={dep.days2024 === 'NO'}
                          onChange={(e) => handleFieldChange(dep.id, 'days2024', e.target.value)}
                        />
                        NO
                      </label>
                    </div>
                  </div>

                  <div className="input-field-group">
                    <label>Did You Provide &gt;50% of Financial Support?</label>
                    <div className="radio-group-horizontal">
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`support_${dep.id}`}
                          value="YES"
                          checked={dep.days2023 === 'YES'}
                          onChange={(e) => handleFieldChange(dep.id, 'days2023', e.target.value)}
                        />
                        YES (&gt;50% Support)
                      </label>
                      <label className="radio-label">
                        <input
                          type="radio"
                          name={`support_${dep.id}`}
                          value="NO"
                          checked={dep.days2023 === 'NO'}
                          onChange={(e) => handleFieldChange(dep.id, 'days2023', e.target.value)}
                        />
                        NO
                      </label>
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
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} /> Add Another Dependent
              </button>
            </div>

            {/* Action Buttons */}
            <div className="form-actions-bar">
              <button type="submit" className="btn-save-blue">
                Save Dependents
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
