const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ---------- DATABASE ----------
const db = new sqlite3.Database("database.db");

// ---------- TABLES ----------

// Attendance: subject-wise
db.run(`
  CREATE TABLE IF NOT EXISTS attendance (
    student_id TEXT,
    subject TEXT,
    percentage REAL
  )
`);

// CGPA: final result per student
db.run(`
  CREATE TABLE IF NOT EXISTS cgpa (
    student_id TEXT PRIMARY KEY,
    total_credits INTEGER,
    cgpa REAL
  )
`);

// ---------- ATTENDANCE API ----------

// Save attendance
app.post("/attendance", (req, res) => {
  const { student_id, subject, percentage } = req.body;

  db.run(
    "INSERT INTO attendance VALUES (?, ?, ?)",
    [student_id, subject, Number(percentage)],
    () => res.json({ message: "Attendance saved" })
  );
});

// Fetch attendance (used by dashboard)
app.get("/attendance/:id", (req, res) => {
  const id = req.params.id;

  db.all(
    "SELECT subject, percentage FROM attendance WHERE student_id=?",
    [id],
    (err, rows) => {
      res.json(rows || []);
    }
  );
});

// ---------- CGPA API ----------

// Save CGPA (calculated on frontend)
app.post("/cgpa", (req, res) => {
  const { student_id, totalCredits, cgpa } = req.body;

  db.run(
    "INSERT OR REPLACE INTO cgpa VALUES (?, ?, ?)",
    [student_id, Number(totalCredits), Number(cgpa)],
    () => res.json({ message: "CGPA saved" })
  );
});

// Fetch CGPA (used by dashboard)
app.get("/cgpa/:id", (req, res) => {
  const id = req.params.id;

  db.get(
    "SELECT total_credits, cgpa FROM cgpa WHERE student_id=?",
    [id],
    (err, row) => {
      res.json(row || {});
    }
  );
});

// ---------- DASHBOARD API ----------

// Fetch attendance + CGPA together
app.get("/dashboard/:id", (req, res) => {
  const id = req.params.id;

  db.all(
    "SELECT subject, percentage FROM attendance WHERE student_id=?",
    [id],
    (err, attendanceRows) => {

      db.get(
        "SELECT total_credits, cgpa FROM cgpa WHERE student_id=?",
        [id],
        (err2, cgpaRow) => {

          res.json({
            attendance: attendanceRows || [],
            cgpa: cgpaRow?.cgpa || "N/A",
            credits: cgpaRow?.total_credits || "N/A"
          });
        }
      );
    }
  );
});

// ---------- SERVER ----------
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});