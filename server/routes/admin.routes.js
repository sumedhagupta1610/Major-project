const express = require("express");
const router = express.Router();
const db = require("../db");

// =======================
// SAFE EMAIL GENERATOR 🔥
// =======================
function generateEmail(fullName) {
  if (!fullName) {
    return "temp" + Date.now() + "@college.edu";
  }

  return (
    fullName.toLowerCase().replace(/\s+/g, ".") +
    Math.floor(100 + Math.random() * 900) +
    "@college.edu"
  );
}

// =======================
// PASSWORD GENERATOR
// =======================
function generatePassword() {
  return "Temp@" + Math.floor(1000 + Math.random() * 9000);
}

// =======================
// CREATE USER (FINAL FIX 🔥)
// =======================
router.post("/create-user", async (req, res) => {
  try {
    console.log("CREATE BODY:", req.body);

    const fullName = req.body.fullName || req.body.full_name || "";
    const role = req.body.role;
    const branch = req.body.branch || null;

    // ❌ EMPTY NAME CHECK
    if (!fullName.trim()) {
      return res.status(400).json({ error: "Name is required" });
    }

    // ✅ SAFE YEAR HANDLING
    let year = null;

    if (role === "student") {
      if (req.body.years && req.body.years.length > 0) {
        year = req.body.years[0];
      } else if (req.body.year) {
        year = req.body.year;
      }
    }

    const email = generateEmail(fullName);
    const password = generatePassword();

    const [result] = await db.query(
      `INSERT INTO users (full_name, email, password, role, branch, year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fullName, email, password, role, branch, year]
    );

    console.log("INSERT RESULT:", result);

    // ✅ FIX: SEND EMAIL + PASSWORD TO FRONTEND
    res.json({
      success: true,
      insertedId: result.insertId,
      email: email,
      password: password
    });

  } catch (err) {
    console.error("CREATE ERROR:", err);
    res.status(500).json({ error: "Create failed" });
  }
});

// =======================
// FETCH USERS
// =======================
router.get("/users", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM users ORDER BY id DESC");

    console.log("USERS:", rows);

    res.json({ users: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// =======================
// DELETE USER
// =======================
router.delete("/users/:id", async (req, res) => {
  try {
    await db.query("DELETE FROM users WHERE id=?", [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// =======================
// UPDATE USER
// =======================
router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const fullName = req.body.full_name || req.body.fullName || "";
    const role = req.body.role;
    const branch = req.body.branch || null;
    const year = req.body.year || null;

    if (!fullName.trim()) {
      return res.status(400).json({ error: "Name required" });
    }

    const email = generateEmail(fullName);

    await db.query(
      `UPDATE users 
       SET full_name=?, role=?, branch=?, year=?, email=? 
       WHERE id=?`,
      [fullName, role, branch, year, email, id]
    );

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

module.exports = router;