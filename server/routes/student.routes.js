const express = require("express");
const router = express.Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const { branch, year } = req.query;

    console.log("QUERY:", branch, year);

    if (!branch || !year) {
      return res.status(400).json({ error: "Branch and year required" });
    }

    const [rows] = await db.query(
      `SELECT id, full_name 
       FROM users 
       WHERE role = 'student' 
       AND branch = ? 
       AND year = ?`,
      [branch, year]
    );

    console.log("STUDENTS:", rows);

    res.json(rows);

  } catch (err) {
    console.error("GET STUDENTS ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});


/* =========================
   SAVE ATTENDANCE (FINAL FIXED 🔥)
========================= */
router.post("/", async (req, res) => {
  try {
    console.log("🔥 POST HIT");

    const records = req.body;
    console.log("RECEIVED ATTENDANCE:", records);

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    for (let r of records) {

      const {
        student_id,
        teacher_id,
        branch,
        year,
        subject,
        status,
        date
      } = r;

      if (!student_id || !teacher_id || !branch || !year || !subject) {
        console.log("❌ INVALID RECORD:", r);
        continue;
      }

      const time = new Date().toTimeString().split(" ")[0];

      await db.query(
        `INSERT INTO attendance 
        (student_id, teacher_id, branch, year, subject, status, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          Number(student_id),
          Number(teacher_id),
          branch,
          year,
          subject,
          status,
          date,
          time
        ]
      );
    }

    res.json({ success: true });

  } catch (err) {
    console.error("❌ SAVE ATTENDANCE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


/* =========================
   GET STUDENT ATTENDANCE
========================= */
router.get("/student/:id", async (req, res) => {
  try {
    const studentId = req.params.id;

    const [rows] = await db.query(
      `SELECT status, date FROM attendance WHERE student_id = ?`,
      [studentId]
    );

    const total = rows.length;
    const present = rows.filter(r => r.status === "present").length;
    const absent = rows.filter(r => r.status === "absent").length;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    const absentDates = rows
      .filter(r => r.status === "absent")
      .map(r => r.date);

    res.json({
      total,
      present,
      absent,
      percentage,
      absentDates
    });

  } catch (err) {
    console.error("FETCH ATTENDANCE ERROR:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});


/* =========================
   PRINCIPAL REPORT (OLD)
========================= */
router.get("/report", async (req, res) => {
  try {
    const { branch, year, from, to } = req.query;

    console.log("REPORT QUERY:", branch, year, from, to);

    if (!branch || !year) {
      return res.status(400).json({ error: "Branch & year required" });
    }

    let sql = `
      SELECT status, date 
      FROM attendance 
      WHERE branch = ? AND year = ?
    `;

    const params = [branch, year];

    if (from && to) {
      sql += " AND date BETWEEN ? AND ?";
      params.push(from, to);
    }

    const [rows] = await db.query(sql, params);

    const total = rows.length;
    const present = rows.filter(r => r.status === "present").length;
    const absent = rows.filter(r => r.status === "absent").length;

    const percentage =
      total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    res.json({ total, present, absent, percentage });

  } catch (err) {
    console.error("REPORT ERROR:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
});


/* =========================
   PRINCIPAL SMART REPORT (FINAL FIXED 🔥)
========================= */
router.get("/principal-report", async (req, res) => {
  try {
    const { branch, year, studentId, type, from, to } = req.query;

    if (!branch || !year) {
      return res.status(400).json({ error: "Branch & year required" });
    }

    let sql = `
      SELECT student_id, status, date 
      FROM attendance 
      WHERE branch = ? AND year = ?
    `;

    const params = [branch, year];

    if (studentId) {
      sql += " AND student_id = ?";
      params.push(studentId);
    }

    if (type === "monthly") {
      sql += " AND MONTH(date) = MONTH(CURDATE()) AND YEAR(date)=YEAR(CURDATE())";
    }

    else if (type === "weekly") {
      sql += " AND YEARWEEK(date, 1) = YEARWEEK(CURDATE(), 1)";
    }

    else if (type === "yearly") {
      sql += " AND YEAR(date) = YEAR(CURDATE())";
    }

    else if (type === "custom" && from && to) {
      sql += " AND date BETWEEN ? AND ?";
      params.push(from, to);
    }

    const [rows] = await db.query(sql, params);

    if (rows.length === 0) {
      return res.json({
        total: 0,
        present: 0,
        absent: 0,
        percentage: 0
      });
    }

    // ✅ FINAL CORRECT LOGIC

    const uniqueDates = [...new Set(rows.map(r => r.date))];
    const totalClasses = uniqueDates.length;

    const totalRecords = rows.length;
    const totalPresent = rows.filter(r => r.status === "present").length;
    const totalAbsent = rows.filter(r => r.status === "absent").length;

    const presentPerClass = totalClasses === 0 ? 0 : (totalPresent / totalClasses);
    const absentPerClass = totalClasses === 0 ? 0 : (totalAbsent / totalClasses);

    const percentage =
      totalRecords === 0
        ? 0
        : ((totalPresent / totalRecords) * 100).toFixed(2);

    res.json({
      total: totalClasses,
      present: presentPerClass.toFixed(2),
      absent: absentPerClass.toFixed(2),
      percentage
    });

  } catch (err) {
    console.error("PRINCIPAL REPORT ERROR:", err);
    res.status(500).json({ error: "Report error" });
  }
});


/* =========================
   LOW ATTENDANCE STUDENTS (NEW 🔥)
========================= */
router.get("/low-attendance", async (req, res) => {
  try {
    const { branch, year } = req.query;

    if (!branch || !year) {
      return res.status(400).json({ error: "Branch & year required" });
    }

    const [students] = await db.query(
      `SELECT id, full_name 
       FROM users 
       WHERE role='student' AND branch=? AND year=?`,
      [branch, year]
    );

    const result = [];

    for (let s of students) {

      const [records] = await db.query(
        `SELECT status FROM attendance WHERE student_id=?`,
        [s.id]
      );

      const total = records.length;
      const present = records.filter(r => r.status === "present").length;

      const percentage =
        total === 0 ? 0 : ((present / total) * 100);

      if (percentage < 75) {
        result.push({
          id: s.id,
          name: s.full_name,
          percentage: percentage.toFixed(2)
        });
      }
    }

    res.json(result);

  } catch (err) {
    console.error("LOW ATTENDANCE ERROR:", err);
    res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;