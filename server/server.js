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
  const userId = parseInt(token, 10);
  return isNaN(userId) ? null : userId;
};

const requireAuth = (req, res, next) => {
  const userId = getUserIdFromHeader(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  const user = db.prepare('SELECT id, email, name, phone, file_no, status, role FROM users WHERE id = ?').get(userId);
  if (!user) {
    return res.status(401).json({ error: 'User session not found.' });
  }
  req.user = user;
  next();
};

const requireAdmin = (req, res, next) => {
  const userId = getUserIdFromHeader(req);
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized. Please login.' });
  }
  const user = db.prepare('SELECT id, email, name, phone, file_no, status, role FROM users WHERE id = ?').get(userId);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Administrator access required.' });
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
    INSERT INTO users (name, email, phone, password, file_no, status, role)
    VALUES (?, ?, ?, ?, ?, ?, 'client')
  `).run(name.trim(), email.toLowerCase().trim(), phone || '', password, fileNo, 'Profile Created');

  const newUser = db.prepare('SELECT id, email, name, phone, file_no, status, role FROM users WHERE id = ?').get(info.lastInsertRowid);
  res.json({ success: true, user: newUser, token: String(newUser.id) });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.prepare('SELECT id, email, name, phone, file_no, status, role, password FROM users WHERE email = ?').get(email.toLowerCase().trim());
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

  stmt.run(req.user.id, taxYear || '2026', preferredDate || '', preferredTime || '', notes || '');
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
    INSERT INTO documents (user_id, doc_type, file_name, stored_name, file_size, status, validation_status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
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
        validation_status: 'pending',
        created_at: new Date().toISOString()
      });
    });

    // Update user status to Documents Uploaded
    db.prepare("UPDATE users SET status = 'Documents Uploaded' WHERE id = ? AND status != 'Documents Verified'").run(req.user.id);
  });

  tx();
  res.json({ success: true, documents: inserted });
});

app.delete('/api/documents/:id', requireAuth, (req, res) => {
  const doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' });
  }

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
  let doc;
  if (req.user.role === 'admin') {
    doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(req.params.id);
  } else {
    doc = db.prepare('SELECT * FROM documents WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  }

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
   ADMIN ROUTES (Client queue, Dossier 360, Document Validation)
   ======================================================== */

// 1. List all clients with filing statistics & doc counts
app.get('/api/admin/clients', requireAdmin, (req, res) => {
  const clients = db.prepare(`
    SELECT 
      u.id, u.name, u.email, u.phone, u.file_no, u.status, u.role, u.created_at,
      ti.filing_status, ti.employer, ti.ssn_itin,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id) AS total_docs,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.validation_status = 'approved') AS approved_docs,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND (d.validation_status = 'pending' OR d.validation_status IS NULL)) AS pending_docs,
      (SELECT COUNT(*) FROM documents d WHERE d.user_id = u.id AND d.validation_status = 'rejected') AS rejected_docs
    FROM users u
    LEFT JOIN taxpayer_info ti ON ti.user_id = u.id
    WHERE u.role = 'client'
    ORDER BY u.created_at DESC
  `).all();

  res.json({ success: true, data: clients });
});

// 2. Full 360° Client Dossier
app.get('/api/admin/clients/:id', requireAdmin, (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const clientUser = db.prepare('SELECT id, name, email, phone, file_no, status, role, created_at FROM users WHERE id = ?').get(clientId);
  
  if (!clientUser) {
    return res.status(404).json({ error: 'Client not found.' });
  }

  const taxpayer = db.prepare('SELECT * FROM taxpayer_info WHERE user_id = ?').get(clientId) || null;
  const spouse = db.prepare('SELECT * FROM spouse_info WHERE user_id = ?').get(clientId) || null;
  const dependents = db.prepare('SELECT * FROM dependents WHERE user_id = ? ORDER BY id ASC').all(clientId);
  const address = db.prepare('SELECT * FROM address_history WHERE user_id = ?').get(clientId) || null;
  const schedule = db.prepare('SELECT * FROM schedule_notes WHERE user_id = ?').get(clientId) || null;
  const documents = db.prepare('SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC').all(clientId);
  const taxSummary = db.prepare('SELECT * FROM tax_summaries WHERE user_id = ? ORDER BY id DESC LIMIT 1').get(clientId) || null;
  const taxReturns = db.prepare('SELECT * FROM tax_returns WHERE user_id = ? ORDER BY id ASC').all(clientId);
  const reviewerNotes = db.prepare('SELECT * FROM reviewer_notes WHERE user_id = ? ORDER BY created_at DESC').all(clientId);

  res.json({
    success: true,
    data: {
      client: clientUser,
      taxpayer,
      spouse,
      dependents,
      address,
      schedule,
      documents,
      taxSummary,
      taxReturns,
      reviewerNotes
    }
  });
});

// 3. Document validation / rejection
app.patch('/api/admin/documents/:docId/validate', requireAdmin, (req, res) => {
  const docId = parseInt(req.params.docId, 10);
  const { validation_status, rejection_reason } = req.body;

  if (!['approved', 'rejected', 'pending'].includes(validation_status)) {
    return res.status(400).json({ error: 'Invalid validation status. Must be approved, rejected, or pending.' });
  }

  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found.' });
  }

  let statusText = 'Uploaded - Ready for Preparer Review';
  if (validation_status === 'approved') {
    statusText = 'Verified & Approved';
  } else if (validation_status === 'rejected') {
    statusText = 'Action Required / Re-upload Requested';
  }

  db.prepare(`
    UPDATE documents SET
      validation_status = ?,
      rejection_reason = ?,
      status = ?,
      verified_by = ?,
      verified_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    validation_status,
    rejection_reason || null,
    statusText,
    req.user.name,
    docId
  );

  // Auto-check if all docs are approved for the client to suggest status update
  const clientDocs = db.prepare('SELECT validation_status FROM documents WHERE user_id = ?').all(doc.user_id);
  const allApproved = clientDocs.length > 0 && clientDocs.every(d => d.validation_status === 'approved');
  const hasRejected = clientDocs.some(d => d.validation_status === 'rejected');

  if (hasRejected) {
    db.prepare("UPDATE users SET status = 'Action Required (Docs)' WHERE id = ?").run(doc.user_id);
  } else if (allApproved) {
    db.prepare("UPDATE users SET status = 'Documents Verified' WHERE id = ?").run(doc.user_id);
  }

  const updatedDoc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);
  res.json({ success: true, document: updatedDoc });
});

// 4. In-browser inline view for previewer modal (PDF / Image)
app.get('/api/admin/documents/:docId/view', requireAdmin, (req, res) => {
  const docId = parseInt(req.params.docId, 10);
  const doc = db.prepare('SELECT * FROM documents WHERE id = ?').get(docId);

  if (!doc) {
    return res.status(404).send('Document not found');
  }

  const filePath = path.join(uploadsDir, doc.stored_name);
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Document file missing from server storage');
  }

  const ext = path.extname(doc.file_name).toLowerCase();
  let contentType = 'application/octet-stream';
  if (ext === '.pdf') contentType = 'application/pdf';
  else if (ext === '.png') contentType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';

  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${doc.file_name}"`);
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// 5. Update client filing status
app.patch('/api/admin/clients/:id/status', requireAdmin, (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  db.prepare('UPDATE users SET status = ? WHERE id = ?').run(status, clientId);

  // Add automatic internal audit note
  db.prepare(`
    INSERT INTO reviewer_notes (user_id, admin_name, note, note_type)
    VALUES (?, ?, ?, 'status_change')
  `).run(clientId, req.user.name, `Filing status changed to: ${status}`);

  res.json({ success: true, status });
});

// 6. Reviewer notes
app.get('/api/admin/clients/:id/notes', requireAdmin, (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const notes = db.prepare('SELECT * FROM reviewer_notes WHERE user_id = ? ORDER BY created_at DESC').all(clientId);
  res.json({ success: true, data: notes });
});

app.post('/api/admin/clients/:id/notes', requireAdmin, (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const { note, note_type } = req.body;

  if (!note || !note.trim()) {
    return res.status(400).json({ error: 'Note content cannot be empty.' });
  }

  const result = db.prepare(`
    INSERT INTO reviewer_notes (user_id, admin_name, note, note_type)
    VALUES (?, ?, ?, ?)
  `).run(clientId, req.user.name, note.trim(), note_type || 'general');

  const newNote = db.prepare('SELECT * FROM reviewer_notes WHERE id = ?').get(result.lastInsertRowid);
  res.json({ success: true, data: newNote });
});

// 7. Preparer draft tax summary creation / update
app.post('/api/admin/clients/:id/tax-summary', requireAdmin, (req, res) => {
  const clientId = parseInt(req.params.id, 10);
  const d = req.body;

  const stmt = db.prepare(`
    INSERT INTO tax_summaries (
      user_id, tax_year, filing_status, total_income, adjustments, agi,
      deductions, taxable_income, federal_tax, withheld, estimated_refund,
      state_breakdown_json, preparer_fee, status, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  stmt.run(
    clientId,
    d.tax_year || '2026',
    d.filing_status || 'Single',
    d.total_income || '$0',
    d.adjustments || '$0',
    d.agi || '$0',
    d.deductions || '$14,600',
    d.taxable_income || '$0',
    d.federal_tax || '$0',
    d.withheld || '$0',
    d.estimated_refund || '$0',
    d.state_breakdown_json || '[]',
    d.preparer_fee || '$149',
    d.status || 'Ready for Client Review'
  );

  res.json({ success: true, message: 'Tax summary updated for client.' });
});

/* ========================================================
   TAX SUMMARY & RETURNS ROUTES (CLIENT FACING)
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
