-- ========================================================
-- IRATaxSolutions — Complete PostgreSQL Database Schema for Supabase
-- Run this in your Supabase project's SQL Editor (supabase.com)
-- ========================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  file_no TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Profile Created',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Taxpayer Information Table
CREATE TABLE IF NOT EXISTS taxpayer_info (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  gender TEXT,
  ssn_itin TEXT,          -- Stores PAN (Permanent Account Number e.g. ABCDE1234F)
  dob TEXT,               -- Date of birth (DD-MM-YYYY)
  employer TEXT,          -- Company / Entity Name
  occupation TEXT,        -- Salaried, Professional, Business, etc.
  visa_type TEXT,         -- Residential Status (ROR, RNOR, NRI)
  contact_number TEXT,    -- Aadhaar linked mobile
  alternate_number TEXT,  -- Alternate / WhatsApp mobile
  time_zone TEXT,         -- Preferred Tax Regime (New vs Old)
  citizenship TEXT,       -- Aadhaar Number (12 Digits)
  own_home TEXT,          -- YES / NO
  filing_status TEXT,     -- ITR-1, ITR-2, ITR-3, ITR-4
  email TEXT,
  street_address TEXT,
  city TEXT,
  country TEXT DEFAULT 'India',
  state TEXT,             -- Indian State / UT
  zip_code TEXT,          -- 6-digit Indian PIN Code
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Spouse Information Table
CREATE TABLE IF NOT EXISTS spouse_info (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  has_spouse TEXT DEFAULT 'yes',
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  gender TEXT,
  dob TEXT,
  occupation TEXT,
  visa_type TEXT,         -- Spouse PAN Number
  tax_id_type TEXT,       -- Spouse Aadhaar Number
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Dependents Table
CREATE TABLE IF NOT EXISTS dependents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  gender TEXT,
  dob TEXT,
  relationship TEXT,
  visa_type TEXT,         -- Deduction category (80C, 80D, etc.)
  tax_id_type TEXT,       -- Dependent PAN
  days_2025 TEXT,         -- Dependent Aadhaar
  days_2024 TEXT,         -- Medical insurance premium paid (₹)
  days_2023 TEXT,         -- Tuition fees paid (₹)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Schedule & CA Review Notes Table
CREATE TABLE IF NOT EXISTS schedule_notes (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tax_year TEXT DEFAULT 'AY 2025-26',
  preferred_date TEXT,
  preferred_time TEXT,
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Address Residency History Table
CREATE TABLE IF NOT EXISTS address_history (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  moved_during_year TEXT DEFAULT 'no',
  primary_street TEXT,
  primary_city TEXT,
  primary_state TEXT,
  primary_zip TEXT,
  primary_start TEXT,
  primary_end TEXT,
  second_street TEXT,
  second_city TEXT,
  second_state TEXT,
  second_zip TEXT,
  second_start TEXT,
  second_end TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Uploaded Tax Documents Table
CREATE TABLE IF NOT EXISTS documents (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL,
  original_name TEXT NOT NULL,
  stored_name TEXT NOT NULL,
  file_url TEXT,
  file_size TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tax Summary & Computation Table
CREATE TABLE IF NOT EXISTS tax_summaries (
  user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  tax_year TEXT DEFAULT 'AY 2025-26',
  filing_status TEXT,
  total_income TEXT,
  adjustments TEXT,
  agi TEXT,
  deductions TEXT,
  taxable_income TEXT,
  federal_tax TEXT,
  withheld TEXT,
  estimated_refund TEXT,
  preparer_fee TEXT,
  fee_paid INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Documents In Review',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Finalized Tax Returns Table
CREATE TABLE IF NOT EXISTS tax_returns (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  form_title TEXT NOT NULL,
  return_type TEXT NOT NULL,
  tax_year TEXT NOT NULL,
  status TEXT DEFAULT 'Ready for E-Verification',
  file_url TEXT,
  file_size TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Permissive for authenticated application access
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxpayer_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE spouse_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE dependents ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE address_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tax_returns ENABLE ROW LEVEL SECURITY;

-- Allow public access with anon key (can be customized per your security requirements)
CREATE POLICY "Public full access to users" ON users FOR ALL USING (true);
CREATE POLICY "Public full access to taxpayer_info" ON taxpayer_info FOR ALL USING (true);
CREATE POLICY "Public full access to spouse_info" ON spouse_info FOR ALL USING (true);
CREATE POLICY "Public full access to dependents" ON dependents FOR ALL USING (true);
CREATE POLICY "Public full access to schedule_notes" ON schedule_notes FOR ALL USING (true);
CREATE POLICY "Public full access to address_history" ON address_history FOR ALL USING (true);
CREATE POLICY "Public full access to documents" ON documents FOR ALL USING (true);
CREATE POLICY "Public full access to tax_summaries" ON tax_summaries FOR ALL USING (true);
CREATE POLICY "Public full access to tax_returns" ON tax_returns FOR ALL USING (true);

-- 10. Supabase Storage Bucket for Tax Slips (Form 16, AIS, etc.)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('tax-documents', 'tax-documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Allow public uploads to tax-documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'tax-documents');

CREATE POLICY "Allow public downloads from tax-documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'tax-documents');
