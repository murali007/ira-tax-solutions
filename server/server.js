import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db, { uploadsDir } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup Multer for secure file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const allowed = /pdf|jpg|jpeg|png/i;
    const ext = path.extname(file.originalname).slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG files are accepted.'));
    }
  }
});

// Middleware to extract user from Authorization header
const getUserIdFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!token) return null;
  // Token is simply user_id or encoded string in this session model
  const userId = parseInt(token, 10);
  return isNaN(userId) ? null : userId;
};

const requireAuth = (req, res, next) => {
  const userId = getUserIdFromHeader(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  const user = db.prepare('SELECT id, email, name, phone, file_no, status FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(401).json({ error: 'User session not found.' });
  }
  req.user = user;
  next();
};

/* ========================================================
   AUTH ROUTES
   ======================================================== */
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists.' });
  }

  const currentYear = new Date().getFullYear();
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const fileNo = `IRA-${currentYear}-${randNum}`;

  const info = db.prepare(`
    INSERT INTO users (name, email, phone, password, file_no, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(name.trim(), email.toLowerCase().trim(), phone || '', password, fileNo, 'Profile Created');

  const newUser = db.prepare('SELECT id, email, name, phone, file_no, status FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.json({ success: true, user: newUser, token: String(newUser.id) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT id, email, name, phone, file_no, status, password FROM users WHERE email = ?').get(email.toLowerCase().trim());
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const { password: _, ...safeUser } = user;
  res.json({ success: true, user: safeUser, token: String(safeUser.id) });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

/* ========================================================
   TAXPAYER INFO ROUTES
   ======================================================== */
app.get('/api/taxpayer', requireAuth, (req, res) => {
  const info = db.prepare('SELECT * FROM taxpayer_info WHERE user_id = ?').get(req.user.id);
  res.json({ data: info || null });
});

app.post('/api/taxpayer', requireAuth, (req, res) => {
  const d = req.body;
  const stmt = db.prepare(`
    INSERT INTO taxpayer_info (
      user_id, first_name, middle_name, last_name, gender, ssn_itin, dob, employer,
      occupation, visa_type, contact_number, alternate_number, time_zone, citizenship,
      own_home, filing_status, email, street_address, city, country, state, zip_code, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
    ON CONFLICT(user_id) DO UPDATE SET
      first_name=excluded.first_name, middle_name=excluded.middle_name, last_name=excluded.last_name,
      gender=excluded.gender, ssn_itin=excluded.ssn_itin, dob=excluded.dob, employer=excluded.employer,
      occupation=excluded.occupation, visa_type=excluded.visa_type, contact_number=excluded.contact_number,
      alternate_number=excluded.alternate_number, time_zone=excluded.time_zone, citizenship=excluded.citizenship,
      own_home=excluded.own_home, filing_status=excluded.filing_status, email=excluded.email,
      street_address=excluded.street_address, city=excluded.city, country=excluded.country,
      state=excluded.state, zip_code=excluded.zip_code, updated_at=CURRENT_TIMESTAMP
  `);

  stmt.run(
    req.user.id,
    d.firstName || '', d.middleName || '', d.lastName || '', d.gender || '', d.ssnItin || '', d.dob || '', d.employer || '',
    d.occupation || '', d.visaType || '', d.contactNumber || '', d.alternateNumber || '', d.timeZone || '', d.citizenship || '',
    d.ownHome || '', d.filingStatus || '', d.email || '', d.streetAddress || '', d.city || '', d.country || '', d.state || '', d.zipCode || ''
  );

  // Update user status
  db.prepare('UPDATE users SET status = ? WHERE id = ?').run('Taxpayer Info Completed', req.user.id);

  res.json({ success: true, message: 'Taxpayer info saved to database.' });
});

/* ========================================================
   SPOUSE INFO ROUTES
   ======================================================== */
app.get('/api/spouse', requireAuth, (req, res) => {
  const info = db.prepare('SELECT * FROM spouse_info WHERE user_id = ?').get(req.user.id);
  res.json({ data: info || null });
});

app.post('/api/spouse', requireAuth, (req, res) => {
  const d = req.body;
  const stmt = db.prepare(`
    INSERT INTO spouse_info (
      user_id, has_spouse, first_name, middle_name, last_name, gender, dob, occupation, visa_type, tax_id_type, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      has_spouse=excluded.has_spouse, first_name=excluded.first_name, middle_name=excluded.middle_name,
      last_name=excluded.last_name, gender=excluded.gender, dob=excluded.dob, occupation=excluded.occupation,
      visa_type=excluded.visa_type, tax_id_type=excluded.tax_id_type, updated_at=CURRENT_TIMESTAMP
  `);

  stmt.run(
    req.user.id,
    d.hasSpouse || 'no', d.firstName || '', d.middleName || '', d.lastName || '',
    d.gender || '', d.dob || '', d.occupation || '', d.visaType || '', d.taxIdType || ''
  );

  res.json({ success: true, message: 'Spouse info saved to database.' });
});

/* ========================================================
   DEPENDENTS ROUTES
   ======================================================== */
app.get('/api/dependents', requireAuth, (req, res) => {
  const deps = db.prepare('SELECT * FROM dependents WHERE user_id = ? ORDER BY id ASC').all(req.user.id);
  res.json({ data: deps });
});

app.post('/api/dependents', requireAuth, (req, res) => {
  const { dependents } = req.body;
  if (!Array.isArray(dependents)) {
    return res.status(400).json({ error: 'Expected array of dependents.' });
  }

  // Replace all dependents for this user in transaction
  const insertStmt = db.prepare(`
    INSERT INTO dependents (
      user_id, first_name, middle_name, last_name, gender, dob, relationship,
      visa_type, tax_id_type, days_2025, days_2024, days_2023
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const tx = db.transaction((list) => {
    db.prepare('DELETE FROM dependents WHERE user_id = ?').run(req.user.id);
    for (const dep of list) {
      if (dep.firstName || dep.lastName) {
        insertStmt.run(
          req.user.id,
          dep.firstName || '', dep.middleName || '', dep.lastName || '', dep.gender || 'Male',
          dep.dob || '', dep.relationship || '', dep.visaType || '', dep.taxIdType || '',
          dep.days2025 || '', dep.days2024 || '', dep.days2023 || ''
        );
      }
    }
  });

  tx(dependents);
  res.json({ success: true, message: 'Dependents saved to database.' });
});

/* ========================================================
   SCHEDULE & NOTES ROUTES
   ======================================================== */
app.get('/api/schedule', requireAuth, (req, res) => {
  const info = db.prepare('SELECT * FROM schedule_notes WHERE user_id = ?').get(req.user.id);
  res.json({ data: info || null });
});

app.post('/api/schedule', requireAuth, (req, res) => {
  const { taxYear, preferredDate, preferredTime, notes } = req.body;
  const stmt = db.prepare(`
    INSERT INTO schedule_notes (user_id, tax_year, preferred_date, preferred_time, notes, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      tax_year=excluded.tax_year, preferred_date=excluded.preferred_date,
      preferred_time=excluded.preferred_time, notes=excluded.notes, updated_at=CURRENT_TIMESTAMP
  `);

  stmt.run(req.user.id, taxYear || '2025', preferredDate || '', preferredTime || '', notes || '');
  res.json({ success: true, message: 'Schedule notes saved to database.' });
});

/* ========================================================
   ADDRESS HISTORY ROUTES
   ======================================================== */
app.get('/api/address', requireAuth, (req, res) => {
  const info = db.prepare('SELECT * FROM address_history WHERE user_id = ?').get(req.user.id);
  res.json({ data: info || null });
});

app.post('/api/address', requireAuth, (req, res) => {
  const { addressData, movedDuringYear } = req.body;
  const d = addressData || {};
  const stmt = db.prepare(`
    INSERT INTO address_history (
      user_id, moved_during_year, primary_street, primary_city, primary_state, primary_zip,
      primary_start, primary_end, second_street, second_city, second_state, second_zip,
      second_start, second_end, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      moved_during_year=excluded.moved_during_year, primary_street=excluded.primary_street,
      primary_city=excluded.primary_city, primary_state=excluded.primary_state, primary_zip=excluded.primary_zip,
      primary_start=excluded.primary_start, primary_end=excluded.primary_end, second_street=excluded.second_street,
      second_city=excluded.second_city, second_state=excluded.second_state, second_zip=excluded.second_zip,
      second_start=excluded.second_start, second_end=excluded.second_end, updated_at=CURRENT_TIMESTAMP
  `);

  stmt.run(
    req.user.id,
    movedDuringYear || 'no',
    d.primaryStreet || '', d.primaryCity || '', d.primaryState || '', d.primaryZip || '',
    d.primaryStartDate || '', d.primaryEndDate || '',
    d.secondStreet || '', d.secondCity || '', d.secondState || '', d.secondZip || '',
    d.secondStartDate || '', d.secondEndDate || ''
  );

  res.json({ success: true, message: 'Address records saved to database.' });
});

/* ========================================================
   DOCUMENTS ROUTES (Upload, List, Download, Delete)
   ======================================================== */
app.get('/api/documents', requireAuth, (req, res) => {
  const docs = db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json({ data: docs });
});

app.post('/api/documents/upload', requireAuth, upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files provided.' });
  }

  const docTypes = Array.isArray(req.body.docTypes) ? req.body.docTypes : [req.body.docTypes || 'Tax Supporting Document'];
  const insertStmt = db.prepare(`
    INSERT INTO documents (user_id, doc_type, file_name, stored_name, file_size, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const inserted = [];
  const tx = db.transaction(() => {
    req.files.forEach((file, index) => {
      const type = docTypes[index] || docTypes[0] || 'Tax Supporting Document';
      const sizeStr = `${(file.size / 1024).toFixed(0)} KB`;
      const result = insertStmt.run(
        req.user.id,
        type,
        file.originalname,
        file.filename,
        sizeStr,
        'Uploaded - Ready for Preparer Review'
      );
      inserted.push({
        id: result.lastInsertRowid,
        doc_type: type,
        file_name: file.originalname,
        file_size: sizeStr,
        status: 'Uploaded - Ready for Preparer Review',
        created_at: new Date().toISOString()
      });
    });
  });

  tx();
  res.json({ success: true, documents: inserted });
});

app.delete('/api/documents/:id', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  // Delete file from disk
  const filePath = path.join(uploadsDir, doc.stored_name);
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (e) {
      console.error('Error removing file:', e);
    }
  }

  db.prepare('DELETE FROM documents WHERE id = ?').run(doc.id);
  res.json({ success: true, message: 'Document removed.' });
});

app.get('/api/documents/download/:id', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  const filePath = path.join(uploadsDir, doc.stored_name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File missing from storage.' });
  }

  res.download(filePath, doc.file_name);
});

/* ========================================================
   TAX SUMMARY & RETURNS ROUTES
   ======================================================== */
app.get('/api/tax-summary', requireAuth, (req, res) => {
  const summary = db.prepare('SELECT * FROM tax_summaries WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(req.user.id);
  res.json({ data: summary || null });
});

app.post('/api/tax-summary/pay-fee', requireAuth, (req, res) => {
  db.prepare('UPDATE tax_summaries SET fee_paid = 1 WHERE user_id = ?').run(req.user.id);
  res.json({ success: true, message: 'Preparer fee marked as paid.' });
});

app.get('/api/tax-returns', requireAuth, (req, res) => {
  const returns = db.prepare('SELECT * FROM tax_returns WHERE user_id = ? ORDER BY id ASC').all(req.user.id);
  res.json({ data: returns });
});

app.listen(PORT, () => {
  console.log(`IRA Tax Solutions Database & API Server running on port ${PORT}`);
});
