const express = require("express");
const router = express.Router();

const db = require("../db");
const jwt = require("jsonwebtoken");

/* =========================
   ADMIN LOGIN
========================= */
router.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? AND role = 'admin' LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: "admin",
      message: "Admin login successful"
    });

  } catch (err) {
    console.error("ADMIN LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   NORMAL USER LOGIN
========================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🔥 IMPORTANT (FINAL RESPONSE)
    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        full_name: user.full_name,
        role: user.role,
        branch: user.branch,
        year: user.year
      }
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* =========================
   CHANGE PASSWORD
========================= */
router.post("/change-password-public", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  if (!email || !oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields required" });
  }

  try {
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    if (oldPassword !== user.password) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    await db.query(
      "UPDATE users SET password = ? WHERE email = ?",
      [newPassword, email]
    );

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;