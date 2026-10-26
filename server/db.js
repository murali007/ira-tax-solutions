import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'tax_portal.db');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize tables with exact schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    file_no TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'New File',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS taxpayer_info (
    user_id INTEGER PRIMARY KEY,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    gender TEXT,
    ssn_itin TEXT,
    dob TEXT,
    employer TEXT,
    occupation TEXT,
    visa_type TEXT,
    contact_number TEXT,
    alternate_number TEXT,
    time_zone TEXT,
    citizenship TEXT,
    own_home TEXT,
    filing_status TEXT,
    email TEXT,
    street_address TEXT,
    city TEXT,
    country TEXT,
    state TEXT,
    zip_code TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS spouse_info (
    user_id INTEGER PRIMARY KEY,
    has_spouse TEXT DEFAULT 'no',
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    gender TEXT,
    dob TEXT,
    occupation TEXT,
    visa_type TEXT,
    tax_id_type TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS dependents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    first_name TEXT,
    middle_name TEXT,
    last_name TEXT,
    gender TEXT,
    dob TEXT,
    relationship TEXT,
    visa_type TEXT,
    tax_id_type TEXT,
    days_2025 TEXT,
    days_2024 TEXT,
    days_2023 TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS schedule_notes (
    user_id INTEGER PRIMARY KEY,
    tax_year TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    notes TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS address_history (
    user_id INTEGER PRIMARY KEY,
    moved_during_year TEXT,
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    doc_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    stored_name TEXT NOT NULL,
    file_size TEXT NOT NULL,
    status TEXT DEFAULT 'Uploaded - Awaiting Review',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tax_summaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tax_year TEXT NOT NULL,
    filing_status TEXT,
    total_income TEXT,
    adjustments TEXT,
    agi TEXT,
    deductions TEXT,
    taxable_income TEXT,
    federal_tax TEXT,
    withheld TEXT,
    estimated_refund TEXT,
    state_breakdown_json TEXT,
    preparer_fee TEXT,
    fee_paid INTEGER DEFAULT 0,
    status TEXT DEFAULT 'In Preparation',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS tax_returns (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    tax_year TEXT NOT NULL,
    form_title TEXT NOT NULL,
    return_type TEXT NOT NULL,
    status TEXT NOT NULL,
    file_size TEXT,
    stored_name TEXT,
    available INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
export { uploadsDir };
