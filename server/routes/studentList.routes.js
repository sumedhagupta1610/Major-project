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

    // 🔥 IMPORTANT
    res.json(rows);

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;